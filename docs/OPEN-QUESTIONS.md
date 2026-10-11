# Verificaciones resueltas y reservas previas al lanzamiento

El brief pidió evitar preguntas de ida y vuelta. Para avanzar se usaron fuentes existentes del propietario y decisiones de bajo riesgo; no se desconectó ningún proveedor ni se realizó un deploy a producción.

## Decisiones respaldadas por las fuentes disponibles

1. **Correo del portfolio:** se conserva `aranguibelgonzaleze@gmail.com`, el que ya aparece en el sitio público. Se almacena junto al formulario en `content/site.json`. No se envió ningún correo de prueba.
2. **Behance:** se usa `https://www.behance.net/emmanuearangui`. Beacons apunta a `https://beacons.ai/eagraphicdesigner`, la URL correcta.
3. **Contenido del Drive:** IAIM, UCV fútbol, La Meka, INNOVA3DLABS y Órbita siguen ocultos porque la fuente indica `published: false`.
4. **ANA VALDEZ:** se encontró el video original compartido en Drive y se extrajeron 16 escenas para el visor. La fecha publicada en Behance es 23 de agosto de 2026.
5. **Medios:** Ana, Kalhua y USB usan archivos asociados a sus publicaciones del mismo perfil de Behance; los casos heredados conservan recursos propios del sitio. No se usó imagen generada ni stock.
6. **Años:** solo se muestra una fecha cuando la fuente lo documenta. No se asigna año a USB porque la publicación no confirma uno en los metadatos consultados.
7. **WARAIRA / Warairarepano:** el proyecto mantiene el título comercial «Tu Sitio Waraira»; el nombre del empleador se conserva como estaba documentado en la experiencia del sitio.
8. **Promesas no acreditadas:** se retiró la promesa de respuesta en menos de 24 horas, los testimonios de muestra y el FAQ sin respuestas.
9. **Formulario:** está configurado como Netlify Forms con campos requeridos, honeypot, ruta de acuse y sin envío simulado. No se envió un formulario ni se verificó recepción del proveedor, porque el preview no es el deploy oficial.
10. **Dirección visual:** conserva carbón y verde `#4BFF2E`, con el sistema tipográfico y el acento pixel del starter, reforzados por el usuario al pedir el proyecto Portafolio 2026 como referencia.
11. **Idioma:** español como idioma principal.
12. **Etapas de casos:** se describen únicamente las aplicaciones visibles. Para USB no se afirma producción; para Utopía se nombran las técnicas citadas en la ficha, sin afirmar volúmenes, ventas ni resultado de fabricación.
13. **Hosting:** se recomienda conservar Netlify como destino canónico porque la URL pública vigente está allí y el formulario usa Netlify Forms. No se desconectó ningún proyecto de Netlify ni de Vercel.

## Pendientes exclusivamente de publicación

- En esta sesión, la consulta de solo lectura a Netlify respondió HTTP 401. No se modificó el hosting ni se publicó en producción; se requiere reautorizar el conector antes de desplegar o comprobar la recepción del formulario.
- El push autorizado a `ackermaaanlevi99-collab-patch-1` fue rechazado por GitHub con HTTP 403; los commits permanecen en la rama local y no se reintentó. Antes de publicarlos, hay que restaurar permiso de escritura o reautorizar la credencial GitHub.
- Verificar en un deploy real de Netlify que el formulario `contacto-portafolio` quede detectado por el proveedor y que sus notificaciones lleguen al destinatario configurado por el propietario. La conexión de emails/roles del proveedor no se cambia desde este repositorio.
- Decidir si `main` se integra después de la revisión del pull request. Esta rama no se mergeó; el código se dejó separado hasta poder revisar el preview del PR.
- Si se prefiere el otro email (de Drive) antes de producción, editar `contact.email` en `content/site.json` y el mismo destinatario usado por Netlify; la dirección vigente del sitio se mantuvo como valor inicial.
