const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Récupérer l'URL de la requête
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);

  // Redirection vers index.html lorsque l'URL est '/'
  if (req.method === 'GET' && reqUrl.pathname === '/') {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error('Erreur lors de la lecture du fichier index.html:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erreur serveur');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (req.method === 'GET' && reqUrl.pathname.startsWith('/music/')) {
    // Servir les fichiers statiques depuis le dossier 'public'
    const filePath = path.join(__dirname, reqUrl.pathname);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error('Erreur lors de la lecture du fichier statique:', err);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Fichier non trouvé');
      } else {
        res.writeHead(200);
        res.end(data);
      }
    });
  } else if (req.method === 'GET' && reqUrl.pathname === '/get_music_list') {
    // Récupérer la liste des fichiers MP3 dans le dossier 'music'
    const musicDir = path.join(__dirname, 'music');
    fs.readdir(musicDir, (err, files) => {
      if (err) {
        console.error('Erreur lors de la récupération de la liste de musique:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Erreur lors de la récupération de la liste de musique' }));
      } else {
        const mp3Files = files.filter(file => path.extname(file).toLowerCase() === '.mp3');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(mp3Files));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page non trouvée');
  }
});

// Démarrer le serveur sur le port 8080
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Serveur lancé sur http://192.168.1.40:${PORT}`);
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
