"use client";

import {useEffect} from "react";
import useRequest from "@/app/lib/use-request";
import {useRouter} from "next/navigation";

export default () => {
    const router = useRouter();
    const {doRequest} = useRequest({
        url: "/api/users/signout",
        method: "post",
        onSuccess: () => {
            router.push("/");
        },
    });
    useEffect(() => {
        try {
            doRequest();
        } catch (error) {
            console.error(error);
        }
    }, []);

    return <div>Signing you out...</div>;
};