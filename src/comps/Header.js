import React from "react";
import Loading from "react-loading-animation";
import MenuIcon from "@material-ui/icons/Menu";
import SuggestionsListComponent from "../comps/SuggestionsListComponent";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import unknownprofile from "../assets/unknown_profile.png";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import logo from "../assets/logo.png";
import Triposo from "../api/Triposo";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import { connect } from "react-redux";

import "../css/aboutTemplate.css";
// import "../css/locationgrid.css";
// import "../css/citybook.css";

const WAIT_INTERVAL = 300;
let timerID;

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

const styles = (theme) => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  logo: {
    maxWidth: 45,
  },
  flexDirection: {
    flex: 1,
  },
  avatar: {
    margin: 10,
    cursor: "pointer",
  },

  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
});

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      profile: {},
      mounted: false,
      height: 0,
      redirect: false,
      location: "",
      //auto-suggest
      type: "",
      // The active selection's index
      activeSuggestion: 0,
      // The suggestions that match the user's input
      filteredSuggestions: [],
      // Whether or not the suggestion list is shown
      showSuggestions: false,
      location_id: "",
      location_name: "",
      userInput: "",
    };
  }

  goTo(route) {
    if (localStorage.getItem("prevPath") !== route) {
      this.props.history.push(`/${route}`);
    }

    if (route.split("/")[0] === "bookings") {
      window.location.reload();
    }
  }

  login() {
    this.props.auth.login();
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  authenticate() {
    var ret = this.props.auth.handleAuthentication();
    return ret;
  }

  logout() {
    this.props.auth.logout();
  }

  handleCityChange = (event, { newValue }) => {
    this.setState({
      location: newValue,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.bind(this, "dayplan?location_id=" + this.state.location);
  };

  // componentWillMount() {
  //   const { userProfile, getProfile, isAuthenticated } = this.props.auth;
  //   if (isAuthenticated()) {
  //     if (!userProfile) {
  //       getProfile((err, profile) => {
  //         this.setState({ profile: profile });
  //       });
  //     } else {
  //       this.setState({ profile: userProfile });
  //     }
  //   }
  // }

  componentDidMount() {
    // const height = this.divElement.clientHeight;
    // console.log(height);
    this.setState({ mounted: true });
    const { getProfile, isAuthenticated } = this.props.auth;
    if (isAuthenticated()) {
      getProfile((err, profile) => {
        this.setState({ profile: profile });
      });
    } else {
      this.goTo.bind(this, "/");
    }
  }

  onClick = (id, label, type) => {
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      location_id: id,
      location_name: label,
      type: type,
      userInput: label,
    });
  };

  onChange = async (e) => {
    const val = e.currentTarget.value;
    clearTimeout(timerID);
    this.setState({
      userInput: val,
    });
    timerID = setTimeout(async () => {
      if (val.length >= 3) {
        this.setState({
          showSuggestions: true,
        });

        const filteredSuggestions = await this.handleSuggestionsFetchRequested(
          val
        );
        var suggestions = [];
        if (filteredSuggestions) {
          for (var i = 0; i < filteredSuggestions.length; i++) {
            const type = filteredSuggestions[i].type;
            var location_name = filteredSuggestions[i].name;
            if (type != "country") {
              location_name +=
                ", " + filteredSuggestions[i].country_id.replace("_", " ");
            }
            suggestions.push({
              location_name: location_name,
              id: filteredSuggestions[i].id,
              type: type,
            });
          }
        }
        this.setState({
          activeSuggestion: 0,
          filteredSuggestions: suggestions,
        });
      }
    }, WAIT_INTERVAL);
  };

  onKeyDown = async (e) => {
    const { activeSuggestion, filteredSuggestions } = this.state;
    // User pressed the enter key

    if (e.keyCode === 13) {
      this.setState({ showSuggestions: false });
      if (filteredSuggestions.length !== 0) {
        this.setState(
          {
            location_id: filteredSuggestions[activeSuggestion].id,
            userInput: filteredSuggestions[activeSuggestion].location_name,
          },
          () => {
            this.redirect();
          }
        );
      } else {
        const suggestions = await this.handleSuggestionsFetchRequested(
          this.state.userInput
        );

        const country = suggestions[0].country_id.replace("_", " ");
        const name = suggestions[0].name + ", " + country;
        this.setState(
          { location_id: suggestions[0].id, userInput: name },
          () => {
            this.redirect();
          }
        );
      }
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
      this.setState();
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  async handleSuggestionsFetchRequested(value) {
    const result = await this.props.Triposo.getLocationsByName(value);
    return result.results;
  }

  // return focus to the button when we transitioned from !open -> open

  render() {
    const queryParamsString = this.props.location.search.substring(1), // remove the "?" at the start
      searchParams = new URLSearchParams(queryParamsString);
    const location_id = searchParams.get("location_id");
    const location_name = searchParams.get("location_name");
    const { classes } = this.props;
    const { anchorEl } = this.state;

    const {
      onChange,
      onKeyDown,
      onClick,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput,
      },
    } = this;
    if (this.state.mounted === true) {
      const { isAuthenticated } = this.props.auth;
      return (
        <ElevationScroll {...this.props}>
          <AppBar
            color="white"
            ref={(divElement) => {
              this.divElement = divElement;
            }}
            className={classes.appBar}
          >
            <Toolbar className="header-class">
              <div className={classes.flexDirection}>
                <img src={logo} alt="logo" className={classes.logo} />

                <IconButton
                  className="hamburger"
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={this.handleClick}
                >
                  <MenuIcon />
                </IconButton>

                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.goTo.bind(this, "explore")}>
                    Explore
                  </MenuItem>
                  <MenuItem
                    onClick={this.goTo.bind(
                      this,
                      "dayplan?location_id=" +
                        location_id +
                        "&location_name=" +
                        location_name
                    )}
                  >
                    Plans
                  </MenuItem>
                  <MenuItem
                    onClick={this.goTo.bind(
                      this,
                      "bookings?location_id=" +
                        location_id +
                        "&location_name=" +
                        location_name
                    )}
                  >
                    Market Place
                  </MenuItem>
                  <MenuItem
                    onClick={this.goTo.bind(
                      this,
                      "costs?location_id=" +
                        location_id +
                        "&location_name=" +
                        location_name
                    )}
                  >
                    Cost
                  </MenuItem>
                  <MenuItem onClick={this.goTo.bind(this, "covid19")}>
                    Covid19 Destinations
                  </MenuItem>

                  <MenuItem onClick={this.goTo.bind(this, "aboutus")}>
                    About Us
                  </MenuItem>
                </Menu>
              </div>
              <div className="domain-search-content">
                {/* <DateControl />
                <form
                  autoComplete="off"
                  onSubmit={this.handleSubmit}
                  style={{
                    maxWidth: "400px",
                    width: "100%",
                    "max-height": "50px",
                  }}
                >
                  <Autocomplete
                    location={this.props.location}
                    goTo={this.goTo.bind(this)}
                  />
                </form> */}
                <form
                  style={{
                    float: "left",
                    width: "15%",
                    "max-height": "30px",
                    display: "flex",
                  }}
                >
                  <input
                    type="text"
                    className="input"
                    id="addInput"
                    placeholder="Search a place"
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={userInput}
                  />
                  <button>go</button>
                </form>
              </div>
              <SuggestionsListComponent
                // class="domain-search-content"

                showSuggestions={showSuggestions}
                activeSuggestion={activeSuggestion}
                filteredSuggestions={filteredSuggestions}
                userInput={userInput}
                handleClick={onClick}
              ></SuggestionsListComponent>
              <div className="header">
                <Button onClick={this.goTo.bind(this, "explore")}>
                  Explore
                </Button>
                <Button
                  onClick={this.goTo.bind(
                    this,
                    "dayplan?location_id=" +
                      location_id +
                      "&location_name=" +
                      location_name
                  )}
                >
                  Plans
                </Button>
                <Button
                  onClick={this.goTo.bind(
                    this,
                    "bookings?location_id=" +
                      location_id +
                      "&location_name=" +
                      location_name
                  )}
                >
                  Market Place
                </Button>
                <Button
                  onClick={this.goTo.bind(
                    this,
                    "costs?location_id=" +
                      location_id +
                      "&location_name=" +
                      location_name
                  )}
                >
                  Cost
                </Button>

                <Button onClick={this.goTo.bind(this, "covid19")}>
                  Covid19 Destinations
                </Button>
                <Button onClick={this.goTo.bind(this, "aboutus")}>
                  About Us
                </Button>
              </div>

              {!isAuthenticated() && (
                <Avatar
                  alt="Unknown"
                  src={unknownprofile}
                  className={classes.avatar}
                  onClick={this.login.bind(this)}
                />
              )}
              {isAuthenticated() && (
                <Avatar
                  alt={this.state.profile.given_name}
                  src={this.state.profile.picture}
                  className={classes.avatar}
                  onClick={this.goTo.bind(this, "persona")}
                />
              )}
            </Toolbar>
          </AppBar>
        </ElevationScroll>
      );
    } else {
      return <Loading />;
    }
  }
}

function mapStateToProps(state, props) {
  return {
    params: state.location,
    date: state.date,
  };
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, null)(Header));
