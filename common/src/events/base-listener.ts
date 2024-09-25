import {Message, Stan} from "node-nats-streaming";
import {Subjects} from "./types/subjects";

interface Event {
    subject: Subjects;
    data: any;
}

export abstract class BaseListener<t extends Event> {
    /**
     * Name of the channel this listener is going listening to
     */
    abstract subject: t['subject'];

    /**
     * Name of the queue group this listener is part of
     */
    abstract queueGroupName: string;

    /**
     * Pre-initialized NATS client
     */
    protected client: Stan;

    /**
     * Number of seconds the listener has to ack a message
     */
    protected ackWait = 5 * 1000;

    /**
     * This method is called when a message is received
     */
    abstract onMessage(data: t['data'], msg: Message): void;


    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        return this.client.subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on('message', (msg: Message) => {
            console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }

    parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf8'));
    }


}