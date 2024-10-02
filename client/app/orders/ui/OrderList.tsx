import React from 'react';
import { OrderInterface } from '@/app/types/orders';

const OrderListing = ({ orders }: {
    orders: OrderInterface[];
}) => {
    return (
        <div className="container w-full mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold mb-4">Order List</h1>
            <table className="min-w-full bg-white rounded-lg shadow-lg">
                <thead>
                <tr className="w-full bg-gray-200 text-left">
                    <th className="py-3 px-6 text-sm font-medium text-gray-700">Order ID</th>
                    <th className="py-3 px-6 text-sm font-medium text-gray-700">Ticket Title</th>
                    <th className="py-3 px-6 text-sm font-medium text-gray-700">Price</th>
                    <th className="py-3 px-6 text-sm font-medium text-gray-700">Status</th>
                    <th className="py-3 px-6 text-sm font-medium text-gray-700">Expires At</th>
                    <th className="py-3 px-6 text-sm font-medium text-gray-700">Created At</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr
                        key={order.id}
                        className="bg-white hover:bg-gray-100 border-b border-gray-200 transition duration-150"
                    >
                        <td className="py-3 px-6 text-sm text-gray-700">{order.id}</td>
                        <td className="py-3 px-6 text-sm text-gray-700">{order.ticket.title}</td>
                        <td className="py-3 px-6 text-sm text-gray-700">${order.ticket.price}</td>
                        <td
                            className={`py-3 px-6 text-sm ${
                                order.status === 'complete' ? 'text-green-500' : 'text-yellow-500'
                            }`}
                        >
                            {order.status}
                        </td>
                        <td className="py-3 px-6 text-sm text-gray-700">{new Date(order.expiresAt).toLocaleString()}</td>
                        <td className="py-3 px-6 text-sm text-gray-700">{new Date(order.createdAt).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderListing;
