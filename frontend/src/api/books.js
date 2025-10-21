const API_URL = "http://localhost:5000/api/books";

// Fetch all books
export const getBooks = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
};


export const addBook = async (book) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Failed to add book");
  return res.json();
};

export const borrowBook = async (qrIdentifier, userEmail) => {
  const res = await fetch(`${API_URL}/borrow/${qrIdentifier}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userEmail }),
  });
  if (!res.ok) throw new Error("Failed to borrow book");
  return res.json();
};


export const returnBook = async (qrIdentifier) => {
  const res = await fetch(`${API_URL}/return/${qrIdentifier}`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to return book");
  return res.json();
};

export const deleteBook = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete book");
  return res.json();
};
