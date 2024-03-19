import { Injectable } from "@nestjs/common";
import amqp from "amqplib";

@Injectable()
export class QueueService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(
    private readonly url: string,
    private readonly queues: string[],
  ) {}

  async connect() {
    this.connection = await amqp.connect(this.url);
    this.channel = await this.connection.createChannel();
    for (const queue of this.queues) {
      await this.channel.assertQueue(queue);
    }
  }

  async close() {
    await this.channel.close();
    await this.connection.close();
  }

  async send<T>(queueName: string, payload: T) {
    const message = JSON.stringify(payload);
    this.channel.sendToQueue(queueName, Buffer.from(message));
  }

  async receive<T>(
    queueName: string,
    callback: (message: T) => Promise<void> | void,
  ) {
    await this.channel.consume(queueName, async (msg) => {
      if (!msg) return;

      console.log("received", msg.content.toString());

      const payload = JSON.parse(msg.content.toString()) as T;
      await callback(payload);
      this.channel.ack(msg);
    });
  }
}
