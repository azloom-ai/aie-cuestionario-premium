import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

async function generarResumen(datos) {
  const prompt = `
Eres un experto en consultoría de procesos de construcción. Analiza las siguientes respuestas de un cuestionario de AIE Constructora y genera un resumen ejecutivo conciso y profesional.

**RESPUESTAS DEL CLIENTE:**

Nombre: ${datos.nombre || "No proporcionado"}
Email: ${datos.correo || "No proporcionado"}
WhatsApp: ${datos.whatsapp || "No proporcionado"}

**MÓDULOS ACTIVOS:**
${datos.modulos ? (Array.isArray(datos.modulos) ? datos.modulos.join(", ") : datos.modulos) : "No especificado"}
${datos.modulos_otro ? `Otros: ${datos.modulos_otro}` : ""}

**SISTEMAS ACTUALES:**
${datos.otros_sistemas || "No especificado"}

**PROVEEDORES:**
Cantidad: ${datos.num_proveedores || "No especificado"}
Canales de entrada: ${
    datos.canal_facturas
      ? Array.isArray(datos.canal_facturas)
        ? datos.canal_facturas.join(", ")
        : datos.canal_facturas
      : "No especificado"
  }
Acceso de proveedores: ${datos.acceso_proveedores || "No especificado"}

**APROBACIÓN Y PAGO:**
Responsables de aprobación: ${datos.quien_aprueba || "No especificado"}
Método de pago: ${datos.donde_se_paga || "No especificado"}
Políticas de crédito: ${datos.dias_credito_pago || "No especificado"}

**CONTABILIDAD:**
Doble digitación: ${datos.doble_digitacion || "No especificado"}

**REPORTES:**
Frecuencia: ${datos.frecuencia_informe || "No especificado"}

**MATERIALES:**
Análisis: ${datos.facturado_vs_usado || "No especificado"}
Control de bodega: ${datos.control_bodega || "No especificado"}

**PROBLEMAS IDENTIFICADOS:**
${datos.dolor_de_cabeza || "No especificado"}

**VISIÓN IDEAL:**
${datos.vision_ideal || "No especificado"}

---

Por favor, genera un RESUMEN EJECUTIVO que incluya:

1. **Estado Actual** (2-3 líneas): Descripción breve del proceso actual y sus principales características.

2. **Puntos Críticos** (3-5 puntos): Los problemas principales identificados en el proceso.

3. **Oportunidades de Mejora** (3-5 puntos): Áreas clave donde Azloom puede agregar valor.

4. **Recomendación** (2-3 líneas): Una sugerencia general sobre el enfoque para la solución.

Sé conciso, profesional y directo. El resumen debe ser leíble en máximo 5 minutos.
`;

  const message = await client.messages.create({
    model: "claude-opus-4.1",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return message.content[0].type === "text" ? message.content[0].text : "";
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const datos = req.body;
    console.log("📨 Datos recibidos de:", datos.nombre);

    if (!datos.nombre) {
      return res.status(400).json({ error: "Nombre requerido" });
    }

    console.log("🤖 Generando resumen con Claude...");
    const resumenIA = await generarResumen(datos);
    console.log("✅ Resumen generado");

    // Responder INMEDIATAMENTE al cliente
    res.status(200).json({
      success: true,
      message: `¡Gracias, ${datos.nombre}!`,
      timestamp: new Date().toISOString(),
    });

    // Enviar a n8n en background (sin bloquear)
    if (process.env.N8N_WEBHOOK_URL) {
      const payload = {
        nombre: datos.nombre,
        correo: datos.correo,
        whatsapp: datos.whatsapp,
        resumen_ia: resumenIA,
        datos_completos: datos,
        timestamp: new Date().toISOString(),
      };

      // Fire and forget - no await
      fetch(process.env.N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(r => console.log("✅ n8n respondió:", r.status))
        .catch(e => console.log("⚠️ n8n error:", e.message));
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
    return res.status(500).json({
      error: "Error procesando formulario",
      details: error.message,
    });
  }
}
