# 🗂️ Plan del Proyecto: "Norte" — Tu Organizador de Vida Personal

> Una herramienta que entiende **todo** lo que haces a diario — trabajo, familia, horarios, metas personales — y te ayuda a dejar de procrastinar con un sistema simple, visual y profesional.

---

## 1. El problema que vamos a resolver

La procrastinación casi nunca es pereza. Suele venir de tres cosas:

1. **No saber por dónde empezar** — tienes todo en la cabeza, nada escrito, y el cerebro se satura.
2. **Tareas demasiado grandes** — "ordenar mi vida" paraliza; "guardar la ropa del sillón" no.
3. **Falta de estructura visible** — sin un horario claro, cualquier momento es bueno para postergar.

Por eso la herramienta no será una simple lista de tareas. Será un **sistema completo** con tres pilares:

| Pilar | Qué hace | Cómo ataca la procrastinación |
|---|---|---|
| **Capturar** | Todo lo que tienes en la cabeza entra a la app en segundos | Libera tu mente; ya no se te olvida nada |
| **Organizar** | La app separa por ámbitos (trabajo, familia, personal...) y por prioridad | Siempre sabes qué es lo importante HOY |
| **Ejecutar** | Vista "Hoy" con máximo 3 prioridades + temporizador de enfoque | Tareas pequeñas y concretas = empezar es fácil |

---

## 2. Los ámbitos de tu vida que cubrirá

La app se organiza en **Áreas de Vida**, personalizables. Las que vienen por defecto:

- 💼 **Trabajo** — proyectos, reuniones, pendientes laborales, fechas límite.
- 👨‍👩‍👧 **Familia** — cumpleaños, compromisos, tiempo de calidad, encargos del hogar.
- 🧠 **Personal** — estudio, hobbies, metas propias.
- 💪 **Salud** — ejercicio, citas médicas, hábitos de sueño y comida.
- 💰 **Finanzas** — pagos recurrentes, recordatorios de vencimientos.

Cada tarea, evento o hábito pertenece a un área, con su color propio. Así en un vistazo ves si tu semana está balanceada o si el trabajo se está comiendo todo lo demás.

---

## 3. Los módulos de la herramienta

### 3.1 📥 Bandeja de Entrada (Captura Rápida)
- Un botón siempre visible: escribes lo que sea en 5 segundos y sigues con tu vida.
- Luego, cuando tengas un momento, "procesas" la bandeja: cada cosa se convierte en tarea, evento o nota, con su área asignada.
- **Regla de oro integrada**: si toma menos de 2 minutos, la app te sugiere hacerlo ya.

### 3.2 ☀️ Vista "Hoy" (la pantalla principal)
La pantalla que ves al abrir la app. Muestra solo lo que importa hoy:
- **Tus 3 prioridades del día** (máximo 3 — esto es clave contra la parálisis).
- Tu **horario del día** en línea de tiempo vertical (trabajo, comidas, familia, todo).
- Hábitos de hoy con check rápido.
- Un saludo con resumen: *"Buenos días, Renzo. Hoy tienes 2 reuniones, 3 prioridades y el cumpleaños de tu mamá el viernes."*

### 3.3 📅 Agenda y Horarios
- Vista semanal y mensual tipo calendario.
- **Bloques de tiempo (time-blocking)**: arrastras tareas al calendario para reservarles hora. Lo que no tiene hora asignada, rara vez se hace.
- Rutinas recurrentes: "gimnasio lunes/miércoles/viernes 7am" se crea una vez.
- Colores por área de vida para ver el balance de tu semana de un vistazo.

### 3.4 ✅ Tareas y Proyectos
- Tareas con: área, prioridad, fecha, subtareas y notas.
- **Divisor de tareas grandes**: si una tarea lleva más de 3 días pospuesta, la app te propone dividirla en pasos de 15 minutos.
- Proyectos con barra de progreso (ej: "Mudanza", "Informe trimestral").

### 3.5 🔁 Hábitos
- Hábitos diarios/semanales con **racha visible** (🔥 x días seguidos) — la racha genera compromiso.
- Gráfico mensual de cumplimiento por hábito.
- Hábitos "ancla": se vinculan a tu horario ("después del café → 10 min de lectura").

### 3.6 🎯 Modo Enfoque (anti-procrastinación activa)
- Eliges UNA tarea → temporizador Pomodoro (25 min trabajo / 5 descanso).
- Pantalla limpia, sin distracciones, solo la tarea y el reloj.
- Al terminar cada sesión: registro automático de tiempo enfocado.

### 3.7 📊 Revisión Semanal
- Cada domingo (configurable) la app te guía en 10 minutos:
  1. ¿Qué lograste esta semana? (celebrar cuenta)
  2. ¿Qué quedó pendiente? → se reprograma o se elimina sin culpa.
  3. ¿Qué es lo más importante de la próxima semana?
