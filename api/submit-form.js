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

    // Formatear respuestas para el email
    const respuestas = `
CUESTIONARIO AIE CONSTRUCTORA - RESPUESTAS
═══════════════════════════════════════════════

DATOS DE CONTACTO:
• Nombre: ${datos.nombre}
• Email: ${datos.correo}
• WhatsApp: ${datos.whatsapp}

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
        respuestas: respuestas,
        datos_completos: datos,
        timestamp: new Date().toISOString(),
      };

      fetch(process.env.N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(r => console.log("✅ Datos enviados a n8n:", r.status))
        .catch(e => console.log("⚠️ Error n8n:", e.message));
    } else {
      console.log("⚠️ N8N_WEBHOOK_URL no configurada");
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
    return res.status(500).json({
      error: "Error procesando formulario",
      details: error.message,
    });
  }
}
