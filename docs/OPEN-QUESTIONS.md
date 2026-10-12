# Verificaciones resueltas y reservas previas al lanzamiento

El brief pidió evitar preguntas de ida y vuelta. Para avanzar se usaron fuentes existentes del propietario y decisiones de bajo riesgo; no se desconectó ningún proveedor ni se publicó en producción.

## Decisiones respaldadas por las fuentes disponibles

1. **Correo del portfolio:** se conserva `aranguibelgonzaleze@gmail.com`, el que ya aparece en el sitio público. Se almacena junto al formulario en `content/site.json`. No se envió ningún correo de prueba.
2. **Behance:** se usa `https://www.behance.net/emmanuearangui`. Beacons apunta a `https://beacons.ai/eagraphicdesigner`, la URL correcta.
3. **Contenido del Drive:** IAIM, UCV fútbol, La Meka, INNOVA3DLABS y Órbita siguen ocultos porque la fuente indica `published: false`.
4. **ANA VALDEZ:** se encontró el video original compartido en Drive y se extrajeron 16 escenas para el visor. La fecha publicada en Behance es 23 de agosto de 2026.
5. **Medios:** Ana, Kalhua y USB usan archivos asociados a sus publicaciones del mismo perfil de Behance; los casos heredados conservan recursos propios del sitio. No se usó imagen generada ni stock.
6. **Años:** solo se muestra una fecha cuando la fuente lo documenta. No se asigna año a USB porque la publicación no confirma uno en los metadatos consultados.
7. **WARAIRA / Warairarepano:** el proyecto mantiene el título comercial «Tu Sitio Waraira»; el nombre del empleador se conserva como estaba documentado en la experiencia del sitio.
8. **Promesas no acreditadas:** se retiró la promesa de respuesta en menos de 24 horas, los testimonios de muestra y el FAQ sin respuestas.
9. **Formulario:** se añadió la plantilla estática `public/__forms.html` exigida por la verificación del adaptador OpenNext para registrar Netlify Forms. El formulario visible conserva los campos, validación y honeypot, envía a esa ruta y anuncia estados de espera/error accesibles. La recepción real todavía no se ha probado.
10. **Dirección visual:** conserva carbón y verde `#4BFF2E`, con el sistema tipográfico y el acento pixel del starter, reforzados por el usuario al pedir el proyecto Portafolio 2026 como referencia.
11. **Idioma:** español como idioma principal.
12. **Etapas de casos:** se describen únicamente las aplicaciones visibles. Para USB no se afirma producción; para Utopía se nombran las técnicas citadas en la ficha, sin afirmar volúmenes, ventas ni resultado de fabricación.
13. **Hosting:** se recomienda conservar Netlify como destino canónico porque la URL pública vigente está allí y el formulario usa Netlify Forms. No se desconectó ningún proyecto de Netlify ni de Vercel.

## Pendientes exclusivamente de publicación

- El Deploy Preview inicial de `ackermaaanlevi99-collab-patch-1` (commit `8cdab50`) figura como `state=error`, `plugin_state=failed_build`; la metadata pública no incluye el mensaje detallado. El código coincide con la condición de fallo documentada para formularios Netlify dentro de Next.js cuando falta una plantilla HTML estática. El diagnóstico y la corrección se registran en `docs/NETLIFY-PLUGIN-DIAGNOSIS.md`.
- La lectura del log privado sigue requiriendo una sesión autorizada de Netlify; el intento de autenticación anterior devolvió “Invalid state key” y la conexión MCP respondió 401. Se debe revisar el nuevo Deploy Preview para confirmar que pasa el plugin.
- Después de un Deploy Preview exitoso, verificar en Netlify que `contacto-portafolio` aparece registrado y realizar el envío de prueba autorizado. No se ha enviado ningún dato ni se han cambiado notificaciones del proveedor.
- El branch `ackermaaanlevi99-collab-patch-1` está sincronizado con `origin`; el arreglo se mantiene en ese branch. `main` no se ha mergeado y no se publicó el dominio de producción.
- Si se prefiere el otro email (de Drive) antes de producción, editar `contact.email` en `content/site.json` y el mismo destinatario usado por Netlify; la dirección vigente del sitio se mantuvo como valor inicial.
