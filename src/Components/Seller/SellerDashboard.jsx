import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "src/Features/alertsSlice";
import { productApi } from "src/Services/api";
import { useNavigate } from "react-router-dom";
import useSignOut from "src/Hooks/App/useSignOut";
import s from "../Admin/AdminDashboard.module.scss";

const SellerDashboard = () => {
  const { loginInfo } = useSelector((state) => state.user);
  const sellerId = loginInfo?.id;
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const signOut = useSignOut();

  const handleLogout = () => {
    signOut();
    navigateTo("/", { replace: true });
  };

  const [products, setProducts] = useState([]);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    price: 0,
    category: "",
    stockQuantity: 50,
    description: "",
    img: "",
    shortName: "",
    discount: 0,
    sellerId: sellerId,
    status: "PENDING"
  });

  useEffect(() => {
    if (sellerId) {
      fetchProducts();
    }
  }, [sellerId]);

  const fetchProducts = async () => {
    try {
      const res = await productApi.getProductsBySeller(sellerId);
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...currentProduct, sellerId, status: "PENDING" };
      if (isEditingProduct) {
        await productApi.update(currentProduct.id, payload);
        dispatch(showAlert({ alertText: "Product updated & awaiting approval", alertState: "success", alertType: "alert" }));
      } else {
        await productApi.create(payload);
        dispatch(showAlert({ alertText: "Product submitted for approval", alertState: "success", alertType: "alert" }));
      }
      fetchProducts();
      resetProductForm();
    } catch (err) {
      dispatch(showAlert({ alertText: "Operation failed", alertState: "error", alertType: "alert" }));
    }
  };

  const handleProductEdit = (product) => {
    setCurrentProduct(product);
    setIsEditingProduct(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await productApi.delete(id);
        dispatch(showAlert({ alertText: "Product deleted", alertState: "success", alertType: "alert" }));
        fetchProducts();
      } catch (err) {
        dispatch(showAlert({ alertText: "Delete failed", alertState: "error", alertType: "alert" }));
      }
    }
  };

  const resetProductForm = () => {
    setCurrentProduct({
      name: "",
      price: 0,
      category: "",
      stockQuantity: 50,
      description: "",
      img: "",
      shortName: "",
      discount: 0,
      sellerId: sellerId,
      status: "PENDING"
    });
    setIsEditingProduct(false);
  };

  return (
    <div className={s.adminDashboard}>
      <div className="container">
        <div className={s.header}>
            <div className={s.logoArea}>
              <span className={s.logoIcon}>🏪</span>
              <h1>Seller Dashboard</h1>
            </div>
            <div className={s.headerActions}>
               <button onClick={() => navigateTo("/")} className={s.refreshBtn}>Back to Shop</button>
               <button onClick={handleLogout} className={s.logoutBtn}>Logout</button>
            </div>
        </div>

        <div className={s.content} style={{ marginTop: '20px' }}>
          <section className={s.formSection}>
            <h2>{isEditingProduct ? "Edit Product" : "Post New Product"}</h2>
            <form onSubmit={handleProductSubmit} className={s.form}>
              <div className={s.inputGroup}>
                <input name="name" value={currentProduct.name} onChange={handleProductInputChange} placeholder="Product Full Name" required />
                <input name="shortName" value={currentProduct.shortName} onChange={handleProductInputChange} placeholder="Short Name" required />
              </div>
              <div className={s.inputGroup}>
                <input type="number" name="price" value={currentProduct.price} onChange={handleProductInputChange} placeholder="Price" required />
                <input type="number" name="discount" value={currentProduct.discount} onChange={handleProductInputChange} placeholder="Discount %" />
              </div>
              <div className={s.inputGroup}>
                <input name="category" value={currentProduct.category} onChange={handleProductInputChange} placeholder="Category" required />
                <input type="number" name="stockQuantity" value={currentProduct.stockQuantity} onChange={handleProductInputChange} placeholder="Stock Quantity" required />
              </div>
              <input name="img" value={currentProduct.img} onChange={handleProductInputChange} placeholder="Image URL" required />
              <textarea name="description" value={currentProduct.description} onChange={handleProductInputChange} placeholder="Description" required />
              <div className={s.buttonGroup}>
                <button type="submit" className={s.submitBtn}>{isEditingProduct ? "Update" : "Post for Approval"}</button>
                {isEditingProduct && <button type="button" onClick={resetProductForm} className={s.cancelBtn}>Cancel</button>}
              </div>
            </form>
          </section>

          <section className={s.listSection}>
            <h2>My Products</h2>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.shortName}</td>
                    <td>${p.price}</td>
                    <td data-status={p.status}>
                        <span className={`${s.statusBadge} ${s[p.status?.toLowerCase()]}`}>
                            {p.status || "PENDING"}
                        </span>
                    </td>
                    <td>
                      <button onClick={() => handleProductEdit(p)} className={s.editBtn}>Edit</button>
                      <button onClick={() => handleProductDelete(p.id)} className={s.deleteBtn}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
