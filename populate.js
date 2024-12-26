const mongoose = require('mongoose');
const faker = require('faker');

mongoose.connect('mongodb+srv://mohitahlawat:mohit12345@cluster0.zmrkc.mongodb.net/serversiderender?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
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

const products = [];

for (let i = 0; i < 1000; i++) {
    products.push({
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        category: faker.commerce.department(),
        brand: faker.company.companyName(),
        createdAt: faker.date.past()
    });
}

const populateDB = async () => {
    try {
        await Product.insertMany(products);
        console.log('Database populated with 100 random products!');
    } catch (error) {
        console.error('Error populating database:', error);
    } finally {
        mongoose.connection.close();
    }
};

populateDB();