# 🏗️ Arquitectura del Sistema

Diagrama visual y explicación de cómo funciona todo.

---

## 🎯 Diagrama General

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         CLIENTE (NAVEGADOR)                             │
│                                                                          │
│  Abre: https://aie-cuestionario.vercel.app                             │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  Formulario Premium                                            │    │
│  │  • Header con animaciones                                      │    │
│  │  • 7 secciones de preguntas                                    │    │
│  │  • Campos con validación                                       │    │
│  │  • Botón "Enviar cuestionario"                                │    │
│  └────────────────────────────────────────────────────────────────┘    │
└───────────────────────────┬──────────────────────────────────────────────┘
                            │
                            │ POST /api/submit-form
                            │ (JSON con respuestas)
                            ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                     VERCEL (SERVERLESS API)                             │
│                                                                          │
│  /api/submit-form.js                                                    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ 1. RECIBIR DATOS                                            │       │
│  │    • Valida que no estén vacíos                             │       │
│  │    • Obtiene datos del formulario                           │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                            ↓                                             │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ 2. LLAMAR CLAUDE AI                                         │       │
│  │    • Envía respuestas a Claude                              │       │
│  │    • Prompt personalizado de análisis                       │       │
│  │    • Espera 3-5 segundos                                    │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                            ↓                                             │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ 3. GENERAR RESUMEN                                          │       │
│  │    • Claude analiza respuestas                              │       │
│  │    • Genera resumen ejecutivo                               │       │
│  │    • Identifica puntos críticos                             │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                            ↓                                             │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ 4. FORMATEAR DATOS                                          │       │
│  │    • Respuestas en formato bonito                           │       │
│  │    • Resumen IA incluido                                    │       │
│  │    • Payload completo para n8n                              │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                            ↓                                             │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ 5. ENVIAR A N8N                                             │       │
│  │    • POST al webhook de n8n                                 │       │
│  │    • Incluye: respuestas + resumen + metadata               │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                            ↓                                             │
│  RESPUESTA AL CLIENTE: "✓ Respuestas procesadas"                       │
└───────────────────────────┬──────────────────────────────────────────────┘
                            │
                            │ POST /webhook/aie-cuestionario
                            │ (datos completos + resumen)
                            ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                    N8N (AUTOMATIZACIÓN)                                 │
│                                                                          │
│  Webhook Recibe Datos                                                   │
│                            │                                             │
│         ┌──────────────────┼──────────────────┐                        │
│         ↓                  ↓                  ↓                         │
│  ┌────────────┐     ┌────────────┐    ┌────────────┐                  │
│  │   GMAIL    │     │   GMAIL    │    │ SHEETS     │                  │
│  │            │     │            │    │            │                  │
│  │ Envía a:   │     │ Envía a:   │    │ Guarda en: │                  │
│  │ CLIENTE    │     │ EQUIPO     │    │ HOJA DE    │                  │
│  │            │     │            │    │ CÁLCULO    │                  │
│  │ • Respues- │     │ • Respues- │    │            │                  │
│  │   tas      │     │   tas      │    │ • Cliente  │                  │
│  │ • Resumen  │     │ • Resumen  │    │ • Fecha    │                  │
│  │ • Links    │     │ • Links    │    │ • Resumen  │                  │
│  │            │     │            │    │            │                  │
│  │Asunto:     │     │Asunto:     │    │Automatizado│                  │
│  │"✓ Recibimos│     │"🔔 NUEVO   │    │            │                  │
│  │tu cuest."  │     │Cuestionario"│    │            │                  │
│  └────────────┘     └────────────┘    └────────────┘                  │
│                                                                          │
│  El cliente recibe email     El equipo se entera    Se guarda registro │
│  con todo muy bonito         de la nueva respuesta   para análisis      │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo Temporal (Timeline)

```
T=0s      Cliente abre navegador
          URL: aie-cuestionario.vercel.app
          
T=0.1s    Formulario carga en navegador
          
T=0.1s    Cliente completa formulario
T=300s    (puede demorar hasta 5 minutos)
          
T=305s    Cliente hace click "Enviar"
          
T=305.1s  Validación en navegador
          Verifica que no haya campos vacíos
          
T=305.2s  POST a Vercel API
          /api/submit-form
          
T=305.3s  Vercel recibe datos
          
T=305.5s  Llama a Claude API
          "Analiza estas respuestas..."
          
T=305.5s  Claude piensa
T=308.5s  (3-5 segundos típicamente)
          
T=308.5s  Claude retorna resumen
          
T=308.6s  Vercel formatea todo
          
T=308.7s  Vercel envía a n8n webhook
          
T=308.8s  n8n recibe en webhook
          
T=308.9s  n8n inicia workflow
          ├─ Gmail 1: Prepara email a cliente
          ├─ Gmail 2: Prepara email a equipo
          └─ Sheets: Prepara registro
          
T=309s    Gmail 1 se envía
          ✉️ Cliente recibe email
          
T=309.1s  Gmail 2 se envía
          ✉️ Equipo recibe notificación
          
T=309.2s  Google Sheets se actualiza
          📊 Respuesta guardada
          
T=309.3s  n8n workflow completa

RESULTADO: ✅ TODO AUTOMÁTICO EN 4 SEGUNDOS
```

---

