import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import CheckboxField from "../comps/Checkbox";
import ActionFavorite from "material-ui/svg-icons/action/favorite";
import ActionTheaters from "material-ui/svg-icons/action/theaters";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ActionFavoriteBorder from "material-ui/svg-icons/action/favorite-border";
import { Button } from "react-bootstrap";
import Switch from "@material-ui/core/Switch";
import MobileTearSheet from "../comps/MobileTearSheet";
import { List, ListItem } from "material-ui/List";
import MapDrink from "material-ui/svg-icons/maps/local-drink";
import MapLandscape from "material-ui/svg-icons/maps/local-florist";
import Subheader from "material-ui/Subheader";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Parse from "parse/node";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as Actions from "../action/userActions";
Parse.initialize("patback");
//javascriptKey is required only if you have it on server.

Parse.serverURL = "https://planatripback.herokuapp.com/parse";

const styles = (theme) => ({
  root: {
    display: "flex",
    marginRight: "10px",
    marginLeft: "10px",
    marginTop: "200px",
    [theme.breakpoints.up("md")]: {
      marginTop: "170px",
    },
  },
  bigAvatar: {
    margin: 10,
    width: 120,
    height: 120,
  },
  margin: { margin: 12, float: "right" },
  block: {
    maxWidth: 250,
  },
  demo: {
    height: 240,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    height: "100%",
    color: theme.palette.text.secondary,
    paddingTop: 10,
    paddingBottom: 10,
  },
  checkbox: {
    marginBottom: 16,
  },
  checkboxNested: {
    marginBottom: 16,
    marginLeft: 28,
  },
  datePicker: {
    marginLeft: 15,
  },
  alert: {
    color: "red",
  },
});

class PersonaPage extends React.Component {
  constructor(props) {
    super(props);
    this.post = this.post.bind(this);
    this.state = {
      startDate: null,
      endDate: null,

      focusedInput: null,

      open: false,

      checked: false,
      value: "",
      expanded: false,
      loading: false,
      success: false,
      firstSlider: 1,
      secondSlider: 50,
    };
    this.logout = this.logout.bind(this);
    this._click = this._click.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.goTo = this.goTo.bind(this);
  }

  goTo(route) {
    this.props.history.replace(`/${route}`);
  }

  logout() {
    this.props.auth.logout();
    this.goTo("explore");
  }

  saveChanges() {
    this.props.saveParseProfile();
  }

  post(path, data) {
    return fetch("http://localhost:3001" + path, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  timer = undefined;

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  componentWillReceiveProps(nextProps) {
    const { isAuthenticated } = nextProps.auth;

    if (!isAuthenticated()) {
      this.props.auth.login();
    }
  }

  // componentWillMount() {
  //   const { isAuthenticated, getProfile, getParseProfile } = this.props.auth;
  //   if (isAuthenticated()) {
  //     if (!this.props.profile.userProfile || !this.props.profile.parseProfile) {
  //       getProfile(async (err, profile) => {
  //         if (profile) {
  //           const parseUser = await getParseProfile(profile);
  //           this.props.initProfile(profile, parseUser);
  //         }
  //       });
  //     }
  //   } else {
  //     this.props.auth.login();
  //   }
  // }

  handleCheckbox = (event, isChecked, value) => {
    var interests = this.props.profile.interestsList;
    var newInterestsList = {};
    // event.preventDefault();
    if (isChecked === true) {
      Object.keys(interests).forEach((key) => {
        newInterestsList[key] = [];
        interests[key].forEach((item, index) => {
          var newItem = item;
          if (item.category === value) {
            newItem = {
              id: item.category,
              value: true,
              category: item.category,
            };
          }
          newInterestsList[key].push(newItem);
        });
      });
    } else {
      Object.keys(interests).forEach((key) => {
        newInterestsList[key] = [];
        interests[key].forEach((item, index) => {
          var newItem = item;
          if (item.category === value) {
            newItem = {
              id: item.category,
              value: false,
              category: item.category,
            };
          }
          newInterestsList[key].push(newItem);
        });
      });
    }
    this.props.updateParseProfile("interestList", newInterestsList);
  };

  _click(value) {
    if (value !== this.state.value) {
      this.setState({ value: value });
    } else {
      this.setState({ value: "" });
    }
  }

  handleExpandChange = (expanded) => {
    this.setState({ expanded: expanded });
  };

  handleToggle = (event, toggle) => {
    if (!this.state.loading) {
      this.setState(
        {
          success: false,
          loading: true,
        },
        () => {
          this.timer = setTimeout(() => {
            this.setState({
              loading: false,
              success: true,
              expanded: toggle,
            });
          }, 2000);
        }
      );
    }
  };

  handleExpand = () => {
    this.setState({ expanded: true });
  };

  handleReduce = () => {
    this.setState({ expanded: false });
  };

  handleNestedListToggle = (item) => {
    this.setState({
      open: item.state.open,
    });
  };

  updateCheck() {
    this.setState((oldState) => {
      return {
        checked: !oldState.checked,
      };
    });
  }

  handlePrivacyPreferences = (event) => {
    const prePrev = this.props.profile.preferencesPrivate;
    this.props.updateParseProfile("preferencesPrivate", !prePrev);
  };

  handlePrivacyProfile = (event) => {
    const prePrev = this.props.profile.profilePrivate;
    this.props.updateParseProfile("profilePrivate", !prePrev);
  };

  handleAboutMe = (event) => {
    this.props.updateParseProfile("aboutMe", event.target.value);
  };

  handleFunFact = (event) => {
    this.props.updateParseProfile("funFact", event.target.value);
  };

  onChangeImage = (e) => {
    if (e.target.files) {
      /* Get files in array form */
      const file = e.target.files[0];
      const reader = (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.onload = () => resolve(fileReader.result);
          fileReader.readAsDataURL(file);
        });
      };
      const readFile = (file) => {
        reader(file).then((result) => {
          this.props.updateParseProfile("picture", result);
        });
      };
      readFile(file);
    }
  };

