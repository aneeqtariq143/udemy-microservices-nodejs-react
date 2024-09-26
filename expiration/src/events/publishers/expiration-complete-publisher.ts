import {BasePublisher, ExpirationCompleteEvent, Subjects} from "@atgitix/common";

export class ExpirationCompletePublisher extends BasePublisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}