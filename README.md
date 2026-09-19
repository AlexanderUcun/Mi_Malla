# 🎓 Mi Malla — Rastreador de Malla Curricular & Skill Tree Universitario

<p align="center">
  <img src="https://raw.githubusercontent.com/AlexanderUcun/Mi_Malla/main/public/logo.svg" alt="Mi Malla Logo" width="120" height="120" onerror="this.style.display='none'"/>
</p>

<p align="center">
  <strong>Una aplicación web progresiva (PWA) moderna, interactiva y 100% offline para el seguimiento del progreso académico universitario con estética de Árbol de Habilidades (Skill Tree) RPG en Modo Claro.</strong>
</p>

<p align="center">
  <a href="#-características-principales">Características</a> •
  <a href="#-paleta-de-colores-oficial">Diseño & Paleta</a> •
  <a href="#-arquitectura-multi-pantalla">Vistas</a> •
  <a href="#-gamificación--skill-tree">Gamificación</a> •
  <a href="#-tecnologías">Tecnologías</a> •
  <a href="#-instalación-y-desarrollo">Desarrollo</a> •
  <a href="ROADMAP.md">Roadmap</a>
</p>

---

## 📖 ¿De qué trata el proyecto?

**Mi Malla** transforma el seguimiento curricular universitario en una experiencia atractiva, visual e intuitiva. Diseñada inicialmente para el plan de estudios de **Administración de Empresas** de la **Universidad de Cundinamarca (Sede Chía)**, está modelada desde su arquitectura para soportar múltiples programas, resoluciones y sedes.

A diferencia de las tablas estáticas o PDFs tradicionales, la aplicación modela el pénsum como un **Grafo Dirigido Acíclico (DAG)** de dependencias reales, permitiendo al estudiante desbloquear materias paso a paso, planificar sus inscripciones y celebrar hitos académicos.

---

## ✨ Características Principales

- **🗺️ Malla Curricular Interactiva (Skill Tree)**: Navegación horizontal fluida con *CSS scroll-snap* por los 9 semestres, con selectores rápidos (`1` al `9`).
- **⚡ Resaltado de Prerrequisitos en Cadena (*Chain Glow*)**: Al tocar cualquier materia, se iluminan automáticamente sus requisitos previos y las asignaturas que desbloquea a futuro.
- **🎮 Sistema de Gamificación RPG**:
  - **Experiencia (XP)**: `1 Crédito Académico = 100 XP` (Profundización = 800 XP).
  - **10 Niveles de Progreso**: Desde *Recluta Universitario* hasta *Administrador Legendario*.
  - **Vitrina de Logros**: Medallas (bronce a diamante) por completar áreas (Finanzas, Talento Humano, etc.) y semestres.
- **☀️ Modo Claro Cálido & Limpio (Clean Light Mode)**: Paleta de diseño personalizada sin temas oscuros pesados, asegurando máxima legibilidad y estética editorial.
- **💾 100% Offline & Local-First (Sin Servidores Obligatorios)**:
  - Almacenamiento directo en el dispositivo (`localStorage` / `IndexedDB`).
  - **Exportar e Importar Progreso** en formato `.json` liviano para transferir tu avance de la PC al celular en 2 segundos.
- **📝 Personalización de Electivas**: Permite al estudiante asignar el nombre real de las materias electivas cursadas (Electiva I a V).
- **📊 Radar de Habilidades (Analytics)**: Gráfico de tela de araña que muestra el balance de competencias adquiridas por área académica.
- **📱 PWA Nativa con Ergonomía Móvil**:
  - Barra de navegación inferior (*Bottom Nav*) con soporte de zona segura (*Safe Area Insets* para iPhone y Android gestual).
  - Instalable en pantalla de inicio con respuesta táctil y feedback háptico (`navigator.vibrate`).

---

## 🎨 Paleta de Colores Oficial (Tema Claro)

El diseño visual está fundamentado en una paleta de 5 colores armónicos, cálidos y de alto contraste:

