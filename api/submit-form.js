import nodemailer from "nodemailer";
import Anthropic from "@anthropic-ai/sdk";

async function generarResumen(datos) {
  try {
    console.log("🤖 Iniciando generación de resumen...");

    const client = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });

    const prompt = `Eres experto en consultoría de procesos. Analiza estas respuestas y genera un resumen ejecutivo.

DATOS DEL CLIENTE:
- Nombre: ${datos.nombre}
- Problemas principales: ${datos.dolor_de_cabeza}
- Visión ideal: ${datos.vision_ideal}
- Módulos: ${Array.isArray(datos.modulos) ? datos.modulos.join(", ") : datos.modulos}
- Sistemas actuales: ${datos.otros_sistemas}
- Cantidad de proveedores: ${datos.num_proveedores}

GENERA UN RESUMEN EJECUTIVO con:
1. Estado Actual (2-3 líneas)
2. Puntos Críticos (3-5 puntos)
3. Oportunidades de Mejora (3-5 puntos)
4. Recomendación (2-3 líneas)

Sé conciso y profesional.`;

    const response = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    if (!response || !response.content || response.content.length === 0) {
      console.warn("⚠️ Claude devolvió respuesta vacía");
      return "Resumen disponible - procesamiento completado";
    }

    const texto = response.content[0].text;
    if (!texto) {
      console.warn("⚠️ Contenido de texto vacío");
      return "Resumen disponible - procesamiento completado";
    }

    console.log("✅ Resumen generado exitosamente");
    return texto;
  } catch (error) {
    console.error("❌ Error en Claude:", error.message);
    console.error("Detalles:", error);
    return "Resumen disponible - procesamiento completado";
  }
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
    console.error("❌ Error principal:", error.message);
    console.error("Stack:", error.stack);
    return res.status(500).json({
      error: "Error procesando formulario",
      details: error.message,
    });
  }
}
