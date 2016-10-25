/**
 * This file is part of Rembrandt.js
 * Copyright (c) 2016 PhotoEditorSDK.com
 * Licensed under MIT license (https://opensource.org/licenses/MIT)
 */

import Promise from '../vendor/promise'
import Utils from './utils'
import Image from './image'

export default class CompositionImage extends Image {
  constructor (imageA, imageB) {
    imageA.persist()
    imageB.persist()

    super(imageA.width, imageA.height, imageA.canvas)
    this._imageA = imageA
    this._imageB = imageB
  }

  /**
   * Renders the two input images and the output image onto the canvas, returns a buffer
   * @return {Promise}
   */
  render () {
    return new Promise((resolve, reject) => {
      // Prepare canvas
      this._canvas.width = this._imageA.width * 3

      // Draw input images
      this._context.drawImage(this._imageA.canvas, 0, 0)
      this._context.drawImage(this._imageB.canvas, this._imageA.width * 2, 0)

      // Draw composition image
      this._context.putImageData(this._imageData, this._imageA.width, 0)

      // @ifndef BROWSER
      resolve(this._canvas.toBuffer())
      // @endif
      // @ifdef BROWSER
      if (typeof BROWSER !== 'undefined') {
        const image = Utils.createImage()
        image.addEventListener('load', () => {
          resolve(image)
        })
        image.src = this._canvas.toDataURL('image/png')
      }
      // @endif
    })
  }
}
