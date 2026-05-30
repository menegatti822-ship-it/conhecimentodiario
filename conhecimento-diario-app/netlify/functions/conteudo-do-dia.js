exports.handler = async function(event, context) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const baseUrl = (process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com").replace(/\/$/, "");

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Chave de API não configurada." })
    };
  }

  const hoje = new Date();
  const dow = hoje.getDay();

  const areas = {
    0: "Filosofia e Desenvolvimento Pessoal com foco em reflexão e planejamento da semana para empreendedores",
    1: "Resumo detalhado de um livro clássico de negócios ou empreendedorismo",
    2: "Estratégias práticas de Marketing e Atendimento ao Consumidor",
    3: "Produtividade e Hábitos de alta performance para empreendedores",
    4: "Gestão Financeira: fluxo de caixa, precificação e saúde financeira do negócio",
    5: "Filosofia e Desenvolvimento Pessoal aplicados à liderança e empreendedorismo",
    6: "Resumo especial de fim de semana de um livro transformador"
  };

  const livros = {
    0: "Como Fazer Amigos e Influenciar Pessoas (Dale Carnegie)",
    1: "A Startup Enxuta (Eric Ries)",
    2: "Contagious — A Epidemia do Marketing (Jonah Berger)",
    3: "Deep Work (Cal Newport)",
    4: "O Homem Mais Rico da Babilônia (George Clason)",
    5: "Meditações (Marco Aurélio)",
    6: "Os 7 Hábitos das Pessoas Altamente Eficazes (Stephen Covey)"
  };

  const dias = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];
  const meses = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
  const dataStr = `${dias[dow]}, ${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`;
  const area = areas[dow];
  const livro = livros[dow];

  const prompt = `Você é um curador de conhecimento para empreendedores brasileiros.
Gere um conteúdo educativo muito detalhado em português brasileiro.

Data: ${dataStr}
Área de hoje: ${area}
${area.includes("livro") || area.includes("Resumo") ? `Livro sugerido: ${livro}` : ""}

Responda APENAS com JSON válido, sem markdown nem texto fora do JSON:
{
  "titulo": "título chamativo com emoji",
  "categoria": "nome curto da categoria",
  "introducao": "2 parágrafos separados por \\n\\n",
  "pontos": [
    {"titulo": "1. Título", "conteudo": "2-3 parágrafos com exemplos práticos"}
  ],
  "licao": "1 insight poderoso em 2-3 frases",
  "acao": "1 ação concreta para fazer hoje",
  "citacao": "texto da citação",
  "autor_citacao": "Nome do Autor",
  "recursos": [
    {"tipo": "Livro", "nome": "Nome — Autor", "descricao": "descrição prática"},
    {"tipo": "Podcast", "nome": "Nome", "descricao": "descrição prática"},
    {"tipo": "Ferramenta", "nome": "Nome", "descricao": "descrição prática"}
  ]
}

Inclua exatamente 5 pontos bem desenvolvidos.`;

  try {
    const reqBody = JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }]
    });

    const response = await fetch(`${baseUrl}/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: reqBody
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Erro da API: " + errText })
      };
    }

    const data = await response.json();
    const text = data.content[0].text.trim();
    const clean = text.replace(/^```json\s*/,"").replace(/\s*```$/,"").trim();
    const parsed = JSON.parse(clean);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ ...parsed, data: dataStr })
    };

  } catch(err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Erro interno: " + err.message })
    };
  }
};
