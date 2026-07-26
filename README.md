# 🚀 Cuestionario AIE - Despliegue en Vercel + n8n + Claude AI

Este es el formulario premium para AIE Constructora con integración completa:
- **Frontend:** Formulario hermoso en Vercel
- **Backend:** API serverless que procesa respuestas
- **IA:** Claude 3.5 Sonnet genera resúmenes automáticos
- **Automatización:** n8n envía emails y gestiona los datos

---

## 📋 Requisitos Previos

Necesitarás tener:
- 🔐 Cuenta en [Vercel](https://vercel.com) (gratuita)
- 🔑 API Key de Anthropic (Claude) - [Obtenerla](https://console.anthropic.com/)
- 🔗 Cuenta en [n8n](https://n8n.io) - Versión cloud o self-hosted
- 📧 Un servicio de email (Gmail, SendGrid, etc.)

---

## 🎯 Paso 1: Preparar el Proyecto

### 1.1 Clonar o descargar el proyecto
```bash
cd tu-proyecto-aie
```

### 1.2 Crear archivo `.env.local` (para desarrollo)
Copia el contenido de `.env.example` y llena los valores:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores reales:
```
N8N_WEBHOOK_URL=https://tu-n8n.example.com/webhook/aie
CLAUDE_API_KEY=sk-ant-tu-api-key-aqui
CONTACT_EMAIL=hello@azloom.tech
```

---

## 🚀 Paso 2: Subir a Vercel

### Opción A: Via GitHub (Recomendado)

1. **Sube a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AIE Cuestionario Premium"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/aie-cuestionario.git
   git push -u origin main
   ```

2. **Conecta en Vercel:**
   - Ve a [vercel.com/new](https://vercel.com/new)
   - Selecciona tu repo de GitHub
   - Vercel detecta automáticamente que es un proyecto Node.js
   - Click en "Deploy"

### Opción B: Via CLI de Vercel

```bash
npm install -g vercel
vercel
```

Sigue las instrucciones. Vercel te pedirá que confirmes el proyecto y luego lo desplegará.

---

## 🔐 Paso 3: Configurar Variables en Vercel

1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. Abre **Settings → Environment Variables**
3. Agrega las 3 variables:
   - `N8N_WEBHOOK_URL`
   - `CLAUDE_API_KEY`
   - `CONTACT_EMAIL`

4. Redeploy el proyecto (Settings → Deployments → Redeploy)

---

## 🔗 Paso 4: Configurar n8n Webhook

### 4.1 En tu instancia de n8n

1. Crea un nuevo flujo
2. Agrega un nodo **Webhook**
3. Selecciona método POST
4. Copia la URL del webhook
5. Pega esa URL en `N8N_WEBHOOK_URL` en Vercel

### 4.2 Estructura del webhook que recibe n8n:

```json
{
  "nombre": "Diego Gutiérrez",
  "correo": "diego@aie.build",
  "whatsapp": "+506 8851 0692",
  "respuestas": "RESPUESTAS FORMATEADAS...",
  "resumen_ia": "RESUMEN GENERADO POR CLAUDE...",
  "datos_completos": { /* todos los datos */ },
  "timestamp": "2024-01-15T10:30:00Z",
  "origen": "cuestionario-aie-premium"
}
```

---

## 📧 Paso 5: Crear Flujo en n8n para Enviar Emails

### Flujo simple en n8n:

```
Webhook (Recibir) 
  ↓
Gmail / SendGrid (Enviar email)
  ↓
Google Sheets / Database (Guardar)
```

### Ejemplo de template n8n (puedes importar):

```json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300],
      "typeVersion": 1,
      "webhookId": "aie-cuestionario",
      "httpMethod": "POST"
    },
    {
      "name": "Gmail",
      "type": "n8n-nodes-base.gmail",
      "position": [450, 300],
      "typeVersion": 2,
      "operation": "sendEmail",
      "parameters": {
        "to": "{{ $json.correo }}",
        "subject": "✓ Recibimos tu cuestionario - AIE Constructora",
        "htmlBody": "<h2>Hola {{ $json.nombre }},</h2><p>Recibimos tus respuestas. Aquí está el resumen:</p><pre>{{ $json.resumen_ia }}</pre><p>Contactaremos pronto.</p><p>— Equipo Azloom</p>"
      }
    }
  ]
}
```

---

## 🧪 Paso 6: Probar el Flujo

### Test local (antes de Vercel):
```bash
npm install
node api/submit-form.js
```

### Test en Vercel:
1. Abre tu formulario: `https://tu-proyecto.vercel.app`
2. Completa el cuestionario
3. Haz click en "Enviar cuestionario"
4. Chequea:
   - Los logs de Vercel (Settings → Functions)
   - Tu webhook de n8n (debería recibir los datos)
   - Tu email (debería llegar el resultado)

