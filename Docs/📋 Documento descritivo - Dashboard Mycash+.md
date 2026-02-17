# **📋 Documento descritivo**

## **🎯 VISÃO GERAL DO SISTEMA**

O mycash+ é um sistema web completo de gestão financeira familiar que permite múltiplos membros de uma família controlarem suas finanças de forma colaborativa. O sistema funciona como uma aplicação de página única onde o usuário navega entre diferentes seções sem recarregar a página. Cada membro da família pode ter suas próprias transações, mas todos compartilham a visualização consolidada das finanças.

---

## **🏗️ ESTRUTURA DE NAVEGAÇÃO**

### **Sistema de Abas**

O sistema possui cinco seções principais acessíveis através de abas. Quando o usuário clica em uma aba, apenas o conteúdo principal muda, mantendo a estrutura de navegação visível. A aba ativa é sempre destacada visualmente para o usuário saber onde está. As cinco seções são: Dashboard (inicial), Objetivos, Cartões, Transações e Perfil.

### **Sidebar Desktop**

No desktop, existe uma barra lateral fixa do lado esquerdo da tela que permanece sempre visível. Esta sidebar contém o logotipo do sistema no topo, os botões de navegação no centro e o perfil do usuário na parte inferior. A sidebar pode alternar entre dois estados: expandida e colapsada.

Quando expandida, a sidebar mostra o logotipo completo "mycash+", os nomes completos de cada seção ao lado dos ícones, e o perfil do usuário com foto, nome e email. A largura da sidebar expandida empurra o conteúdo principal para a direita, criando uma margem.

Quando colapsada, a sidebar mostra apenas o ícone do logotipo (versão simplificada), apenas os ícones das seções sem texto, e apenas a foto do perfil sem nome/email. A largura reduzida permite que o conteúdo principal ocupe mais espaço horizontal.

Um pequeno botão circular posicionado na borda direita da sidebar permite alternar entre estes dois estados. O botão mostra uma seta apontando para a esquerda quando expandida e para a direita quando colapsada. Toda a transição entre estados é animada suavemente.

Quando a sidebar está colapsada e o usuário passa o mouse sobre um item de navegação, aparece um tooltip flutuante ao lado mostrando o nome completo da seção. Isso ajuda o usuário a identificar cada seção mesmo quando colapsada.

O item de navegação ativo sempre tem um fundo preto com texto branco, enquanto os inativos têm fundo transparente com texto cinza. Os ícones dos itens ativos ganham a cor verde limão, criando um destaque visual adicional.

### **Header Mobile**

Em dispositivos móveis (tablets e celulares), a sidebar desaparece completamente e é substituída por um header fixo no topo da tela. Este header ocupa toda a largura e permanece visível mesmo quando o usuário rola a página para baixo.

O header mobile contém o logotipo "mycash+" à esquerda (versão um pouco menor que a do desktop) e o avatar do usuário à direita. O logotipo serve como elemento de marca, sempre visível, enquanto o avatar é clicável.

Quando o usuário toca no avatar, abre-se um menu dropdown deslizando de cima para baixo. Este menu contém todas as opções de navegação que antes estavam na sidebar: Dashboard, Objetivos, Cartões, Transações e Perfil. Cada item do menu mostra ícone e texto. O item da seção atual aparece destacado em preto.

O menu também inclui na parte inferior um botão vermelho de "Sair" para logout. Clicar em qualquer item do menu fecha automaticamente o dropdown e navega para a seção escolhida.

Para fechar o menu sem fazer ação, o usuário pode tocar fora da área do menu ou pressionar o botão X que aparece no canto superior direito do menu.

---

## **💾 SISTEMA DE DADOS E ESTADO**

### **Armazenamento Central**

Todos os dados do sistema ficam armazenados em um contexto global React chamado useFinance. Este contexto funciona como uma "memória central" que todos os componentes podem acessar. Quando qualquer componente modifica um dado, todos os outros componentes que dependem daquele dado atualizam automaticamente.

### **Tipos de Dados Armazenados**

Transações: Cada transação é um registro único contendo tipo (receita ou despesa), valor em reais, descrição textual, categoria, data de ocorrência, conta ou cartão de origem, membro da família responsável, número de parcelas (se aplicável), e status (pendente ou concluído). As transações formam a base de todos os cálculos financeiros do sistema.

Objetivos: Cada objetivo representa uma meta financeira que a família quer alcançar. Contém nome do objetivo, descrição detalhada, imagem ilustrativa, valor da meta, valor já acumulado, categoria do objetivo, prazo final (opcional) e status (ativo ou arquivado).

Cartões de Crédito: Cada cartão armazenado contém nome do cartão/banco, dia do fechamento da fatura, dia do vencimento, limite total do cartão, valor da fatura atual, tema visual escolhido (preto, verde-limão ou branco), URL do logotipo do banco (opcional), últimos quatro dígitos do cartão (opcional) e lista de despesas vinculadas ao cartão.

Contas Bancárias: Cada conta contém nome da conta, tipo (corrente, poupança, etc), saldo atual e cor para identificação visual.

Membros da Família: Cada membro registrado contém nome completo, função/papel na família (pai, mãe, filho, etc), URL da foto de perfil e renda mensal estimada (opcional, para planejamento).

Categorias: Sistema mantém listas separadas de categorias para receitas e despesas. Cada categoria tem nome único e cor de identificação. Categorias são usadas para organizar e agrupar transações.

### **Funções de Cálculo**

O sistema possui diversas funções que processam os dados brutos e retornam informações úteis:

Saldo Total: Soma o saldo de todas as contas bancárias e subtrai o valor de todas as faturas de cartão pendentes. Este é o dinheiro efetivamente disponível da família.

Receitas do Período: Filtra todas as transações de tipo "receita" dentro de um intervalo de datas especificado e soma seus valores. Se nenhum período for especificado, usa o mês atual.

Despesas do Período: Filtra todas as transações de tipo "despesa" dentro de um intervalo de datas e soma seus valores.

Taxa de Economia: Calcula (Receitas \- Despesas) / Receitas × 100 para mostrar qual percentual da receita está sendo economizado.

Gastos por Categoria: Agrupa todas as despesas por categoria, somando os valores de cada uma. Retorna lista ordenada por valor decrescente.

Gastos por Membro: Agrupa transações por membro da família, calculando quanto cada um gastou no período.

Percentual por Categoria: Para cada categoria de despesa, calcula qual percentual ela representa em relação à receita total. Isso mostra o "peso" de cada categoria no orçamento familiar.

Todas estas funções aceitam filtros opcionais: intervalo de datas, membro específico, tipo de transação. Quando filtros são aplicados, os cálculos consideram apenas as transações que atendem aos critérios.

### **Sistema de Filtros Globais**

O sistema mantém em estado global os filtros ativos que afetam múltiplos componentes simultaneamente:

Filtro de Membro: Quando um membro específico é selecionado, todos os gráficos, estatísticas e listas mostram apenas dados relacionados àquele membro. Se nenhum membro está selecionado, mostra dados consolidados de toda a família.

Filtro de Período: Define um intervalo de datas (data inicial e data final). Apenas transações dentro deste período são consideradas nos cálculos e visualizações.

Filtro de Tipo: Permite escolher entre "Todos", "Receitas" ou "Despesas". Quando definido, apenas transações do tipo selecionado aparecem nas listas e influenciam cálculos que dependem de tipo.

Filtro de Busca: String de texto livre que filtra transações por descrição ou categoria. A busca é case-insensitive (não diferencia maiúsculas de minúsculas) e encontra correspondências parciais.

Quando múltiplos filtros estão ativos, eles trabalham em conjunto (operação AND). Por exemplo, se há filtro de membro "João" E período "Janeiro/2024" E tipo "Despesas", apenas as despesas de João em janeiro de 2024 serão mostradas.

---

## **🏠 DASHBOARD \- COMPONENTES DETALHADOS**

### **Header do Dashboard**

O header do dashboard é uma barra horizontal no topo da área de conteúdo (abaixo do header mobile ou ao lado da sidebar desktop). Esta barra contém todos os controles de filtro e ação do dashboard.

#### **Campo de Busca**

À esquerda da barra há um campo de texto com ícone de lupa. Este campo tem placeholder "Pesquisar..." e largura fixa no desktop, ocupando largura total no mobile.

Quando o usuário digita neste campo, o sistema reage instantaneamente (sem precisar pressionar Enter). A cada caractere digitado, o sistema filtra a lista de transações buscando correspondências na descrição ou categoria. O filtro é aplicado a todos os componentes do dashboard que dependem de transações: tabela de transações, gráfico de categorias e cards de resumo.

A busca é "inteligente": ignora diferenças entre maiúsculas e minúsculas, encontra palavras parciais (digitar "aliment" encontra "Alimentação"), e busca tanto na descrição quanto na categoria simultaneamente.

Se o usuário apagar todo o texto da busca, o filtro é removido e todos os dados voltam a aparecer normalmente.

#### **Botão de Filtros**

Ao lado do campo de busca existe um botão circular com ícone de "controles deslizantes" (três linhas horizontais com círculos). Este botão abre o painel de filtros avançados.

