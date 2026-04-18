**Calculadora de Role**

Sim, essas telas cobrem os três pilares fundamentais de uma "Calculadora de Rolê" de alto nível. Para o seu benchmarking do Splitwise, elas são o "feijão com arroz" de sucesso:

1. Tela 1 (Entrada Rápida): Ideal para quando uma única pessoa pagou tudo e o grupo apenas divide o total.  
2. Tela 2 (Itemização/OCR): Essa é a matatada para rolês em restaurantes. Ela permite que cada um selecione exatamente o que consumiu (ex: "quem pediu a Tacos Del Mar?").  
3. Tela 3 (Lógica de Divisão): Imprescindível para divisões não equalitárias (porcentagem, partes ou valores fixos).

### 🚀 Consigo codar e implementar?

Com certeza. Na verdade, o projeto MyCash já tem uma fundação sólida para isso. Se você desenhar os componentes seguindo o Design System Purso, eu posso:

1. Implementar a Lógica de Divisão: Criar os hooks para gerenciar os estados de split\_equally, split\_by\_amount e split\_by\_percentage, garantindo que o "Grand Total" sempre bata com a soma das partes.  
2. Evoluir o Scanner (OCR): Atualmente, o seu NewTransactionModal.tsx já tem um scanner básico que pega o total. Eu posso expandir a função no Supabase (scan-receipt) para retornar o array de itens, permitindo que a tela 2 seja preenchida automaticamente.  
3. Integração com Participantes: Usar os dados que já temos em family\_members para popular a lista de "quem está no rolê".  
4. Persistência: Criar a lógica para salvar isso no banco, possivelmente gerando múltiplas transações vinculadas ou uma transação "pai" com detalhes dos devedores.

### 🎨 Sobre o Design System Purso

Já mapeei os tokens que estamos usando (\--neutral-1100, \--brand-500, etc). Se você seguir essa hierarquia:

* Containers Fluidos: Sempre 100% de largura no mobile.  
* Touch Targets: Botões grandes para facilitar o uso no meio do rolê.  
* Feedback Visual: Avisos de "faltam R$ X para fechar a conta" enquanto a divisão é feita.

Estou pronto para começar assim que você der o sinal verde. Quer que eu esboce uma estrutura de dados de como essa "transação dividida" ficaria no banco de dados para validarmos a arquitetura antes?  
---

✅ DÚVIDA RESPONDIDA ✓ Benchmarking validado ✓ Viabilidade técnica confirmada (100%) ✓ Estratégia de implementação pronta  
🤔 PRÓXIMOS PASSOS ⏭️ Aguardando sua definição de design ou solicitação de arquitetura de dados.  
