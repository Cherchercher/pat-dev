import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Subheader from "material-ui/Subheader";
import "../css/locationgrid.css";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "../css/citybook.css";
import { loadAllTags, loadAllParentTags } from "../action/tagActions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Card from "@material-ui/core/Card";
import Triposo from "../api/Triposo";
import TagManager from "react-gtm-module";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import TextLoop from "react-text-loop";
import SuggestionsListComponent from "../comps/SuggestionsListComponent";
// import { Widget } from "rasa-webchat";

const WAIT_INTERVAL = 300;
let timerID;

const styles = (theme) => ({
  root: {
    position: "absolute",
    marginRight: "10px",
    marginLeft: "10px",

    [theme.breakpoints.up("sm")]: {
      marginTop: "30px",
    },

    [theme.breakpoints.up("md")]: {
      marginTop: "20px",
    },
  },
  layout: {
    width: "auto",
    [theme.breakpoints.up(1000 + theme.spacing.unit * 3 * 2)]: {
      width: 1000,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: "none",
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  widget: {
    paddingTop: "56.25%",
    height: "30%",
    "z-index": "100000",
  },
});

// const customWidget = (classes) => {
//   return (
//     <Widget
//       className={classes}
//       socketUrl={"http://localhost:5005"}
//       socketPath={"/socket.io/"}
//       hideWhenNotConnected={false}
//       customData={{ language: "en" }} // arbitrary custom data. Stay minimal as this will be added to the socket
//       title={"Artic Tern By Plan A Trip"}
//     />
//   );
// };
class Explore extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.state = {
      pageData: null,
      address: "",
      mounted: false,
      index: 0,
      type: "",
      direction: null,
      firstSlider: 1,
      secondSlider: 50,
      cat: "surfing",
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
      showSuggestionsActivity: false,
      userInputActivity: "",
      activeSuggestionActivity: 0,
      filteredSuggestionsActivity: [],
    };
  }

  handleSelect(selectedIndex, e) {
    this.setState({
      index: selectedIndex,
      direction: e.direction,
    });
  }

  async componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    const tagManagerArgs = {
      gtmId: "GTM-N3RP2F7",
    };
    TagManager.initialize(tagManagerArgs);
    // const suggestionsList = await fetch(
    //   "https://planatripback-dev.herokuapp.com/triposo/citytags/surfing"
    // );
    const results = await this.props.Triposo.getPlacesbyCat("surfing", "city");
    this.setState({ pageData: results });
    this.setState({ mounted: true });
    this.props.loadAllTags();
    this.props.loadAllParentTags();
    // Asynchronously load the Google Maps script, passing in the callback reference
  }

  async handleRegionClick(e, id, name) {
    // const suggestionsList = await fetch(
    //   "https://planatripback-dev.herokuapp.com/triposo/citytags/" + id
    // );
    const results = await this.props.Triposo.getPlacesByCat(id, "city");
    this.setState({ pageData: results });
    this.setState({ cat: name });
    this.setState({ color: "secondary" });
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

  onClick = (object, e) => {
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      location_id: object.id,
      location_name: object.name,
      type: object.type,
      userInput: object.name,
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

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ showSuggestions: false });
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  /**
   * Set the wrapper ref
   */
  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleSelect(event) {
    this.setState({ page: event.currentTarget.value });
  }

  redirect = () => {
    this.setState({ showSuggestions: false });
    // const count = (this.props.location.pathname.match(/[\/]/g) || []).length;
    var route;
    if (this.state.type != "city") {
      route =
        "location?location_id=" +
        this.state.location_id +
        "&location_name=" +
        this.state.userInput +
        "&type=" +
        this.state.type +
        "&page=" +
        this.state.page;
    } else {
      route =
        this.state.page +
        "?location_id=" +
        this.state.location_id +
        "&location_name=" +
        this.state.userInput;
    }

    localStorage.setItem("prevPath", this.props.location.pathname);
    this.goTo(route);
  };

  goTo(route) {
    this.props.history.replace(`/${route}`);
  }

  redirectClick = async (e) => {
    e.preventDefault();
    const { location } = this.state;
    // User pressed the enter key

    if (location === "") {
      const suggestions = await this.handleSuggestionsFetchRequested(
        this.state.userInput
      );
      const country = suggestions[0].country_id.replace("_", " ");
      const name = suggestions[0].name + ", " + country;

      this.setState(
        {
          location: suggestions[0].id,
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
        this.setState({ location: suggestions[0].id, userInput: name }, () => {
          this.redirect();
        });
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

  onChangeActivity = async (e) => {
    const val = e.currentTarget.value;
    clearTimeout(timerID);
    this.setState({
      userInputActivity: val,
    });
    timerID = setTimeout(async () => {
      if (val.length >= 3) {
        this.setState({
          showSuggestionsActivity: true,
        });

        var suggestions = [];

        for (var i = 0; i < this.props.parentTags.length; i++) {
          var activity_name = this.props.parentTags[i].text;

          suggestions.push({
            activity_name: activity_name,
            id: this.props.parentTags[i].id,
          });
        }

        for (var i = 0; i < this.props.tags.length; i++) {
          var activity_name = this.props.tags[i].text;

          suggestions.push({
            activity_name: activity_name,
            id: this.props.tags[i].id,
          });
        }

        // console.log(this.props.parentTags);
        // filteredSuggestionsActivity.push(...this.props.tags);

        // var suggestions = this.props.parentTags;
        // suggestions.push(...this.props.tags);
        this.setState({
          activeSuggestionActivity: 0,
          filteredSuggestionsActivity: suggestions,
        });
      }
    }, WAIT_INTERVAL);
  };
  onKeyDownActivity = async (e) => {
    const {
      activeSuggestionActivity,
      filteredSuggestionsActivity,
    } = this.state;
    // User pressed the enter key
    if (e.keyCode === 13) {
      this.setState({ showSuggestionsActivity: false });
      if (filteredSuggestionsActivity.length !== 0) {
        this.setState(
          {
            userInputActivity:
              filteredSuggestionsActivity[activeSuggestionActivity],
          },
          () => {
            this.redirect();
          }
        );
      }
      // else {
      //   const suggestions = await this.handleSuggestionsFetchRequested(
      //     this.state.userInputActivity
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
      if (activeSuggestionActivity === 0) {
        return;
      }

      this.setState({ activeSuggestionActivity: activeSuggestionActivity - 1 });
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestionActivity - 1 === filteredSuggestionsActivity.length) {
        return;
      }
      this.setState({ activeSuggestionActivity: activeSuggestionActivity + 1 });
    }
  };

  render() {
    const {
      onChange,
      onKeyDown,
      onChangeActivity,
      onKeyDownActivity,
      onClick,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput,
        userInputActivity,
        showSuggestionsActivity,
        filteredSuggestionsActivity,
        activeSuggestionActivity,
      },
    } = this;

    let a = [
      { id: "surfing", name: "Surfing" },
      { id: "poitype-Kite_surfing", name: "Kite Surfing" },
      { id: "poitype-Art_gallery", name: "Art" },
      { id: "beaches", name: "Beaches" },
      { id: "wineries", name: "Winery" },
      { id: "zoos", name: "Zoo" },
      { id: "character-World_heritage", name: "UNESCO" },
      { id: "celebrations", name: "Celebration" },
      { id: "wintersport", name: "Wintersport" },
      { id: "wildlife", name: "Wildlife" },
    ];
    const { cat } = this.state;
    const { classes } = this.props;
    let apiData = [];
    if (this.state.mounted) {
      for (let item of this.state.pageData.results) {
        let data = {
          title: item.name,
          type: item.type,
          desc: item.snippet,
          id: item.id,
          image: item.images[0].sizes.medium.url,
        };
        apiData.push(data);
      }
    }
    return (
      <React.Fragment>
        <main className={classes.root}>
          <div className={classes.layout}>
            <section
              className="scroll-con-sec hero-section"
              data-scrollax-parent="true"
              id="sec1"
            >
              <div className="overlay"></div>
              <div className="hero-section-wrap fl-wrap">
                <div className="container">
                  <div className="intro-item fl-wrap">
                    <h2>All your trip planning needs in one place</h2>
                    <h3>
                      <TextLoop>
                        <span>View costs to</span>
                        <span>See plans to</span>
                        <span>Book a trip to</span>
                        <span>Read advice to</span>
                      </TextLoop>{" "}
                      <TextLoop>
                        <span>visit</span>
                        <span>surf</span>
                        <span>go shopping</span>
                        <span>make art</span>
                      </TextLoop>{" "}
                      in{" "}
                      <TextLoop>
                        <span>Portugal</span>
                        <span>Tokyo</span>
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
                          options={this.props.tags.map((option) => option.text)}
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
                      <div className="main-search-input-item col-sm-6 col-md-6">
                        <input
                          type="text"
                          placeholder="Enter City or Country"
                          onChange={onChange}
                          onKeyDown={onKeyDown}
                          value={userInput}
                        />
                      </div>
                      <SuggestionsListComponent
                        showSuggestions={showSuggestions}
                        activeSuggestion={activeSuggestion}
                        filteredSuggestions={filteredSuggestions}
                        userInput={userInput}
                        handleClick={onClick}
                        ref={this.wrapperRef}
                      ></SuggestionsListComponent>

                      <div className="main-search-input-item col-sm-6 col-md-6">
                        <input
                          type="text"
                          placeholder="When"
                          onChange={onChange}
                          onKeyDown={onKeyDown}
                          value={userInput}
                        />
                      </div>
                      <SuggestionsListComponent
                        showSuggestions={showSuggestions}
                        activeSuggestion={activeSuggestion}
                        filteredSuggestions={filteredSuggestions}
                        userInput={userInput}
                        onClick={onClick}
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
              <div className="header-sec-link">
                <div className="container">
                  <a href="#sec2" className="custom-scroll-link">
                    Explore
                  </a>
                </div>
              </div>
            </section>
            {/* <div>{customWidget(classes.widget)}</div> */}
            <section id="sec2">
              <Grid container spacing={2}>
                <Grid sm={12} md={12}>
                  <h2 align="center">Explore The World at your fingertip. </h2>

                  {a.map((item) => (
                    <Button
                      variant="outlined"
                      className={classes.button}
                      onClick={(e) => {
                        this.handleRegionClick(e, item.id, item.name);
                      }}
                      color="primary"
                    >
                      {item.name}
                    </Button>
                  ))}
                </Grid>

                {apiData.map((card) => (
                  <Grid item key={card.id} sm={6}>
                    <div
                      onClick={(e) => this.toDayPlan(e, card.id, card.title)}
                    >
                      <Card className={classes.card}>
                        <CardMedia
                          className={classes.cardMedia}
                          image={card.image}
                          title={card.title}
                        />
                        <CardContent className={classes.cardContent}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {card.title}
                          </Typography>
                          <Typography>{card.desc}</Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small" color="primary">
                            Learn more
                          </Button>
                        </CardActions>
                      </Card>
                    </div>
                  </Grid>
                ))}
              </Grid>
            </section>
            <section>
              <h2 align="center" id="sec3">
                subscribe to latest travel news and updates
              </h2>
            </section>
          </div>
        </main>
        {/* Footer */}
        <footer className={classes.footer}>
          <Typography variant="h6" align="center" gutterBottom>
            @CopyRight 2020
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="textSecondary"
            component="p"
          >
            Plan A Trip Co.
          </Typography>
        </footer>
        {/* End footer */}
      </React.Fragment>
    );
  }
}

Explore.propTypes = {
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
  connect(mapStateToProps, mapDispatchToProps)(Explore)
);
