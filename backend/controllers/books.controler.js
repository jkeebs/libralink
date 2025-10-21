import Book from '../models/Books.model.js'


export const getBooks = async (req, res) => {
    try {
        const books = await Book.find({});
        res.status(200).json({ success: true, count: books.length, data: books });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const addBook = async (req, res) => { 
    const bookData = req.body;

    if (!bookData.title || !bookData.author) {
        return res.status(400).json({ success: false, message: 'Title and Author are required' });
    }

    try {
        let newBook = new Book(bookData);
        await newBook.save();
        
        newBook.qrIdentifier = newBook._id.toString();
        await newBook.save();

        newBook.qrIdentifier = `LIB-${newBook._id.toString()}`;

        res.status(201).json({ 
            success: true, 
            data: newBook,
            qrCodeData: newBook.qrIdentifier 
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Book with this unique field (e.g., ISBN) already exists.' });
        }
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const updateBook = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );
        
        if (!updatedBook) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }
        
        res.status(200).json({ success: true, data: updatedBook });

    } catch (error) {
        if (error.name === 'ValidationError' || error.code === 11000) {
             return res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const deleteBook = async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Book.findByIdAndDelete(id);

        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        res.status(200).json({ success: true, message: "Book removed successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


export const borrowBook = async (req, res) => {
    const { qrIdentifier } = req.params;
    const { userEmail } = req.body // use ID for authentication M365

    try {
        const book = await Book.findOne({ qrIdentifier });

        if (!book) return res.status(404).json({success: false, message: 'Identifier Not Found'})
        if (book.isBorrowed) return res.status(400).json({success: false, message: "Book is unavailable, currently being borrowed."})

        book.isBorrowed = true;
        book.borrowedBy = userEmail; 
        book.borrowedAt = new Date();
        book.returnedAt = null; 

    await book.save();

    return res.status(200).json({success: true, message: 'Book borrowed successfully', book})
    } catch (error) {
        res.status(500).json({success: false, message:"Internal Server Error"})
    }

}

export const returnBook = async (req, res) => {
    const { qrIdentifier } = req.params;

    try {
        const book = await Book.findOne({ qrIdentifier });

    if (!book) return res.status(404).json({success: false, message: 'Identifier Not Found'})
    if (!book.isBorrowed) return res.status(400).json({success: false, message: "Book is currently not being borrowed."})

        book.isBorrowed = false;
        book.borrowedBy = null;
        book.returnedAt = new Date();

        await book.save();

        res.json({success: true, message: 'Book has been returned successfully.', book});

    } catch (error) {
         res.status(500).json({success: false, message:"Internal Server Error"})
    }
}






