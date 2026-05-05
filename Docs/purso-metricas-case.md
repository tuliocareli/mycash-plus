# Métricas de Produto — Purso
**Fonte:** Banco de dados de produção Supabase · Tabelas `user_events` e `users`
**Período de coleta:** 14/03/2026 – 06/04/2026
**Base rastreada:** 3 usuários com eventos registrados / 13 contas cadastradas

---

## 1. Funil Principal: Criação de Transação (antes × depois)

### O resultado

A taxa de conversão do fluxo principal — abrir o modal de nova transação e concluir o registro — subiu de **37,5% para 90%** após iteração de design realizada em abril de 2026.

### De onde vem

Tabela `user_events`, eventos `new_transaction_start` e `new_transaction_submit`, período 14/03 a 06/04/2026.

### Por que melhorou

O relatório de fricção do componente `NewTransactionModal.tsx` identificou o ponto de abandono principal: usuários que não tinham uma categoria ou conta pré-cadastrada precisavam fechar o modal, criar o item em outra tela e reiniciar o fluxo do zero. Isso gerava abandono estrutural — não era falta de intenção, era barreira de arquitetura.

A correção foi a implementação de **criação inline**: o usuário passou a criar categoria ou conta diretamente dentro do modal, sem interromper o fluxo. Somado a isso, foram adicionados estados de loading e feedback visual, eliminando o padrão de múltiplos submits frustrados que aparecia nos logs de março.

### Evidência comportamental nos logs

Em março, o mesmo `session_id` registrava múltiplos `new_transaction_submit` em sequência curta — sinal claro de formulário sem feedback de carregamento, gerando cliques repetidos por incerteza. Em abril, o padrão voltou a **1 start : 1 submit**, indicando fluxo concluído sem fricção.

### Como citar no case

> *"O funil de criação de transação passou de 37,5% para 90% de conversão após a implementação de criação inline de categorias e contas. A hipótese de causa é sustentada pelos logs: em março, o mesmo session_id registrava múltiplos submits em sequência — sinal de formulário sem feedback. Em abril, o padrão voltou a 1 start : 1 submit. Base: 36 inícios e 24 conclusões rastreados via `user_events`, período março–abril 2026."*

### O que não dizer

- "salto de 140%" — tecnicamente calculável, mas leitura que parece inflada. O dado real já é forte.
- "prova que a IA melhorou o design" — o que os dados provam é o impacto das decisões de design, não da ferramenta usada.
- "+90% de conversão" com sinal de mais — 90% é o valor absoluto, não a variação.

---

## 2. Drop-off no Fluxo de Transação

### O resultado

A taxa de abandono explícito no fluxo de criação de transação caiu de **50% para 10%** — redução de 40 pontos percentuais.

### De onde vem

Evento `new_transaction_abandon` registrado na tabela `user_events`, comparando comportamento de março (pré-iteração) com abril (pós-iteração).

### Por que melhorou

A principal hipótese é a mesma do funil acima: eliminar a necessidade de sair do modal para cadastrar uma categoria ou conta removeu o principal ponto de abandono estrutural. Usuários que antes desistiam por falta de dado pré-configurado passaram a resolver o bloqueio dentro do próprio fluxo.

### Como citar no case

> *"A taxa de abandono no fluxo de criação de transação caiu de 50% para 10% após a implementação de criação inline — redução de 40 pontos percentuais registrada via `new_transaction_abandon` no Supabase. A hipótese é que eliminar a necessidade de sair do modal para cadastrar uma categoria foi o principal redutor de fricção."*

### O que não dizer

- "churn" — o termo correto para abandono dentro de um modal é drop-off de funil. Churn descreve usuários que param de usar o produto, não abandono de fluxo.
- "prova que as barreiras foram eliminadas" — o dado indica e sugere, mas não prova com N pequeno. Use "indica" ou "sustenta a hipótese".

---

## 3. Gargalo Identificado: Modal de Conta/Cartão

### O resultado

**55,5% de abandono** no modal de criação de conta ou cartão — o maior drop-off identificado em todo o app no período analisado.

### De onde vem

Eventos `add_account_modal_start` (9 ocorrências) e `add_account_modal_abandon` (5 ocorrências), tabela `user_events`.

### Por que acontecia

A análise do componente `AddAccountModal.tsx` (486 linhas) identificou quatro pontos de severidade alta:

1. Título estático `"Adicionar Conta/Cartão"` que não refletia o tipo selecionado pelo usuário
2. Campos `closing_day` e `due_day` com placeholder apenas `DD` e sem explicação do conceito bancário — termos técnicos sem contexto para o público-alvo
3. Validação disparada apenas no submit — o usuário descobria erros somente ao tentar salvar
4. `alert()` nativo do browser para erros — quebrava a experiência no momento mais crítico do fluxo

### Correções implementadas em 06/04/2026

- **Título dinâmico** por tipo (conta bancária / cartão de crédito) e por modo (criação / edição)
- **Textos explicativos** sob os campos de fechamento e vencimento: *"Dia em que a fatura fecha e para de acumular"* / *"Dia do mês em que a fatura precisa ser paga"*
- **Validação inline por campo** via `onBlur` — erros aparecem ao sair de cada campo, não apenas no submit
- **Banner de erro inline** substituindo o `alert()` nativo — estado `submitError` exibido acima do footer, limpo automaticamente a cada nova tentativa

