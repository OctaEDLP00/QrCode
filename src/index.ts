import { QRCodeModel } from './core/QRCodeModel.js'
import { CanvasDrawing } from './renderer/CanvasDrawing.js'
import type { QRCodeOptions } from './types/index.d.js'

/**
 * QRCode generator class.
 */
export default class QRCode {
	private _htOption: Required<QRCodeOptions>
	private _el: HTMLElement
	private _oDrawing: CanvasDrawing

	constructor(el: HTMLElement | string, vOption: string | Partial<QRCodeOptions>) {
		this._htOption = {
			width: 256,
			height: 256,
			colorDark: '#000000',
			colorLight: '#ffffff',
			correctLevel: 2,
			margin: 10,
			roundness: 0,
			quietZone: 4,
			pixelSize: 1,
			text: '',
			...(typeof vOption === 'string' ? { text: vOption } : vOption),
		}

		if (typeof el === 'string') {
			const element = document.getElementById(el)
			if (!element) throw new Error(`Element with id "${el}" not found`)
			this._el = element
		} else {
			this._el = el
		}

		this._oDrawing = new CanvasDrawing(this._el, this._htOption)

		if (this._htOption.text) {
			this.makeCode(this._htOption.text)
		}
	}

	/**
	 * Generate the QR code with new text.
	 * @param sText Texto a codificar
	 * @returns void
	 */
	makeCode(sText: string): void {
		this._htOption.text = sText

		const model = new QRCodeModel(4, this._htOption.correctLevel)
		model.addData(sText)
		model.make()

		this._el.title = sText
		this._oDrawing.draw(model)
	}

	/**
	 * Clean up the graphic content.
	 * @returns void
	 */
	clear(): void {
		this._oDrawing.clear()
	}
}

if (typeof window !== 'undefined') {
	;(window as any).QRCode = QRCode
}
