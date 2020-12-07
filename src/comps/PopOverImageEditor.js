import React, { Component } from "react";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Loading from "react-loading-animation";

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
  },
});

class PopOverImageEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  saveAndContinue = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };

  cancel = (e) => {
    e.preventDefault();
    this.props.cancelUpload();
  };

  edit(url) {
    this.props.edit(url);
  }

  remove(index) {
    var arr = this.props.images;
    arr.splice(index, 1);
    this.setState({
      images: arr,
    });
  }

  render() {
    const { anchorEl, images, uploading, editorVisible } = this.props;
    const open = Boolean(anchorEl) && uploading && !editorVisible;
    const { classes } = this.props;
    if (this.state.mounted === true) {
      return (
        <Popover
          id="simple-popper"
          open={open}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              onClick={this.props.submitImages}
              component="span"
              className={classes.button}
            >
              Save
            </Button>
            <Button
              variant="contained"
              onClick={this.cancel}
              component="span"
              className={classes.button}
            >
              cancel
            </Button>
          </label>
          <div className="images-container">
            {images.map((imageURI, index) => (
              <div className="photo-container" key={imageURI}>
                <img
                  className="photo-uploaded image"
                  src={imageURI}
                  alt="uploaded"
                />
                <span className="close" onClick={() => this.remove(index)}>
                  <i className="material-icons">close</i>
                </span>
                <span
                  className="middle"
                  onClick={() => this.edit(imageURI, index)}
                >
                  <i className="material-icons">edit</i>
                </span>
              </div>
            ))}
          </div>
        </Popover>
      );
    } else {
      return <Loading />;
    }
  }
}

PopOverImageEditor.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PopOverImageEditor);
