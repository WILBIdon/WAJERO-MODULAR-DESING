# WA JERO - Constructor de Invitaciones

Aplicación full-stack para crear invitaciones digitales interactivas y elegantes con React, Node.js, PostgreSQL y almacenamiento persistente de archivos.

## 🏗️ Arquitectura

### Frontend (React)
- **Editor Visual**: Interfaz drag-and-drop para diseñar invitaciones
- **Vista Previa en Tiempo Real**: Simulador de móvil con actualización instantánea
- **Componentes Modulares**: Hero, Música, Galería, RSVP, Ubicación, HTML personalizado

### Backend (Node.js/Express)
- **API REST**: Endpoints para subir archivos y guardar invitaciones
- **Gestión de Archivos**: Multer para procesar uploads con validación de tamaño
- **Servicio Estático**: Sirve el build de React y archivos subidos

### Base de Datos (PostgreSQL)
- **Almacenamiento de Invitaciones**: Guarda configuraciones completas en formato JSON
- **Búsqueda por Slug**: URLs únicas y amigables para cada invitación
- **Persistencia**: Las invitaciones se mantienen permanentemente

### Almacenamiento (Volumen Railway)
- **Archivos Persistentes**: Las imágenes subidas no se borran entre despliegues
- **URLs Públicas**: Cada archivo tiene una URL accesible

## 🚀 Instalación Local

### Prerrequisitos
- Node.js 18+ 
- PostgreSQL (local o Railway)

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:
```env
PORT=3000
DATABASE_URL=postgresql://usuario:password@localhost:5432/wajero
NODE_ENV=development
```

### 3. Desarrollo

**Opción A: Frontend + Backend Juntos**
```bash
# Terminal 1: Iniciar Vite (frontend)
npm run dev

# Terminal 2: Iniciar servidor (backend)
npm run dev:server
```

**Opción B: Solo Backend (con build de producción)**
```bash
npm run build
npm start
```

Abre [http://localhost:3000](http://localhost:3000)

## 📦 Despliegue en Railway

Sigue la guía completa en [RAILWAY_SETUP.md](./RAILWAY_SETUP.md)

**Resumen rápido:**
1. Conecta tu repositorio de GitHub a Railway
2. Agrega PostgreSQL como servicio
3. Crea un volumen montado en `/app/uploads`
4. Railway desplegará automáticamente

## 🎨 Funcionalidades Clave

### Editor Visual
- **Estilos Globales**: Colores primarios/secundarios, fuentes personalizadas
- **Secciones Arrastrables**: Reordena secciones con drag & drop
- **Capas de Diseño**: Fondos, overlays oscuros, decoraciones flotantes (GIFs/PNGs)

### Tipos de Sección
- **Hero**: Portada con parallax, video YouTube embebido
- **Música**: Reproductor de audio con controles
- **Countdown**: Cuenta regresiva al evento
- **Calendario**: Vista mensual con fecha destacada
- **Texto**: Bloques de contenido personalizados
- **Galería**: Grid de imágenes
- **RSVP**: Formulario o botón de WhatsApp
- **Ubicación**: Mapa con botón de navegación
- **HTML**: Contenido personalizado con código

### Sistema de Archivos
- **Validación Automática**: Límite de 3MB por archivo
- **Formatos Soportados**: JPG, PNG, GIF, WebP para imágenes; MP3 para audio
- **Almacenamiento Persistente**: Los archivos se guardan en el volumen de Railway

### Publicación
- **URLs Únicas**: Cada invitación genera un slug único
- **Compartir Fácil**: Copia el enlace y compártelo por WhatsApp, email, etc.
- **100% Responsive**: Optimizado para móviles

## 🛠️ Tecnologías

### Frontend
- React 19
- Tailwind CSS 4
- Lucide React (iconos)
- Vite (build tool)

### Backend
- Express 5
- Multer (file uploads)
- PostgreSQL (pg)
- CORS, dotenv

### Despliegue
- Railway (hosting)
- PostgreSQL (Railway)
- Volumen persistente (Railway)

## 📁 Estructura del Proyecto

```
WA-JERO-MODULAR/
├── src/
│   ├── App.jsx           # Componente principal
│   └── index.css         # Estilos Tailwind
├── server.js             # Servidor Express
├── db.js                 # Módulo de base de datos
├── uploads/              # Archivos subidos (local)
├── .env.example          # Plantilla de variables
├── RAILWAY_SETUP.md      # Guía de despliegue
└── package.json          # Dependencias y scripts
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Inicia Vite (frontend dev)
npm run dev:server   # Inicia servidor Node.js
npm run build        # Build de producción
npm start            # Inicia servidor en producción
npm run preview      # Preview del build
```

## 🐛 Troubleshooting

### Error al subir archivos
- Verifica que el directorio `uploads/` exista
- En Railway, confirma que el volumen esté montado en `/app/uploads`

### Error de conexión a base de datos
- Verifica que `DATABASE_URL` esté configurada correctamente
- En Railway, asegúrate de que PostgreSQL esté activo

### Las imágenes no se muestran
- Verifica que las URLs comiencen con `/uploads/`
- Confirma que el servidor esté sirviendo archivos estáticos

## 📝 Licencia

Este proyecto es de uso privado.

## 🤝 Contribuir

Para contribuir al proyecto, contacta al equipo de desarrollo.