No desktop, clicar no botão abre um popover flutuante que aparece abaixo do botão, alinhado à direita. O popover tem fundo branco semi-transparente com efeito de desfoque (glassmorphism), criando profundidade visual.

Dentro do popover aparecem controles de filtro organizados em seções:

Seção Tipo de Transação: Contém três opções de rádio: "Todos", "Receitas", "Despesas". Apenas uma opção pode estar selecionada por vez. A opção selecionada tem fundo preto com texto branco. Ao clicar em uma opção, ela é imediatamente aplicada e todos os dados do dashboard atualizam.

No mobile, ao invés de popover, o botão abre um modal fullscreen que desliza de baixo para cima cobrindo toda a tela. Este modal tem header fixo com título "Filtros" e botão X para fechar. O conteúdo é scrollável. As mesmas opções de filtro aparecem, mas organizadas verticalmente com mais espaçamento para facilitar toque. Na parte inferior do modal há um botão grande "Aplicar Filtros" que fecha o modal e aplica as seleções.

#### **Seletor de Período**

Outro botão no header mostra o período atualmente selecionado. Por padrão, mostra o mês atual formatado como "01 jan \- 31 jan, 2024". O botão tem ícone de calendário à esquerda.

Clicar neste botão abre um calendário interativo. No desktop, aparecem dois meses lado a lado permitindo visualização ampla. No mobile, aparece um único mês de cada vez com setas para navegar entre meses.

O calendário permite seleção de intervalo: usuário clica na data inicial, depois na data final, e o intervalo fica destacado visualmente. O formato é flexível \- pode ser um único dia, uma semana, um mês, ou qualquer período customizado.

Há botões de navegação rápida para selecionar "Este mês", "Mês passado", "Últimos 3 meses", "Este ano". Clicar em qualquer atalho define automaticamente o intervalo correspondente.

Quando o usuário confirma a seleção (clicando fora do calendário ou em um botão OK), o período é aplicado globalmente. Todos os cálculos, gráficos e listas passam a considerar apenas transações dentro do novo período. O texto do botão atualiza para refletir o novo período selecionado.

#### **Widget de Membros da Família**

Na sequência do header aparecem os avatares circulares dos membros da família. As fotos ficam parcialmente sobrepostas umas às outras (cada foto "encosta" levemente na anterior), criando efeito de pilha.

Cada avatar tem borda branca de 2 pixels para destacar do fundo. Quando o usuário passa o mouse sobre um avatar, ele cresce levemente (scale 1.1) e move-se para frente (z-index aumenta), criando efeito de elevação.

Ao passar o mouse, também aparece um tooltip flutuante acima do avatar mostrando o nome completo e função do membro (exemplo: "João Silva \- Pai"). O tooltip tem fundo preto com texto branco e pequena seta apontando para o avatar.

Quando o usuário clica em um avatar, este membro é selecionado como filtro. O avatar selecionado recebe borda preta grossa (4 pixels) ao invés de branca, permanece em scale 1.1, e exibe um pequeno ícone de check verde no canto inferior direito sobreposto à foto.

Com um membro selecionado, todo o dashboard filtra para mostrar apenas dados daquele membro: suas transações, seus gastos por categoria, seu saldo, etc. Os outros membros continuam visíveis mas em estado não-selecionado.

Clicar novamente no mesmo avatar desseleção ele, removendo o filtro e voltando a mostrar dados consolidados de toda a família.

Apenas um membro pode estar selecionado por vez. Se um membro já está selecionado e o usuário clica em outro, o primeiro é deselecionado automaticamente e o novo é selecionado.

Após os avatares dos membros existe um botão circular com ícone de "+" (plus). Este botão tem fundo cinza claro e abre o modal de adicionar novo membro quando clicado.Card com fundo branco, borda sutil cinza claro e leve sombra. No topo à esquerda há um label "Receitas" em preto negrito. No topo à direita há um círculo com fundo cinza claro (10% de preto) contendo ícone de seta diagonal apontando para baixo-esquerda, simbolizando entrada de dinheiro.

Abaixo, em fonte grande (24-28px) e negrito, aparece o valor total das receitas formatado como moeda: "R$ 8.500,00".

O valor das receitas é calculado somando todas as transações do tipo "receita" dentro do período selecionado. Se nenhum período foi selecionado, usa o mês atual por padrão.

Este card também respeita o filtro de membro: se um membro está selecionado, mostra apenas as receitas daquele membro específico.

#### **Card de Despesas (Terceiro Card)**

Similar ao card de receitas em estrutura, mas com diferenças visuais para transmitir "saída de dinheiro".

Tem fundo branco com borda cinza claro. Label "Despesas" em cinza médio (não preto como receitas). Ícone no canto superior direito dentro de círculo com fundo vermelho muito claro (red-50), mostrando seta diagonal apontando para cima-direita, simbolizando saída.

O valor em fonte grande mostra o total de despesas: "R$ 6.200,00".

Calcula somando todas as transações do tipo "despesa" dentro do período selecionado, respeitando também filtro de membro se ativo.

### **Widget de Gastos por Categoria**

Abaixo dos três cards de resumo existe uma área horizontal que mostra os gastos organizados por categoria. Esta área é um carrossel scrollável horizontalmente contendo múltiplos cards pequenos, um para cada categoria de despesa que possui transações no período.

#### **Processamento dos Dados**

Quando este componente renderiza, ele executa a seguinte lógica:

Primeiro, busca todas as transações do tipo "despesa". Depois aplica os filtros ativos: se há filtro de período, mantém apenas despesas dentro daquele período; se há filtro de membro, mantém apenas despesas daquele membro; se há filtro de busca textual, mantém apenas despesas cuja descrição ou categoria contenha o texto buscado.

Com a lista filtrada de despesas, o sistema agrupa por categoria. Para cada categoria única encontrada, soma os valores de todas as transações daquela categoria. Também calcula a receita total do período (somando todas as receitas, respeitando os mesmos filtros).

Para cada categoria, calcula o percentual que ela representa em relação à receita total: (valorDaCategoria / receitaTotal) × 100\. Por exemplo, se Alimentação somou R$ 1.500 e a receita foi R$ 5.000, o percentual é 30%.

Finalmente, ordena as categorias por valor decrescente: a categoria com maior gasto aparece primeiro, seguida da segunda maior, e assim por diante.

#### **Apresentação Visual**

#### **Botão de Nova Transação**

#### No canto direito do header existe um botão de destaque com fundo preto e texto branco. O botão exibe ícone de "+" e texto "Nova Transação". Este é o botão de call-to-action principal do dashboard.

#### No mobile, o botão ocupa largura total e tem altura maior (48px) para facilitar toque. No desktop, tem largura automática baseada no conteúdo (padding horizontal de 24px) e altura padrão (40px).

#### Clicar neste botão abre o modal de criação de nova transação, que será detalhado na seção de modais.

### **Cards de Resumo Financeiro**

#### Logo abaixo do header existem três cards grandes posicionados horizontalmente (no desktop) ou verticalmente (no mobile). Estes cards resumem a saúde financeira atual da família.

#### **Card de Saldo Total (Primeiro Card)**

#### Este é o card de maior destaque visual. Tem fundo completamente preto com texto branco, se diferenciando dos outros dois cards brancos.

#### No topo do card há um label pequeno "Saldo Total" em cinza claro. Abaixo, em fonte muito grande (32-36px), aparece o valor do saldo total formatado como moeda brasileira com cifrão, pontos de milhar e vírgula decimal: "R$ 12.458,90".

#### Abaixo do valor existe um pequeno badge arredondado com fundo semi-transparente branco contendo ícone de gráfico crescente e texto mostrando crescimento percentual: "+12% esse mês". Este percentual compara o saldo atual com o saldo do mês anterior.

#### No canto superior direito do card há um elemento decorativo: um círculo grande desfocado (blur intenso) na cor verde-limão com 20% de opacidade. Este "blob" está parcialmente cortado pelas bordas do card, criando efeito visual moderno.

#### Quando o usuário passa o mouse sobre o card, o blob aumenta sua opacidade para 30%, criando leve interação.

#### O saldo total é calculado somando os saldos positivos de todas as contas bancárias e subtraindo os valores das faturas pendentes de todos os cartões de crédito. Representa quanto dinheiro a família efetivamente possui disponível neste momento.

#### Este valor é afetado pelos filtros de período e membro. Se um período específico é selecionado, o cálculo considera apenas as transações dentro daquele período. Se um membro específico é filtrado, considera apenas contas e cartões daquele membro.

#### **Card de Receitas (Segundo Card)**

#### 

O resultado é uma lista horizontal de cards. Cada card tem fundo branco, borda cinza clara, largura fixa de 160px e altura automática. Os cards ficam alinhados lado a lado com espaço de 16px entre eles.

No topo de cada card há um gráfico donut (gráfico de rosca) com diâmetro de 64 pixels. O donut tem anel externo colorido representando o percentual da categoria e anel interno vazio (branco). No centro exato do donut, sobreposto, aparece o percentual calculado em texto: "30%".

