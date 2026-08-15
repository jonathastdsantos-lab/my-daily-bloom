# My Daily Bloom

Crie uma aplicação web responsiva, moderna e premium para acompanhamento de rotina alimentar, dieta e evolução pessoal.

O projeto deve funcionar muito bem tanto em celular quanto desktop e deve ter arquitetura preparada para posteriormente se tornar um aplicativo/PWA.

OBJETIVO

A plataforma deve ajudar usuários que estão seguindo uma dieta ou processo de reeducação alimentar a registrar diariamente:

Horários das refeições

Fotos das refeições

Alimentos consumidos

Comentários sobre cada refeição

Nível de fome

Dificuldades encontradas

Peso

Medidas corporais

Consumo de água

Humor

Energia

Atividade física

Evolução ao longo do tempo

A experiência deve ser simples e rápida. Registrar uma refeição pelo celular deve levar poucos segundos.

TIPOS DE USUÁRIO

Prepare a arquitetura para dois perfis:

Cliente/Paciente

Pessoa que acompanha sua própria rotina.

Profissional

Nutricionista ou profissional autorizado que poderá acompanhar clientes vinculados à sua conta.

Inicialmente, priorize a experiência do Cliente, mas deixe a estrutura preparada para o painel profissional.

AUTENTICAÇÃO

Criar:

Login

Cadastro

Recuperação de senha

Logout

Perfil do usuário

Utilizar Supabase para autenticação, banco de dados e armazenamento das imagens.

Cada usuário somente poderá visualizar seus próprios dados, exceto quando houver futuramente uma relação autorizada entre cliente e profissional.

Utilizar Row Level Security (RLS) no Supabase.

DASHBOARD — MEU DIA

A principal tela da aplicação deve se chamar "Meu Dia".

No topo mostrar:

Saudação ao usuário

Data atual

Progresso das refeições

Próxima refeição

Botão destacado "Registrar refeição"

Exemplo:

Bom dia, Geisa 👋

Sua rotina de hoje

3 de 6 refeições registradas

Próxima refeição: 12:30 — Almoço

[ Registrar refeição ]

Abaixo criar cards rápidos:

Água

Peso

Humor

Atividade

LINHA DO TEMPO DAS REFEIÇÕES

Mostrar as refeições do dia em uma timeline vertical.

Exemplo:

07:30 Café da manhã ✓ Registrado

10:30 Lanche ✓ Registrado

12:30 Almoço Registrar

16:00 Lanche Pendente

20:00 Jantar Pendente

Permitir que o usuário configure seus próprios horários e nomes das refeições.

REGISTRAR REFEIÇÃO

Ao clicar em uma refeição, abrir uma interface simples contendo:

Foto da refeição

Horário

Nome da refeição

Descrição: "O que você comeu?"

Quantidade aproximada opcional

Nível de fome antes da refeição: 1 a 5

Nível de saciedade depois: 1 a 5

Campo: "Como foi essa refeição?"

Campo: "Teve alguma dificuldade?"

Opções rápidas:

Muita fome

Vontade de doce

Ansiedade/estresse

Falta de tempo

Comi fora

Não consegui seguir o planejado

Sem dificuldade

Outro

Permitir adicionar comentários.

Botão:

[ Salvar refeição ]

DIÁRIO ALIMENTAR

Criar uma tela chamada "Diário".

Permitir visualizar registros por:

Hoje

Ontem

Semana

Calendário

Mostrar as refeições através de cards com:

Foto Horário Tipo de refeição Descrição Fome Saciedade Dificuldades Comentários

A interface deve ser bastante visual.

PESO E EVOLUÇÃO

Criar página "Evolução".

Permitir registrar:

Peso

Data

Circunferência abdominal

Cintura

Quadril

Outras medidas opcionais

Criar gráfico de evolução do peso.

Permitir selecionar:

7 dias 30 dias 3 meses 6 meses 1 ano Todo período

Mostrar:

Peso inicial Peso atual Meta Diferença

Não utilizar linguagem que incentive perda de peso extrema.

FOTOS DE EVOLUÇÃO

Permitir registrar fotos opcionais de evolução.

