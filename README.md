# Aranguibel Studio — Sitio Web

Sitio web premium para estudio de diseño gráfico, publicitario, textil y de
visualización 3D. Construido con Next.js 14 (App Router), TypeScript,
TailwindCSS, Framer Motion, GSAP y Lenis.

## Cómo correrlo

Requiere Node.js 18.18+ (recomendado 20+).

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. Este proyecto se generó en un entorno sin acceso
a internet, así que **no se pudo ejecutar `npm install` ni verificar el build
aquí** — el código está escrito y revisado a mano con cuidado, pero corre
`npm run dev` como primer paso para detectar cualquier detalle de versión de
paquete. Si algo falla, es lo primero a mirar.

Para producción:

```bash
npm run build
npm run start
```

Se despliega igual de bien en Vercel, Netlify o cualquier host con soporte
para Next.js.

## Compatibilidad con Claude Code

El proyecto está pensado para seguir trabajándose con Claude Code: estructura
convencional de Next.js, contenido separado del código en `/content`, tipado
en `/types`, y componentes pequeños con una responsabilidad clara. Puedes
abrir esta carpeta con Claude Code y pedirle que continúe cualquier sección.

## Arquitectura

```
/content      → todo el texto, colores e imágenes editables (JSON)
/config       → tema, navegación y config del sitio (TypeScript)
/types        → interfaces TypeScript de cada archivo de contenido
/lib          → utilidades (cn, hook de paralaje GSAP)
/app          → rutas de Next.js (App Router)
  /proyectos/[slug]  → página de detalle de cada proyecto del portfolio
  /api/contact       → endpoint del formulario de contacto
/components
  /layout     → Navbar, Footer, SmoothScroll, Cursor, Transition, Background
  /sections   → Hero, Services, Portfolio, About, Clients, Testimonials, FAQ, Contact
  /ui         → CTA, ServiceCard, ProjectCard, Gallery, AnimatedSection, SectionHeading
/public/images/portfolio → fotos reales de tus proyectos (extraídas de tu PDF de Behance)
```

**Regla de oro:** para cambiar textos, colores, servicios o proyectos, edita
los archivos en `/content`. No deberías necesitar tocar un componente para
actualizar el contenido del sitio.

## Editar contenido

- **Colores** → `content/colors.json`. Cambia cualquier valor y Tailwind lo
  toma automáticamente (requiere reiniciar `npm run dev` porque es config de
  Tailwind, no contenido en caliente).
- **Textos globales, botones, marca** → `content/texts.json`.
- **Hero** → `content/home.json`.
- **Servicios** (agrega los que quieras) → `content/services.json`. El campo
  `icon` acepta cualquier nombre de [Lucide Icons](https://lucide.dev/icons).
- **Portfolio** (agrega proyectos) → `content/portfolio.json`. Cada proyecto
  genera automáticamente su propia página en `/proyectos/[slug]` — no hay que
  crear páginas a mano.
- **Sobre mí** → `content/about.json`.
- **Clientes, testimonios, FAQ, contacto** → sus respectivos archivos.

## Decisiones de diseño (y por qué)

Tu brief pedía dos cosas que tiran en direcciones distintas: tomar los
colores de tu portafolio de Behance (verde neón sobre negro, estética
gamer/pixel-art) y a la vez un resultado "extremadamente limpio" al estilo
Awwwards/Apple/Linear/Stripe. Repetir el verde-neón-sobre-negro tal cual
además es, hoy, uno de los looks más genéricos para sitios "premium"
generados por IA.

En vez de eso, el sistema visual se inspira en tu **oficio real**: producción
de impresión y textil. Colores tipo papel/tinta, un azul de anteproyecto
("blueprint") como color principal, un rojo de marcas de registro de imprenta
como acento, tipografía condensada de señalética (Big Shoulders Display) y
etiquetas monoespaciadas tipo ficha técnica —inspiradas directamente en las
etiquetas con código de barras y "N°UT00X" que se ven en tu propio catálogo—.
Es distinto a tu Behance, pero nace del mismo oficio.

Todo esto vive en `content/colors.json` y `app/layout.tsx` (fuentes) — si
prefieres acercarte más a tu paleta verde/negro original, es cuestión de
cambiar esos valores, no de tocar componentes.

## Imágenes

Las fotos de portfolio en `/public/images/portfolio` son reales, extraídas de
tu PDF (Utopía Group, Tu Sitio Waraira, Billy Burger's, la visualización 3D
del restaurante). El fondo del Hero y los paneles decorativos son generados
por código (grid tipo plano + grano de papel) para no depender de imágenes
externas — puedes cambiar `content/home.json → hero.background.type` a
`"image"` o `"video"` y pasarle un archivo tuyo; `Background.tsx` ya soporta
ambos casos.

## Pendientes antes de producción

- **Verifica el correo** en `content/contact.json` — se transcribió desde una
  fuente estilizada (mayúsculas/minúsculas alternadas) y conviene confirmarlo.
- **Reemplaza los testimonios** en `content/testimonials.json` — están
  marcados como placeholder a propósito; no se inventaron citas atribuidas a
  clientes reales.
- **Conecta un proveedor de email real** en `app/api/contact/route.ts` (hay
  un ejemplo comentado con Resend). Ahora mismo el formulario valida y
  responde bien, pero solo deja el mensaje en el log del servidor.
- **Agrega tus redes sociales** (Instagram, LinkedIn, etc.) en
  `content/contact.json` y `config/navigation.ts` si quieres mostrarlas.
- Sustituye `NEXT_PUBLIC_SITE_URL` en `.env.local` por tu dominio real antes
  de desplegar (afecta sitemap, robots.txt y metadatos Open Graph).

## Stack técnico

Next.js 14 (App Router) · React 18 · TypeScript · TailwindCSS 3.4 ·
Framer Motion (todas las animaciones discretas) · GSAP + ScrollTrigger (solo
el paralaje del Hero) · Lenis (scroll suave) · Lucide Icons + React Icons.
