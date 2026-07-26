# ✅ Checklist de Deployment - Listo para Producción

Copia este checklist y completa cada paso. Tachando items mientras avanzes.

---

## 🔐 PASO 1: Obtener Credenciales (10 min)

### Anthropic Claude API
- [ ] Ve a https://console.anthropic.com/
- [ ] Login / Crea cuenta
- [ ] Click en "API Keys" (lado izquierdo)
- [ ] Click en "Create Key"
- [ ] Copia la key completa: `sk-ant-...`
- [ ] Guarda en lugar seguro (NO en GitHub)
- [ ] ✅ KEY: `sk-ant-____________________`

### n8n Webhook
- [ ] Entra a tu n8n (cloud o self-hosted)
- [ ] Crea un nuevo workflow
- [ ] Agrega nodo "Webhook"
- [ ] Asegúrate que sea POST
- [ ] Copia la URL completa
- [ ] ✅ WEBHOOK: `https://n8n._______________`

### Email de Contacto
- [ ] Define tu email para recibir notificaciones
- [ ] ✅ EMAIL: `hello@azloom.tech`

---

## 🚀 PASO 2: Crear Cuenta en Vercel (5 min)

- [ ] Ve a https://vercel.com
- [ ] Click en "Sign Up"
- [ ] Elige: GitHub, Google, o Email
- [ ] Completa el registro
- [ ] Verifica tu email
- [ ] ✅ Cuenta creada

---

## 📤 PASO 3: Preparar Repositorio en GitHub (5 min)

### Opción A: Si ya tienes Git instalado
```bash
# Copia estas líneas en tu terminal una por una

cd "c:\Users\nicolas\Desktop\clientes\AIE OS Presentacion"

git status

# Si todo está bien, continúa:
```

### Opción B: Crear repo en GitHub
- [ ] Ve a https://github.com/new
- [ ] Nombre: `aie-cuestionario-premium`
- [ ] Descripción: "Sistema de cuestionario con Claude AI y n8n"
- [ ] Selecciona: Public (para facilitar)
- [ ] Click "Create repository"
- [ ] Copia los comandos que te muestra
- [ ] ✅ Repo creado: `https://github.com/TU-USUARIO/aie-cuestionario-premium`

---

## 🌐 PASO 4: Conectar Vercel + GitHub (5 min)

- [ ] Ve a https://vercel.com/new
- [ ] Click en "Continue with GitHub"
- [ ] Autoriza Vercel a acceder a tus repos
- [ ] Busca `aie-cuestionario-premium`
- [ ] Click "Import"
- [ ] Vercel detecta automáticamente la config
- [ ] ✅ Click "Deploy" 🚀

---

## 🔐 PASO 5: Agregar Variables de Entorno (3 min)

Una vez que Vercel deployó:

1. Ve a tu proyecto en https://vercel.com/dashboard
2. Click en tu proyecto `aie-cuestionario-premium`
3. Click en **Settings** (arriba)
4. Click en **Environment Variables** (lado izquierdo)
5. Agrega 3 variables:

### Variable 1: CLAUDE_API_KEY
- **Name:** `CLAUDE_API_KEY`
- **Value:** `sk-ant-xxxxx` (tu API key de Anthropic)
- Click "Add"

### Variable 2: N8N_WEBHOOK_URL
- **Name:** `N8N_WEBHOOK_URL`
- **Value:** `https://n8n.....webhook.....` (tu webhook de n8n)
- Click "Add"

### Variable 3: CONTACT_EMAIL
- **Name:** `CONTACT_EMAIL`
- **Value:** `hello@azloom.tech`
- Click "Add"

**Resultado esperado:**
```
✅ CLAUDE_API_KEY
✅ N8N_WEBHOOK_URL
✅ CONTACT_EMAIL
```

---

## 🔄 PASO 6: Redeploy con Variables (2 min)

- [ ] En Settings, scroll hasta arriba
- [ ] Click en **Deployments** (lado izquierdo)
- [ ] Busca el deployment más reciente
- [ ] Click en los 3 puntos (...) → "Redeploy"
- [ ] Vercel despliega con las variables
- [ ] Espera a que termine (1-2 min)
- [ ] ✅ Status debe ser "Ready" (verde)

---

## 🧪 PASO 7: Test del Formulario (5 min)

### Test 1: Formulario Carga
- [ ] Copia tu URL de Vercel (tipo: `https://aie-cuestionario-xxxxx.vercel.app`)
- [ ] Abre en navegador
- [ ] ✅ Deberías ver el formulario bonito

### Test 2: Completar Formulario
- [ ] Completa TODAS las respuestas
- [ ] Escribe al menos 1 palabra en cada campo
- [ ] ✅ No debe haber campos vacíos

### Test 3: Enviar Respuesta
- [ ] Haz click en "Enviar cuestionario"
- [ ] Espera 5-10 segundos (Claude está analizando)
- [ ] ✅ Deberías ver pantalla "¡Gracias, Diego!"

### Test 4: Revisar Logs (Debugging)
Abre DevTools (F12) en el navegador:
- [ ] Tab "Console" - ¿hay errores rojos?
- [ ] Tab "Network" - busca `/api/submit-form`
- [ ] ✅ Status debe ser 200 (verde)

---

## 🔗 PASO 8: Configurar n8n Workflow (15 min)

