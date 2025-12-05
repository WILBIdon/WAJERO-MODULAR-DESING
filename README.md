# WA JERO - Constructor de Invitaciones

Esta aplicación es un constructor visual de invitaciones desarrollado en React, diseñado para crear tarjetas digitales interactivas y elegantes.

## Resumen del Funcionamiento

### 1. Arquitectura de Componentes

*   **App (Principal):** Gestiona todo el estado de la aplicación.
*   **Configuración Global:** Almacena colores primarios/secundarios, fuentes y música de fondo.
*   **Sistema de Secciones:** La tarjeta se divide en módulos independientes (Hero, Música, Texto, Galería, RSVP, Mapa, HTML). Cada módulo tiene su propio id, tipo y datos.
*   **Renderizado Dinámico:**
    *   **Editor (Izquierda):** Renderiza controles (inputs, selectores, subida de archivos) para cada sección. Permite arrastrar y soltar (Drag & Drop) para reordenar.
    *   **Vista Previa (Derecha):** Renderiza el resultado final en tiempo real dentro de un marco que simula un teléfono móvil.

### 2. Funcionalidades Clave

*   **FileUploader Inteligente:** Convierte imágenes y audio a formato base64 para que funcionen inmediatamente sin necesidad de un backend complejo para la previsualización. Incluye validación de peso (máx 2MB) para optimización móvil.
*   **Parallax y Decoración:** La sección Hero utiliza CSS `bg-fixed` para el efecto parallax. Todas las secciones permiten una capa superior (`overlayImage`) para GIFs o PNGs decorativos (brillos, hojas, etc.).
*   **Video Embed:** Detecta automáticamente enlaces de YouTube y los convierte en iframes incrustados.
*   **Publicación Simulada:** Genera un "slug" único basado en los nombres de la invitación y muestra un modal de éxito con el enlace final.

### 3. Aspectos Técnicos

*   Utiliza el hook `useState` para mantener un objeto gigante de configuración (`config`).
*   Cada vez que editas un campo, se actualiza ese objeto y React vuelve a pintar la vista previa instantáneamente.
*   Para los estilos, utiliza **Tailwind CSS**, lo que permite que el diseño sea responsivo y moderno con poco código CSS personalizado.
*   Utiliza la librería **Lucide React** para todos los iconos de la interfaz.

## Instalación y Uso

1.  Instalar dependencias:
    ```bash
    npm install
    ```

2.  Iniciar el servidor de desarrollo:
    ```bash
    npm run dev
    ```

3.  Construir para producción:
    ```bash
    npm run build
    ```
