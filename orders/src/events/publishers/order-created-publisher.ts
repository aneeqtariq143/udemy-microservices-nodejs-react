import {BasePublisher, OrderCreatedEvent, Subjects} from "@atgitix/common";

export class OrderCreatedPublisher extends BasePublisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}