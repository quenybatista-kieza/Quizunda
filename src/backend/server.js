const express = require("express");
const cors = require("cors");
const db = require('./db');
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require('fs')
const bcrypt = require("bcryptjs");
const router = express.Router();
const axios = require("axios");

const registerRoutes = require("./register.js");
const loginRoutes = require("./login.js");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))



// 🔹 Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// 🔹 Middleware de autenticação
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token não fornecido" });

    const decoded = jwt.verify(token, "segredo_super_seguranca");
    req.user = decoded;

    next();
  } catch (err) {
    console.error("Erro no middleware auth:", err);
    res.status(401).json({ error: "Token inválido" });
  }
};



// 🔹 Rotas de autenticação
app.use("/api", registerRoutes);
app.use("/api", loginRoutes);
app.use("/uploads", express.static("uploads"));


// 🔹 CRUD de cursos
app.get("/api/courses", auth, async (req, res) => {
  const [rows] = await db.query("SELECT * FROM courses WHERE ownerId = ?", [req.user.id]);
  res.json(rows);
});

// ---------------- CRIAR CURSO ----------------
app.post("/api/courses", auth, upload.single("thumbnail"), async (req, res) => {
  try {
    const { 
      title, 
      description, 
      price, 
      duration, 
      country, 
      account, 
      iban, 
      express_number, 
      details 
    } = req.body;

    const thumbnail = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title) return res.status(400).json({ error: "Título é obrigatório" });

    const [result] = await db.query(
      `INSERT INTO courses 
        (title, description, price, duration, country, thumbnail, account, iban, express_number, details, ownerId) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, 
        description || "", 
        parseFloat(price) || 0, 
        duration, 
        country || "", 
        thumbnail, 
        account || "", 
        iban || "", 
        express_number || "", 
        details || "", 
        req.user.id
      ]
    );

    const [course] = await db.query("SELECT * FROM courses WHERE id = ?", [result.insertId]);
    res.json(course[0]);
  } catch (err) {
    console.error("Erro ao criar curso:", err);
    res.status(500).json({ error: "Erro ao criar curso" });
  }
});


// ---------------- EDITAR CURSO ----------------
app.put("/api/courses/:id", auth, upload.single("thumbnail"), async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      price, 
      duration, 
      country, 
      account,
      iban,
      express_number,
      details
    } = req.body;

    const thumbnail = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await db.query(
      `UPDATE courses 
       SET title=?, description=?, price=?, duration=?, country=?, thumbnail=?, 
           account=?, iban=?, express_number=?, details=? 
       WHERE id=? AND ownerId=?`,
      [
        title, 
        description || "", 
        parseFloat(price) || 0, 
        duration, 
        country || "", 
        thumbnail, 
        account || "", 
        iban || "", 
        express_number || "", 
        details || "", 
        id, 
        req.user.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Curso não encontrado" });
    }

    const [course] = await db.query("SELECT * FROM courses WHERE id = ?", [id]);
    res.json(course[0]);
  } catch (err) {
    console.error("Erro ao atualizar curso:", err);
    res.status(500).json({ error: "Erro ao atualizar curso" });
  }
});



// eliminar cursos
app.delete("/api/courses/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Eliminar perguntas associadas às classes do curso
    await db.query(`
      DELETE FROM exam_questions
      WHERE roomId IN (
        SELECT id
        FROM exam_classes
        WHERE courseId = ?
      )
    `, [id]);

    // Eliminar classes do curso
    await db.query(
      "DELETE FROM exam_classes WHERE courseId = ?",
      [id]
    );

    // Eliminar materiais associados
    await db.query(
      "DELETE FROM support_materials WHERE courseId = ?",
      [id]
    );

    await db.query(
      "DELETE FROM complementary_materials WHERE courseId = ?",
      [id]
    );

    await db.query(
      "DELETE FROM video_lessons WHERE courseId = ?",
      [id]
    );

    await db.query(
      "DELETE FROM compras WHERE curso_id = ?",
      [id]
    );

    // Eliminar curso destacado (se existir essa tabela)
    await db.query(
      "DELETE FROM featured_courses WHERE courseId = ?",
      [id]
    ).catch(() => {});

    // Eliminar o curso
    const [result] = await db.query(
      "DELETE FROM courses WHERE id = ? AND ownerId = ?",
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Curso não encontrado ou não pertence ao utilizador"
      });
    }

    res.json({
      message: "Curso e todos os dados relacionados foram excluídos com sucesso!"
    });

  } catch (err) {
    console.error("Erro ao deletar curso:", err);

    res.status(500).json({
      error: err.message
    });
  }
});


// Upload Material de Apoio

app.post("/api/support-materials", auth, async (req, res) => {
  try {
    const { courseId, discipline, materialUrl } = req.body;

    // Validação simples
    if (!courseId || !discipline || !materialUrl) {
      return res.status(400).json({ error: "Campos obrigatórios: courseId, discipline, materialUrl" });
    }

    // Inserção na tabela support_materials
    const [result] = await db.query(
      `INSERT INTO support_materials 
        (courseId, discipline, materialUrl, ownerId) 
       VALUES (?, ?, ?, ?)`,
      [courseId, discipline, materialUrl, req.user.id]
    );

    // Buscar o registro salvo para retornar ao frontend
    const [saved] = await db.query("SELECT * FROM support_materials WHERE id = ?", [result.insertId]);

    res.status(201).json(saved[0]);
  } catch (err) {
    console.error("Erro ao criar material de apoio:", err);
    res.status(500).json({ error: "Erro ao criar material de apoio" });
  }
});

// Adicionar Matéria Complementar (sem upload de arquivos)
app.post("/api/complements", auth, async (req, res) => {
  try {
    const { courseId, disciplina, tema, materials } = req.body;

    if (!courseId || !disciplina || !tema) {
      return res.status(400).json({ error: "Campos obrigatórios: courseId, disciplina, tema" });
    }

    const [result] = await db.query(
      `INSERT INTO complementary_materials 
        (courseId, disciplina, tema, materials, ownerId) 
       VALUES (?, ?, ?, ?, ?)`,
      [courseId, disciplina, tema, materials || "", req.user.id]
    );

    res.json({ 
      id: result.insertId, 
      courseId, 
      disciplina, 
      tema, 
      materials 
    });
  } catch (err) {
    console.error("Erro ao adicionar matéria complementar:", err);
    res.status(500).json({ error: "Erro ao adicionar matéria complementar" });
  }
});

app.get('/api/perguntas', async (req, res) => {
  try {
    const [results] = await db.query(
      'SELECT * FROM exam_questions ORDER BY id DESC'
    );

    res.status(200).json(results);
  } catch (err) {
    console.error('Erro ao buscar perguntas:', err);

    res.status(500).json({
      message: 'Erro ao buscar perguntas'
    });
  }
});



// Criar sala de exame
app.post("/api/exam-classes", auth, async (req, res) => {
  try {
    const { courseId, roomName } = req.body;

    if (!courseId || !roomName) {
      return res.status(400).json({ error: "Campos obrigatórios: courseId, roomName" });
    }

    const [result] = await db.query(
      "INSERT INTO exam_classes (courseId, roomName, ownerId) VALUES (?, ?, ?)",
      [courseId, roomName, req.user.id]
    );

    const [room] = await db.query("SELECT * FROM exam_classes WHERE id = ?", [result.insertId]);
    res.status(201).json(room[0]);
  } catch (err) {
    console.error("Erro ao criar sala de exame:", err);
    res.status(500).json({ error: "Erro ao criar sala de exame" });
  }
});

// Listar salas de exame
app.get("/api/exam-classes", auth, async (req, res) => {
  try {
    const [rooms] = await db.query(
      "SELECT * FROM exam_classes WHERE ownerId = ?",
      [req.user.id]
    );
    res.json(rooms);
  } catch (err) {
    console.error("Erro ao listar salas de exame:", err);
    res.status(500).json({ error: "Erro ao listar salas de exame" });
  }
});

// Criar questão vinculada a uma sala de exame
app.post("/api/exam-questions", auth, async (req, res) => {
  console.log("REQ BODY:", req.body);

  try {
    const { 
      roomId, 
      question, 
      correctAnswer, 
      wrongAnswer1, 
      wrongAnswer2, 
      wrongAnswer3, 
      wrongAnswer4,
      tema,        // novo campo
      disciplina   // novo campo
    } = req.body;

    // 🔹 Validação mínima
    if (!roomId || !question || !correctAnswer) {
      return res.status(400).json({ 
        error: "Campos obrigatórios: roomId, question, correctAnswer" 
      });
    }

    // 🔹 Inserção segura com placeholders
    const [result] = await db.query(
      `INSERT INTO exam_questions 
        (roomId, question, correctAnswer, wrongAnswer1, wrongAnswer2, wrongAnswer3, wrongAnswer4, tema, disciplina, ownerId) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        roomId, 
        question, 
        correctAnswer, 
        wrongAnswer1 || "", 
        wrongAnswer2 || "", 
        wrongAnswer3 || "", 
        wrongAnswer4 || "", 
        tema || "",          
        disciplina || "",    
        req.user.id          // 🔹 pega o usuário autenticado
      ]
    );

    // 🔹 Buscar a questão recém-criada
    const [saved] = await db.query(
      "SELECT * FROM exam_questions WHERE id = ?", 
      [result.insertId]
    );

    res.status(201).json(saved[0]);
  } catch (err) {
    console.error("Erro ao criar questão:", err);
    res.status(500).json({ error: "Erro ao criar questão" });
  }
});