---

## 🔍 Debugging

### Ver logs en Vercel:
```bash
vercel logs
```

### Ver errores de la API:
- Abre DevTools (F12) en el navegador
- Tab de Network
- Busca la request a `/api/submit-form`
- Revisa la respuesta

### Si n8n no recibe:
1. Verifica que la URL esté correcta en Vercel
2. Prueba el webhook manualmente con curl:
```bash
curl -X POST https://tu-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

---

## 📊 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                   Cliente (navegador)                   │
│                  formulario HTML/CSS/JS                 │
└────────────────────────┬────────────────────────────────┘
                         │ POST /api/submit-form
┌────────────────────────▼────────────────────────────────┐
│                    Vercel Serverless                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │  1. Recibe datos del formulario                 │   │
│  │  2. Llama Claude API para resumen               │   │
│  │  3. Formatea respuestas bonitas                 │   │
│  │  4. Envía todo a n8n webhook                    │   │
│  └──────────────────────────────────────────────────┘   │
└────────────┬───────────────────────────┬────────────────┘
             │                           │
             │ POST webhook              │ Respuesta
             │                           │
┌────────────▼─────────────────────────▼─────────────────┐
│                      n8n Workflow                       │
│  ┌────────────────────────────────────────────────┐    │
│  │  1. Recibe datos del cliente + resumen        │    │
│  │  2. Envía email con respuestas + resumen      │    │
│  │  3. Guarda en base de datos / Google Sheets   │    │
│  │  4. Notifica al equipo de Azloom              │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Personalización

### Cambiar email de contacto:
En `api/submit-form.js` línea 180, edita la dirección.

### Cambiar el prompt de Claude:
En `api/submit-form.js` línea 6-60, edita el prompt del resumen.

### Cambiar colores del formulario:
En `public/cuestionario-aie-constructora-premium.html` línea 12-25, edita las variables CSS.

---

## 📝 Estructura del Proyecto

```
.
├── public/
│   └── cuestionario-aie-constructora-premium.html
├── api/
│   └── submit-form.js                   ← Lógica principal
├── vercel.json                          ← Config de Vercel
├── package.json                         ← Dependencias
├── .env.example                         ← Variables de ejemplo
└── README.md                            ← Este archivo
```

---

## ✅ Checklist de Despliegue

- [ ] Proyecto en GitHub (o listo para descargar en Vercel)
- [ ] API Key de Anthropic obtenida y copiada
- [ ] Variables agregadas en Vercel
- [ ] Webhook de n8n creado
- [ ] Flujo de email configurado en n8n
- [ ] Test del formulario completado
- [ ] Email recibido con resumen

---

## 🚨 Errores Comunes

### "CLAUDE_API_KEY is not defined"
- ✅ Revisa que la variable esté en Vercel Environment Variables
- ✅ Haz redeploy después de agregar variables

### "N8n webhook returns 404"
- ✅ Verifica que la URL sea correcta en Vercel
- ✅ Asegúrate que el webhook esté activo en n8n

### "El email no llega"
- ✅ Revisa la bandeja de spam
- ✅ Verifica que Gmail/SendGrid esté autenticado en n8n
- ✅ Revisa los logs de n8n

---

## 📞 Soporte

Si tienes dudas:
- 📧 Email: hello@azloom.tech
- 🌐 Docs: https://www.azloom.tech

---

**Versión:** 1.0.0  
**Última actualización:** 2024  
**Licencia:** © Azloom 2024
