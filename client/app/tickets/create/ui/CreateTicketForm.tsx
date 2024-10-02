"use client";
import {useState, FormEvent, ChangeEvent} from "react";
import {clsx} from "clsx";
import useRequest from "@/app/lib/use-request";
import { useRouter } from "next/navigation";
import exp from "node:constants";

// Interface for response data type (adjust this according to your API response structure)
interface CreateTicketResponse {
    // Add relevant fields here based on the expected API response
    id: string;
    title: string;
    price: number;
}

// Define the types for the error response object
interface ErrorResponse {
    message: string;
}

const TicketCreate =  () => {
    const router = useRouter();

    // Define state variables for title and price with their respective types
    const [title, setTitle] = useState<string>("");
    const [price, setPrice] = useState<number>(0);

    // Use the custom hook with correct type annotations for the response data
    const { errors, doRequest } = useRequest<CreateTicketResponse>({
        url: "/api/tickets",
        method: 'post',
        body: { title, price },
        onSuccess: (data: CreateTicketResponse) => router.push("/"),
    });

    // Define a state variable for tracking form submission status
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Define the handleSubmit function with a specific type for the event
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Call the doRequest function and reset the submitting state afterward
        doRequest({}).finally(() => {
            setIsSubmitting(false);
        });
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-2xl font-bold mb-4 text-center">Create Ticket</h2>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                    </label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onBlur={() => setPrice(parseFloat(price.toFixed(2)))}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>
                {errors}
                <button
                    type="submit"
                    className={clsx(
                        "w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300",
                        {
                            "opacity-50 cursor-not-allowed": isSubmitting,
                        }
                    )}
                    disabled={isSubmitting}
                >
                    Create Ticket
                </button>
            </form>
        </div>
    );
}

export default TicketCreate;