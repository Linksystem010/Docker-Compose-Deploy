import BotonAgregarProductos from "../components/BotonAgregarProductos";
import { useState, useEffect } from "react";
import { Table, Button } from "reactstrap";
import EditarProductos from "../components/EditarProductos";
import axios from "axios";

const Header = () => {
  const [productos, setProductos] = useState([]);
  const [selectProduct, setSelectProduct] = useState([]);
  const [editarForm, setEditarForm] = useState(false);
  const [filtroNombre, setFiltroNombre] = useState("");

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const token = localStorage.getItem("jwt-token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Fetch products from RDS (FastAPI backend)
      const rdsResponse = await axios.get("http://localhost:8080/products", { headers });
      setProductos(rdsResponse.data);
      console.log("RDS Products:", rdsResponse.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      if (error.response) {
        console.log("Error response:", error.response.data);
      }
    }
  };

  const agregarProducto = (producto) => {
    setProductos([...productos, producto]);
  };

  const cerrarModalActualizar = () => {
    setEditarForm(false);
  };

  const seleccionarElemento = (elemento) => {
    setSelectProduct({
      id_product: elemento.id_product,
      name: elemento.name,
      price: elemento.price,
      quantity: elemento.quantity,
      description: elemento.description,
    });
    setEditarForm(true);
  };

  const eliminarProducto = async (id_product) => {
    try {
      const token = localStorage.getItem("jwt-token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Delete product from RDS (FastAPI backend)
      const rdsResponse = await axios.delete(`http://localhost:8080/products/${id_product}`, { headers });
      console.log("Deleted from RDS:", rdsResponse.data);

      // Remove the product from the state
      const nuevosProductos = productos.filter((producto) => producto.id_product !== id_product);
      setProductos(nuevosProductos);

      console.log("Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);
      if (error.response) {
        console.log("Error response:", error.response.data);
      }
    }
  };

  const titulo = productos.length === 0 ? 'No hay Productos' : '';
  const totalProductos = productos.length;
  const costoTotal = productos.reduce((total, producto) => {
    return total + producto.price * producto.quantity;
  }, 0);

  const filtrarProductosPorNombre = (productos, filtroNombre) => {
    return productos.filter((producto) =>
      producto.name.toLowerCase().includes(filtroNombre.toLowerCase())
    );
  };

  const productosFiltrados = filtrarProductosPorNombre(productos, filtroNombre);

  return (
    <>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Inventario
          </a>
          <nav className="navbar bg-body-tertiary">
            <div>
              <BotonAgregarProductos agregarProducto={agregarProducto} />
            </div>
          </nav>
        </div>
      </nav>
      <div className="grilla">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
        />

        <div className="card-1">
          <h3>
            Total de productos <i className="fa-solid fa-boxes-stacked"></i>
          </h3>
          <p className="card-info">
            <i className="fas fa-2x fa-shopping-cart"></i>
            {totalProductos}
          </p>
        </div>

        <div className="card-1">
          <h3>
            Costo total de productos <i className="fas fa-dollar-sign"></i>
          </h3>
          <p className="card-info">
            <i className="fa-sharp fa-solid fa-sack-dollar"></i>${costoTotal}
          </p>
        </div>

        <Table>
          <thead>
            <tr>
              <th data-titulo="nombre">Nombre del Producto</th>
              <th data-titulo="Precio">Precio</th>
              <th data-titulo="Cantidad">Stock</th>
              <th data-titulo="Descripcion">Descripción</th>
              <th data-titulo="Acciones">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((elemento) => (
              <tr key={elemento.id_product}>
                <td>{elemento.name}</td>
                <td>{elemento.price}</td>
                <td>{elemento.quantity}</td>
                <td>{elemento.description}</td>
                <td>
                  <Button className="mr-3" color="primary" onClick={() => seleccionarElemento(elemento)}>
                    Editar
                  </Button>
                  <Button color="danger" onClick={() => eliminarProducto(elemento.id_product)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {editarForm && (
        <EditarProductos
          cerrarModalActualizar={cerrarModalActualizar}
          selectProduct={selectProduct}
          products={productos}
          setProducts={setSelectProduct}
          cargarProductos={cargarProductos}
        />
      )}
    </>
  );
};

export default Header;