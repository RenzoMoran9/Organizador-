---
name: verify
description: Cómo compilar, servir y manejar la app Norte de extremo a extremo para verificar cambios.
---

# Verificar Norte (app web React + Vite)

## Compilar y servir

```bash
npm install          # primera vez
npm run build        # tsc -b && vite build → dist/
npm run preview -- --port 4173 --strictPort   # sirve dist/ (en segundo plano)
```

Para desarrollo con recarga: `npm run dev` (puerto 5173).

## Manejar la superficie (Playwright)

- Navegador: Chromium preinstalado — `chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })` con `playwright-core` (instalarlo fuera del repo, p. ej. en el scratchpad).
- Estado: todo vive en `localStorage` bajo la clave `norte-datos`. Para empezar de cero: `page.evaluate(() => localStorage.clear())` y recargar.
- Primer arranque: aparece la tarjeta "¡Bienvenido a Norte!" pidiendo el nombre (input `placeholder="Tu nombre"`).

## Flujos que vale la pena manejar

1. Captura rápida: tecla `n` (o botón) → textarea → Enter guarda en Bandeja (badge en el nav).
2. Bandeja: "Convertir en tarea/evento" abre modal prellenado; "Hecho en 2 min" elimina el ítem.
3. Tareas: crear con área/prioridad/fecha/hora/subtareas; con fecha+hora aparece como "bloque" en Agenda y en el horario de Hoy.
4. Agenda: evento con "Rutina semanal" + días L/X/V aparece en esos 3 días.
5. Hoy: "Elegir" prioridades (máx. 3, estrella ámbar).
6. Hábitos: marcar el círculo con anillo (hoy) → racha 🔥 sube a 1.
7. Enfoque: seleccionar tarea, preset, "Empezar sesión" → cuenta regresiva; pausa congela; el temporizador sobrevive al cambiar de vista (estado en el store, tick global en App).
8. Ajustes: tema Oscuro añade la clase `dark` a `<html>`; recargar conserva datos y tema.
9. Móvil: viewport 390×844 → barra inferior `nav.fixed` y menú "Más".

## Trampas de selectores

- Los modales conviven con la vista de fondo: acotar con `.animate-slide-up` o `form …` (los chips de área existen también como filtros detrás del modal).
- En móvil la barra lateral de escritorio sigue en el DOM (oculta): usar `nav.fixed` para la barra inferior, nunca `nav` a secas.
