import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      throw new Error("A imagem em base64 é obrigatória.");
    }

    const apiKey = Deno.env.get("PURSO_RECEIPT_AI_TOKEN");

    if (!apiKey) {
      throw new Error("A chave PURSO_RECEIPT_AI_TOKEN não está configurada nos secrets do Supabase.");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Analise cuidadosamente esta imagem de um cupom ou nota fiscal eletrônica. 
Extraia e retorne EXATAMENTE UM JSON com os seguintes campos:
{ 
  "title": "Nome do estabelecimento (string). Limpe o nome removendo LTDA, ME, etc. Ex: Supermercados Guanabara", 
  "amount": "O valor total pago (number livre de pontuação excessiva, ex. 14.90. NÃO retorne string).", 
  "date": "Data da compra em YYYY-MM-DD se encontrada, senão retorne string vazia",
  "categoryName": "Analise os itens e categorize em uma única palavra: Alimentação, Transporte, Saúde, Lazer, Compras ou Outros."
}
Retorne APENAS o objeto JSON, sem code blocks (sem \`\`\`json) e sem explicações.`,
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Data,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.error) {
      throw new Error("Erro na API do Gemini: " + data.error.message);
    }

    const textPayload = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textPayload) {
      throw new Error("A IA não conseguiu reconhecer os dados da nota.");
    }

    let resultJson;
    try {
      const cleanJson = textPayload.replace(/```json/g, "").replace(/```/g, "").trim();
      resultJson = JSON.parse(cleanJson);
    } catch (e) {
      throw new Error("Formato inválido recebido da IA: " + textPayload);
    }

    return new Response(JSON.stringify(resultJson), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
