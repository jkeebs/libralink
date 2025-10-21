import express from 'express';
import dotenv from 'dotenv'; 
import cors from 'cors';
import connectDB from './config/db.js';
import bookRoutes from './routes/book.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use(express.json());


app.use('/api/books', bookRoutes);

app.get('/', (req, res) => {
    res.send('LibraLink is Active');
});

(async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(error);
        process.exit(1); 
    }
})();
