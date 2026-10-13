# Diagnóstico del fallo del plugin de Netlify

## Causa confirmada

El Deploy Preview del commit `43c094c` (`ackermaaanlevi99-collab-patch-1`) falló en el deploy `6acd1709fb407f1d9127553b`. El log de Netlify identifica `netlify-plugin-cloudinary`: exige un Cloud Name y no encontró `cloudName` ni `CLOUDINARY_CLOUD_NAME` para ese build. El propio log indica que el plugin provenía de la información de la app en Netlify.

El dashboard mostraba Cloudinary habilitado en **Project configuration → Developer settings → Build plugins**. El repositorio no contiene referencias de aplicación al plugin, a `cloudName` ni a `CLOUDINARY_CLOUD_NAME`. El portfolio sirve variantes WebP locales y responsivas; no necesita Cloudinary para mostrar sus imágenes.

## Corrección aplicada

Se desactivó únicamente el plugin Cloudinary desde el panel del sitio. Netlify ahora muestra **Enable** para ese plugin, lo que confirma que quedó desactivado. No se modificaron variables de entorno, no se añadió una dependencia y no se tocó `main`. La guía del plugin permite volver a habilitarlo con un Cloud Name real si se decide usarlo más adelante. [Cloudinary Netlify Plugin README](https://github.com/cloudinary-community/netlify-plugin-cloudinary)

## Deploy Preview y verificación HTTP

Netlify generó correctamente el Deploy Preview `6aceafdca25f1e95fc694c0e` para el commit `5751b02` de la rama `ackermaaanlevi99-collab-patch-1`. Su estado fue `ready` y el check del PR informó **Deploy Preview ready**. La URL del Preview es [deploy-preview-1--emmanuelaranguibelgraphicdesigner.netlify.app](https://deploy-preview-1--emmanuelaranguibelgraphicdesigner.netlify.app).

Las rutas `/`, `/gracias` y `/__forms.html` respondieron HTTP 200. La plantilla estática contiene `contacto-portafolio`, `data-netlify`, `bot-field` y el campo `email`. Estas respuestas confirman que el artefacto y esas rutas se sirven, pero todavía no demuestran que Netlify haya registrado o recibido envíos del formulario.

## Detección y facturación de formularios

En el panel **Forms** la detección aparecía desactivada. Se habilitó; el panel confirmó **Form detection is enabled**. Netlify indica que empezará a analizar los formularios a partir del siguiente deploy. Por ello, el Preview `5751b02` se generó antes de activar la detección y no basta para confirmar el registro de `contacto-portafolio`; hace falta un deploy nuevo de la rama.

El panel informa que el equipo opera con créditos. La documentación oficial de Netlify indica que Forms es gratis e ilimitado en los planes basados en créditos, y que los Deploy Previews cuestan 0 créditos. [Forms usage and billing](https://docs.netlify.com/manage/forms/usage-and-billing/) [How credits work](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/) [Forms setup](https://docs.netlify.com/manage/forms/setup/)

## Validación y pasos pendientes

`npm run lint` y `npm run typecheck` pasaron. `npm run build` de producción pasó en una copia aislada del repositorio antes de la corrección del plugin. El Deploy Preview `5751b02` quedó listo y las tres rutas anteriores respondieron HTTP 200.

Después de activar la detección se necesita un nuevo Deploy Preview para que Netlify vuelva a escanear el formulario. Luego se verificará que `contacto-portafolio` figure en **Forms**. No se ha enviado ningún dato de prueba. La cuenta de equipo muestra que los deploys de producción están pausados por créditos; el sitio ya publicado sigue en línea. No se fusionó a `main` ni se publicó una versión nueva al dominio de producción.

## Fuentes

- [Netlify Build plugins](https://docs.netlify.com/integrations/build-plugins/): instalación y configuración de plugins.
- [Cloudinary Netlify Plugin](https://github.com/cloudinary-community/netlify-plugin-cloudinary): requisito de Cloud Name y comportamiento sobre imágenes.
- [Forms usage and billing](https://docs.netlify.com/manage/forms/usage-and-billing/): costo de Forms en planes basados en créditos.
- [How credits work](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/): crédito de Deploy Previews y Forms.
- [Forms setup](https://docs.netlify.com/manage/forms/setup/): activación y próximo deploy necesario para detectar formularios.
