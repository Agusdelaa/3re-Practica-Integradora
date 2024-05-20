import TicketDTO from '../dao/dtos/ticket.dto.js';
import { Tickets } from '../dao/factory.js';

export default class TicketsServices {
    static #instance;

    constructor() { }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new TicketsServices();
        }
        return this.#instance;
    }

    async createTicket(ticket) {
        try {
            const newTicket = new TicketDTO(ticket);
            return await Tickets.getInstance().createTicket(newTicket);
        } catch (error) {
            throw error;
        }
    }

    async getTicketById(id) {
        try {
            return await Tickets.getInstance().getTicketById(id);
        } catch (error) {
            throw error;
        }
    }
}