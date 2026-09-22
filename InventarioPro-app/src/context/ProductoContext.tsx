import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import api from '../api/api';
import { Producto, NuevoProducto } from '../types/Producto';

interface ProductoContextType {
  productos: Producto[];
  cargando: boolean;
  obtenerProductos: () => Promise<void>;
  agregarProducto: (producto: NuevoProducto) => Promise<void>;
  actualizarProducto: (id: number, producto: Partial<NuevoProducto>) => Promise<void>;
  eliminarProducto: (id: number) => Promise<void>;
}

const ProductoContext = createContext<ProductoContextType | undefined>(undefined);

export const ProductoProvider = ({ children }: { children: ReactNode }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(false);

  // GET /productos
  const obtenerProductos = useCallback(async () => {
    try {
      setCargando(true);
      const response = await api.get<Producto[]>('/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setCargando(false);
    }
  }, []);

  // POST /productos
  const agregarProducto = useCallback(async (producto: NuevoProducto) => {
    try {
      await api.post('/productos', producto);
      await obtenerProductos();
    } catch (error) {
      console.error('Error al agregar producto:', error);
      throw error;
    }
  }, [obtenerProductos]);

  // PUT /productos/:id
  const actualizarProducto = useCallback(async (id: number, producto: Partial<NuevoProducto>) => {
    try {
      await api.put(`/productos/${id}`, producto);
      await obtenerProductos();
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  }, [obtenerProductos]);

  // DELETE /productos/:id
  const eliminarProducto = useCallback(async (id: number) => {
    try {
      await api.delete(`/productos/${id}`);
      await obtenerProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  }, [obtenerProductos]);

  return (
    <ProductoContext.Provider
      value={{
        productos,
        cargando,
        obtenerProductos,
        agregarProducto,
        actualizarProducto,
        eliminarProducto,
      }}
    >
      {children}
    </ProductoContext.Provider>
  );
};

export const useProductos = () => {
  const context = useContext(ProductoContext);
  if (!context) {
    throw new Error('useProductos debe usarse dentro de un ProductoProvider');
  }
  return context;
};