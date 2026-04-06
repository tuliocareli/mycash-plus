# 📊 Relatório de Métricas de Produto — Purso
**Data:** 06 de Abril de 2026
**Fonte:** Banco de dados de produção Supabase (`kaxslanjocbwkavzzdek`)
**Tabelas consultadas:** `user_events`, `users`

---

## 1. Visão Geral

| Métrica | Valor |
|---|---|
| Total de Contas Registradas | 13 usuários |
| Usuários com Eventos Rastreados | 3 usuários |
| Período com dados coletados | 14/03/2026 – 06/04/2026 |

> **Nota:** O sistema de analytics (`user_events`) só rastreou 3 dos 13 usuários cadastrados, possivelmente porque os demais se registraram antes da ativação do sistema ou não interagiram de forma suficiente para disparar eventos.

---

## 2. Usuários Ativos (DAU / MAU)

### DAU — Daily Active Users (Últimos 30 dias)

| Data | Usuários Únicos |
|---|---|
| 06/04/2026 | **2** |
| 04/04/2026 | 1 |
| 03/04/2026 | 1 |
| 02/04/2026 | 1 |
| 01/04/2026 | 1 |
| 30/03/2026 | 1 |
| 29/03/2026 | 1 |
| 28/03/2026 | 1 |
| 27/03/2026 | **2** |
| 26/03/2026 | 1 |
| 25/03/2026 | 1 |
| 24/03/2026 | 1 |
| 23/03/2026 | 1 |
| 22/03/2026 | 1 |
| 20/03/2026 | 1 |
| 17/03/2026 | 1 |
| 16/03/2026 | 1 |
| 15/03/2026 | 1 |
| 14/03/2026 | 1 |

> **Picos:** 27/03 e 06/04 foram os únicos dias com 2 usuários simultâneos.

### MAU — Monthly Active Users

| Mês | Usuários Únicos |
|---|---|
| Março de 2026 | **3** |
| Abril de 2026 (parcial, até dia 6) | **2** |

---

## 3. Top Eventos (Lifetime)

| Posição | Evento | Ocorrências |
|---|---|---|
| 1 | `click_sidebar_nav` | 189 |
| 2 | `new_transaction_start` | 36 |
| 3 | `add_transaction_sync` | 25 |
| 4 | `create_transaction` | 25 |
| 5 | `new_transaction_submit` | 24 |

---

## 4. Análise dos Funis de Conversão

### 4.1 Funil de Transação (Ação Principal)

```
Início (new_transaction_start)    36 usuários  ████████████████████ 100%
Finalizado (new_transaction_submit) 24 usuários  █████████████░░░░░░░  66,6%
Abandono (new_transaction_abandon)   9 usuários  ████░░░░░░░░░░░░░░░░  25,0%
```

- **Taxa de Conversão:** 66,6%
- **Taxa de Abandono Explícito:** 25,0%
- **⚠️ Insight:** 1 em cada 3 usuários que abre o modal de nova transação não finaliza. Provável causa: fricção na seleção de categoria ou conta.

---

### 4.2 Funil de Criação de Conta/Carteira 🚨 Gargalo Crítico

```
Início (add_account_modal_start)   9 usuários  █████████████████████ 100%
Finalizado (add_account_modal_submit) 4 usuários  █████████░░░░░░░░░░░░  44,4%
Abandono (add_account_modal_abandon)  5 usuários  ███████████░░░░░░░░░░  55,5%
```

- **Taxa de Conversão:** 44,4%
- **Taxa de Abandono:** 55,5% ← **Pior conversão de todo o app**
- **⚠️ Insight:** Mais da metade dos usuários desiste ao criar contas/cartões. Formulário possivelmente complexo, campos não-intuitivos (`closing_day`, `due_day`) ou interrupção de contexto.

---

### 4.3 Funil de Login

```
Acesso à tela (login_start)   6 usuários  ████████████████████ 100%
Conclusão (login_submit)       6 usuários  ████████████████████ 100%
```

- **Taxa de Conversão:** 100% ✅
- **Insight:** O fluxo de acesso (Magic Link / OAuth / Google) está fluido e sem atrito.

---

### 4.4 Funil de Metas (Goals)

