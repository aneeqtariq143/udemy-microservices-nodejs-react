import {BasePublisher, OrderCancelledEvent, Subjects} from "@atgitix/common";

export class OrderCancelledPublisher extends BasePublisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}