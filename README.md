# NexusDesk — Sistema de HelpDesk

Sistema completo de gerenciamento de chamados (helpdesk) com backend Node.js, banco PostgreSQL e app React Native.

---

## 🏗️ Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | Node.js + Express |
| ORM | Prisma |
| Banco | PostgreSQL |
| Auth | JWT + bcrypt |
| Tempo real | Socket.IO |
| Upload | Multer |
| Mobile | React Native + Expo |
| Estado | Zustand |
| Queries | TanStack Query |
| Container | Docker Compose |

---

## 🚀 Como rodar

### Com Docker (recomendado)

```bash
cd nexusdesk
docker-compose up
```

Isso sobe o PostgreSQL e a API automaticamente. Seed com dados de exemplo é executado na primeira vez.

### Manual

**Backend:**
```bash
cd backend
cp .env.example .env
# Edite .env com sua DATABASE_URL
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

**Mobile:**
```bash
cd frontend
npm install
npm start
```

---

## 👤 Usuários de exemplo (após seed)

| Role | Email | Senha |
|------|-------|-------|
| Admin | admin@nexusdesk.com | admin123 |
| Técnico | tecnico@nexusdesk.com | tech123 |
| Usuário | usuario@nexusdesk.com | user123 |

---

## 📡 Endpoints da API

### Auth
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/auth/register | Cadastro |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Dados do usuário logado |

### Tickets
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/tickets | Criar chamado |
| GET | /api/tickets | Listar chamados |
| GET | /api/tickets/:id | Detalhe do chamado |
| PATCH | /api/tickets/:id | Atualizar chamado |
| DELETE | /api/tickets/:id | Remover chamado (admin) |
| PATCH | /api/tickets/:id/assign | Atribuir técnico (admin) |
| GET | /api/tickets/dashboard | Métricas do dashboard |

### Comentários
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/tickets/:id/comments | Adicionar comentário |
| GET | /api/tickets/:id/comments | Listar comentários |
| DELETE | /api/tickets/:id/comments/:cid | Remover comentário |

### Notificações
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/notifications | Listar notificações |
| PATCH | /api/notifications/:id/read | Marcar como lida |
| PATCH | /api/notifications/read-all | Marcar todas como lidas |

### Upload
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/upload | Enviar arquivo |

---

## 🗂️ Estrutura do Projeto

```
nexusdesk/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Modelagem do banco
│   ├── src/
│   │   ├── controllers/        # Lógica HTTP
│   │   ├── services/           # Regras de negócio
│   │   ├── repositories/       # Acesso ao banco
│   │   ├── middlewares/        # Auth, rate limit, multer
│   │   ├── routes/             # Definição das rotas
│   │   ├── socket/             # Socket.IO (tempo real)
│   │   ├── prisma/             # Client Prisma + seed
│   │   └── utils/              # AppError
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   └── src/
│       ├── screens/            # Telas React Native
│       ├── services/           # Chamadas API (axios)
│       ├── store/              # Estado global (Zustand)
│       ├── hooks/              # React Query hooks
│       └── routes/             # Navegação
├── docker-compose.yml
└── README.md
```

---

## ⚡ Eventos Socket.IO

| Evento | Direção | Descrição |
|--------|---------|-----------|
| join:ticket | cliente → server | Entrar na sala do ticket |
| leave:ticket | cliente → server | Sair da sala |
| new:comment | server → cliente | Novo comentário adicionado |
| ticket:updated | server → cliente | Status/dados do ticket alterado |
| notification | server → cliente | Nova notificação para o usuário |

---

## 🔐 Permissões

| Ação | USER | TECHNICIAN | ADMIN |
|------|------|-----------|-------|
| Ver próprios tickets | ✅ | — | ✅ |
| Ver tickets atribuídos | — | ✅ | ✅ |
| Ver todos os tickets | — | — | ✅ |
| Criar ticket | ✅ | ✅ | ✅ |
| Atribuir técnico | — | — | ✅ |
| Dashboard | — | ✅ | ✅ |
| Gerenciar usuários | — | — | ✅ |

---

## 📦 Próximos passos

- [ ] Push notifications (Firebase Cloud Messaging)
- [ ] Testes unitários (Jest)
- [ ] CI/CD (GitHub Actions)
- [ ] Documentação Swagger
- [ ] Deploy Railway/Render
- [ ] APK via Expo EAS Build
