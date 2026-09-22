import { Producto } from './Producto';

export type ProductosStackParamList = {
  ListaProductos: undefined;
  EditarProducto: { producto: Producto };
};