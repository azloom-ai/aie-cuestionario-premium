# 📁 Estructura del Proyecto

```
aie-cuestionario/
│
├── 📄 public/
│   └── cuestionario-aie-constructora-premium.html ← ⭐ EL FORMULARIO
│                                                      (lo que ve el cliente)
│
├── ⚙️ api/
│   └── submit-form.js ← ⭐ LA MAGIA
│                         (procesa datos + Claude + n8n)
│
├── 🔐 .env.example ← Template de variables de entorno
│                     COPIA ESTO A .env.local
│
├── 📦 package.json ← Dependencias (Claude SDK, etc)
│
├── ✅ vercel.json ← Configuración de Vercel
│
├── 📚 README.md ← Documentación completa
│
├── ⚡ SETUP-RAPIDO.md ← Guía de setup en 30 min (LEE ESTO)
│
├── 📋 ESTRUCTURA.md ← Este archivo
│
├── 🔗 n8n-workflow-template.json ← Workflow para importar en n8n
│
└── .gitignore ← Para no subir secrets a GitHub
```

---

## 🎯 Cómo Funciona Todo

### 1️⃣ **Frontend: El Formulario**

**Archivo:** `public/cuestionario-aie-constructora-premium.html`

```
┌─────────────────────────────────────┐
│  CLIENTE ABRE EN NAVEGADOR          │
│                                     │
│  URL: aie-cuestionario.vercel.app   │
│                                     │
│  Ve el formulario bonito 💎         │
│                                     │
│  Completa 7 secciones               │
│  Hace click en "Enviar"             │
└─────────────────────────────────────┘
         ↓
  POST /api/submit-form
      (datos JSON)
```

---

### 2️⃣ **Backend: La API Serverless**

**Archivo:** `api/submit-form.js`

```
┌────────────────────────────────────────────┐
│  VERCEL RECIBE LOS DATOS                   │
│                                            │
│  1. Valida que no estén vacíos             │
│  2. Llama a Claude API                     │
│     "Analiza estas respuestas..."          │
│  3. Espera el resumen (3-5 segundos)       │
│  4. Formatea las respuestas bonito         │
│  5. Envía TODO a n8n webhook               │
└────────────────────────────────────────────┘
```

**¿Qué envía a n8n?**
```json
{
  "nombre": "Diego Gutiérrez",
  "correo": "diego@aie.build",
  "respuestas": "TEXTO FORMATEADO BONITO...",
  "resumen_ia": "RESUMEN GENERADO POR CLAUDE...",
  "datos_completos": { /* todos los campos */ },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### 3️⃣ **Automatización: n8n Workflow**

**Archivo:** `n8n-workflow-template.json` (importar en n8n)

```
┌──────────────────────────────────────────────┐
│  N8N RECIBE LOS DATOS DEL WEBHOOK           │
│                                              │
│  ├─→ 📧 GMAIL NODO 1                        │
│  │   "Envía email al cliente"                │
│  │   Asunto: "✓ Recibimos tu cuestionario"   │
│  │   Body: Respuestas + Resumen              │
│  │                                           │
│  ├─→ 📧 GMAIL NODO 2                        │
│  │   "Notifica al equipo de Azloom"          │
│  │   Asunto: "🔔 NUEVO: Respuesta AIE"       │
│  │   Body: Todo los datos                    │
│  │                                           │
│  └─→ 📊 GOOGLE SHEETS (opcional)             │
│      "Guarda en hoja de cálculo"             │
│      Para análisis posterior                  │
└──────────────────────────────────────────────┘
```

---

## 🔑 Variables de Entorno

**Archivo:** `.env.local` (crear copiando `.env.example`)

```env
# Tu API Key de Claude
# Obtenerla en: https://console.anthropic.com/
CLAUDE_API_KEY=sk-ant-xxxxx

# Tu webhook de n8n (obtenlo del nodo Webhook en n8n)
N8N_WEBHOOK_URL=https://tu-n8n.example.com/webhook/aie-cuestionario

