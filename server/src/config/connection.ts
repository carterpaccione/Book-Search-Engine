import mongoose from 'mongoose';

const db = async (): Promise<typeof mongoose.connection> => {
    console.log(`Logging URI From Env: ${process.env.MONGODB_URI}`);
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks')
        console.log('Database connected');
        return mongoose.connection;
    } catch (error) {
        console.log('Error connecting to the database: ', error);
        throw new Error('Error connecting to the database');
    }
};

export default db;