import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: false
    },
    qrIdentifier: {
        type: String,
        unique: true,
    },
    isBorrowed: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true 
});

const Book = mongoose.model('Book', bookSchema);
export default Book;
