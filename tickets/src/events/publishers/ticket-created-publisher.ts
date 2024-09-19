import {BasePublisher, Subjects, TicketCreatedEvent} from "@atgitix/common";

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}