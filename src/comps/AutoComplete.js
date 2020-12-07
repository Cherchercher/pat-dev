import React, { Component } from "react";
import PropTypes from "prop-types";
import Triposo from "../api/Triposo";
import SearchIcon from "@material-ui/icons/Search";
import "../css/autoComplete.css";

const WAIT_INTERVAL = 1000;
let timerID;

class Autocomplete extends Component {
  static propTypes = {
    suggestions: PropTypes.instanceOf(Array),
  };

  static defaultProps = {
    suggestions: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      // The active selection's index
      activeSuggestion: 0,
      // The suggestions that match the user's input
      filteredSuggestions: [],
      // Whether or not the suggestion list is shown
      showSuggestions: false,
      location: "",
      name: "",
      // What the user has entered
      userInput: "",
    };
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  async handleSuggestionsFetchRequested(value) {
    // const suggestionsList = await fetch(
    //   "https://planatripback-dev.herokuapp.com/triposo/cityname/" + value
    // );

    const suggestionsList = await this.props.Triposo.getPlacesByName(
      value,
      "city"
    );
    const results = await suggestionsList.json();
    return results.results;
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ showSuggestions: false });
    }
  }

  onChange = async (e) => {
    const val = e.currentTarget.value;
    clearTimeout(timerID);
    timerID = setTimeout(async () => {
      if (val.length >= 3) {
        const filteredSuggestions = await this.handleSuggestionsFetchRequested(
          val
        );
        var suggestions = [];

        for (var i = 0; i < filteredSuggestions.length; i++) {
          var country = filteredSuggestions[i].country_id.replace("_", " ");
          suggestions.push({
            label: filteredSuggestions[i].name + ", " + country,
            id: filteredSuggestions[i].id,
          });
        }
        this.setState({
          activeSuggestion: 0,
          filteredSuggestions: suggestions,
          showSuggestions: true,
        });
      }
    }, WAIT_INTERVAL);
    this.setState({
      userInput: val,
    });
  };

  onClick(e, id, label) {
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      location: id,
      name: label,
      userInput: label,
    });
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

  redirect = () => {
    this.setState({ showSuggestions: false });
    const count = (this.props.location.pathname.match(/[\/]/g) || []).length;
    var route = "";
    if (count > 1) {
      const subpath = this.props.location.pathname.split("/")[1];
      if (subpath !== "dayplan") {
        route =
          subpath +
          "?location_id=" +
          this.state.location +
          "&location_name=" +
          this.state.userInput.split(",")[0];
      }
    } else {
      route =
        "dayplan?location_id=" +
        this.state.location +
        "&location_name=" +
        this.state.userInput.split(",")[0];
    }
    localStorage.setItem("prevPath", this.props.location.pathname);
    this.props.goTo(route);
  };

  onKeyDown = async (e) => {
    const { activeSuggestion, filteredSuggestions } = this.state;
    // User pressed the enter key
    if (e.keyCode === 13) {
      this.setState({ showSuggestions: false });
      if (filteredSuggestions.length !== 0) {
        this.setState(
          {
            location: filteredSuggestions[activeSuggestion].id,
            userInput: filteredSuggestions[activeSuggestion].label,
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

  render() {
    const {
      onChange,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput,
      },
    } = this;

    let SuggestionsListComponent;
    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        SuggestionsListComponent = (
          <ul className="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className;
              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = "suggestion-active";
              }

              return (
                <li
                  className={className}
                  key={suggestion.id}
                  onClick={(e) => {
                    this.onClick(e, suggestion.id, suggestion.label);
                  }}
                >
                  {suggestion.label}
                </li>
              );
            })}
          </ul>
        );
      }
    }

    return (
      <div ref={this.setWrapperRef} style={{ backgroundColor: "white" }}>
        <div className="input-container">
          <input
            type="text"
            className="input-field"
            name="domain-search"
            id="domain-search"
            placeholder="Enter City"
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={userInput}
          />

          <button
            type="submit"
            onClick={this.redirectClick}
            className="btn-search"
          >
            <SearchIcon />
          </button>
        </div>
        {SuggestionsListComponent}
      </div>
    );
  }
}

export default Autocomplete;
