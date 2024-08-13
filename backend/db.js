// backend/db.js
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(process.env.DB_NAME);
}

module.exports = { connectToDatabase };