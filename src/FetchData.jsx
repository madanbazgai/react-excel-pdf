import { useDispatch } from "react-redux";
import { setData, setLoading } from "./features/api/postSlice";
import { useEffect, useState } from "react";

function FetchData({ page }) {
  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();

  const fetchPosts = async () => {
    dispatch(setLoading(true));

    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=5`
      );
      const data = await res.json();
      setPosts(data);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      dispatch(setData(data));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  return <button onClick={fetchPosts}>Refresh Data</button>;
}

export default FetchData;