app.post("/api/video-lessons", auth, async (req, res) => {
  try {
    const { title, tema, disciplina, url, url_drive, courseId } = req.body;

    // 🔹 Validação simples
    if (!title || !tema || !disciplina || !url || !url_drive || !courseId) {
      return res.status(400).json({ 
        error: "Campos obrigatórios: title, tema, disciplina, url, url_drive, courseId" 
      });
    }

    // 🔹 Inserção na tabela com a nova coluna
    const [result] = await db.query(
      `INSERT INTO video_lessons 
        (title, tema, disciplina, url, url_drive, courseId, ownerID) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, tema, disciplina, url, url_drive, courseId, req.user.id] // ownerID vem do usuário autenticado
    );

    // 🔹 Retorno da resposta
    res.json({
      id: result.insertId,
      title,
      tema,
      disciplina,
      url,
      url_drive,
      courseId,
      ownerID: req.user.id
    });
  } catch (err) {
    console.error("Erro ao adicionar vídeo aula:", err);
    res.status(500).json({ error: "Erro ao adicionar vídeo aula" });
  }
});


// 🔹 Contagem de usuários (opcional)
app.get("/api/user-count", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM users");
    res.json({ count: rows[0].total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar número de usuários" });
  }
});

app.get("/api/pais", async (req, res) => {
  try {
    // Seleciona apenas países distintos da tabela cursos
    const [rows] = await db.query("SELECT DISTINCT country FROM courses ORDER BY country ASC");
    
    // Retorna como array de objetos [{ country: "Angola" }, { country: "Brasil" }, ...]
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar países:", err);
    res.status(500).json({ error: "Erro ao buscar países" });
  }
});

// Rota para listar materiais complementares
app.get("/api/materials", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(`
      SELECT DISTINCT
        cm.id,
        cm.tema,
        cm.disciplina,
        cm.materials
      FROM complementary_materials cm
      INNER JOIN compras cp
        ON cp.curso_id = cm.courseId
      WHERE cp.user_id = ?
      AND (
        cp.data_expiracao IS NULL
        OR cp.data_expiracao >= CURDATE()
      )
      ORDER BY cm.id DESC
    `, [userId]);

    res.json(rows);

  } catch (err) {
    console.error("Erro ao buscar materiais:", err);
    res.status(500).json({
      error: "Erro ao buscar materiais"
    });
  }
});

//Rota para listar as salas de exame!

app.get("/api/salas", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(`
      SELECT DISTINCT
        e.id AS examRoomId,
        e.roomName,
        c.title AS courseName
      FROM exam_classes e
      INNER JOIN courses c
        ON e.courseId = c.id
      INNER JOIN compras cp
        ON cp.curso_id = c.id
      WHERE cp.user_id = ?
      AND (
        cp.data_expiracao IS NULL
        OR cp.data_expiracao >= CURDATE()
      )
    `, [userId]);

    res.json(rows);

  } catch (err) {
    console.error("Erro ao buscar salas:", err);
    res.status(500).json({
      error: "Erro ao buscar salas"
    });
  }
});

// cursos
app.get("/api/cursos", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.title,
        c.id,
        c.description,
        c.price,
        c.duration,
        c.country,
        c.thumbnail,
        cc.payment_whatsapp
      FROM courses c
      LEFT JOIN course_contacts cc
        ON cc.course_id = c.id
    `);

    const formatted = rows.map(course => ({
      title: course.title,
      id: course.id,
      descrição: course.description,
      area: course.description,
      price: course.price,
      duration: course.duration,
      country: course.country,
      thumbnail: course.thumbnail,
      payment_whatsapp: course.payment_whatsapp
    }));

    res.json(formatted);

  } catch (err) {
    console.error("Erro ao buscar cursos:", err);
    res.status(500).json({ error: "Erro ao buscar cursos" });
  }
});
// rota para os cursos comprados
//esta é a rota dos cursos comprados que eu vou usar com API
app.post("/api/comprar", auth, async (req, res) => {
  try {
    const courseId = req.body.courseId;

    // 🔹 Verifica se o usuário é estudante
    if (req.user.role !== "estudante") {
      return res.status(403).json({ error: "Apenas estudantes podem comprar cursos." });
    }

    // 🔹 Insere compra com data de expiração de 1 ano
    await db.query(
      `INSERT INTO compras (curso_id, user_id, data_compra, data_expiracao) 
       VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR))`,
      [courseId, req.user.id]
    );

    res.json({ message: "Compra registrada com sucesso! Curso disponível por 1 ano." });
  } catch (err) {
    console.error("Erro interno:", err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});




// rota para pegar as perguntas

app.get("/api/exams/:examRoomId/questions", async(req, res) =>{
  
  try{

    await db.query('truncate table use_questions');
    

    const roomId = req.params.examRoomId;
         
    console.log(roomId)
    const [rows, fields] = await db.query( `SELECT q.id, q.question, q.wrongAnswer1 , q.wrongAnswer2 , q.wrongAnswer3 , q.wrongAnswer4 , q.correctAnswer , q.tema, q.disciplina
          FROM exam_questions q
          WHERE q.roomId = ${roomId}`);
    console.log(rows.length)
    // depois apagar a futura tabela com o truncate!

    // 2. Começa transiçao pra inserir na tabela destino
    await db.query('BEGIN')
    console.log("3. Iniciando cadastro na tabela 'use_questions'...")

    //codigo teste
    let inseridas = 0
    for (const row of rows) {
      await db.query(
        `INSERT INTO use_questions
         (questao, respostaCorreta, respostaErrada1, respostaErrada2, respostaErrada3, respostaErrada4, tema_p, disciplina_p)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [row.question, row.correctAnswer, row.wrongAnswer1, row.wrongAnswer2, row.wrongAnswer3, row.wrongAnswer4, row.tema, row.disciplina]
      )
      inseridas++
    }
   
    await db.query('COMMIT')
    console.log(`4. Sucesso: ${inseridas} questões migradas`)
    //codigo teste
  }catch(err){
    console.error("Este e o erro:",err)
  }
  
});

app.get("/api/compras", auth, async (req, res) => {
  try {
    console.log(req.user.id);

    const [rows] = await db.query(
      `SELECT c.id, c.title, c.description, cp.data_expiracao
       FROM compras cp
       INNER JOIN courses c ON cp.curso_id = c.id
       WHERE cp.user_id = ? AND cp.data_expiracao >= NOW()`,
      [req.user.id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar cursos comprados" });
  }
});


app.get("/api/detalhes_c/:id", auth, async (req, res) => {
  const cursoId = req.params.id;

  try {
    const [video_lessons] = await db.query(
      "SELECT * FROM video_lessons WHERE courseId = ?",
      [cursoId]
    );

    const [support_materials] = await db.query(
      "SELECT * FROM support_materials WHERE courseId = ?",
      [cursoId]
    );

    const [contact] = await db.query(
      `
      SELECT support_whatsapp
      FROM course_contacts
      WHERE course_id = ?
      LIMIT 1
      `,
      [cursoId]
    );

    res.json({
      video_lessons,
      support_materials,
      support_whatsapp:
        contact.length > 0
          ? contact[0].support_whatsapp
          : null
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erro no servidor"
    });
  }
});

app.get("/api/recuperar-senha", async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT
        id,
        nome,
        numeroouemail,
        sugerir_nova_senha
      FROM recuperar_senha
      ORDER BY id DESC
    `);

    res.json(rows);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Erro ao buscar registros"
    });
  }
});


// 2. FUNÇÃO PARA EMBARALHAR OPÇÕES
function embaralharOpcoes(pergunta) {
  const letras = ['A', 'B', 'C', 'D', 'E'];

  const opcoes = [
    { texto: pergunta.correctAnswer, correta: true },
    { texto: pergunta.optionA, correta: false },
    { texto: pergunta.optionB, correta: false },
    { texto: pergunta.optionC, correta: false },
    { texto: pergunta.optionD, correta: false },
  ];

  // Embaralha as 5 opções
  opcoes.sort(() => Math.random() - 0.5);

  // Descobre qual letra ficou a correta
  const indiceCorreta = opcoes.findIndex(op => op.correta);
  const respostaCorreta = letras[indiceCorreta];

  return {
    id: pergunta.id,
    question: pergunta.question,
    options: opcoes.map(op => op.texto), // array só com os textos
    correctAnswer: respostaCorreta, // A, B, C, D ou E
    disciplina_0: pergunta.disciplina_0, // 🔹 mantém a disciplina
    tema_0: pergunta.tema_0
  };
}


// 1. ROTA: Buscar perguntas aleatórias
// Ex: /api/perguntas?limit=20&disciplina=Matematica
app.get('/api/perguntas', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    const total = parseInt(req.query.limit) || 50;

    const distribuicao = total === 50
      ? { 'Biologia': 25, 'Química': 10, 'Física': 5, 'Língua Portuguesa': 5, 'Matemática': 5 }
      : { 'Biologia': 50, 'Química': 25, 'Matemática': 10, 'Física': 10, 'Língua Portuguesa': 5 };

    let todasPerguntas = [];

    for (const disciplina in distribuicao) {
      const qtd = distribuicao[disciplina];

      // 🔹 IDs já usados dessa disciplina
      const [usados] = await db.query(
        "SELECT question_id FROM used_questions WHERE disciplina = ?",
        [disciplina]
      );
      const idsUsados = usados.map(u => u.question_id);

      // 🔹 Verifica quantas questões existem no banco para essa disciplina
      const [totalDisponiveis] = await db.query(
        "SELECT COUNT(*) AS total FROM use_questions WHERE disciplina_p = ?",
        [disciplina]
      );

      // 🔹 Se já usamos todas, resetamos a tabela auxiliar
      if (idsUsados.length >= totalDisponiveis[0].total) {
        await db.query("DELETE FROM used_questions WHERE disciplina = ?", [disciplina]);
        idsUsados.length = 0; // limpa array local também
      }

      const sql = `
        SELECT
          id,
          questao AS question,
          respostaCorreta AS correctAnswer,
          respostaErrada1 AS optionA,
          respostaErrada2 AS optionB,
          respostaErrada3 AS optionC,
          respostaErrada4 AS optionD,
          disciplina_p As disciplina_0,
          tema_p AS tema_0
        FROM use_questions
        WHERE disciplina_p = ?
        ORDER BY RAND()
        LIMIT ${qtd}
      `;

      const [rows] = await db.query(sql, [disciplina]);
      console.log(`Achou ${rows.length} de ${disciplina}`);

      for (const r of rows) {
        await db.query(
          "INSERT INTO used_questions (disciplina, question_id) VALUES (?, ?)",
          [disciplina, r.id]
        );
      }


      const perguntasEmbaralhadas = rows.map(p => embaralharOpcoes(p));
      todasPerguntas = todasPerguntas.concat(perguntasEmbaralhadas);
    }

    res.json(todasPerguntas);

  } catch (err) {
    console.error("ERRO COMPLETO:", err);
    res.status(500).json({ error: err.message });
  }
});