A cor do anel externo varia por categoria, seguindo um array de cores definido: primeiro é verde-limão, segundo é preto, terceiro é cinza médio, quarto é cinza claro, e assim por diante em rotação.

Abaixo do donut, centralizado, aparece o nome da categoria em texto pequeno (12px) e cinza médio: "Alimentação". Se o nome for muito longo e não couber, é truncado com reticências.

Abaixo do nome aparece o valor total da categoria em fonte média (14px) e negrito preto: "R$ 1.500,00".

#### **Navegação e Scroll**

Como podem existir muitas categorias, o carrossel é scrollável. O usuário pode scrollar de três formas:

1. Mouse wheel: No desktop, girar a rodinha do mouse sobre o carrossel move-o horizontalmente.  
2. Clique e arrasta: Clicar em qualquer ponto do carrossel e arrastar o mouse para os lados desloca os cards.  
3. Setas de navegação: No desktop, quando o usuário passa o mouse sobre a área do carrossel, aparecem dois botões circulares flutuantes: um à esquerda e outro à direita. Estes botões têm fundo branco com sombra e ícones de setas. Clicar neles desloca o carrossel em aproximadamente 200 pixels na direção correspondente. Os botões desaparecem quando o mouse sai da área.

As bordas do carrossel têm um gradiente de máscara: a borda esquerda e direita ficam progressivamente transparentes, criando efeito de "fade out" e indicando visualmente que há mais conteúdo para scrollar.

Quando o usuário passa o mouse sobre um card individual, sua borda muda de cinza clara para verde-limão, criando feedback visual de hover.

No mobile, as setas de navegação não aparecem. O usuário simplesmente desliza com o dedo para scrollar, comportamento natural em dispositivos touch.

### **Gráfico de Fluxo Financeiro**

Abaixo do carrossel de categorias existe um card grande contendo um gráfico que mostra a evolução das receitas e despesas ao longo dos meses.

#### **Header do Gráfico**

No topo do card há um título "Fluxo Financeiro" com ícone de gráfico crescente à esquerda. À direita do título existe uma legenda horizontal mostrando dois itens: um círculo pequeno verde-limão com texto "Receitas" ao lado, e um círculo preto com texto "Despesas" ao lado. Esta legenda ajuda a interpretar as cores do gráfico.

#### **Estrutura do Gráfico**

O gráfico ocupa a área principal do card, com altura fixa de 300 pixels e largura responsiva (100% do card). Tem fundo cinza claro muito suave.

O gráfico é do tipo área (area chart) com duas séries de dados: receitas e despesas. Cada série é representada por uma linha com área preenchida abaixo.

No eixo horizontal (X) aparecem os nomes dos meses: Jan, Fev, Mar, Abr, Mai, Jun, Jul. Estes labels ficam na parte inferior do gráfico, espaçados uniformemente, com fonte pequena e cor cinza média. Não há linha vertical para o eixo.

No eixo vertical (Y) aparecem valores monetários formatados de forma compacta: R$ 2k, R$ 4k, R$ 6k, R$ 8k, R$ 10k. Estes labels ficam do lado esquerdo com a mesma formatação de cor e fonte do eixo X.

Linhas horizontais tracejadas muito sutis atravessam o gráfico em cada marca do eixo Y, criando grid que facilita leitura dos valores. As linhas são cinza claríssimo para não poluir visualmente.

#### **Área de Receitas**

A primeira área representando receitas tem linha de borda verde-limão com 3 pixels de espessura. A linha conecta os pontos de dados de cada mês formando curva suave (interpolação monotone).

Abaixo da linha, a área é preenchida com gradiente vertical: no topo (próximo à linha) a cor é verde-limão com 30% de opacidade; na base do gráfico a cor é verde-limão com 0% de opacidade (transparente). Isso cria efeito de "neblina" colorida que não obscurece a área de despesas abaixo.

#### **Área de Despesas**

A segunda área representando despesas tem linha de borda preta com 3 pixels de espessura, também com curva suave conectando os pontos mensais.

O preenchimento abaixo desta linha usa gradiente similar: topo com preto a 10% de opacidade, base com preto transparente. A opacidade menor que a de receitas garante que ambas áreas sejam visíveis mesmo quando sobrepostas.

#### **Interação com Tooltip**

Quando o usuário move o mouse sobre o gráfico, uma linha vertical fina cinza clara acompanha o cursor, indicando o mês sob o ponteiro.

Ao parar sobre um ponto específico, aparece um tooltip flutuante ao lado do cursor. O tooltip tem fundo branco com sombra elevada e bordas arredondadas.

Dentro do tooltip aparecem três linhas de texto:

* Primeira linha: Nome do mês em negrito e cinza escuro ("Janeiro")  
* Segunda linha: "Receitas: R$ 4.000,00" em cor verde escuro  
* Terceira linha: "Despesas: R$ 2.400,00" em cor preta

Os valores são formatados com moeda completa (cifrão, pontos de milhar, vírgula decimal).

Quando o mouse sai da área do gráfico, o tooltip desaparece imediatamente.

#### **Dados Utilizados**

Por enquanto o gráfico usa dados mock (fictícios) fixos para 7 meses. Cada mês tem valor de receita e despesa predefinido. No futuro, estes dados serão calculados dinamicamente baseados nas transações reais registradas no sistema, agrupadas por mês.

###  **Widget de Cartões de Crédito**

## **Visão Geral**

### O componente Widget de Cartões de Crédito é responsável por exibir, de forma resumida e visualmente clara, os cartões de crédito cadastrados pelo usuário dentro da dashboard. Ele apresenta o valor atual da fatura de cada cartão, o final do número do cartão e o percentual de uso em relação ao limite total, permitindo acesso rápido aos detalhes de cada cartão e ao fluxo de adição de novos cartões.

### O componente foi projetado para funcionar tanto em desktop quanto em mobile, mantendo consistência visual, legibilidade e interações claras.

### ---

## Estrutura Geral do Componente

### O widget é composto por um container principal com fundo cinza muito claro, bordas amplamente arredondadas e espaçamento interno confortável. Esse container encapsula todo o conteúdo do componente, incluindo o header e a lista de cartões.

### O componente é visualmente separado do restante da dashboard através de sombra extremamente sutil ou apenas contraste de fundo, evitando poluição visual.

### ---

## Header do Widget

### Na parte superior do componente existe um header fixo, sempre visível independentemente da quantidade de cartões.

### À esquerda do header há um ícone simples de cartão de crédito, seguido imediatamente pelo título “Cartões”. O título utiliza tipografia legível, com peso médio a semibold, e cor escura para garantir contraste com o fundo claro.

### À direita do header existe um único botão de ação. Esse botão é circular, com fundo branco, bordas totalmente arredondadas e ícone de adição representado pelo símbolo “+”. O botão tem tamanho suficiente para ser facilmente clicável tanto com mouse quanto em dispositivos touch.

### Ao passar o mouse sobre o botão, seu fundo muda suavemente para um tom de cinza claro, mantendo o ícone visível e contrastante. Ao ser clicado, o botão abre um modal de criação de novo cartão, permitindo que o usuário cadastre um novo cartão de crédito no sistema.

### ---

## Lista de Cartões

### Logo abaixo do header inicia-se a área de listagem dos cartões. Os cartões são exibidos em uma lista vertical, onde cada item representa um cartão de crédito distinto.

### Cada cartão é renderizado como um card independente, com fundo branco, cantos arredondados e sombra suave. A sombra serve apenas para elevar o card visualmente do fundo do widget, sem criar sensação de profundidade excessiva.

### Existe um espaçamento vertical consistente entre os cards, garantindo leitura clara mesmo quando há múltiplos cartões visíveis.

### ---

## Estrutura Visual de Cada Card de Cartão

### Cada card possui um layout horizontal dividido em três zonas visuais bem definidas: ícone do cartão à esquerda, informações textuais ao centro e indicador de uso à direita.

### Ícone do Cartão

### No lado esquerdo do card existe um bloco visual quadrado com cantos arredondados. Esse bloco funciona como identificador visual do cartão e recebe a cor principal do tema associado a ele.

### Dentro desse bloco é exibido um ícone simples de cartão de crédito em estilo outline. A cor do ícone sempre contrasta com o fundo do bloco para garantir legibilidade.

### O tamanho do bloco é consistente entre todos os cartões, garantindo alinhamento visual uniforme na lista.

### ---

### Informações do Cartão

### No centro do card ficam as informações textuais do cartão, organizadas verticalmente.

### Na primeira linha aparece o nome do cartão ou do banco emissor, como por exemplo “Nubank”, “Inter” ou “XP”. Esse texto utiliza uma fonte menor e cor neutra, servindo como rótulo informativo.

### Logo abaixo é exibido o valor da fatura atual do cartão. Esse valor é apresentado com destaque visual, utilizando fonte maior, peso forte e cor escura. O formato do valor segue o padrão monetário brasileiro, incluindo símbolo de moeda, separador de milhar e duas casas decimais.

### Abaixo do valor da fatura aparece o final do número do cartão, sempre mascarado, exibindo apenas os quatro últimos dígitos no formato “•••• 1234”. Esse texto é menor e possui cor mais suave, funcionando como informação complementar.

