import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// GET /productos - Listar todo el inventario
export const getProductos = async (req: Request, res: Response) => {
  try {
    const productos = await prisma.producto.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// POST /productos - Crear un nuevo producto
export const crearProducto = async (req: Request, res: Response) => {
  try {
    const { nombre, precio, categoria, fotoBase64, codigoBarras } = req.body;

    if (!nombre || !precio || !categoria) {
      return res.status(400).json({ error: 'Nombre, precio y categoria son obligatorios' });
    }

    const nuevoProducto = await prisma.producto.create({
      data: {
        nombre,
        precio: parseFloat(precio),
        categoria,
        fotoBase64: fotoBase64 || null,
        codigoBarras: codigoBarras || null,
      },
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

// PUT /productos/:id - Editar un producto existente
export const editarProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, precio, categoria, fotoBase64, codigoBarras } = req.body;

    const productoActualizado = await prisma.producto.update({
      where: { id: Number(id) },
      data: {
        ...(nombre && { nombre }),
        ...(precio && { precio: parseFloat(precio) }),
        ...(categoria && { categoria }),
        ...(fotoBase64 !== undefined && { fotoBase64 }),
        ...(codigoBarras !== undefined && { codigoBarras }),
      },
    });

    res.json(productoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al editar el producto' });
  }
};

// DELETE /productos/:id - Borrar un producto
export const eliminarProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.producto.delete({
      where: { id: Number(id) },
    });

    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};