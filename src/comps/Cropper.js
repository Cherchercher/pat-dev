import React, { Component } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "material-design-icons/iconfont/material-icons.css";
/* global FileReader */
import PropTypes from "prop-types";
const src = "../assets/goodface.jpg";

export default class Cropperd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorVisible: false,
      src,
      cropResult: null,
      aspectRatio: null,
    };
    this.cropImage = this.cropImage.bind(this);
    this.rotateLeft = this.rotateLeft.bind(this);
    this.rotateRight = this.rotateRight.bind(this);
    this.sixteenNine = this.sixteenNine.bind(this);
    this.oneOne = this.oneOne.bind(this);
    this.onChange = this.onChange.bind(this);
    this.upload = this.upload.bind(this);
    this.discard = this.discard.bind(this);
  }

  componentDidMount() {
    this.setState({
      editorVisible: this.props.editorVisible,
      src: this.props.src,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.src !== nextProps.src) {
      this.setState({ src: nextProps.src });
    }

    if (this.state.editorVisible !== nextProps.editorVisible) {
      this.setState({ editorVisible: nextProps.editorVisible });
    }
  }

  onChange(e) {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ src: reader.result });
    };
    reader.readAsDataURL(files[0]);
  }

  cropImage() {
    if (typeof this.cropper.getCroppedCanvas() === "undefined") {
      return;
    }
    this.setState({
      cropResult: this.cropper.getCroppedCanvas().toDataURL(),
    });
  }

  discard = (e) => {
    e.preventDefault();
    this.props.closeEditor();
  };

  upload = (e) => {
    e.preventDefault();
    console.log(this.cropper.getCroppedCanvas().toDataURL());
    this.props.updateImage(
      this.state.src,
      this.cropper.getCroppedCanvas().toDataURL()
    );
  };
  rotateLeft() {
    if (typeof this.cropper.getCroppedCanvas() === "undefined") {
      return;
    }
    console.log(this.cropper);
    this.setState({
      cropResult: this.cropper.rotate(-90),
    });
  }

  sixteenNine() {
    if (typeof this.cropper.getCroppedCanvas() === "undefined") {
      return;
    }
    this.setState({
      aspectRatio: 16 / 9,
    });
  }
  oneOne() {
    if (typeof this.cropper.getCroppedCanvas() === "undefined") {
      return;
    }
    this.setState({
      aspectRatio: 1 / 1,
    });
  }
  rotateRight() {
    if (typeof this.cropper.getCroppedCanvas() === "undefined") {
      return;
    }
    this.setState({
      cropResult: this.cropper.rotate(90),
    });
  }

  render() {
    const { aspectRatio, editorVisible } = this.state;
    console.log(editorVisible);
    return (
      <div
        className={editorVisible ? "cropperFull" : "hidden cropperFull"}
        style={{ background: "black" }}
      >
        <div style={{ width: "100%", background: "black" }}>
          <br />
          <br />
          <Cropper
            style={{ height: 400, width: "100%" }}
            aspectRatio={aspectRatio}
            preview=".img-preview"
            guides={false}
            src={this.state.src}
            ref={(cropper) => {
              this.cropper = cropper;
            }}
          />
        </div>
        <div>
          <div className="box" style={{ width: "50%" }}>
            <button onClick={this.cropImage} className="imButton">
              <i className="material-icons">crop</i>
            </button>
            <button onClick={this.rotateRight} className="imButton">
              <i className="material-icons">rotate_right</i>
            </button>
            <button onClick={this.rotateLeft} className="imButton">
              <i className="material-icons">rotate_left</i>
            </button>
            <button onClick={this.sixteenNine} className="imButton">
              16:9
            </button>
            <button onClick={this.oneOne} className="imButton">
              1:1
            </button>

            <button className="imButtonRight" onClick={this.upload}>
              Save
            </button>
            <button className="imButtonRight" onClick={this.discard}>
              Discard
            </button>
          </div>
        </div>
        <br style={{ clear: "both" }} />
      </div>
    );
  }
}

Cropperd.propTypes = {
  classes: PropTypes.object.isRequired,
};
