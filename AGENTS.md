# Rastreador de Malla Curricular — Resumen del Proyecto para el Agente

## ¿De qué trata este proyecto?
Una aplicación móvil (PWA) para realizar el seguimiento del progreso a través de un plan de estudios universitario (programas → períodos → materias → prerrequisitos), comenzando con un programa inicial ("Administración de Empresas", Universidad de Cundinamarca, Chía), pero diseñada y modelada desde el primer día para admitir múltiples programas y múltiples usuarios.

## Archivos en esta carpeta
- `schema.sql` — Esquema relacional (compatible con SQLite; portable a PostgreSQL).
- `seed_data.json` — Datos curriculares reales (9 períodos, ~74 materias, enlaces de prerrequisitos, categorías y áreas de conocimiento) listos para poblar el esquema.
- `load_seed.py` — Script de ejecución única que construye `curriculum.db` a partir de los dos archivos anteriores. Ejecútalo (`python load_seed.py`) para tener una base de datos local funcional.

## Modelo de datos, en resumen
- `programs` → `periods` → `courses`. Cada materia pertenece a un período, que a su vez pertenece a un programa. Esto permite incorporar un segundo programa en el futuro (otra carrera, otra sede/universidad o una nueva resolución del mismo plan) sin alterar el esquema.
- `course_requirements` es una tabla de relación autorreferenciada sobre `courses` (`course_id` → `required_course_id`). Es un grafo de dependencias, no un orden secuencial rígido: una materia se desbloquea cuando todos sus prerrequisitos de tipo `R` tienen el estado `completed` para ese estudiante. No fijes el orden de semestres como regla de desbloqueo; recorre siempre este grafo.
- Las materias con `credits = 0` cuyo nombre comienza con "Diagnóstico Nivelatorio" son pruebas diagnósticas de clasificación (`is_diagnostic = 1`, `category = 'diagnostic'`), no materias lectivas regulares; sin embargo, condicionan y bloquean materias posteriores y deben ser marcables como aprobadas. Al calcular porcentajes de avance de carrera, no aportan créditos numéricos (0 créditos).
- `category` distingue la *razón de ser y tipología* de una materia, independientemente del área de aprendizaje a la que pertenezca:
  - `core`: materias disciplinares obligatorias del tronco de la carrera.
  - `diagnostic`: pruebas de diagnóstico y nivelación (0 créditos).
  - `general_education`: formación general e institucional (Comunicación, Lengua Extranjera, Ciudadanía, Cátedra).
  - `elective`: materias electivas (Electiva I..V: cupos de 2 créditos a elegir del catálogo).
  - Dos categorías de culminación de carrera que son diferentes entre sí:
    - `specialization`: Profundización (un bloque grande de 8 créditos de énfasis temático; NO forma parte del catálogo regular de electivas).
    - `capstone`: Opción de Grado.
  No colapses ni mezcles `specialization` con `elective` en la interfaz; tienen dimensiones y criterios de selección muy diferentes.
- Las materias con bandera `is_elective = 1` (únicamente las de categoría `elective`, ya que Profundización no se marca así) representan actualmente un cupo fijo cada una (Electiva I a V). Si más adelante se requiere modelar las alternativas específicas por cupo, se agregará una tabla `electives` apuntando a `elective_slot`.
- `learning_fields` agrupa las materias por área temática (Finanzas, Talento Humano, Marketing y Mercadeo, Investigación, Idiomas, etc. — 15 áreas temáticas). Esto permite métricas como "créditos aprobados por área" en los paneles visuales. Es una capa de clasificación independiente de `category`.
- Las materias que no tienen prerrequisitos explícitos en `course_requirements` (visibles en semestres 5 al 9, como Marketing, Sistemas Productivos, Formulación y Evaluación de Proyectos) corresponden fielmente a la estructura oficial: la universidad controla la matrícula por período según créditos acumulados, no por cadena obligatoria para cada materia. No inventes prerrequisitos que no figuren en la fuente oficial.
- `users` + `user_course_status`: registro del progreso por estudiante: estado (`pending` / `in_progress` / `completed` / `failed`), nota opcional y período cursado.
- `v_course_unlock_status`: vista SQL lista para consultar qué materias están desbloqueadas para un usuario en cualquier momento.

