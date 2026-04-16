import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup } from 'reactstrap';
import { useState } from 'react';
import axios from 'axios';

const EditarProductos = ({ cerrarModalActualizar, selectProduct, cargarProductos }) => {
  const [productEdit, setProductEdit] = useState(selectProduct || {
    name: "",
    price: "",
    quantity: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setProductEdit({
      ...productEdit,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const editarProducto = async (id_product, productoEdit) => {
  try {
    // Si usas autenticación, puedes dejar los headers
    const token = localStorage.getItem("jwt-token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Cambia la URL para apuntar directo al backend FastAPI
    const rdsResponse = await axios.put(
      `http://localhost:8080/products/${id_product}`,
      productoEdit,
      { headers }
    );
    console.log("Updated in RDS:", rdsResponse.data);

    await cargarProductos();
    setProductEdit({
      name: "",
      price: "",
      quantity: "",
      description: "",
    });
    cerrarModalActualizar();
  } catch (error) {
    console.error("Error updating product:", error);
    if (error.response) {
      console.log("Error response:", error.response.data);
    }
  }
};

  return (
    <Modal isOpen>
      <ModalHeader>
        <h3>Editar Registro</h3>
      </ModalHeader>

      <ModalBody>
        <FormGroup>
          <label>Nombre del Producto</label>
          <input className="form-control" type="text" name="name" value={productEdit.name} onChange={handleChange} />
        </FormGroup>

        <FormGroup>
          <label>Precio *</label>
          <input className="form-control" type="number" name="price" value={productEdit.price} onChange={handleChange} />
        </FormGroup>

        <FormGroup>
          <label>Cantidad</label>
          <input className="form-control" type="number" name="quantity" value={productEdit.quantity} onChange={handleChange} />
        </FormGroup>

        <FormGroup>
          <label>Descripción</label>
          <input className="form-control" type="text" name="description" value={productEdit.description} onChange={handleChange} />
        </FormGroup>
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={() => editarProducto(selectProduct.id_product, productEdit)}>Editar</Button>
        <Button color="danger" onClick={cerrarModalActualizar}>Cancelar</Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditarProductos;