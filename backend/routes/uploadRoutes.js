const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Générer un nom de fichier unique avec timestamp
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

// Filtre pour n'accepter que les images JPEG, PNG et WebP
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images JPEG, PNG et WebP sont acceptées'), false);
  }
};

const upload = multer({
  storage,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5 MB max
  },
  fileFilter: fileFilter
});

// Endpoint pour l'upload d'image
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Aucun fichier image fourni' 
      });
    }

    // Retourner l'URL publique du fichier
    const imageUrl = `${process.env.CLIENT_URL}/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Image uploadée avec succès',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'upload',
      error: error.message 
    });
  }
});

module.exports = router;
