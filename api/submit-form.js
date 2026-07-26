import nodemailer from "nodemailer";
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

**SISTEMAS ACTUALES:**
${datos.otros_sistemas || "No especificado"}

**PROVEEDORES:**
Cantidad: ${datos.num_proveedores || "No especificado"}
Canales de entrada: ${Array.isArray(datos.canal_facturas) ? datos.canal_facturas.join(", ") : datos.canal_facturas || "No especificado"}
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

1. **Estado Actual** (2-3 líneas): Descripción breve del proceso actual.

2. **Puntos Críticos** (3-5 puntos): Los problemas principales identificados.

3. **Oportunidades de Mejora** (3-5 puntos): Áreas clave donde Azloom puede agregar valor.

4. **Recomendación** (2-3 líneas): Una sugerencia general sobre el enfoque para la solución.

Sé conciso, profesional y directo.
`;

  const message = await client.messages.create({
    model: "claude-opus-5",
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
    console.log("📨 Formulario recibido de:", datos.nombre);

    if (!datos.nombre || !datos.correo) {
      return res.status(400).json({ error: "Nombre y email requeridos" });
    }

    // Formatear respuestas
    const respuestasTexto = `
CUESTIONARIO AIE CONSTRUCTORA - RESPUESTAS
═══════════════════════════════════════════════

DATOS DE CONTACTO:
• Nombre: ${datos.nombre}
• Email: ${datos.correo}
• WhatsApp: ${datos.whatsapp || "N/A"}

MÓDULOS ACTIVOS:
${datos.modulos ? (Array.isArray(datos.modulos) ? datos.modulos.map(m => `• ${m}`).join('\n') : `• ${datos.modulos}`) : "N/A"}
${datos.modulos_otro ? `• Otros: ${datos.modulos_otro}` : ""}

SISTEMAS ACTUALES:
• ${datos.otros_sistemas || "N/A"}

PROVEEDORES:
• Cantidad: ${datos.num_proveedores || "N/A"}
• Canales de entrada: ${Array.isArray(datos.canal_facturas) ? datos.canal_facturas.join(", ") : datos.canal_facturas || "N/A"}
• Acceso de proveedores: ${datos.acceso_proveedores || "N/A"}

APROBACIÓN Y PAGO:
• Quién aprueba: ${datos.quien_aprueba || "N/A"}
• Dónde se paga: ${datos.donde_se_paga || "N/A"}
• Días de crédito: ${datos.dias_credito_pago || "N/A"}

CONTABILIDAD:
• Doble digitación: ${datos.doble_digitacion || "N/A"}

REPORTES:
• Frecuencia: ${datos.frecuencia_informe || "N/A"}

MATERIALES:
• Facturado vs usado: ${datos.facturado_vs_usado || "N/A"}
• Control de bodega: ${datos.control_bodega || "N/A"}

PROBLEMAS Y VISIÓN:
• Problema: ${datos.dolor_de_cabeza || "N/A"}
• Visión ideal: ${datos.vision_ideal || "N/A"}

═══════════════════════════════════════════════
Enviado: ${new Date().toLocaleString("es-MX")}
`;

    // Generar resumen con Claude
    console.log("🤖 Generando resumen con Claude...");
    const resumenIA = await generarResumen(datos);
    console.log("✅ Resumen generado");

    // Configurar transporte de email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    console.log("📧 Enviando email a:", datos.correo);

    // Enviar email con respuestas + resumen
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: datos.correo,
      subject: `Cuestionario recibido: ${datos.nombre}`,
      text: respuestasTexto + "\n\n" + "RESUMEN GENERADO POR IA:\n" + "═".repeat(50) + "\n\n" + resumenIA,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email enviado exitosamente");

    // Responder al cliente
    return res.status(200).json({
      success: true,
      message: `¡Gracias, ${datos.nombre}! Hemos enviado tus respuestas y un análisis personalizado a ${datos.correo}`,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ Error:", error.message);
    return res.status(500).json({
      error: "Error procesando formulario",
      details: error.message,
    });
  }
}
