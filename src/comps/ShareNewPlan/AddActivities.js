import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import AppBar from "@material-ui/core/AppBar";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Cropperd from "../Cropper";
import ButtonBase from "@material-ui/core/ButtonBase";
import DateFnsUtils from "@date-io/date-fns";
import TextField from "@material-ui/core/TextField";
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Tab from "@material-ui/core/Tab";
import MapboxAutoComplete from "../MapboxAutoComplete";
import PopOverImageEditor from "../PopOverImageEditor";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      key={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <div p={3}>{children}</div>
    </Typography>
  );
}

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  tapDisplay: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    padding: theme.spacing.unit * 2.5,
    margin: "auto",
  },
});

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

class AddActivities extends Component {
  addToExistingActivity = (e, activity, index, index_a, field) => {
    if (field !== "images") {
      if (["placeInfo", "startTime", "endTime"].includes(field) === false) {
        activity[field] = e.target.value;
      } else {
        activity[field] = e;
      }
      this.props.addActivityToDay(activity, index, index_a);
    } else {
      if (e.target.files) {
        /* Get files in array form */
        const files = Array.from(e.target.files);
        /* Map each file to a promise that resolves to an array of image URI's */
        Promise.all(
          files.map((file) => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.addEventListener("load", (ev) => {
                resolve(ev.target.result);
              });
              reader.addEventListener("error", reject);
              reader.readAsDataURL(file);
            });
          })
        ).then(
          (images) => {
            activity[field] = images;
            /* Once all promises are resolved, update state with image URI array */
            this.props.addActivityToDay(activity, index, index_a);
          },
          (error) => {
            console.error(error);
          }
        );
      }
    }
  };

  addNewActivityToExistingDay = (e, day_index) => {
    const newActivity = {
      name: "",
      address: "",
      snippit: "",
      description: "",
      images: [],
      website: "",
      rating: 0,
      tags: [],
    };
    this.props.addActivityToDay(newActivity, day_index, -1);
    window.scroll(0, 0);
  };

  addNewDay = () => {
    const newActivity = {
      name: "",
      address: "",
      snippit: "",
      description: "",
      images: [],
      website: "",
      rating: 0,
      tags: [],
      startTime: new Date(),
      endTime: new Date(),
    };
    this.props.addActivityToDay(newActivity, this.props.values.days.length);
  };

  createDays = (classes) => {
    let day = [];
    const {
      selectedDayIndex,
      days,
      anchorEl,
      visible,
      editorVisible,
      uploading,
      editImage,
    } = this.props.values;

    days.map((data, index) => {
      day.push(
        <TabPanel value={selectedDayIndex} index={index} dir={"ltr"}>
          <form className={classes.root}>
            <Paper className={classes.paper}>
              {data.activities.map((activity, index_a) => {
                return (
                  <div key={index + index_a} className="sibling-hover">
                    <IconButton onClick={this.onButtonClose}>
                      <Close />
                    </IconButton>
                    <div className="row">
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <TimePicker
                          key={index + index_a + "startTime"}
                          value={activity.startTime}
                          onChange={(e) =>
                            this.addToExistingActivity(
                              e,
                              activity,
                              index,
                              index_a,
                              "startTime"
                            )
                          }
                          label="Start Time"
                        />
                        <TimePicker
                          key={index + index_a + "endTime"}
                          value={activity.endTime}
                          onChange={(e) =>
                            this.addToExistingActivity(
                              e,
                              activity,
                              index,
                              index_a,
                              "endTime"
                            )
                          }
                          label="End Time"
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                    <div className="row">
                      <TextField
                        id="standard-location"
                        label="Enter place name"
                        onChange={(e) =>
                          this.addToExistingActivity(
                            e,
                            activity,
                            index,
                            index_a,
                            "location"
                          )
                        }
                        margin="normal"
                      />
                      <MapboxAutoComplete
                        onSelect={(place) =>
                          this.addToExistingActivity(
                            place,
                            activity,
                            index,
                            index_a,
                            "placeInfo"
                          )
                        }
                      />
                    </div>
                    <div className="row">
                      <ButtonBase
                        className={classes.image}
                        onClick={this.props.handleClick}
                      >
                        <label>
                          images
                          <div className="button">
                            <label htmlFor="multi">
                              {activity.images.length === 0 ? (
                                <FontAwesomeIcon
                                  icon={faImages}
                                  color="#6d84b4"
                                  size="10x"
                                />
                              ) : (
                                <span>
                                  <img
                                    key={index + index_a + "image"}
                                    src={activity.images[0]}
                                    alt="activity"
                                    style={{ width: "10em", height: "10em" }}
                                  />
                                </span>
                              )}
                            </label>
                            <input
                              type="file"
                              key={index + index_a}
                              onChange={(e) =>
                                this.addToExistingActivity(
                                  e,
                                  activity,
                                  index,
                                  index_a,
                                  "images"
                                )
                              }
                              multiple
                            />
                          </div>
                        </label>
                      </ButtonBase>
                      <PopOverImageEditor
                        anchorEl={anchorEl}
                        visible={visible}
                        editorVisible={editorVisible}
                        cancelUpload={this.props.cancelUpload}
                        uploading={uploading}
                        submitImages={this.props.submitImages}
                        editImage={editImage}
                        edit={this.props.edit}
                        images={activity.images}
                      />
                    </div>
                    <div className="row">
                      <TextField
                        id="filled-multiline-static"
                        label="Description"
                        fullWidth
                        multiline
                        rows="4"
                        defaultValue={data.activities[index_a].description}
                        onChange={(e) =>
                          this.addToExistingActivity(
                            e,
                            activity,
                            index,
                            index_a,
                            "description"
                          )
                        }
                        margin="normal"
                        variant="filled"
                      />
                    </div>
                  </div>
                );
              })}
              <Cropperd
                openEditor={this.props.openEditor}
                editorVisible={editorVisible}
                closeEditor={this.props.closeEditor}
                src={editImage}
                updateImage={this.props.updateImage}
              />
            </Paper>
          </form>
          {/* <SearchableMap
            bbox={bbox}
            label="Add a place"
            markers={markers}
            center={center}
            onChange={this.props.handleLocationChange}
          /> */}
          <Button
            variant="primary"
            size="lg"
            block
            onClick={(e) => this.addNewActivityToExistingDay(e, index)}
          >
            + Add Another Activity
          </Button>
        </TabPanel>
      );
    });
    return day;
  };

  saveAndContinue = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };

  back = (e) => {
    e.preventDefault();
    this.props.prevStep();
  };

  render() {
    const { classes } = this.props;
    const { selectedDayIndex, days } = this.props.values;

    return (
      <div>
        <AppBar position="static" color="white">
          <Tabs
            indicatorColor="primary"
            textColor="primary"
            value={selectedDayIndex}
            onChange={this.props.handleTapChange}
            scrollable
            scrollButtons="auto"
          >
            {days.map((data, index) => (
              <Tab
                component="div"
                key={index}
                label={
                  <div>
                    Day {index + 1}
                    <IconButton onClick={this.onButtonClose}>
                      <Close />
                    </IconButton>
                  </div>
                }
                {...a11yProps(index)}
              />
            ))}

            <Tab
              component="div"
              onClick={this.addNewDay}
              key="add new day"
              label={
                <div>
                  Add A Day
                  <IconButton onClick={this.addNewDay}>
                    <AddIcon />
                  </IconButton>
                </div>
              }
            />
          </Tabs>
          {this.createDays(classes)}

          <Button onClick={this.back}>Back</Button>
          <Button onClick={this.saveAndContinue}>Review Plan</Button>
        </AppBar>
      </div>
    );
  }
}

AddActivities.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddActivities);
