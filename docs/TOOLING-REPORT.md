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
- En el barrido automatizado multi-ruta se observó un error de hidratación React `#418` en ANA a 1440 px tras cambiar varios viewports. No se reprodujo en cargas directas limpias de móvil/escritorio, en desarrollo ni al navegar al caso mediante enlace; se documenta para una comprobación independiente posterior, sin atribuirlo a una causa que no se pudo confirmar.
- El preview es temporal y no equivale a un despliegue de producción. Los pasos de Netlify pendientes están registrados en `docs/OPEN-QUESTIONS.md`.
