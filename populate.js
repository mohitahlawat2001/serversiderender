const mongoose = require('mongoose');
const faker = require('faker');
const Product = require('./index.js'); // Adjust the path as necessary

mongoose.connect('mongodb+srv://mohitahlawat:mohit12345@cluster0.zmrkc.mongodb.net/serversiderender?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const products = [];

for (let i = 0; i < 100; i++) {
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
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log('Database populated with 100 random products!');
    } catch (error) {
        console.error('Error populating database:', error);
    } finally {
        mongoose.connection.close();
    }
};

populateDB();