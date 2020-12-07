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
import DeckGL, { GeoJsonLayer } from "deck.gl";
import Geocoder from "react-map-gl-geocoder";

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

class SearchableMap extends Component {
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.bbox !== this.props.bbox && this.props.bbox != null) {
      // calculate the bounding box of the feature
      const [minLng, minLat, maxLng, maxLat] = this.props.bbox;
      var bbox = [
        [minLng, minLat],
        [maxLng, maxLat],
      ];
      if (this.props.label === "place") {
        var lats = [];
        var lngs = [];
        lats.push(minLat);
        lats.push(maxLat);
        lngs.push(minLng);
        lngs.push(maxLng);
        for (var i = 0; i < this.props.markers.length; i++) {
          const [minLng, minLat, maxLng, maxLat] = this.props.markers.bbox;
          lats.push(minLat);
          lats.push(maxLat);
          lngs.push(maxLng);
          lngs.push(minLng);
        }

        // calc the min and max lng and lat
        var minlat = Math.min.apply(null, lats),
          maxlat = Math.max.apply(null, lats);
        var minlng = Math.min.apply(null, lngs),
          maxlng = Math.max.apply(null, lngs);

        // create a bounding rectangle that can be used in leaflet
        bbox = [
          [minlat, minlng],
          [maxlat, maxlng],
        ];
      }
      // construct a viewport instance from the current state
      // construct a viewport instance from the current state
      const viewport = new WebMercatorViewport(this.state.viewport);
      const { longitude, latitude, zoom } = viewport.fitBounds(bbox, {
        padding: 40,
      });

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

  componentDidMount() {
    if (this.props.bbox != null) {
      // calculate the bounding box of the features
      const [minLng, minLat, maxLng, maxLat] = this.props.bbox;
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

  handleOnResult = (event) => {
    this.props.onChange(
      event.result.place_name,
      event.result.center,
      event.result.bbox,
      this.props.label
    );

    this.setState({
      searchResultLayer: new GeoJsonLayer({
        id: "search-result",
        data: event.result.geometry,
        getFillColor: [255, 0, 0, 128],
        getRadius: 1000,
        pointRadiusMinPixels: 10,
        pointRadiusMaxPixels: 10,
      }),
    });
  };

  render() {
    const { viewport, searchResultLayer } = this.state;
    const { center } = this.props;
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

        <div
          ref={this.geocoderContainerRef}
          style={{
            height: 50,
            display: "flex",
            alignItems: "center",
            paddingLeft: 4,
          }}
        />

        <MapGL
          ref={this.mapRef}
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
          <Geocoder
            mapRef={this.mapRef}
            containerRef={this.geocoderContainerRef}
            onResult={this.handleOnResult}
            onViewportChange={this.handleGeocoderViewportChange}
            mapboxApiAccessToken={token}
            position="top-left"
            proximity={center}
          />
          {/* <GeolocateControl
            style={geolocateStyle}
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
          /> */}
        </MapGL>
        <DeckGL {...viewport} layers={[searchResultLayer]} />
      </div>
    );
  }
}

export default SearchableMap;