app.post("/api/estatisticas", auth, async (req, res) => {
  try {
    const { estatisticas, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId é obrigatório" });
    }

    //apagar dados da tabela estatisticas!

    await db.query('truncate table estatisticas');

    // estatisticas é um objeto com várias disciplinas
    for (const disciplina in estatisticas) {
      const { acertos, erros } = estatisticas[disciplina];
      const total = acertos + erros;
      const percentual = total > 0 ? (acertos / total) * 100 : 0;

      await db.query(
        `INSERT INTO estatisticas 
          (user_id, disciplina, acertos, errados, total, percentual, data_registro) 
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [userId, disciplina, acertos, erros, total, percentual]
      );
    }

    res.json({ message: "Estatísticas salvas com sucesso" });
  } catch (err) {
    console.error("Erro ao salvar estatísticas:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});



// rota estatisticas.js
app.get("/api/estatisticas", auth, async (req, res) => {
  try {
    const user = req.user; // supondo que já tens middleware de autenticação
    if (!user) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const sql = `
      SELECT 
        disciplina,
        acertos,
        errados,
        total,
        percentual,
        data_registro
      FROM estatisticas
      WHERE user_id = ?
      ORDER BY data_registro DESC
    `;

    const [rows] = await db.query(sql, [user.id]);

    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar estatísticas:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

app.get("/api/videos/:id/download", auth, async (req, res) => {
  try {
    const videoId = req.params.id;

    // 1. Buscar o vídeo no banco de dados
    const [rows] = await db.query(
      `SELECT url, url_drive, disciplina, courseId
       FROM video_lessons
       WHERE id = ?`,
      [videoId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Vídeo não encontrado."
      });
    }

    const video = rows[0];

    if (!video.url_drive) {
      return res.status(404).json({
        message: "Este vídeo não tem um link do Google Drive."
      });
    }

    // 2. Validar a compra do curso
    const [compras] = await db.query(
      `SELECT data_expiracao
       FROM compras
       WHERE curso_id = ? AND user_id = ?`,
      [video.courseId, req.user.id]
    );

    if (compras.length === 0) {
      return res.status(403).json({
        message: "Curso não comprado."
      });
    }

    if (
      !compras[0].data_expiracao ||
      new Date(compras[0].data_expiracao) < new Date()
    ) {
      return res.status(403).json({
        message: "Acesso expirado. Renove o curso."
      });
    }

    // 3. Extrair o ID do ficheiro do Google Drive
    const match = video.url_drive.match(
      /\/file\/d\/([a-zA-Z0-9_-]+)|[?&]id=([a-zA-Z0-9_-]+)/
    );

    const driveId = match && (match[1] || match[2]);

    if (!driveId) {
      return res.status(400).json({
        message: "O link do Google Drive não é válido."
      });
    }

    // 4. Pedir o ficheiro real ao Google Drive
    const driveUrl =
      `https://drive.google.com/uc?export=download&id=${driveId}`;

    const driveResponse = await axios.get(driveUrl, {
      responseType: "stream",
      maxRedirects: 5,
      timeout: 120000,
      validateStatus: (status) => status >= 200 && status < 300
    });

    const contentType =
      driveResponse.headers["content-type"] || "";

    // Evitar enviar uma página HTML como se fosse um vídeo
    if (
      contentType.includes("text/html") ||
      contentType.includes("application/json")
    ) {
      driveResponse.data.destroy();

      return res.status(502).json({
        message:
          "O Google Drive não devolveu o vídeo. Verifica as permissões do ficheiro."
      });
    }

    // 5. Enviar o ficheiro ao navegador
    const safeName = `video-${videoId}.mp4`;

    res.setHeader(
      "Content-Type",
      contentType || "application/octet-stream"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeName}"`
    );

    if (driveResponse.headers["content-length"]) {
      res.setHeader(
        "Content-Length",
        driveResponse.headers["content-length"]
      );
    }

    driveResponse.data.on("error", (err) => {
      console.error("Erro na transmissão do vídeo:", err);

      if (!res.headersSent) {
        res.status(502).end("Erro ao transmitir o vídeo.");
      } else {
        res.destroy(err);
      }
    });

    driveResponse.data.pipe(res);

  } catch (err) {
    console.error("Erro ao descarregar vídeo:", err.message);

    if (!res.headersSent) {
      res.status(500).json({
        message: "Erro ao obter o ficheiro de vídeo."
      });
    } else {
      res.destroy(err);
    }
  }
});

// Rota para buscar apenas "details" de um curso
app.get("/api/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Consulta apenas a coluna "details"
    const [rows] = await db.query("SELECT details FROM courses WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Curso não encontrado" });
    }

    // Retorna apenas o campo details
    res.json({ details: rows[0].details });
  } catch (err) {
    console.error("Erro ao buscar detalhes do curso:", err);
    res.status(500).json({ error: "Erro ao buscar detalhes do curso" });
  }
});





