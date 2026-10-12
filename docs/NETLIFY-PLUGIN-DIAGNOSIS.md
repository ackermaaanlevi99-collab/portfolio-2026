# Diagnóstico del fallo del plugin de Netlify

## Evidencia del deploy

El Deploy Preview inicial de `ackermaaanlevi99-collab-patch-1` (commit `8cdab50`) informó `state: error`, `plugin_state: failed_build` y `error_message: null` en la metadata pública. La página de logs del build exige una sesión de Netlify; la llamada protegida no estuvo disponible en esta sesión.

## Causa de alta probabilidad

El código del formulario visible usaba `data-netlify="true"` y `data-netlify-honeypot="bot-field"` dentro del árbol React, pero no existía un archivo HTML estático en `public/` con la declaración del formulario. La documentación del adaptador OpenNext para Netlify describe exactamente esta combinación como motivo para detener el build deliberadamente: detecta atributos Netlify Forms en React y no encuentra el formulario equivalente en HTML estático. Sin el log remoto no se puede certificar que ese fuera el único error del deploy, pero la coincidencia con el código y la condición documentada es directa.

## Corrección aplicada

- Añadida `public/__forms.html`, plantilla oculta para que Netlify detecte el formulario durante el build. Declara el nombre `contacto-portafolio`, los campos `nombre`, `email`, `servicio`, `mensaje` y el honeypot `bot-field`.
- Separado el formulario interactivo en `ContactForm.tsx`. Conserva la validación nativa, envía URL-encoded por `POST` a `/__forms.html`, muestra un estado de espera y un error accesible, y navega a `/gracias` solo tras una respuesta HTTP correcta.
- El formulario visible y la plantilla estática comparten el mismo identificador y nombres de campo.
- No se desactivó `NETLIFY_NEXT_VERIFY_FORMS`, no se fijó ni añadió manualmente una versión del plugin y no se modificó la configuración de producción.

## Validación local

- `npm run lint`: correcto.
- `npm run typecheck`: correcto.
- `npm run build` de producción: correcto en una copia aislada del repositorio.
- Comprobación de la plantilla HTML: nombre, atributo `data-netlify`, honeypot y campos requeridos coinciden.
- No se envió una consulta real; la detección y recepción final deben confirmarse en el nuevo Deploy Preview de Netlify.

## Fuentes

- Netlify, [Next.js on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/): adaptador OpenNext automático; recomienda no fijar su versión manualmente.
- OpenNext, [Using Netlify Forms with Next.js](https://opennext.js.org/netlify/forms): archivo estático de detección, envío a la ruta estática y verificación que puede provocar un fallo deliberado.
