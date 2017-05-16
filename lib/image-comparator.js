/**
 * This file is part of Rembrandt.js
 * Copyright (c) 2016 PhotoEditorSDK.com
 * Licensed under MIT license (https://opensource.org/licenses/MIT)
 */

import Utils from './utils'
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

    this._options = Utils.defaults(options, {
      maxDelta: 20,
      thresholdType: Constants.THRESHOLD_PERCENT,
      maxThreshold: 0.01,
      renderComposition: false,
      compositionMaskColor: Color.RED,
      maxOffset: 0
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

      let differences = 0
      let x, y
      for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
          const passes = this._comparePosition(x, y)
          if (!passes) {
            if (this._options.renderComposition) {
              this._compositionImage.setColorAt(x, y, this._options.compositionMaskColor)
            }
            differences++
          }
        }
      }

      // Calculate threshold for differences
      let threshold = differences

      // Calculate percentage difference
      const totalPixels = width * height
      const percentageDifference = differences / totalPixels
      if (this._options.thresholdType === Constants.THRESHOLD_PERCENT) {
        threshold = threshold / totalPixels
      }

      // Check if threshold is exceeded
      const passed = threshold <= this._options.maxThreshold

      // Render composition if needed
      if (this._options.renderComposition) {
        this._compositionImage.render()
          .then((image) => {
            resolve({ differences, percentageDifference, threshold, passed, compositionImage: image })
          })
      } else {
        resolve({ differences, percentageDifference, threshold, passed })
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

  /**
   * Compares the given pixel position
   * @param  {Number} x
   * @param  {Number} y
   * @return {Boolean}
   * @private
   */
  _comparePosition (x, y) {
    const { maxDelta, maxOffset } = this._options
    const colorA = this._imageA.getColorAt(x, y)
    let colorB = this._imageB.getColorAt(x, y)

    // Default delta check
    let delta = this._calculateColorDelta(colorA, colorB)
    if (delta < maxDelta) return true

    // Check surrounding pixels
    if (maxOffset === 0) return false

    const { width, height } = this._imageA
    const lowestX = Math.max(0, x - maxOffset)
    const highestX = Math.min(width - 1, x + maxOffset)
    const lowestY = Math.max(0, y - maxOffset)
    const highestY = Math.min(height - 1, y + maxOffset)

    let currentX, currentY
    for (currentX = lowestX; currentX <= highestX; currentX++) {
      for (currentY = lowestY; currentY <= highestY; currentY++) {
        if (currentX === x || currentY === y) continue

        let newColorA = this._imageA.getColorAt(currentX, currentY)
        let newDeltaA = this._calculateColorDelta(colorA, newColorA)

        let newColorB = this._imageB.getColorAt(currentX, currentY)
        let newDeltaB = this._calculateColorDelta(colorA, newColorB)

        if ((Math.abs(newDeltaB - newDeltaA) < maxDelta) && (newDeltaA > maxDelta)) {
          return true
        }
      }
    }

    return false
  }
}
