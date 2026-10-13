# Verificaciones resueltas y reservas previas al lanzamiento

El brief pidió evitar preguntas de ida y vuelta. Se conservaron decisiones respaldadas por las fuentes del propietario. No se fusionó a `main` ni se publicó una versión nueva en producción.

## Decisiones y verificaciones respaldadas por las fuentes disponibles

1. **Correo del portfolio:** se conserva `aranguibelgonzaleze@gmail.com`, el que ya aparece en el sitio público. No se modificó el destinatario. Se envió una submission QA sintética a `qa@example.com`, no una consulta real.
2. **Behance:** se usa `https://www.behance.net/emmanuearangui`. Beacons apunta a `https://beacons.ai/eagraphicdesigner`.
3. **Contenido del Drive:** IAIM, UCV fútbol, La Meka, INNOVA3DLABS y Órbita siguen ocultos porque la fuente indica `published: false`.
4. **ANA VALDEZ:** se encontró el video original compartido en Drive y se extrajeron 16 escenas para el visor. La fecha publicada en Behance es 23 de agosto de 2026.
5. **Medios:** Ana, Kalhua y USB usan archivos asociados a sus publicaciones del mismo perfil de Behance; los casos heredados conservan recursos propios del sitio. No se usó imagen generada ni stock.
6. **Años:** solo se muestra una fecha cuando la fuente lo documenta. No se asigna año a USB porque la publicación no confirma uno en los metadatos consultados.
7. **WARAIRA / Warairarepano:** el proyecto mantiene el título comercial «Tu Sitio Waraira»; el nombre del empleador se conserva como estaba documentado en la experiencia del sitio.
8. **Promesas no acreditadas:** se retiró la promesa de respuesta en menos de 24 horas, los testimonios de muestra y el FAQ sin respuestas.
9. **Formulario:** `public/__forms.html` permite la detección de Netlify Forms en el sitio estático. El formulario visible conserva campos, validación y honeypot, envía a esa ruta y anuncia estados accesibles de espera/error. Netlify registró `contacto-portafolio` como formulario activo; una prueba sintética fue aceptada y verificada en el dashboard. El registro de QA se dejó identificable para su eventual eliminación; no se alteraron las notificaciones.
10. **Dirección visual:** conserva carbón y verde `#4BFF2E`, con el sistema tipográfico y el acento pixel del starter, reforzados por el usuario al pedir el proyecto Portafolio 2026 como referencia.
11. **Idioma:** español como idioma principal.
12. **Etapas de casos:** se describen únicamente las aplicaciones visibles. Para USB no se afirma producción; para Utopía se nombran las técnicas citadas en la ficha, sin afirmar volúmenes, ventas ni resultado de fabricación.
13. **Hosting:** se conserva Netlify como destino canónico porque la URL pública vigente está allí y el formulario usa Netlify Forms. No se desconectó el sitio ni se modificó su rama de producción.
14. **Plugin Cloudinary:** se desactivó en el dashboard de Netlify tras confirmar que provocaba el fallo por falta de `cloudName` y que el repositorio no depende de Cloudinary. No se inventó ni añadió un Cloud Name.
15. **Detección de Forms:** está habilitada. El formulario quedó registrado tras el deploy posterior. Netlify indica que Forms es gratis e ilimitado en planes basados en créditos.

## Pendientes exclusivamente de publicación

- El Deploy Preview del commit `8a7ae79` se completó con estado `success`: [abrir Preview](https://deploy-preview-1--emmanuelaranguibelgraphicdesigner.netlify.app). `GET /`, `/gracias` y `/__forms.html` respondieron HTTP 200.
- El envío sintético `QA Netlify Forms` (`qa@example.com`, mensaje marcado como prueba) fue confirmado por la página `/gracias` y aparece en **Forms → contacto-portafolio → Verified submissions**. Se dejó ese único registro de QA en el dashboard; puede eliminarse manualmente si no se desea conservarlo.
- La cuenta de equipo muestra que los deploys de producción están pausados por créditos. El sitio ya publicado sigue en línea. No se debe considerar publicada una versión nueva hasta que Netlify confirme un deploy exitoso de producción.
- El branch `ackermaaanlevi99-collab-patch-1` conserva los cambios; `main` no se ha mergeado y el dominio de producción no se ha actualizado. La fusión debe esperar la confirmación explícita del usuario.
- Si se prefiere otro correo (el de Drive) antes de producción, cambiar el `contact.email` y el destinatario usado por Netlify; la dirección vigente se mantuvo como valor inicial.