- Estadísticas: tareas completadas, tiempo enfocado, balance entre áreas de vida.

---

## 4. Diseño: intuitivo y profesional

### Principios
1. **Cero curva de aprendizaje** — si necesitas un tutorial, el diseño falló. Todo se entiende a la primera.
2. **Menos es más** — cada pantalla muestra solo lo necesario. Nada de menús infinitos.
3. **Máximo 2 toques** para cualquier acción frecuente (capturar, completar, posponer).
4. **Calma visual** — la app debe relajar, no estresar. Espacios en blanco generosos, sin rojos alarmantes por todos lados.

### Identidad visual
- **Paleta**: fondo claro/oscuro (según preferencia del sistema), un color primario sobrio (azul profundo o verde bosque), y colores suaves por área de vida.
- **Tipografía**: una sans-serif limpia y legible (Inter).
- **Componentes**: tarjetas con bordes redondeados, sombras sutiles, animaciones discretas al completar tareas (una micro-celebración ✓).
- **Modo oscuro** completo desde el día uno.
- **Responsive**: perfecta en celular (uso principal) y en pantalla grande.

---

## 5. Arquitectura técnica propuesta

**Será una app web**: se abre desde cualquier navegador (celular, laptop, tablet) con solo entrar a una URL, sin instalar nada de tiendas de aplicaciones. Y como además será PWA, quien quiera puede "agregarla a la pantalla de inicio" y usarla como si fuera una app nativa, incluso sin internet.

| Capa | Tecnología | Por qué |
|---|---|---|
| Frontend | **React + Vite + TypeScript** | Rápido, moderno, mantenible |
| Estilos | **Tailwind CSS** | Diseño profesional y consistente sin esfuerzo |
| Tipo de app | **App web + PWA** (Progressive Web App) | Accesible desde cualquier navegador con una URL; opcionalmente instalable en el celular y funciona sin internet |
| Datos (fase 1) | **IndexedDB local** | Tus datos en tu dispositivo, privacidad total, cero costo |
| Datos (fase 2) | **Supabase** (o similar) | Sincronización entre dispositivos y respaldo en la nube |
| Notificaciones | Web Push / recordatorios locales | Avisos de eventos, hábitos y prioridades |

---

## 6. Hoja de ruta (fases)

### 🏁 Fase 1 — MVP (el corazón del sistema)
- [ ] Estructura del proyecto (React + Vite + Tailwind + PWA)
- [ ] Áreas de vida configurables
- [ ] Captura rápida + Bandeja de entrada
- [ ] Tareas con prioridad, área y fecha
- [ ] Vista "Hoy" con las 3 prioridades y horario del día
- [ ] Modo oscuro y diseño responsive

### 🚀 Fase 2 — El sistema completo
- [ ] Agenda semanal con time-blocking (arrastrar tareas al calendario)
- [ ] Rutinas y eventos recurrentes
- [ ] Hábitos con rachas
- [ ] Modo Enfoque con Pomodoro

### 🌟 Fase 3 — Inteligencia y constancia
- [ ] Revisión semanal guiada con estadísticas
- [ ] Divisor de tareas pospuestas
- [ ] Notificaciones y recordatorios
- [ ] Sincronización en la nube entre dispositivos

### 💎 Fase 4 — Extras
- [ ] Widget de resumen diario
- [ ] Integración con Google Calendar
- [ ] Metas a largo plazo conectadas con tareas diarias
- [ ] Modo familia: compartir listas y eventos con tu pareja/familia

---

## 7. Cómo se sentirá usarla (un día contigo)

> **7:00 am** — Abres la app. "Buenos días, Renzo". Ves tu horario del día y tus 3 prioridades. Marcas tu primer hábito: ✓ vaso de agua.
>
> **10:30 am** — En el trabajo te encargan algo. Botón de captura, lo escribes en 5 segundos, sigues en lo tuyo. No se te va a olvidar.
>
> **3:00 pm** — Toca tu bloque de "informe". Modo Enfoque, 25 minutos, sin distracciones. La app registra tu avance.
>
> **8:00 pm** — Revisas la bandeja: lo capturado se convierte en tareas con fecha. 2 minutos y listo.
>
> **Domingo** — Revisión semanal: completaste 23 tareas, tu racha de gimnasio va en 🔥 6, y el área "Familia" estuvo baja — la app te sugiere agendar algo con los tuyos esta semana.

---

## Siguiente paso

Con este plan aprobado, el siguiente paso es **construir la Fase 1 (MVP)**: la app funcional con captura rápida, tareas por áreas de vida y la vista "Hoy". Es la base que ya te permite usarla todos los días desde la primera versión.
