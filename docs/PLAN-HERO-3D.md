# Plan de implementación — experiencia 3D del hero

## Lectura del producto
- **Artefacto y audiencia:** hero de un portafolio editorial para clientes, equipos creativos y empleadores que quieren evaluar trabajo real de Emmanuel Aranguibel González.
- **Modo:** rediseño-preservación. Esta es una capa visual nueva y acotada, no una sustitución de la identidad o del sitio.
- **Lenguaje visual:** retro-tech editorial ya presente en Portafolio 2026: carbón, verde ácido `#4BFF2E`, tipografía expresiva, tramas pixeladas y trabajo 3D publicado.
- **Restricciones:** portada en español; conservar navegación, proyectos, contacto y accesibilidad; no crear contenido, marcas, avatar ni piezas de trabajo ficticias; la escena no puede impedir leer o navegar.
- **Diales de diseño:** variación 5/10 (un foco asimétrico en el hero); movimiento 6/10 (movimiento contenido y reducible); densidad 4/10; dependencia de assets 8/10 (se conserva arte original); fidelidad de marca 10/10.

## Qué muestran las fuentes
- El video original `tmp-source/portafolio-2026-reference.mp4` se analizó directamente. Es una grabación vertical de pantalla de Behance, no un video de motion graphics: la cámara física no realiza recorridos de producto y no se observa transformación animada sostenida de un objeto 3D. La acción de movimiento es principalmente desplazamiento manual por las páginas. El contenido sí incluye letras volumétricas verde/negro, un avatar pixelado existente, composiciones por capas, mockups de prendas, bordados y renders 3D de Billy's Burgers.
- Las piezas originales locales `public/assets/projects/portfolio-2026/cover.webp`, `gallery-01.webp` y `gallery-02.webp` confirman el lenguaje publicado: tipografía de bloque con profundidad, verde eléctrico y un portal/vórtice circular; el personaje pertenece a esas piezas y **no** se reproducirá ni reinterpretará como un avatar nuevo.
- `docs/DESIGN-SYSTEM.md` y `styles/tokens.css` confirman Space Grotesk, Inter, JetBrains Mono, Silkscreen para etiquetas puntuales y el acento `#4BFF2E`. Se conservan esos tokens, la jerarquía de nombre existente y la portada original del proyecto 2026.
- La URL de referencia `https://kexio.com` actualmente sirve una página de venta de dominio, no un sitio de estudio visible. No hay una implementación activa que se pueda auditar; no se copiará ni se atribuirá estética a Kexio.
- La fuente oficial de npm lista `three@0.186.1` y tipos separados `@types/three@0.186.0`. Three.js se elige sobre React Three Fiber: una sola escena pequeña tiene un ciclo de vida simple y no necesita otra capa de reconciliación.

## Sistema visual y estructura de la escena
- **Pieza central:** portal/vórtice volumétrico original construido con geometría Three.js (anillos con profundidad, centro oscuro y pequeños cubos voxel orbitando). Cita el portal y la tipografía de bloque del proyecto fuente; no calca ni reusa la geometría/personaje de otra obra.
- **Composición:** una columna visual compacta en el hero, separada de la tipografía de identidad. El H1 «Emmanuel Aranguibel González», ubicación, años de experiencia, CTAs y enlace al proyecto 2026 mantienen jerarquía y legibilidad. La imagen real de proyecto sigue disponible como caso y fallback, no se tapa ni se sustituye.
- **Color/material:** fondo `#0A0A0A`, sombra `#111311`, superficies carbón, verde `#4BFF2E` en el borde luminoso y reflejos puntuales; nada de degradados/colores de otra marca.
- **Tipografía/voz:** no se altera el sistema existente: Space Grotesk para titulares, Inter para lectura, JetBrains Mono para datos, Silkscreen solo para rótulos muy cortos. Microcopy funcional en español.
- **Interacción:** una respuesta suave al puntero y al scroll, sin desplazar contenido, con botón accesible para pausar/reanudar el movimiento; en pantallas táctiles el scroll vertical sigue siendo nativo.

## Implementación y fallback
1. Añadir `three` y `@types/three` con versiones fijas compatibles entre sí.
2. Crear una isla cliente pequeña y cargar el módulo de Three.js cuando la escena se acerque al viewport; mantener texto y enlaces en HTML normal. En escritorio ancho con puntero no táctil y movimiento permitido, animar automáticamente; en pantallas táctiles, móvil y `prefers-reduced-motion`, conservar el arte estático y no inicializar WebGL hasta una activación expresa.
3. Limitar el render a una relación de píxeles moderada (máximo 1× en móvil y 1.35× en escritorio), hasta 30 fps en móvil y 60 fps en escritorio, con geometría ligera; pausar fuera del viewport o al ocultarse el documento; detener el bucle, desconectar observers/listeners y liberar geometrías, materiales y renderer al desmontar.
4. Respetar `prefers-reduced-motion`: mostrar el arte original estático, sin animación ni WebGL, y permitir activar la experiencia dinámica solo mediante el control explícito de movimiento.
5. Si WebGL falta, falla o pierde el contexto, mantener la imagen original, el enlace al caso y todo el contenido textual/funcional. El canvas es decorativo, `aria-hidden`, y nunca es el único portador de información.
6. Verificar producción/lint, rutas existentes, seis anchos representativos, estados normales y de movimiento reducido, activación del WebGL, fallback, foco/teclado y performance. El usuario autorizó el push únicamente a `ackermaaanlevi99-collab-patch-1`; no se hará merge a `main` ni deploy a Netlify en producción.

## Preservación y riesgo
- **Preservar:** identidad oscura/verde, portada y casos fuente, idiomas, navegación, rutas, contacto, SEO, formulario, menú accesible, reduced-motion y estado de rama.
- **Mejorar:** jerarquía del hero mediante profundidad 3D y una narrativa visual vinculada al proyecto 2026; mantenerlo sin tapar las llamadas a acción.
- **Eliminar:** nada de clientes, métricas, reseñas, contenido, personaje o historia añadidos por la escena.
- **Contrato protegido:** no cambiar URLs, slugs, anchors, etiquetas principales, campos ni envío del formulario, contactos, paleta oficial o destino de despliegue.
- **Riesgo principal:** disponibilidad/rendimiento de WebGL en móviles. Mitigación: carga diferida, render barato, detención al salir de pantalla y fallback con el arte real.
- **Rollback:** el hero existente y su imagen de proyecto permanecen; se puede quitar el componente 3D y sus dependencias sin tocar contenido ni navegación.

## Fuentes consultadas
- Video fuente proporcionado por el usuario en Drive, copia local: `tmp-source/portafolio-2026-reference.mp4` (análisis visual directo; no se infieren hechos personales a partir del clip).
- [Portafolio 2026 en Behance](https://www.behance.net/gallery/243101687/2026)
- [Documentación oficial de WebGLRenderer — Three.js](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
- [Paquete three en npm](https://www.npmjs.com/package/three)
- [Tipos @types/three en npm](https://www.npmjs.com/package/@types/three)
- [Referencia Kexio proporcionada](https://kexio.com) (página actual de venta del dominio; no es una referencia visual activa).
