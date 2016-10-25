/**
 * This file is part of Rembrandt.js
 * Copyright (c) 2016 PhotoEditorSDK.com
 * Licensed under MIT license (https://opensource.org/licenses/MIT)
 */

/**
 * Represents a color
 * @class
 * @memberof Rembrandt
 */
class Color {
  /**
   * Creates a color
   * @param  {Number} r
   * @param  {Number} g
   * @param  {Number} b
   * @param  {Number} [a = 1]
   */
  constructor (r, g, b, a = 1.0) {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
  }

  /**
   * Returns a clone of the current color
   * @return {Rembrandt.Color}
   */
  clone () {
    return new Color(this.r, this.g, this.b, this.a)
  }

  /**
   * Checks if this color equals the given one
   * @param  {Rembrandt.Color} color
   * @return {Boolean}
   */
  equals (color) {
    return this.r === color.r &&
      this.g === color.g &&
      this.b === color.b &&
      this.a === color.a
  }

  /**
   * Returns the string representation of this color
   * @returns {String}
   */
  toString () {
    return `Color(${this.r}, ${this.g}, ${this.b}, ${this.a})`
  }

  /**
   * @type {Rembrandt.Color}
   */
  static get TRANSPARENT () { return new Color(0, 0, 0, 0) }

  /**
   * @type {Rembrandt.Color}
   */
  static get WHITE () { return new Color(1, 1, 1, 1) }

  /**
   * @type {Rembrandt.Color}
   */
  static get BLACK () { return new Color(0, 0, 0, 1) }

  /**
   * @type {Rembrandt.Color}
   */
  static get RED () { return new Color(1, 0, 0, 1) }
}

export default Color
