import Anthropic from "@anthropic-ai/sdk";

// Test data
const testData = {
  nombre: "Diego Test",
  correo: "diego@test.com",
  whatsapp: "+506 8851 0692",
  modulos: ["Compras", "Cuentas por Pagar"],
  modulos_otro: "",
  otros_sistemas: "SAP, Excel",
  num_proveedores: "50",
  canal_facturas: ["Email", "Portal"],
  acceso_proveedores: "Sí",
  quien_aprueba: "Gerente de Compras",
  donde_se_paga: "Sistema bancario",
  dias_credito_pago: "30 días",
  doble_digitacion: "Sí",
  frecuencia_informe: "Semanal",
  facturado_vs_usado: "No lo hacemos",
  control_bodega: "Manual",
  dolor_de_cabeza: "Proceso lento, muchos emails, doble trabajo",
  vision_ideal: "Automatización total, menos manual, más eficiente"
};

async function testClaudeAPI() {
  console.log("🔍 TEST LOCAL - VERIFICANDO INTEGRACIÓN\n");
  console.log("═".repeat(60));

  const apiKey = process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    console.error("❌ CLAUDE_API_KEY no encontrada en variables de entorno");
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });

  console.log("✅ Cliente de Anthropic creado");
  console.log(`✅ API Key configurada: ${apiKey.substring(0, 20)}...`);
  console.log("\n📝 Datos de test:");
  console.log(JSON.stringify(testData, null, 2));
  console.log("\n🤖 Llamando a Claude...");

  const prompt = `
Eres un experto en consultoría de procesos de construcción. Analiza las siguientes respuestas de un cuestionario de AIE Constructora y genera un resumen ejecutivo conciso y profesional.

**RESPUESTAS DEL CLIENTE:**

Nombre: ${testData.nombre}
Email: ${testData.correo}
WhatsApp: ${testData.whatsapp}

**MÓDULOS ACTIVOS:**
${testData.modulos.join(", ")}

**SISTEMAS ACTUALES:**
${testData.otros_sistemas}

**PROVEEDORES:**
Cantidad: ${testData.num_proveedores}
Canales de entrada: ${testData.canal_facturas.join(", ")}
Acceso de proveedores: ${testData.acceso_proveedores}

**APROBACIÓN Y PAGO:**
Responsables de aprobación: ${testData.quien_aprueba}
Método de pago: ${testData.donde_se_paga}
Políticas de crédito: ${testData.dias_credito_pago}

**CONTABILIDAD:**
Doble digitación: ${testData.doble_digitacion}

**REPORTES:**
Frecuencia: ${testData.frecuencia_informe}

**MATERIALES:**
Análisis: ${testData.facturado_vs_usado}
Control de bodega: ${testData.control_bodega}

**PROBLEMAS IDENTIFICADOS:**
${testData.dolor_de_cabeza}

**VISIÓN IDEAL:**
${testData.vision_ideal}

---

Por favor, genera un RESUMEN EJECUTIVO que incluya:

1. **Estado Actual** (2-3 líneas): Descripción breve del proceso actual y sus principales características.

2. **Puntos Críticos** (3-5 puntos): Los problemas principales identificados en el proceso.

3. **Oportunidades de Mejora** (3-5 puntos): Áreas clave donde Azloom puede agregar valor.

4. **Recomendación** (2-3 líneas): Una sugerencia general sobre el enfoque para la solución.

Sé conciso, profesional y directo. El resumen debe ser leíble en máximo 5 minutos.
`;

  try {
    const startTime = Date.now();

    const message = await client.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const duration = Date.now() - startTime;

    console.log(`\n✅ Respuesta de Claude recibida en ${duration}ms`);
    console.log("\n📋 RESUMEN GENERADO POR IA:");
    console.log("═".repeat(60));

    if (message.content[0].type === "text") {
      console.log(message.content[0].text);
    }

    console.log("\n═".repeat(60));
    console.log("\n✅ VERIFICACIÓN COMPLETADA EXITOSAMENTE");
    console.log("\n📊 Detalles de la respuesta:");
    console.log(`├─ Modelo: ${message.model}`);
    console.log(`├─ Tokens de entrada: ${message.usage.input_tokens}`);
    console.log(`├─ Tokens de salida: ${message.usage.output_tokens}`);
    console.log(`├─ Tiempo de respuesta: ${duration}ms`);
    console.log(`└─ Estado: ✅ FUNCIONANDO\n`);

    console.log("🔗 WEBHOOK DE n8n:");
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      console.log(`✅ URL configurada: ${webhookUrl}`);
      console.log("\n📤 Intentando enviar al webhook...");

      const payload = {
        nombre: testData.nombre,
        correo: testData.correo,
        whatsapp: testData.whatsapp,
        respuestas: "Test desde test-local.js",
        resumen_ia: message.content[0].type === "text" ? message.content[0].text : "",
        datos_completos: testData,
        timestamp: new Date().toISOString(),
        origen: "test-local",
      };

      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        console.log(`✅ Webhook respondió con status: ${webhookResponse.status}`);
        console.log("✅ Webhook de n8n está funcionando correctamente\n");
      } catch (webhookError) {
        console.log(`⚠️ Error enviando al webhook: ${webhookError.message}`);
        console.log("⚠️ Esto es normal si estás detrás de un firewall o NAT\n");
      }
    } else {
      console.log("⚠️ N8N_WEBHOOK_URL no configurada");
    }

    console.log("\n✅ TEST EXITOSO - El sistema está funcionando correctamente");
    console.log("\n📌 Próximos pasos:");
    console.log("1. Ve a Vercel y verifica que las variables estén configuradas");
    console.log("2. Abre tu formulario en el navegador");
    console.log("3. Completa y envía el cuestionario");
    console.log("4. Deberías recibir un email con los resultados en segundos\n");

  } catch (error) {
    console.error("\n❌ ERROR AL LLAMAR A CLAUDE:");
    console.error(error.message);

    if (error.status === 401) {
      console.error("\n🔑 Error de autenticación - Verifica tu CLAUDE_API_KEY");
    } else if (error.status === 429) {
      console.error("\n⏱️ Rate limit - Espera un momento e intenta de nuevo");
    } else {
      console.error("\n🔍 Detalles del error:", error);
    }

    process.exit(1);
  }
}

testClaudeAPI();
