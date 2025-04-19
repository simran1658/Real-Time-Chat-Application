import mongoose from 'mongoose';

const dbconnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT);
        console.log('Database connected successfully');
    } catch (error) {
        console.log(error);
    }
}

export default dbconnect;
