import { useEffect, useState } from 'react';
import { orderApi } from '../../Services/api';
import { useSelector } from 'react-redux';

const useFetchOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { loginInfo } = useSelector((state) => state.user);

    const fetchOrders = async () => {
        if (!loginInfo?.isSignIn || !loginInfo?.id) {
            setOrders([]);
            setLoading(false);
            return;
        }
        try {
            const response = await orderApi.getByUser(loginInfo.id);
            setOrders(response.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [loginInfo]);

    return { orders, loading, refetch: fetchOrders };
};

export default useFetchOrders;
