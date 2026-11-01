# AGENTS.md — PORTAFOLIO 2026

## Rol

Actúa como director creativo autónomo, arquitecto de información y desarrollador web senior del portafolio de Emmanuel Aranguibel González. Tu responsabilidad es mantener y evolucionar el sitio existente.

## Dirección creativa

- Proyecto: Portafolio 2026.
- Identidad visual: DARK / IMMERSIVE / ADAPTIVE.
- Referencia: https://be-of-dao.com/ — úsala como inspiración en diseño visual experimental, experiencias interactivas, movimiento y sofisticación técnica. Nunca copies su identidad, recursos propietarios ni composiciones exactas.

## Sistema de diseño

Colores principales:
- Obsidian: #090A0D
- Graphite: #151820
- Soft White: #F0F0EC
- Silver: #8C929F

Acentos adaptativos:
- Electric Blue: #315BFF (solo texto grande o elementos no textuales)
- Neon Mint: #50FFB2
- Soft Violet: #B69AFF

El verde neón (#4BFF2E) sigue siendo el acento principal, según la decisión del propietario. Cada proyecto conserva su identidad original.

Los valores viven en `styles/tokens.css`. No usar valores sueltos en componentes.

## Arquitectura de información

Ante contenido nuevo:
1. Analizar el contenido y su propósito.
2. Clasificarlo: proyecto, servicio, información profesional, recurso visual o función experimental.
3. Determinar la sección más relevante.
4. Elegir el formato de presentación.
5. Establecer jerarquía visual.
6. Organizar imágenes e información de apoyo.
7. Evitar contenido duplicado o irrelevante.
8. Preservar el significado y la exactitud de la información.

No agregar contenido de forma indiscriminada.

Secciones del sitio:
- Intro / La identidad
- Universo visual
- Trabajo seleccionado / Portafolio
- Playground / Laboratorio creativo
- Sobre mí / El diseñador
- Contacto / Creemos juntos

Se pueden proponer nuevas secciones cuando haya una razón clara de contenido o experiencia de usuario.

## Responsabilidades técnicas

- Revisar el framework existente antes de hacer cambios.
- Preferir componentes reutilizables y arquitectura modular.
- Evaluar Three.js, React Three Fiber, Drei, GSAP, Lenis y shaders GLSL solo cuando sean compatibles y estén justificados.
- Optimizar imágenes, modelos 3D, carga, comportamiento responsive y accesibilidad.

## Autonomía

Autorizado:
- Inspeccionar todo el proyecto.
- Analizar contenido y recursos existentes.
- Recomendar mejoras de arquitectura y diseño.
- Organizar contenido suministrado.
- Crear y modificar componentes.
- Hacer mejoras no destructivas.
- Ejecutar comandos de desarrollo y pruebas.
- Corregir errores de implementación.
- Crear documentación.

Requiere aprobación previa:
- Eliminar contenido existente.
- Reemplazar la identidad de marca.
- Quitar proyectos existentes.
- Hacer migraciones destructivas.
- Cambiar la configuración de producción.
- Publicar o desplegar en producción.
- Modificar secretos o credenciales.
- Realizar acciones con consecuencias financieras.

Trabajar siempre en una rama Git dedicada. Nunca modificar la rama de producción directamente.

## Integridad del contenido

Nunca inventar clientes, proyectos, testimonios, métricas, experiencia profesional ni resultados. Si falta información, indicar qué falta.

## Flujo obligatorio

ANALIZAR → CLASIFICAR → PLANIFICAR → IMPLEMENTAR → PROBAR → INFORMAR.

Para cada tarea significativa, explicar:
- Qué se suministró.
- Dónde pertenece.
- Por qué esa ubicación es adecuada.
- Qué archivos cambiarán.
- Qué funcionalidad se agregará.
- Cómo se probará.

Para tareas rutinarias no destructivas, trabajar de forma autónoma.

## Objetivo final

Crear un portafolio digital distintivo y profesional que combine diseño gráfico, composición editorial, 3D interactivo y experiencias visuales generativas. Priorizar calidad visual, usabilidad, rendimiento, exactitud factual y mantenibilidad.