```
Início (new_goal_start)    2 usuários  ████████████████████ 100%
Finalizado (new_goal_submit) 1 usuário   ██████████░░░░░░░░░░  50,0%
Abandono (new_goal_abandon)  1 usuário   ██████████░░░░░░░░░░  50,0%
```

- **Taxa de Conversão:** 50%
- **Insight:** Volume muito baixo para análise conclusiva. Feature ainda pouco descoberta.

---

### 4.5 Funil de Exportação de Dados

```
Início (export_data_start)    2 usuários
Finalizado (export_data_submit) 3 usuários
```

- **Insight:** Mais envios do que inícios rastreados. Provável ausência de rastreamento do `start` em sessões anteriores.

---

### 4.6 Outros Eventos Rastreados

| Evento | Ocorrências |
|---|---|
| `view_profile` | 21 |
| `view_goals` | 20 |
| `view_history` | 18 |
| `edit_transaction_submit` | 7 |
| `support_message_sent` | 2 |

---

## 5. Retenção D7 por Cohort

### Metodologia
Usuário retido D7 = teve evento entre o 6º e 8º dia após seu primeiro acesso.

### Resultado por Cohort

| Cohort (1º Acesso) | E-mail | Dias Ativos Total | Status D7 |
|---|---|---|---|
| 14/03/2026 | tctulio2009@gmail.com | 18 | ✅ Retido D7+ |
| 17/03/2026 | lletletpereira15@gmail.com | 2 | ✅ Retido D7+ |
| 27/03/2026 | leonardofc2015@gmail.com | 1 | ❌ Não retido |

### Resumo de Retenção

| Métrica | Valor |
|---|---|
| Usuários avaliados | 3 |
| Retidos no D7 | 2 |
| **D7 Retention Rate** | **66,6%** |

### Comparativo de Mercado

| Produto (Referência) | D7 Típico (Early Stage) |
|---|---|
| Duolingo (Lançamento) | ~25–30% |
| Robinhood (Beta) | ~35–40% |
| Média Fintech early | ~20–35% |
| **Purso (Hoje)** | **66,6%** |

> ⚠️ **Ressalva Importante:** O sample de 3 usuários é estatisticamente insuficiente para conclusões definitivas. O único sinal claro de churn real disponível até o momento é o terceiro usuário (`leonardofc2015@gmail.com`), que não retornou após o primeiro acesso. A natureza dos outros dois usuários (beta testers, equipe, usuários orgânicos) não pode ser determinada apenas pelos dados disponíveis.

---

## 6. Diagnóstico e Recomendações

### Prioridade Alta 🔴

1. **Reduzir abandono no modal de Conta/Cartão (56% de drop)**
   - Simplificar formulário: remover campos opcionais da primeira tela.
   - Dividir em etapas (ex: Passo 1: Nome/Banco, Passo 2: Limites/Datas).
   - Adicionar tooltips nos campos confusos (`dia de fechamento`, `dia de vencimento`).

2. **Aumentar base de usuários rastreados**
   - Dos 13 cadastros, apenas 3 geraram eventos. Verificar se o analytics está sendo inicializado corretamente para todos os usuários.

### Prioridade Média 🟡

3. **Investigar o drop de 33% no funil de transação**
   - Implementar rastreamento de em qual campo o usuário está quando abandona.
   - Possível hipótese: falta de categoria ou conta pré-configurada bloqueia o preenchimento.

4. **Aumentar visibilidade das Metas (Goals)**
   - Apenas 2 inícios de criação de meta. A feature possivelmente está mal posicionada no fluxo de navegação.

### Prioridade Baixa 🟢

5. **Expandir analytics para cobrir o onboarding completo**
   - Rastrear `onboarding_start`, `onboarding_step_N`, `onboarding_complete` para entender onde novos usuários se perdem.

---

## 7. Próximos Indicadores a Monitorar

- [ ] D1 Retention (% de usuários que voltam no dia seguinte ao cadastro)
- [ ] D30 Retention (Usuários ainda ativos após 1 mês)
- [ ] NPS Score (via `support_message_sent` qualitativo)
- [ ] Taxa de conversão Cadastro → Primeira Transação
- [ ] Tempo médio até a primeira transação (Time to Value)

