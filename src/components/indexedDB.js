// src/utils/indexedDB.js
import { openDB } from "idb";

// 🔹 Inicializa o banco
async function getDB() {
  return await openDB("offlineVideos", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("videos")) {
        db.createObjectStore("videos");
      }
    },
  });
}

// 🔹 Salvar vídeo offline com metadados
export async function saveVideoOffline(videoId, blob, title, tema, disciplina, dataExpiracao) {
  const db = await getDB();
  await db.put("videos", { blob, title, tema, disciplina, dataExpiracao }, videoId);
}

// 🔹 Recuperar vídeo offline por ID
export async function getVideoOffline(videoId) {
  const db = await getDB();
  return await db.get("videos", videoId);
}

// 🔹 Listar todos os vídeos offline (retorna objetos com metadados)
export async function getAllOfflineVideos() {
  const db = await getDB();
  const tx = db.transaction("videos", "readonly");
  const store = tx.objectStore("videos");
  const allKeys = await store.getAllKeys();

  const videos = [];
  for (const key of allKeys) {
    const video = await store.get(key);
    videos.push({ id: key, ...video });
  }
  return videos;
}

// 🔹 Apagar vídeo offline por ID
export async function deleteVideoOffline(videoId) {
  const db = await getDB();
  await db.delete("videos", videoId);
}
