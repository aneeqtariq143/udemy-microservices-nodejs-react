"use client";
import {useRouter} from "next/navigation";
import Link from "next/link";
export default function Page() {
    const Router = useRouter();
    return (
        <main className="container mx-auto py-5">
            <h1 className="text-3xl font-bold my-8">Ticket not found</h1>
            <Link href={'/'}>Go Back</Link>
        </main>
    );
};