Os pontos de severidade média e baixa (7 itens adicionais) estão documentados e priorizados para o próximo sprint.

### Como citar no case

> *"O modal de criação de conta registrou 55% de drop-off — o maior gargalo identificado no período. A análise do componente revelou que campos técnicos como `closing_day` e `due_day` apareciam sem contexto explicativo, e a validação só ocorria no submit. Após as correções de severidade alta implementadas em 06/04, o impacto será monitorado no próximo ciclo de coleta."*

### O que não dizer

Não afirme que as correções já reduziram o abandono — o dado pós-correção ainda não foi coletado. O case apresenta o ciclo completo: diagnóstico → priorização → intervenção → próxima medição. Isso é mais maduro do que um resultado sem contexto.

---

## 4. Retenção D7

### O resultado

2 dos 3 usuários rastreados retornaram ao app entre o 6º e o 8º dia após o primeiro acesso.

### De onde vem

Cruzamento de `user_events` e `users`, cohort 14/03 a 27/03/2026. Metodologia: usuário retido D7 = ao menos um evento registrado entre o 6º e o 8º dia após o primeiro acesso.

### Como citar no case

> *"Com 3 usuários rastreados no período beta, 2 retornaram no D7 — um sinal inicial positivo de engajamento com o produto. A base é insuficiente para afirmação estatística: um dos usuários não retornou após o primeiro acesso, representando o único caso claro de churn identificado até o momento. O próximo ciclo priorizará D1 e D30 com base ampliada."*

### O que não dizer

- Qualquer comparação com benchmarks de mercado (Duolingo, Robinhood, médias de fintech). Com N=3, a comparação expõe em vez de validar.
- "Product-Market Fit inicial extremamente alto" — não é possível afirmar isso com 3 usuários, dois dos quais podem ser o próprio desenvolvedor e um beta tester conhecido.

---

## 5. Pesquisa Qualitativa de Problema

### O resultado

17 respondentes participaram de pesquisa de campo sobre dificuldades com gestão financeira pessoal antes do uso do produto.

### Dados reais — corrigidos

| Dificuldade apontada | Respondentes | Percentual |
|---|---|---|
| Ter que anotar tudo na mão, gasto por gasto | 5 | 29,4% |
| Olhar o saldo e sentir ansiedade / culpa | 5 | 29,4% |
| Falta de customização (apps feios e engessados) | 4 | 23,5% |
| Termos difíceis de banco (CDB, CDI, Liquidez) | 3 | 17,6% |

**Soma das duas primeiras categorias (fricção de registro + carga emocional negativa):** 10 respondentes = **58,8%**

> ⚠️ **Nota de correção:** Um rascunho anterior citava 82% para essa combinação. O número correto é 58,8% — calculado diretamente a partir dos dados brutos do arquivo `Purso_O_App_de_Financas_que_Nao_Parece_um_Banco.csv`.

### Por que esse dado importa para o design

A concentração de dor em fricção de registro e carga emocional negativa orientou duas decisões de design concretas:

1. Feedback visual positivo no registro de transações — reforço do comportamento correto em vez de punição do erro
2. Linguagem que normaliza a situação financeira do usuário, distanciando o Purso da estética "pesada" e burocrática dos apps bancários tradicionais

### Como citar no case

> *"Em pesquisa com 17 usuários potenciais, 58,8% apontaram como principal dificuldade a fricção de registro manual ou a carga emocional negativa ao acessar o saldo. Esse dado orientou duas decisões de design: feedback visual positivo no registro de transações e linguagem que normaliza o erro financeiro em vez de reforçar culpa. Fonte: pesquisa de campo, março de 2026."*

---

## 6. O que esse conjunto de dados prova — e o que não prova

### Prova

- O sistema de event tracking está funcionando em produção e gera dados acionáveis
- É possível identificar gargalos em nível de componente (`AddAccountModal.tsx`) a partir dos eventos coletados
- A iteração de design no modal de transação gerou melhora mensurável no comportamento do usuário, sustentada pelos logs antes e depois
- O processo de diagnóstico → priorização por severidade → intervenção → documentação do que ainda não foi medido é replicável e auditável

### Não prova

- Retenção estatisticamente significativa (base de 3 usuários)
- Que as correções no modal de conta já reduziram o drop-off (dado pós-correção não coletado)
- Causalidade exclusiva entre as mudanças de design e os resultados — outras variáveis (familiaridade com o produto, perfil dos usuários beta) não podem ser descartadas com a base atual

### A narrativa correta

> *"Montei a infraestrutura de decisão por dados, identifiquei o problema certo, intervim no lugar certo, e sei o que ainda não consigo provar."*

Essa é a postura que separa um profissional de produto de um designer que apresenta portfólio.

---

*Documento gerado com base no relatório `analytics-report-2026-04-06.md` e na pesquisa `Purso_O_App_de_Financas_que_Nao_Parece_um_Banco.csv`. Todos os números foram verificados contra os dados brutos antes da publicação.*