app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Busca admin no banco
    const [rows] = await db.query("SELECT * FROM admin WHERE username = ?", [username]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const admin = rows[0];

    // Verifica senha com bcrypt
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    // Gera token JWT somente se senha for válida
    const token = jwt.sign(
      { id: admin.id, role: "admin", username: admin.username },
      process.env.JWT_SECRET || "segredo_jwt",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login realizado com sucesso!", token });
  } catch (err) {
    console.error("Erro interno:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

app.get("/api/courses_1", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM courses");
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar cursos:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});


// DELETE curso por ID (sem auth, elimina tudo relacionado)
app.delete("/api/courses_1/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 🔹 Primeiro eliminamos os dados relacionados ao curso
    await db.query(
      "DELETE FROM exam_questions WHERE roomId IN (SELECT id FROM exam_rooms WHERE courseId = ?)",
      [id]
    );
    await db.query("DELETE FROM exam_questions WHERE roomId IN (SELECT id FROM exam_rooms WHERE courseId = ?)", [id]);
    await db.query("DELETE FROM exam_classes WHERE courseId = ?", [id]);
    await db.query("DELETE FROM support_materials WHERE courseId = ?", [id]);
    await db.query("DELETE FROM complementary_materials WHERE courseId = ?", [id]);
    await db.query("DELETE FROM video_lessons WHERE courseId = ?", [id]);
    await db.query("DELETE FROM compras WHERE curso_id = ?", [id]);

    // 🔹 Agora eliminamos o curso
    const [result] = await db.query("DELETE FROM courses WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Curso não encontrado" });
    }

    res.json({ message: "Curso e todos os dados relacionados foram excluídos com sucesso!" });
  } catch (err) {
    console.error("Erro ao deletar curso:", err);
    res.status(500).json({ error: "Erro ao excluir curso e dados relacionados" });
  }
});


