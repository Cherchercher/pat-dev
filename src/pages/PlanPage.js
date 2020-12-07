import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Loading from "react-loading-animation";
import { Button } from "react-bootstrap";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import SwipeableViews from "react-swipeable-views";
import AppBar from "@material-ui/core/AppBar";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loadAllTags, loadAllParentTags } from "../action/tagActions";
import { addGuide, initProfile } from "../action/userActions";
import AddActivities from "../comps/ShareNewPlan/AddActivities";
import AddLocation from "../comps/ShareNewPlan/AddLocation";
import ReviewPlans from "../comps/ShareNewPlan/ReviewPlans";
import Success from "../comps/ShareNewPlan/Success";

function getIndex(value, arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === value) {
      return i;
    }
  }
  return -1; //to handle the case where the value doesn't exist
}

const styles = (theme) => ({
  root: {
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: "150px",
    [theme.breakpoints.up("sm")]: {
      marginTop: "200px",
    },
    [theme.breakpoints.up("md")]: {
      marginTop: "200px",
    },
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <div>{children}</div>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}
//add tags and date of plan
class PlanPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      tabValue: 0,
      selectedDayIndex: 0,
      selectedActivityIndex: 0,
      description: "",
      location: "",
      city: "",
      bbox: null,
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 48),
      mounted: false,
      tags: [],
      suggestions: [],
      spend: 0,
      anchorEl: null,
      editorVisible: false,
      images: [],
      center: [0, 0],
      editImage: "",
      markers: [],
      country: "",
      days: [
        {
          activities: [
            {
              name: "",
              address: "",
              snippit: "",
              description: "",
              images: [],
              website: "",
              rating: 0,
              tags: [],
              startTime: new Date(
                new Date().getDate() + 1000 * 60 * 60 * 24
              ).setHours(10, 0, 0),
              endTime: new Date(
                new Date().getDate() + 1000 * 60 * 60 * 42
              ).setHours(20, 0, 0),
            },
          ],
        },
      ],
    };
  }

  componentDidMount() {
    const { isAuthenticated, getProfile, getParseProfile } = this.props.auth;
    if (isAuthenticated()) {
      if (!this.props.profile.userProfile || !this.props.profile.parseProfile) {
        getProfile(async (err, profile) => {
          if (profile) {
            const parseUser = await getParseProfile(profile);
            this.props.initProfile(profile, parseUser);
          }
        });
      }
      this.props.loadAllTags();
      this.props.loadAllParentTags();
      this.setState({
        mounted: true,
      });
    } else {
      localStorage.setItem("prevPath", "/plans");
      this.props.auth.login();
    }
  }

  handleStartDate = (date) => {
    this.setState({ startDate: date });
  };

  handleEndDate = (date) => {
    this.setState({ endDate: date });
  };

  handleDelete = (i) => {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    });
  };

  addActivityToDay = (activity, day, index_a) => {
    //if day index is equal or greater than len(this.state.days)
    if (day >= this.state.days.length) {
      this.setState((state) => ({
        days: [...state.days, { activities: [activity] }],
      }));
    } else {
      const prevDays = this.state.days;
      var newActivities = prevDays[day].activities;
      if (index_a !== -1) {
        newActivities[index_a] = activity;
      } else {
        newActivities.push(activity);
      }

      this.setState((state) => ({
        days: [
          ...prevDays.slice(0, day),
          { activities: newActivities },
          ...prevDays.slice(day + 1),
        ],
      }));
      //add activity to existing day
    }
  };

  handleAddition = (tag) => {
    this.setState((state) => ({ tags: [...state.tags, tag] }));
  };

  handleTapChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  handleDayTapChange = (event, value) => {
    this.setState({ selectedDayIndex: value });
  };

  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1,
    });
  };

  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1,
    });
  };

  handleChangeIndex = (index) => {
    this.setState({ tabValue: index });
  };

  handleChangeDayIndex = (index) => {
    this.setState({ selectedDayIndex: index });
  };

  /*this.state.back4app.create("Plan", {
      start: new Date(data.days[0].date + "Z"),
      end: new Date(data.days[data.days.length - 1].date + "Z"),
      days: data.days.length,
      location: data.location.name,
      spend: this.state.bud,
      userID: localStorage.getItem("id_token")
    });*/

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  handleLocationChange = (value, center, bbox, label) => {
    this.setState({ location: { value: value, bbox: bbox }, center: center });
  };

  edit = (url) => {
    this.setState({
      editImage: url,
      editorVisible: true,
    });
  };

  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  updateImage = (src, newUrl) => {
    const index = getIndex(src, this.state.images);
    if (index !== -1) {
      var newArray = this.state.images;
      newArray[index] = newUrl;
      this.setState({
        images: newArray,
        editorVisible: false,
      });
    }
  };

  onChangeImage = (e) => {
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
          /* Once all promises are resolved, update state with image URI array */
          this.setState({
            uploading: true,
            images: images,
          });
        },
        (error) => {
          console.error(error);
        }
      );
    }

    // const formData = new FormData();

    // files.forEach((file, i) => {
    //   formData.append(i, file);
    // });

    // fetch(`image-upload`, {
    //   method: "POST",
    //   body: formData
    // })
    //   .then(res => res.json())
    //   .then(images => {
    //     this.setState({
    //       uploading: false,
    //       images
    //     });
    //   });
  };

  cancelUpload = () => {
    this.setState({ images: [], uploading: false });
  };

  removeImage = (id) => {
    this.setState({
      images: this.state.images.filter((image) => image.public_id !== id),
    });
  };

  openEditor = () => {
    this.setState({
      editorVisible: true,
    });
  };
  closeEditor = () => {
    this.setState({
      editorVisible: false,
    });
  };
  render() {
    const { step } = this.state;
    const { classes } = this.props;
    const {
      location,
      city,
      country,
      description,
      spend,
      locationTags,
      days,
      uploading,
      tabValue,
      selectedDayIndex,
      images,
      editorVisible,
      editImage,
      anchorEl,
      center,
      bbox,
      startDate,
      endDate,
      markers,
    } = this.state;
    const values = {
      uploading,
      startDate,
      endDate,
      selectedDayIndex,
      location,
      city,
      editImage,
      country,
      description,
      spend,
      locationTags,
      days,
      editorVisible,
      images,
      anchorEl,
      center,
      bbox,
      markers,
    };

    if (this.state.mounted) {
      var suggestions = this.props.parentTags;
      suggestions.push(...this.props.tags);
      return (
        <Container className={classes.root}>
          <Button variant="primary"> Add New Plans</Button>
          <div style={styles.tapDisplay}>
            <AppBar position="static" color="white">
              <Tabs
                value={this.tabValue}
                onChange={this.handleTapChange}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="Me" {...a11yProps(0)} />
                <Tab label="Explore" {...a11yProps(1)} />
                {/* <Tab label="Friends" {...a11yProps(1)} /> */}
              </Tabs>
            </AppBar>
            <SwipeableViews
              axis={"x"}
              index={tabValue}
              onChangeIndex={this.handleChangeIndex}
            >
              <TabPanel value={tabValue} index={0} dir={"ltr"}>
                {(() => {
                  switch (step) {
                    case 1:
                      return (
                        <AddLocation
                          openEditor={this.openEditor}
                          closeEditor={this.closeEditor}
                          nextStep={this.nextStep}
                          updateImage={this.updateImage}
                          cancelUpload={this.cancelUpload}
                          tags={this.state.tags}
                          edit={this.edit}
                          handleDelete={this.handleDelete}
                          handleAddition={this.handleAddition}
                          handleClick={this.handleClick}
                          handleStartDate={this.handleStartDate}
                          handleEndDate={this.handleEndDate}
                          suggestions={suggestions}
                          submitImages={this.handleClose}
                          handleChange={this.handleChange}
                          handleLocationChange={this.handleLocationChange}
                          onChangeImage={this.onChangeImage}
                          values={values}
                        />
                      );
                    case 2:
                      return (
                        <AddActivities
                          addActivityToDay={this.addActivityToDay}
                          selectedDayIndex={selectedDayIndex}
                          handleClick={this.handleClick}
                          handleClose={this.handleClose}
                          nextStep={this.nextStep}
                          prevStep={this.prevStep}
                          edit={this.edit}
                          handleLocationChange={this.handleLocationChange}
                          handleTapChange={this.handleDayTapChange}
                          handleChange={this.handleChange}
                          values={values}
                        />
                      );
                    case 3:
                      return (
                        <ReviewPlans
                          addGuide={this.props.addGuide}
                          nextStep={this.nextStep}
                          prevStep={this.prevStep}
                          cancelUpload={this.cancelUpload}
                          values={values}
                        />
                      );

                    case 4:
                      return <Success />;
                    default:
                      return null;
                  }
                })()}
              </TabPanel>
              <TabPanel value={this.state.tabValue} index={1} dir={"ltr"}>
                <p> No Plans yet </p>
                <Button variant="primary">
                  {" "}
                  Invite Friends to Plan A Trip
                </Button>
                <p> suggestions</p>
              </TabPanel>
              <TabPanel value={this.state.tabValue} index={2} dir={"ltr"}>
                <p>No friends yet </p>
                <Button variant="primary">
                  {" "}
                  Invite Friends to Plan A Trip
                </Button>
                <p> suggestions</p>
              </TabPanel>
            </SwipeableViews>
          </div>
        </Container>
      );
    } else {
      return <Loading />;
    }
  }
}

function mapStateToProps(state) {
  return {
    tags: state.tags.allTags,
    parentTags: state.tags.allParentTags,
    profile: state.profile,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addGuide,
      initProfile,
      loadAllTags,
      loadAllParentTags,
    },
    dispatch
  );

PlanPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(PlanPage)
);
