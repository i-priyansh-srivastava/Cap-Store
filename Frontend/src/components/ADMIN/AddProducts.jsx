import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/ADMIN/AddProducts.css';

const AddProductForm = () => {
    const [formData, setFormData] = useState({
        productName: '',
        imageUrl: '',
        description: '',
        price: '',
        rating: '',
        category: '',
        tags: '',
        gender: '',
        availableSize: '',
        relatedPhotos: '',
        inStock: true,
        stockCount: ''
    });

    const genders = ['Male', 'Female', 'Unisex', 'Item'];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            price: Number(formData.price),
            rating: Number(formData.rating),
            stockCount: Number(formData.stockCount),
            tags: formData.tags.split(',').map(tag => tag.trim()),
            availableSize: formData.availableSize.split(',').map(size => size.trim()),
            relatedPhotos: formData.relatedPhotos
                ? formData.relatedPhotos.split(',').map(url => url.trim())
                : []
        };

        try {
            const response = await axios.post('http://localhost:5000/api/v1/addProducts', payload);
            alert('Product added successfully!');
            console.log(response.data);
            setFormData({
                productName: '',
                imageUrl: '',
                description: '',
                price: '',
                rating: '',
                category: '',
                tags: '',
                gender: '',
                availableSize: '',
                relatedPhotos: '',
                inStock: true,
                stockCount: ''
            });
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        }
    };

    return (
        <form className="product-form" onSubmit={handleSubmit}>
            <h2>Add New Product</h2>

            <input type="text" name="productName" placeholder="Product Name" value={formData.productName} onChange={handleChange} required />
            <input type="text" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
            <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
            <input type="number" name="rating" placeholder="Rating" step="0.1" value={formData.rating} onChange={handleChange} required />
            <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
            <input type="text" name="tags" placeholder="Tags (comma separated)" value={formData.tags} onChange={handleChange} required />

            <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                {genders.map((g) => (
                    <option key={g} value={g}>{g}</option>
                ))}
            </select>

            <input type="text" name="availableSize" placeholder="Available Sizes (comma separated)" value={formData.availableSize} onChange={handleChange} required />
            <input type="text" name="relatedPhotos" placeholder="Related Photos URLs (comma separated)" value={formData.relatedPhotos} onChange={handleChange} />

            <label className="checkbox">
                <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} />
                In Stock
            </label>

            <input type="number" name="stockCount" placeholder="Stock Count" value={formData.stockCount} onChange={handleChange} />

            <button type="submit">Add Product</button>
        </form>
    );
};

export default AddProductForm;
