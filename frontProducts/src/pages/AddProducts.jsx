import React, { useState } from "react";
import "../style/AddProducts.css";

import { v4 as uuidv4 } from 'uuid';
import axios from "axios";


const AddProducts = ({ crearProductos }) => {
  const [products, setProducts] = useState({
    id_product: uuidv4(),
    name: "",
    price: "",
    quantity: "",
    description: ""
  });

  const [error, setError] = useState(false);

  const actualizarEstado = (e) => {
    const { name, value, type } = e.target;

  setProducts({
    ...products,
    [name]: type === "number" ? Number(value) : value,
  });
  };


 
  const { name, price, quantity, description } = products;

  const submitProducto = async (e) => {
  e.preventDefault();

  if (!name || price == 0 || quantity == 0) {
    console.log("Error: los campos no pueden estar vacios");
    setError(true);
    return;
  }
  
    setError(false);
  
    // Prepare the product object with a unique ID
    const productToSend = {
      id_product: uuidv4(), // Generate a unique ID for DynamoDB
      name,
      price,
      quantity,
      description,
    };
  
      try {
    // 👇 Solo llamada al backend en Postgres
    const response = await axios.post(
      "http://localhost:8080/products/",
      productToSend,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Backend Response:", response.data);
    crearProductos(response.data);

  
  
      // Update the UI and reset the form
      crearProductos(productToSend); // Add the product to the local state
       setProducts({
      id_product: uuidv4(),
      name: "",
      price: "",
      quantity: "",
      description: "",
    });

    console.log("Producto registrado exitosamente");
  } catch (error) {
    console.error("Error:", error);
    if (error.response) {
      console.log("Error Response:", error.response.data);
    }
  }
};

  return (
    <form onSubmit={submitProducto}>
      {/* <Toaster />  */}
           <div>
        <label>Nombre del Producto</label>
        <input
          type="text"
          name="name"
          placeholder="Coca-Cola"
          className="input input-name"
          value={name}
          onChange={actualizarEstado}
          required
        />

        <br />

        <label>Precio *</label>
        <input
          type="number"
          name="price"
          placeholder="$ 0"
          value={price}
          onChange={actualizarEstado}
         
        />
        <br />

        <label htmlFor="cantidad">Cantidad</label>
        <input
          type="number"
          name="quantity"
          placeholder="0"
          value={quantity}
          onChange={actualizarEstado}
          required
        />
        <br />

        <label>Descripción</label>
        <input
          type="text"
          name="description"
          value={description}
          onChange={actualizarEstado}
        />

        <br />
      </div>

      <button type="submit" className="btn btn-outline-success">
        CREAR
      </button>
    </form>
  );
};

export default AddProducts;