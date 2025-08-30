// Éditer cette texture pour la rendre plus claire
// La texture earth-texture.jpg était trop sombre

import * as THREE from 'three';
import { createCanvas } from 'canvas';
import fs from 'fs/promises';
import path from 'path';

async function brightenTexture() {
  try {
    // Lire l'image existante
    const imagePath = path.join(process.cwd(), 'public', 'earth-texture.jpg');
    const buffer = await fs.readFile(imagePath);
    
    // Créer un élément d'image et charger l'image
    const img = new Image();
    img.src = buffer;
    
    // Créer un canvas pour manipuler l'image
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    
    // Dessiner l'image sur le canvas
    ctx.drawImage(img, 0, 0);
    
    // Obtenir les données de l'image
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Ajuster la luminosité
    const brightnessValue = 1.4; // Augmentation de la luminosité de 40%
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * brightnessValue);       // Rouge
      data[i + 1] = Math.min(255, data[i + 1] * brightnessValue); // Vert
      data[i + 2] = Math.min(255, data[i + 2] * brightnessValue); // Bleu
    }
    
    // Appliquer les données modifiées
    ctx.putImageData(imageData, 0, 0);
    
    // Enregistrer l'image modifiée
    const brightImagePath = path.join(process.cwd(), 'public', 'earth-texture-bright.jpg');
    const buffer2 = canvas.toBuffer('image/jpeg');
    await fs.writeFile(brightImagePath, buffer2);
    
    console.log('Image plus claire créée: earth-texture-bright.jpg');
  } catch (error) {
    console.error('Erreur lors du traitement de l\'image:', error);
  }
}

brightenTexture();
