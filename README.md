# QRCode

A lightweight library to generate QR codes in the browser with an HTML5 Canvas renderer.

Overview
-
This package provides a high-level `QRCode` class that generates QR code models and renders them into a DOM element using `CanvasDrawing`.

Installation
-
Install via npm, pnpm or yarn:

```bash
npm install @qr-render/qrcode
# or
pnpm add @qr-render/qrcode
```

Quick start (Browser)
-
Minimal example that mounts a QR code inside a container with id `qr`:

```html
<div id="qr"></div>
<script type="module">
	import QRCode from '@qr-render/qrcode'

	// Create and render immediately (constructor accepts an element or id and options/text)
	const q = new QRCode('qr', { text: 'https://example.com', width: 300, height: 300 })

	// Update content
	q.makeCode('https://another-url.example')

	// Clear
	// q.clear()
</script>
```

Main API
-
The public API is implemented in `src/index.ts` and the package exports the default `QRCode` class.

| Symbol | Type | Description |
|---|---:|---|
| `new QRCode(el, vOption)` | `constructor(el: HTMLElement | string, vOption: string | Partial<QRCodeOptions>)` | Create a QRCode instance. `el` is a DOM element or element id. `vOption` can be a plain text string or an options object. |
| `makeCode(sText)` | `makeCode(sText: string): void` | Generate a QR model from `sText` and draw it on the canvas. |
| `clear()` | `clear(): void` | Clear the rendered canvas. |

Options (`QRCodeOptions`)
-
Configurable parameters (default values in parentheses):

| Option | Type | Default | Description |
|---|---|---:|---|
| `text` | `string` | `""` | Text to encode. |
| `width` | `number` | `256` | Canvas width in pixels. |
| `height` | `number` | `256` | Canvas height in pixels. |
| `colorDark` | `string` | `#000000` | Color used for dark modules. |
| `colorLight` | `string` | `#ffffff` | Background/light module color. |
| `correctLevel` | `number` | `2` | Error correction level (see `QrErrorCorrectLevel`). |
| `margin` | `number` | `10` | Physical pixel margin around the canvas. |
| `quietZone` | `number` | `4` | Virtual modules added as quiet zone around the code. |
| `roundness` | `number` | `0` | Module corner roundness (0..1). |
| `pixelSize` | `number` | `1` | Scale factor for module size relative to tile. |

Error correction constants
-
The package provides (via types) the `QrErrorCorrectLevel` mapping:

| Key | Value | Meaning |
|---|---:|---|
| `M` | `0` | Medium (~15% recovery) |
| `L` | `1` | Low (~7% recovery) |
| `H` | `2` | High (~30% recovery) |
| `Q` | `3` | Quartile (~25% recovery) |

Renderer: `CanvasDrawing`
-
Use the renderer directly if you need lower-level control. The class in `src/renderer/CanvasDrawing.ts` exposes:

- `new CanvasDrawing(el: HTMLElement, options: Required<QRCodeOptions>)` — creates a canvas inside `el` and applies options.
- `draw(model: QRCodeModel): void` — draws a pre-built `QRCodeModel`.
- `clear(): void` — clears the canvas.

Implementation notes
-
- The renderer treats `margin` (physical pixels) and `quietZone` (virtual modules) separately.
- The `QRCode` constructor creates an internal `CanvasDrawing` instance and will auto-generate the code if `text` is provided in options.
- The class is exposed globally as `window.QRCode` when running in a browser environment.

Advanced example (TypeScript)
-
```ts
import QRCode from '@qr-render/qrcode'
import { QrErrorCorrectLevel } from '@qr-render/qrcode'

const el = document.getElementById('qr')!
const qr = new QRCode(el, {
	text: 'https://example.com',
	width: 400,
	height: 400,
	colorDark: '#111827',
	colorLight: '#f8fafc',
	correctLevel: QrErrorCorrectLevel.M,
	roundness: 0.15,
	pixelSize: 0.9,
	margin: 12,
	quietZone: 4,
})

// Update later
qr.makeCode('https://another.example')
```

Exporting images
-
Since the renderer uses a DOM canvas, you can export images by:

- Calling `HTMLCanvasElement.toDataURL()` on the canvas element inserted into the container.
- Accessing the canvas via `document.querySelector('#myContainer canvas')` when you need to extract the image.

Development & tests
-
The project uses `vitest` for tests. To run tests locally:

```bash
pnpm install
pnpm test
```

Contributing
-
1. Fork and create a feature branch.
2. Add relevant tests under `test/`.
3. Open a PR against `main`.

License
-
See `LICENSE` at the repository root.

Relevant source files
-
- Main entry: [src/index.ts](src/index.ts)
- Canvas renderer: [src/renderer/CanvasDrawing.ts](src/renderer/CanvasDrawing.ts)
- Types and options: [src/types/index.d.ts](src/types/index.d.ts)
