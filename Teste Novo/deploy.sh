#!/bin/bash

# Script de Deploy para VPS
# Este script automatiza o processo de deploy do sistema de estoque

echo "🚀 Iniciando deploy do Sistema de Estoque..."

# 1. Atualizar código do repositório
echo "📥 Atualizando código do repositório..."
git pull origin main

# 2. Instalar dependências
echo "📦 Instalando dependências..."
npm install

# 3. Build do frontend
echo "🔨 Fazendo build do frontend..."
npm run build

# 4. Reiniciar servidor
echo "🔄 Reiniciando servidor..."
pm2 restart estoque-api || pm2 start server.js --name estoque-api

# 5. Verificar status
echo "✅ Verificando status do servidor..."
pm2 status

echo "🎉 Deploy concluído com sucesso!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:3001" 