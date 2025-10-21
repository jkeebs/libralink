import { useEffect, useState } from "react";
import { deleteBook as apiDeleteBook } from "../api/books";

const API_URL = "http://localhost:5000/api/books"; // adjust if needed

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [generating, setGenerating] = useState({});
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  

  // Fetch books from backend
  const loadBooks = async () => {
    try {
      const res = await fetch(API_URL);
      const result = await res.json();
      setBooks(result.data || []); // Use the data array from backend
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // Add a new book
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, isbn }),
      });
      const result = await res.json();

      if (result.success) {
        setBooks((prevBooks) => [...prevBooks, result.data]);
        setTitle("");
        setAuthor("");
        setIsbn("");
      } else {
        console.error("Failed to add book:", result.message);
      }
    } catch (err) {
      console.error("Failed to add book:", err);
    }
  };

  // Borrow a book
  const handleBorrow = async (qrIdentifier) => {
    try {
      const res = await fetch(`${API_URL}/borrow/${qrIdentifier}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: "student1@school.com" }), // placeholder
      });
      const result = await res.json();
      if (result.success) {
        setBooks((prevBooks) =>
          prevBooks.map((b) =>
            b.qrIdentifier === qrIdentifier ? result.book : b
          )
        );
      } else {
        console.error("Failed to borrow book:", result.message);
      }
    } catch (err) {
      console.error("Failed to borrow book:", err);
    }
  };

  // Return a book
  const handleReturn = async (qrIdentifier) => {
    try {
      const res = await fetch(`${API_URL}/return/${qrIdentifier}`, { method: "POST" });
      const result = await res.json();
      if (result.success) {
        setBooks((prevBooks) =>
          prevBooks.map((b) =>
            b.qrIdentifier === qrIdentifier ? result.book : b
          )
        );
      } else {
        console.error("Failed to return book:", result.message);
      }
    } catch (err) {
      console.error("Failed to return book:", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add a Book</h1>

      {/* Add Book Form */}
      <form onSubmit={handleAddBook} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered"
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="input input-bordered"
          required
        />
        <input
          type="text"
          placeholder="ISBN (optional)"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          className="input input-bordered"
        />
        <button type="submit" className="btn btn-success">
          Add Book
        </button>
      </form>

      {/* Book List */}
      {books.length === 0 ? (
        <p>No books available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <div key={book._id} className="card bg-base-100 shadow-md p-4">
              <h3 className="font-bold text-lg">{book.title}</h3>
              <p>{book.author}</p>
              {book.isbn && <p className="text-sm">ISBN: {book.isbn}</p>}
              <p>Status: {book.isBorrowed ? "Borrowed" : "Available"}</p>
              {book.qrIdentifier && (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?data=${book.qrIdentifier}&size=100x100`}
                  alt="QR Code"
                  className="my-2"
                />
              )}
              {!book.qrIdentifier && (
                <button
                  className="btn btn-outline btn-sm my-2"
                  onClick={async () => {
                    // prevent double-clicks
                    if (generating[book._id]) return;
                    setGenerating((s) => ({ ...s, [book._id]: true }));
                    try {
                      const qrIdentifier = `LIB-${book._id}`;
                      const res = await fetch(`${API_URL}/${book._id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ qrIdentifier }),
                      });
                      const result = await res.json();
                      if (result.success) {
                        setBooks((prevBooks) =>
                          prevBooks.map((b) => (b._id === book._id ? result.data : b))
                        );
                      } else {
                        console.error("Failed to generate QR:", result.message);
                      }
                    } catch (err) {
                      console.error("Failed to generate QR:", err);
                    } finally {
                      setGenerating((s) => ({ ...s, [book._id]: false }));
                    }
                  }}
                >
                  {generating[book._id] ? "Generating..." : "Generate QR"}
                </button>
              )}
              {!book.isBorrowed ? (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleBorrow(book.qrIdentifier)}
                >
                  Borrow
                </button>
              ) : (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleReturn(book.qrIdentifier)}
                >
                  Return
                </button>
              )}
              <button
                className="btn btn-ghost btn-sm ml-2"
                onClick={async () => {
                  if (!confirm(`Delete '${book.title}'? This cannot be undone.`)) return;
                  try {
                    await apiDeleteBook(book._id);
                    setBooks((prev) => prev.filter((b) => b._id !== book._id));
                  } catch (err) {
                    console.error("Failed to delete book:", err);
                  }
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// delete book component 



export default BookList;
