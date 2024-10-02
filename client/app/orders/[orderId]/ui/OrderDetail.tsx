"use client";
import {OrderInterface} from "@/app/types/orders";
import {useState, useEffect} from "react";
import StripeCheckout from "react-stripe-checkout"
import useRequest from "@/app/lib/use-request";
import {useRouter} from "next/navigation";

const OrderDetail = ({order}: { order: OrderInterface }) => {
    const Router = useRouter();
    const [timeLeft, setTimeLeft] = useState<number>(0)
    const {doRequest, errors} = useRequest({
        url: `/api/payments`,
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: (payment) => console.log(payment)
    });

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt).getTime() - new Date().getTime();
            setTimeLeft(Math.round(msLeft / 1000));
        }

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId)
        }
    }, []);

    if (timeLeft < 0) {
        return (
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold my-8">Order Expired</h1>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold my-8">Purchasing: {order.ticket.title}</h1>
            <p>{timeLeft} seconds until order expires</p>
            <StripeCheckout
                token={({id}) => {
                    doRequest({token: id}).then(() => Router.push('/orders'))
                }}
                stripeKey="pk_test_51Q3Z032KK1G4uvpshk7RzlOGYgnfctzeQd4lTUgFLGnpNkghOqAx8ceKG7hJi3jgcWb73BZhyw6RrMqPLOQQmyz300PTlKyDfX"
                amount={order.ticket.price * 100}
                currency="usd"
                email="aneeqtariq_143@yahoo.com"
            />

            {/*<button disabled={(ticket.orderId === undefined) ? false : true} onClick={doRequest}*/}
            {/*        className='bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-300'>*/}
            {/*    Purchase Ticket*/}
            {/*</button>*/}
        </div>
    );
};

export default OrderDetail;