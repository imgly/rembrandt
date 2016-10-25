/**
 * This file is part of Rembrandt.js
 * Copyright (c) 2016 PhotoEditorSDK.com
 * Licensed under MIT license (https://opensource.org/licenses/MIT)
 */

import _ from 'lodash'
import Promise from '../vendor/promise'
import Constants from '../constants'
import Image from './image'
import Color from './color'

import CompositionImage from './composition-image'

export default class ImageComparator {
  constructor (imageA, imageB, options = {}) {
    this._imageA = imageA
    this._imageB = imageB

    this._prepareImages()

    this._options = _.defaults(options, {
      maxDelta: 20,
      thresholdType: Constants.THRESHOLD_PERCENT,
      maxThreshold: 0.01,
      renderComposition: false,
      compositionMaskColor: Color.RED
    })

    if (this._options.renderComposition) {
      this._compositionImage = new CompositionImage(this._imageA, this._imageB)
    }
  }

  // -------------------------------------------------------------------------- PUBLIC API

  /**
   * Compares the two images
   * @return {Promise}
   */
  compare () {
    return new Promise((resolve, reject) => {
      const width = Math.min(this._imageA.width, this._imageB.width)
      const height = Math.min(this._imageA.height, this._imageB.height)

      let difference = 0
      let x, y
      let colorA, colorB
      for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
          colorA = this._imageA.getColorAt(x, y)
          colorB = this._imageB.getColorAt(x, y)

          const delta = this._calculateColorDelta(colorA, colorB)
          if (delta > this._options.maxDelta) {
            if (this._options.renderComposition) {
              this._compositionImage.setColorAt(x, y, this._options.compositionMaskColor)
            }
            difference++
          }
        }
      }

      // Calculate threshold for difference
      let threshold = difference
      if (this._options.thresholdType === Constants.THRESHOLD_PERCENT) {
        const totalPixels = width * height
        threshold = threshold / totalPixels
      }

      // Check if threshold is exceeded
      const passed = threshold <= this._options.maxThreshold

      // Render composition if needed
      if (this._options.renderComposition) {
        this._compositionImage.render()
          .then((image) => {
            resolve({ difference, passed, compositionImage: image })
          })
      } else {
        resolve({ difference, passed })
      }
    })
  }

  // -------------------------------------------------------------------------- PRIVATE API

  /**
   * Makes sure the two images have the same dimensions
   * @private
   */
  _prepareImages () {
    const maxWidth = Math.max(this._imageA.width, this._imageB.width)
    const maxHeight = Math.max(this._imageB.height, this._imageB.height)

    this._imageA = this._ensureImageDimensions(this._imageA, maxWidth, maxHeight)
    this._imageB = this._ensureImageDimensions(this._imageB, maxWidth, maxHeight)
  }

  /**
   * Makes sure the given image has the given dimensions. If it does,
   * it returns the same image. If not, it returns a new image with
   * the correct dimensions
   * @param  {Image} image
   * @param  {Number} width
   * @param  {Number} height
   * @return {Image}
   * @private
   */
  _ensureImageDimensions (image, width, height) {
    if (image.width === width && image.height === image.height) {
      return image
    }

    image.persist()

    const newImage = new Image(width, height, image.canvas)
    return newImage
  }

  /**
   * Calculates the distance between the given colors
   * @param  {Rembrandt.Color} colorA
   * @param  {Rembrandt.Color} colorB
   * @return {Number}
   * @private
   */
  _calculateColorDelta (colorA, colorB) {
    let total = 0
    total += Math.pow(colorA.r - colorB.r, 2)
    total += Math.pow(colorA.g - colorB.g, 2)
    total += Math.pow(colorA.b - colorB.b, 2)
    total += Math.pow(colorA.a - colorB.a, 2)
    return Math.sqrt(total * 255)
  }
}
