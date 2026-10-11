# Informe de fuentes, versiones y herramientas

## Fuentes de diseño y contenido

- Sitio publicado inspeccionado: https://emmanuelaranguibelgraphicdesigner.netlify.app/
- ANA VALDEZ, Behance: https://www.behance.net/gallery/254711301/ANA-VALDEZ-BRANDING
- 2026, Behance: https://www.behance.net/gallery/243101687/2026
- KALHUA — BRANDING, Behance: https://www.behance.net/gallery/253994745/KALHUA-BRANDING
- Diseño de prendas para la USB, Behance: https://www.behance.net/gallery/249460231/Diseno-de-prendas-para-la-USB
- IV Concurso Vintage Creation, Behance: https://www.behance.net/gallery/249232167/IV-Concurso-Vintage-Creation
- Recursos del proyecto: starter ZIP adjunto, imágenes existentes de `public/images/portfolio`, video ANA VALDEZ compartido en Drive y módulos visuales originales de Behance. Este documento omite los IDs y enlaces privados de Drive.

## Verificación de Next.js

La dependencia se fijó en `next@15.5.27`, release estable verificada en la rama 15; React/React DOM se conservan según el lockfile. Fuentes oficiales consultadas:

- https://github.com/vercel/next.js/releases/tag/v15.5.27
- https://vercel.com/changelog/next-js-may-2026-security-release
- https://nextjs.org/blog/security-update-2025-12-11

## Herramientas y pruebas

- `node scripts/build-project-index.mjs`: pasó; genera **9 proyectos publicados** y excluye **5 sin confirmar**. También valida que las rutas de medios locales existan y elimina notas/estado interno del JSON del catálogo.
- `npm run lint`: ESLint CLI pasó sin warnings ni errores.
- `npm run typecheck`: `tsc --noEmit` pasó.
- Build de producción final con Next.js 15.5.27: pasó; generó **26 páginas estáticas** después de agregar las rutas propias de servicios y perfil.
- Formulario: validación cliente nativa (`required`, tipo email, límites) y honeypot. No se envió ningún dato durante QA; la recepción real debe comprobarse en Netlify.

## Hosting y revisión

El rediseño se trabajó sobre la rama del PR indicada. No se hizo merge ni se publicó el dominio canónico de producción. La consulta de solo lectura a Netlify respondió HTTP 401; no se modificó el hosting ni sus ajustes. Netlify sigue siendo el destino recomendado para conservar el dominio vigente y procesar el formulario.

## Revisión visual y responsive final

- Capturas de portada a **375×812, 390×844, 768×1024, 1024×768, 1440×900 y 1920×1080**. Se conservaron la jerarquía tipográfica y la identidad editorial; los filtros funcionan con desplazamiento horizontal en móvil y el contenedor sigue acotado en 1920 px.
- `/proyectos` se capturó en móvil y escritorio; ANA VALDEZ en 375 y 1440 px; USB, Utopía y el caso textil USB a 375 px; Utopía también a 1440 px; Servicios y Sobre mí en móvil. Se revisaron crops, imágenes visibles y etapas documentadas.
- El caso ANA mantiene el visor de **16 escenas** extraídas del video fuente del propietario. Se probaron controles de teclado, gesto táctil, miniaturas, barra de progreso, pantalla completa y salida; el visor conserva su alternativa de contenido sin movimiento.
- Comprobadas localmente y en el preview temporal las páginas `/`, `/proyectos`, `/servicios`, `/sobre-mi`, `/gracias`, `/robots.txt`, `/sitemap.xml`, nueve slugs canónicos y once alias heredados. Las páginas respondieron HTTP 200. `manus-routes.json` coincide con las páginas implementadas; el preview entrega `lang="es"` y directivas `noindex`/`Disallow: /`.
- QA de interacción: filtros de proyectos, navegación móvil y cierre con Escape, validación del formulario sin envío, foco visible, preferencia `prefers-reduced-motion`, avance de escenas y pantalla completa respondieron como se esperaba.
- Lighthouse Accessibility: **100/100** en inicio y en ANA VALDEZ después de alinear el nombre accesible del enlace con su texto visible; la auditoría final de ANA no reportó comprobaciones fallidas.
- Se encontró y solucionó un retraso de render en la conversión Next Image de un WebP local. Las 45 imágenes del catálogo son WebP precomprimidos (3.4 MiB en conjunto); `images.unoptimized` sirve los archivos optimizados propios directamente y se volvieron a revisar Utopía a 375/1440 px.
- El primer barrido automatizado observó React `#418` después de activar movimiento reducido. Se aisló con targets Chromium independientes y se confirmó que ocurría en `/` y `/proyectos/ana-valdez` sólo con `prefers-reduced-motion: reduce`; las cargas `no-preference` no fallaban. La matriz CDP registra las excepciones por contexto de ejecución y frame, no mediante una variable global de ruta.
- El preview es temporal y no equivale a un despliegue de producción. Los pasos de Netlify pendientes están registrados en `docs/OPEN-QUESTIONS.md`.


## Cierre de la experiencia 3D y performance responsive

- `npm run lint`, `npm run typecheck`, `npm audit --omit=dev --audit-level=low` y `npm run build`: pasaron; la auditoría de producción encontró **0 vulnerabilidades** y Next generó **26 páginas**.
- Lighthouse mobile final: **Performance 94/100**, **Accessibility 100/100**, FCP **1,1 s**, LCP **3,1 s**, TBT **60 ms**, CLS **0**. Las tarjetas de portada se cargan de forma diferida; la primera del archivo `/proyectos` conserva prioridad. Los thumbnails `contain` usan tamaños responsive según el área realmente ocupada.
- Las comprobaciones de **18 combinaciones** de rutas y viewport no detectaron overflow horizontal, imágenes rotas ni texto placeholder. Se verificaron navegación, filtros, validación nativa del formulario sin enviarlo, controles de 16 escenas, fullscreen/Escape y gesto táctil.
- El portal 3D queda activo por defecto en escritorio amplio con puntero fino. Móvil/táctil y movimiento reducido mantienen inicialmente el arte original; activar movimiento en móvil es optativo. La prueba de red confirmó que los dos chunks pesados del módulo Three.js no se descargan en móvil hasta la activación; en escritorio el canvas llega a estado `ready`.
- Causa raíz confirmada: `components/layout/Transition.tsx` devolvía un fragmento cuando `useReducedMotion()` era verdadero durante el render, mientras que el SSR no conoce esa preferencia y producía el wrapper de Framer Motion; por eso difería el árbol inicial. El render ahora conserva la misma estructura hasta hidratarse y sólo después desactiva la transición. Antes del fix, la matriz en producción produjo `#418` en `/` y ANA bajo `reduce`; después, las cuatro combinaciones ruta/preferencia no generaron excepciones. El recorrido automatizado completo comprobó **18 viewports/rutas**, `routes: true` y **0 browser issues**, incluidos los pasos de movimiento reducido.
- No hubo envío real del formulario, merge a `main` ni publicación a Netlify. El endpoint de lectura de Netlify continúa respondiendo 401; el usuario autorizó el push del commit a la rama `ackermaaanlevi99-collab-patch-1` solamente. El preview temporal de esta sesión no es el dominio público de producción.
