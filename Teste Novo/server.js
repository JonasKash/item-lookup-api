const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'planilhas/');
  },
  filename: function (req, file, cb) {
    // Mantém o nome original do arquivo
    cb(null, file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Aceita apenas arquivos Excel
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel' ||
        file.originalname.endsWith('.xlsx') ||
        file.originalname.endsWith('.xls')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos Excel são permitidos!'), false);
    }
  }
});

// Função para executar comandos git
function executeGitCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro executando comando git: ${error}`);
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

// Rota para upload de arquivos
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    console.log(`Arquivo recebido: ${req.file.originalname}`);
    
    res.json({ 
      message: 'Arquivo enviado com sucesso',
      filename: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para fazer commit no git
app.post('/api/commit', async (req, res) => {
  try {
    const { message = 'Atualização de planilhas de estoque' } = req.body;
    
    console.log('Iniciando processo de commit...');
    
    // Adiciona todos os arquivos
    await executeGitCommand('git add .');
    console.log('Arquivos adicionados ao git');
    
    // Faz o commit
    await executeGitCommand(`git commit -m "${message}"`);
    console.log('Commit realizado');
    
    // Push para o repositório remoto (se configurado)
    try {
      await executeGitCommand('git push');
      console.log('Push realizado');
    } catch (pushError) {
      console.log('Push não realizado (pode não estar configurado)');
    }
    
    res.json({ 
      message: 'Commit realizado com sucesso',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro no commit:', error);
    res.status(500).json({ error: 'Erro ao realizar commit' });
  }
});

// Rota para listar arquivos na pasta planilhas
app.get('/api/files', async (req, res) => {
  try {
    const planilhasDir = path.join(process.cwd(), 'planilhas');
    
    try {
      await fs.access(planilhasDir);
    } catch {
      // Se a pasta não existir, cria ela
      await fs.mkdir(planilhasDir, { recursive: true });
    }
    
    const files = await fs.readdir(planilhasDir);
    const fileStats = await Promise.all(
      files.map(async (filename) => {
        const filePath = path.join(planilhasDir, filename);
        const stats = await fs.stat(filePath);
        return {
          name: filename,
          size: stats.size,
          modified: stats.mtime,
          isExcel: filename.endsWith('.xlsx') || filename.endsWith('.xls')
        };
      })
    );
    
    // Filtra apenas arquivos Excel
    const excelFiles = fileStats.filter(file => file.isExcel);
    
    res.json({ files: excelFiles });
  } catch (error) {
    console.error('Erro ao listar arquivos:', error);
    res.status(500).json({ error: 'Erro ao listar arquivos' });
  }
});

// Rota para sincronizar base de dados
app.post('/api/sync-database', async (req, res) => {
  try {
    console.log('Iniciando sincronização da base de dados...');
    
    // Aqui você implementaria a lógica para processar as planilhas
    // e atualizar a base de dados
    
    // Simula processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    res.json({ 
      message: 'Base de dados sincronizada com sucesso',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro na sincronização:', error);
    res.status(500).json({ error: 'Erro ao sincronizar base de dados' });
  }
});

// Rota de status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
}); 