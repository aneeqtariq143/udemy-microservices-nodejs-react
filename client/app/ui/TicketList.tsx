import Link from 'next/link';
import {TicketInterface} from "@/app/types/tickets";


// Define the TicketList component
const TicketList = ({ tickets }: {tickets: TicketInterface[]}) => {
    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {tickets.map(ticket => (
                    <div key={ticket.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
                        <h2 className="text-lg font-bold mb-2">{ticket.title}</h2>
                        <p className="text-gray-600 mb-4">Price: ${ticket.price}</p>
                        <Link className='text-blue-500 hover:underline' href={`/tickets/${ticket.id}`}>
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TicketList;