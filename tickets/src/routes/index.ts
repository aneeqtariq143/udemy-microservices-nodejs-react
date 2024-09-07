import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

// Define the query parameter interface for better type safety
interface TicketQueryParams {
    page?: string;
    limit?: string;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    title?: string;
    priceMin?: string;
    priceMax?: string;
}

router.get('/api/tickets', async (req: Request<{}, {}, {}, TicketQueryParams>, res: Response) => {
    // Pagination parameters (with default values)
    const page: number = parseInt(req.query.page as string) || 1;
    const limitParam: string = req.query.limit || '10'; // Default limit is 10
    const limit: number = limitParam === 'all' ? 0 : parseInt(limitParam); // If "all", set limit to 0 (no limit)
    const skip: number = limit ? (page - 1) * limit : 0;

    // Sorting parameters
    const sortField = req.query.sortField || 'title'; // Default sort by 'title'
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1; // 'asc' by default

    // Filtering parameters
    const titleFilter = req.query.title ? { title: { $regex: req.query.title, $options: 'i' } } : {};

    // Combine priceMin and priceMax into a single price filter
    let priceFilter: any = {};
    if (req.query.priceMin) {
        priceFilter = { ...priceFilter, $gte: parseFloat(req.query.priceMin) };
    }
    if (req.query.priceMax) {
        priceFilter = { ...priceFilter, $lte: parseFloat(req.query.priceMax) };
    }
    const priceQuery = Object.keys(priceFilter).length > 0 ? { price: priceFilter } : {};

    // Combine the filters
    const filters = {
        ...titleFilter,
        ...priceQuery
    };

    try {
        // Fetch tickets with sorting and filtering (pagination depends on limit)
        const tickets = await Ticket.find(filters)
            .sort({ [sortField as string]: sortOrder })
            .skip(skip)
            .limit(limit); // No limit if "all" is passed (i.e., limit = 0)

        // Count total documents for pagination purposes
        const totalTickets = await Ticket.countDocuments(filters);

        res.status(200).send({
            tickets,
            currentPage: page,
            totalPages: limit ? Math.ceil(totalTickets / limit) : 1, // If limit is "all", only one page
            totalTickets
        });
    } catch (err) {
        res.status(500).send({ error: 'An error occurred while fetching tickets' });
    }
});

export { router as indexTicketRouter };