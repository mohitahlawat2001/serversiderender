const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://mohitahlawat:mohit12345@cluster0.zmrkc.mongodb.net/serversiderender?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Sample Product Schema
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    brand: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', productSchema);

// API Endpoint with pagination, sorting, filtering, and grouping
app.get('/api/products', async (req, res) => {
    try {
        // 1. Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // 2. Sorting parameters
        const sortField = req.query.sortField || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const sortQuery = { [sortField]: sortOrder };

        // 3. Filtering parameters
        let filterQuery = {};
        if (req.query.category) {
            filterQuery.category = req.query.category;
        }
        if (req.query.brand) {
            filterQuery.brand = req.query.brand;
        }
        if (req.query.minPrice || req.query.maxPrice) {
            filterQuery.price = {};
            if (req.query.minPrice) {
                filterQuery.price.$gte = parseFloat(req.query.minPrice);
            }
            if (req.query.maxPrice) {
                filterQuery.price.$lte = parseFloat(req.query.maxPrice);
            }
        }

        // 4. Execute query with pagination and sorting
        const products = await Product.find(filterQuery)
            .sort(sortQuery)
            .skip(skip)
            .limit(limit);

        // 5. Get total count for pagination
        const total = await Product.countDocuments(filterQuery);

        // 6. Grouping (if requested)
        let groupedData = null;
        if (req.query.groupBy) {
            groupedData = await Product.aggregate([
                { $match: filterQuery },
                {
                    $group: {
                        _id: `$${req.query.groupBy}`,
                        count: { $sum: 1 },
                        totalPrice: { $sum: '$price' },
                        avgPrice: { $avg: '$price' }
                    }
                }
            ]);
        }

        // 7. Send Response
        res.json({
            status: 'success',
            data: products,
            pagination: {
                currentPage: page,
                limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit)
            },
            groupedData: groupedData
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});