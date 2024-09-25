import {BasePublisher, Subjects, TicketUpdatedEvent} from "@atgitix/common";

export class TicketUpdatedPublisher extends BasePublisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}