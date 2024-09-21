import express, {Request, Response} from "express";
import {requireAuth, validateRequest} from "@atgitix/common";
import {Order, OrderStatus} from "../models/order";
import {query} from "express-validator";

const router = express.Router();

// Define the query parameter interface for better type safety
interface OrderQueryParams {
    page?: string;
    limit?: string;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    status?: OrderStatus; // Optional filter for order status
}

router.get('/api/orders',
    requireAuth,
    [
        // Validate the "page" parameter (must be a positive integer)
        query('page')
            .optional()
            .isInt({min: 1})
            .withMessage('Page must be a positive integer'),

        // Validate the "limit" parameter (must be an integer or "all")
        query('limit')
            .optional()
            .custom(value => {
                if (value === 'all') return true;
                return /^[0-9]+$/.test(value) && parseInt(value, 10) > 0;
            })
            .withMessage('Limit must be a positive integer or "all"'),

        // Validate the "sortField" parameter (must be a string and one of the expected fields)
        query('sortField')
            .optional()
            .isIn(['createdAt']) // Add more fields as necessary
            .withMessage('Sort field must be one of "createdAt"'),

        // Validate the "sortOrder" parameter (must be "asc" or "desc")
        query('sortOrder')
            .optional()
            .isIn(['asc', 'desc'])
            .withMessage('Sort order must be either "asc" or "desc"'),

        // Validate the "status" parameter (must be a valid OrderStatus)
        query('status')
            .optional()
            .isIn(Object.values(OrderStatus))
            .withMessage(`Status must be one of ${Object.values(OrderStatus).join(', ')}`),
    ],
    validateRequest, // Middleware to check for validation errors
    async (req: Request<{}, {}, {}, OrderQueryParams>, res: Response) => {
        // Pagination parameters (with default values)
        const page: number = parseInt(req.query.page as string) || 1;
        const limitParam: string = req.query.limit || '10'; // Default limit is 10
        const limit: number = limitParam === 'all' ? 0 : parseInt(limitParam); // If "all", set limit to 0 (no limit)
        const skip: number = limit ? (page - 1) * limit : 0;

        // Sorting parameters
        const sortField = req.query.sortField || 'createdAt'; // Default sort by 'createdAt'
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1; // 'asc' by default

        // Filtering by status if provided
        const statusFilter = req.query.status ? {status: req.query.status} : {};

        try {
            // Fetch orders with sorting, filtering, and pagination
            const orders = await Order.find({
                userId: req.currentUser!.id,
                ...statusFilter // Apply status filter if exists
            })
                .populate('ticket') // Populate ticket details
                .sort({[sortField]: sortOrder})
                .skip(skip)
                .limit(limit); // No limit if "all" is passed (i.e., limit = 0)

            // Count total orders for pagination purposes
            const totalOrders = await Order.countDocuments({
                userId: req.currentUser!.id,
                ...statusFilter // Apply status filter for counting
            });

            // Return orders along with pagination data
            res.status(200).send({
                orders,
                currentPage: page,
                totalPages: limit ? Math.ceil(totalOrders / limit) : 1, // If limit is "all", only one page
                totalOrders
            });
        } catch (err) {
            res.status(500).send({error: 'An error occurred while fetching orders'});
        }
    });

export {router as indexOrderRouter};