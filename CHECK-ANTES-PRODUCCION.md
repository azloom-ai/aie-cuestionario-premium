# ✅ CHECK ANTES DE USAR CON CLIENTES

Antes de compartir tu URL con clientes, verifica estos puntos.

---

## 📋 CHECKLIST PRE-PRODUCCIÓN (15 min)

### SECCIÓN 1: VERCEL (5 min)

- [ ] Tu proyecto está en Vercel: https://vercel.com/dashboard
- [ ] El deployment está completo con ✅ (green checkmark)
- [ ] Settings → Environment Variables tiene 3 variables:
  - [ ] `CLAUDE_API_KEY` (no está vacío)
  - [ ] `N8N_WEBHOOK_URL` (URL completa)
  - [ ] `CONTACT_EMAIL` (hello@azloom.tech)
- [ ] No hay warning naranjas en el deployment
- [ ] Function Logs no muestra errores rojo

### SECCIÓN 2: FORMULARIO (5 min)

- [ ] Abre tu URL: `https://aie-cuestionario-xxxxx.vercel.app`
- [ ] El formulario carga correctamente
- [ ] El formulario se ve profesional y bonito
- [ ] El formulario es responsive (probé en mobile)
- [ ] Todos los campos funcionan
- [ ] El botón "Enviar" es visible y habilitado

### SECCIÓN 3: INTEGRACIÓN COMPLETA (5 min)

**Completa el formulario ENTERO:**
- [ ] Nombre: completo
- [ ] Email: válido
- [ ] WhatsApp: completo
- [ ] Módulos: selecciona al menos uno
- [ ] Otros sistemas: escribe algo
- [ ] Num proveedores: número
- [ ] Canales: selecciona al menos uno
- [ ] Acceso proveedores: selecciona sí/no
- [ ] Quién aprueba: escribe nombre
- [ ] Dónde se paga: selecciona opción
- [ ] Días de crédito: escribe número
- [ ] Doble digitación: selecciona sí/no
- [ ] Frecuencia informe: selecciona opción
- [ ] Facturado vs usado: selecciona opción
- [ ] Control bodega: selecciona opción
- [ ] Dolor de cabeza: escribe problema real
- [ ] Visión ideal: escribe solución ideal

**Envía:**
- [ ] Click "Enviar cuestionario"
- [ ] Espera 5-10 segundos
- [ ] Ves confirmación: "¡Gracias, [nombre]!"

**Verifica logs:**
- [ ] Abre Vercel Function Logs
- [ ] Ves: "📨 Datos recibidos"
- [ ] Ves: "🤖 Generando resumen con Claude"
- [ ] Ves: "✅ Resumen generado"
- [ ] Ves: "🔗 Enviando a n8n"
- [ ] Ves: "✅ Datos enviados a n8n correctamente"

**Verifica email:**
- [ ] Abre Gmail: hello@azloom.tech
- [ ] Recibiste email nuevo
- [ ] Email contiene tu nombre
- [ ] Email contiene un RESUMEN DETALLADO generado por IA
- [ ] Email se ve profesional

---

## 🎯 SECCIONES CLAVE POR CLIENTE

Si vas a usar con clientes de **Construcción**:

- [ ] Pregunta 1 (Módulos): Tiene opciones relevantes
- [ ] Pregunta 5 (Proveedores): Tiene sentido para su industria
- [ ] Pregunta 7 (Reportes): Apropiada para su negocio
- [ ] El resumen IA identifica problemas reales de construcción

Si vas a usar con clientes de **Otra industria**:

- [ ] Adapta las preguntas (en `public/cuestionario-aie-constructora-premium.html`)
- [ ] Adapta el prompt de Claude (en `api/submit-form.js`)
- [ ] Prueba de nuevo con datos de esa industria

---

## 🔒 SEGURIDAD

- [ ] NO pusheaste las API keys a GitHub
- [ ] Las API keys están SOLO en Vercel Environment Variables
- [ ] El archivo `.env` no está en Git
- [ ] No hay logs que muestren keys completas

**Verificar:**
```
1. GitHub repo
2. Busca "sk-ant-" en los commits
3. Si ves algo: ¡cambiar la API key inmediatamente!
```

---

## ⚡ PERFORMANCE

- [ ] El formulario carga en menos de 2 segundos
- [ ] El submit responde en menos de 15 segundos total
- [ ] El email llega en menos de 1 minuto
- [ ] No hay timeout errors

**Cómo verificar:**
1. F12 → Network tab
2. Completa formulario
3. Mira cuánto tarda cada request

---

## 📱 RESPONSIVIDAD

