import {TicketInterface} from "@/app/types/tickets";
import buildAxiosClient from "@/app/helpers/build-axios-client";
import TicketDetail from "./ui/TicketDetail";
import {notFound} from "next/navigation";


async function getTicket(ticketId: string): Promise<TicketInterface | undefined> {
    const axiosClient = buildAxiosClient();
    try {
        const response = await axiosClient.get(`/api/tickets/${ticketId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return undefined // Handle error or no auth state
    }
}

export default async function Page({params}: {
    params: {
        ticketId: string;
    };
}) {
    const ticket = await getTicket(params.ticketId);

    if (ticket === undefined) {
        return (
            notFound()
        );

    }

    return (
        <main className="container mx-auto py-5">
            <TicketDetail ticket={ticket}/>
        </main>
    );
};