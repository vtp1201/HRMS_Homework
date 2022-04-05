const mongoose = require('mongoose');

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 27017;
const dbName = process.env.DB_NAME || 'hrms';
const uri = `mongodb://${dbHost}:${dbPort}/${dbName}` || process.env.MONGO_URI;

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log('connect success');
    } catch (err) {
        console.log('Failed to connect to mongo on startup - retrying in 5 sec');
        setTimeout(connect, 5000);
    }
}

module.exports = { connect };