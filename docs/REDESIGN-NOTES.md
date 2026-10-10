# Rediseño — notas de alcance

**Modo:** Rediseño · preservar. **Audiencia:** empleadores y clientes potenciales del portafolio de Emmanuel en Caracas y fuera de Venezuela. **Lectura visual:** portafolio editorial cinético, dirigido por la tipografía y el trabajo real, con la navegación y la voz en español conservadas.

## Preservar

- Marca Aranguibel Studio / Emmanuel Aranguibel González; marca textual AG; personalidad de alto contraste.
- Paleta, fuentes, acentos gráficos y referencias reales de la galería Behance **2026** del owner y de `styles/tokens.css`.
- Secciones, anclas y slugs públicos válidos ya usados en el sitio. Catálogo JSON como modelo editable; las fichas con `published:false` permanecen fuera del HTML y de la navegación.
- Contenido, imágenes auténticas, correo principal ya expuesto por el sitio, Beacons correcto y vínculos Behance verificados.

## Mejorar

- Jerarquía editorial asimétrica y balance entre piezas destacadas y archivo; nueve tarjetas no repetidas visualmente.
- Filtros alimentados por las categorías reales, y páginas de detalle derivadas de los mismos datos fuente.
- Casos con galería auténtica, metadatos completos y solo las secciones documentadas.
- Navegación de móvil, contraste y foco, alt de imágenes, disponibilidad con teclado y preferencias `prefers-reduced-motion`.
- Un visor real y accesible con 16 puntos del recorrido vertical del video de Ana Valdez, con miniaturas, teclado, swipe, progreso y pantalla completa.
- El formulario deja de devolver un éxito simulado; utiliza Netlify Forms, adecuado al dominio de publicación ya existente, con estados propios de vista previa.

## Retirar

- Testimonios de muestra, clientes ficticios, respuestas FAQ/tiempo de atención no verificadas y las categorías sin piezas asociadas.
- Proyectos `published:false`, fotos de proyectos sin confirmar y atribuciones por semejanza visual.
- El endpoint de contacto que solo registraba datos privados en el log y afirmaba enviarlos.
- Paralaje, glitches o efectos que resten legibilidad o comprometan movimiento reducido.

## Contratos protegidos

- `/`, `/proyectos`, `/proyectos/[slug]`, `/servicios`, `/sobre-mi`, `#contacto`, las rutas heredadas de detalle e idioma `es`.
- Los nombres/orden de los campos de contacto: NOMBRE, EMAIL, TIPO DE PROYECTO y MENSAJE.
- Los originales de proyecto no se deforman, recolorean, substituyen por stock ni se atribuyen a otro cliente. Los años desconocidos permanecen vacíos. La propuesta Vintage Creation no se presenta como ganadora.
- No se hace merge a `main`, se desconecta hosting ni se publica en producción durante este trabajo.

## Dirección de diseño

- **Variación visual 7/10:** asimetría editorial limitada por una columna vertebral de grilla común.
- **Intensidad de movimiento 4/10:** feedback y revelaciones breves; nunca necesario para leer ni navegar.
- **Densidad 4/10:** selección de imágenes grande, texto corto y pausas amplias.
- **Dependencia de assets 8/10:** Behance, el Drive del owner y las imágenes del portafolio actual; nada de stock.
- **Fidelidad de marca 9/10:** carbón + verde del 2026, fuentes/tokens del starter y firma AG.

## Riesgo y reversión

Riesgo más alto: compatibilidad al alinear el árbol de datos/rutas con el update de Next.js. Se baja el riesgo manteniendo los slugs, siguiendo el catálogo público y compilando antes de crear un commit. Revertir la rama `ackermaaanlevi99-collab-patch-1` revierte el despliegue de preview sin modificar `main` ni los alojamientos existentes.