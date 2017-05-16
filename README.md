<p align="center">
  <a href="https://travis-ci.org/imgly/rembrandt">
    <img src="https://img.shields.io/travis/imgly/rembrandt.svg" alt="TravisCI Status" />
  </a>
  <a href="https://pesdk-slack.herokuapp.com/">
    <img src="https://pesdk-slack.herokuapp.com/badge.svg" alt="Slack Status" />
  </a>
</p>

## Rembrandt.JS - Client- and server-side image comparison library

<p align="center">
  <img src="http://s3.amazonaws.com/pesdk/rembrandt.png" alt="Rembrandt" />
</p>

Rembrandt.JS is a image comparison library that works both with the
HTML5 Canvas2D API as well as the drop-in Node.JS replacement
`node-canvas`.

We created Rembrandt.JS to have an easy-to-use image comparison
library for our internal tests for [PhotoEditorSDK](https://www.photoeditorsdk.com/?utm_campaign=Projects&utm_source=Github&utm_medium=Side_Projects&utm_content=Rembrandt&utm_term=HTML5).
Go check it out. It's really awesome. :)

### Installation

#### Node.JS

Please follow the installation instructions over at [node-canvas](https://github.com/Automattic/node-canvas#installation)
in order to correctly install all required system libraries. Afterwards, just run:

`npm install rembrandt`

#### Browser

Download the latest build from our [Releases page](https://github.com/imgly/rembrandt/releases), then
include it like this:

```html
<script src="/path/to/rembrandt.min.js"></script>
```

The `Rembrandt` JavaScript variable is now globally available.

#### Using module bundlers like Webpack etc.

Install Rembrandt via `npm install rembrandt`, then require it inside your JavaScript like so:

```js
var Rembrandt = require('rembrandt/build/browser')
```

### Usage

Here is an example (ES6 / ES2015):

```js
import Rembrandt from 'rembrandt'

const rembrandt = new Rembrandt({
  // `imageA` and `imageB` can be either Strings (file path on node.js,
  // public url on Browsers) or Buffers
  imageA: '/path/to/imageA',
  imageB: fs.readFileSync('/path/to/imageB'),

  // Needs to be one of Rembrandt.THRESHOLD_PERCENT or Rembrandt.THRESHOLD_PIXELS
  thresholdType: Rembrandt.THRESHOLD_PERCENT,

  // The maximum threshold (0...1 for THRESHOLD_PERCENT, pixel count for THRESHOLD_PIXELS
  maxThreshold: 0.01,

  // Maximum color delta (0...255):
  maxDelta: 20,

  // Maximum surrounding pixel offset
  maxOffset: 0,

  renderComposition: true, // Should Rembrandt render a composition image?
  compositionMaskColor: Rembrandt.Color.RED // Color of unmatched pixels
})

// Run the comparison
rembrandt.compare()
  .then(function (result) {
    console.log('Passed:', result.passed)
    console.log('Pixel Difference:', result.differences, 'Percentage Difference', result.percentageDifference, '%')
    console.log('Composition image buffer:', result.compositionImage)

    // Note that `compositionImage` is an Image when Rembrandt.js is run in the browser environment
  })
  .catch((e) => {
    console.error(e)
  })
```

### License
See [LICENSE.md](LICENSE.md)

### Authors and Contributors
Copyright (c) 2016 by [PhotoEditorSDK.com](https://www.photoeditorsdk.com/?utm_campaign=Projects&utm_source=Github&utm_medium=Side_Projects&utm_content=Rembrandt&utm_term=HTML5)
