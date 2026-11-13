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
- O estado é compartilhado entre as rotas durante a sessão. Ao fechar/recarregar o app ou sair da conta, as alterações se perdem.

## Situação das aulas 9 e 10

O mínimo de telas está completo. A integração da aula 9 está implementada; a aula 10 continua pendente:

- **Aula 9 — API implementada:** consulta meteorológica real na WeatherAPI, autenticada por chave externa. A busca por cidade retorna temperatura, sensação térmica, umidade, vento e previsão de até 3 dias. A `FlatList` liga cada data ao detalhe por horário. Há atualização por botão e pull-to-refresh, carregamento, erro com nova tentativa e estado vazio. O serviço usa HTTPS, valida resposta e status HTTP, cancela chamadas ao sair da tela e limita a espera a 12 segundos. Trata cidade inexistente, chave inválida, limite de consultas e indisponibilidade. Fonte: <https://www.weatherapi.com/docs/>.
- **Aula 10 — persistência:** `useState` e Context mantêm dados apenas em memória. Ainda não há AsyncStorage, SecureStore ou SQLite. Próxima etapa: persistir alunos/notas/agenda/progresso, hidratar antes de renderizar e tratar falhas de leitura e gravação. Cache da API deve informar quando está usando dados locais. Uma sessão demonstrativa persistente não equivale a autenticação real.

## Verificações

```bash
npm test
npm run typecheck
npx expo export --platform web
```

Os 14 testes cobrem médias, datas e notas inválidas, busca, prioridades e clima (parâmetros, chave ausente/inválida, cidade inexistente, limite de consultas, estado vazio, resposta malformada, falha de rede, cancelamento e sugestões de organização).

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

Confira no aparelho: login, menu horizontal, cadastro, notas com vírgula, agenda com teclado aberto, plano de estudos e clima. Consulte sua cidade, puxe a lista para atualizar, toque em uma data para abrir os horários e teste uma cidade inexistente e uma falha de conexão. Os dados da API ainda não têm cache offline.

O layout protege as áreas de câmera/barra de status e de gestos, quebra cartões em telas estreitas e permite rolagem dos formulários. Exportações web e Android verificam a compilação; não substituem o teste físico de teclado, gestos e Expo Go.
