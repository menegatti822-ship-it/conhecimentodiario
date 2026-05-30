# Conhecimento do Dia

Site pessoal que gera automaticamente um conteúdo educativo diário para empreendedores, usando IA.

## Estrutura

```
├── public/
│   └── index.html          # Página principal
├── netlify/
│   └── functions/
│       └── conteudo-do-dia.js  # Função serverless que chama a API
└── netlify.toml            # Configuração do Netlify
```

## Como configurar

1. Faça o deploy deste repositório no Netlify
2. Nas configurações do site no Netlify, vá em **Environment Variables**
3. Adicione a variável: `ANTHROPIC_API_KEY` = sua chave da API
4. Pronto — o site gera conteúdo novo automaticamente todo dia!

## Conteúdo por dia da semana

| Dia | Tema |
|-----|------|
| Segunda | Resumo de Livro |
| Terça | Marketing e Atendimento |
| Quarta | Produtividade e Hábitos |
| Quinta | Gestão Financeira |
| Sexta | Filosofia e Desenvolvimento Pessoal |
| Sábado | Resumo de Livro especial |
| Domingo | Reflexão e Planejamento |
