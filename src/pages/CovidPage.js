import React from "react";
import { Map, TileLayer, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Papa from "papaparse";
import SuggestionsListComponent from "../comps/SuggestionsListComponent";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import TagManager from "react-gtm-module";
import Loading from "react-loading-animation";
import Legend from "../comps/Legend";
import News from "../api/News";
import NewsItem from "../comps/NewsItem";

const WAIT_INTERVAL = 300;
let timerID;
const getSuggestions = (filteredSuggestions) => {
  let suggestions = [];
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
  return suggestions;
};

const colorMap = { 0: "green", 1: "orange", 2: "red", 3: "blue" };
const styles = (theme) => ({
  container: {
    // flex: 1,
  },
  header: {
    // flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 20,
    justifyContent: "space-between",
    borderBottomColor: "#E1E1E1",
    borderBottomWidth: 1,
  },
  header_button: {
    // flex: 1,
  },
  whitespace: {
    // flex: 1,
  },
  instruction_text: {
    color: "#A3A3A3",
  },
  header_text: {
    // flex: 1,
    alignSelf: "center",
  },
  header_text_label: {
    fontSize: 20,
    textAlign: "center",
  },
  news_container: {
    // flex: 1,
    flexDirection: "column",
  },
  root: {
    marginRight: "10px",
    marginLeft: "10px",
    marginTop: "200px",
    [theme.breakpoints.up("md")]: {
      marginTop: "170px",
    },
  },
  map: {
    height: "400px",
    width: "100%",
  },
});

class CovidPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
      mounted: false,
      newsAPI: new News(),
      news_items: [],
      location_options: [],
      from_location: "",
      to_location: "",
      activeFromSuggestion: 0,
      activeToSuggestion: 0,
      filteredFromSuggestions: [],
      filteredToSuggestions: [],
    };
    this.updateData = this.updateData.bind(this);

    // this.wrapperFromRef = React.createRef();
    // this.setWrapperFromRef = this.setWrapperFromRef.bind(this);
    // this.wrapperToRef = React.createRef();
    // this.setWrapperToRef = this.setWrapperToRef.bind(this);
    // this.handleClickFromOutside = this.handleClickFromOutside.bind(this);
    // this.handleClickToOutside = this.handleClickToOutside.bind(this);
  }

  async handleSuggestionsFetchRequested(value) {
    const result = await this.props.Triposo.getLocationsByName(value);
    return result.results;
  }

  // setWrapperToRef(node) {
  //   this.wrapperToRef = node;
  // }

  // setWrapperFromRef(node) {
  //   this.wrapperFromRef = node;
  // }

  async componentDidMount() {
    // document.addEventListener("mousedown", this.handleClickFromOutside);
    // document.addEventListener("mousedown", this.handleClickToOutside);
    const tagManagerArgs = {
      gtmId: "GTM-N3RP2F7",
    };
    TagManager.initialize(tagManagerArgs);
    // Papa.parse(
    //   "https://planatripback-dev.herokuapp.com/covid19/csv/12-03-2020",
    //   {
    //     download: true,
    //     header: true,
    //     complete: this.updateData,
    //   }
    // );
    const result = await this.state.newsAPI.getEverythingAbout("Travel");
    if (result.status == "ok") {
      this.setState({ news_items: result.articles });
    }
    this.setState({ mounted: true });
  }

  updateData(result) {
    const data = result.data;
    const noneNulls = data.filter((e) => {
      return e.lat != null && e.lng != null;
    });
    // Here this is available and we can call this.setState (since it's binded in the constructor)
    this.setState({ data: noneNulls, mounted: true }); // or shorter ES syntax: this.setState({ data });
  }

  onFromClick = (e, object) => {
    var id = object.id;
    let label = object.name;
    let type = object.type;

    this.setState({
      activeFromSuggestion: 0,
      filteredFromSuggestions: [],
      showFromSuggestions: false,
      from_id: id,
      from_name: label,
      from_type: type,
      from_location: label,
    });
  };

  onToClick = async (object, e) => {
    var id = object.id;
    let label = object.name;
    let type = object.type;

    this.setState({
      activeToSuggestion: 0,
      filteredToSuggestions: [],
      showToSuggestions: false,
      to_id: id,
      to_name: label,
      to_type: type,
      to_location: label,
    });

    const result = await this.state.newsAPI.getEverythingAbout(
      label + " travel"
    );
    if (result.status == "ok") {
      this.setState({ news_items: result.articles });
    }
  };
  onFromChange = async (e) => {
    const val = e.currentTarget.value;
    clearTimeout(timerID);
    this.setState({
      from_location: val,
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
          activeFromSuggestion: 0,
          filteredFromSuggestions: suggestions,
        });
      }
    }, WAIT_INTERVAL);
  };

  onToChange = async (e) => {
    const val = e.currentTarget.value;
    clearTimeout(timerID);
    this.setState({
      to_location: val,
    });
    timerID = setTimeout(async () => {
      if (val.length >= 3) {
        this.setState({
          showToSuggestions: true,
        });

        const filteredSuggestions = await this.handleSuggestionsFetchRequested(
          val
        );

        this.setState({
          activeToSuggestion: 0,
          filteredToSuggestions: getSuggestions(filteredSuggestions),
        });
      }
    }, WAIT_INTERVAL);
  };

  onFromChange = async (e) => {
    const val = e.currentTarget.value;
    clearTimeout(timerID);
    this.setState({
      from_location: val,
    });
    timerID = setTimeout(async () => {
      if (val.length >= 3) {
        this.setState({
          showFromSuggestions: true,
        });

        const filteredSuggestions = await this.handleSuggestionsFetchRequested(
          val
        );

        this.setState({
          activeFromSuggestion: 0,
          filteredFromSuggestions: getSuggestions(filteredSuggestions),
        });
      }
    }, WAIT_INTERVAL);
  };

  renderNews() {
    return this.state.news_items.map((news, index) => {
      return <NewsItem key={index} index={index} news={news} />;
    });
  }
  onClick() {
    console.log("clicked");
  }

  render() {
    const { classes } = this.props;
    const {
      onFromChange,
      onFromClick,
      onToClick,
      onToChange,
      state: {
        from_location,
        to_location,
        activeFromSuggestion,
        activeToSuggestion,
        filteredFromSuggestions,
        filteredToSuggestions,
        showToSuggestions,
        showFromSuggestions,
      },
    } = this;
    if (this.state.mounted) {
      return (
        <div className={classes.root}>
          <div className="row">
            <div className="col-sm-4 col-md-4">
              <input
                type="text"
                placeholder="Travel From"
                onChange={onFromChange}
                value={from_location}
              />
              <SuggestionsListComponent
                showSuggestions={showFromSuggestions}
                activeSuggestion={activeFromSuggestion}
                filteredSuggestions={filteredFromSuggestions}
                userInput={from_location}
                handleClick={onFromClick}
              ></SuggestionsListComponent>
            </div>
            <div className="col-sm-4 col-md-4">
              <input
                type="text"
                placeholder="Travel To"
                onChange={onToChange}
                value={to_location}
              />
              <SuggestionsListComponent
                showSuggestions={showToSuggestions}
                activeSuggestion={activeToSuggestion}
                filteredSuggestions={filteredToSuggestions}
                userInput={to_location}
                handleClick={onToClick}
              ></SuggestionsListComponent>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <div className={classes.container}>
                <div className={classes.instruction}>
                  <p className={classes.instruction_p}>Latest News</p>
                </div>

                <div className={classes.news_container}>
                  {this.renderNews()}
                </div>
              </div>
            </div>
          </div>
          {/* <Map
            className={classes.map}
            center={[30, 10]}
            zoom={1.4}
            maxZoom={10}
            attributionControl={true}
            zoomControl={true}
            doubleClickZoom={true}
            scrollWheelZoom={true}
            dragging={true}
            animate={true}
            easeLinearity={0.35}
          >
            <TileLayer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
            <Legend />
            {this.state.data.map((dot) => {
              console.log(dot);
              return (
                <CircleMarker
                  key={dot.Country_Region}
                  center={[parseFloat(dot.lat), parseFloat(dot.lng)]}
                  radius={Math.max(parseFloat(dot.Confirmed) / 50000, 4)}
                  fillOpacity={0.5}
                  stroke={false}
                  color={colorMap[dot.Clusters]}
                >
                  <Popup>
                    {dot.Country_Region} <br />
                    Confirmed: {dot.Confirmed} <br />
                    Deaths: {dot.Deaths} <br />
                    Recovered: {dot.Recovered} <br />
                  </Popup>
                </CircleMarker>
              );
            })}
          </Map> */}
        </div>
      );
    } else {
      return <Loading />;
    }
  }
}
CovidPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CovidPage);