app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});



app.post("/api/users", async (req, res) => {
  try {
    const { name, password, accountType, emailOrPhone } = req.body;

    // 🔑 Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 role definido automaticamente com base no accountType
    const role = accountType === "estudante" ? "Estudante" : "Preparatório";

    const [result] = await db.query(
      "INSERT INTO users (name, password, accountType, role, emailOrPhone) VALUES (?, ?, ?, ?, ?)",
      [name, hashedPassword, accountType, role, emailOrPhone]
    );

    res.json({
      id: result.insertId,
      name,
      accountType,
      role,
      emailOrPhone,
      // ⚠️ nunca retornar a senha real ou hash na resposta
      message: "Usuário cadastrado com sucesso!"
    });
  } catch (err) {
    console.error("Erro ao cadastrar usuário:", err);
    res.status(500).json({ error: "Erro interno ao cadastrar usuário" });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password, accountType, emailOrPhone } = req.body;

    // 🔑 Criptografa a senha antes de salvar (se fornecida)
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const role = accountType === "estudante" ? "Estudante" : "Preparatório";

    const [result] = await db.query(
      "UPDATE users SET name = ?, password = ?, accountType = ?, role = ?, emailOrPhone = ? WHERE id = ?",
      [name, hashedPassword, accountType, role, emailOrPhone, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({
      id,
      name,
      accountType,
      role,
      emailOrPhone,
      message: "Usuário atualizado com sucesso!"
    });
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err);
    res.status(500).json({ error: "Erro interno ao atualizar usuário" });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({ message: "Usuário eliminado com sucesso!" });
  } catch (err) {
    console.error("Erro ao eliminar usuário:", err);
    res.status(500).json({ error: "Erro interno ao eliminar usuário" });
  }
});

