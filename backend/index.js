const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta para obtener productos desde el archivo JSON
app.get('/api/productos', (_req, res) => {
    const filePath = path.join(__dirname, 'data', 'products.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo JSON:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        const productos = JSON.parse(data);
        res.json(productos);
    });
});

// Ruta para recibir órdenes de compra
app.post('/api/ordenar', (req, res) => {
    const nuevaOrden = req.body;
    console.log('Orden recibida:', nuevaOrden);

    const ordenesPath = path.join(__dirname, 'data', 'ordenes.json');

    fs.readFile(ordenesPath, 'utf8', (err, data) => {
        let ordenes = [];
        if (!err && data) {
            try {
                ordenes = JSON.parse(data);
            } catch (e) {
                console.error('Error al parsear el archivo de órdenes:', e);
            }
        }

        ordenes.push(nuevaOrden);

        fs.writeFile(ordenesPath, JSON.stringify(ordenes, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar la orden:', err);
                return res.status(500).json({ error: 'Error al guardar la orden' });
            }

            res.status(201).json({ mensaje: 'Orden recibida correctamente' });
        });
    });
});

// Ruta para ver todas las órdenes guardadas
app.get('/api/ordenes', (_req, res) => {
    const ordenesPath = path.join(__dirname, 'data', 'ordenes.json');

    fs.readFile(ordenesPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer las órdenes:', err);
            return res.status(500).json({ error: 'Error al leer las órdenes' });
        }

        try {
            const ordenes = JSON.parse(data);
            res.json(ordenes);
        } catch (e) {
            console.error('Error al parsear las órdenes:', e);
            res.status(500).json({ error: 'Error al procesar las órdenes' });
        }
    });
});

// Ruta para guardar correos
const correoPath = path.join(__dirname,  'data', 'correo.json');

// Inicializar archivo si no existe
if (!fs.existsSync(correoPath)) {
    fs.writeFileSync(correoPath, JSON.stringify([]));
}

app.post('/api/suscripcion', (req, res) => {
    const { correo } = req.body;

    if (!correo) {
        return res.status(400).json({ mensaje: 'Correo es requerido' });
    }

    fs.readFile(correoPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo de correos:', err);
            return res.status(500).json({ mensaje: 'Error del servidor' });
        }

        let correos = [];
        try {
            correos = JSON.parse(data);
        } catch (e) {
            console.error('Error al parsear el archivo de correos:', e);
        }

        correos.push({ correo });

        fs.writeFile(correoPath, JSON.stringify(correos, null, 2), err => {
            if (err) {
                console.error('Error al guardar el correo:', err);
                return res.status(500).json({ mensaje: 'Error del servidor' });
            }

            res.json({ mensaje: 'Correo guardado exitosamente' });
        });
    });
});

// Iniciar el servidor solo una vez
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