## Orden de Construcción y Roadmap de la PWA

### Stack Tecnológico Acordado
- **Framework & Bundler**: Vite + React (para máxima rapidez, ligereza y soporte PWA).
- **Estilos**: Vanilla CSS modular con CSS Custom Properties (paleta clara por defecto + infraestructura de Modo Oscuro opcional).
- **Persistencia Local-First**: **Dexie.js** (`dexie` + `dexie-react-hooks`) como wrapper reactivo sobre `IndexedDB` (resistente a purgas de iOS Safari).
- **Validación de Esquema**: `zod` para validación runtime de `seed_data.json` y estado guardado.
- **Visualización de Datos**: `recharts` para el gráfico tipo Radar (tela de araña) en la pantalla de analíticas.
- **Formularios & Inspector**: `react-hook-form` para la edición limpia de notas y personalización de electivas en el Drawer.
- **Animaciones & Motion**: `framer-motion` (física fluida para desbloqueo, transiciones y foco en grafo).
- **Iconografía**: `lucide-react` (iconos limpios y adaptables de trazo lineal 1.75px–2px).
- **Efectos de Hitos**: `canvas-confetti` (celebración visual en semestres completados e hitos legendarios).
- **Pruebas y Calidad**: `vitest` + `React Testing Library` para pruebas unitarias automatizadas del grafo de prerrequisitos.
- **Offline & PWA**: `vite-plugin-pwa` (Service Worker, manifest, soporte de instalación mobile/desktop).

### Paleta de Colores Oficial (Diseño Claro / Light Mode)
El diseño es **completamente claro (Light Mode)**, limpio y cálido, combinando legibilidad óptima con una estética editorial y de aventura sofisticada:
```css
:root {
  /* Los 5 colores de la paleta oficial */
  --color-slate-light: #A4ADBF; /* Bordes suaves, tarjetas bloqueadas */
  --color-slate-mid:   #7A98BF; /* Badges de áreas, materias en curso */
  --color-steel:       #6D86A6; /* Estructura, íconos, bordes definidos, subtítulos */
  --color-sand:        #D9D3C7; /* Fondos de tarjetas secundarias, acentos suaves */
  --color-terracotta:  #73482F; /* Acento protagónico: materias completadas, botones, XP */

  /* Variables de entorno Claro (Clean & Warm Light) */
  --bg-main:           #F8F7F4; /* Fondo general marfil/arena claro */
  --bg-card:           #FFFFFF; /* Tarjetas blancas limpias */
  --bg-card-muted:     #EFECE6; /* Tarjetas bloqueadas / inactivas */
  --border-card:       rgba(164, 173, 191, 0.40); /* Bordes sutiles */
  
  --text-primary:      #232B38; /* Texto principal oscuro de alto contraste */
  --text-secondary:    #5A6B82; /* Subtítulos y horas */
  --text-terracotta:   #73482F; /* Acentos de texto y títulos destacados */
}
```

### Sistema de Gamificación & Skill Tree (Estilo RPG)
La malla curricular funciona visual y conceptualmente como un **Árbol de Talentos (Skill Tree)**:
- **Metáfora de Nodos**:
  - *Bloqueada*: Fondo `#EFECE6`, borde tenue `#A4ADBF`, candado sutil (efecto niebla).
  - *Desbloqueada*: Fondo `#FFFFFF`, borde definido y sombra suave (lista para cursar).
  - *En Curso*: Borde y badge en **Azul Acero (`#7A98BF`)** (en batalla académica).
  - *Aprobada*: Borde y acento en **Terracota (`#73482F`)** con check de maestría.
