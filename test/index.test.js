/* global Rembrandt, describe, it, beforeEach */
const { Color } = Rembrandt

describe('Rembrandt', () => {
  describe('#compare', () => {
    describe('when images are identical', () => {
      let imageA, imageB, rembrandt

      beforeEach(() => {
        imageA = Rembrandt.createImage(2, 2)
        imageA.setColorAt(0, 0, Color.RED)
        imageA.setColorAt(1, 0, Color.WHITE)
        imageA.setColorAt(0, 1, Color.BLACK)
        imageA.setColorAt(1, 1, Color.RED)

        imageB = imageA.clone()

        rembrandt = new Rembrandt({
          imageA: imageA,
          imageB: imageB,
          thresholdType: Rembrandt.THRESHOLD_PIXELS,
          maxThreshold: 0
        })
      })

      it('should be fulfilled with passed = true', (done) => {
        rembrandt.compare()
          .then((result) => {
            result.passed.should.be.true
            result.threshold.should.equal(0)
            done()
          })
          .catch((e) => done(e))
      })
    })

    describe('when images are not identical', () => {
      let imageA, imageB, rembrandt

      beforeEach(() => {
        imageA = Rembrandt.createImage(2, 2)
        imageA.setColorAt(0, 0, Color.WHITE)
        imageA.setColorAt(1, 0, Color.WHITE)
        imageA.setColorAt(0, 1, Color.WHITE)
        imageA.setColorAt(1, 1, Color.RED)

        imageB = Rembrandt.createImage(2, 2)
        imageB.setColorAt(0, 0, Color.BLACK)
        imageB.setColorAt(1, 0, Color.BLACK)
        imageB.setColorAt(0, 1, Color.BLACK)
        imageB.setColorAt(1, 1, Color.RED)
      })

      describe('without composition image', () => {
        beforeEach(() => {
          rembrandt = new Rembrandt({
            imageA: imageA,
            imageB: imageB,
            thresholdType: Rembrandt.THRESHOLD_PIXELS,
            maxThreshold: 0
          })
        })

        it('should be fulfilled with passed = false and thresholds = 3', (done) => {
          rembrandt.compare()
            .then((result) => {
              result.passed.should.be.false
              result.threshold.should.equal(3)
              done()
            })
            .catch((e) => done(e))
        })
      })

      describe('with composition image', () => {
        beforeEach(() => {
          rembrandt = new Rembrandt({
            imageA: imageA,
            imageB: imageB,
            thresholdType: Rembrandt.THRESHOLD_PIXELS,
            maxThreshold: 0,
            renderComposition: true
          })
        })

        it('should be fulfilled with `compositionImage`', (done) => {
          rembrandt.compare()
            .then((result) => {
              result.passed.should.be.false
              result.threshold.should.equal(3)
              result.should.have.property('compositionImage')

              done()
            })
            .catch((e) => done(e))
        })
      })
    })

    describe('when images have different dimensions', () => {
      let imageA, imageB, rembrandt

      beforeEach(() => {
        imageA = Rembrandt.createImage(2, 2)
        imageA.setColorAt(0, 0, Color.WHITE)
        imageA.setColorAt(1, 0, Color.WHITE)
        imageA.setColorAt(0, 1, Color.WHITE)
        imageA.setColorAt(1, 1, Color.RED)

        imageB = Rembrandt.createImage(3, 3)
        imageB.setColorAt(0, 0, Color.WHITE)
        imageB.setColorAt(1, 0, Color.WHITE)
        imageB.setColorAt(2, 0, Color.WHITE)
        imageB.setColorAt(0, 1, Color.WHITE)
        imageB.setColorAt(1, 1, Color.RED)
        imageB.setColorAt(2, 1, Color.WHITE)
        imageB.setColorAt(0, 2, Color.WHITE)
        imageB.setColorAt(1, 2, Color.WHITE)
        imageB.setColorAt(2, 2, Color.WHITE)

        rembrandt = new Rembrandt({
          imageA,
          imageB,
          thresholdType: Rembrandt.THRESHOLD_PIXELS,
          maxThreshold: 0
        })
      })

      it('should compare against the larger one', (done) => {
        rembrandt.compare()
          .then((result) => {
            result.passed.should.be.false
            result.threshold.should.equal(5)
            done()
          })
          .catch((e) => done(e))
      })
    })
  })
})
