export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  fotoBase64: string | null;
  codigoBarras: string | null;
  createdAt: string;
}

export type NuevoProducto = Omit<Producto, 'id' | 'createdAt'>;