| Variable CSS | Color Hex | Muestra | Rol Principal en la UI |
|---|---|:---:|---|
| `--color-slate-light` | `#A4ADBF` | ![#A4ADBF](https://via.placeholder.com/15/A4ADBF/A4ADBF.png) | Bordes suaves, tarjetas bloqueadas (niebla) |
| `--color-slate-mid` | `#7A98BF` | ![#7A98BF](https://via.placeholder.com/15/7A98BF/7A98BF.png) | Badges de áreas, materias en curso (en batalla) |
| `--color-steel` | `#6D86A6` | ![#6D86A6](https://via.placeholder.com/15/6D86A6/6D86A6.png) | Estructura, íconos lineales, subtítulos |
| `--color-sand` | `#D9D3C7` | ![#D9D3C7](https://via.placeholder.com/15/D9D3C7/D9D3C7.png) | Acentos suaves, resplandor de desbloqueo |
| `--color-terracotta` | `#73482F` | ![#73482F](https://via.placeholder.com/15/73482F/73482F.png) | **Acento Protagónico**: Aprobadas, botones, XP |
| `--bg-main` | `#F8F7F4` | ![#F8F7F4](https://via.placeholder.com/15/F8F7F4/F8F7F4.png) | Fondo general marfil claro |
| `--bg-card` | `#FFFFFF` | ![#FFFFFF](https://via.placeholder.com/15/FFFFFF/FFFFFF.png) | Superficie de tarjetas limpias |

---

## 📱 Arquitectura Multi-pantalla (4 Vistas Clave)

La aplicación organiza sus funcionalidades en **4 pantallas dedicadas** con navegación ágil:

1. **🗺️ Pantalla 1: Malla Curricular (Skill Tree)**: Foco total en explorar el árbol de asignaturas, cambiar estados y consultar el *Drawer* de detalles.
2. **🏆 Pantalla 2: Vitrina de Logros y Rangos**: Galería de medallas desbloqueadas y por conseguir, historial de niveles y progreso por área.
3. **📊 Pantalla 3: Métricas y Radar de Competencias**: Gráfico radar multidimensional y métricas de créditos aprobados vs. pendientes.
4. **⚙️ Pantalla 4: Perfil, Simulación y Respaldo**: Herramientas de copia de seguridad (JSON), modo simulación (*What-If*) y ficha de personaje compartible.

*En pantallas de escritorio*, adopta automáticamente un diseño panorámico dividido (*Master-Detail*), mostrando la malla a la izquierda y el panel de análisis a la derecha.

---

## 🎮 Metáfora de Nodos RPG

| Estado de la Materia | Apariencia Visual | Significado en el Árbol |
|---|---|---|
| **Bloqueada 🔒** | Fondo `#EFECE6`, borde tenue `#A4ADBF` | En niebla. Prerrequisitos de tipo `R` aún pendientes. |
| **Desbloqueada ⚡** | Fondo `#FFFFFF`, borde definido y sombra suave | Lista para cursar. Cumple con todos los requisitos previos. |
| **En Curso ⚔️** | Borde y badge en Azul Acero (`#7A98BF`) | En batalla académica. Cursándose en el semestre actual. |
| **Aprobada 🏆** | Borde en Terracota (`#73482F`) con check | Habilidad dominada. Otorga XP y desbloquea ramas sucesoras. |
| **Por Nivelar ⚠️** | Badge sutil de advertencia | Reprobada (`failed`). Bloquea materias siguientes hasta aprobarla. |

---

## 🛠️ Tecnologías y Rendimiento

- **Frontend & Bundler**: [Vite](https://vitejs.dev/) + [React](https://react.dev/) (ultrarrápido y modular).
- **Estilos**: Vanilla CSS modular con CSS Custom Properties (cero plantillas genéricas).
- **Física & Animaciones**: [Framer Motion](https://www.framer.com/motion/) (transiciones fluidas y micro-interacciones).
- **Iconografía**: [Lucide React](https://lucide.dev/) (iconos de línea fina de 1.75px–2px).
- **Celebración de Hitos**: [canvas-confetti](https://www.kirilv.com/canvas-confetti/).
- **PWA & Offline**: `vite-plugin-pwa` con caché estática Workbox.
- **Precarga en Memoria RAM**: Indexación en memoria mediante `Map` y `Set` de JavaScript para consultas de grafos en $O(1)$ a **0 ms de latencia**.

---

## 📁 Estructura del Repositorio

```text
Mi_Malla/
├── AGENTS.md           # Resumen de arquitectura, datos y directrices del agente
├── ROADMAP.md          # Especificación detallada de las 5 fases de construcción
├── README.md           # Presentación principal del repositorio
├── schema.sql          # Esquema relacional (SQLite / PostgreSQL)
├── seed_data.json      # Datos curriculares reales (74 materias, 15 áreas, dependencias)
├── load_seed.py        # Generador de base de datos SQLite local
└── .gitignore          # Reglas de exclusión para Git
```

---

## 🚀 Instalación y Desarrollo Local

### Prerrequisitos
- Node.js (v18 o superior)
- Python 3.x (para compilar la base de datos relacional de prueba)

### 1. Clonar el repositorio
```bash
git clone https://github.com/AlexanderUcun/Mi_Malla.git
cd Mi_Malla
```

### 2. Probar la base de datos relacional local
```bash
python load_seed.py
```

### 3. Consultar las Fases de Desarrollo
Revisa el archivo **[`ROADMAP.md`](ROADMAP.md)** para conocer el plan de ejecución de las 5 fases de construcción de la PWA.

---

## 📄 Licencia y Créditos
- Desarrollado por **[Alexander Ucun](https://github.com/AlexanderUcun)**.
- Plan curricular basado en el programa de **Administración de Empresas** de la **Universidad de Cundinamarca** (Resolución oficial).
