# CLAUDE.md — Web Project Builder

## Workspace
Workspace central de desarrollo web. Cada proyecto vive en su propia carpeta con un `brief.md` que define su identidad y requisitos.

## Flujo de trabajo
1. Copy (siempre primero) → 2. Desarrollo (WordPress / Shopify / otro CMS)

## Convenciones generales
- Idioma principal: Español
- Archivos de copy en Markdown dentro de `copy/` de cada proyecto
- CMS principal: WordPress (PHP/HTML/CSS/JS puro, sin page builders)
- Alternativas: Shopify, otros CMS según brief del proyecto
- Mobile-first como convención responsive

## Brief de proyecto
Cada proyecto tiene un `brief.md` en su carpeta raíz con:
- Nombre y descripción del proyecto
- Colores de marca (primario, secundario, acentos)
- Tono de comunicación
- Target / público objetivo
- Servicios o secciones
- CMS elegido
- Fase actual del proyecto

Siempre leer el `brief.md` antes de trabajar en cualquier archivo del proyecto.

## Reglas de diseño frontend

### Colores
- Nunca usar la paleta por defecto de Tailwind ni colores genéricos
- Usar siempre los colores definidos en el brief del proyecto
- Derivar variantes (hover, disabled, etc.) de los colores de marca

### Tipografía
- Parear fuente display/serif para headings con sans limpia para body
- Tracking ajustado (-0.03em) en headings grandes
- Line-height generoso (1.7) en texto de cuerpo

### Sombras y profundidad
- Sombras con tinte del color de marca y baja opacidad (no shadow-md plano)
- Sistema de capas: base → elevado → flotante
- Espaciado consistente con tokens, no valores aleatorios

### Gradientes y texturas
- Gradientes multicapa para profundidad
- Textura con ruido SVG cuando aporte

### Animaciones
- Solo animar `transform` y `opacity`
- Nunca `transition-all`
- Easing tipo spring

### Estados interactivos
- Todo elemento clicable: hover, focus-visible y active. Sin excepciones

### Imágenes
- Overlay degradado (from-black/60 o similar)
- Capa de color con mix-blend-multiply cuando aplique

## Referencia visual
- Si se proporciona imagen de referencia: replicar layout, spacing, tipografía y color exactos. No "mejorar" el diseño
- Si no hay referencia: diseñar desde cero con las reglas anteriores

## Estructura de carpetas por proyecto
```
proyecto/
  brief.md          # Identidad y requisitos
  copy/             # Copys en markdown
  assets/           # Logos, imágenes, recursos
  prototype/        # Prototipos HTML (si aplica)
  theme/            # Tema WordPress/Shopify (cuando toque)
```
