# Academy Notes

Aplicativo acadêmico em React Native, TypeScript e Expo Router para gerenciar alunos, notas, disciplinas e rotina de estudos. Interface escura com cartões, destaques azuis e layout em Flexbox/StyleSheet.

## Executar

Use Node.js 22.13+ na linha 22 ou Node.js 24.3+ na linha 24, conforme os requisitos das dependências do Expo 58. O Node 25 pode emitir avisos de versão não suportada.

```bash
npm ci
npm start
```

Abra pelo Expo Go compatível com o SDK do projeto ou use `npm run web` no navegador. O login atual é demonstrativo: o botão de entrada abre uma sessão local, sem senha nem servidor de autenticação.

## 14 telas navegáveis

| Tela | Rota | Funcionalidade |
| --- | --- | --- |
| Login | `/login` | Entrada demonstrativa |
| Dashboard | `/` | Indicadores da turma e atalhos |
| Alunos | `/alunos` | Consulta dos alunos |
| Adicionar aluno | `/novo-aluno` | Cadastro de estudante |
| Notas | `/notas` | Seleção para lançamento |
| Notas do aluno | `/aluno/[id]` | Editar notas entre 0 e 10, com ponto ou vírgula |
| Relatórios | `/relatorios` | Desempenho acadêmico |
| Configurações | `/config` | Informações e saída da sessão |
| Disciplinas | `/disciplinas` | Busca sem acentos e média por matéria |
| Detalhe da disciplina | `/disciplina/[nome]` | Notas dos alunos e acesso à edição |
| Agenda acadêmica | `/agenda` | Cadastro, filtros, conclusão e exclusão com confirmação |
| Plano de estudos | `/plano-estudos` | Revisão por aluno, prioridades, tempo e progresso |
| Clima para sua rotina | `/clima` | Clima real por cidade, previsão de 3 dias e atualização |
| Previsão por horário | `/previsao/[data]` | Temperatura e chance de chuva por horário do dia selecionado |

Os arquivos `_layout.tsx` são layouts de navegação e não entram na contagem. As rotas dinâmicas contam como uma tela cada, independentemente da quantidade de alunos ou matérias.

## Comportamentos

- Disciplinas e médias são calculadas a partir das notas do estado do app.
- A agenda valida datas, ordena por prazo e destaca compromissos vencidos ou para hoje.
- O plano sugere 40 minutos para notas abaixo de 5, 30 para notas de 5 até abaixo de 7 e 20 para notas a partir de 7. São regras locais, sem inteligência artificial.
- Revisões concluídas são separadas por aluno e disciplina.
- Alunos, notas, agenda e revisões são restaurados do armazenamento local ao abrir o app. O tema e a última cidade também ficam salvos.

## Situação das aulas 9 e 10

O mínimo de telas e as integrações das aulas 9 e 10 estão implementados:

- **Aula 9 — API implementada:** consulta meteorológica real na WeatherAPI, autenticada por chave externa. A busca por cidade retorna temperatura, sensação térmica, umidade, vento e previsão de até 3 dias. A `FlatList` liga cada data ao detalhe por horário. Há atualização por botão e pull-to-refresh, carregamento, erro com nova tentativa e estado vazio. O serviço usa HTTPS, valida resposta e status HTTP, cancela chamadas ao sair da tela e limita a espera a 12 segundos. Trata cidade inexistente, chave inválida, limite de consultas e indisponibilidade. Fonte: <https://www.weatherapi.com/docs/>.
- **Aula 10 — persistência implementada:** wrapper tipado de AsyncStorage, `usePersistedState`, tema claro/escuro em Configurações, sessão restaurada antes da guarda de rota, splash durante a inicialização, alunos/notas/agenda/revisões persistidos e clima com cache local. Há validade de 5 minutos, apresentação imediata de cache antigo enquanto atualiza, aviso de dados salvos/offline e atualização ao reconectar. Uma sessão demonstrativa persistente não equivale a autenticação real.

## Verificações

```bash
npm test
npm run typecheck
npx expo export --platform web
```

Os 35 testes cobrem médias, notas e datas, busca, prioridades, WeatherAPI, leitura corrompida, validação de dados locais, hidratação, reabertura, atualizações concorrentes, falha de gravação e recuperação, TTL, atualização forçada, cache offline, falha da API, cancelamento e limpeza de cache.

## Armazenamento local — Aula 10

As chaves são versionadas com o prefixo `academy:v1:`. O app lê o disco antes de decidir a rota ou exibir os dados acadêmicos; os valores iniciais não são gravados por cima dos valores existentes durante a hidratação. Alterações consecutivas são gravadas em ordem.

| Informação | Onde fica | Comportamento |
| --- | --- | --- |
| Sessão demonstrativa Admin | AsyncStorage | Restaura ao abrir; removida ao sair |
| Tema e última cidade | AsyncStorage | Preferências do aparelho; preservadas ao sair |
| Alunos e notas | AsyncStorage | Dados acadêmicos locais; preservados ao sair |
| Agenda e revisões concluídas | AsyncStorage | Restauradas com os dados acadêmicos |
| Clima por cidade e data da consulta | AsyncStorage | Cache válido por 5 minutos; removido ao sair |
| Chave WeatherAPI | `.env.local` | Não é gravada no AsyncStorage nem versionada no Git |

