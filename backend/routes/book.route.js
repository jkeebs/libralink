import express from 'express';
const router = express.Router();
import Book from '../models/Books.model.js';
import { getBooks, addBook, updateBook, deleteBook, borrowBook, returnBook } from '../controllers/books.controler.js';


router.get('/', getBooks); 

router.post('/', addBook);

router.post("/borrow/:qrIdentifier", borrowBook);

router.post("/return/:qrIdentifier", returnBook);

router.put('/:id', updateBook)

router.delete('/:id', deleteBook)



export default router; 