### ---

### Indicador de Uso do Cartão

### No lado direito do card existe um badge de uso do cartão. Esse badge é apresentado como um elemento circular ou levemente oval, com texto centralizado.

### O texto do badge representa o percentual de uso do cartão em relação ao seu limite total. Esse valor é calculado dinamicamente com base na seguinte fórmula:

### (valor da fatura atual ÷ limite total do cartão) × 100

### O valor exibido no badge é arredondado para número inteiro e seguido do símbolo de porcentagem.

### A cor de fundo e a cor do texto do badge variam de acordo com o tema do cartão, sempre garantindo contraste suficiente para leitura imediata. Em cartões com tema escuro, o badge tende a usar cores mais vibrantes; em cartões claros, o badge utiliza fundo escuro com texto claro.

### O badge permanece sempre alinhado verticalmente ao centro do card.

### ---

## Temas Visuais dos Cartões

### Cada cartão pode possuir um tema visual próprio. O tema afeta exclusivamente o bloco do ícone do cartão e o badge de percentual de uso, mantendo o restante do card sempre branco.

### Os temas suportados são:

* ### Tema escuro (preto) 

* ### Tema verde-limão 

* ### Tema neutro claro 

### Esses temas servem apenas como identificação visual rápida do cartão e não alteram a estrutura do componente.

### ---

## Paginação de Cartões

### Quando a quantidade de cartões ultrapassa o limite visual definido para o widget (por exemplo, mais de três cartões visíveis simultaneamente), o componente ativa um sistema de paginação.

### A paginação é exibida logo abaixo da lista de cartões e indica ao usuário que existem mais cartões disponíveis. A navegação pode ser feita por meio de controles de avançar e voltar ou por indicador de página atual, como “1 / 2”.

### Ao navegar entre páginas, o conteúdo da lista de cartões é atualizado mantendo o mesmo layout, estrutura e estilos visuais. A transição entre páginas ocorre de forma suave, utilizando animação leve de fade ou deslocamento horizontal curto.

### Em dispositivos mobile, a paginação também pode ser acionada por gesto de swipe horizontal.

### ---

## Interações com os Cards

### Cada card é totalmente interativo. Ao passar o mouse sobre um card, ele reage visualmente elevando-se levemente no eixo vertical, geralmente cerca de 4 pixels, acompanhado por um aumento sutil da sombra. Essa animação ocorre de forma suave, com duração aproximada de 200 a 300 milissegundos.

### O cursor do mouse muda para o formato de ponteiro ao passar sobre o card, indicando que ele é clicável.

### Ao clicar em um card, o sistema abre um modal de detalhes do cartão, onde são exibidas informações completas como limite total, valor disponível, data de vencimento da fatura e histórico de despesas.

### ---

## Considerações de Responsividade

### No mobile, o componente ocupa toda a largura disponível da tela. Os cards mantêm o mesmo layout horizontal, com ajustes leves de espaçamento e tamanho de fonte para garantir legibilidade em telas menores.

### O botão de adicionar cartão no header permanece acessível e com área de toque adequada.

###    Widget de Próximas Despesas

### Propósito

### O widget apresenta uma visão consolidada das despesas que estão por vencer, permitindo que o usuário visualize rapidamente suas obrigações financeiras futuras e marque-as como pagas conforme realiza os pagamentos.

### Comportamento Principal

### O widget exibe uma lista cronológica de todas as despesas pendentes, ordenadas pela proximidade do vencimento. As despesas mais urgentes aparecem no topo, facilitando a identificação de prioridades de pagamento.

### Cada despesa mostra três informações essenciais:

* ### O nome/descrição da despesa

* ### Quando ela vence

* ### De qual conta ou cartão será debitada

### Interações do Usuário

### Adicionar Nova Despesa O botão no canto superior direito do widget abre o modal de criação de transação, permitindo registrar uma nova despesa rapidamente sem sair do contexto da dashboard.

### Marcar Despesa como Paga Ao clicar no botão de confirmação ao lado de uma despesa, o usuário registra que aquele pagamento foi realizado. A despesa é imediatamente removida da lista de pendências.

### Para despesas recorrentes (como assinaturas mensais), ao marcar como paga, o sistema automaticamente agenda a próxima ocorrência para o mês seguinte, mantendo o acompanhamento contínuo sem necessidade de recadastramento.

### Para despesas parceladas, ao marcar uma parcela como paga, a próxima parcela aparece automaticamente na lista com a data de vencimento atualizada.

### Estados do Widget

### Com Despesas Pendentes A lista apresenta todas as obrigações futuras em ordem de vencimento. O usuário consegue navegar pela lista e identificar rapidamente quais contas precisa pagar nos próximos dias.

### Sem Despesas Pendentes Quando todas as contas foram pagas ou não há despesas cadastradas, o widget exibe uma mensagem de confirmação indicando que não há pendências financeiras no momento.

### Atualização Automática

### Sempre que o usuário registra uma nova transação marcada como recorrente, ela aparece automaticamente na lista. Da mesma forma, ao cadastrar uma compra parcelada, todas as parcelas futuras são listadas com suas respectivas datas de vencimento.

###  

#### **Dados de Contas**

O sistema mantém uma lista de contas/bills que contém:

* ID único  
* Data de vencimento  
* Descrição textual  
* Valor  
* Status (pago ou pendente)  
* Tipo (fixa: conta recorrente mensal, ou card: fatura de cartão)

Por enquanto estas contas são dados mock fixos. No futuro, serão calculadas automaticamente: contas fixas baseadas em transações recorrentes cadastradas, e contas de cartão baseadas nas datas de vencimento dos cartões registrados.

### **Seção de Objetivos**

Mais abaixo no dashboard existe uma seção dedicada aos objetivos financeiros da família.

#### **Header da Seção**

A seção começa com um header horizontal que tem:

À esquerda: Ícone de alvo (target) dentro de um círculo preto com fundo preto e ícone branco, seguido do título "Objetivos" em fonte grande e negrito.

À direita: Botão fantasma (sem fundo) com texto "Ver mais" e ícone de seta para direita. Clicar neste botão navega para a view completa de objetivos onde todos os objetivos são listados.

#### **Grid de Objetivos**

Abaixo do header, os objetivos aparecem em grid responsivo:

* Mobile: 1 coluna (objetivos empilhados verticalmente)  
* Tablet: 2 colunas  
* Desktop: 4 colunas

O espaçamento entre cards é generoso (24px). Apenas os primeiros 4 objetivos são mostrados nesta seção do dashboard, mesmo que existam mais objetivos cadastrados.

#### **Estrutura do Card de Objetivo**

Cada objetivo é um card vertical com fundo branco, borda clara e bordas muito arredondadas (32px). O card é dividido em duas áreas principais: imagem e conteúdo.

Área de Imagem (Topo): Ocupa metade superior do card com altura fixa de 192 pixels. A imagem cadastrada no objetivo preenche totalmente esta área usando object-fit: cover, ou seja, a imagem é recortada/redimensionada para cobrir todo o espaço mantendo proporção.

Sobreposta à imagem, no canto superior direito, há um badge pequeno com fundo preto semi-transparente com leve desfoque (backdrop blur), criando efeito glassmorphism. Dentro do badge, em texto minúsculo branco, aparece a categoria do objetivo: "Lazer", "Transporte", etc.

Quando o usuário passa mouse sobre o card, a imagem aumenta levemente de escala (scale 1.05) criando leve efeito de zoom. Esta transição é lenta (700ms) para ser mais suave e elegante.

Área de Conteúdo (Base): Tem padding interno generoso e é dividida verticalmente em duas subáreas: informações e progresso.

Subárea de Informações: Primeiro aparece o nome do objetivo em fonte média (18px) e negrito: "Viagem em Família".

Logo abaixo, uma linha mostra dois valores monetários: valor atual em destaque (fonte 20px, negrito, preto) "R$ 3.500,00" seguido de "de" em fonte minúscula cinza e o valor da meta também em cinza: "de R$ 10.000,00".

Subárea de Progresso: Contém uma barra de progresso horizontal com altura pequena (10px), fundo cinza claro e bordas arredondadas completas (pill shape).

Dentro desta barra, outra barra preenchida com cor verde-limão representa o progresso atual. A largura desta barra é percentual calculado: (valorAtual / valorMeta) × 100\. Por exemplo, se tem R$ 3.500 de R$ 10.000, a barra verde preenche 35% da largura total.

A animação de preenchimento da barra é suave e lenta (1000ms) para criar efeito agradável quando a página carrega ou quando o valor é atualizado.

Abaixo da barra, em linha horizontal com espaço entre os itens:

* À esquerda: percentual em texto pequeno negrito preto: "35%"  
* À direita: valor faltante em texto pequeno negrito cinza: "Faltam R$ 6.500,00"

#### **Interação com Card**

Quando o usuário passa mouse sobre todo o card, além do zoom na imagem, a borda do card muda de cinza clara para cinza média, e a sombra aumenta levemente, criando efeito de elevação sutil.

Clicar no card poderia abrir modal com detalhes do objetivo (contribuições, histórico, etc), mas este modal não está implementado na versão MVP do dashboard.

