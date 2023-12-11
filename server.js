const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

// Configuración para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(bodyParser.json());

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para obtener el contenido actual del archivo JSON
app.get('/data/lista', (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, 'data', 'lista.json'));
  const jsonData = JSON.parse(data);
  res.json(jsonData);
});

// Ruta para actualizar el archivo JSON
app.post('/data/lista', (req, res) => {
  const newData = req.body.data;

  // Escribe el nuevo contenido en el archivo JSON
  fs.writeFileSync(path.join(__dirname, 'data', 'lista.json'), JSON.stringify(newData, null, 2));

  res.json({ success: true });
});

// Puerto para el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
