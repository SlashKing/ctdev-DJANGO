// From README of: https://github.com/DominicTobias/react-image-crop

export function loadImage(src,crop,maxWidth,maxHeight) {
		var image = new Image();
			image.src = src;
			image = this.cropAfterLoad(image,crop,maxWidth,maxHeight);
			return image;
		
	}
export function scale(options) {
		var scale = options.scale ||
			Math.min(options.maxWidth/options.width, options.maxHeight/options.height);
	
		scale = Math.min(scale, options.maxScale || 1);
	
		return {
			scale: scale,
			width: options.width * scale,
			height: options.height * scale
		};
	}
export function cropAfterLoad (loadedImg,crop,maxWidth,maxHeight) {
			var imageWidth = loadedImg.naturalWidth;
			var imageHeight = loadedImg.naturalHeight;
			console.log(crop)
			var cropX = (crop.x / 100) * imageWidth;
			var cropY = (crop.y / 100) * imageHeight;
			
			const imageAspect = imageWidth / imageHeight;
			console.log(imageAspect)
			//if (crop.width) {
			  //crop.height = (crop.width / crop.aspect !== undefined ? 1: imageAspect) * imageAspect;
			//} else if (crop.height) {
			  //crop.width = (crop.height * crop.aspect !== undefined ? 1: imageAspect) / imageAspect;
			//}
			var cropWidth = (crop.width / 100) * imageWidth 
			var cropHeight = (crop.height / 100) * imageHeight
				
	
			var destWidth = cropWidth;
			var destHeight = cropHeight;
	
			if (maxWidth || maxHeight) {
				// Scale the crop.
				var scaledCrop = this.scale({
					width: cropWidth,
					height: cropHeight,
					maxWidth: maxWidth,
					maxHeight: maxHeight
				});
	
				destWidth = scaledCrop.width;
				destHeight = scaledCrop.height;
			}
	
			var canvas = document.createElement('canvas');
			canvas.width = destWidth;
			canvas.height = destHeight;
			var ctx = canvas.getContext('2d');
			ctx.fillStyle = "#707070";
			ctx.fillRect(0,0,imageWidth,imageHeight);
			console.log(cropX, cropY, cropWidth, cropHeight, 0, 0, destWidth, destHeight)
			ctx.drawImage(loadedImg, cropX, cropY, cropWidth, cropHeight, 0, 0, destWidth, destHeight);
		
			loadedImg = canvas.toDataURL(loadedImg.type === 'image/png' ? 'image/png':'image/jpeg',1.0);
			console.log(loadedImg)
			return loadedImg;
		}
export function	cropImage(imgDest, imgSrc, crop, maxWidth, maxHeight) {
		return this.loadImage(imgSrc,crop,maxWidth,maxHeight) 
	}
