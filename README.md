# Anyflo — custom code

Кастомный CSS/JS для сайта Anyflo на Webflow. Код живёт здесь, а Webflow
только подключает файлы по ссылке (GitHub Pages).

## Структура

| Файл | Что внутри |
|---|---|
| `anyflo-core.css` / `anyflo-core.js` | фундамент: perf-килл-свитч, общий `gsap.matchMedia`, брейкпоинты, фабрика reveal-анимаций (`window.Anyflo`), маски строк/кнопок. **Подключать первым.** |
| `anyflo-page.css` / `anyflo-page.js` | страница Home: Lenis, hero-интро, reveal всех секций, табы Platform (автоплей + прогресс), аккордеон FAQ |
| `anyflo-navbar.css` / `anyflo-navbar.js` | навбар: fixed, фон после скролла, прячется при скролле вниз, тёмная тема над `[data-navbar-theme="dark"]` |
| `anyflo-footer.css` / `anyflo-footer.js` | единый видеофон FAQ и футера; по скроллу белый футер сжимается в карточку и открывает фон снизу |
| `footer-animation.mp4` / `footer-animation-poster.jpg` | сжатое видео фона и статичный постер для загрузки и reduced motion |

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
<link rel="stylesheet" href="https://aleksandrrelate.github.io/anyflo-custom-code/anyflo-footer.css">
```

**Before `</body>` tag:**

```html
<script src="https://unpkg.com/lenis@1.3.26/dist/lenis.min.js"></script>
<script src="https://aleksandrrelate.github.io/anyflo-custom-code/anyflo-core.js"></script>
<script src="https://aleksandrrelate.github.io/anyflo-custom-code/anyflo-page.js"></script>
<script src="https://aleksandrrelate.github.io/anyflo-custom-code/anyflo-navbar.js"></script>
<script src="https://aleksandrrelate.github.io/anyflo-custom-code/anyflo-footer.js"></script>
```

## Что нужно в разметке Webflow

| Атрибут / класс | Где | Зачем |
|---|---|---|
| `data-platform-tabs` | `.home-platform_tabs` | корень табов |
| `data-platform-tab` | каждый `.home-platform_tab` | таб |
| `data-faq-item` | каждый `.home-faq_item` | пункт аккордеона |
| `.home-faq_answer` | блок сразу после `.home-faq_item` | ответ (опционально) |
| `[data-leader-modal]` + `[data-leader-close]` | попапы в секции Leadership | i-я ссылка `.home-leadership_link` открывает i-й попап |
| `data-navbar-theme="dark"` | любая тёмная секция | тёмная тема навбара (`.section_home-poc` и `.section_home-api` подхватываются и по классу) |

## Отладка

`?perf=<name>[,<name>]` в URL выключает подсистему: `lenis`, `hero`, `reveal`,
`video`, `tabs`, `faq`, `modal`, `navbar`, `footer`, `all`. Пример: `https://anyflo.webflow.io/?perf=lenis,reveal`.

Все анимации уважают `prefers-reduced-motion`.

## Видео FAQ и футера

В Designer видео находится в `footer_component → anyflo-footer-background →
anyflo-footer-video → source` как обычные DOM-элементы, как у хиро.
Скрипт использует этот существующий слой и на опубликованном сайте переносит
его в `.page-wrapper`, чтобы один `.anyflo-footer-background` покрывал FAQ и футер.
Исходная `.home-faq_background-image` скрывается только после инициализации
общего фона. FAQ остаётся внутри `main`, футер — снаружи. Размер слоя
обновляется при изменении высоты FAQ, брейкпоинтов и ScrollTrigger refresh.
Видео загружается за 200px до появления фона и останавливается вне экрана
или при скрытии вкладки. При reduced motion и `?perf=video` виден постер.

Исходник `animation-footer.mp4` хранится локально и не публикуется. Сжатие
как у хиро: H.264, 1280×1280, 30 fps, CRF 26, без аудио, faststart.

```sh
ffmpeg -i animation-footer.mp4 -vf 'scale=1280:1280:flags=lanczos,fps=30' -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -an -movflags +faststart footer-animation.mp4
ffmpeg -i footer-animation.mp4 -frames:v 1 -q:v 2 footer-animation-poster.jpg
```

## Деплой

Push в `main` → GitHub Pages обновляется за ~1 минуту. Pages отдаёт файлы с
`Cache-Control: max-age=600`, поэтому ссылки в Webflow идут с `?v=<короткий хэш коммита>`.
После каждого релиза: обнови `?v=` во всех ссылках (Page Settings → Custom Code) и перепубликуй сайт.
