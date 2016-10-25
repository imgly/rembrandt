/**
 * This file is part of Rembrandt.js
 * Copyright (c) 2016 PhotoEditorSDK.com
 * Licensed under MIT license (https://opensource.org/licenses/MIT)
 */

export default class Utils {
  /**
   * Assigns own enumerable properties of source object(s) to the destination
   * object for all destination properties that resolve to undefined. Once a
   * property is set, additional values of the same property are ignored.
   * @param  {Object} object
   * @param  {Object} ...sources
   * @return {Object}
   */
  static defaults (object, ...sources) {
    // Shallow clone
    let newObject = {}
    for (let key in object) {
      newObject[key] = object[key]
    }

    // Clone sources
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i]
      for (let key in source) {
        if (typeof newObject[key] === 'undefined') {
          newObject[key] = source[key]
        }
      }
    }

    return newObject
  }
}
