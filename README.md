# 🧭 Norte — Organizador de Vida Personal

App web para organizar todos los ámbitos de tu vida diaria (trabajo, familia, horarios, hábitos) y vencer la procrastinación con un sistema simple: **capturar → organizar → ejecutar**.

📋 El plan y la filosofía del producto están en [PLAN.md](./PLAN.md).

## ✨ Qué incluye

- **Hoy** — saludo con resumen del día, tus 3 prioridades (máximo 3), horario en línea de tiempo y hábitos con check rápido.
- **Captura rápida** — botón flotante (o tecla `n`) para anotar cualquier cosa en segundos; cae en la **Bandeja de entrada**, donde la conviertes en tarea o evento — o la haces ya si toma menos de 2 minutos.
- **Tareas** — con área de vida, prioridad, fecha, hora (time-blocking) y subtareas ("pasos pequeños"); agrupadas en Vencidas / Hoy / Próximas / Sin fecha.
- **Agenda** — vista semanal con eventos puntuales, rutinas semanales (↻) y bloques de trabajo, coloreados por área de vida.
- **Hábitos** — con racha 🔥, semana actual clicable y % de cumplimiento a 30 días.
- **Modo Enfoque** — Pomodoro (25/5, 50/10 o Arranque 10/2) con registro de minutos enfocados; el temporizador sigue corriendo aunque cambies de vista.
- **Revisión semanal** — estadísticas, balance por áreas y decisión guiada sobre pendientes (reprogramar o soltar sin culpa).
- **Ajustes** — nombre, tema claro/oscuro/sistema, áreas de vida personalizables (nombre, ícono y color) y exportación de respaldo JSON.

Todo se guarda **localmente en tu dispositivo** (`localStorage`) — privacidad total, funciona sin cuenta. Es una **PWA**: instalable desde el navegador y usable sin internet.

## 🛠️ Tecnología

React 19 · TypeScript · Vite · Tailwind CSS 4 · Zustand (persistencia) · date-fns · PWA (manifest + service worker).

## 🚀 Desarrollo

```bash
npm install
npm run dev       # desarrollo en http://localhost:5173
npm run build     # build de producción en dist/
npm run preview   # servir el build
```

Para publicarla, sirve el contenido de `dist/` en cualquier hosting estático (Netlify, Vercel, GitHub Pages, Cloudflare Pages…).
