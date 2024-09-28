import {BasePublisher, OrderUpdatedEvent, Subjects} from "@atgitix/common";

export class OrderUpdatedPublisher extends BasePublisher<OrderUpdatedEvent> {
    subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
}