Se a leitura falhar ou o formato salvo for incompatível, o app mostra nova tentativa sem substituir os dados pelo padrão. Se uma gravação falhar, mantém o trabalho na memória e informa que ainda não foi salvo; o botão de nova tentativa grava o valor atual.

O login é único e demonstrativo; os dados acadêmicos pertencem ao espaço local do aparelho. Sair encerra a sessão e remove as consultas de clima, preservando o trabalho cadastrado. Não há sincronização entre celulares nem recuperação após desinstalar o app ou limpar seus dados.

Escolhemos AsyncStorage porque o conjunto de dados e o cache são pequenos. O projeto não possui senha nem token JWT: portanto não há token a colocar em SecureStore. SQLite fica para um volume maior que exija consultas relacionais. Essas ferramentas não foram adicionadas como demonstrações sem uso real.

### Roteiro de teste no Android

1. Entre, cadastre um aluno, salve uma nota, adicione um compromisso e conclua uma revisão.
2. Em Configurações, altere o tema. Consulte uma cidade no Clima.
3. Com internet, feche e reabra o app: confirme a sessão, o tema, o aluno, a nota, o compromisso e a revisão.
4. Com o app já aberto, ative o modo avião e volte ao Clima: a última consulta aparece com aviso de dados salvos. Uma cidade nunca consultada exige internet.
5. Reconecte para atualizar a previsão. Use o botão Atualizar para forçar uma nova chamada antes dos 5 minutos.
6. Saia da conta e reabra: deve aparecer o login. Ao entrar novamente, o trabalho acadêmico continua salvo.

No Expo Go, a conexão com o servidor de desenvolvimento é necessária para carregar/recarregar o código. Faça o teste de modo avião com o app já carregado. A aparência da splash no Expo Go pode diferir de um aplicativo instalado, mas a leitura e a guarda de rota usam as mesmas flags de inicialização.

## Configurar a WeatherAPI

1. Crie uma conta gratuita em <https://www.weatherapi.com/signup> e copie a chave no painel da conta. A função usa apenas clima atual e previsão de 3 dias, incluídos no plano Free.
2. Copie `.env.example` para `.env.local` na raiz do projeto.
3. Preencha `EXPO_PUBLIC_WEATHER_API_KEY` com sua chave, sem aspas, sem compartilhar o arquivo.
4. Reinicie o servidor Expo para carregar a variável e recarregue o aplicativo.

`.env.local` está ignorado pelo Git; somente o exemplo vazio é versionado. Como as variáveis `EXPO_PUBLIC_` são incluídas no aplicativo, isso não torna a chave um segredo de servidor. Esta integração é para demonstração acadêmica; em uma publicação pública, use um backend para proteger a chave ou as restrições de aplicação oferecidas pelo provedor.

Não há dados meteorológicos simulados no app. Sem chave ou internet, a tela informa a indisponibilidade. As dicas de mochila são regras locais baseadas nos valores retornados pela previsão, não respostas de IA. A consulta usa a cidade digitada, sem permissão de GPS. Os horários e a data da previsão seguem a localidade consultada.

## Testar no celular com Expo Go

1. Instale uma versão do Expo Go compatível com o SDK 58 do projeto.
2. Conecte o computador e o celular à mesma rede Wi-Fi.
3. Na pasta do projeto execute `npm run start:phone` e leia o QR code pelo Expo Go (Android) ou pela câmera (iPhone).
4. Se o iPhone solicitar autenticação, entre com a mesma conta Expo no computador (`npx expo login`) e no Expo Go.
5. Se a rede bloquear a conexão e o Expo Go mostrar uma falha ao abrir o projeto, use `npm run start:tunnel` e escaneie o novo QR code. O projeto inclui `@expo/ngrok` como dependência de desenvolvimento para esse modo. O computador e o celular precisam de internet, mas podem estar em redes diferentes. O endereço do túnel muda ao reiniciar; use sempre o QR code do servidor atual.

A API externa usa HTTPS: a consulta do clima não precisa de servidor local nem de configurar o IP do computador, mas exige a chave WeatherAPI na variável local. O servidor Expo ainda precisa estar acessível ao celular para carregar o aplicativo.

Confira no aparelho: login, menu horizontal, cadastro, notas com vírgula, agenda com teclado aberto, plano de estudos e clima. Consulte sua cidade, puxe a lista para atualizar e toque em uma data para abrir os horários. Teste reabertura, troca de tema e modo avião com o roteiro acima.

O layout protege as áreas de câmera/barra de status e de gestos, quebra cartões em telas estreitas e permite rolagem dos formulários. Exportações web e Android verificam a compilação; não substituem o teste físico de teclado, gestos e Expo Go.
