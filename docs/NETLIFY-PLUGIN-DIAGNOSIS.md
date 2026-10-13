# Diagnóstico del fallo del plugin de Netlify

## Causa confirmada

El Deploy Preview del commit `43c094c` (`ackermaaanlevi99-collab-patch-1`) falló en el deploy `6acd1709fb407f1d9127553b`. El log de Netlify identifica `netlify-plugin-cloudinary`: exige un Cloud Name y no encontró `cloudName` ni `CLOUDINARY_CLOUD_NAME` para ese build. El log indica que el plugin provenía de la información de la app en Netlify.

El dashboard mostraba Cloudinary habilitado en **Project configuration → Developer settings → Build plugins**. El repositorio no contiene referencias de aplicación al plugin, a `cloudName` ni a `CLOUDINARY_CLOUD_NAME`. El portfolio sirve variantes WebP locales y responsivas; no necesita Cloudinary para mostrar sus imágenes.

## Corrección aplicada

Se desactivó únicamente el plugin Cloudinary desde el panel del sitio. Netlify ahora muestra **Enable** para ese plugin, lo que confirma que quedó desactivado. No se modificaron variables de entorno, no se añadió una dependencia y no se tocó `main`. La guía del plugin permite volver a habilitarlo con un Cloud Name real si se decide usarlo más adelante. [Cloudinary Netlify Plugin README](https://github.com/cloudinary-community/netlify-plugin-cloudinary)

## Deploy Preview y rutas

El Deploy Preview `6aceb2136e53b6d8693ecb1a` se completó con estado `success` para el commit `8a7ae79` de `ackermaaanlevi99-collab-patch-1`. La URL es [deploy-preview-1--emmanuelaranguibelgraphicdesigner.netlify.app](https://deploy-preview-1--emmanuelaranguibelgraphicdesigner.netlify.app).

En ese Preview, `GET /`, `GET /gracias` y `GET /__forms.html` respondieron HTTP 200. La plantilla estática contiene `contacto-portafolio`, `data-netlify`, `bot-field` y el campo `email`.

## Detección, recepción y facturación de Forms

La detección de formularios estaba desactivada en Netlify. Se habilitó desde **Forms**; el panel confirmó **Form detection is enabled**. Tras el deploy siguiente, Netlify registró el formulario activo `contacto-portafolio`.

Se hizo una única prueba real desde el Deploy Preview con datos sintéticos y texto marcado como QA: `QA Netlify Forms`, `qa@example.com`, servicio `Identidad de marca`, mensaje `PRUEBA TECNICA DE NETLIFY FORMS para validar el Deploy Preview. No es una consulta comercial; no responder.` La página navegó a `/gracias` y mostró «Netlify confirmó la recepción de tu mensaje». Después, el panel de Netlify mostró una submission verificada con esos campos. El registro de prueba permanece en el dashboard para que se pueda identificar y borrar si se desea. No se modificaron los ajustes de notificación.

El panel informa que el equipo opera con créditos. La documentación oficial de Netlify indica que Forms es gratis e ilimitado en los planes basados en créditos, y que los Deploy Previews cuestan 0 créditos. [Forms usage and billing](https://docs.netlify.com/manage/forms/usage-and-billing/) [How credits work](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/) [Forms setup](https://docs.netlify.com/forms/setup/)

## Validación y pasos pendientes

`npm run lint` y `npm run typecheck` pasaron. `npm run build` de producción pasó en una copia aislada del repositorio. Netlify generó el Preview exitoso descrito arriba, detectó el formulario y aceptó el envío de QA.

La cuenta de equipo muestra que los deploys de producción están pausados por créditos; el sitio que ya estaba publicado sigue en línea. No se fusionó a `main` ni se actualizó el dominio de producción. La actualización al sitio público requiere que se reanuden los deploys de producción y que el usuario confirme la fusión de la rama patch.

## Fuentes

- [Netlify Build plugins](https://docs.netlify.com/integrations/build-plugins/): instalación y configuración de plugins.
- [Cloudinary Netlify Plugin](https://github.com/cloudinary-community/netlify-plugin-cloudinary): requisito de Cloud Name y comportamiento sobre imágenes.
- [Forms usage and billing](https://docs.netlify.com/manage/forms/usage-and-billing/): costo de Forms en planes basados en créditos.
- [How credits work](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/): crédito de Deploy Previews y Forms.
- [Forms setup](https://docs.netlify.com/forms/setup/): activación y detección de formularios en el siguiente deploy.
