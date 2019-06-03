import React from 'react';
import './App.css';

import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      src: null,
      crop: {
        x: 10,
        y: 10,
        aspect: 360 / 187,
      },
      croppedImageUrl: ''
    };

    this.onCropComplete = this.onCropComplete.bind(this);
    this.onCropChange = this.onCropChange.bind(this);
    this.makeClientCrop = this.makeClientCrop.bind(this);
    this.getCroppedImg = this.getCroppedImg.bind(this);

  }

  makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      this.getCroppedImg(
        this.imageRef,
        crop,
        'newFile.jpeg',
      ).then(croppedImageUrl => this.setState({ croppedImageUrl }));
    }
  }


  onCropComplete = (crop) => {
    console.log('onCropComplete', crop);
    this.makeClientCrop(crop);
  }

  onCropChange = (crop) => {
    // console.log('onCropChange', crop);
    this.setState({ crop });
  }

  onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.setState({ src: reader.result });
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  onImageLoaded = (image) => {
    this.imageRef = image;
    console.log(image.height + '/' + image.width)
    this.makeClientCrop(this.state.crop);
    this.setState({ crop: { x: 80, y: 80, width: 80 } })
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        blob.name = fileName; // eslint-disable-line no-param-reassign
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/jpeg');
    });
  }



  render() {
    return (
      <div className="App">
        <div id="cropped-image">
          {this.state.croppedImageUrl?
            <img crossOrigin="Anonymous" src={this.state.croppedImageUrl} alt="cropped" />:
            <input type="file" onChange={this.onSelectFile} />}
          {this.state.croppedImageUrl && <a href={this.state.croppedImageUrl} download><button>Download</button></a>}
        </div>
        <ReactCrop className="crop-editor" src={this.state.src}
          crop={this.state.crop}
          onImageLoaded={this.onImageLoaded}
          onComplete={this.onCropComplete}
          onChange={this.onCropChange}
        />
      </div>
    );
  }

}

export default App;
