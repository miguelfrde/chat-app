import {Platform} from 'ionic/ionic';
import {Injectable} from 'angular2/core';


@Injectable()
export class CameraProvider {
	constructor(public platform: Platform) {}

  takePicture(cb) {
		this.platform.ready().then(() => {
      navigator.camera.getPicture((data) => {
      	cb(data);
		  }, (error) => {console.log('Error'); }, {
		  	quality: 80,
		  	destinationType: Camera.DestinationType.DATA_URL,
		  	sourceType: Camera.PictureSourceType.CAMERA,
		  	allowEdit: false,
		  	encodingType: Camera.EncodingType.JPEG,
		  	saveToPhotoAlbum: false
		  });
		});
  }
}
