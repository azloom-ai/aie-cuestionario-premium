# ⚡ Setup Rápido - Cuestionario AIE en Vercel + n8n

## 🎯 En 30 minutos tendrás todo funcionando

### ✅ Checklist Previa
- [ ] Cuenta en Vercel.com (es gratuita)
- [ ] Cuenta en n8n.io o versión self-hosted
- [ ] API Key de Anthropic (Claude)
- [ ] Una cuenta de Gmail o SendGrid

---

## 🚀 PASO 1: Preparar Variables (5 min)

### 1.1 Obtener API Key de Claude
1. Ve a https://console.anthropic.com/
2. Login o crea cuenta
3. Copia tu API Key (empieza con `sk-ant-`)
4. **Guárdala en un lugar seguro**

### 1.2 Obtener Webhook de n8n
1. En tu n8n, crea un nuevo workflow
2. Agrega un nodo **Webhook** (tipo POST)
3. Copia la URL completa
4. Ejemplo: `https://tu-n8n.example.com/webhook/aie-cuestionario`

---

## 🌐 PASO 2: Subir a Vercel (10 min)

### Opción Fácil: Drag & Drop
1. Ve a https://vercel.com
2. Login con GitHub/Google
3. Click en "Add New..." → "Project"
4. Selecciona "Other" o carga desde carpeta
5. Sube la carpeta del proyecto
6. Click "Deploy"

### Opción Pro: Git + Vercel
```bash
# Entra a la carpeta
cd tu-proyecto-aie

# Inicia Git
git init
git add .
git commit -m "Initial: AIE Cuestionario Premium"

# Sube a GitHub
git remote add origin https://github.com/TU-USUARIO/aie-cuestionario.git
git push -u origin main

# Conecta en Vercel
# Ve a https://vercel.com/new y selecciona tu repo
```

### Después de Deploy
Vercel te da una URL tipo: `https://aie-cuestionario.vercel.app`

---

## 🔐 PASO 3: Configurar Variables en Vercel (5 min)

1. Ve a tu proyecto en Vercel
2. **Settings** → **Environment Variables**
3. Agrega 3 variables:

| Variable | Valor |
|----------|-------|
| `CLAUDE_API_KEY` | `sk-ant-tu-clave-aqui` |
| `N8N_WEBHOOK_URL` | `https://tu-n8n.example.com/webhook/aie-cuestionario` |
| `CONTACT_EMAIL` | `hello@azloom.tech` |

4. **Redeploy:** Settings → Deployments → Botón "Redeploy"
5. Espera ~1 min a que termine

---

## 🔗 PASO 4: Configurar n8n Webhook (5 min)

### En tu instancia de n8n:

```
1. Nuevo Workflow
   ↓
2. Agrega nodo Webhook (POST)
   ↓
3. Copia la URL
   ↓
4. Pégala en Vercel (variable N8N_WEBHOOK_URL)
   ↓
5. Agrega nodo Gmail o SendGrid
   ↓
6. Configura email de salida
   ↓
7. Activa el webhook
```

### JSON para importar workflow:
Ve a **Settings** (⚙️) en el workflow → **Import from JSON**
Copia el contenido de `n8n-workflow-template.json`

---

## 📧 PASO 5: Configurar Emails (5 min)

### Opción A: Gmail (Más fácil)
1. En n8n, agrega nodo **Gmail**
2. Autentica tu cuenta de Gmail
3. Asegúrate que tengas habilitada autenticación de apps
4. Usa este email template en el nodo:

```html
<h2>Hola {{ $json.nombre }},</h2>

<p>Gracias por completar el cuestionario. Aquí está el análisis:</p>

<h3>📊 Resumen IA</h3>
<pre>{{ $json.resumen_ia }}</pre>

<h3>📋 Tus Respuestas</h3>
<pre>{{ $json.respuestas }}</pre>

<p>Contactaremos pronto.</p>
<p>— Equipo Azloom</p>
```

### Opción B: SendGrid
1. Crea cuenta en SendGrid
2. Obtén tu API Key
3. En n8n, agrega nodo SendGrid
4. Pega la misma estructura de email arriba

---

## 🧪 PASO 6: Hacer Test (5 min)

### Test 1: Ver que el formulario carga
1. Ve a `https://tu-proyecto.vercel.app`
2. Deberías ver el formulario bonito
3. Intenta escribir algo en los campos

### Test 2: Enviar respuesta
1. Completa todo el formulario
2. Haz click en "Enviar cuestionario"
3. Deberías ver la pantalla de "¡Gracias!"

### Test 3: Verificar que llegó a n8n
1. Ve a tu workflow en n8n
2. Busca **Executions**
3. Deberías ver una ejecución reciente con éxito

### Test 4: Verificar email
1. Revisa tu bandeja (puede ir a Spam)
2. Deberías recibir email con respuestas + resumen

---

## 🔍 Debugging si no funciona

### "Formulario no carga"
```bash
# Verifica que Vercel deployó
vercel ls

# Ve a los logs
vercel logs
```

### "No llega a n8n"
1. Verifica la URL en Vercel (Settings → Environment Variables)
2. Testea el webhook manualmente:
```bash
curl -X POST https://tu-n8n-webhook-url \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'
```

### "Error de Claude API"
1. Verifica que la API Key sea correcta
2. Revisa que tengas créditos en Anthropic
3. Ve los logs de Vercel: `vercel logs`

### "Email no llega"
1. Revisa Spam / Junk
2. Verifica que Gmail esté autenticada en n8n
3. Chequea los logs del workflow en n8n

---

## 📊 Flujo Completo

```
Cliente llena formulario
     ↓
     └─→ Frontend valida
          ↓
          └─→ POST a /api/submit-form
               ↓
               ├─→ Claude genera resumen (3-5 seg)
               ├─→ Formatea respuestas
               └─→ POST a webhook de n8n
                    ↓
                    ├─→ Gmail: Envía a cliente
                    ├─→ Gmail: Notifica equipo
                    └─→ Google Sheets: Guarda registro
```

---

## 📞 URLs Importantes

| Servicio | URL |
|----------|-----|
| Tu formulario | `https://aie-cuestionario.vercel.app` |
| Panel Vercel | https://vercel.com/dashboard |
| Consola Claude | https://console.anthropic.com/ |
| Panel n8n | Tu instancia de n8n |
| Google Sheets | https://sheets.google.com (si lo usas) |

---

## ✅ Listo para Producción

Una vez que todo funcione:

1. ✅ Prueba con 3-4 respuestas de verdad
2. ✅ Verifica que los emails lleguen bien
3. ✅ Comparte el link con tu cliente: `https://aie-cuestionario.vercel.app`
4. ✅ Monitorea los logs de Vercel los primeros días
5. ✅ Celebra 🎉 (¡lo hiciste!)

---

## 🎓 Próximos Pasos (Opcional)

- [ ] Customizar colores del formulario
- [ ] Agregar más preguntas
- [ ] Integrar con CRM (Pipedrive, HubSpot)
- [ ] Crear dashboard de respuestas
- [ ] Automatizar seguimiento

---

**¿Problemas?** Revisa el README.md completo o contacta a hello@azloom.tech
