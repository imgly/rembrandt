<p align="center">
  <a href="https://pesdk-slack.herokuapp.com/">
    <img src="https://pesdk-slack.herokuapp.com/badge.svg" alt="Slack Status" />
  </a>
</p>

## Rembrandt.JS - Client- and server-side image comparison library

Rembrandt.JS is a image comparison library that works both with the
HTML5 Canvas2D API as well as the drop-in Node.JS replacement
`node-canvas`.

We created Rembrandt.JS to have an easy-to-use image comparison
library for our internal tests for [PhotoEditorSDK](https://www.photoeditorsdk.com).
Go check it out. It's really awesome. :)

### Installation

For server-side usage, you will need to follow the installation
instructions over at [node-canvas](https://github.com/Automattic/node-canvas#installation).
Afterwards, just run:

`npm install rembrandt`

### Usage

Here is an example (ES6 / ES2015):

```js
import Rembrandt from 'rembrandt'

const rembrandt = new Rembrandt({
  // `imageA` and `imageB` can be either Strings or Buffers
  imageA: '/path/to/imageA',
  imageB: fs.readFileSync('/path/to/imageB'),

  // Needs to be one of Rembrandt.THRESHOLD_PERCENT or Rembrandt.THRESHOLD_PIXELS
  thresholdType: Rembrandt.THRESHOLD_PERCENT,

  // The maximum threshold (0...1 for THRESHOLD_PERCENT, pixel count for THRESHOLD_PIXELS
  maxThreshold: 0.01,

  // Maximum color delta (0...255):
  maxDelta: 20
})

// Run the comparison
rembrandt.compare()
  .then(function (result) {
    console.log('Passed:', result.passed)
    console.log('Difference:', (result.difference * 100).toFixed(2), '%')
  })
  .catch((e) => {
    console.error(e)
  })
```

### License
See [LICENSE.md](LICENSE.md)

### Authors and Contributors
Copyright (c) 2016 by [PhotoEditorSDK.com](https://www.photoeditorsdk.com)
