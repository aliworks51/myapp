const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// middlewares
app.use(cors());
app.use(express.json());

// ملف الطلبات
const DATA_FILE = "./commandes.json";

// دالة لحفظ الطلبات
function saveCommande(commande) {
  let commandes = [];
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE);
    commandes = JSON.parse(data || "[]");
  }
  commandes.push(commande);
  fs.writeFileSync(DATA_FILE, JSON.stringify(commandes, null, 2));
}

// 📩 endpoint: استقبال الطلب من التطبيق
app.post("/commande", (req, res) => {
  const { nom, prenom, phone, address, plat } = req.body;

  if (!nom || !prenom || !phone || !address || !plat) {
    return res.status(400).json({ message: "❌ Tous les champs sont requis" });
  }

  const newCommande = {
    id: Date.now(),
    nom,
    prenom,
    phone,
    address,
    plat,
    date: new Date().toLocaleString(),
  };

  saveCommande(newCommande);
  console.log("✅ Commande enregistrée:", newCommande);
  res.json({ message: "✅ Commande reçue avec succès !" });
});

// 🌐 endpoint: afficher toutes les commandes
app.get("/commandes", (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.json([]);
  const data = fs.readFileSync(DATA_FILE);
  res.json(JSON.parse(data || "[]"));
});

// 📄 afficher admin.html
app.get("/", (req, res) => {
  res.sendFile(path.resolve("./admin.html"));
});

// 🚀 démarrage du serveur
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Serveur lancé sur http://100.95.0.195:${PORT}`);
});

