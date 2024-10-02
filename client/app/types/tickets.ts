export interface TicketInterface {
    id: string;
    title: string;
    price: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    orderId?: string;
}

export interface TicketsResponseInterface {
    tickets: TicketInterface[];
    currentPage: number;
    totalPages: number;
    totalTickets: number;
}