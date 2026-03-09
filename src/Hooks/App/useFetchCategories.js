import { useEffect, useState } from "react";
import { categoryApi } from "src/Services/api";

const useFetchCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await categoryApi.getAll();
        setCategories(response.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return { categories, loading, error };
};

export default useFetchCategories;

