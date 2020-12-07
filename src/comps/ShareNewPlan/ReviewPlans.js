import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import ReviewMap from "../ReviewMap";
import { Timeline, Event } from "react-trivial-timeline";

function calculateMap(days) {
  var markers = [];
  var count = 0;
  var lat = 0;
  var lng = 0;
  days.map((data) => {
    data.activities.map((activity) => {
      count = count + 1;
      markers.push({
        id: count,
        longitude: activity["placeInfo"]["center"][0],
        latitude: activity["placeInfo"]["center"][1],
      });
      lat += activity["placeInfo"]["center"][1];
      lng += activity["placeInfo"]["center"][0];
    });
  });
  lat = lat / markers.length;
  lng = lng / markers.length;
  const mapCenter = [lng, lat];
  //   { id: 2, longitude: -0.142, latitude: 51.518 }
  return { markers, mapCenter };
}

const styles = (theme) => ({
  tapDisplay: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
});
class ReviewPlans extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  saveAndContinue = (e) => {
    this.props.addGuide(this.props.days);
    e.preventDefault();
    this.props.nextStep();
  };

  back = (e) => {
    e.preventDefault();
    this.props.prevStep();
  };

  render() {
    const { days, location } = this.props.values;
    const { markers, mapCenter } = calculateMap(days);
    if (this.state.mounted) {
      return (
        <div>
          <h1>
            {" "}
            {days.length} days in {location.value}{" "}
          </h1>
          <Timeline lineColor="black">
            {days.map((data, index) => {
              return (
                <div>
                  <Event key={index} interval={"Day " + (index + 1)}></Event>

                  {data.activities.map((activity, index_a) => {
                    return (
                      <Event
                        title={activity["location"]["place_name"]}
                        subtitle="Subtitle"
                      >
                        <div className="row">
                          <label>{activity.images.length} images</label>
                        </div>
                        <div className="row">{activity["description"]}</div>
                      </Event>
                    );
                  })}
                </div>
              );
            })}
          </Timeline>
          <ReviewMap
            label="map"
            bbox={location.bbox}
            center={mapCenter}
            markers={markers}
          />
          <Button onClick={this.back}>Back</Button>
          <Button onClick={this.saveAndContinue}>Submit</Button>
        </div>
      );
    } else {
      return null;
    }
  }
}

ReviewPlans.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReviewPlans);
