import React, { Component } from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import "../css/MapboxAutoComplete.css";

const token =
  process.env.MAPBOX_TOKEN ||
  "pk.eyJ1IjoiY2hlcmNoZXJjaGVyIiwiYSI6ImNrNGhoYTdjYjEwd3QzZXAya2FzMjJqemYifQ.ZVHc98G4hwsARtzVjlR1_Q";

export default class MapboxAutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      results: [],
      isLoading: false
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }
  handleSearchChange(e) {
    this.setState({
      search: e.target.value,
      isLoading: true
    });

    // Stop the previous setTimeout if there is one in progress
    clearTimeout(this.timeoutId);

    // Launch a new request in 1000ms
    this.timeoutId = setTimeout(() => {
      this.performSearch();
    }, 1000);
  }
  performSearch() {
    if (this.state.search === "") {
      this.setState({
        results: [],
        isLoading: false
      });
      return;
    }
    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.state.search}.json?access_token=${token}`
      )
      .then(response => {
        this.setState({
          results: response.data.features,
          isLoading: false
        });
      });
  }
  handleItemClicked(place) {
    this.setState({
      search: place.place_name,
      results: []
    });
    this.props.onSelect(place);
  }
  render() {
    return (
      <form noValidate autoComplete="off">
        <div className="row">
          <div className="AutocompletePlace" className="col-sm-6">
            <TextField
              className="AutocompletePlace-input"
              type="text"
              value={this.state.search}
              onChange={this.handleSearchChange}
              placeholder="Type an address"
            />
            <ul className="AutocompletePlace-results">
              {this.state.results.map(place => (
                <li
                  key={place.id}
                  className="AutocompletePlace-items"
                  onClick={() => this.handleItemClicked(place)}
                >
                  {place.place_name}
                </li>
              ))}
              {this.state.isLoading && (
                <li className="AutocompletePlace-items">Loading...</li>
              )}
            </ul>
          </div>
          <TextField id="lat" label="latitude" className="col-sm-3" />
          <TextField id="lng" label="longitude" className="col-sm-3" />
        </div>
      </form>
    );
  }
}
