#!/bin/bash

echo "🔨 Compilando front-end..."
npm run build:client

echo "🚀 Iniciando servidor..."
echo "📱 Acesse: http://localhost:3000"
echo ""

ts-node src/server.ts