  render() {
    const {
      aboutMe,
      funFact,
      interestsList,
      picture,
      preferencesPrivate,
      profilePrivate,
    } = this.props.profile;
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <div className="row">
            <div className="col-md-5">
              <div>
                <br />
                <MobileTearSheet>
                  <List>
                    <Subheader>
                      Profile
                      <FormControlLabel
                        style={{ float: "right" }}
                        control={
                          <Switch
                            checked={profilePrivate}
                            onChange={this.handlePrivacyProfile}
                            color="primary"
                            inputProps={{ "aria-label": "primary checkbox" }}
                          />
                        }
                        label="private"
                      />
                    </Subheader>
                    <Grid container justify="center" alignItems="center">
                      <Avatar
                        alt="My profile pic"
                        src={picture}
                        className={classes.bigAvatar}
                        for="img"
                      />

                      <Button variant="secondary">
                        <label for="img" style={{ "font-weight": "600" }}>
                          <input
                            type="file"
                            id="img"
                            onChange={this.onChangeImage}
                            single
                            style={{ display: "none" }}
                          />
                          Change Profile Picture
                        </label>
                      </Button>
                    </Grid>
                    {/* 
                    <Grid
                      container
                      style={{ marginLeft: 10 }}
                      spacing={15}
                      justify="center"
                    >
                      {[
                        "Past Trips",
                        "Upcoming Trips",
                        "Following",
                        "Follower"
                      ].map(value => (
                        <Grid item sm={3}>
                          <Paper
                            className={classes.paper}
                            elevation0
                            square={true}
                          >
                            <div style={{ marginTop: 0, fontWeight: "bold" }}>
                              {value}
                            </div>
                            <div style={{ marginTop: 5 }}>{value}</div>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid> */}
                    <Grid
                      container
                      style={{ marginLeft: 10, marginTop: 20 }}
                      spacing={15}
                      justify="center"
                    >
                      <Subheader>About Me </Subheader>
                      <textarea
                        onChange={this.handleAboutMe}
                        value={aboutMe}
                        style={{ marginRight: 10 }}
                      />

                      <Subheader>Fun Fact</Subheader>
                      <textarea
                        onChange={this.handleFunFact}
                        value={funFact}
                        style={{ marginRight: 10 }}
                      />
                    </Grid>
                  </List>
                </MobileTearSheet>
              </div>
            </div>
            <div className="col-md-5">
              <div>
                <br />
                <MobileTearSheet>
                  <List>
                    <Subheader>
                      Trip Preference{" "}
                      <FormControlLabel
                        style={{ float: "right" }}
                        control={
                          <Switch
                            checked={preferencesPrivate}
                            onChange={this.handlePrivacyPreferences}
                            color="primary"
                            inputProps={{ "aria-label": "primary checkbox" }}
                          />
                        }
                        label="private"
                      />{" "}
                    </Subheader>

                    <ListItem
                      primaryText="Trip Types"
                      leftIcon={<MapLandscape />}
                      value={4}
                      open={this.state.value === 4 ? true : false}
                      selected={this.state.value === 4 ? true : false}
                      onClick={() => this._click(4)}
                      initiallyOpen={false}
                      primaryTogglesNestedList={true}
                      nestedItems={interestsList.type.map((element) => (
                        <CheckboxField
                          key={element.id}
                          label={element.category}
                          checked={element.value}
                          checkedIcon={<ActionFavorite />}
                          category={element.category}
                          uncheckedIcon={<ActionFavoriteBorder />}
                          onChange={this.handleCheckbox}
                          className={classes.checkboxNested}
                        />
                      ))}
                    />

                    <Subheader>Interests</Subheader>
                    <ListItem
                      primaryText="Adventures"
                      leftIcon={<MapLandscape />}
                      value={1}
                      selected={this.state.value === 1 ? true : false}
                      open={this.state.value === 1 ? true : false}
                      onClick={() => this._click(1)}
                      initiallyOpen={false}
                      primaryTogglesNestedList={true}
                      nestedItems={interestsList.adventure.map((element) => (
                        <CheckboxField
                          key={element.id}
                          label={element.category}
                          checked={element.value}
                          checkedIcon={<ActionFavorite />}
                          category={element.category}
                          uncheckedIcon={<ActionFavoriteBorder />}
                          onChange={this.handleCheckbox}
                          className={classes.checkboxNested}
                        />
                      ))}
                    />
                    <ListItem
                      primaryText="Food and Drinks"
                      leftIcon={<MapDrink />}
                      value={2}
                      selected={this.state.value === 2 ? true : false}
                      open={this.state.value === 2 ? true : false}
                      onClick={() => this._click(2)}
                      initiallyOpen={false}
                      primaryTogglesNestedList={true}
                      nestedItems={interestsList.food.map((element) => (
                        <CheckboxField
                          key={element.id}
                          checked={element.value}
                          label={element.category}
                          checkedIcon={<ActionFavorite />}
                          category={element.category}
                          uncheckedIcon={<ActionFavoriteBorder />}
                          onChange={this.handleCheckbox}
                          className={classes.checkboxNested}
                        />
                      ))}
                    />
                    <ListItem
                      value={3}
                      selected={this.state.value === 3 ? true : false}
                      open={this.state.value === 3 ? true : false}
                      onClick={() => this._click(3)}
                      primaryText="Arts"
                      leftIcon={<ActionTheaters />}
                      initiallyOpen={true}
                      primaryTogglesNestedList={true}
                      nestedItems={interestsList.art.map((element) => (
                        <CheckboxField
                          key={element.id}
                          checked={element.value}
                          label={element.category}
                          checkedIcon={<ActionFavorite />}
                          category={element.category}
                          uncheckedIcon={<ActionFavoriteBorder />}
                          onChange={this.handleCheckbox}
                          className={classes.checkboxNested}
                        />
                      ))}
                    />
                  </List>
                </MobileTearSheet>
              </div>
            </div>
            <div className="col-md-2">
              <Button variant="outline-secondary" onClick={this.logout}>
                {" "}
                Log out
              </Button>
              <RaisedButton
                variant="outline-secondary"
                primary={true}
                label="Save All"
                onClick={this.saveChanges}
              >
                {" "}
              </RaisedButton>
            </div>
            {/* <div className="col-md-4">
              <div>
                <br />
                <MobileTearSheet>
                  <List>
                   <Subheader>My Availabilities</Subheader>
                  <div className={classes.datePicker}>
                      <p> 03/08/2018 - 07/08/2018</p>
                      <DatePicker hintText="Start" container="inline" />
                      <DatePicker hintText="End" container="inline" />
                      <Button variant="secondary"> Add Availability </Button> 
                    
                      <Button variant="outline-secondary" onClick={this.logout}>
                        {" "}
                        Log out
                      </Button>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={checkedProfile}
                            onChange={this.handlePrivacy("availabilityPublic")}
                            value="availabilityPublic"
                            color="primary"
                            inputProps={{ "aria-label": "primary checkbox" }}
                          />
                        }
                        label="private"
                      />
                      <Grid container style={{ marginTop: 20 }}>
                        <Grid item sm={8}>
                          <RaisedButton
                            onClick={this.saveChanges}
                            label="Save All Changes"
                            primary={true}
                          />
                        </Grid>
                    
                      </Grid>
                    </div>
                  </List>
                </MobileTearSheet>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    profile: state.profile,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

PersonaPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(PersonaPage)
);