- **Motor de XP y Niveles**:
  - `1 Crédito Académico = 100 XP` (Profundización otorga 800 XP; Pénsum total = 15,800 XP).
  - Escala de 10 Niveles con **curva de progreso progresiva/exponencial** (los últimos niveles requieren mayor acumulación de XP para reflejar la complejidad de materias avanzadas).
  - Barra de XP reactiva en el Header principal que se llena con animación en terracota.
- **Catálogo de Logros Dinámicos (Achievements Engine)**:
  - Definición modular en objetos JSON/TS con funciones evaluadoras puras (`id`, `title`, `description`, `icon`, `criteriaFn`).
  - *Primer Paso al Título*: Aprobar la primera materia regular.
  - *Mente Calibrada*: Superar las 3 pruebas de diagnóstico nivelatorio (0 créditos).
  - *Lobo de Wall Street*: Completar el área de Finanzas.
  - *Líder de Equipos*: Completar el área de Talento Humano.
  - *Políglota Institucional*: Completar los niveles de Lengua Extranjera.
  - *Superviviente de Semestre*: Completar el 100% de un período.
  - *Especialista Consagrado*: Aprobar el bloque de Profundización (8 créditos).
  - *Jefe Final Derrotado*: Completar Opción de Grado y el 100% del plan (158 créditos).
- **Desacoplamiento Arquitectónico & Estructura de Proyecto (`src/`)**:
  - `gamificationEngine.ts` opera de manera modular e independiente de la UI y del motor curricular.
  - Estructura de carpetas acordada:
    ```text
    src/
    ├── components/    # Componentes UI reutilizables (CourseCard, Header, BottomNav, Drawer)
    ├── pages/         # Las 4 vistas (Malla, Logros, Analítica, Configuración)
    ├── hooks/         # Custom React Hooks (useCurriculum, useProgress, useGamification)
    ├── lib/           # Lógica pura (curriculumEngine.ts, gamificationEngine.ts, db.ts Dexie)
    ├── types/         # Definiciones TypeScript / Zod Schemas
    └── styles/        # index.css + Tokens (Modo Claro oficial + Modo Oscuro opcional)
    ```

### Fases de Desarrollo Paso a Paso
1. **Fase 1: Configuración Inicial del Proyecto (PWA App)**
   - Inicializar la app Vite en `app/` (o estructura modular acordada).
   - Configurar dependencias (`framer-motion`, `lucide-react`, `canvas-confetti`, `vite-plugin-pwa`).
   - Configurar el sistema de diseño base en `index.css` con la **paleta en modo claro** y tipografía moderna.
   - Configurar `vite.config.js` y `manifest.webmanifest`.

2. **Fase 2: Motor Curricular y Motor de Gamificación**
   - Motor JS cliente para consultar el plan de estudios directamente desde `seed_data.json`.
   - Lógica del grafo de prerrequisitos (desbloqueo dinámico).
   - `gamificationEngine.js`: cálculo reactivo de XP, nivel del estudiante y detección de logros desbloqueados.
   - Almacenamiento local persistente (`localStorage` / `IndexedDB`) para el progreso y logros (100% offline).

3. **Fase 3: Grilla Curricular Interactiva (Malla de 9 Períodos - Skill Tree)**
   - Componente de malla horizontal/responsive con los 9 semestres en columnas claras.
   - Tarjetas de materia (`CourseCard`) con diferenciación visual de habilidad RPG (`completed`, `in_progress`, `unlocked`, `locked`).
   - Badges visuales por `category` y área académica (`learning_field`).
   - Barra de XP de nivel superior en el Header.