---

*Relatório gerado automaticamente via consulta direta ao banco de dados Supabase em 06/04/2026 às 20h30 (UTC-3).*

---

## 8. Análise de Fricção — Modal Crítico de Conta/Cartão

**Origem:** Funil `add_account_modal` com 55% de abandono identificado neste relatório.
**Componente analisado:** `src/components/modals/AddAccountModal.tsx` (486 linhas)
**Data da análise:** 06/04/2026

### Pontos de Fricção Identificados

#### 🔴 Severidade Alta (causa abandono direto)

| # | Problema | Detalhe técnico |
|---|---|---|
| 1 | **Título estático ambíguo** | `<h2>Adicionar Conta/Cartão</h2>` hardcoded — não reflete o tipo selecionado |
| 2 | **Campos `closingDay`/`dueDay` sem contexto** | Labels "Fechamento" e "Vencimento" com placeholder apenas `DD` — conceitos bancários não explicados |
| 3 | **Validação somente no submit** | `validate()` chamado apenas em `handleSubmit()` — usuário descobre erros só ao final |
| 4 | **`alert()` nativo para erros** | `alert('Erro ao salvar...')` — quebra a experiência premium do app no momento de falha |

#### 🟡 Severidade Média

| # | Problema | Detalhe técnico |
|---|---|---|
| 5 | **Logo Upload antes de campos obrigatórios** | Área de upload (visual grande) aparece antes de Saldo/Limite/Dias |
| 6 | **Campo `lastDigits` ausente no formulário** | Estado declarado e salvo no banco, mas sem input visual — cartão fica sem os últimos 4 dígitos |
| 7 | **Label "Theme" em inglês** | Inconsistência no idioma do formulário |
| 8 | **Sem feedback de sucesso** | Modal fecha sem toast/confirmação após salvar |

#### 🟢 Severidade Baixa

| # | Problema | Detalhe técnico |
|---|---|---|
| 9 | **`window.confirm()` para exclusão** | Diálogo nativo de browser para ação destrutiva |
| 10 | **Sem indicação de progresso** | 7+ campos visíveis de uma vez no modo Cartão de Crédito |
| 11 | **Dois controles de fechar (X e Cancelar)** | Redundância sem diferença funcional |

---

## 9. Correções Implementadas — 06/04/2026

**Escopo:** Pontos de Severidade Alta (#1 ao #4)
**Arquivo modificado:** `src/components/modals/AddAccountModal.tsx`

### ✅ #1 — Título Dinâmico
O título do modal agora reflete o tipo selecionado e o modo (criação vs edição):
- `Nova Conta Bancária` / `Novo Cartão de Crédito` (modo criação)
- `Editar Conta Bancária` / `Editar Cartão de Crédito` (modo edição)

### ✅ #2 — Textos Explicativos em Closingday/Dueday
Adicionados textos de apoio abaixo de cada label:
- **Vencimento:** *"Dia do mês em que a fatura precisa ser paga."*
- **Fechamento:** *"Dia em que a fatura fecha e para de acumular."*
- Placeholders alterados de `DD` para `Ex: 10` / `Ex: 5`

### ✅ #3 — Validação Inline por Campo
- Adicionada função `validateField(field, value)` com lógica por campo
- Adicionada função `handleBlur(field, value)` que marca campo como `touched`
- Campos agora validam ao sair (`onBlur`) e durante edição (se já `touched`)
- Estado `touched` resetado ao abrir o modal — evita erros na abertura

### ✅ #4 — Erro de Submit Inline (substituição do `alert()`)
- Adicionado estado `submitError` (string | null)
- Erros de rede/banco agora aparecem em banner vermelho acima do footer
- `submitError` é limpo automaticamente a cada nova tentativa de salvar

### Impacto Esperado
Com base nas métricas do funil, as correções visam reduzir os 55% de abandono no `add_account_modal`. Os pontos de severidade média (#5–#8) e baixa (#9–#11) permanecem documentados para próximos sprints.

---

*Relatório atualizado em 06/04/2026 às 20h41 (UTC-3) com análise de fricção e implementações.*