### **Tabela de Transações Detalhada**

A última seção do dashboard é uma tabela completa mostrando todas as transações registradas.

#### **Header da Tabela**

No topo da seção há um header horizontal. À esquerda, título "Extrato Detalhado" em fonte grande e negrito. À direita, controles de busca e filtro para a tabela.

Campo de Busca da Tabela: Similar ao campo de busca do header principal, mas específico para esta tabela. Tem ícone de lupa, placeholder "Buscar lançamentos..." e largura média (256px no desktop, 100% no mobile). A busca é em tempo real e filtra por descrição OU categoria.

Select de Tipo: Dropdown ao lado da busca permite filtrar por tipo. Opções: "Todos", "Receitas", "Despesas". Tem largura fixa (140px) no desktop e 100% no mobile. Quando uma opção é selecionada, a tabela mostra apenas transações daquele tipo.

#### **Estrutura da Tabela**

A tabela tem borda clara arredondada contornando toda ela. O header da tabela (linha com nomes das colunas) tem fundo cinza claro para se diferenciar das linhas de dados.

Colunas da Tabela:

1. Avatar: Coluna estreita (50px) mostrando foto circular pequena (24px) do membro responsável pela transação. Se não houver foto ou membro, mostra ícone de usuário genérico.  
2. Data: Mostra data da transação formatada como "DD/MM/AAAA" (exemplo: "15/01/2024") em texto cinza médio.  
3. Descrição: Mostra ícone indicativo do tipo seguido da descrição textual. Para receitas, ícone é seta diagonal para baixo-esquerda em círculo com fundo verde claro. Para despesas, ícone é seta diagonal para cima-direita em círculo com fundo vermelho claro. A descrição aparece em texto negrito preto.  
4. Categoria: Nome da categoria em badge arredondado com fundo cinza claro e texto cinza médio.  
5. Conta/Cartão: Nome da conta bancária ou cartão de crédito de onde saiu/entrou o dinheiro. Texto cinza médio. O sistema busca o nome na lista de contas; se não encontrar, busca na lista de cartões; se não encontrar em nenhuma, mostra "Desconhecido".  
6. Parcelas: Se a transação foi parcelada, mostra "3x", "6x", etc. Se foi à vista (parcelas \= 1), mostra apenas "-" (traço).  
7. Valor: Alinhado à direita, mostra o valor com prefixo de sinal. Receitas têm "+" em verde ("+R$ 5.000,00"). Despesas têm "-" em preto ("-R$ 350,00"). Fonte negrito.

Linhas de Dados: Cada linha representa uma transação. As linhas alternam sutilmente entre fundo completamente branco e fundo com levíssimo cinza (zebra striping) para facilitar leitura.

Quando o usuário passa mouse sobre uma linha, ela fica com fundo cinza claro mais perceptível, destacando a linha inteira.

#### **Filtragem e Busca**

A tabela considera múltiplos filtros simultaneamente:

Filtros Globais: Se há filtro de membro ativo no header do dashboard, a tabela mostra apenas transações daquele membro. Se há filtro de período ativo, mostra apenas transações dentro daquele intervalo de datas.

Filtros Locais: O campo de busca local da tabela adiciona mais um filtro. Se há busca de "mercado", mostra apenas transações cuja descrição OU categoria contenha a palavra "mercado". O select de tipo adiciona mais filtro: se "Despesas" está selecionado, mostra apenas transações de tipo despesa.

Todos estes filtros trabalham em conjunto (AND lógico). Uma transação só aparece se passar por TODOS os filtros ativos.

Ordenação: Independente dos filtros, as transações são sempre ordenadas por data em ordem decrescente (mais recente primeiro, mais antiga por último).

#### **Paginação**

Como pode haver muitas transações, a tabela implementa paginação. São exibidas apenas 5 transações por vez.

Abaixo da tabela, do lado esquerdo, aparece um contador: "Mostrando 1 a 5 de 47", indicando quais itens estão visíveis e quantos existem no total.

Do lado direito aparecem os controles de navegação:

Botão Anterior: Círculo com ícone de seta para esquerda. Clicável apenas se não estiver na primeira página. Quando clicável, tem hover state. Quando está na primeira página, fica com cor cinza clara e cursor normal (disabled).

Números de Página: Sequência de botões circulares numerados. Se há 10 páginas, aparecem botões "1", "2", "3", ... "10". A página atual tem fundo preto com texto branco. As outras têm fundo transparente com texto cinza médio. Clicar em qualquer número salta para aquela página.

Se houver muitas páginas (mais de 7), o sistema mostra apenas as primeiras 3, reticências "...", e as últimas 2\. Exemplo: "1 2 3 ... 9 10". Sempre mostra a página atual e páginas adjacentes.

Botão Próxima: Círculo com ícone de seta para direita. Clicável apenas se não estiver na última página. Disabled na última página.

Quando o usuário muda de página, a tabela rola suavemente até o topo e as novas 5 transações são carregadas com leve fade-in.

Comportamento com Filtros: Quando qualquer filtro é modificado (busca, tipo, membro, período), a paginação é resetada automaticamente para a página 1\. O total de páginas é recalculado baseado no número de transações que passaram nos filtros.

#### **Estado Vazio**

Se após aplicar todos os filtros não houver nenhuma transação para mostrar, a tabela exibe uma linha especial ocupando todas as colunas. Esta linha tem altura generosa (96px) e mostra uma mensagem centralizada em cinza médio: "Nenhum lançamento encontrado."

Isso diferencia de um erro (mensagem seria vermelha) e indica que os filtros simplesmente resultaram em lista vazia.

---

## **🔄 MODAIS DO SISTEMA**

### **Modal de Nova Transação**

Este modal abre quando o usuário clica no botão "Nova Transação" do header do dashboard ou em outros lugares do sistema que permitem adicionar transação.

#### **Apresentação e Layout**

O modal aparece centralizado na tela sobre uma camada escura semi-transparente que cobre todo o conteúdo de fundo (overlay). O modal tem fundo branco, bordas arredondadas generosas, sombra forte e largura média (500-600px no desktop, 90% da tela no mobile).

O modal é dividido em três áreas: header, conteúdo e footer.

Header do Modal: Barra superior com título "Nova Transação" à esquerda em fonte grande e negrito. À direita, botão circular pequeno com ícone X para fechar. O header tem borda inferior sutil separando do conteúdo.

Conteúdo do Modal: Área scrollável (se necessário) contendo o formulário. Tem padding interno generoso.

Footer do Modal: Barra inferior fixa com dois botões horizontais:

* "Cancelar" à esquerda: botão com borda e fundo transparente  
* "Salvar Transação" à direita: botão preenchido com fundo preto e texto branco

#### **Campos do Formulário**

Toggle de Tipo: No topo do formulário, dois botões grandes lado a lado ocupando largura total:

* "Receita" à esquerda com ícone de seta para baixo  
* "Despesa" à direita com ícone de seta para cima

Apenas um pode estar selecionado por vez. O selecionado tem fundo preto com texto branco. O não selecionado tem fundo branco com borda e texto cinza. Clicar alterna entre os dois.

Campo de Valor: Input numérico grande com label "Valor" acima. O campo aceita apenas números e formata automaticamente enquanto o usuário digita. Ao digitar "3500", o campo mostra "R$ 3.500,00" com formatação de moeda brasileira. Campo obrigatório.

Campo de Descrição: Input de texto com label "Descrição". Placeholder: "Ex: Salário do mês, Compras no mercado...". Campo obrigatório com mínimo de 3 caracteres.

Select de Categoria: Dropdown com label "Categoria". Ao clicar, abre lista de categorias apropriadas ao tipo selecionado. Se tipo é "Receita", mostra categorias de receita (Salário, Freelance, Investimentos...). Se tipo é "Despesa", mostra categorias de despesa (Alimentação, Transporte, Moradia...). Campo obrigatório.

Se o usuário quiser categoria que não existe na lista, há opção "Outra..." que revela um campo de texto adicional para digitar nova categoria.

Campo de Data: DatePicker com label "Data". Mostra calendário ao clicar. Usuário seleciona data da transação. Por padrão, vem preenchido com data atual. Campo obrigatório.

Select de Conta: Dropdown com label "Conta/Cartão". Lista todas as contas bancárias e cartões de crédito cadastrados. Usuário escolhe de onde saiu ou para onde entrou o dinheiro. Campo obrigatório.

Select de Membro: Dropdown com label "Membro Responsável". Lista todos os membros da família. Campo opcional \- se não preenchido, transação é considerada "familiar" (sem responsável específico).

Campo de Parcelas: Input numérico com label "Parcelas". Aceita números inteiros de 1 a 99\. Por padrão vem com "1" (à vista). Se usuário colocar número maior que 1, indica transação parcelada. Campo opcional (default 1).

Toggle de Status: Dois botões pequenos lado a lado:

* "Pendente": transação foi registrada mas dinheiro ainda não movimentou  
* "Concluído": transação já foi efetivada

Por padrão vem "Concluído" selecionado. Campo opcional.

#### **Validação**

