# Diagnóstico del fallo del plugin de Netlify

## Causa confirmada

El Deploy Preview del commit `43c094c` (`ackermaaanlevi99-collab-patch-1`) falló en el deploy `6acd1709fb407f1d9127553b`. El log de Netlify identifica el plugin `netlify-plugin-cloudinary` y el error: requiere un Cloud Name; no se encontró ni un `cloudName` configurado en el plugin ni `CLOUDINARY_CLOUD_NAME` disponible para ese build. El propio log indica que se ejecutaba «from Netlify app info».

El dashboard mostró Cloudinary habilitado en **Project configuration → Developer settings → Build plugins**. El repositorio no contiene referencias a `netlify-plugin-cloudinary`, `cloudName` ni `CLOUDINARY_CLOUD_NAME`. El sitio ya sirve variantes WebP locales y responsivas; la aplicación no depende de Cloudinary para mostrar sus imágenes.

El plugin de Cloudinary transforma las URLs de imágenes compiladas y puede dirigir assets de imagen a Cloudinary. Para la instalación desde la interfaz de Netlify exige un Cloud Name. La guía del plugin permite configurarlo con el input `cloudName` o la variable `CLOUDINARY_CLOUD_NAME`; no se debe inventar ese valor. [Cloudinary Netlify Plugin README](https://github.com/cloudinary-community/netlify-plugin-cloudinary) [Netlify Build plugins](https://docs.netlify.com/integrations/build-plugins/)

## Corrección aplicada

- Se desactivó únicamente el plugin Cloudinary en la configuración del sitio Netlify. El dashboard pasó a mostrar **Enable**, confirmando el cambio.
- No se creó ni modificó una variable de entorno, no se añadió una dependencia de Cloudinary y no se tocó la rama `main`.
- El cambio de plugin afecta builds futuros; el sitio publicado existente no se reemplaza hasta que se publique otra versión.
- Si se decide usar Cloudinary posteriormente, se puede volver a habilitar el plugin y proporcionar el Cloud Name real en su input o en el entorno de build.

## Cambios independientes del formulario

La corrección previa añadió `public/__forms.html` y separó el formulario interactivo en `ContactForm.tsx` para cumplir el requisito de detección de Netlify Forms con Next.js/OpenNext. Esa fue una precaución de compatibilidad independiente; el log inspeccionado atribuye este fallo a Cloudinary, no a Netlify Forms. La recepción real del formulario aún requiere un Deploy Preview funcional y una prueba autorizada.

## Validación y estado

- `npm run lint`: correcto.
- `npm run typecheck`: correcto.
- `npm run build` de producción: correcto en una copia aislada del repositorio antes de la corrección del plugin de Netlify.
- Plugin Cloudinary: desactivado en la interfaz del proyecto.
- Pendiente: generar y revisar un nuevo Deploy Preview de la rama `ackermaaanlevi99-collab-patch-1`; el deploy fallido existente corresponde al estado anterior a la desactivación.
- No se ha fusionado a `main` ni se ha publicado una versión nueva al dominio de producción.

## Fuentes

- [Netlify Build plugins](https://docs.netlify.com/integrations/build-plugins/): alcance de plugins instalados desde la interfaz y requisitos de configuración.
- [Cloudinary Netlify Plugin](https://github.com/cloudinary-community/netlify-plugin-cloudinary): requisito de Cloud Name y comportamiento de optimización/entrega de imágenes.
- [Integración Cloudinary de Netlify](https://www.netlify.com/integrations/cloudinary/build-plugin/): descripción de la integración.
