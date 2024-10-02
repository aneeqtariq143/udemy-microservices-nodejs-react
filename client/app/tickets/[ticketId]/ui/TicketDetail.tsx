"use client";
import {TicketInterface} from "@/app/types/tickets";
import useRequest from "@/app/lib/use-request";
import {OrderInterface} from "@/app/types/orders";
import {useRouter} from "next/navigation";


const TicketDetail = ({ticket}: {ticket: TicketInterface}) => {
    const Router = useRouter();
    const {doRequest, errors} = useRequest({
        url: `/api/orders`,
        method: 'post',
        body: {
            ticketId: ticket.id
        },
        onSuccess: (order: OrderInterface) => Router.push(`/orders/${order.id}`)
    });

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold my-8">Ticket Title: {ticket.title}</h1>
            <p className="text-lg">Price: ${ticket.price}</p>
            <p className="text-lg">Status: {(ticket.orderId === undefined) ? "Available" : "Reserved"}</p>
            {errors}
            <button disabled={(ticket.orderId === undefined) ? false : true} onClick={ () => doRequest({})}
                    className='bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-300'>
                Purchase Ticket
            </button>
        </div>
    );
};

export default TicketDetail;