### Opción A: Importar Template
1. En tu n8n, click en "Workflows"
2. Click en **Import**
3. Abre el archivo `n8n-workflow-template.json` (está en la carpeta)
4. Click "Import from file"
5. Espera a que cargue
6. ✅ Workflow importado

### Opción B: Crear Manual
Si no funciona la importación, crea así:

1. Nuevo Workflow
2. Agrega nodo **Webhook** (POST)
3. Copia la URL
4. Agrega nodo **Gmail** (Send Email)
5. Autentica tu cuenta Gmail
6. Completa el template de email (mira más abajo)
7. Agrega nodo **Google Sheets** (opcional, para guardar)
8. Activa el workflow

### Email Template para n8n

En el nodo Gmail, en campo "HTML Body", pega esto:

```html
<h2>Hola {{ $json.nombre }},</h2>

<p>Gracias por completar el cuestionario. Aquí está el análisis automático:</p>

<hr style="border:none; border-top:1px solid #ccc; margin:20px 0;">

<h3>📊 Resumen Ejecutivo (Generado por IA)</h3>

<pre style="background:#f5f5f5; padding:15px; border-radius:8px; white-space:pre-wrap; font-size:12px;">{{ $json.resumen_ia }}</pre>

<hr style="border:none; border-top:1px solid #ccc; margin:20px 0;">

<h3>📋 Tus Respuestas Completas</h3>

<pre style="background:#f5f5f5; padding:15px; border-radius:8px; white-space:pre-wrap; font-size:11px; max-height:500px; overflow:auto;">{{ $json.respuestas }}</pre>

<hr style="border:none; border-top:1px solid #ccc; margin:20px 0;">

<p><strong>Próximos pasos:</strong></p>
<ul>
<li>Nuestro equipo está revisando tus respuestas</li>
<li>Te contactaremos en los próximos 2-3 días</li>
<li>Llevaremos una propuesta concreta a la siguiente reunión</li>
</ul>

<p><strong>¿Preguntas?</strong> Contáctanos: <a href="mailto:hello@azloom.tech">hello@azloom.tech</a></p>

<p style="color:#888; font-size:12px; margin-top:30px;">— Equipo Azloom<br>Soluciones Premium de Tecnología</p>
```

- [ ] Pega en Gmail "HTML Body"
- [ ] Asegúrate que Gmail esté autenticada
- [ ] ✅ Prueba enviando test

---

## 📧 PASO 9: Test Email End-to-End (5 min)

1. Ve a tu formulario en Vercel
2. Completa el formulario ENTERO
3. Haz click en "Enviar cuestionario"
4. Espera 10 segundos
5. Revisa tu email (bandeja principal Y SPAM):
   - [ ] Email de n8n con respuestas + resumen
6. ✅ Email debe contener:
   - ✅ Tu nombre
   - ✅ Las respuestas que escribiste
   - ✅ Resumen generado por Claude

Si NO llega:
- [ ] Revisa carpeta SPAM
- [ ] Verifica en n8n → Executions → buscas el fallo
- [ ] Revisa logs de Vercel: `vercel logs`

---

## 🎯 PASO 10: Test de Verdad con Cliente (10 min)

Llama a tu cliente y pídele que:
1. [ ] Abra el link del formulario
2. [ ] Complete el cuestionario
3. [ ] Envíe las respuestas
4. [ ] Dile que revise su email

Verifica:
- [ ] Respuestas llegaron a n8n
- [ ] Cliente recibió email
- [ ] Resumen de IA es útil
- [ ] Todo funciona 🎉

---

## 📊 PASO 11: Monitorear en Producción (Diario)

Cada día durante 1 semana, revisa:

```
# Ver últimas respuestas
Vercel → Deployments → Activity

# Ver errores en n8n
n8n → Workflows → Executions

# Ver emails que llegaron
Gmail → Inbox
```

---

## 🎯 CHECKLIST FINAL

- [ ] Git repo inicializado ✅
- [ ] GitHub repo creado ✅
- [ ] Vercel account conectada ✅
- [ ] Variables de entorno agregadas ✅
- [ ] Vercel deployado y "Ready" ✅
- [ ] Formulario carga sin errores ✅
- [ ] API responde correctamente ✅
- [ ] n8n webhook recibe datos ✅
- [ ] Emails se envían ✅
- [ ] Resumen IA se genera ✅
- [ ] Cliente probó y funcionó ✅

---

## 🚀 ¡LISTO PARA PRODUCCIÓN!

Si todas las casillas están ✅, entonces:

1. Comparte el link con el cliente
2. Monitorea los primeros días
3. Ajusta si es necesario
4. ¡Celebra! 🎉

---

## 🆘 SOS - Errores Comunes

### "Formulario no carga"
→ Verifica que Vercel deployó correctamente (status "Ready")

### "API error / 500"
→ Revisa logs: `vercel logs`

### "Claude error"
→ Verifica que CLAUDE_API_KEY sea correcta y esté en Vercel

### "n8n no recibe"
→ Verifica que N8N_WEBHOOK_URL esté correcta

### "Email no llega"
→ Revisa SPAM, verifica que Gmail esté autenticada en n8n

### "Todo da error"
→ Lee README.md para debugging más profundo

---

**¿Dudas? Contáctame o revisa README.md** 💪