4. **Fase 4: Interactividad Avanzada, Logros y UX Premium**
   - **Resaltado de Prerrequisitos (Chain Glow)**: Al pasar el cursor o tocar una materia, se iluminan sus requisitos previos y habilidades que desbloquea.
   - **Cambio Rápido de Estado**: Toque intuitivo para alternar estado con micro-animaciones de experiencia.
   - **Modal / Pop-up de Logro Desbloqueado**: Celebración con `canvas-confetti` y banner flotante al desbloquear hitos o subir de nivel.
   - **Drawer / Inspector Lateral**: Vista expandida de materia (horas, prerrequisitos, área, calificación opcional).
   - **Modo Simulación**: Pruebas "What-If" para proyectar XP y desbloqueos futuros.

5. **Fase 5: Panel de Logros, Métricas y Modo Offline PWA**
   - Vista / Pestaña de "Trofeos y Logros" para inspeccionar medallas obtenidas y por desbloquear.
   - Dashboard de créditos por área de conocimiento (radar de habilidades / barras).
   - Filtros dinámicos y buscador en tiempo real.
   - Caché de Service Worker para funcionamiento offline total e instalabilidad en móvil.

### Principios de UX y Funcionalidades Estratégicas Clave
1. **Ergonomía en Pantallas Móviles**:
   - Selector superior rápido de semestres (pills del `1` al `9`) para saltar de inmediato a cualquier período con scroll suave.
   - Scroll horizontal con *CSS scroll-snap* en móviles (muestra 1 a 1.5 columnas a la vez); vista de grilla panorámica completa en pantallas de tablet o escritorio.
   - Lógica táctil (Touch-friendly): el primer toque en una materia ilumina su cadena de prerrequisitos (hacia atrás y hacia adelante) y abre el inspector; un botón rápido permite cambiar el estado de cursado.
2. **Copia de Seguridad y Portabilidad (100% Offline)**:
   - Funcionalidad de **Exportar Progreso** (descarga de un archivo `.json` liviano o copiado de código) para respaldar notas, estados y logros desbloqueados.
   - Funcionalidad de **Importar Progreso** para restaurar o transferir el avance entre dispositivos (ej. de la PC al celular) sin necesidad de registrar correos ni contraseñas.
3. **Personalización de Cupos de Electivas (Electiva I a V)**:
   - En el inspector de cada cupo de electiva (2 créditos), permitir al estudiante ingresar opcionalmente el nombre real de la materia que cursó (ej. *"Comercio Electrónico"*, *"Finanzas Personales"*), personalizando la visualización de la malla.
4. **Tratamiento Visual de Pruebas Diagnósticas**:
   - Badge distintivo *"Prueba Diagnóstica / Nivelación"* para las 3 pruebas de 0 créditos (`DNCAI...`), clarificando que no aportan créditos a la sumatoria de avance pero son indispensables para desbloquear las ramas de razonamiento lógico.
5. **Experiencia de App Nativa PWA y Feedback Háptico**:
   - Configuración PWA en `display: "standalone"` con `theme_color: "#F8F7F4"` para integrarse de forma limpia con la barra de estado del smartphone.
   - Micro-vibración háptica (`navigator.vibrate([15])`) en dispositivos móviles compatibles al subir de nivel o desbloquear un logro ("game feel" placentero).

### Arquitectura Multi-pantalla y Vistas (Navegación con Bottom Nav)
Para evitar la sobrecarga visual y brindar una experiencia nativa fluida, la aplicación se estructura en **4 pantallas especializadas**, accesibles mediante una **Barra de Navegación Inferior fija (Bottom Nav)** en móvil y un **Layout Panorámico Inteligente (Master-Detail)** en escritorio:

1. **🗺️ Pantalla 1: Malla Curricular (Skill Tree)**:
   - Foco total en la navegación del árbol de materias y semestres.
   - Píldoras de salto rápido de semestre (`1` al `9`).
   - Resaltado interactivo de cadenas de prerrequisitos (*Chain Glow*) y cambio de estado ágil.
   - *Drawer* lateral desplegable con la información completa de la materia seleccionada.

