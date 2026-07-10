# Core Domain

## Objetivo

Este documento registra a modelagem inicial do domínio da Lumina.

Ele descreve os principais conceitos do negócio, suas relações e as regras definidas durante a Sprint 0. Não representa a estrutura definitiva do banco de dados nem detalhes de implementação.

---

## Visão geral

O domínio inicial da Lumina é composto pelos seguintes conceitos:

- User
- Organization
- Membership
- Event
- TicketCategory
- Order
- OrderItem
- Payment
- Ticket
- Participant

Fluxo principal:

1. Um `User` cria ou participa de uma `Organization`.
2. A relação entre `User` e `Organization` é representada por uma `Membership`.
3. Uma `Organization` cria e gerencia `Events`.
4. Um `Event` disponibiliza uma ou mais `TicketCategories`.
5. Um `User` realiza uma `Order` para um determinado `Event`.
6. A `Order` contém um ou mais `OrderItems`.
7. Cada `OrderItem` referencia uma `TicketCategory`.
8. Uma `Order` pode possuir várias tentativas de `Payment`.
9. Quando a compra é confirmada, são emitidos `Tickets`.
10. Cada `Ticket` possui um `User` como proprietário e pode identificar um `Participant`.

---

## Conceitos do domínio

### User

Representa uma pessoa que possui uma conta na Lumina.

Um User pode:

- participar de várias Organizations;
- realizar Orders;
- ser proprietário de Tickets;
- receber Tickets por transferência.

Um User não possui um papel global dentro da plataforma. Seu papel em uma Organization é definido pela Membership.

---

### Organization

Representa uma empresa, grupo ou organizador responsável pela criação e gestão de eventos.

Uma Organization:

- possui membros através de Memberships;
- deve possuir pelo menos um Owner;
- cria e gerencia Events;
- continua existindo independentemente da permanência de um User específico.

A Organization é o principal ponto de isolamento dos dados operacionais do organizador.

---

### Membership

Representa o vínculo entre um User e uma Organization.

A Membership define informações como:

- papel do User na Organization;
- estado do vínculo;
- data de entrada;
- informações de convite.

Exemplos iniciais de papéis:

- Owner
- Manager
- Staff

O papel pertence à Membership, e não diretamente ao User.

---

### Event

Representa um evento criado e administrado por uma Organization.

Um Event:

- deve pertencer a exatamente uma Organization;
- pode disponibilizar diferentes TicketCategories;
- recebe Orders;
- pode possuir ingresso gratuito ou pago;
- pode exigir ou não controle de acesso.

Um Event não pode existir sem uma Organization.

---

### TicketCategory

Representa uma modalidade de acesso disponibilizada pelo organizador.

Exemplos:

- Gratuito
- Lote 1
- Inteira
- Meia-entrada
- VIP
- Camarote

Uma TicketCategory pode definir futuramente informações como:

- nome;
- preço;
- quantidade disponível;
- período de vendas;
- regras de elegibilidade.

Uma TicketCategory não é um ingresso emitido. Ela representa o tipo de acesso oferecido pelo Event.

---

### Order

Representa uma solicitação de compra ou reserva realizada por um User para um Event.

Uma Order:

- pertence a um User comprador;
- está associada a um Event;
- possui um ou mais OrderItems;
- pode possuir várias tentativas de Payment;
- mantém o registro do comprador original, mesmo após transferências de Tickets.

O comprador da Order não precisa ser o participante de todos os Tickets emitidos.

---

### OrderItem

Representa um item incluído em uma Order.

Um OrderItem:

- pertence a uma Order;
- referencia uma TicketCategory;
- informa a quantidade solicitada;
- não existe independentemente da Order.

Inicialmente, os itens serão utilizados para categorias de ingresso. A possibilidade de produtos adicionais poderá ser avaliada no futuro.

---

### Payment

Representa uma tentativa de pagamento de uma Order.

Uma Order pode possuir várias tentativas de Payment.

Exemplo:

1. PIX expirado;
2. cartão recusado;
3. novo cartão aprovado.

Um Payment pode assumir estados como:

- Pending
- Approved
- Failed
- Expired
- Refunded

A emissão de Tickets acontece após a confirmação válida da compra.

---

### Ticket

Representa o direito individual de acesso a um Event.

Um Ticket:

- é originado por uma Order confirmada;
- possui um User como proprietário atual;
- pode identificar um Participant;
- possui identidade própria;
- poderá possuir QR Code;
- poderá ser transferido, cancelado, utilizado ou invalidado.

O proprietário inicial do Ticket é o comprador da Order.

Após ser emitido, o Ticket possui ciclo de vida próprio e não deve ser tratado apenas como um detalhe da Order.

---

### Participant

Representa a pessoa que utilizará um Ticket.

O Participant:

- não precisa possuir uma conta na Lumina;
- pode ser diferente do comprador e do proprietário do Ticket;
- pode possuir nome;
- pode possuir e-mail opcional;
- pode possuir documento opcional, conforme as regras do Event.

Exemplo:

- comprador: responsável pela família;
- proprietário dos Tickets: conta do responsável;
- participantes: responsável, cônjuge e filhos.

O envio do Ticket ao Participant poderá ser opcional.

---

## Regras e invariantes

### Organizations e Memberships

- Toda Organization deve possuir pelo menos uma Membership com papel `Owner`.
- Uma Organization nunca pode ficar sem Owner.
- Um User pode participar de várias Organizations.
- Uma Membership pertence a exatamente um User e uma Organization.
- O papel do User é definido separadamente em cada Membership.
- A Organization continua existindo caso um membro seja removido.

### Events e TicketCategories

- Todo Event pertence a exatamente uma Organization.
- Um Event pode possuir categorias gratuitas ou pagas.
- Um Event pode exigir controle de acesso ou funcionar sem controle obrigatório.
- Uma TicketCategory pertence a um Event.
- TicketCategory representa uma oferta de acesso, não um ingresso emitido.

### Orders e Payments

- Toda Order pertence a um User comprador.
- Toda Order pertence a um Event.
- Uma Order deve possuir pelo menos um OrderItem.
- Todo OrderItem pertence a uma Order.
- Todo OrderItem referencia uma TicketCategory.
- Uma Order pode possuir várias tentativas de Payment.
- Apenas uma confirmação válida deve efetivar a compra.
- Tentativas anteriores devem permanecer registradas para auditoria.

### Tickets e Participants

- Tickets somente são emitidos após a confirmação da compra.
- Cada Ticket possui exatamente um proprietário atual.
- O proprietário inicial é o comprador da Order.
- O comprador original permanece registrado na Order.
- Um Participant não precisa possuir conta na Lumina.
- O Participant pode ser diferente do proprietário do Ticket.
- Um Ticket pode ser transferido apenas para outro User da Lumina.
- A transferência deve ser aceita pelo destinatário.
- O histórico da transferência deve ser preservado.
- A transferência não altera o comprador original da Order.

---

## Decisões adiadas

Os seguintes conceitos foram identificados, mas não fazem parte desta modelagem inicial:

- CheckIn
- Venue
- TicketTransfer
- Refund
- Coupon
- Product
- Notification
- Seat
- Invoice
- Workspace
- permissões customizadas

Eles deverão ser introduzidos apenas quando uma necessidade real do produto justificar sua existência.

---

## Diagrama

O diagrama produzido durante o workshop de domínio deve ser armazenado em:

```text
docs/domain/assets/core-domain.png