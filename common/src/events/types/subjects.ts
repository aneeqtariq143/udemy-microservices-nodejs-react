/**
 * Events Names
 * Enum to define the subjects of the events that will be published
 */
export enum Subjects {
    TicketCreated = 'ticket:created',
    TicketUpdated = 'ticket:updated',
    OrderCreated = 'order:created',
    OrderCancelled = 'order:cancelled',
    OrderUpdated = 'order:updated',
    ExpirationComplete = 'expiration:complete',
    PaymentCreated = 'payment:created'
}