Quando o usuário clica em "Salvar Transação", o sistema valida todos os campos obrigatórios:

Valor: Deve ser maior que zero. Se for zero ou campo vazio, mostra mensagem de erro abaixo do campo: "Por favor, insira um valor válido" em vermelho.

Descrição: Deve ter pelo menos 3 caracteres. Se menor, mostra: "Descrição muito curta (mínimo 3 caracteres)".

Categoria: Deve estar selecionada. Se vazia, mostra: "Por favor, selecione uma categoria".

Data: Deve ser data válida. Validação automática do componente de calendário.

Conta: Deve estar selecionada. Se vazia, mostra: "Por favor, selecione uma conta".

Se houver qualquer erro de validação, o formulário não é submetido. Os campos com erro ficam com borda vermelha e as mensagens de erro aparecem. O modal continua aberto.

#### **Salvamento**

Se todas as validações passarem, o sistema cria um novo objeto de transação com:

* ID único gerado automaticamente  
* Tipo conforme selecionado (income ou expense)  
* Valor numérico limpo (sem formatação)  
* Descrição textual  
* Categoria selecionada  
* Data escolhida convertida para objeto Date  
* Account ID da conta selecionada  
* Member ID do membro selecionado (ou null se não selecionado)  
* Número de parcelas  
* Status selecionado

Este novo objeto é adicionado à lista global de transações no contexto do sistema.

O modal fecha automaticamente com animação de fade out. Uma notificação toast aparece no canto superior direito da tela por 3 segundos: "Transação adicionada com sucesso\!" em fundo verde com ícone de check.

Todo o dashboard atualiza automaticamente: os cards de resumo recalculam valores, o gráfico de categorias pode ganhar nova categoria ou aumentar valor de existente, a tabela de transações adiciona a nova linha no topo (por ser mais recente).

O formulário é limpo internamente, então se o usuário abrir o modal novamente, todos os campos estarão vazios/padrão.

#### **Cancelamento**

Se o usuário clicar em "Cancelar" ou no X do header ou clicar fora do modal na área escura do overlay, o modal fecha sem salvar. Se havia algum campo preenchido, os dados são descartados. Não há confirmação de perda de dados na versão MVP.

### **Modal de Adicionar Membro**

Abre quando o usuário clica no botão "+" ao lado dos avatares de membros no header do dashboard.

#### **Estrutura**

Similar ao modal de transação: overlay escuro, modal centralizado branco com header, conteúdo e footer.

Header: "Adicionar Membro da Família" com botão X.

Footer: Botões "Cancelar" e "Adicionar Membro".

#### **Campos**

Nome Completo: Input de texto obrigatório. Label: "Nome Completo". Placeholder: "Ex: João Silva". Validação: mínimo 3 caracteres.

Função/Papel: Input de texto obrigatório. Label: "Função na Família". Placeholder: "Ex: Pai, Mãe, Filho, Avô...". Dropdown com sugestões comuns mas permite texto livre.

Avatar: Campo especial para imagem. Duas opções de abas:

* "URL": Input de texto onde usuário cola URL de imagem da internet  
* "Upload": Botão para fazer upload de arquivo (aceita JPG, PNG, max 5MB)

Se nenhuma imagem for fornecida, sistema usa avatar padrão genérico.

Renda Mensal: Input numérico opcional. Label: "Renda Mensal Estimada (opcional)". Formatação automática de moeda. Campo usado para planejamento futuro mas não obrigatório.

#### **Salvamento**

Valida nome e função (obrigatórios). Se válido, cria novo objeto de membro com ID único gerado, nome, função, URL do avatar (ou URL de avatar padrão) e renda (ou zero se não informado).

Adiciona à lista global de membros. Modal fecha. Toast de sucesso. O novo membro aparece imediatamente nos avatares do header do dashboard e nos dropdowns de seleção de membro em formulários.

### **Modal de Adicionar Cartão**

Abre quando o usuário clica no botão "+" no widget de cartões.

#### **Campos**

Nome do Cartão/Banco: Input de texto obrigatório. Ex: "Nubank", "Itaú Mastercard".

Dia de Fechamento: Input numérico de 1 a 31 indicando dia do mês em que a fatura fecha. Obrigatório.

Dia de Vencimento: Input numérico de 1 a 31 indicando dia do mês para pagamento. Obrigatório.

Limite Total: Input numérico formatado como moeda. Valor máximo que pode ser gasto no cartão. Obrigatório.

Fatura Atual: Input numérico formatado como moeda. Quanto já foi gasto na fatura atual. Pode ser zero. Opcional (default 0).

Tema Visual: Três opções de escolha visual:

* Retângulo preto com label "Black"  
* Retângulo verde-limão com label "Lime"  
* Retângulo branco com borda e label "White"

Usuário clica no tema desejado. Apenas um pode estar selecionado. Campo obrigatório.

Logo do Banco: Input de URL opcional. Se fornecido, logo aparece no cartão.

Últimos 4 Dígitos: Input numérico opcional de exatamente 4 dígitos. Ajuda a identificar o cartão físico.

#### **Salvamento**

Valida campos obrigatórios. Cria objeto de cartão com ID único, nome, datas de fechamento/vencimento, limite, fatura, tema, logo URL e dígitos.

Adiciona à lista global de cartões. Modal fecha. Toast de sucesso. O novo cartão aparece imediatamente no stack de cartões do dashboard e nos dropdowns de seleção de conta em formulários de transação.

### **Modal de Detalhes do Cartão**

Abre quando o usuário clica em qualquer cartão no stack do widget de cartões.

#### **Estrutura**

Modal maior que os anteriores (largura média-grande). Header com nome do cartão e botão X. Conteúdo dividido em áreas.

#### **Área de Informações**

Seção superior mostrando em cards ou lista:

* Limite total  
* Fatura atual  
* Limite disponível (cálculo: limite \- fatura)  
* Percentual de uso  
* Data de fechamento  
* Data de vencimento  
* Últimos 4 dígitos (se cadastrado)

Também pode incluir gráfico visual tipo donut ou progress bar mostrando uso do limite de forma gráfica.

#### **Área de Despesas**

Tabela listando todas as transações de despesa que estão vinculadas a este cartão (campo accountId da transação igual ao ID deste cartão).

Tabela simplificada com colunas:

* Data  
* Descrição  
* Categoria  
* Parcelas  
* Valor

Similar à tabela principal do dashboard mas focada apenas neste cartão. Também tem paginação se houver muitas despesas.

#### **Ações**

Botões na área inferior ou superior do modal:

* "Ver Extrato Completo": navega para view de transações com filtro automático deste cartão  
* "Adicionar Despesa": abre modal de nova transação com campo de conta pré-preenchido com este cartão  
* "Editar Cartão": abre formulário para editar informações do cartão  
* "Fechar": fecha o modal voltando ao dashboard

### **Modal de Filtros Mobile**

Este modal específico para dispositivos móveis abre quando o usuário toca no botão de filtros (ícone de sliders) no header mobile.

#### **Animação**

O modal aparece deslizando de baixo para cima (slide-in), iniciando abaixo da tela e subindo até ocupar toda a altura. A animação é suave e rápida (300ms).

#### **Estrutura**

Header Fixo: Ocupa topo da tela. Fundo branco com borda inferior. Contém título "Filtros" à esquerda e botão X grande à direita (fácil de tocar). Este header permanece fixo mesmo quando o conteúdo abaixo rola.

Conteúdo Scrollável: Ocupa área central entre header e footer. Permite scroll vertical se necessário. Contém todas as opções de filtro organizadas em seções com espaçamento generoso.

Footer Fixo: Ocupa base da tela. Fundo branco com borda superior. Contém um único botão grande ocupando quase toda a largura: "Aplicar Filtros" com altura de 56px, fundo preto, texto branco. Botão permanece visível mesmo quando o conteúdo acima rola.

#### **Seções de Filtro**

Tipo de Transação: Label "Tipo de Transação" em negrito.

Abaixo, grid de 3 colunas com botões:

* "Todos"  
* "Receitas"  
* "Despesas"

Cada botão ocupa largura igual (33% cada). Botões têm altura generosa (48px) para facilitar toque. Botão selecionado tem fundo preto com texto branco. Não selecionados têm fundo branco com borda cinza.

Membro da Família: Label "Membro da Família" em negrito.

Abaixo, botões horizontais com wrap (quebram linha se necessário):

Primeiro botão: "Todos" sozinho.

Depois, um botão para cada membro cadastrado. Cada botão mostra avatar circular pequeno (32px) à esquerda e nome do membro à direita. Botão tem altura de 48px, padding horizontal, bordas arredondadas completas (pill shape).

Botão selecionado: fundo preto, texto branco, avatar com borda branca. Não selecionado: fundo branco, borda cinza, texto cinza.

Ao tocar, alterna seleção.

Período: Label "Período" em negrito.

Abaixo, calendário de um único mês ocupando largura total. Calendário permite seleção de intervalo (dois toques: primeiro define início, segundo define fim). Intervalo selecionado fica destacado visualmente com fundo.

Calendário tem controles de navegação (setas) para mudar de mês no topo.

#### **Comportamento**

