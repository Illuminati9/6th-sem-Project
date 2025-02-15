import mongoose from 'mongoose';

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
        });
        console.log(` MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error(` MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default dbConnect;
// module.exports = dbConnect;
