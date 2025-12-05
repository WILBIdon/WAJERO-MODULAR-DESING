# 🚀 Instrucciones para Subir a GitHub

## Paso 1: Genera tu Token de GitHub

1. Abre esta URL en tu navegador:
   ```
   https://github.com/settings/tokens/new
   ```

2. Inicia sesión si te lo pide

3. Llena el formulario:
   - **Note:** `WA JERO Deploy`
   - **Expiration:** 90 days
   - **Marca SOLO:** ✅ `repo` (Full control of private repositories)

4. Click en **"Generate token"** (botón verde)

5. **COPIA EL TOKEN** (empieza con `ghp_...`)

## Paso 2: Sube el código a GitHub

Ejecuta este comando en la terminal:

```bash
git push -u origin main
```

Cuando te pida credenciales:
- **Username:** WILBIdon
- **Password:** PEGA_EL_TOKEN_AQUÍ (no tu contraseña de GitHub)

## ✅ Listo

Una vez subido, ve a Railway y conecta el repositorio:
https://railway.app/new