2. **🏆 Pantalla 2: Vitrina de Logros y Rangos (Trophies & Ranks)**:
   - Exhibidor visual de medallas y logros (bronce, plata, oro, platino y diamante).
   - Progreso en tiempo real hacia logros pendientes (ej. *"Finanzas: 3/5 materias aprobadas"*).
   - Rango del estudiante e historial de niveles alcanzados.

3. **📊 Pantalla 3: Métricas y Radar de Habilidades (Analytics)**:
   - Gráfico tipo **Radar (tela de araña)** con el balance de habilidades por área temática (Finanzas, Talento Humano, Mercadeo, Métodos Cuantitativos, etc.).
   - Estadísticas de avance: créditos totales aprobados vs. pendientes y porcentaje global de graduación.

4. **⚙️ Pantalla 4: Perfil, Simulación y Respaldo (Settings & Backup)**:
   - Herramientas de **Exportar** e **Importar** progreso en archivo `.json` liviano.
   - Interruptor de **Modo Simulación ("What-If")** para experimentar sin alterar los datos reales.
   - Selector de programa/resolución (soporte multi-programa).

*En escritorio y tablets:* La vista se transforma automáticamente en pantalla dividida (malla completa panorámica a la izquierda y panel de análisis/inspector lateral a la derecha), aprovechando el ancho de la pantalla sin requerir navegación constante entre pestañas.

### Identidad Visual, Logo e Iconografía Clara (Clean Light Icons)
- **Logo e Ícono de la PWA (App Icon & Splash)**:
  - **Fondo**: Blanco puro (`#FFFFFF`) o marfil suave (`#F8F7F4`), asegurando una integración estética impecable con los lanzadores de Android e iOS, sin marcos ni bloques oscuros.
  - **Isotipo**: Red geométrica estilizada de nodos interconectados (metáfora de malla de habilidades y camino universitario) con trazo fino en **Terracota (`#73482F`)** y nodos de acento en **Azul Acero (`#6D86A6`)**.
  - **Splash Screen**: Pantalla de apertura instantánea con el logo y el nombre *"Mi Malla"* sobre fondo marfil claro.
- **Sistema de Íconos de la Interfaz (UI Icons)**:
  - Estilo de trazo lineal fino (*outline* de `1.75px` a `2px`), diáfano, sin siluetas pesadas ni sombras oscuras.
  - **Íconos inactivos**: Trazos claros en **Azul Acero / Pizarra tenue (`#6D86A6` / `#A4ADBF`)** sobre fondo transparente.
  - **Íconos activos**: Trazos nítidos en **Terracota (`#73482F`)** acompañados de una suave pastilla de fondo en tono arena claro (`#EFECE6`).

### Rendimiento Extremo: Precarga en Memoria RAM (In-Memory Hydration)
- **Inicialización Instantánea**: Al cargar la PWA, el motor curricular parsea e indexa `seed_data.json` y el progreso local directamente en estructuras de memoria RAM (`Map` y `Set` de JavaScript).
- **Latencia Cero (0 ms)**: Toda consulta de prerrequisitos, caminos críticos, verificación de bloqueos y métricas de créditos se resuelve en tiempo constante $O(1)$ directamente desde la RAM.
- **Cero Parpadeos o Spinners**: La navegación entre las 4 pantallas y las animaciones de `framer-motion` corren fluidas a 60/120 FPS sin bloqueos de I/O de disco.
- **Persistencia en Segundo Plano (Write-Through)**: Cada cambio de estado de materia se aplica de inmediato en la RAM para una respuesta táctil instantánea y se persiste de manera asíncrona no bloqueante en el almacenamiento local.

