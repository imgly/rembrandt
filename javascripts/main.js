$(function(){
	function dropZone($target, onDrop){
		$target.
			bind('dragover', function(){
				$target.addClass( 'drag-over' );
				return false;
			}).
			bind("dragend", function () {
				$target.removeClass( 'drag-over' );
				return false;
			}).
			bind("dragleave", function () {
				$target.removeClass( 'drag-over' );
				return false;
			}).
			bind("drop", function(event) {
				var file = event.originalEvent.dataTransfer.files[0];

				event.stopPropagation();
				event.preventDefault();

				$target.removeClass( 'drag-over' );

				var droppedImage = new Image();
				var fileReader = new FileReader();
        var bufferReader = new FileReader();

				fileReader.onload = function (event) {
					droppedImage.src = event.target.result;
					$target.html(droppedImage);
          $target.addClass('drop-active');
          $target.css('height', droppedImage.height + 20); // thickness of border
          onDrop(event.target.result);
				};

				fileReader.readAsDataURL(file);

			});
	}
  var dropZoneOne = $('#dropzone1');
  var dropZoneTwo = $('#dropzone2');
  var file1;
  var file2;

  dropZone(dropZoneOne, function(file){

    file1 = file
    if(file2) {
      var rembrandt = new Rembrandt({
      // `imageA` and `imageB` can be either Strings (file path on node.js,
      // public url on Browsers) or Buffers
      imageA: file1,
      imageB: file2,

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
        onComplete(result);

        // Note that `compositionImage` is an Image when Rembrandt.js is run in the browser environment
      })
      .catch((e) => {
        console.error(e)
      })
    }
  });

  dropZone(dropZoneTwo, function(file){
    file2 = file
    if(file1) {
      var rembrandt = new Rembrandt({
      // `imageA` and `imageB` can be either Strings (file path on node.js,
      // public url on Browsers) or Buffers
      imageA: file1,
      imageB: file2,

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

    window.rembrandt = rembrandt;
    // Run the comparison
    rembrandt.compare()
      .then(function (result) {
        onComplete(result);
        window.result = result;
        // Note that `compositionImage` is an Image when Rembrandt.js is run in the browser environment
      })
      .catch((e) => {
        console.error(e)
      })
    }
  });

  function onComplete(result) {

    $('.passed-result').text(result.passed);
    if(result.passed) {
      $('.passed-result').removeClass('wrong');
      $('.passed-result').addClass('right');
    } else {
      $('.passed-result').removeClass('right');
      $('.passed-result').addClass('wrong');
    }
    var percentage = (result.threshold * 100).toFixed(2) + '%'
    $('.percentage-result').text(percentage);

    $('.results').show();
    $('.comparison-image').html(result.compositionImage);
  }
});
