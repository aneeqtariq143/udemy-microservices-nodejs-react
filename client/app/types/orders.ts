export interface OrderInterface {
    id: string;
    version: number;
    userId: string;
    status: string;
    expiresAt: string;
    ticket: {
        id: string;
        price: number;
        title: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface OrdersResponseInterface {
    orders: OrderInterface[];
    currentPage: number;
    totalPages: number;
    totalOrders: number;
}