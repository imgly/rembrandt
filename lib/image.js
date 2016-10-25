/**
 * This file is part of Rembrandt.js
 * Copyright (c) 2016 PhotoEditorSDK.com
 * Licensed under MIT license (https://opensource.org/licenses/MIT)
 */

import Canvas from 'canvas'
import Color from './color'

export default class Image {
  constructor (width, height, image = null) {
    this.width = width
    this.height = height

    this._canvas = new Canvas()
    this._canvas.width = width
    this._canvas.height = height

    this._context = this._canvas.getContext('2d')

    this._image = image
    if (image) {
      this._drawImage(this._image)
    } else {
      this._imageData = this._context.createImageData(width, height)
    }
  }

  // -------------------------------------------------------------------------- PUBLIC API

  /**
   * Sets the given pixel to the given color
   * @param {Number} x
   * @param {Number} y
   * @param {Rembrandt.Color} color
   */
  setColorAt (x, y, color) {
    const index = ((y * this._canvas.height) + x) * 4
    this._imageData.data[index] = (color.r * 255) | 0
    this._imageData.data[index + 1] = (color.g * 255) | 0
    this._imageData.data[index + 2] = (color.b * 255) | 0
    this._imageData.data[index + 3] = (color.a * 255) | 0
  }

  /**
   * Returns the color at the given pixel position
   * @param  {Number} x
   * @param  {Number} y
   * @return {Rembrandt.Colors}
   */
  getColorAt (x, y) {
    const index = ((this.width * y) + x) * 4
    const r = this._imageData.data[index]
    const g = this._imageData.data[index + 1]
    const b = this._imageData.data[index + 2]
    const a = this._imageData.data[index + 3]
    return new Color(r, g, b, a)
  }

  /**
   * Returns this image's image data
   * @return {Canvas.ImageData}
   */
  getImageData () {
    return this._imageData
  }

  /**
   * Sets the given image data
   * @param {Canvas.ImageData} imageData
   */
  setImageData (imageData) {
    this._imageData.data.set(imageData.data)
  }

  /**
   * Clones this image
   * @return {Rembrandt.Image}
   */
  clone () {
    const image = new Image(this.width, this.height)
    image.setImageData(this._imageData)
    return image
  }

  /**
   * Persists the image data onto the canvas
   */
  persist () {
    this._context.putImageData(this._imageData, 0, 0)
  }

  /**
   * Returns this image as a buffer
   * @return {Buffer}
   */
  toBuffer () {
    this.persist()
    return this._canvas.toBuffer()
  }

  // -------------------------------------------------------------------------- PRIVATE API

  /**
   * Draws the given Canvas.Image into this image
   * @param  {Canvas.Image} image
   * @private
   */
  _drawImage (image) {
    this._context.drawImage(image, 0, 0)
    this._imageData = this._context.getImageData(0, 0, this.width, this.height)
  }

  // -------------------------------------------------------------------------- STATIC PUBLIC API

  /**
   * Creates an image from the given Buffer
   * @param  {Buffer} buf
   * @return {Rembrandt.Image}
   */
  static fromBuffer (buf) {
    const image = new Canvas.Image()
    image.src = buf

    return new Image(image.width, image.height, image)
  }

  // -------------------------------------------------------------------------- GETTERS

  /** @return {Canvas} */
  get canvas () { return this._canvas }
  /** @return {Canvas.ImageData} */
  get imageData () { return this._imageData }
}