// Atualizar verso na tabela bible
app.put("/api/bible/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { versos } = req.body;

    const [result] = await db.query(
      "UPDATE bible SET versos = ? WHERE id = ?",
      [versos, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Verso não encontrado" });
    }

    res.json({ message: "Verso atualizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar verso:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Atualizar notice na tabela notice
app.put("/api/notice/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { notice } = req.body;

    const [result] = await db.query(
      "UPDATE notice SET notice = ? WHERE id = ?",
      [notice, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Notícia não encontrada" });
    }

    res.json({ message: "Notícia atualizada com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar notícia:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Listar todos os versículos da tabela bible
app.get("/api/bible", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, versos FROM bible");
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar versículos:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Listar todas as notícias da tabela notice
app.get("/api/notice", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, notice FROM notice");
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar notícias:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});



// Adicionar curso em destaque
app.post("/api/destacar_curso", async (req, res) => {
  try {
    const { id_do_curso } = req.body;

    const [result] = await db.query(
      "INSERT INTO destacar_curso (id_do_curso) VALUES (?)",
      [id_do_curso]
    );

    res.json({ message: "Curso destacado com sucesso!", id: result.insertId });
  } catch (err) {
    console.error("Erro ao destacar curso:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Remover curso dos destaques
app.delete("/api/destacar_curso/:id_do_curso", async (req, res) => {
  try {
    const { id_do_curso } = req.params;

    const [result] = await db.query(
      "DELETE FROM destacar_curso WHERE id_do_curso = ?",
      [id_do_curso]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Curso não encontrado nos destaques" });
    }

    res.json({ message: "Curso removido dos destaques!" });
  } catch (err) {
    console.error("Erro ao remover curso dos destaques:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

app.get("/api/courses_0", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, title FROM courses");
    res.json(rows); // 🔹 rows é um array
  } catch (err) {
    console.error("Erro ao buscar cursos:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Listar compras por usuário
app.get("/api/compras/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(
      "SELECT id, id_do_curso, user_id FROM compras WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Nenhuma compra encontrada para este usuário" });
    }

    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar compras por usuário:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Listar todas as compras
app.get("/api/compras_1", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, user_id, curso_id FROM compras"
    );
    res.json(rows); // 🔹 retorna array de objetos
  } catch (err) {
    console.error("Erro ao buscar compras:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Adicionar compra
// Adicionar compra
app.post("/api/compras_3", async (req, res) => {
  try {
    const { user_id, curso_id } = req.body;

    if (!user_id || !curso_id) {
      return res.status(400).json({ error: "user_id e curso_id são obrigatórios" });
    }

    const [result] = await db.query(
      `INSERT INTO compras (user_id, curso_id, data_compra, data_expiracao) 
       VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR))`,
      [user_id, curso_id]
    );

    res.json({ message: "Compra adicionada com sucesso!", id: result.insertId });
  } catch (err) {
    console.error("Erro ao adicionar compra:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Atualizar compra
app.put("/api/compras_2/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, curso_id } = req.body;

    if (!user_id || !curso_id) {
      return res.status(400).json({ error: "user_id e curso_id são obrigatórios" });
    }

    const [result] = await db.query(
      `UPDATE compras 
       SET user_id = ?, curso_id = ?, data_compra = NOW(), data_expiracao = DATE_ADD(NOW(), INTERVAL 1 YEAR) 
       WHERE id = ?`,
      [user_id, curso_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Compra não encontrada" });
    }

    res.json({ message: "Compra atualizada com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar compra:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Remover compra
app.delete("/api/compras_0/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM compras WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Compra não encontrada" });
    }

    res.json({ message: "Compra removida com sucesso!" });
  } catch (err) {
    console.error("Erro ao remover compra:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Listar cursos em destaque com todos os dados da tabela courses
app.get("/api/destacar_curso", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.* 
       FROM destacar_curso dc
       INNER JOIN courses c ON dc.id_do_curso = c.id`
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Nenhum curso em destaque encontrado" });
    }

    res.json(rows); // 🔹 retorna todos os campos da tabela courses
  } catch (err) {
    console.error("Erro ao buscar cursos em destaque:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Buscar apenas "details" de um curso destacado
app.get("/api/destacar_curso/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT c.details
       FROM destacar_curso dc
       INNER JOIN courses c ON dc.id_do_curso = c.id
       WHERE c.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Curso destacado não encontrado" });
    }

    res.json(rows[0]); // 🔹 retorna apenas { details: "..." }
  } catch (err) {
    console.error("Erro ao buscar curso destacado:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Rota para buscar dados da tabela bna
app.get("/api/bna", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT express, iban FROM bna");

    if (rows.length === 0) {
      return res.status(404).json({ error: "Nenhum dado encontrado na tabela bna" });
    }

    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar dados da tabela bna:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Rota para cadastrar na tabela recuperar_senha
app.post("/api/recuperar_senha", async (req, res) => {
  try {
    const { nome, numeroouemail, sugerir_nova_senha } = req.body;

    const [result] = await db.query(
      "INSERT INTO recuperar_senha (nome, numeroouemail, sugerir_nova_senha) VALUES (?, ?, ?)",
      [nome, numeroouemail, sugerir_nova_senha]
    );

    res.json({ id: result.insertId, nome, numeroouemail, sugerir_nova_senha });
  } catch (err) {
    console.error("Erro ao cadastrar:", err);
    res.status(500).json({ error: "Erro interno ao cadastrar" });
  }
});

app.get("/api/course-contacts", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM course_contacts ORDER BY id DESC"
    );

    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar contactos:", err);
    res.status(500).json({
      error: "Erro interno ao listar contactos"
    });
  }
});

app.get("/api/course-contacts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        error: "ID inválido"
      });
    }

    const [rows] = await db.query(
      "SELECT * FROM course_contacts WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Contacto não encontrado"
      });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Erro ao consultar contacto:", err);
    res.status(500).json({
      error: "Erro interno ao consultar contacto"
    });
  }
});

app.put("/api/course-contacts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      course_id,
      support_whatsapp,
      payment_whatsapp
    } = req.body;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        error: "ID inválido"
      });
    }

    if (
      course_id === undefined ||
      !Number.isInteger(Number(course_id)) ||
      Number(course_id) <= 0 ||
      typeof support_whatsapp !== "string" ||
      typeof payment_whatsapp !== "string" ||
      !support_whatsapp.trim() ||
      !payment_whatsapp.trim() ||
      support_whatsapp.trim().length > 20 ||
      payment_whatsapp.trim().length > 20
    ) {
      return res.status(400).json({
        error: "Preenche corretamente todos os campos obrigatórios"
      });
    }

    const [existing] = await db.query(
      "SELECT id FROM course_contacts WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        error: "Contacto não encontrado"
      });
    }

    const [result] = await db.query(
      `UPDATE course_contacts
       SET course_id = ?,
           support_whatsapp = ?,
           payment_whatsapp = ?
       WHERE id = ?`,
      [
        Number(course_id),
        support_whatsapp.trim(),
        payment_whatsapp.trim(),
        id
      ]
    );

    const [rows] = await db.query(
      "SELECT * FROM course_contacts WHERE id = ?",
      [id]
    );

    res.json({
      message: "Contacto atualizado com sucesso",
      contact: rows[0]
    });
  } catch (err) {
    console.error("Erro ao atualizar contacto:", err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        error: "Este curso já está associado a outro contacto"
      });
    }

    res.status(500).json({
      error: "Erro interno ao atualizar contacto"
    });
  }
});


// Rota para listar todos os registros
// Rota para listar todos os registros de recuperar_senha
app.get("/api/recuperar_senha", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM recuperar_senha");
    res.json(rows); // inclui sugerir_nova_senha
  } catch (err) {
    console.error("Erro ao buscar registros:", err);
    res.status(500).json({ error: "Erro interno ao buscar registros" });
  }
});


// Rota para excluir registro pelo ID
app.delete("/api/recuperar_senha/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM recuperar_senha WHERE id = ?", [id]);
    res.json({ message: "Registro eliminado com sucesso!" });
  } catch (err) {
    console.error("Erro ao eliminar registro:", err);
    res.status(500).json({ error: "Erro interno ao eliminar registro" });
  }
});


app.post('/api/course-contacts', async (req, res) => {
  try {
    const {
      courseId,
      supportWhatsapp,
      paymentWhatsapp
    } = req.body;

    if (!courseId || !supportWhatsapp || !paymentWhatsapp) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios.'
      });
    }

    const sql = `
      INSERT INTO course_contacts (
        course_id,
        support_whatsapp,
        payment_whatsapp
      )
      VALUES (?, ?, ?)
    `;

    db.query(
      sql,
      [
        courseId,
        supportWhatsapp,
        paymentWhatsapp
      ],
      (err, result) => {

        if (err) {
          console.error(err);

          return res.status(500).json({
            success: false,
            message: 'Erro ao salvar configuração.'
          });
        }

        res.status(201).json({
          success: true,
          message: 'Configuração salva com sucesso!',
          id: result.insertId
        });

      }
    );

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor.'
    });
  }
});


/* ADICIONAR PERGUNTA */
app.post('/api/perguntas', async (req, res) => {
  try {
    const {
      roomId,
      question,
      correctAnswer,
      wrongAnswer1,
      wrongAnswer2,
      wrongAnswer3,
      wrongAnswer4,
      ownerId,
      tema,
      disciplina
    } = req.body;

    if (
      !roomId ||
      !question?.trim() ||
      !correctAnswer?.trim() ||
      !ownerId ||
      !tema?.trim() ||
      !disciplina?.trim()
    ) {
      return res.status(400).json({
        message: 'Preenche todos os campos obrigatórios.'
      });
    }

    const sql = `
      INSERT INTO exam_questions
      (
        roomId, question, correctAnswer,
        wrongAnswer1, wrongAnswer2,
        wrongAnswer3, wrongAnswer4,
        ownerId, tema, disciplina
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      roomId,
      question.trim(),
      correctAnswer.trim(),
      wrongAnswer1 || null,
      wrongAnswer2 || null,
      wrongAnswer3 || null,
      wrongAnswer4 || null,
      ownerId,
      tema.trim(),
      disciplina.trim()
    ];

    const [result] = await db.query(sql, values);

    res.status(201).json({
      message: 'Pergunta adicionada com sucesso!',
      id: result.insertId
    });
  } catch (err) {
    console.error('Erro ao adicionar pergunta:', err);
    res.status(500).json({
      message: 'Erro ao adicionar pergunta.'
    });
  }
});


/* ELIMINAR PERGUNTA PELO ID */
app.delete('/api/perguntas/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return res.status(400).json({
        message: 'ID da pergunta inválido.'
      });
    }

    const [result] = await db.query(
      'DELETE FROM exam_questions WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Pergunta não encontrada.'
      });
    }

    res.json({
      message: 'Pergunta eliminada com sucesso!'
    });
  } catch (err) {
    console.error('Erro ao eliminar pergunta:', err);
    res.status(500).json({
      message: 'Erro ao eliminar pergunta.'
    });
  }
});


app.get('/api/salas_e', async (req, res) => {
  try {
    const [results] = await db.query(
      'SELECT * FROM exam_classes ORDER BY id DESC'
    );

    res.status(200).json(results);
  } catch (err) {
    console.error('Erro ao buscar salas:', err);

    res.status(500).json({
      message: 'Erro ao buscar salas.'
    });
  }
});





// 🔹 Rodar servidor na porta 5000
app.listen(5000, () => {
  console.log("Servidor rodando na porta 5000 🚀");
});