O usuário pode ajustar quantos filtros quiser. As seleções ficam em estado temporário (não aplicadas ainda).

Quando o usuário toca em "Aplicar Filtros", os filtros temporários são aplicados ao estado global do sistema, o modal fecha com animação slide-out (desliza para baixo) e todo o dashboard atualiza refletindo os novos filtros.

Se o usuário toca no X ou toca fora da área do modal (no overlay escuro), o modal fecha SEM aplicar os filtros, descartando as mudanças temporárias.

---

## **🔗 INTEGRAÇÕES E FLUXOS COMPLEXOS**

### **Fluxo: Adicionar Transação Completo**

1. Usuário clica em "Nova Transação"  
2. Modal abre com fade-in (200ms)  
3. Formulário renderiza com campos vazios/padrão (Tipo: Despesa, Parcelas: 1, Status: Concluído)  
4. Usuário seleciona tipo "Receita" → botão fica preto  
5. Usuário digita valor "5000" → campo formata automaticamente para "R$ 5.000,00"  
6. Usuário digita descrição "Salário do mês"  
7. Usuário clica no select de categoria → dropdown abre mostrando apenas categorias de receita  
8. Usuário escolhe "Salário" → dropdown fecha, valor aparece no select  
9. Usuário clica no campo de data → calendário abre  
10. Calendário mostra mês atual com dia atual destacado  
11. Usuário clica em um dia → data é selecionada, calendário fecha  
12. Usuário clica no select de conta → dropdown abre com todas contas e cartões  
13. Usuário escolhe "Itaú Conta Corrente"  
14. Usuário deixa membro vazio (transação familiar)  
15. Usuário deixa parcelas em 1 (à vista)  
16. Usuário deixa status em Concluído  
17. Usuário clica em "Salvar Transação"  
18. Sistema valida todos os campos → todos válidos  
19. Sistema cria objeto: { id: "uuid-generated", type: "income", amount: 5000, description: "Salário do mês", category: "Salário", date: Date object, accountId: "itau-cc-id", memberId: null, installments: 1, status: "completed" }  
20. Sistema adiciona objeto ao array de transações no contexto global  
21. Modal fecha com fade-out (200ms)  
22. Toast aparece no canto superior direito: "Transação adicionada com sucesso\!" em verde  
23. Card de Receitas no dashboard recalcula: soma todas receitas incluindo a nova → atualiza valor exibido com animação de contagem  
24. Card de Saldo Total recalcula: adiciona R$ 5.000 ao saldo anterior → atualiza com animação  
25. Gráfico de categorias NÃO muda (pois nova transação é receita, gráfico mostra apenas despesas)  
26. Tabela de transações adiciona nova linha no topo (por ser mais recente)  
27. Linha aparece com fade-in  
28. Se tabela tinha paginação e estava cheia, pode adicionar nova página  
29. Contador da paginação atualiza: "Mostrando 1 a 5 de 48" (era 47, agora é 48\)  
30. Toast desaparece automaticamente após 3 segundos com fade-out

### **Fluxo: Filtrar por Membro e Período Combinados**

1. Dashboard está mostrando dados consolidados de toda a família do mês atual  
2. Usuário clica no avatar de "Maria" nos filtros do header  
3. Avatar de Maria ganha borda preta e ícone de check  
4. Filtro de membro "Maria" é aplicado ao estado global  
5. Sistema dispara recálculo em todos os componentes que dependem de transações:  
   Cards de Resumo:  
   * Card de Receitas: filtra transações tipo "income" onde memberId \= "maria-id" E data no mês atual → soma valores → atualiza display  
   * Card de Despesas: filtra transações tipo "expense" onde memberId \= "maria-id" E data no mês atual → soma valores → atualiza display  
   * Card de Saldo: calcula baseado apenas em contas e cartões de Maria (se houver distinção) ou mantém geral  
6. Gráfico de Categorias:  
   * Filtra despesas onde memberId \= "maria-id" E data no mês atual  
   * Reagrupa por categoria  
   * Recalcula percentuais  
   * Re-renderiza donuts com novos valores  
   * Se Maria não tem despesas em alguma categoria que antes aparecia, aquele donut desaparece  
   * Animação suave de transição  
7. Tabela de Transações:  
   * Filtra todas transações onde memberId \= "maria-id" E data no mês atual  
   * Reordena por data decrescente  
   * Recalcula paginação (pode ter menos páginas agora)  
   * Reseta para página 1  
   * Re-renderiza linhas com fade-in  
   * Contador atualiza: "Mostrando 1 a 5 de 23" (apenas transações de Maria)  
8. Todas as atualizações acontecem simultaneamente com animações coordenadas (duração similar)  
9. Agora usuário decide alterar o período  
10. Usuário clica no botão de período (que mostra mês atual)  
11. Calendário duplo abre  
12. Usuário clica em dia 1 de Janeiro como início  
13. Intervalo começa a ser definido (visual de seleção temporária)  
14. Usuário clica em dia 31 de Março como fim  
15. Intervalo completo fica destacado (3 meses)  
16. Usuário clica fora do calendário ou em OK  
17. Calendário fecha  
18. Filtro de período "01/01/2024 \- 31/03/2024" é aplicado ao estado global  
19. Texto do botão de período atualiza: "01 jan \- 31 mar, 2024"  
20. Sistema dispara novo recálculo em todos os componentes, agora com DOIS filtros ativos:

Filtro 1: memberId \= "maria-id" Filtro 2: data \>= 01/01/2024 E data \<= 31/03/2024

Cards:

* Receitas de Maria entre Jan-Mar  
* Despesas de Maria entre Jan-Mar  
* Saldo considerando período

Gráfico de Categorias:

* Despesas de Maria entre Jan-Mar agrupadas  
* Percentuais calculados em relação às receitas de Maria entre Jan-Mar

Tabela:

* Transações de Maria entre Jan-Mar  
* Ordenadas por data decrescente  
* Paginação recalculada (pode ter mais itens agora por ser 3 meses)  
* "Mostrando 1 a 5 de 67"  
19. Todas as visualizações atualizam novamente com animações  
20. Dados agora refletem apenas Maria nos últimos 3 meses  
21. Se usuário clicar novamente no avatar de Maria, o filtro de membro é removido mas o filtro de período permanece  
22. Dados voltam a mostrar toda a família, mas ainda limitados aos últimos 3 meses

### **Fluxo: Interação com Calendário de Contas**

1. Widget de calendário renderiza mostrando o mês atual  
2. Sistema busca todas as contas pendentes (status \= "pending")  
3. Para cada conta, verifica se a data de vencimento cai no mês sendo exibido  
4. Conta 1: "Conta de Luz", vence dia 15 do mês atual → adiciona indicador visual no dia 15  
5. Conta 2: "Internet", vence dia 17 do mês atual → adiciona indicador no dia 17  
6. Conta 3: "Escola", vence dia 20 do mês atual → adiciona indicador no dia 20  
7. Calendário renderiza com três dias tendo ponto vermelho abaixo do número  
8. Por padrão, o dia atual (hoje) está selecionado  
9. Lista abaixo mostra contas do dia atual  
10. Hoje não há contas → lista mostra "Nada hoje." com borda tracejada  
11. Usuário clica no dia 15  
12. Dia 15 fica destacado com fundo verde-limão  
13. Lista abaixo atualiza: busca contas com data \= dia 15  
14. Encontra "Conta de Luz \- R$ 240,00"  
15. Lista renderiza um item:  
    * Indicador circular vermelho (pendente)  
    * Texto "Conta de Luz"  
    * Botão de check à direita  
16. Usuário passa mouse sobre o botão de check  
17. Botão muda: fundo fica verde claro, borda verde, ícone verde  
18. Usuário clica no botão de check  
19. Sistema altera o status da conta no array de contas: { ...conta, paid: true }  
20. Indicador circular muda de vermelho para verde instantaneamente  
21. Ponto vermelho abaixo do dia 15 no calendário desaparece (já não há contas pendentes naquele dia)  
22. Lista permanece mostrando a conta (agora em verde) por alguns segundos  
23. Usuário clica no dia 17  
24. Lista atualiza mostrando "Internet \- R$ 120,00" com indicador vermelho  
25. Dia 17 tem ponto vermelho  
26. Processo se repete

---

## **📊 CÁLCULOS E LÓGICA DE NEGÓCIO**

### **Cálculo de Saldo Total**

O saldo total representa quanto dinheiro a família efetivamente possui disponível neste momento. O cálculo é:

1. Somar saldos positivos de todas as contas bancárias cadastradas  
2. Para cada cartão de crédito, verificar o valor da fatura atual  
3. Subtrair todos os valores de faturas do total de contas  
4. Resultado: Saldo Total \= Σ(saldos de contas) \- Σ(faturas de cartões)

Exemplo:

* Conta Corrente Itaú: R$ 5.000  
* Poupança: R$ 8.000  
* Total de contas: R$ 13.000  
* Fatura Nubank: R$ 3.450  
* Fatura Itaú: R$ 1.200  
* Fatura Inter: R$ 890  
* Total de faturas: R$ 5.540

