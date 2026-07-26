# 📥 Importar Workflow en n8n

Sigue estos pasos exactos para importar el workflow completo.

---

## PASO 1: Descarga el JSON

El archivo está aquí:
📄 **n8n-workflow-aie-completo.json**

(Está en tu carpeta del proyecto)

---

## PASO 2: Ve a tu n8n

→ https://azloomn8n-azloomn8n.ydeb8o.easypanel.host

---

## PASO 3: Importa el Workflow

### 3.1 En la página principal de n8n
- Click en **"Workflows"** (izquierda)
- O click en **"+"** para nuevo workflow

### 3.2 Click en **"Import"** (arriba a la derecha)
(o busca el ícono de importar)

### 3.3 Click en **"Select file"**
Selecciona: `n8n-workflow-aie-completo.json`

### 3.4 Click "Import from file"

### 3.5 Espera a que cargue
(tarda 2-3 segundos)

---

## PASO 4: Configura Gmail

El workflow necesita **autenticación de Gmail** para enviar emails.

### 4.1 En el workflow, busca el nodo azul: **"Gmail - Cliente"**

### 4.2 Click en el nodo

### 4.3 Mira el lado derecho, donde dice:
**"Authentication"** → debe decir **"oAuth2"**

### 4.4 Click en **"Authenticate"** (si está en rojo)

### 4.5 Selecciona tu cuenta de Gmail
(la que tiene hello@azloom.tech)

### 4.6 Click "Allow" para autorizar n8n

### 4.7 Repetir para **"Gmail - Equipo"**
(el otro nodo Gmail, hace lo mismo)

---

## PASO 5: Activa el Webhook

### 5.1 En el workflow, busca el nodo rojo: **"Webhook"**

### 5.2 Click en el nodo

### 5.3 Mira donde dice: **"Webhook URL"**
Copia esa URL completa.

**Ejemplo:**
```
https://azloomn8n-azloomn8n.ydeb8o.easypanel.host/webhook/aie-cuestionario
```

### 5.4 **Guarda esta URL**, la necesitas para Vercel

---

## PASO 6: Activa el Workflow

### 6.1 Arriba a la derecha, busca el switch
**"Active"** o **"Enable"**

### 6.2 Hazlo click
Debe cambiar a **GREEN** ✅

---

## ✅ LISTO!

Ahora tienes:

✅ Workflow importado  
✅ Gmail configurado  
✅ Webhook activo  
✅ URL del webhook lista  

---

## 🔗 COPIA ESTA URL

La URL del webhook es:
```
https://azloomn8n-azloomn8n.ydeb8o.easypanel.host/webhook/aie-cuestionario
```

**Pégala en Vercel cuando hagas el deploy.**

---

## 🆘 Si Algo Falla

### "El import no funciona"
→ Verifica que el archivo sea válido
→ Intenta descargarlo de nuevo

### "Gmail dice error de autenticación"
→ Asegúrate que estés autenticando con la cuenta correcta
→ Habilita "Less secure app access" en tu Gmail (si es necesario)

### "El webhook no muestra URL"
→ Actualiza la página (F5)
→ El webhook debe estar en el workflow

### "No puedo activar el workflow"
→ Primero debe estar correctamente configurado
→ Verifica que no haya errores (símbolos rojos)

---

## 🎯 Siguientes Pasos

Cuando hayas terminado aquí:

1. **Copia la URL del webhook**
2. **Ve a Vercel** (siguiendo SETUP-VERCEL-AUTOMATICO.md)
3. **Pega la URL en la variable N8N_WEBHOOK_URL**
4. **Deploy**
5. **Test**
6. **¡LISTO! 🎉**

---

**¿Terminaste? Avísame que el webhook está activo y continúa con Vercel.**
