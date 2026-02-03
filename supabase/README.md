# Supabase Database

Esta pasta contém as definições e migrações do banco de dadosSupabase.

## Estrutura

- `migrations/`: Contém os arquivos de migração versionados que são aplicados automaticamente.
- `archive/`: Contém scripts SQL antigos, backups e rascunhos que foram removidos da raiz para limpeza. Consulte esta pasta se precisar de referências históricas.

## Comandos Úteis

Para gerar uma nova migração (diff):
```bash
npx supabase db diff -f nome_da_migracao
```
