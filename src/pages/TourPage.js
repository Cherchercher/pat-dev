import React from "react";
import { Helmet } from "react-helmet";
import HotelWidget from "../comps/HotelWidget";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: "200px",
    [theme.breakpoints.up("md")]: {
      marginTop: "170px"
    }
  },
  hotel: {
    margin: "100px"
  }
});

class TourPage extends React.Component {
  render() {
    const { classes } = this.props;
    const queryParamsString = this.props.location.search.substring(1), // remove the "?" at the start
      searchParams = new URLSearchParams(queryParamsString);
    var location = searchParams.get("location_id");
    if (location === "null") {
      location = "Los_Angeles";
    }
    return (
      <div className={classes.root}>
        <HotelWidget className={classes.hotel} location={location} />
        <Helmet>
          <script src="https://widget.getyourguide.com/v2/widget.js" />
        </Helmet>
        <div
          data-gyg-href="https://widget.getyourguide.com/default/activites.frame"
          data-gyg-locale-code="en-US"
          data-gyg-widget="activities"
          data-gyg-number-of-items="7"
          data-gyg-currency="USD"
          data-gyg-see-more="true"
          data-gyg-partner-id="QFB5S0B"
          data-gyg-q={location}
        />
      </div>
    );
  }
}

TourPage.propTypes = {
  // Injected by the documentation to work in an iframe.
  // You won't need it on your project.
  container: PropTypes.object,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TourPage);
