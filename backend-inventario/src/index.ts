import express from 'express';
import cors from 'cors';
import productosRoutes from './routes/productos.routes';

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Límite expandido para aceptar imágenes en Base64

// Rutas
app.use('/productos', productosRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de InventarioPro funcionando 🚀');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});