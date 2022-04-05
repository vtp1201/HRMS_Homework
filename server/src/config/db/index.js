const mongoose = require('mongoose');

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 27017;
const dbName = process.env.DB_NAME || 'hrms';
const uri = `mongodb://${dbHost}:${dbPort}/${dbName}`;

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://vtp1201:12012000@cluster0.akmfw.mongodb.net/hrms');
        console.log('connect success');
    } catch (err) {
        console.log('Failed to connect to mongo on startup - retrying in 5 sec');
        setTimeout(connect, 5000);
    }
}

module.exports = { connect };