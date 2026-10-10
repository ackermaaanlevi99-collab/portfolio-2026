# Design system v1 (dirección A: editorial oscuro, acento pixel/verde)
Valores en `styles/tokens.css`. Verde medido de frames del video de referencia (≈#4BFF2E–#53DD42, aproximado por compresión).
- **Tipografía:** Space Grotesk (titulares), Inter (texto), JetBrains Mono (metadatos: REF.01, CASE 01, 2026), Silkscreen solo etiquetas cortas. Fuentes OFL, autohospedadas en WOFF2.
- **Color:** negro casi puro, grises cálidos, verde solo para estados activos, líneas finas, índices y pequeños acentos. Azul `--link` opcional.
- **Grid:** 4/8/12 columnas (mobile/tablet/desktop), contenedor 1440, fondo a sangre.
- **Cada proyecto conserva su identidad:** el case study puede redefinir `--accent`, fondo y tipografía local (Kalhua retro-cartoon, Ana Valdez propio, 3D más sobrio). No aplicar un filtro uniforme.
- **Movimiento:** solo `transform` y `opacity`; reveal, clip-path en imágenes, hover sutil, transición thumbnail→case study; glitch solo en hover del logo. `prefers-reduced-motion` obligatorio. Cursor custom solo desktop.
- **Pixel/personaje:** acento en About y microinteracciones; no protagonista del Hero.
