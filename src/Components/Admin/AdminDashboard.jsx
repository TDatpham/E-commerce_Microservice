import React, { useState, useEffect } from 'react';
import { productApi } from 'src/Services/api';
import { showAlert } from 'src/Features/alertsSlice';
import { useDispatch } from 'react-redux';
import s from './AdminDashboard.module.scss';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({
        name: '', price: 0, category: '', stockQuantity: 0, description: '', img: '', shortName: '', discount: 0
    });
    const dispatch = useDispatch();

    useEffect(() => {
        fetchProducts();
        fetchStats();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await productApi.getAll();
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await productApi.getStats();
            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct({ ...currentProduct, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await productApi.update(currentProduct.id, currentProduct);
                dispatch(showAlert({ alertText: 'Product updated successfully', alertState: 'success', alertType: 'alert' }));
            } else {
                await productApi.create(currentProduct);
                dispatch(showAlert({ alertText: 'Product created successfully', alertState: 'success', alertType: 'alert' }));
            }
            fetchProducts();
            fetchStats();
            resetForm();
        } catch (err) {
            dispatch(showAlert({ alertText: 'Operation failed', alertState: 'error', alertType: 'alert' }));
        }
    };

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productApi.delete(id);
                dispatch(showAlert({ alertText: 'Product deleted', alertState: 'success', alertType: 'alert' }));
                fetchProducts();
                fetchStats();
            } catch (err) {
                dispatch(showAlert({ alertText: 'Delete failed', alertState: 'error', alertType: 'alert' }));
            }
        }
    };

    const resetForm = () => {
        setCurrentProduct({ name: '', price: 0, category: '', stockQuantity: 0, description: '', img: '', shortName: '', discount: 0 });
        setIsEditing(false);
    };

    return (
        <div className={s.adminDashboard}>
            <div className="container">
                <h1>Admin Dashboard</h1>

                <section className={s.statsSection}>
                    <h2>Best Selling Products (Analysis)</h2>
                    <div className={s.statsGrid}>
                        {stats.map(p => (
                            <div key={p.id} className={s.statCard}>
                                <h3>{p.shortName}</h3>
                                <p>Sold: <strong>{p.sold || 0}</strong> units</p>
                                <p>Revenue: ${(p.sold * p.price).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={s.formSection}>
                    <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
                    <form onSubmit={handleSubmit} className={s.form}>
                        <div className={s.inputGroup}>
                            <input name="name" value={currentProduct.name} onChange={handleInputChange} placeholder="Product Full Name" required />
                            <input name="shortName" value={currentProduct.shortName} onChange={handleInputChange} placeholder="Short Name" required />
                        </div>
                        <div className={s.inputGroup}>
                            <input type="number" name="price" value={currentProduct.price} onChange={handleInputChange} placeholder="Price" required />
                            <input type="number" name="discount" value={currentProduct.discount} onChange={handleInputChange} placeholder="Discount %" />
                        </div>
                        <div className={s.inputGroup}>
                            <input name="category" value={currentProduct.category} onChange={handleInputChange} placeholder="Category" required />
                            <input type="number" name="stockQuantity" value={currentProduct.stockQuantity} onChange={handleInputChange} placeholder="Stock Quantity" required />
                        </div>
                        <input name="img" value={currentProduct.img} onChange={handleInputChange} placeholder="Image Filename/URL" required />
                        <textarea name="description" value={currentProduct.description} onChange={handleInputChange} placeholder="Description" required />

                        <div className={s.buttonGroup}>
                            <button type="submit" className={s.submitBtn}>{isEditing ? 'Update' : 'Create'}</button>
                            {isEditing && <button type="button" onClick={resetForm} className={s.cancelBtn}>Cancel</button>}
                        </div>
                    </form>
                </section>

                <section className={s.listSection}>
                    <h2>Product List</h2>
                    <table className={s.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Sold</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id}>
                                    <td>{p.shortName}</td>
                                    <td>{p.category}</td>
                                    <td>${p.price}</td>
                                    <td>{p.stockQuantity}</td>
                                    <td>{p.sold || 0}</td>
                                    <td>
                                        <button onClick={() => handleEdit(p)} className={s.editBtn}>Edit</button>
                                        <button onClick={() => handleDelete(p.id)} className={s.deleteBtn}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
