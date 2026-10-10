# ARANGUIBEL STUDIO — Portfolio de Emmanuel Aranguibel González
Eres Art Director + Creative Developer. Construye un portfolio **funcional** (no mockup) alrededor de proyectos REALES.

## Reglas absolutas
- NO inventar proyectos, clientes, fechas, premios, testimonios, métricas, herramientas ni descripciones. Si falta información: omitir la sección o dejarla oculta (`published:false`). Nada de lorem ipsum ni placeholders visibles.
- Usar imágenes reales (`public/assets/projects/*`). Sin stock. No deformar ni recolorear marcas.
- No copiar Behance ni el video de referencia: son fuentes, la identidad es propia.
- No afirmar que el concurso Vintage Creation fue ganado. No mostrar teléfonos/IG de terceros que aparezcan en mockups.
- Eliminar del sitio actual: testimonios placeholder y FAQ sin respuestas. `og:url` debe ser el dominio real.

## Antes de programar
1. Inspecciona el repo existente (stack actual: Next.js; **no cambiar de stack** sin razón técnica) y las herramientas/skills/MCP disponibles. No declares usar herramientas que no existan.
2. Lee `content/site.json`, `content/services.json`, `content/projects/*.json`, `docs/*` y `styles/tokens.css`.
3. Resuelve o respeta `docs/OPEN-QUESTIONS.md`. Proyectos con `published:false` NO se renderizan.

## Arquitectura
- Datos en `content/` (ya creados). Componentes leen JSON; añadir un proyecto no debe tocar la UI.
- Rutas: `/`, `/proyectos`, `/proyectos/[slug]`, `/servicios`, `/sobre-mi`, `#contacto`. Slugs: ana-valdez, kalhua, usb, portfolio-2026, vintage-creation, utopia, tu-sitio-waraira, billy-burgers, visualizacion-3d.
- Servicios enlazan a proyectos que los demuestran. Servicio sin proyecto = oculto.
- Jerarquía: Featured / Projects / Archive. Selected Work editorial con tamaños variables (nada de 9 tarjetas idénticas). Filtros reales: TODOS, BRANDING, TEXTIL, PUBLICIDAD, 3D, ILUSTRACIÓN, EXPERIMENTAL (ocultar los vacíos).
- Case study: Cover → Contexto → Proceso → Sistema visual → Aplicaciones → Galería → Información → VER EN BEHANCE → Anterior / Todos / Siguiente. Omite secciones sin datos.
- **Ana Valdez** (`experience:"scenes-16"`): visor HTML 01/16–16/16 con teclado, swipe, thumbnails, progress bar, fullscreen. SOLO cuando exista el PDF/video; mientras tanto, case study normal.
- **USB/Utopía:** narrativa DISEÑO DIGITAL → PRENDA → PRODUCCIÓN → RESULTADO (hay fotos reales de producción en INNOVA3DLABS/Órbita si se confirman).
- Formulario: NOMBRE, EMAIL, TIPO DE PROYECTO, MENSAJE, ENVIAR PROYECTO. Con servicio real de envío; sin éxito falso.

## Diseño y motion
Sigue `docs/DESIGN-SYSTEM.md` y `styles/tokens.css` (sin valores sueltos). Solo transform/opacity, `prefers-reduced-motion`, cursor custom solo desktop, glitch mínimo. Móvil diseñado aparte (375, 390, 768, 1024, 1440, 1920).

## Rendimiento y SEO
WebP/AVIF, lazy loading, galerías bajo demanda, videos con `scripts/optimize-media.sh`. Metadata (title/description del `site.json`), Open Graph, sitemap, robots, metadata por proyecto.

## Verificación obligatoria
Ejecuta el sitio, captura pantallas en los 6 anchos, revisa overflow, crops, contraste, foco, consola, enlaces e imágenes, filtros, formulario y ausencia de placeholders. Itera hasta que se vea como portfolio hecho a mano. Genera `docs/TOOLING-REPORT.md` solo con herramientas realmente usadas.
