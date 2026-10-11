import { access, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcesDir = path.join(root, 'content', 'projects');
const publicDir = path.join(root, 'public');
const orderPath = path.join(root, 'content', 'portfolio.json');
const coverSourcesPath = path.join(root, 'content', 'cover-source-sets.json');
const outputPath = path.join(root, 'content', 'portfolio.generated.json');
const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const order = await readJson(orderPath);
const coverSourceSets = await readJson(coverSourcesPath);

if (!Array.isArray(order) || order.some((slug) => typeof slug !== 'string')) {
  throw new Error('content/portfolio.json debe ser una lista ordenada de slugs.');
}
if (new Set(order).size !== order.length) {
  throw new Error('content/portfolio.json contiene slugs duplicados.');
}

const files = (await readdir(sourcesDir)).filter((file) => file.endsWith('.json'));
const sourceMap = new Map();
for (const file of files) {
  const project = await readJson(path.join(sourcesDir, file));
  if (!project.slug || file !== `${project.slug}.json`) {
    throw new Error(`El nombre ${file} debe coincidir con el slug del proyecto.`);
  }
  sourceMap.set(project.slug, project);
}
for (const slug of order) {
  if (!sourceMap.has(slug)) throw new Error(`El índice referencia un proyecto ausente: ${slug}`);
}

const ordered = [
  ...order.map((slug) => sourceMap.get(slug)),
  ...[...sourceMap.entries()]
    .filter(([slug]) => !order.includes(slug))
    .map(([, project]) => project)
    .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999) || a.slug.localeCompare(b.slug)),
];
const published = ordered.filter(
  (project) => project.published === true && project.status === 'confirmed',
);
const routeSlugs = new Set();
const mediaPaths = new Set();

for (const project of published) {
  if (!project.title || !Array.isArray(project.categories) || !Array.isArray(project.services)) {
    throw new Error(`El proyecto publicado ${project.slug} no tiene los campos mínimos.`);
  }
  if (!project.cover || !project.coverAlt || !project.description) {
    throw new Error(`El proyecto publicado ${project.slug} requiere portada, texto alternativo y descripción.`);
  }
  if (!Array.isArray(project.gallery)) {
    throw new Error(`La galería de ${project.slug} debe ser un arreglo.`);
  }
  const coverSources = coverSourceSets[project.slug];
  if (!Array.isArray(coverSources) || !coverSources.some(({ src }) => src === project.cover)) {
    throw new Error(`La portada de ${project.slug} requiere un conjunto responsive que incluya el original.`);
  }
  for (const source of coverSources) {
    if (!source || typeof source.src !== 'string' || !Number.isInteger(source.width) || source.width < 1
      || !source.src.startsWith('/assets/projects/') || source.src.includes('..')) {
      throw new Error(`Fuente responsive inválida en la portada de ${project.slug}.`);
    }
    mediaPaths.add(path.join(publicDir, source.src.slice(1)));
  }
  for (const image of project.gallery) {
    if (!image.src || !image.alt) {
      throw new Error(`Cada imagen de la galería ${project.slug} requiere src y texto alternativo.`);
    }
  }
  for (const slug of [project.slug, ...(project.legacySlugs ?? [])]) {
    if (!/^[a-z0-9-]+$/.test(slug) || routeSlugs.has(slug)) {
      throw new Error(`Slug de ruta inválido o duplicado: ${slug}`);
    }
    routeSlugs.add(slug);
  }

  const paths = [project.cover, ...project.gallery.map(({ src }) => src)];
  if (project.experience === 'scenes-16') {
    if (project.sceneCount !== 16) {
      throw new Error(`La experiencia de ${project.slug} requiere exactamente 16 escenas.`);
    }
    for (let index = 1; index <= project.sceneCount; index += 1) {
      paths.push(`/assets/projects/${project.slug}/scenes/scene-${String(index).padStart(2, '0')}.webp`);
    }
  }
  for (const imagePath of paths) {
    if (typeof imagePath !== 'string' || !imagePath.startsWith('/assets/projects/') || imagePath.includes('..')) {
      throw new Error(`La imagen de ${project.slug} debe apuntar a un archivo local del catálogo.`);
    }
    mediaPaths.add(path.join(publicDir, imagePath.slice(1)));
  }
}

for (const file of mediaPaths) {
  try {
    await access(file);
  } catch {
    throw new Error(`Falta un medio local requerido: ${path.relative(root, file)}`);
  }
}

const output = published.map((project) => {
  const publicProject = { ...project, coverSources: coverSourceSets[project.slug] };
  for (const privateKey of ['published', 'status', 'source', 'notes', 'sortOrder', 'sceneCount', 'experience']) {
    delete publicProject[privateKey];
  }
  if (project.experience === 'scenes-16') {
    publicProject.sceneSequence = Array.from({ length: project.sceneCount }, (_, index) => {
      const number = String(index + 1).padStart(2, '0');
      return {
        src: `/assets/projects/${project.slug}/scenes/scene-${number}.webp`,
        alt: `Fotograma ${number} de 16 de la experiencia visual ANA VALDEZ — identidad de marca.`,
      };
    });
  }
  return publicProject;
});

await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Índice público generado: ${output.length} proyectos confirmados; ${sourceMap.size - published.length} proyectos excluidos por estado.`);
