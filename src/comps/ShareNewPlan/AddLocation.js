import React, { Component } from "react";
import { Button } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import PropTypes from "prop-types";
import PopOverImageEditor from "../PopOverImageEditor";
import SearchableMap from "../SearchableMap";
import Cropperd from "../Cropper";
import { withStyles } from "@material-ui/core/styles";
import { WithContext as ReactTags } from "react-tag-input";

const KeyCodes = {
  comma: 188,
  enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    margin: "auto"
  },
  name: {
    fontSize: "20px",
    fontWeight: "bold",
    width: 130
  },
  snippet: {
    background: "white",
    marginTop: "10px",
    fontSize: "15px",
    width: "70%"
  },
  imageInput: {
    fontSize: "10px",
    width: "80%"
  },
  icon: {
    margin: 6
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%"
  },
  map: {
    marginBottom: "50px"
  },
  input: {
    color: "black"
  }
});

class AddLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  saveAndContinue = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  cancelUpload = e => {
    e.preventDefault();
    this.props.cancelUpload();
  };

  /* input*/
  render() {
    const { classes } = this.props;
    const { values } = this.props;
    if (this.state.mounted) {
      return (
        <form className={classes.root}>
          <Paper className={classes.paper}>
            <Grid container spacing={16}>
              <Grid item xs={12} md={6} className={classes.map}>
                <SearchableMap
                  label="Enter city"
                  center={values.center}
                  markers={values.markers}
                  bbox={values.location.bbox}
                  onChange={this.props.handleLocationChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <ButtonBase
                  className={classes.image}
                  onClick={this.props.handleClick}
                >
                  <label>
                    Featured Images
                    <div className="button">
                      <label htmlFor="multi">
                        {values.images.length === 0 ? (
                          <FontAwesomeIcon
                            icon={faImages}
                            color="#6d84b4"
                            size="10x"
                          />
                        ) : (
                          <span>
                            <img
                              key={"location" + values.images[0]}
                              src={values.images[0]}
                              alt="featured"
                              style={{ width: "10em", height: "10em" }}
                            />
                          </span>
                        )}
                      </label>
                      <input
                        type="file"
                        id={"multiple location input"}
                        onChange={this.props.onChangeImage}
                        multiple
                      />
                    </div>
                  </label>
                </ButtonBase>
                <PopOverImageEditor
                  anchorEl={values.anchorEl}
                  visible={values.visible}
                  editorVisible={values.editorVisible}
                  cancelUpload={this.props.cancelUpload}
                  uploading={values.uploading}
                  submitImages={this.props.submitImages}
                  editImage={values.editImage}
                  edit={this.props.edit}
                  images={values.images}
                />
              </Grid>
              <Grid item xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    value={values.startDate}
                    label="Start Date"
                    format="MM/dd/yyyy"
                    onChange={this.props.handleStartDate}
                  />
                  <DatePicker
                    value={values.endDate}
                    label="End Date"
                    format="MM/dd/yyyy"
                    onChange={this.props.handleEndDate}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>
                  <TextField
                    className={classes.snippet}
                    id="filled-multiline-static"
                    label="Description"
                    multiline
                    rows="4"
                    defaultValue="Add a description for the city"
                    onChange={this.props.handleChange("description")}
                    margin="normal"
                    InputProps={{
                      className: classes.input
                    }}
                    variant="filled"
                  />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  <TextField
                    id="standard-spending"
                    label="Estimated Spending"
                    className={classes.name}
                    value={values.spend}
                    onChange={this.props.handleChange("spend")}
                    margin="normal"
                  />
                </Typography>
                <ReactTags
                  tags={this.props.tags}
                  suggestions={this.props.suggestions}
                  handleDelete={this.props.handleDelete}
                  handleAddition={this.props.handleAddition}
                  delimiters={delimiters}
                />
              </Grid>

              <Grid container>
                <Button onClick={this.saveAndContinue} item xs={6}>
                  {" "}
                  Continue{" "}
                </Button>
              </Grid>
            </Grid>

            <Cropperd
              openEditor={this.props.openEditor}
              editorVisible={values.editorVisible}
              closeEditor={this.props.closeEditor}
              src={values.editImage}
              updateImage={this.props.updateImage}
            />
          </Paper>
        </form>
      );
    } else {
      return null;
    }
  }
}

AddLocation.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AddLocation);
