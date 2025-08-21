import multer from 'multer';
import cors from 'cors';
import compressImage from '../utils/imageCompressor.js';

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

import compressImage from "../utils/imageCompressor.js";

export default async function handler(req, res) {
  // Configurar CORS manualmente
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);


    const { quality = 80, format = "jpeg" } = req.query; // ou req.body se JSON

    // Comprimir imagem
    const compressed = await compressImage(buffer, { quality, format });

    res.setHeader("Content-Type", `image/${format}`);
    res.status(200).send(compressed);
  } catch (error) {
    console.error("Erro ao comprimir imagem:", error);
    res.status(500).json({ error: "Falha ao comprimir imagem" });
  }
}



