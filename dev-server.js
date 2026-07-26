#!/usr/bin/env node

/**
 * Local Dev Server para Cuestionario AIE
 *
 * Uso: node dev-server.js
 *
 * Abre:
 * - Frontend: http://localhost:3000
 * - API Test: http://localhost:3000/api/test
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

console.log(`
╔═══════════════════════════════════════════════════════════╗
║     🚀 AIE Cuestionario - Dev Server (LOCAL)             ║
╚═══════════════════════════════════════════════════════════╝

🌐 Frontend: http://localhost:${PORT}
🔌 API:      http://localhost:${PORT}/api/submit-form
📊 Test:     http://localhost:${PORT}/api/test

Presiona Ctrl+C para detener
`);

// Crear servidor
const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // API Test
  if (pathname === '/api/test' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      ok: true,
      message: '✅ API funcionando',
      timestamp: new Date().toISOString(),
      env: {
        CLAUDE_API_KEY: process.env.CLAUDE_API_KEY ? '✅ Configurada' : '❌ Falta',
        N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL ? '✅ Configurada' : '❌ Falta',
      }
    }, null, 2));
    return;
  }

  // Servir formulario
  if (pathname === '/' || pathname === '/index.html') {
    try {
      const content = fs.readFileSync(
        path.join(__dirname, 'public/cuestionario-aie-constructora-premium.html'),
        'utf8'
      );
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.writeHead(200);
      res.end(content);
      return;
    } catch (err) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Archivo no encontrado' }));
      return;
    }
  }

  // API submit-form
  if (pathname === '/api/submit-form' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const datos = JSON.parse(body);

        console.log('\n📨 Datos recibidos:');
        console.log(`   Nombre: ${datos.nombre}`);
        console.log(`   Email: ${datos.correo}`);
        console.log(`   Preguntas respondidas: ${Object.keys(datos).length}`);

        // Resumen mock (sin Claude)
        const resumenMock = `
RESUMEN AUTOMÁTICO (MOCK - Sin Claude API en local):
═════════════════════════════════════════════════

Estado Actual:
${datos.otros_sistemas || '- No especificado'}

Puntos Críticos:
${datos.dolor_de_cabeza || '- No especificado'}

Oportunidades:
- Integración automática de flujos
- Centralización de datos
- Reportes en tiempo real

Recomendación:
Enfoque en automatizar el ciclo de facturación y aprobaciones.
`;

        const payload = {
          success: true,
          message: '✅ Datos recibidos correctamente (LOCAL)',
          cliente: datos.nombre,
          email: datos.correo,
          resumen_ia: resumenMock,
          timestamp: new Date().toISOString(),
          nota: '⚠️ En local, no se envía a n8n. Para producción usar Vercel.'
        };

        console.log('   ✅ Respuesta enviada al cliente');

        // Si hay webhook configurado, intenta enviar
        if (process.env.N8N_WEBHOOK_URL) {
          console.log('   🔗 Enviando a n8n...');
          // Aquí iría la lógica real
        }

        res.writeHead(200);
        res.end(JSON.stringify(payload, null, 2));
      } catch (err) {
        console.error('   ❌ Error:', err.message);
        res.writeHead(500);
        res.end(JSON.stringify({
          error: 'Error procesando datos',
          details: err.message
        }));
      }
    });
    return;
  }

  // 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: '404 - Ruta no encontrada' }));
});

server.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en puerto ${PORT}\n`);
});

server.on('error', (err) => {
  console.error('❌ Error del servidor:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Servidor detenido');
  process.exit(0);
});
