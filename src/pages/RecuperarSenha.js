import React, { useState } from "react";
import { Link } from "react-router-dom";

const RecuperarSenha = () => {
  const [nome, setNome] = useState("");
  const [numeroouemail, setNumeroOuEmail] = useState("");
  const [sugerir_nova_senha, setSugerirNovaSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMensagem("");
    setErro("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/recuperar_senha",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome,
            numeroouemail,
            sugerir_nova_senha,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMensagem(
          "Solicitação enviada com sucesso. Aguarde a análise do administrador."
        );

        setNome("");
        setNumeroOuEmail("");
        setSugerirNovaSenha("");
      } else {
        setErro(data.error || "Erro ao enviar solicitação.");
      }
    } catch (error) {
      console.error(error);
      setErro("Erro ao conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "25px",
            color: "#1f2937",
          }}
        >
          Recuperar Senha
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "600",
              }}
            >
              Nome Completo
            </label>

            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o seu nome"
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "600",
              }}
            >
              Número ou E-mail
            </label>

            <input
              type="text"
              value={numeroouemail}
              onChange={(e) => setNumeroOuEmail(e.target.value)}
              placeholder="Digite o número ou e-mail"
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "600",
              }}
            >
              Sugerir Nova Senha
            </label>

            <input
              type="password"
              value={sugerir_nova_senha}
              onChange={(e) => setSugerirNovaSenha(e.target.value)}
              placeholder="Digite uma nova senha"
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            {loading ? "Enviando..." : "Enviar Solicitação"}
          </button>
        </form>

        {mensagem && (
          <div
            style={{
              marginTop: "15px",
              padding: "10px",
              background: "#dcfce7",
              color: "#166534",
              borderRadius: "5px",
            }}
          >
            {mensagem}
          </div>
        )}

        {erro && (
          <div
            style={{
              marginTop: "15px",
              padding: "10px",
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: "5px",
            }}
          >
            {erro}
          </div>
        )}

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          <Link
            to="/login"
            style={{
              color: "#2563eb",
              textDecoration: "none",
            }}
          >
            Voltar ao Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecuperarSenha;