import mongoose from 'mongoose';
import config from '../config';

export const connectDB = async () => {
    await mongoose.connect(config.mongo.url, {
        authMechanism: "DEFAULT",
        dbName: config.mongo.db_name,
    });
    mongoose.Promise = global.Promise;
    mongoose.connection.on('error', (error) => console.error('MongoDB connection error:', error));

    require('./models/User');
    require('./models/Advert');
}
