# Anyflo — custom code

Кастомный CSS/JS для сайта Anyflo на Webflow. Код живёт здесь, а Webflow
только подключает файлы по ссылке (GitHub Pages).

## Структура

| Файл | Что внутри |
|---|---|
| `anyflo-core.css` / `anyflo-core.js` | фундамент: perf-килл-свитч, общий `gsap.matchMedia`, брейкпоинты, фабрика reveal-анимаций (`window.Anyflo`), маски строк/кнопок. **Подключать первым.** |
| `anyflo-page.css` / `anyflo-page.js` | страница Home: Lenis, hero-интро, reveal всех секций, табы Platform (автоплей + прогресс), аккордеон FAQ |
| `anyflo-navbar.css` / `anyflo-navbar.js` | навбар: fixed, фон после скролла, прячется при скролле вниз, тёмная тема над `[data-navbar-theme="dark"]` |

`window.Anyflo` (из `anyflo-core.js`) должен загрузиться раньше остальных
`anyflo-*.js`.

## Как это подключено в Webflow

**Site settings → GSAP:** включены GSAP, ScrollTrigger, SplitText.

### Home → Page Settings → Custom Code

**Inside `<head>` tag:**

```html
<link rel="stylesheet" href="https://unpkg.com/lenis@1.3.26/dist/lenis.css">
<link rel="stylesheet" href="https://aleksandrrelate.github.io/anyflo-custom-code/anyflo-core.css">
<link rel="stylesheet" href="https://aleksandrrelate.github.io/anyflo-custom-code/anyflo-page.css">
<link rel="stylesheet" href="https://aleksandrrelate.github.io/anyflo-custom-code/anyflo-navbar.css">
```

**Before `</body>` tag:**

```html
<script src="https://unpkg.com/lenis@1.3.26/dist/lenis.min.js"></script>
<script src="https://aleksandrrelate.github.io/anyflo-custom-code/anyflo-core.js"></script>
<script src="https://aleksandrrelate.github.io/anyflo-custom-code/anyflo-page.js"></script>
<script src="https://aleksandrrelate.github.io/anyflo-custom-code/anyflo-navbar.js"></script>
```

## Что нужно в разметке Webflow

| Атрибут / класс | Где | Зачем |
|---|---|---|
| `data-platform-tabs` | `.home-platform_tabs` | корень табов |
| `data-platform-tab` | каждый `.home-platform_tab` | таб |
| `data-faq-item` | каждый `.home-faq_item` | пункт аккордеона |
| `.home-faq_answer` | блок сразу после `.home-faq_item` | ответ (опционально) |
| `data-navbar-theme="dark"` | `.section_home-poc`, `.section_home-api` | тёмная тема навбара |

## Отладка

`?perf=<name>[,<name>]` в URL выключает подсистему: `lenis`, `hero`, `reveal`,
`tabs`, `faq`, `navbar`, `all`. Пример: `https://anyflo.webflow.io/?perf=lenis,reveal`.

Все анимации уважают `prefers-reduced-motion`.

## Деплой

Push в `main` → GitHub Pages обновляется за ~1 минуту. Кэш CDN/браузера
можно обойти, добавив `?v=<n>` к ссылке в Webflow.
