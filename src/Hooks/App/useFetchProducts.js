import { useEffect, useState } from 'react';
import { productApi } from '../../Services/api';

const useFetchProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const response = await productApi.getAll();
                setProducts(response.data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    return { products, loading, error };
};

export default useFetchProducts;
