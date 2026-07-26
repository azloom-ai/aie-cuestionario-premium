# ⚡ Setup Automático en Vercel

Sigue estos pasos exactamente en orden.

---

## PASO 1: Crear Repo en GitHub (2 min)

### 1.1 Ve a GitHub
→ https://github.com/new

### 1.2 Llena el formulario
```
Repository name: aie-cuestionario-premium
Description: Cuestionario con Claude AI y n8n
Visibility: Public
```

### 1.3 Click "Create repository"

### 1.4 GitHub te muestra unos comandos
**NO** hagas nada con ellos, solo cierra esa pantalla.

---

## PASO 2: Deploy a Vercel (3 min)

### 2.1 Ve a Vercel
→ https://vercel.com/new

### 2.2 Click "Continue with GitHub"
Si pide autorizar Vercel en GitHub, autoriza.

### 2.3 Busca tu repo
Escribe: `aie-cuestionario-premium`
Click en el resultado.

### 2.4 Click "Import"

### 2.5 Vercel detecta la configuración automáticamente
(no necesitas cambiar nada)

### 2.6 **IMPORTANTE: Antes de hacer click Deploy**

Scroll hacia abajo y busca: **"Environment Variables"**

Agrega 3 variables:

```
Name: CLAUDE_API_KEY
Value: sk-ant-YOUR-API-KEY-HERE
```

Click "Add" ✅

```
Name: N8N_WEBHOOK_URL
Value: https://azloomn8n-azloomn8n.ydeb8o.easypanel.host/webhook/XXXXXX
(reemplaza XXXXXX con el webhook que falta)
```

Click "Add" ✅

```
Name: CONTACT_EMAIL
Value: hello@azloom.tech
```

Click "Add" ✅

### 2.7 Click "Deploy" (azul, abajo)

**Espera 2-3 minutos** ⏳

---

## PASO 3: Esperar a que Termine (3 min)

Vercel muestra una barra de progreso.

Cuando veas: **"Congratulations! Your project has been successfully deployed"**

Tu URL aparece arriba, tipo: `https://aie-cuestionario-xxxxx.vercel.app`

---

## PASO 4: Verificar que Funciona (5 min)

### 4.1 Abre tu URL en el navegador
`https://aie-cuestionario-xxxxx.vercel.app`

### 4.2 Deberías ver el formulario bonito
(Si no carga, revisa que las variables estén correctas en Vercel)

### 4.3 Completa el formulario
- Nombre: Diego Gutiérrez
- Email: diego@aie.build
- WhatsApp: +506 8851 0692
- **TODAS las preguntas** ← responde algo en cada una

### 4.4 Click "Enviar cuestionario"

### 4.5 Espera 5-10 segundos
(Claude está analizando)

### 4.6 Deberías ver: "¡Gracias, Diego!"
✅ ¡Funciona!

---

## PASO 5: Verificar Email (2 min)

### 5.1 Abre Gmail
→ hello@azloom.tech

### 5.2 Busca email nuevo
**Revisa también SPAM**

### 5.3 Deberías ver:
- ✅ Tu nombre
- ✅ Las respuestas que escribiste
- ✅ Resumen generado por IA

Si todo está → **¡¡¡LISTO!!!** 🎉

---

## 🆘 Si Algo Sale Mal

### "La página no carga (404)"
→ Espera 5 minutos más, Vercel a veces tarda.

### "Error de API"
→ Verifica que CLAUDE_API_KEY esté correcta en Vercel.

### "No llega email"
→ Revisa SPAM. Si no está, el webhook de n8n no está configurado correctamente.

### "El webhook URL dice que es inválido"
→ Necesitas crear el nodo Webhook en n8n correctamente. Ve a tu n8n, crea un nodo Webhook, copia la URL que te da.

---

## ✅ CHECKLIST

```
□ Repo creado en GitHub
□ Deployado en Vercel
□ Variables agregadas
□ Deployment completado
□ Formulario carga
□ Puedo enviar respuestas
□ Email recibido
□ Email tiene respuestas + resumen
□ ¡¡¡LISTO!!! 🎉
```

---

**¿LISTO? Comienza con PASO 1** 🚀
