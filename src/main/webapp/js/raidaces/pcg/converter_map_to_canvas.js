//
// ConverterMapToCanvas
//
function ConverterMapToCanvas() {
}

ConverterMapToCanvas.prototype = Object.create(Object.prototype);
ConverterMapToCanvas.prototype.constructor = ConverterMapToCanvas;

//
// Methods
//

ConverterMapToCanvas.prototype.renderTo = function(map, canvas) {

	var mapContext = canvas.getContext('2d');

	var indexMapY;
	var indexMapX;

	var height = map.mapArray.length;
	for (indexMapY = 0; indexMapY < height; indexMapY++) {

		var width = map.mapArray[indexMapY].length;
		for (indexMapX = 0; indexMapX < width; indexMapX++) {

			mapContext.lineWidth = 1;
			mapContext.beginPath();
			mapContext.rect(indexMapX, indexMapY, 1, 1);

			var left = ((width / 2) - 8);
			var right = ((width / 2) + 8);
			var top = ((height / 2) - 8);
			var bottom = ((height / 2) + 8);

			if (((indexMapY >= top) && (indexMapY <= bottom) && ((top == indexMapX) || (bottom == indexMapX)))
					|| ((indexMapX >= left) && (indexMapX <= right) && ((left == indexMapY) || (right == indexMapY)))) {

				mapContext.strokeStyle = "#FFFFFF";

			} else {

				var tileValue = map.mapArray[indexMapY][indexMapX];

				if (typeof tileValue === 'undefined') {
					log("Undefined tile value at: " + indexMapX + "/"
							+ indexMapY);
					mapContext.strokeStyle = COLOR_UNDEFINED;
				} else {
					mapContext.strokeStyle = this
							.getStrokeStyleByTileValue(map.mapArray[indexMapY][indexMapX]);
					if (COLOR_UNSUPPORTED === mapContext.strokeStyle) {
						log("Unsupported tile value (" + tileValue + ") at: "
								+ indexMapX + "/" + indexMapY);
					}
				}

			}
			mapContext.stroke();
		}
	}
};

ConverterMapToCanvas.prototype.getStrokeStyleByTileValue = function(tileValue) {

	var strokeStyle = COLOR_UNSUPPORTED;

	if (0 == (TILEVALUE_HEIGHT_0 % tileValue)) {
		mapContext.strokeStyle = "#7777AA";
	} else if (0 == (TILEVALUE_HEIGHT_1 % tileValue)) {
		mapContext.strokeStyle = "#77AA77";
	} else if (0 == (TILEVALUE_HEIGHT_2 % tileValue)) {
		mapContext.strokeStyle = "#88BB88";
	} else if (0 == (TILEVALUE_HEIGHT_3 % tileValue)) {
		mapContext.strokeStyle = "#99CC99";
	} else if (0 == (TILEVALUE_HEIGHT_4 % tileValue)) {
		mapContext.strokeStyle = "#AADDAA";
	}

	return strokeStyle;
};
