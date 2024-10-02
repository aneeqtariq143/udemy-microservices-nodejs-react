import {OrderInterface} from "@/app/types/orders";
import buildAxiosClient from "@/app/helpers/build-axios-client";
import OrderDetail from "./ui/OrderDetail";
import { notFound } from 'next/navigation'


async function getOrder(orderId: string): Promise<OrderInterface | undefined> {
    const axiosClient = buildAxiosClient();
    try {
        const response = await axiosClient.get(`/api/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return undefined // Handle error or no auth state
    }
}

export default async function Page({params}: {
    params: {
        orderId: string;
    };
}) {
    const order = await getOrder(params.orderId);

    if (order === undefined) {
        return (
            notFound()
        );
    }

    return (
        <main className="container mx-auto py-5">
            <OrderDetail order={order}/>
        </main>
    );
};