### Robustez del Grafo, Ergonomía Móvil y Ficha de Avance
- **Recálculo en Cascada (Rollback Seguro)**: Si el estudiante desmarca una materia aprobada o la revierte a pendiente, el motor del grafo revalúa instantáneamente las dependencias, re-bloquea de forma coherente las materias sucesoras que dependían de ella y ajusta los puntos de XP en tiempo real.
- **Tratamiento de Materias Reprobadas (`failed`)**: Soporte en la UI para el estado `failed` mediante un badge sutil *"Por nivelar / Repetir"*; mantiene bloqueadas sus materias posteriores sin romper la armonía visual de la malla.
- **Zona Segura en Pantallas Móviles (*Safe Area Insets*)**: La barra de navegación inferior (Bottom Nav) respeta `padding-bottom: max(12px, env(safe-area-inset-bottom))` para garantizar comodidad táctil sin colisionar con el indicador de inicio de iOS o las barras de gestos de Android.
- **Ficha de Avance Compartible**: Tarjeta visual de personaje descargable o compartible en la pantalla de perfil, mostrando el nivel RPG alcanzado, porcentaje de grado y gráfico de radar.

### Blindaje de Interacción y Prevención de Fricción UX
Para evitar errores comunes, frustración del estudiante y garantizar una experiencia de uso fluida:
1. **Prevención de Toques Accidentales en Scroll**:
   - Umbral de movimiento táctil (*scroll threshold*) de `8px` para evitar que un desplazamiento con el pulgar se confunda con un toque de marcado.
   - El cambio de estado de materia se realiza mediante un botón de acción rápida explícito con icono (o dentro del Drawer), evitando toques involuntarios en la tarjeta.
2. **Onboarding Rápido (Completar Semestre en 1 Toque)**:
   - Botón discreto en la cabecera de cada columna del semestre (*"Completar Semestre"*, con confirmación) para que un estudiante avanzado configure su avance de 1º a 5º semestre en segundos.
3. **Resaltado Direccional en *Chain Glow***:
   - Diferenciación visual de dependencias: prerrequisitos previos requeridos iluminados en tono **Arena (`#D9D3C7`)** con flecha hacia atrás `←`, y materias que desbloquea a futuro iluminadas en **Terracota (`#73482F`)** con pulso hacia adelante `→`. Tocar un espacio neutro desactiva el resplandor de inmediato.
4. **Dosificación de Gamificación (Cero Ruidos ni Interrupciones)**:
   - Micro-animación en la barra de XP y vibración háptica suave (`15ms`) para aprobaciones individuales.
   - Lluvia de confetti (`canvas-confetti`) y modales celebratorios reservados **únicamente para hitos legendarios** (semestres completos, culminación de áreas temáticas o graduación). Sonidos silenciados por defecto.
5. **Máxima Legibilidad Exterior (WCAG AAA)**:
   - Títulos y créditos renderizados en `--text-primary: #232B38` con `font-weight: 600` para garantizar lectura nítida bajo el sol del campus universitario.
6. **Seguridad con Notificación de Deshacer (*Undo Action*)**:
   - Toast temporal de 5 segundos con botón *"Deshacer"* tras alternar un estado.
   - Alerta amigable de confirmación si desmarcar una materia re-bloqueará materias posteriores en cascada.
7. **Persistencia Robusta contra Purgas de iOS**:
   - Almacenamiento primario en **`IndexedDB`** (más resistente a purgas automáticas de Safari WebKit que `localStorage`) con exportación periódica en un clic.

### Protocolo de Trabajo con el Asistente
- **Aprobación previa obligatoria**: No realizar modificaciones ni creaciones de código o archivos del proyecto sin presentar primero el plan y recibir la aprobación explícita del usuario.

## Lo que queda fuera del alcance por ahora (Non-goals)
- No es necesario modelar escalas de calificación, GPA o certificados académicos con precisión matemática estricta; la columna `grade` es un número decimal de referencia no validado obligatoriamente.
- No es necesario gestionar horarios semanales ni cruce de clases; esta herramienta es un rastreador de *avance curricular*, no un gestor de horarios ni de registro de asignaturas.







