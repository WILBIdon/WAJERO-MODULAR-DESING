# Guía de Configuración en Railway

Esta guía te ayudará a configurar tu aplicación WA JERO en Railway con PostgreSQL y almacenamiento persistente de archivos.

## Prerrequisitos

- Cuenta en [Railway](https://railway.app/)
- Repositorio de GitHub con el código actualizado
- Proyecto ya creado en Railway

## Paso 1: Agregar PostgreSQL

1. **Abrir tu proyecto en Railway**
   - Ve a [railway.app](https://railway.app/) e inicia sesión
   - Selecciona tu proyecto WA JERO

2. **Agregar base de datos**
   - Haz clic en el botón **"+ New"**
   - Selecciona **"Database"**
   - Elige **"PostgreSQL"**
   - Railway creará automáticamente la base de datos

3. **Verificar variables de entorno**
   - Railway inyectará automáticamente la variable `DATABASE_URL` en tu servicio principal
   - No necesitas configurar nada manualmente

## Paso 2: Crear y Montar el Volumen

El volumen es crucial para que las imágenes subidas no se borren con cada despliegue.

1. **Ir a tu servicio principal**
   - Haz clic en el servicio de tu aplicación (no en PostgreSQL)

2. **Crear volumen**
   - Ve a la pestaña **"Volumes"** o **"Storage"**
   - Haz clic en **"+ New Volume"**
   - Configura el volumen:
     - **Name**: `uploads` (o el nombre que prefieras)
     - **Mount Path**: `/app/uploads` ⚠️ **IMPORTANTE: Debe ser exactamente esta ruta**
     - **Size**: 1GB es suficiente para empezar (puedes aumentarlo después)

3. **Guardar**
   - Haz clic en **"Add"** o **"Create"**
   - Railway reiniciará tu servicio automáticamente

## Paso 3: Verificar Variables de Entorno

Railway configura automáticamente estas variables:

| Variable | Descripción | Configuración |
|----------|-------------|---------------|
| `PORT` | Puerto del servidor | ✅ Automático |
| `DATABASE_URL` | Conexión a PostgreSQL | ✅ Automático |
| `RAILWAY_VOLUME_MOUNT_PATH` | Ruta del volumen | ✅ Automático |
| `NODE_ENV` | Entorno de ejecución | ⚙️ Opcional: `production` |

Para verificar:
1. Ve a la pestaña **"Variables"** de tu servicio
2. Deberías ver `DATABASE_URL` y otras variables de Railway
3. Si quieres, puedes agregar `NODE_ENV=production` manualmente

## Paso 4: Configurar Build y Start

Railway debería detectar automáticamente tu `package.json`, pero verifica:

1. **Build Command**: `npm run build`
2. **Start Command**: `npm start`

Para verificar/cambiar:
1. Ve a **"Settings"** de tu servicio
2. Busca la sección **"Build & Deploy"**
3. Verifica que los comandos sean correctos

## Paso 5: Desplegar

1. **Hacer push de los cambios**
   ```bash
   git add .
   git commit -m "Implementar backend con PostgreSQL y file upload"
   git push
   ```

2. **Railway desplegará automáticamente**
   - Ve a la pestaña **"Deployments"**
   - Verás el progreso del despliegue en tiempo real
   - Espera a que el estado sea **"Success"** ✅

3. **Obtener la URL**
   - Ve a **"Settings"** → **"Domains"**
   - Railway te dará una URL como: `https://tu-app.up.railway.app`
   - También puedes configurar un dominio personalizado

## Paso 6: Verificar que Todo Funciona

### Probar Subida de Archivos
1. Abre tu aplicación en la URL de Railway
2. Intenta subir una imagen en cualquier sección
3. Verifica que se muestre correctamente en la vista previa

### Probar Guardar Invitación
1. Crea una invitación completa
2. Haz clic en **"Publicar"**
3. Deberías recibir una URL única
4. Abre esa URL en una nueva pestaña
5. Verifica que la invitación se cargue correctamente

### Verificar Base de Datos
1. En Railway, haz clic en tu servicio de PostgreSQL
2. Ve a la pestaña **"Data"**
3. Deberías ver la tabla `invitaciones` creada automáticamente
4. Después de publicar, verás registros en esa tabla

### Verificar Volumen
1. Ve a tu servicio principal → **"Volumes"**
2. Verás el uso del disco aumentar cuando subas imágenes
3. Las imágenes persistirán entre despliegues

## Troubleshooting

### Error: "Cannot connect to database"
- **Solución**: Verifica que PostgreSQL esté corriendo
- Ve a tu servicio de PostgreSQL y asegúrate de que esté activo

### Error: "No such file or directory: /app/uploads"
- **Solución**: Verifica que el volumen esté montado en `/app/uploads`
- Ve a Volumes y confirma el Mount Path

### Las imágenes desaparecen después de redesplegar
- **Solución**: No configuraste el volumen correctamente
- Asegúrate de que el volumen esté montado en `/app/uploads`

### Error 500 al publicar
- **Solución**: Revisa los logs
- Ve a **"Deployments"** → Selecciona el último despliegue → **"View Logs"**
- Busca errores relacionados con la base de datos

### La aplicación no inicia
- **Solución**: Verifica los comandos de build y start
- Asegúrate de que `npm start` ejecute `node server.js`
- Revisa los logs para ver el error específico

## Comandos Útiles

### Ver logs en tiempo real
```bash
# En la pestaña Deployments → View Logs
```

### Conectarse a PostgreSQL localmente (opcional)
```bash
# Copia la DATABASE_URL de Railway
psql "postgresql://usuario:password@host:puerto/database"
```

### Verificar que el servidor está corriendo
```bash
# Abre en el navegador:
https://tu-app.up.railway.app/api/health
# Deberías ver: {"status":"ok","timestamp":"..."}
```

## Próximos Pasos

✅ **Configuración completada**

Ahora puedes:
- Crear invitaciones con imágenes reales
- Compartir URLs únicas con tus clientes
- Las invitaciones se guardarán permanentemente
- Las imágenes persistirán entre despliegues

### Mejoras Futuras (Opcional)
- Configurar dominio personalizado
- Agregar autenticación para panel de admin
- Implementar analytics para ver visitas
- Agregar CDN para imágenes más rápidas
