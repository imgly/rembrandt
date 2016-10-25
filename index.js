/**
 * This file is part of Rembrandt.js
 * Copyright (c) 2016 PhotoEditorSDK.com
 * Licensed under MIT license (https://opensource.org/licenses/MIT)
 */

import fs from 'fs'

import Utils from './lib/utils'
import Promise from './vendor/promise'
import Constants from './constants'
import Image from './lib/image'
import Color from './lib/color'
import ImageComparator from './lib/image-comparator'

class Rembrandt {
  constructor (options) {
    this._imageA = null
    this._imageB = null

    this._options = Utils.defaults(options, {
      imageA: null,
      imageB: null,
      thresholdType: Rembrandt.THRESHOLD_PERCENT,
      maxThreshold: 0.01,
      maxDelta: 20,
      renderComposition: false,
      compositionMaskColor: Color.RED
    })

    this._validateOptions()
  }

  // -------------------------------------------------------------------------- PUBLIC API

  /**
   * Compares the input images
   * @return {Promise}
   */
  compare () {
    return this._loadImages()
      .then(() => {
        const comparator = new ImageComparator(this._imageA, this._imageB, this._options)
        return comparator.compare()
      })
  }

  // -------------------------------------------------------------------------- STATIC PUBLIC API

  /**
   * Creates an image
   * @param  {Number} width
   * @param  {Number} height
   * @return {Rembrandt.Image}
   */
  static createImage (width, height) {
    return new Image(width, height)
  }

  // -------------------------------------------------------------------------- PRIVATE API

  /**
   * Validates the options
   * @private
   */
  _validateOptions () {
    // Image options validation
    const checkImageValid = (optionName) => {
      const image = this._options[optionName]
      if (!(typeof image === 'string' || Buffer.isBuffer(image) || image instanceof Image)) {
        throw new Error(`Option \`${optionName}\` must either be a String, Buffer or Rembrandt.Image.`)
      }
    }
    checkImageValid('imageA')
    checkImageValid('imageB')

    const { thresholdType, threshold, maxDelta } = this._options

    // Threshold type validation
    const validThresholdTypes = [Rembrandt.THRESHOLD_PERCENT, Rembrandt.THRESHOLD_PIXELS]
    if (validThresholdTypes.indexOf(thresholdType) === -1) {
      throw new Error(
        '`thresholdType` must be either Rembrandt.THRESHOLD_PERCENT or Rembrandt.THRESHOLD_PIXELS'
      )
    }

    // Threshold validation
    if (thresholdType === Rembrandt.THRESHOLD_PERCENT && threshold < 0 || threshold > 1) {
      throw new Error('`threshold` must be between 0 and 1')
    }

    // Delta validation
    if (maxDelta < 0 || maxDelta > 255) {
      throw new Error('`maxDelta` must be between 0 and 255')
    }
  }

  /**
   * Loads the images
   * @private
   */
  _loadImages () {
    return this._loadImage(this._options.imageA)
      .then((imageA) => {
        this._imageA = imageA
        return this._loadImage(this._options.imageB)
      })
      .then((imageB) => {
        this._imageB = imageB
      })
  }

  /**
   * Loads the given image
   * @param  {String|Buffer} image
   * @return {Buffer}
   * @private
   */
  _loadImage (image) {
    return new Promise((resolve, reject) => {
      if (image instanceof Image) {
        return resolve(image)
      }

      if (image instanceof Buffer) {
        return resolve(Image.fromBuffer(image))
      }

      fs.readFile(image, (err, buf) => {
        if (err) return reject(err)
        resolve(Image.fromBuffer(image))
      })
    })
  }
}

Rembrandt.Image = Image
Rembrandt.Color = Color

// Copy constants to Rembrandt object
for (let key in Constants) {
  Rembrandt[key] = Constants[key]
}

module.exports = Rembrandt
