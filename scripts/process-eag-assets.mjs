// Procesa los materiales de la carpeta de Drive "EAG" a formatos web.
// - Imágenes fijas -> WebP (borde máximo 1800 px).
// - GIF -> WebP animado (ancho máximo 720 px) para la galería de movimiento.
// - Asigna cada archivo a su destino y escribe content/eag-assets.json.
// Uso: node scripts/process-eag-assets.mjs [carpeta_origen]
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SRC = process.argv[2] ?? '/home/user/google_drive';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PUBLIC = path.join(ROOT, 'public', 'assets');

// Destino explícito: nada se asigna por suposición.
// project: carpeta de public/assets/projects/<slug>/ con gallery-NN.webp
// motion: archivo sin proyecto asignado, va a public/assets/eag/motion
const STILLS = [
  // ANA VALDEZ (carpeta ANA del Drive)
  ...['ANA 9_16-01.jpg', 'ANA 9_16-02.jpg', 'ANA 9_16-03.jpg', 'ANA 9_16-04.jpg', 'ANA 9_16-05.jpg', 'ANA 9_16-06.jpg']
    .map((f, i) => ({ src: f, project: 'ana-valdez', alt: `Imagen ${i + 1} del proyecto ANA VALDEZ — BRANDING, formato 9:16.` })),
  ...Array.from({ length: 11 }, (_, i) => ({
    src: `ANA VALDEZ-${String(i + 1).padStart(2, '0')}.png`,
    project: 'ana-valdez',
    alt: `Pieza ${i + 1} del proyecto ANA VALDEZ — BRANDING.`,
  })),
  // USB (carpeta USB del Drive)
  ...[
    'Sin título-1_Mesa de trabajo 1.png',
    'Sin título-1_Mesa de trabajo 1 copia.png',
    'Sin título-1_Mesa de trabajo 1 copia 2.png',
    'Sin título-1_Mesa de trabajo 1 copia 3.png',
    'Sin título-1_Mesa de trabajo 1 copia 4.png',
    'Sin título-1_Mesa de trabajo 1 copia 5.png',
    'Sin título-1_Mesa de trabajo 1 copia 6.png',
    'Sin título-1_Mesa de trabajo 1 copia 7.png',
  ].map((f, i) => ({ src: f, project: 'usb', alt: `Pieza ${i + 1} del proyecto de prendas para la USB.` })),
  // Montajes de portafolio (carpeta raíz EAG)
  ...['PORTAFOLO MNTAJE ARMADO 2-02-02.png', 'PORTAFOLO MNTAJE ARMADO 2-05.png', 'PORTAFOLO MNTAJE ARMADO 2-06.png',
    'PORTAFOLO MNTAJE ARMADO 2-07.png', 'PORTAFOLO MNTAJE ARMADO 2-09.png']
    .map((f, i) => ({ src: f, project: 'portfolio-2026', alt: `Montaje ${i + 1} del portafolio 2026, presentación de piezas.` })),
  { src: 'UOPIA PORTAFOLIO MONTAJE-01.png', project: 'utopia', alt: 'Montaje del proyecto Utopía Group: presentación de prendas.' },
  // Sin proyecto asignado: se guarda como imagen de archivo.
  { src: 'Image_to_cinematic_composition_2K_202607040005.jpeg', project: null, name: 'composicion-cinematica', alt: 'Composición cinematográfica del archivo 2026.' },
];

const MOTION = [
  'GIFF--DISEÑador.gif', 'QUIVE-Recuperado (1).gif', 'QUIVE-Recuperado.gif', 'CESSNA-GIF.gif', 'PUBLICIDAD.gif',
  'GID-3D.gif', 'SUBLIMATION-GIF.gif', 'BORDADO-GIF.gif', 'GIFF--DISEÑO-PUBLICITARIO.gif', 'STATS-GIF1.gif',
  'TEXTILE-DESING.gif', '3DDDD.gif', 'SERVICIOS-ULTIMOO.gif', 'star.gif', 'SERVICIOS-GIF.gif',
  '168f90243101687.697bad932ef12.gif',
];
// PUBLICIDAD (1).gif es byte a byte igual a PUBLICIDAD.gif (md5 verificado); no se duplica.
const SKIPPED = [{ src: 'PUBLICIDAD (1).gif', reason: 'idéntico byte a byte a PUBLICIDAD.gif' }];

