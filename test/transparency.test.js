/* global Rembrandt, describe, it, beforeEach */

import fs from 'fs'
import path from 'path'

describe('Rembrandt', () => {
  describe('#compare', () => {
    describe('two transparent images', () => {
      let imageA, imageB, rembrandt

      beforeEach(() => {
        imageA = path.resolve(__dirname, 'fixtures/transparency.png')
        imageB = path.resolve(__dirname, 'fixtures/transparency.png')

        rembrandt = new Rembrandt({
          imageA: imageA,
          imageB: imageB,
          renderComposition: true,
          maxOffset: 0,
          maxThreshold: 0
        })
      })

      it('should be fulfilled with passed = true', function (done) {
        this.timeout(10000)
        rembrandt.compare()
          .then((result) => {
            fs.writeFileSync('out.png', result.compositionImage)
            result.passed.should.be.true
            result.differences.should.equal(0)
            done()
          })
          .catch((e) => done(e))
      })
    })
  })
})