Saldo Total \= R$ 13.000 \- R$ 5.540 \= R$ 7.460

Este valor é exibido no card principal preto.

### **Cálculo de Receitas do Período**

1. Filtrar array de transações por tipo \= "income"  
2. Se há filtro de período ativo, manter apenas transações cuja data está dentro do intervalo  
3. Se há filtro de membro ativo, manter apenas transações daquele membro  
4. Somar o campo "amount" de todas as transações restantes  
5. Retornar soma

### **Cálculo de Despesas do Período**

Idêntico ao de receitas, mas filtrar por tipo \= "expense".

### **Cálculo de Percentual por Categoria**

Para cada categoria de despesa no período:

1. Filtrar despesas daquela categoria específica  
2. Aplicar filtros ativos (período, membro, busca)  
3. Somar valores: valorTotalCategoria  
4. Calcular receita total do período (com mesmos filtros)  
5. Percentual \= (valorTotalCategoria / receitaTotal) × 100  
6. Arredondar para 1 casa decimal  
7. Se receita total for zero, retornar 0% para evitar divisão por zero

Este percentual aparece no centro dos donuts do carrossel de categorias.

### **Ordenação de Categorias**

Após calcular valor total de cada categoria:

1. Criar array de objetos: \[{ nome, valor, percentual }, ...\]  
2. Ordenar array usando sort() com comparação: (a, b) \=\> b.valor \- a.valor  
3. Isso coloca categoria com maior valor primeiro, menor valor por último  
4. Retornar array ordenado

Este array ordenado é usado para renderizar os donuts da esquerda para direita.

### **Cálculo de Uso de Cartão**

Para o badge de percentual em cada cartão:

1. Pegar valorDaFatura e limiteTotal do cartão  
2. Se limiteTotal for zero, retornar "0.0%" para evitar divisão por zero  
3. Caso contrário: percentual \= (valorDaFatura / limiteTotal) × 100  
4. Formatar com 1 casa decimal: "69.0%"  
5. Exibir no badge

Este percentual indica quanto do limite disponível já foi usado na fatura atual.

### **Cálculo de Progresso de Objetivo**

Para a barra de progresso de cada objetivo:

1. Pegar valorAtual e valorMeta do objetivo  
2. Calcular: percentual \= (valorAtual / valorMeta) × 100  
3. Aplicar Math.min(percentual, 100\) para garantir máximo de 100%  
4. Arredondar para número inteiro para display: "35%"  
5. Calcular valorRestante \= valorMeta \- valorAtual  
6. Se valorRestante for negativo (objetivo ultrapassou meta), mostrar zero  
7. Formatar valorRestante como moeda: "Faltam R$ 6.500,00"

A largura da barra verde é definida diretamente pelo percentual: se 35%, a barra ocupa 35% da largura total do container.

### **Filtragem com Múltiplos Critérios**

Quando há múltiplos filtros ativos, a lógica é AND (todos devem ser satisfeitos):

Para cada transação:  
  Se filtro de tipo ativo E transação.tipo ≠ tipoFiltrado → remover  
  Se filtro de período ativo E transação.data fora do intervalo → remover  
  Se filtro de membro ativo E transação.memberId ≠ membroFiltrado → remover  
  Se filtro de busca ativo E (transação.description não contém busca E transação.category não contém busca) → remover  
  Caso contrário → manter

Apenas transações que passam por todos os filtros permanecem na lista final.

---

## **🎨 ESTADOS VISUAIS E FEEDBACKS**

### **Estados de Hover**

Quase todos os elementos interativos têm estado de hover distinto:

Botões: Mudança sutil de cor de fundo (geralmente escurecimento de 5-10%) e mudança de cursor para "pointer" (mãozinha).

Cards de cartão: Elevação física (translateY \-8px) e aumento de sombra de shadow-xl para shadow-2xl.

Cards de objetivo: Zoom da imagem interna (scale 1.05), mudança de borda para cor mais escura, aumento de sombra.

Items de lista: Mudança de fundo para cinza claro.

Avatares de membro: Scale 1.1, movimento para frente (z-index aumenta), aparecimento de tooltip.

Donuts de categoria: Mudança de borda de cinza para verde-limão.

Todos os hovers têm transição suave (200-300ms) para evitar mudanças bruscas.

### **Estados de Foco**

Elementos focáveis via teclado (inputs, selects, botões) exibem anel de foco:

Cor do anel: Azul semi-transparente ou verde-limão semi-transparente, dependendo do contexto.

Espessura: 2-3 pixels.

Offset: 2 pixels de distância do elemento, criando espaço visual.

Isso garante navegação por teclado visível e acessível.

### **Estados de Carregamento**

Embora não implementados no MVP, os componentes devem estar preparados para estados de loading:

Cards de estatísticas: Skeleton loaders com blocos cinza claro pulsantes no lugar dos valores.

Gráficos: Mensagem "Carregando dados..." centralizada ou spinner circular.

Tabelas: Skeleton rows com linhas cinzas animadas.

Listas: Skeleton items repetidos.

Quando dados chegam, fade-out do skeleton e fade-in do conteúdo real.

### **Estados de Erro**

Campos de formulário com erro: Borda vermelha (2px), mensagem de erro em texto vermelho pequeno abaixo do campo, ícone de alerta vermelho ao lado do label.

Erro de carregamento de dados: Card ou seção mostra ícone de alerta amarelo/vermelho com mensagem descritiva: "Não foi possível carregar os dados. Tente novamente." e botão "Tentar Novamente".

Erro de salvamento: Toast vermelho no canto superior direito: "Erro ao salvar. Tente novamente." com ícone X.

### **Notificações Toast**

Pequenos cards que aparecem temporariamente no canto superior direito da tela:

Toast de sucesso: Fundo verde claro, texto verde escuro, ícone de check verde, duração 3 segundos.

Toast de erro: Fundo vermelho claro, texto vermelho escuro, ícone X vermelho, duração 5 segundos.

Toast de informação: Fundo azul claro, texto azul escuro, ícone de info azul, duração 4 segundos.

Animação de entrada: slide-in da direita \+ fade-in. Animação de saída: fade-out \+ slide-out para direita.

Se múltiplos toasts aparecem simultaneamente, empilham verticalmente com espaçamento de 8px entre eles.

### **Animações de Transição**

Fade-in: Elemento começa com opacity 0 e transition até opacity 1 em 200-300ms.

Slide-in: Elemento começa fora da tela (translateY ou translateX) e desliza até posição final em 300-400ms com easing suave.

Scale: Elemento começa menor (scale 0.95) e cresce até tamanho normal (scale 1\) em 200ms.

Barra de progresso preenchendo: Width vai de 0% até percentual final em 1000ms com easing ease-out, criando efeito dramático de preenchimento lento.

Contagem de números: Valores monetários "contam" de zero até valor final em 800ms, mostrando números intermediários rapidamente. Cria sensação de acúmulo.

---

## **♿ ACESSIBILIDADE**

### **Navegação por Teclado**

Todos os elementos interativos são acessíveis via Tab:

Ordem de tabulação lógica: Segue ordem visual da esquerda para direita, cima para baixo.

Tab: Move foco para próximo elemento. Shift \+ Tab: Move foco para elemento anterior. Enter ou Espaço: Ativa elemento focado (clica botão, seleciona item, abre modal). Escape: Fecha modal ou dropdown aberto. Setas: Navegam dentro de calendário, selects e radio groups.

Elementos com foco têm anel visual conforme mencionado anteriormente.

### **Labels e Aria-labels**

Inputs: Sempre têm label visível acima ou aria-label oculto visualmente mas disponível para screen readers.

Botões de ícone: Têm aria-label descrevendo a ação. Exemplo: botão com ícone X tem aria-label="Fechar modal".

Imagens: Avatares têm alt descrevendo o membro. Logos têm alt com nome do banco.

Links e botões: Texto descritivo. Evitar "Clique aqui", preferir "Ver detalhes do cartão".

### **Contraste de Cores**

Todas as combinações de texto e fundo seguem WCAG AA:

Texto preto em fundo branco: Contraste \~21:1 (excelente). Texto branco em fundo preto: Contraste \~21:1 (excelente). Texto cinza médio em fundo branco: Contraste mínimo 4.5:1. Texto branco em fundo verde-limão: Ajustado para contraste adequado.

Evitar texto cinza claro em fundos claros.

### **Screen Readers**

Componentes são estruturados semanticamente:

Headers: Usam tags h1, h2, h3 apropriadamente para criar hierarquia de conteúdo.

Listas: Usam ul/li para listas não ordenadas, ol/li para ordenadas. Screen reader anuncia número de items.

Tabelas: Usam table, thead, tbody, th, td com escopo apropriado. Cabeçalhos de coluna têm escopo "col".

Regiões: Áreas principais têm role apropriado (main, navigation, complementary).

Estados: Elementos expandíveis têm aria-expanded. Elementos ocultos têm aria-hidden. Elementos desabilitados têm aria-disabled.

---

Este documento descritivo completo define COMO cada componente deve funcionar, suas interações, cálculos e comportamentos esperados. Não inclui código, apenas descrição detalhada do comportamento para orientar a implementação.  
