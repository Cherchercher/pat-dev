import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "../css/mapBox.css";
import React, { Component } from "react";
import { mdiMapMarker } from "@mdi/js";
import Icon from "@mdi/react";
import WebMercatorViewport from "viewport-mercator-project";
import MapGL, {
  // GeolocateControl,
  Marker,
  LinearInterpolator,
} from "react-map-gl";

// const onMapLoad = map => {
//   map.addControl(new GeolocateControl());
// };

const token =
  process.env.MAPBOX_TOKEN ||
  "pk.eyJ1IjoiY2hlcmNoZXJjaGVyIiwiYSI6ImNrNGhoYTdjYjEwd3QzZXAya2FzMjJqemYifQ.ZVHc98G4hwsARtzVjlR1_Q";

// const geolocateStyle = {
//   float: "right",
//   margin: "50px",
//   padding: "10px"
// };

class ReviewMap extends Component {
  state = {
    viewport: {
      width: 600,
      height: 400,
      longitude: 0,
      latitude: 0,
      zoom: 1,
    },
    searchResultLayer: null,
  };

  mapRef = React.createRef();
  geocoderContainerRef = React.createRef();
  handleViewportChange = (viewport) => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport },
    });
  };
  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  handleGeocoderViewportChange = (viewport) => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides,
    });
  };

  componentDidMount() {
    if (this.props.bbox != null) {
      // calculate the bounding box of the feature
      const center = this.props.center;
      var [minLng, minLat, maxLng, maxLat] = this.props.bbox;
      minLng = center[0] > minLng ? minLng : center[0];
      minLat = center[1] > minLat ? minLat : center[1];
      maxLat = center[1] > maxLat ? center[1] : maxLat;
      maxLng = center[0] > maxLng ? center[1] : maxLng;
      // construct a viewport instance from the current state
      const viewport = new WebMercatorViewport(this.state.viewport);
      const { longitude, latitude, zoom } = viewport.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        {
          padding: 40,
        }
      );

      this.setState({
        viewport: {
          ...this.state.viewport,
          longitude,
          latitude,
          zoom,
          transitionInterpolator: new LinearInterpolator({
            around: [this.props.center[0], this.props.center[1]],
          }),
          transitionDuration: 1000,
        },
      });
    }
  }

  render() {
    const { viewport } = this.state;

    // const markers = [
    //   { id: 1, longitude: -118.2437, latitude: 34.0522 },
    //   { id: 2, longitude: -0.142, latitude: 51.518 }
    // ];

    return (
      <div style={{ height: "60vh" }}>
        <h3
          style={{
            textAlign: "left",
          }}
        >
          {this.props.label}
        </h3>
        <MapGL
          ref={this.geocoderContainerRef}
          {...viewport}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          width="100%"
          height="90%"
          onViewportChange={this.handleViewportChange}
          mapboxApiAccessToken={token}
        >
          {/* onStyleLoad={onMapLoad} */}
          {this.props.markers.map((location) => (
            <Marker
              key={location.id}
              latitude={location.latitude}
              longitude={location.longitude}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <Icon path={mdiMapMarker} color="#0B73BB" />
            </Marker>
          ))}
        </MapGL>
      </div>
    );
  }
}

export default ReviewMap;
