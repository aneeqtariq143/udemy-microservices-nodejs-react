import axios, {AxiosResponse} from "axios";
import {useState} from "react";

// Define a union type for HTTP methods
type Method = 'get' | 'post' | 'put' | 'delete' | 'patch';

// Define the types for the hook's arguments
interface UseRequestProps<T> {
    url: string;
    method: Method; // This comes from Axios and includes types like 'get', 'post', etc.
    body?: any; // Can be any type, as it's the request body
    onSuccess?: (data: T) => void; // Callback function that runs on successful request
}

// Define the types for the hook's return value
interface UseRequestReturn<T> {
    doRequest: () => Promise<T | undefined>; // Function to make the request, returns data or undefined
    errors: JSX.Element | null; // Error messages, can be JSX or null
}

// UseRequest hook
const useRequest = <T, >({
                             url,
                             method,
                             body,
                             onSuccess,
                         }: UseRequestProps<T>): UseRequestReturn<T> => {
    const [errors, setErrors] = useState<JSX.Element | null>(null);

    const doRequest = async (): Promise<T | undefined> => {
        try {
            setErrors(null);
            const response: AxiosResponse<T> = await axios[method](url, body);

            if (onSuccess) {
                onSuccess(response.data);
            }

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setErrors(
                    <div>
                        {error.response.data.errors.map((err: { message: string }) => (
                            <div key={err.message} className="text-red-500 text-sm mb-2">
                                {err.message}
                            </div>
                        ))}
                    </div>
                );
            }
        }
    };

    return {doRequest, errors};
};

export default useRequest;