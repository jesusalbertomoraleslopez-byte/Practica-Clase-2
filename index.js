const express = require('express');

const app = express();
// Configurar el puerto dinámico para despliegues en la nube o puerto 3000 por defecto
const PORT = process.env.PORT || 3000;

// Middleware para procesar solicitudes con cuerpo JSON
app.use(express.json());

// Datos de ejemplo en memoria
let items = [
  { id: 1, nombre: 'Elemento 1', descripcion: 'Primer elemento de prueba' },
  { id: 2, nombre: 'Elemento 2', descripcion: 'Segundo elemento de prueba' }
];

// Ruta raíz con información de la API
app.get('/', (req, res) => {
  res.json({
    mensaje: '¡Bienvenido a la API con Express!',
    estado: 'activa',
    timestamp: new Date().toISOString(),
    rutasDisponibles: [
      { metodo: 'GET', ruta: '/', descripcion: 'Información general de la API' },
      { metodo: 'GET', ruta: '/health', descripcion: 'Health check (comprobación de estado)' },
      { metodo: 'GET', ruta: '/api/items', descripcion: 'Obtener todos los elementos' },
      { metodo: 'GET', ruta: '/api/items/:id', descripcion: 'Obtener un elemento por ID' },
      { metodo: 'POST', ruta: '/api/items', descripcion: 'Crear un nuevo elemento' }
    ]
  });
});

// Ruta de health check (útil para balanceadores de carga y plataformas en la nube)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Obtener todos los elementos
app.get('/api/items', (req, res) => {
  res.json(items);
});

// Obtener un elemento por ID
app.get('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = items.find((i) => i.id === id);

  if (!item) {
    return res.status(404).json({ error: 'Elemento no encontrado' });
  }

  res.json(item);
});

// Crear un nuevo elemento
app.post('/api/items', (req, res) => {
  const { nombre, descripcion } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
  }

  const nuevoItem = {
    id: items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1,
    nombre,
    descripcion: descripcion || ''
  };

  items.push(nuevoItem);
  res.status(201).json(nuevoItem);
});

// Middleware para manejar rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  console.log(`Accede en: http://localhost:${PORT}`);
});
