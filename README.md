# Academy Notes

Aplicativo acadêmico em React Native, TypeScript e Expo Router para gerenciar alunos, notas, disciplinas e rotina de estudos. Interface escura com cartões, destaques azuis e layout em Flexbox/StyleSheet.

## Executar

Use Node.js 22.13+ na linha 22 ou Node.js 24.3+ na linha 24, conforme os requisitos das dependências do Expo 58. O Node 25 pode emitir avisos de versão não suportada.

```bash
npm ci
npm start
```

Abra pelo Expo Go compatível com o SDK do projeto ou use `npm run web` no navegador. O login atual é demonstrativo: o botão de entrada abre uma sessão local, sem senha nem servidor de autenticação.

## 12 telas navegáveis

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

Os arquivos `_layout.tsx` são layouts de navegação e não entram na contagem. As rotas dinâmicas contam como uma tela cada, independentemente da quantidade de alunos ou matérias.

## Comportamentos

- Disciplinas e médias são calculadas a partir das notas do estado do app.
- A agenda valida datas, ordena por prazo e destaca compromissos vencidos ou para hoje.
- O plano sugere 40 minutos para notas abaixo de 5, 30 para notas de 5 até abaixo de 7 e 20 para notas a partir de 7. São regras locais, sem inteligência artificial.
- Revisões concluídas são separadas por aluno e disciplina.
- O estado é compartilhado entre as rotas durante a sessão. Ao fechar/recarregar o app ou sair da conta, as alterações se perdem.

## Situação das aulas 9 e 10

Esta etapa completa primeiro o mínimo de telas. As integrações das duas aulas ainda estão pendentes:

- **Aula 9 — API:** ainda não há serviço HTTP, lista remota nem cache de API. Uma opção direta ao exercício da aula é um diretório de contatos de demonstração com `GET https://jsonplaceholder.typicode.com/users`, lista com `FlatList`, detalhe por `id`, atualização, carregamento, erro e estado vazio. São pessoas fictícias, não alunos reais da instituição. A API não exige chave: <https://jsonplaceholder.typicode.com/>.
- **Aula 10 — persistência:** `useState` e Context mantêm dados apenas em memória. Ainda não há AsyncStorage, SecureStore ou SQLite. Próxima etapa: persistir alunos/notas/agenda/progresso, hidratar antes de renderizar e tratar falhas de leitura e gravação. Cache da API deve informar quando está usando dados locais. Uma sessão demonstrativa persistente não equivale a autenticação real.

## Verificações

```bash
npm test
npm run typecheck
npx expo export --platform web
```

Os testes cobrem médias por disciplina, turma vazia, datas inválidas e bissextas, limites de nota, busca sem acentos e prioridades do plano. A exportação verifica a compilação web; o funcionamento no Expo Go deve ser conferido em um aparelho compatível.
