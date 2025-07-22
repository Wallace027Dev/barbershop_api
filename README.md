# ClickBeard - Barbershop API
Teste técnico de programador fullstack para a empresa ClickAtivo.

## Objetivo
### Desenvolver uma aplicação web onde:
• Clientes possam se cadastrar, autenticar e realizar agendamentos com barbeiros disponíveis.
• O administrador visualize os agendamentos do dia e futuros de forma clara.

## Como subir o servidor
1. Instalar o Docker
2. Rodar o comando `docker-compose up`
3. Configurar as variáveis de ambiente no arquivo `.env`
  - DATABASE_URL="postgresql://user:senha@url/ClickBeard"
4. Migrar o banco de dados `npx prisma migrate dev`

## 📘 API REST – Rotas
### 🔐 Autenticação

| Método | Rota         | Descrição                     |
|--------|--------------|-------------------------------|
| POST   | `/login`     | Login de usuário, retorna JWT |
| POST   | `/register`  | Cadastro de cliente           |

---

### 👤 Usuários (`/users`)
| Método | Rota             | Descrição                        |
|--------|------------------|----------------------------------|
| GET    | `/users`       | Listar todos os usuários         |
| GET    | `/users/:id`   | Buscar um usuário específico     |
| POST   | `/users`       | Criar novo usuário               |

---

### ✂️ Barbeiros (`/barbers`)
| Método | Rota               | Descrição                             |
|--------|--------------------|----------------------------------------|
| GET    | `/barbers`         | Listar todos os barbeiros             |
| GET    | `/barbers/:id`     | Buscar barbeiro por ID                |
| POST   | `/barbers`         | Cadastrar barbeiro                    |
| PUT    | `/barbers/:id`     | Atualizar dados de um barbeiro        |
| DELETE | `/barbers/:id`     | Remover barbeiro                      |

---

### 🪒 Especialidades (`/specialties`)
| Método | Rota                  | Descrição                                |
|--------|-----------------------|-------------------------------------------|
| GET    | `/specialties`        | Listar especialidades                     |
| GET    | `/specialties/:id`    | Buscar uma especialidade                  |
| POST   | `/specialties`        | Criar especialidade                       |
| PUT    | `/specialties/:id`    | Atualizar uma especialidade               |
| DELETE | `/specialties/:id`    | Remover especialidade                     |

---

### 📅 Agendamentos (`/appointments`)
| Método | Rota                    | Descrição                                     |
|--------|-------------------------|-----------------------------------------------|
| GET    | `/appointments`         | Listar agendamentos (cliente autenticado ou admin) |
| GET    | `/appointments/:id`     | Buscar um agendamento específico              |
| POST   | `/appointments`         | Criar um novo agendamento                     |
| PUT    | `/appointments/:id`     | Atualizar agendamento (cancelar, remarcar)    |

---


## funcionalidades do Sistema
### Autenticação
• Cadastro e login de clientes (nome, e-mail, senha)
• O e-mail deve ser único
• Autenticação via JWT
• Apenas usuários autenticados podem acessar seus agendamentos
### Barbeiros e Especialidades
• Cadastro de barbeiros com nome, idade e data de contratação
• Cada barbeiro pode ter mais de uma especialidade (sobrancelha, corte de tesoura, barba etc.)
• Cadastro de especialidades
• Relacionamento entre barbeiros e especialidades
### Agendamentos
• Funcionamento da barbearia:
  • Todos os dias, das 8h às 18h
  • Cada atendimento dura 30 minutos
• O cliente escolhe:
  • A especialidade desejada
  • Um barbeiro com essa especialidade
  • Um horário disponível
• Regras:
  • Um barbeiro não pode ter dois atendimentos no mesmo horário
  • O cliente pode cancelar até 2 horas antes
  • O cliente pode visualizar seus agendamentos
• O administrador pode visualizar:
  • Todos os agendamentos do dia atual 
  • Agendamentos futuros 

## Tecnologias Usadas
• Node.js 22.17.1
• Express 5.1.0
• PostgreSQL
• Prisma ORM 6.12.0
• @prisma/client@6.12.0
• JSON Web Token 9.0.2
• BCryptJs 3.0.2
• Zod 4.0.5
• Cors 2.8.5
• DotEnv 17.2.0
• Nodemon 3.1.10