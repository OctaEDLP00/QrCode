import { QRCodeModel } from "../core/QRCodeModel.js"
import type { QRCodeOptions } from "../types/index.js"

/**
 * Console-based renderer for CLI environments.
 */
export class ConsoleDrawing {
  private _options: Required<QRCodeOptions>

  /**
   * @param {Required<QRCodeOptions>} vOption
   */
  constructor(vOption: Required<QRCodeOptions>) {
    this._options = vOption
  }

  /**
   * Draws the QR Code in the terminal using Unicode blocks.
   * @param {QRCodeModel} model
   */
  draw(model: QRCodeModel): void {
    const moduleCount = model.getModuleCount()
    const { quietZone, colorDark, colorLight } = this._options

    let output = '\n' // Espacio inicial

    // Iteramos sobre el total incluyendo la zona de silencio
    for (let r = -quietZone; r < moduleCount + quietZone; r++) {
      let line = ''
      for (let c = -quietZone; c < moduleCount + quietZone; c++) {
        // Verificamos si estamos dentro de los límites del modelo QR
        const isInsideModel = r >= 0 && r < moduleCount && c >= 0 && c < moduleCount
        const isDark = isInsideModel && model.isDark(r, c)

        if (isDark) {
          // Usamos dos caracteres para compensar que los glifos de terminal suelen ser más altos que anchos
          line += '\x1b[40m  \x1b[0m' // ANSI Black Background
        } else {
          line += '\x1b[47m  \x1b[0m' // ANSI White Background
        }
      }
      output += line + '\n'
    }

    process.stdout.write(output + '\n')
  }

  /**
   * Clears the terminal screen.
   */
  clear(): void {
    // Usamos secuencias de escape para un clear más robusto en diversos emuladores
    process.stdout.write('\x1b[2J\x1b[0f')
  }
}
