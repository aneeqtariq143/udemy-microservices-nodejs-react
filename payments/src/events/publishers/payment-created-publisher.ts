import {BasePublisher, Subjects, PaymentCreatedEvent} from "@atgitix/common";

export class PaymentCreatedPublisher extends BasePublisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}