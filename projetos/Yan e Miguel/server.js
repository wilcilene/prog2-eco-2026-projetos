const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
app.use(cors());
app.use(express.json());
const DB = './db.json';

function readDb(){ return JSON.parse(fs.readFileSync(DB, 'utf8')); }
function writeDb(data){ fs.writeFileSync(DB, JSON.stringify(data, null, 2)); }

app.get('/pilotos', (req,res)=> res.json(readDb().pilotos));
app.post('/pilotos', (req,res)=> {
  const db = readDb();
  const piloto = { id: Date.now(), ...req.body };
  db.pilotos.push(piloto);
  writeDb(db);
  res.status(201).json(piloto);
});

app.get('/corridas', (req,res)=> res.json(readDb().corridas));
app.post('/corridas', (req,res)=> {
  const db = readDb();
  const corrida = { id: Date.now(), ...req.body };
  db.corridas.push(corrida);
  writeDb(db);
  res.status(201).json(corrida);
});

app.listen(3000, ()=> console.log('Servidor rodando na porta 3000'));