# ✅ VERIFICAR QUE TODO FUNCIONA

Tu sistema está deployado. Ahora vamos a verificar que TODO funciona correctamente paso a paso.

---

## 🧪 PASO 1: TEST LOCAL (5 min)

### 1.1 Ejecuta el Test

En tu carpeta, busca: **TEST-LOCAL.bat**

Haz **doble click** en él.

**Qué hace:**
- ✅ Verifica que Claude API funciona
- ✅ Genera un resumen automáticamente
- ✅ Intenta enviar datos al webhook de n8n
- ✅ Verifica toda la integración

### 1.2 Qué deberías ver

```
✅ NODE.JS ENCONTRADO
✅ CLIENTE DE ANTHROPIC CREADO
✅ API KEY CONFIGURADA
✅ RESPUESTA DE CLAUDE RECIBIDA EN 2500MS
✅ RESUMEN GENERADO POR IA (largo y detallado)
✅ WEBHOOK DE n8n (status 200 o similar)
✅ TEST EXITOSO - El sistema está funcionando correctamente
```

### 1.3 Si algo falla

**"CLAUDE_API_KEY no encontrada"**
→ Ejecuta este comando en PowerShell:
```powershell
$env:CLAUDE_API_KEY = "tu-clave-aqui"
```
(Copia tu API key de https://console.anthropic.com/)

**"Webhook error"**
→ Es normal si estás detrás de NAT/firewall. Vercel puede enviar pero tu PC no.

---

## 🌐 PASO 2: VERIFICAR EN VERCEL (5 min)

### 2.1 Abre tu Dashboard de Vercel

→ https://vercel.com/dashboard

### 2.2 Click en tu proyecto

`aie-cuestionario-premium`

### 2.3 Click en "Function Logs"

Allí ves los logs en tiempo real de tu API.

### 2.4 Verifica las Variables

Click en "Settings" → "Environment Variables"

Deberías ver 3 variables:
```
✅ CLAUDE_API_KEY (con valor)
✅ N8N_WEBHOOK_URL (con URL)
✅ CONTACT_EMAIL (hello@azloom.tech)
```

Si falta alguna:
1. Click "Add New"
2. Rellena Name y Value
3. Click "Save"
4. **IMPORTANTE:** Redeploy el proyecto

---

## 📝 PASO 3: TEST DEL FORMULARIO (5 min)

### 3.1 Abre tu URL

Tu URL en Vercel, tipo:
```
https://aie-cuestionario-xxxxx.vercel.app
```

### 3.2 Completa el formulario

**Importante:** Llena TODAS las preguntas con algo

```
Nombre: Diego Test
Email: diego@test.com
WhatsApp: +506 8851 0692
Módulos: Selecciona al menos uno
Otros sistemas: Escribe algo
Num proveedores: 50
Canales: Selecciona Email
Acceso proveedores: Selecciona Sí
Quién aprueba: Gerente
Dónde se paga: Banco
Días de crédito: 30
Doble digitación: Selecciona Sí
Frecuencia: Semanal
Facturado vs usado: Selecciona algo
Control bodega: Selecciona algo
Dolor de cabeza: Escribe un problema
Visión ideal: Escribe una solución
```

### 3.3 Click "Enviar cuestionario"

**Espera 5-10 segundos** (Claude está analizando)

### 3.4 Deberías ver

```
✅ "¡Gracias, Diego!"
✅ La página se recarga o muestra confirmación
```

Si no ves nada:
→ Ve a PASO 5 (Debugging)

---

## 📧 PASO 4: VERIFICAR EMAIL (5 min)

### 4.1 Abre Gmail

→ hello@azloom.tech

### 4.2 Busca nuevo email

**IMPORTANTE:** Revisa también SPAM

### 4.3 Deberías ver:

Email con asunto tipo:
```
Cuestionario recibido: Diego Test
```

**Contenido:**
- ✅ Tu nombre
- ✅ Tu email
- ✅ Tu whatsapp
- ✅ LAS RESPUESTAS que escribiste
- ✅ RESUMEN GENERADO POR IA (lo más importante)

---

## 🔍 PASO 5: DEBUGGING SI ALGO FALLA

### Problema: "El formulario no carga"

**Solución:**
1. Espera 5 minutos (Vercel puede estar deployando)
2. Recarga la página (F5)
3. Verifica que la URL sea correcta (en Vercel Dashboard)
4. Revisa "Function Logs" en Vercel → busca errores rojo

**Si ves error:**
→ Copia el error y ve a PASO 6

### Problema: "El formulario carga pero no envía"

**Solución:**
1. Abre Navegador → F12 (Inspect)
2. Click "Console"
3. Mira si hay errores rojo
4. Intenta enviar el formulario
5. Copia cualquier error

**Si ves error:**
→ Copia el error y ve a PASO 6

### Problema: "El formulario envía pero dice error"

**Solución:**
1. Verifica en Vercel → Function Logs
2. Busca líneas con "ERROR"
3. Lee el mensaje de error
4. Ve a PASO 6 según el error

### Problema: "No llega email"

**Posibles causas:**

**Causa 1: Webhook de n8n no activo**
- Verifica que n8n esté running
- Verifica que el Workflow esté ACTIVE
- Verifica que el nodo Webhook esté correcto

**Causa 2: Email incorrecto**
- En Vercel → Settings → Environment Variables
- Busca: `CONTACT_EMAIL`
- Debería ser: `hello@azloom.tech`

**Causa 3: n8n no está enviando email**
- Verifica en n8n → Workflow
- Revisa los nodos de email
- Busca si hay errores en la ejecución

---

## 🐛 PASO 6: DEBUGGING AVANZADO

### 6.1 Ver Logs de Vercel

1. Vercel Dashboard
2. Tu proyecto
3. Click "Deployments"
4. Busca la última (con check ✅)
5. Click en ella
6. Click "Logs" arriba
7. Ve a la parte inferior
8. Busca líneas nuevas cuando haces request

### 6.2 Cuando completes el formulario

1. Abre Vercel Logs
2. Completa el formulario
3. Haz click Enviar
4. **INMEDIATAMENTE** mira los logs
5. Deberías ver:

```
📨 Datos recibidos: { nombre, correo, ... }
🤖 Generando resumen con Claude...
✅ Resumen generado
🔗 Enviando a n8n...
📍 URL: https://...
✅ N8n respondió con status: 200
✅ Datos enviados a n8n correctamente
```

### 6.3 Si ves errores

**Error: "CLAUDE_API_KEY is undefined"**
→ La variable no está configurada en Vercel
→ Ve a Settings → Environment Variables
→ Agrega CLAUDE_API_KEY

**Error: "N8N_WEBHOOK_URL is not configured"**
→ La variable no está configurada
→ Ve a Settings → Environment Variables
→ Agrega N8N_WEBHOOK_URL

**Error: "N8n respondió con: 401"**
→ El webhook URL es incorrecto o n8n no está running
→ Verifica la URL en el nodo Webhook de n8n

**Error: "N8n respondió con: 404"**
→ La URL existe pero no el webhook
→ Verifica que creaste el nodo Webhook correctamente en n8n

**Error: "timeout"**
→ n8n tardó demasiado o está caído
→ Verifica que n8n esté corriendo

---

## ✅ CHECKLIST DE VERIFICACIÓN

### Test Local
- [ ] Ejecuté TEST-LOCAL.bat
- [ ] Vi "✅ TEST EXITOSO"
- [ ] Se mostró un resumen largo y detallado

### Vercel Configuration
- [ ] Mi proyecto está en Vercel
- [ ] Veo 3 variables de entorno (CLAUDE_API_KEY, N8N_WEBHOOK_URL, CONTACT_EMAIL)
- [ ] El último deployment tiene ✅ (green checkmark)

### Formulario
- [ ] La URL carga el formulario
- [ ] El formulario se ve bonito (no tiene errores)
- [ ] Puedo llenar todas las preguntas
- [ ] El botón "Enviar" está habilitado

### Claude AI
- [ ] Al enviar, espero 5-10 segundos
- [ ] Se genera un resumen (lo veo en el email o en Vercel logs)
- [ ] El resumen es útil y detallado

### Webhook n8n
- [ ] En Vercel logs veo "Datos enviados a n8n correctamente"
- [ ] O veo "N8n respondió con status: 200"

### Email
- [ ] Recibí un email en hello@azloom.tech
- [ ] El email tiene mi nombre y respuestas
- [ ] El email tiene el resumen generado por IA

### RESULTADO FINAL
- [ ] ✅ ¡¡¡TODO FUNCIONA CORRECTAMENTE!!!

---

## 🎯 RESUMEN RÁPIDO

```
1. TEST-LOCAL.bat → Verifica integración local
2. Vercel Dashboard → Verifica variables
3. Abre formulario → Completa y envía
4. Vercel Logs → Mira los logs en tiempo real
5. Gmail → Verifica que llegó el email
6. ¡LISTO!
```

---

## 📞 SI NADA FUNCIONA

Recolecta esta información:

1. **Screenshot de Vercel Logs** cuando hagas un request
2. **Screenshot de la consola del navegador** (F12 → Console)
3. **El error exacto** que ves (copia y pega)
4. **Tu URL de Vercel**
5. **Tu N8N_WEBHOOK_URL**

Con eso podré ayudarte en segundos.

---

**¡Vamos! Ejecuta TEST-LOCAL.bat ahora mismo** 🚀
