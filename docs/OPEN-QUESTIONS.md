# Verificaciones resueltas y reservas previas al lanzamiento

El brief pidió evitar preguntas de ida y vuelta. Se conservaron las decisiones respaldadas por las fuentes del propietario. No se fusionó a `main` ni se publicó una versión nueva en producción.

## Decisiones respaldadas por las fuentes disponibles

1. **Correo del portfolio:** se conserva `aranguibelgonzaleze@gmail.com`, el que ya aparece en el sitio público. Se almacena junto al formulario en `content/site.json`. No se envió ningún correo de prueba.
2. **Behance:** se usa `https://www.behance.net/emmanuearangui`. Beacons apunta a `https://beacons.ai/eagraphicdesigner`, la URL correcta.
3. **Contenido del Drive:** IAIM, UCV fútbol, La Meka, INNOVA3DLABS y Órbita siguen ocultos porque la fuente indica `published: false`.
4. **ANA VALDEZ:** se encontró el video original compartido en Drive y se extrajeron 16 escenas para el visor. La fecha publicada en Behance es 23 de agosto de 2026.
5. **Medios:** Ana, Kalhua y USB usan archivos asociados a sus publicaciones del mismo perfil de Behance; los casos heredados conservan recursos propios del sitio. No se usó imagen generada ni stock.
6. **Años:** solo se muestra una fecha cuando la fuente lo documenta. No se asigna año a USB porque la publicación no confirma uno en los metadatos consultados.
7. **WARAIRA / Warairarepano:** el proyecto mantiene el título comercial «Tu Sitio Waraira»; el nombre del empleador se conserva como estaba documentado en la experiencia del sitio.
8. **Promesas no acreditadas:** se retiró la promesa de respuesta en menos de 24 horas, los testimonios de muestra y el FAQ sin respuestas.
9. **Formulario:** se añadió la plantilla estática `public/__forms.html` para que el adaptador Next.js detecte Netlify Forms. El formulario visible conserva sus campos, validación y honeypot, envía a esa ruta y anuncia estados de espera/error accesibles. La recepción real aún no se ha probado.
10. **Dirección visual:** conserva carbón y verde `#4BFF2E`, con el sistema tipográfico y el acento pixel del starter, reforzados por el usuario al pedir el proyecto Portafolio 2026 como referencia.
11. **Idioma:** español como idioma principal.
12. **Etapas de casos:** se describen únicamente las aplicaciones visibles. Para USB no se afirma producción; para Utopía se nombran las técnicas citadas en la ficha, sin afirmar volúmenes, ventas ni resultado de fabricación.
13. **Hosting:** se conserva Netlify como destino canónico porque la URL pública vigente está allí y el formulario usa Netlify Forms. No se desconectó el sitio ni se modificó su rama de producción.
14. **Plugin Cloudinary:** se desactivó en el dashboard de Netlify después de confirmar que el deploy fallaba por falta de `cloudName` y que el repositorio no depende de Cloudinary; el portafolio usa imágenes WebP locales responsivas. No se inventó ni añadió un Cloud Name. El plugin puede reactivarse con el valor real si el propietario decide usar esa integración.

## Pendientes exclusivamente de publicación

- El Deploy Preview `6acd1709fb407f1d9127553b`, del commit `43c094c`, falló por el plugin Cloudinary de Netlify. Ese plugin ya está desactivado en la configuración del sitio. Se debe crear un nuevo Deploy Preview para comprobar el build con la configuración corregida. El detalle y la decisión están en `docs/NETLIFY-PLUGIN-DIAGNOSIS.md`.
- La cuenta de equipo muestra en Netlify que sus deploys de producción están pausados mientras el equipo usa créditos operativos. El sitio ya publicado sigue en línea; no se debe considerar publicada una versión nueva hasta que Netlify confirme un deploy de producción exitoso.
- Después de un Deploy Preview exitoso, verificar que `contacto-portafolio` aparece registrado y realizar la prueba de formulario autorizada. Hasta entonces no se ha enviado ningún dato ni se han cambiado sus notificaciones.
- El branch `ackermaaanlevi99-collab-patch-1` conserva los cambios; `main` no se ha mergeado y el dominio de producción no se ha actualizado.
- Si se prefiere el otro email (de Drive) antes de producción, editar `contact.email` en `content/site.json` y el mismo destinatario usado por Netlify; la dirección vigente del sitio se mantuvo como valor inicial.
