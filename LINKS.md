# 🔗 Links Rápidos

Todos los links que necesitas para configurar el proyecto.

---

## 📚 Documentación del Proyecto

| Link | Descripción |
|------|-------------|
| [INICIO-RAPIDO.html](./INICIO-RAPIDO.html) | **COMIENZA AQUÍ** - Guía visual paso a paso |
| [README.md](./README.md) | Documentación completa y detallada |
| [SETUP-RAPIDO.md](./SETUP-RAPIDO.md) | Setup en 30 minutos |
| [DEPLOY-CHECKLIST.md](./DEPLOY-CHECKLIST.md) | Checklist de deployment |
| [ESTRUCTURA.md](./ESTRUCTURA.md) | Cómo funciona todo internamente |

---

## 🛠️ Herramientas Necesarias

### Cuentas a Crear (GRATIS)

| Servicio | Link | Para Qué |
|----------|------|----------|
| **Vercel** | https://vercel.com | Hospedaje del formulario |
| **GitHub** | https://github.com | Almacenamiento del código |
| **Anthropic (Claude)** | https://console.anthropic.com | IA para resúmenes |
| **n8n** | https://n8n.io | Automatización de workflows |
| **Gmail** | https://mail.google.com | Envío de emails |

---

## 🔐 Obtener Credenciales

### 1. API Key de Claude
**Paso a paso:**
1. Ve a → https://console.anthropic.com/
2. Login o crea cuenta
3. Click izquierda → "API Keys"
4. Click "Create Key"
5. Copia: `sk-ant-xxxxx`

**Link directo:** https://console.anthropic.com/

---

### 2. Webhook de n8n
**Paso a paso:**
1. Ve a tu instancia de n8n
2. Crea un nuevo workflow
3. Agrega nodo "Webhook"
4. Asegúrate que sea POST
5. Copia la URL

**Ejemplo:** `https://tu-n8n.example.com/webhook/aie-cuestionario`

---

### 3. GitHub Token (Opcional)
**Si necesitas automatizar:**
1. Ve a → https://github.com/settings/tokens
2. Click "Generate new token"
3. Dale nombre: `aie-cuestionario`
4. Permisos: repo, workflow
5. Copia el token

**Link directo:** https://github.com/settings/tokens

---

## 🚀 Deployment

### Paso 1: Crear Repo en GitHub
→ https://github.com/new

**Nombre:** `aie-cuestionario-premium`

---

### Paso 2: Conectar a Vercel
→ https://vercel.com/new

**Autoriza GitHub** → Selecciona repo → Deploy

---

### Paso 3: Agregar Variables en Vercel
1. https://vercel.com/dashboard
2. Tu proyecto → Settings → Environment Variables
3. Agrega:
   - `CLAUDE_API_KEY`
   - `N8N_WEBHOOK_URL`
   - `CONTACT_EMAIL`

---

## 📧 Configurar Emails

### Gmail en n8n
1. n8n → Nodo Gmail
2. Click "Authenticate" → Gmail OAuth
3. Autoriza tu cuenta
4. Listo para enviar

**Documentación n8n Gmail:** https://docs.n8n.io/integrations/builtin/credentials/gmail/

---

### SendGrid (Alternativa)
1. Crea cuenta → https://sendgrid.com
2. Obtén API Key
3. Usa en n8n SendGrid node

**Documentación SendGrid:** https://docs.sendgrid.com/

---

## 🔗 Webhooks y APIs

### Tu Formulario (después de deploy)
```
https://tu-proyecto.vercel.app
```

### API Endpoint
```
https://tu-proyecto.vercel.app/api/submit-form (POST)
```

### n8n Webhook
```
Tu webhook URL (obtenida en n8n)
```

---

## 📊 Monitoring

### Ver Logs de Vercel
```bash
vercel logs
```

### Dashboard Vercel
→ https://vercel.com/dashboard

### Executions en n8n
→ Tu instancia n8n → Workflows → Tu workflow → Executions

### Gmail
→ https://mail.google.com

---

## 📖 Documentación Externa

| Recurso | Link |
|---------|------|
| Docs de Vercel | https://vercel.com/docs |
| Docs de Claude AI | https://docs.anthropic.com |
| Docs de n8n | https://docs.n8n.io |
| Docs de GitHub | https://docs.github.com |

---

## 🆘 Soporte

| Servicio | Soporte |
|----------|---------|
| Vercel | https://vercel.com/support |
| Claude / Anthropic | hello@anthropic.com |
| n8n | https://community.n8n.io |
| GitHub | https://github.com/contact |

---

## 🎯 Resumen de URLs Importantes

### Por Orden de Setup

1. **Crear API Keys:**
   - https://console.anthropic.com/ (Claude)
   - Tu n8n (Webhook)

2. **Crear Cuenta en Vercel:**
   - https://vercel.com

3. **Crear Repo en GitHub:**
   - https://github.com/new

4. **Deploy en Vercel:**
   - https://vercel.com/new

5. **Configurar Variables:**
   - https://vercel.com/dashboard

6. **Configurar n8n:**
   - Tu instancia n8n

7. **Testear:**
   - Tu URL de Vercel

---

**¿Listo?** Comienza con [INICIO-RAPIDO.html](./INICIO-RAPIDO.html) 🚀
