import MessageDTO from '../dao/dtos/message.dto.js';
import { Messages } from '../dao/factory.js';

export default class MessagesServices {
    static #instance;

    constructor() { }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new MessagesServices();
        }
        return this.#instance;
    }

    async addMessage(user, text) {
        try {
            const newMessage = new MessageDTO({ user, text });
            return await Messages.getInstance().addMessage(newMessage);
        } catch (error) {
            throw error;
        }
    }

    async getMessages() {
        try {
            return await Messages.getInstance().getMessages();
        } catch (error) {
            throw error;
        }
    }
}