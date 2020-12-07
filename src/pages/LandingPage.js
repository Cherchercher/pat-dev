import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import TagManager from "react-gtm-module";
import TextLoop from "react-text-loop";
import Triposo from "../api/Triposo";
import SuggestionsListComponent from "../comps/SuggestionsListComponent";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { loadAllTags, loadAllParentTags } from "../action/tagActions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Loading from "react-loading-animation";

import "../css/locationgrid.css";
import "../css/citybook.css";
const WAIT_INTERVAL = 300;
let timerID;

const styles = (theme) => ({
  // root: {
  //   display: "flex",
  //   marginRight: "10px",
  //   marginLeft: "10px",
  //   marginTop: "30px",
  //   [theme.breakpoints.up("sm")]: {
  //     marginTop: "30px",
  //   },
  //   [theme.breakpoints.up("md")]: {
  //     marginTop: "20px",
  //   },
  // },
  // layout: {
  //   width: "auto",
  //   [theme.breakpoints.up(1000 + theme.spacing.unit * 3 * 2)]: {
  //     width: 1000,
  //     marginLeft: "auto",
  //     marginRight: "auto",
  //   },
  // },
  // button: {
  //   margin: theme.spacing.unit,
  // },
  // input: {
  //   display: "none",
  // },
  // card: {
  //   height: "100%",
  //   display: "flex",
  //   flexDirection: "column",
  // },
  // cardMedia: {
  //   paddingTop: "56.25%", // 16:9
  // },
  // cardContent: {
  //   flexGrow: 1,
  // },
  // widget: {
  //   paddingTop: "56.25%",
  //   height: "30%",
  //   "z-index": "100000",
  // },
});

class LandingPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.wrapperRef = React.createRef();
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.onActivityChange = this.onActivityChange.bind(this);

    this.state = {
      tags: [],
      styles: {},
      pageData: null,
      address: "",
      mounted: false,
      index: 0,
      type: "",
      direction: null,
      firstSlider: 1,
      secondSlider: 50,
      page: "dayplan",
      // The active selection's index
      activeSuggestion: 0,
      // The suggestions that match the user's input
      filteredSuggestions: [],
      // Whether or not the suggestion list is shown
      showSuggestions: false,
      location_id: "",
      location_name: "",
      userInput: "",
      //activity
      showSuggestionsWhen: false,
      userInputWhen: "",
      activeSuggestionWhen: 0,
      filteredSuggestionsWhen: [],
      activityType: "",
    };
  }

  onActivityChange = (event, values) => {
    this.setState(
      {
        activityType: values,
      },
      () => {
        // This will output an array of objects
        // given by Autocompelte options property.
        console.log(this.state.activityType);
      }
    );
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    const tagManagerArgs = {
      gtmId: "GTM-N3RP2F7",
    };
    TagManager.initialize(tagManagerArgs);

    this.props.loadAllTags();
    this.props.loadAllParentTags();

    this.setState({ mounted: true, styles: this.props.parentStyles });
    // Asynchronously load the Google Maps script, passing in the callback reference
  }

  componentDidUpdate(prevProps) {
    if (prevProps.parentStyles != this.props.parentStyles) {
      console.log("update");
      this.setState({ styles: this.props.parentStyles });
    } else {
      console.log(prevProps.parentStyles, this.props.parentStyles);
    }
  }

  toDayPlan(e, id, name) {
    e.preventDefault();
    this.props.history.push(`/dayplan?location_id=${id}&location_name=${name}`);
  }
  handleFirstSlider = (event, value) => {
    this.setState({ firstSlider: value });
  };

  handleSecondSlider = (event, value) => {
    this.setState({ secondSlider: value });
  };

  handleChange = (address) => {
    this.setState({ address });
  };

  async handleSuggestionsFetchRequested(value) {
    // const suggestionsList = await fetch(
    //   "https://planatripback-dev.herokuapp.com/triposo/locations/" + value
    // );
    const result = await this.props.Triposo.getLocationsByName(value);
    return result.results;
  }

  onClick = (e, object) => {
    var id = object.id;
    let label = object.name;
    let type = object.type;

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

  onClickWhen(id, label, type) {
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      location_id: id,
      location_name: label,
      type: type,
      userInput: label,
    });
  }

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

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ showSuggestions: false });
    }
  };

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleSelect = (event) => {
    this.setState({ page: event.currentTarget.value });
  };

  redirect = () => {
    this.setState({ showSuggestions: false });

    var route;
    if (this.state.type == "city" || this.state.type == "country") {
      route =
        "location?location_id=" +
        this.state.location_id +
        "&location_name=" +
        this.state.userInput +
        "&type=" +
        this.state.type +
        "&page=" +
        this.state.page +
        "&activity_type=" +
        this.state.activityType;
    } else {
      route =
        this.state.page +
        "?location_id=" +
        this.state.location_id +
        "&location_name=" +
        this.state.userInput +
        "&activity_type=" +
        this.state.activityType;
    }
    localStorage.setItem("prevPath", this.props.location.pathname);
    this.goTo(route);
  };

  goTo(route) {
    this.props.history.replace(`/${route}`);
  }

  redirectClick = async (e) => {
    e.preventDefault();

    const { location_id } = this.state;
    if (location_id === "") {
      const suggestions = await this.handleSuggestionsFetchRequested(
        this.state.userInput
      );
      const country = suggestions[0].country_id.replace("_", " ");
      const name = suggestions[0].name + ", " + country;

      this.setState(
        {
          location_id: suggestions[0].id,
          userInput: name,
        },
        () => {
          this.redirect();
        }
      );
    } else {
      this.redirect();
    }
  };

  onChangeWhen = async (e) => {
    const val = e.currentTarget.value;
    clearTimeout(timerID);
    this.setState({
      userInputWhen: val,
    });
    timerID = setTimeout(async () => {
      if (val.length >= 3) {
        this.setState({
          showSuggestionsWhen: true,
        });

        const filteredSuggestionsWhen = [
          "next week",
          "next month",
          "in Octorber",
          "in July",
        ];

        this.setState({
          activeSuggestionWhen: 0,
          filteredSuggestionsWhen: filteredSuggestionsWhen,
        });
      }
    }, WAIT_INTERVAL);
  };
  onKeyDownWhen = async (e) => {
    const { activeSuggestionWhen, filteredSuggestionsWhen } = this.state;
    // User pressed the enter key
    if (e.keyCode === 13) {
      this.setState({ showSuggestionsWhen: false });
      if (filteredSuggestionsWhen.length !== 0) {
        this.setState(
          {
            userInputWhen: filteredSuggestionsWhen[activeSuggestionWhen],
          },
          () => {
            this.redirect();
          }
        );
      }
      // else {
      //   const suggestions = await this.handleSuggestionsFetchRequested(
      //     this.state.userInputWhen
      //   );

      //   const country = suggestions[0].country_id.replace("_", " ");
      //   const name = suggestions[0].name + ", " + country;
      //   this.setState({ location: suggestions[0].id, userInput: name }, () => {
      //     this.redirect();
      //   });
      // }
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestionWhen === 0) {
        return;
      }

      this.setState({ activeSuggestionWhen: activeSuggestionWhen - 1 });
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestionWhen - 1 === filteredSuggestionsWhen.length) {
        return;
      }
      this.setState({ activeSuggestionWhen: activeSuggestionWhen + 1 });
    }
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
  render() {
    const {
      onChange,
      onKeyDown,
      onChangeWhen,
      onKeyDownWhen,
      onClickWhen,
      onClick,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput,
        tags,
        mounted,
        userInputWhen,
        showSuggestionsWhen,
        filteredSuggestionsWhen,
        activeSuggestionWhen,
        styles,
      },
    } = this;
    const { classes, parentStyles, auth } = this.props;
    console.log(parentStyles, auth);
    const allTags = this.props.tags.concat(this.props.parentTags);

    if (mounted) {
      return (
        <React.Fragment>
          <main key={styles.marginTop}>
            <div>
              <div className="container" style={styles}>
                <div className="intro-item fl-wrap">
                  <h2>All your trip planning needs in one place</h2>
                  <h3>
                    I want to{" "}
                    <TextLoop>
                      <span>go to</span>
                      <span>kite surf</span>
                      <span>go shopping</span>
                      <span>make art</span>
                    </TextLoop>{" "}
                    in{" "}
                    <TextLoop>
                      <span>Portugal</span>
                      <span>New York</span>
                      <span>Egypt</span>
                      <span>Bali</span>
                    </TextLoop>{" "}
                    <TextLoop>
                      <span>this summer</span>
                      <span>next month</span>
                      <span>tomorrow</span>
                      <span>next week</span>
                    </TextLoop>{" "}
                  </h3>
                </div>
                <div className="main-search-input-wrap">
                  <div className="main-search-input fl-wrap">
                    <div className="col-sm-4 col-md-4">
                      <Autocomplete
                        Triposo={this.props.Triposo}
                        id="free-solo-demo"
                        freeSolo
                        onChange={this.onActivityChange}
                        options={allTags.map((option) => option.text)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            style={{ height: "30px" }}
                            label="Activities"
                            variant="outlined"
                          />
                        )}
                      />
                    </div>
                    <div className="main-search-input-item col-sm-4 col-md-4">
                      <input
                        type="text"
                        placeholder="Enter City or Country"
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        value={userInput}
                      />
                    </div>
                    {/* <SuggestionsListComponent
                          showSuggestions={showSuggestionsWhen}
                          activeSuggestion={activeSuggestionWhen}
                          filteredSuggestions={filteredSuggestionsWhen}
                          userInput={userInputWhen}
                          handleClick={onClickWhen}
                        ></SuggestionsListComponent> */}
                    {/* <div className="main-search-input-item col-sm-4 col-md-4">
                          <input
                            type="text"
                            placeholder="When"
                            onChange={onChangeWhen}
                            onKeyDown={onKeyDownWhen}
                            value={userInputWhen}
                          />
                        </div> */}
                    <SuggestionsListComponent
                      showSuggestions={showSuggestions}
                      activeSuggestion={activeSuggestion}
                      filteredSuggestions={filteredSuggestions}
                      userInput={userInput}
                      handleClick={onClick}
                      ref={this.wrapperRef}
                    ></SuggestionsListComponent>
                    <button
                      className="main-search-button"
                      type="submit"
                      onClick={this.redirectClick}
                    >
                      Go
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
          {/* Footer */}
        </React.Fragment>
      );
    } else {
      return <Loading />;
    }
  }
}

LandingPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    tags: state.tags.allTags,
    parentTags: state.tags.allParentTags,
  };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      loadAllTags,
      loadAllParentTags,
    },
    dispatch
  );

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(LandingPage)
);
