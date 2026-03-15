# 🚀 MyCash+ | Log de Evolução e Produto

Este documento registra a jornada de melhoria contínua do MyCash+. Cada entrada serve como base para o estudo de caso de UX e Engenharia.

---

## 🗓️ 15 de Março de 2026

### 1. Implementação de Login via Google (OAuth)
- **Mudança:** Adicionada autenticação social via Google.
- **Racional (Dor):** Alta fricção no registro manual (memorizar senhas, preencher formulários).
- **Melhora Esperada:** 
    - ↑ Conversão de novos usuários.
    - ↑ Segurança da conta.
- **Status:** ✅ Implementado e Deployado.

### 2. Blindagem de Dados (RLS - Total Privacy)
- **Mudança:** Migração de "Banco Público" para "Privacidade por Usuário" via Row Level Security no Supabase.
- **Racional (Dor):** Medo de exposição de dados financeiros; impedimento para subida em lojas oficiais (Google Play).
- **Melhora Esperada:** 
    - ↑ Confiança do usuário.
    - ↑ Conformidade com LGPD/Google Store.
- **Status:** ✅ Implementado.

### 3. Atualização de Branding e Comunicação
- **Mudança:** Labels do Login alterados de "Open/Fácil" para "Privado/Seguro".
- **Racional (Dor):** Identidade visual antiga comunicava que os dados eram abertos, o que assusta usuários de finanças.
- **Melhora Esperada:** 
    - ↓ Taxa de abandono no primeiro scroll da Landing Page.
- **Status:** ✅ Implementado.

### 4. Conformidade e Direito ao Esquecimento (GDPR/LGPD)
- **Mudança:** Criação da página de Termos e Privacidade e implementação do botão "Limpar Todos os Dados".
- **Racional (Dor):** Exigência legal e ética; usuários precisam saber o que acontece com seus dados e como removê-los.
- **Melhora Esperada:** 
    - ↑ Confiança do usuário para testar o sistema.
    - ✅ Conformidade com requisitos de lojas de aplicativos.
- **Status:** ✅ Implementado.

---

## 🗓️ 14 de Março de 2026 (Ontem)

### 1. Fluxo de Onboarding Inteligente
- **Mudança:** Lógica de "Primeiro Acesso" que detecta se o usuário precisa de um tour/boas-vindas.
- **Racional (Dor):** Novos usuários ficavam perdidos ao ver o dashboard vazio sem contexto.
- **Melhora Esperada:** 
    - ↑ Retenção no D1 (primeiro dia).
    - ↓ Chamados de suporte sobre "como começar".
- **Status:** ✅ Implementado (Context + LocalStorage Guard).

### 2. Otimização do Login Mobile
- **Mudança:** Ajuste no layout da página de autenticação para telas pequenas e adição de avisos legais mobile-first.
- **Racional (Dor):** O formulário quebrava em celulares menores ou escondia informações críticas de disclaimer.
- **Melhora Esperada:** 
    - ↑ Sucesso no login via dispositivos móveis.
    - Clareza jurídica em todas as resoluções.
- **Status:** ✅ Implementado (Tailwind Responsive).

### 3. Dashboard Admin e Métricas de UX
- **Mudança:** Criação da rota `/admin-analytics` com acesso restrito via e-mail (case-insensitive).
- **Racional (Dor):** Necessidade de medir a performance do sistema (latência de transações) e uso das features sem acesso manual ao banco.
- **Melhora Esperada:** 
    - Identificação proativa de gargalos de performance.
    - Dados reais para refinar o design (Top Clicks).
- **Status:** ✅ Implementado.

---

## 🔍 Backlog de Análise (Mês de Uso)
| Data | Ideia / Problema Identificado | Melhora Esperada | Status |
| :--- | :--- | :--- | :--- |
| 15/03 | Falta de resumo do mês anterior no dashboard | Facilitar comparação de progresso financeiro | ⏳ Planejado |
| 15/03 | Registro de despesas repetitivas | Atalho para "Últimas despesas" ou "Clonar" | ⏳ Planejado |
| 15/03 | Exclusão de conta (Exigência Google Play) | Dar autonomia total ao usuário sobre seus dados | ⏳ Planejado |