Categorias:

Frente Lado Costas

As imagens devem ser privadas e acessíveis somente ao usuário e, futuramente, ao profissional explicitamente autorizado.

ÁGUA

Criar controle diário de água.

Mostrar meta diária e quantidade consumida.

Adicionar botões rápidos:

+250 ml +500 ml

Mostrar progresso visual.

HUMOR E ENERGIA

Permitir registrar diariamente:

Humor: 1 a 5

Energia: 1 a 5

Campo opcional: "Como você está se sentindo hoje?"

DIFICULDADES

Criar página para identificar padrões de dificuldades.

Mostrar:

Principais dificuldades da semana

Dias em que ocorreram

Horários mais frequentes

Refeições relacionadas

Exemplo:

"Vontade de doce apareceu 4 vezes esta semana, principalmente entre 16h e 18h."

Essas análises devem ser apresentadas como padrões observados nos registros, não como diagnóstico médico.

RELATÓRIO SEMANAL

Criar uma área chamada "Minha Semana".

Mostrar:

Refeições registradas Consistência dos registros Consumo médio de água Evolução do peso Humor médio Energia média Principais dificuldades Conquistas da semana

Exemplo:

"Você registrou 87% das refeições planejadas esta semana."

"Seu consumo de água aumentou em relação à semana anterior."

DICAS

Criar uma área "Dicas".

Organizar conteúdos em categorias:

Alimentação

Organização

Água

Hábitos

Sono

Motivação

Receitas

Preparar estrutura para que conteúdos sejam adicionados posteriormente por administradores/profissionais.

PAINEL PROFISSIONAL

Criar estrutura inicial para um painel separado.

O profissional deverá futuramente conseguir:

Visualizar clientes

Abrir perfil de um cliente

Visualizar diário alimentar

Visualizar fotos das refeições

Visualizar peso e evolução

Visualizar dificuldades

Visualizar relatórios

Deixar comentários/orientações

Não permitir acesso a clientes sem vínculo e autorização.

NAVEGAÇÃO MOBILE

Criar menu inferior:

Hoje Diário Evolução Dicas Perfil

O botão principal para registrar refeição deve ter destaque visual.

DESIGN

Quero uma interface:

Moderna

Minimalista

Premium

Acolhedora

Leve

Fácil de entender

Mobile-first

Evitar aparência hospitalar ou excessivamente clínica.

Utilizar:

Cards com cantos arredondados Sombras discretas Ícones modernos Boa hierarquia visual Bastante espaço em branco Tipografia moderna Microanimações discretas

Priorizar acessibilidade e legibilidade.

EXPERIÊNCIA DO USUÁRIO

A plataforma deve incentivar consistência, e não perfeição.

Evitar mensagens negativas como:

"Você falhou na dieta."

Utilizar mensagens como:

"Hoje não saiu como planejado. Registre o que aconteceu para entender melhor sua rotina."

ou:

"Cada registro ajuda você a entender melhor seus hábitos."

BANCO DE DADOS

Estruturar tabelas para:

profiles meal_schedules meal_logs meal_photos weight_logs body_measurements water_logs mood_logs activity_logs difficulty_logs progress_photos professionals professional_clients tips

Todas as tabelas devem possuir created_at e updated_at quando apropriado.

Utilizar UUIDs.

Criar relacionamentos adequados entre usuário e registros.

Implementar políticas RLS para proteger informações privadas.

IMPORTANTE

Primeiro desenvolva a estrutura completa da aplicação, navegação, componentes reutilizáveis, banco de dados e principais telas.

Utilize dados de demonstração elegantes para que seja possível visualizar a experiência completa antes de cadastrar dados reais.

Não sobrecarregue as telas.

A prioridade deve ser:

Facilidade para registrar uma refeição

Visualização clara da rotina diária

Acompanhamento da evolução

Identificação de dificuldades e padrões

Engajamento do usuário

Arquitetura preparada para acompanhamento profissional

O resultado deve parecer um produto digital real e comercializável, e não apenas um dashboard genérico.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/07982d85-f060-4ffa-ac1e-d83db3fbc8d1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
