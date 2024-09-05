"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import useRequest from "@/app/lib/use-request";

// Interface for response data type (adjust this according to your API response structure)
interface SignupResponse {
    // Add relevant fields here based on the expected API response
}

// Define the types for the error response object
interface ErrorResponse {
    message: string;
}

// Define the SignupForm component
const SignupForm = () => {
    const router = useRouter();

    // Define state variables for email and password with their respective types
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // Use the custom hook with correct type annotations for the response data
    const { errors, doRequest } = useRequest<SignupResponse>({
        url: "/api/users/signup",
        method: 'post',
        body: { email, password },
        onSuccess: (data: SignupResponse) => router.push("/"),
    });

    // Define a state variable for tracking form submission status
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Define the handleSubmit function with a specific type for the event
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Call the doRequest function and reset the submitting state afterward
        doRequest().finally(() => {
            setIsSubmitting(false);
        });
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignupForm;