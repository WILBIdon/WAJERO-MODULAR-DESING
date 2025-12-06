import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { saveInvitation, getInvitationBySlug, initDB } from './db.js';

// Configuración básica
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Configurar dónde se guardan las imágenes (EL VOLUMEN)
// En Railway, montaremos el volumen en la carpeta '/app/uploads'
const UPLOAD_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH || path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configuración de Multer para guardar archivos en el disco
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIR)
    },
    filename: function (req, file, cb) {
        // Nombre único: fecha + nombre original limpio
        const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, Date.now() + '-' + cleanName)
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
    fileFilter: (req, file, cb) => {
        // Solo permitir imágenes
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen'));
        }
    }
});

app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Servir las imágenes guardadas públicamente
app.use('/uploads', express.static(UPLOAD_DIR));
// Servir tu app de React (la carpeta dist)
app.use(express.static(path.join(__dirname, 'dist')));

// --- RUTA 1: Subir Imagen ---
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se recibió ningún archivo' });
        }
        // Devolvemos la URL pública de la imagen
        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({ url: fileUrl, filename: req.file.filename });
    } catch (error) {
        console.error('Error al subir archivo:', error);
        res.status(500).json({ error: 'Error al subir el archivo' });
    }
});

// --- RUTA 2: Guardar Invitación ---
app.post('/api/save', async (req, res) => {
    try {
        const datosInvitacion = req.body;

        if (!datosInvitacion || !datosInvitacion.global) {
            return res.status(400).json({ error: 'Datos de invitación inválidos' });
        }

        // Crear slug único basado en el título
        const baseSlug = datosInvitacion.global.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const slug = `${baseSlug}-${Date.now()}`;

        // Guardar en la base de datos
        await saveInvitation(slug, datosInvitacion);

        res.json({
            success: true,
            slug: slug,
            url: `${req.protocol}://${req.get('host')}/invitacion/${slug}`
        });
    } catch (error) {
        console.error('Error al guardar invitación:', error);
        res.status(500).json({ error: 'Error al guardar la invitación' });
    }
});

// --- RUTA 3: Leer Invitación ---
app.get('/api/invitacion/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const invitacion = await getInvitationBySlug(slug);

        if (!invitacion) {
            return res.status(404).json({ error: 'Invitación no encontrada' });
        }

        res.json(invitacion);
    } catch (error) {
        console.error('Error al obtener invitación:', error);
        res.status(500).json({ error: 'Error al obtener la invitación' });
    }
});

// --- RUTA 4: Health Check ---
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Cualquier otra ruta devuelve el index.html de React (para que funcione el router)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Inicializar base de datos y arrancar servidor
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
        console.log(`📁 Directorio de uploads: ${UPLOAD_DIR}`);
    });
}).catch(err => {
    console.error('Error al inicializar la base de datos:', err);
    process.exit(1);
});