# Tu email para recibir notificaciones
CONTACT_EMAIL=hello@azloom.tech
```

⚠️ **IMPORTANTE:** Nunca commits estos valores a GitHub. Están en `.gitignore`

En Vercel, agrega estas variables en:
**Settings → Environment Variables**

---

## 📦 Dependencias

**Archivo:** `package.json`

```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.24.0",  ← Claude API
    "nodemailer": "^6.9.7"            ← Envío de emails (opcional)
  }
}
```

Vercel instala automáticamente cuando deployas.

---

## ⚙️ Configuración de Vercel

**Archivo:** `vercel.json`

```json
{
  "env": {
    "N8N_WEBHOOK_URL": "@n8n_webhook_url",
    "CLAUDE_API_KEY": "@claude_api_key",
    "CONTACT_EMAIL": "@contact_email"
  },
  "functions": {
    "api/**/*.js": {
      "memory": 1024,     ← Suficiente para Claude
      "maxDuration": 60   ← Timeout de 60 seg
    }
  }
}
```

---

## 🚀 Flujo Completo Paso a Paso

```
USUARIO ABRE NAVEGADOR
        ↓
[cuestionario-aie-constructora-premium.html carga]
        ↓
USUARIO COMPLETA FORMULARIO
        ↓
USUARIO HACE CLICK "ENVIAR"
        ↓
[JavaScript valida formulario]
        ↓
POST a /api/submit-form
(envía JSON con respuestas)
        ↓
[submit-form.js recibe en Vercel]
        ↓
[Llama a Claude API]
"Analiza estas respuestas de un constructor..."
        ↓
[Claude piensa 3-5 segundos]
        ↓
[Genera resumen ejecutivo]
        ↓
[Formatea respuestas en texto bonito]
        ↓
[Prepara payload con TODO]
        ↓
POST a n8n webhook
        ↓
[n8n recibe los datos]
        ↓
┌─────────────────────┐
│ Gmail a Cliente     │ ← Respuestas + Resumen
│ Gmail a Equipo      │ ← Notificación
│ Google Sheets       │ ← Log de respuestas
└─────────────────────┘
        ↓
[USUARIO VE "¡Gracias, Diego!"]
```

---

## 💾 Qué Guarda Dónde

| Dónde | Qué | Acción |
|-------|-----|--------|
| Navegador del cliente | Nada (stateless) | El formulario se borra después de enviar |
| Vercel (5 min) | Logs de ejecución | Se auto-borra después |
| n8n | Todos los datos + resumen | ✅ Persiste |
| Gmail (Cliente) | Email con respuestas | ✅ Persiste |
| Gmail (Equipo) | Notificación | ✅ Persiste |
| Google Sheets | Registro de todas las respuestas | ✅ Persiste |

---

## 🔐 Seguridad

- ✅ `.env` no se commitea (en `.gitignore`)
- ✅ API Keys no están en el código
- ✅ Vercel maneja encriptación automática
- ✅ Solo se envía a n8n (tu infraestructura)
- ✅ HTTPS en todos lados

---

## 📈 Escalabilidad

| Métrica | Límite | Plan |
|---------|--------|------|
| Respuestas/día | 150 | Vercel Pro |
| Llamadas Claude/día | 100,000 | Anthropic (pay-as-you-go) |
| Tamaño máx de archivo | 25MB | Vercel |
| Timeout máx | 60 seg | Vercel |

---

## 🎯 Cosas que Puedes Customizar

### Fácil (1-2 min)
- [ ] Cambiar colores del formulario (CSS variables)
- [ ] Cambiar preguntas (HTML)
- [ ] Cambiar email de destino

### Medio (10-15 min)
- [ ] Agregar más preguntas
- [ ] Cambiar prompt de Claude
- [ ] Integrar Slack en n8n

### Difícil (1+ hora)
- [ ] Agregar autenticación
- [ ] Crear dashboard de respuestas
- [ ] Integrar con CRM

---

## 📞 Archivos de Referencia

| Archivo | Qué es | Cuándo leerlo |
|---------|--------|---------------|
| `README.md` | Documentación completa | Primero que nada |
| `SETUP-RAPIDO.md` | Setup en 30 min | Para deploying |
| `ESTRUCTURA.md` | Este archivo | Para entender todo |
| `n8n-workflow-template.json` | Template de workflow | Al configurar n8n |
| `.env.example` | Variables necesarias | Al configurar Vercel |

---

**¿Dudas? Lee README.md o contacta a hello@azloom.tech** 🚀
