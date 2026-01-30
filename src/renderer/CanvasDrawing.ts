import { DrawingProvider, QRCodeOptions } from '../types/index.js'
import { QRCodeModel } from '../core/QRCodeModel.js'

/**
 * HTML5 Canvas-based renderer.
 * @implements DrawingProvider
 */
export class CanvasDrawing implements DrawingProvider {
  private _el: HTMLElement
  private _canvas: HTMLCanvasElement
  private _options: Required<QRCodeOptions>

  /**
   *
   * @param el
   * @param options
   */
  constructor(el: HTMLElement, options: Required<QRCodeOptions>) {
    this._el = el
    this._options = {
      // @ts-ignore
      margin: 0,
      // @ts-ignore
      roundness: 0,
      // @ts-ignore
      pixelSize: 1,
      // @ts-ignore
      ...options,
    }
    this._canvas = document.createElement('canvas')
    this._canvas.width = options.width
    this._canvas.height = options.height

    // Limpiamos el contenedor y añadimos el canvas
    this._el.innerHTML = ''
    this._el.appendChild(this._canvas)
  }

  /**
   * Draw the QR code model on the canvas.
   * @param model
   * @returns void
   */
  draw(model: QRCodeModel): void {
    const context = this._canvas.getContext('2d')
    if (!context) return

    const { width, height, colorDark, colorLight, margin, quietZone, roundness, pixelSize } = this._options
    const rawCount = model.getModuleCount()

    // QuietZone añade módulos virtuales, Margin añade píxeles físicos directos
    const totalModuleCount = rawCount + (quietZone * 2)
    const availableSize = Math.min(width, height) - (margin * 2)
    const tileSize = availableSize / totalModuleCount

    // Fondo
    context.fillStyle = colorLight
    context.fillRect(0, 0, width, height)

    context.fillStyle = colorDark

    for (let row = 0; row < rawCount; row++) {
      for (let col = 0; col < rawCount; col++) {
        if (!model.isDark(row, col)) continue

        // Identificar si es un Position Probe (esquinas 7x7)
        const isFinder =
          (row < 7 && col < 7) ||
          (row < 7 && col >= rawCount - 7) ||
          (row >= rawCount - 7 && col < 7)

        const x = margin + (col + quietZone) * tileSize
        const y = margin + (row + quietZone) * tileSize

        if (isFinder) {
          this.drawFinder(context, x, y, tileSize, row, col, rawCount)
        } else {
          // Puntos de datos (Dots)
          const size = tileSize * pixelSize
          const offset = (tileSize - size) / 2
          const r = (size / 2) * roundness

          context.beginPath()
          context.roundRect(x + offset, y + offset, size, size, r)
          context.fill()
        }
      }
    }
  }

  /**
   * Dibuja los localizadores tratando los marcos como piezas únicas
   */
  private drawFinder(
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    s: number,
    r: number, c: number,
    count: number
  ): void {
    const { roundness } = this._options

    // Obtenemos la posición relativa dentro del bloque 7x7
    const localR = r < 7 ? r : r >= count - 7 ? r - (count - 7) : -1
    const localC = c < 7 ? c : c >= count - 7 ? c - (count - 7) : -1

    // 1. Marco Exterior (Solo disparamos el dibujo en la celda 0,0 del localizador)
    if (localR === 0 && localC === 0) {
      const outerSize = s * 7
      const outerRadius = outerSize * 0.2 * roundness // Redondeo proporcional al bloque

      ctx.beginPath()
      // Dibujamos el cuadrado exterior
      ctx.roundRect(x, y, outerSize, outerSize, outerRadius)
      // Dibujamos el hueco interior (sentido contrario para "restar" del path)
      ctx.rect(x + s * 6, y + s, -s * 5, s * 5)
      ctx.fill()

      // 2. El Centro Sólido (3x3)
      // Lo dibujamos como una sola pieza redondeada para evitar el efecto "píxel"
      const innerSize = s * 3
      const innerRadius = (innerSize / 2) * roundness
      ctx.beginPath()
      ctx.roundRect(x + s * 2, y + s * 2, innerSize, innerSize, innerRadius)
      ctx.fill()
    }
  }

  /**
   *
   * @returns void
   */
  clear(): void {
    this._canvas.getContext('2d')?.clearRect(0, 0, this._canvas.width, this._canvas.height)
  }
}
