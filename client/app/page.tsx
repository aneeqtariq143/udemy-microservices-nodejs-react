import buildAxiosClient from "@/app/helpers/build-axios-client";
import TicketList from "@/app/ui/TicketList";
import {TicketsResponseInterface} from "@/app/types/tickets";


async function getTickets(): Promise<TicketsResponseInterface | undefined> {
    const axiosClient = buildAxiosClient();
    try {
        const response = await axiosClient.get("/api/tickets");
        return response.data;
    } catch (error) {
        console.error(error);
        return undefined // Handle error or no auth state
    }
}

export default async function Home() {
    const tickets = await getTickets();

    return (
        <main className="container mx-auto py-5">
            <div className='container flex justify-between'>
                <h1 className="text-3xl font-bold mb-4">
                    Tickets
                </h1>
                {/*<Link href={`/tickets/create`}>*/}
                {/*    <button className='w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300'>*/}
                {/*        Create Ticket*/}
                {/*    </button>*/}
                {/*</Link>*/}
            </div>
            <TicketList tickets={tickets?.tickets || []}/>
        </main>
    );
}
