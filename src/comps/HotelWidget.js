import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {},
});

class HotelWidget extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Helmet>
          <script type="text/javascript">
            {(function(d, sc, u) {
              var s = d.createElement(sc),
                p = d.getElementsByTagName(sc)[0];
              s.type = "text/javascript";
              s.async = true;
              s.src = u + "?v=" + +new Date();
              p.parentNode.insertBefore(s, p);
            })(
              document,
              "script",
              "//aff.bstatic.com/static/affiliate_base/js/flexiproduct.js"
            )}
          </script>
        </Helmet>

        <ins
          className="bookingaff"
          data-aid="1956531"
          data-target_aid="1956531"
          data-prod="map"
          data-width="90%"
          data-height="590"
          data-lang="ualng"
          data-dest_id="0"
          data-dest_type="landmark"
          data-latitude="34.0928092"
          data-longitude="-118.3286614"
          data-landmark_name="Hollywood"
          data-mwhsb="0"
          data-address="Hollywood, Los Angeles, CA, USA"
        >
          <a href="//www.booking.com?aid=1956531">Booking.com</a>
        </ins>
      </div>
    );
  }
}

HotelWidget.propTypes = {
  // Injected by the documentation to work in an iframe.
  // You won't need it on your project.
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HotelWidget);