const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Imágenes de galería que ya existen en el proyecto; las nuevas empiezan después.
const EXISTING = { 'ana-valdez': 0, usb: 2, utopia: 1, 'portfolio-2026': 2 };
const existingCount = (project) => EXISTING[project] ?? 0;

const manifest = { generatedFrom: 'Drive carpeta EAG', stills: [], motion: [], skipped: SKIPPED, projectsGallery: {} };

// Imágenes fijas
for (const item of STILLS) {
  const input = path.join(SRC, item.src);
  const base = item.name ?? slug(path.parse(item.src).name);
  let outDir;
  let outName;
  if (item.project) {
    outDir = path.join(PUBLIC, 'projects', item.project);
    const list = manifest.projectsGallery[item.project] ?? (manifest.projectsGallery[item.project] = []);
    outName = `gallery-${String(list.length + 1 + existingCount(item.project)).padStart(2, '0')}.webp`;
    list.push({ src: `/assets/projects/${item.project}/${outName}`, alt: item.alt });
  } else {
    outDir = path.join(PUBLIC, 'eag', 'stills');
    outName = `${base}.webp`;
  }
  await mkdir(outDir, { recursive: true });
  const out = path.join(outDir, outName);
  const info = await sharp(input, { limitInputPixels: false })
    .rotate()
    .resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(out);
  manifest.stills.push({ source: item.src, output: path.relative(ROOT, out), width: info.width, height: info.height, bytes: info.size, project: item.project ?? null });
}

// GIF animados
const motionDir = path.join(PUBLIC, 'eag', 'motion');
await mkdir(motionDir, { recursive: true });
for (const file of MOTION) {
  const input = path.join(SRC, file);
  const out = path.join(motionDir, `${slug(path.parse(file).name)}.webp`);
  const meta = await sharp(input, { animated: true, limitInputPixels: false }).metadata();
  const frameHeight = meta.pageHeight ?? meta.height;
  const pages = meta.pages ?? 1;
  // Ancho máximo 720 px. Los GIF de tira muy alta (muchos cuadros) se reducen igual.
  const info = await sharp(input, { animated: true, limitInputPixels: false })
    .resize({ width: 720, withoutEnlargement: true })
    .webp({ quality: 58, effort: 4, loop: 0, delay: meta.delay ?? 100 })
    .toFile(out);
  // Fotograma fijo (primer cuadro) para movimiento reducido.
  const posterPath = path.join(motionDir, `${slug(path.parse(file).name)}-poster.webp`);
  await sharp(input, { animated: false, limitInputPixels: false, page: 0 })
    .resize({ width: 720, withoutEnlargement: true })
    .webp({ quality: 70, effort: 4 })
    .toFile(posterPath);
  manifest.motion.push({ source: file, output: path.relative(ROOT, out), frames: pages, sourceWidth: meta.width, sourceFrameHeight: frameHeight, width: info.width, height: info.pageHeight ?? info.height, bytes: info.size });
}

// Archivo visible en la web: GIF animados con su fotograma fijo y la imagen sin proyecto.
const archive = [
  ...manifest.motion.map((m, i) => ({
    kind: 'motion',
    src: '/' + path.relative(path.join(ROOT, 'public'), path.join(ROOT, m.output)).split(path.sep).join('/'),
    poster: '/' + path.relative(path.join(ROOT, 'public'), path.join(ROOT, m.output)).replace(/\.webp$/, '-poster.webp').split(path.sep).join('/'),
    width: m.width,
    height: m.height,
    alt: `Animación ${String(i + 1).padStart(2, '0')} del archivo de diseño de Emmanuel Aranguibel.`,
  })),
  ...manifest.stills.filter((st) => st.project === null).map((st) => ({
    kind: 'still',
    src: '/' + path.relative(path.join(ROOT, 'public'), path.join(ROOT, st.output)).split(path.sep).join('/'),
    width: st.width,
    height: st.height,
    alt: 'Composición cinematográfica del archivo 2026.',
  })),
];
await writeFile(path.join(ROOT, 'content', 'eag-archive.json'), JSON.stringify(archive, null, 2) + '\n');
await writeFile(path.join(ROOT, 'content', 'eag-assets.json'), JSON.stringify(manifest, null, 2) + '\n');
const total = manifest.stills.concat(manifest.motion).reduce((a, b) => a + b.bytes, 0);
console.log(`Imágenes: ${manifest.stills.length}; GIF animados: ${manifest.motion.length}; omitidos: ${SKIPPED.length}; bytes de salida: ${total}`);
