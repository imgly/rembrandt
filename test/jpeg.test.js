/* global Rembrandt, describe, it, beforeEach */

import path from 'path'

describe('Rembrandt', () => {
  describe('#compare', () => {
    describe('two very similar JPEG images', () => {
      let imageA, imageB, rembrandt

      beforeEach(() => {
        imageA = path.resolve(__dirname, 'fixtures/jpeg-1.png')
        imageB = path.resolve(__dirname, 'fixtures/jpeg-2.png')

        rembrandt = new Rembrandt({
          imageA: imageA,
          imageB: imageB,
          renderComposition: true,
          maxOffset: 2
        })
      })

      it('should be fulfilled with passed = true', (done) => {
        rembrandt.compare()
          .then((result) => {
            result.passed.should.be.true
            result.differences.should.equal(147)
            done()
          })
          .catch((e) => done(e))
      })
    })
  })
})
