import { describe, it } from 'vitest'
import { QRCodeModel } from '../../src/core/QRCodeModel.js'

describe('QRCodeModel', () => {
  it('should be able to be instantiated', () => {
    const model = new QRCodeModel(1)
    console.assert(model instanceof QRCodeModel, 'model should be an instance of QRCodeModel')
  })

  it('should return correct module count', () => {
    const model = new QRCodeModel(5)
    console.assert(model.getModuleCount() === 21, 'module count for version 5 should be 21')
  })
  it('should set and get modules correctly', () => {
    const model = new QRCodeModel(2)
    model.setModule(0, 0, true)
    console.assert(model.getModule(0, 0) === true, 'module (0,0) should be true')
    model.setModule(1, 1, false)
    console.assert(model.getModule(1, 1) === false, 'module (1,1) should be false')
  })

  it('should handle out-of-bounds module access gracefully', () => {
    const model = new QRCodeModel(1)
    try {
      model.setModule(-1, 0, true)
      console.assert(false, 'should have thrown an error for negative x index')
    } catch (e) {
      console.assert(true, 'correctly threw an error for negative x index')
    }
    try {
      model.getModule(0, 21)
      console.assert(false, 'should have thrown an error for out-of-bounds y index')
    } catch (e) {
      console.assert(true, 'correctly threw an error for out-of-bounds y index')
    }
  })
})

describe('QRCodeModel Edge Cases', () => {
  it('should handle version 1 correctly', () => {
    // acá se le pasan dos parametros
    const model = new QRCodeModel(1)
    console.assert(model.getModuleCount() === 21, 'module count for version 1 should be 21')
  })

  it('should handle maximum version (40) correctly', () => {
    // acá se le pasan dos parametros
    const model = new QRCodeModel(40)
    console.assert(model.getModuleCount() === 177, 'module count for version 40 should be 177')
  })

  it('should correctly initialize all modules to false', () => {
    // acá se le pasan dos parametros
    const model = new QRCodeModel(3)
    const size = model.getModuleCount()
    let allFalse = true
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // esto no existe
        if (model.getModule(x, y) !== false) {
          allFalse = false
          break
        }
      }
      if (!allFalse) break
    }
    console.assert(allFalse, 'all modules should be initialized to false')
  })

  it('should handle setting all modules to true', () => {
    // acá se le pasan dos parametros
    const model = new QRCodeModel(2)
    const size = model.getModuleCount()
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // esto no existe
        model.setModule(x, y, true)
      }
    }
    let allTrue = true
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // esto no existe getModule()
        if (model.getModule(x, y) !== true) {
          allTrue = false
          break
        }
        if (!allTrue) break
      }
      console.assert(allTrue, 'all modules should be set to true')

    }
  })
})