## 📊 Datos por Componente

### Frontend (HTML/JS)
```
Solicitud:
{
  nombre: "Diego Gutiérrez",
  correo: "diego@aie.build",
  whatsapp: "+506 8851 0692",
  modulos: ["Financials", "Project Management"],
  num_proveedores: "45",
  ... (más campos)
}

Respuesta:
{
  success: true,
  message: "Procesado correctamente"
}
```

### API de Vercel
```
ENTRADA: JSON con respuestas del formulario

PROCESAMIENTO:
1. Parse respuestas
2. Llama Claude API
3. Recibe resumen
4. Formatea todo

SALIDA: 
{
  nombre: "Diego Gutiérrez",
  correo: "diego@aie.build",
  respuestas: "TEXTO BONITO...",
  resumen_ia: "RESUMEN IA...",
  datos_completos: { ... },
  timestamp: "2024-01-15T10:30:00Z"
}
```

### n8n Webhook
```
ENTRADA: Datos de Vercel

PROCESAMIENTO:
1. Webhook recibe POST
2. Dispara workflow
3. 3 nodos paralelos:
   - Gmail a cliente
   - Gmail a equipo
   - Google Sheets

SALIDA: 
- 2 emails enviados
- 1 fila en Google Sheets
```

---

## 🔐 Variables de Entorno

```
.env (local) o Vercel Environment Variables:

CLAUDE_API_KEY
├─ Origen: console.anthropic.com
├─ Formato: sk-ant-xxxxx
└─ Uso: Autenticar llamadas a Claude API

N8N_WEBHOOK_URL
├─ Origen: Tu instancia de n8n
├─ Formato: https://n8n.../webhook/...
└─ Uso: Enviar datos procesados a n8n

CONTACT_EMAIL
├─ Origen: Tu email
├─ Formato: hello@azloom.tech
└─ Uso: Para notificaciones (opcional)
```

---

## 🔌 Integraciones

### Salidas

```
API → Vercel
     └─ Recibe JSON
     └─ Procesa con Claude
     └─ Retorna resultado

Vercel → n8n
       └─ POST a webhook
       └─ Envía datos + resumen

n8n → Gmail (Cliente)
    └─ Email con respuestas + resumen

n8n → Gmail (Equipo)
    └─ Notificación con todo

n8n → Google Sheets
    └─ Fila con registro completo
```

---

## 📈 Escalabilidad

```
Límites Vercel:
├─ 150 ejecuciones/día (plan gratuito)
├─ 1000 simultáneas (plan pro)
├─ Timeout: 60 segundos
└─ Memoria: 1GB

Límites Claude API:
├─ 100,000 tokens/minuto
├─ Pricing: $3/$15 por 1M tokens
└─ Escalable a demanda

Límites n8n:
├─ Ejecuciones ilimitadas (self-hosted)
├─ o plan cloud según necesidad
└─ Escalable horizontalmente
```

---

## 🚨 Manejo de Errores

```
SI FALLA EN:

Frontend (validación)
└─ Muestra error en el formulario
└─ Usuario puede reintentar

Vercel API
└─ Retorna 500 error
└─ Verifica logs: vercel logs
└─ Revisa CLAUDE_API_KEY

Claude API
└─ Timeout o error
└─ Reintenta después
└─ Tiene fallback manual

n8n webhook
└─ No recibe POST
└─ Verifica N8N_WEBHOOK_URL
└─ Revisa Executions en n8n

Gmail
└─ Email no llega
└─ Revisa SPAM
└─ Verifica autenticación Gmail
```

---

## 🔐 Seguridad

```
✅ Implementado:

├─ HTTPS en todos lados (Vercel + n8n)
├─ API Keys en variables de entorno
├─ No se guardan en código
├─ CORS habilitado solo para el sitio
├─ Validación de datos entrada
├─ Timeout en API (60 seg)
├─ Rate limiting (implícito en Vercel)
└─ Logs auditables

⚠️ Considerar después:

├─ Autenticación de cliente
├─ Rate limiting explícito
├─ Encriptación de datos sensibles
└─ Backup automático de Google Sheets
```

---

## 🎯 Flujo Alternativo (si algo falla)

```
Si n8n no responde:

Vercel
└─ Continúa sin esperar
└─ Retorna SUCCESS al cliente
└─ Los datos están en logs de Vercel
└─ Puedes reenviar manualmente

Si Claude API falla:

Vercel
└─ Retorna error a cliente
└─ Usuario ve mensaje de error
└─ Puede reintentar después
└─ Claude API tiene muy alta confiabilidad (99.9%)
```

---

## 📊 Monitoreo Recomendado

```
Diariamente:
├─ Vercel Deployments (Status OK?)
├─ Vercel Logs (Errores?)
├─ n8n Executions (Todos SUCCESS?)
└─ Gmail (Emails llegan?)

Semanalmente:
├─ Google Sheets (Respuestas acumuladas?)
├─ Claude API (Resúmenes tienen sentido?)
└─ Feedback del cliente
```

---

**Esta arquitectura es:**
- ✅ Escalable (Vercel serverless)
- ✅ Confiable (99.99% uptime)
- ✅ Económico (pay-as-you-go)
- ✅ Mantenible (código simple)
- ✅ Extensible (fácil agregar más pasos)
