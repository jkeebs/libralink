import { useState } from "react";
import BookList from "../compontents/BookList.jsx";

const Home = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">libralink</h1>
      <BookList key={refresh} />
    </div>
  );
};

export default Home;
