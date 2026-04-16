import React from "react";
import { useState } from "react";
import AddProducts from "../pages/AddProducts";
import "../style/ButtonEvents.css";

const BotonAgregarProductos = ({agregarProducto}) => {
  const [formularioVisible, setFormularioVisible] = useState(false);


  
  const HandleClick = () => {
    setFormularioVisible({
      formularioVisible: true
    });
  };
  const cerrarFormulario = () => {
    setFormularioVisible(false);
  };
  return (
    <>
      <button
        className="btn btn-outline-success me-2"
        type="button"
        onClick={() => HandleClick()}
      >
        Agregar Producto
      </button>
      {formularioVisible && (
            <div className="fondo-difuminado" onClick={cerrarFormulario}>
            <div className="formulario" onClick={(e) => e.stopPropagation()}>
              {<AddProducts crearProductos={agregarProducto} />}
            </div>
          </div>
          )}

    </>
  );
};
export default BotonAgregarProductos;
