// client/src/components/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';

const ProductForm = ({ isEdit }) => {
  const [product, setProduct] = useState({
    name: '',
    price: 0,
    description: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id, isEdit]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/products/${id}`
      );
      setProduct(response.data);
    } catch (err) {
      setError('Error fetching product');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/api/products/${id}`, product);
      } else {
        await axios.post('http://localhost:5000/api/products', product);
      }
      navigate('/');
    } catch (err) {
      setError('Error saving product');
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="my-4">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={product.description}
            onChange={handleChange}
            rows={3}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          {isEdit ? 'Update' : 'Save'}
        </Button>
      </Form>
    </div>
  );
};

export default ProductForm;