- [ ] Probé en desktop (1920x1080)
- [ ] Probé en tablet (768x1024)
- [ ] Probé en mobile (375x667)
- [ ] Se ve bien en todos

---

## 📧 EMAIL TEMPLATE

Verifica que el email que recibas tiene:

```
ENCABEZADO:
├─ Asunto: "Cuestionario recibido: [Nombre Cliente]"
└─ Remitente: hello@azloom.tech (o tu email)

CUERPO:
├─ Saludo: "Hola [Nombre]"
├─ Confirmación: "Recibimos tu respuestas"
│
├─ SECCIÓN 1: TUS RESPUESTAS
│  ├─ Tabla o lista con todas las preguntas/respuestas
│  └─ Se ve claramente formateado
│
├─ SECCIÓN 2: RESUMEN GENERADO POR IA ✨
│  ├─ Estado Actual (2-3 líneas)
│  ├─ Puntos Críticos (3-5 puntos)
│  ├─ Oportunidades de Mejora (3-5 puntos)
│  └─ Recomendación (2-3 líneas)
│
├─ FOOTER
│  ├─ "Enviado por Azloom"
│  ├─ "hello@azloom.tech"
│  └─ Fecha/Hora
```

---

## 🚀 ANTES DE COMPARTIR CON CLIENTE

### Test con Datos del Cliente Real

Si es posible, prueba CON datos reales del cliente:
- [ ] Completa con nombre del cliente
- [ ] Completa con email del cliente
- [ ] Completa con respuestas reales
- [ ] Verifica que el email le llegue a ellos
- [ ] Verifica que el resumen sea útil y relevante

### Mensaje para el Cliente

Prepara un mensaje tipo:

```
Hola [Nombre],

Creé un cuestionario rápido (5-10 min) que me ayuda a entender 
mejor tu situación actual.

Click aquí: [TU URL]

Solo llena, envía, y en segundos recibirás un análisis generado 
por IA con tus respuestas y una recomendación personalizada.

¿Dudas? Llámame.

Saludos,
```

---

## 📊 MONITOREAR EN PRODUCCIÓN

Una vez live, revisa regularmente:

### Diario:
- [ ] Vercel Function Logs (¿hay errores?)
- [ ] Gmail (¿llegaron respuestas?)
- [ ] Google Sheets (si guardas allí)

### Semanal:
- [ ] ¿Cuántos clientes respondieron?
- [ ] ¿Hay patrones en los problemas identificados?
- [ ] ¿Los resúmenes IA son útiles?

### Mensual:
- [ ] ¿Cuánto gastamos en Claude API?
- [ ] ¿Necesito ajustar el prompt?
- [ ] ¿Debo agregar más preguntas?

---

## 🆘 PROBLEMAS CONOCIDOS

### "El email se ve feo"

n8n puede tener plantillas de email predeterminadas.
Solución: En n8n → Email node → Configura tu template HTML

### "Algunos clientes ven formulario en otro idioma"

El navegador del cliente está en otro idioma.
Solución: Cambia en el HTML (línea 1: `<html lang="es">`)

### "Timeout después de 10 segundos"

Vercel tiene limite de 10s en plan gratis.
Solución: Upgrade a Pro o optimiza el prompt de Claude

### "Se envían duplicados a n8n"

Cliente hace doble click en botón.
Solución: Agregar "disabled" button después de enviar

---

## ✅ LISTA FINAL

Antes de ir a producción:

```
VERCEL:
□ 3 variables de entorno correctas
□ Deployment completado con ✅
□ Function logs sin errores

FORMULARIO:
□ Carga rápido y se ve bien
□ Todos los campos funcionan
□ Responsive en mobile

INTEGRACIÓN:
□ Claude genera resumen (test completado)
□ n8n recibe datos
□ Email llega en Gmail

SEGURIDAD:
□ No hay API keys en GitHub
□ Keys solo en Vercel
□ No hay logs sensibles

PERFORMANCE:
□ Formulario <2s
□ Total <15s
□ Email <1min

CLIENTE:
□ Mensaje preparado
□ Datos de prueba validados
□ URL lista para compartir

✅ ¡¡¡LISTO PARA PRODUCCIÓN!!!
```

---

## 🎉 CUANDO ESTÉ LISTO

1. **Comparte la URL** con tu cliente
2. **Dale instrucciones** (mensaje arriba)
3. **Monitorea** los primeros días
4. **Ajusta** si es necesario
5. **Celebra** cada respuesta que llega 🎊

---

**¿Completaste TODO?** → ¡Lanzalo! 🚀
