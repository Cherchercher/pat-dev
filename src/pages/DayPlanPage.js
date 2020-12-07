import React, { Component } from "react";
import PropTypes from "prop-types";
import Triposo from "../api/Triposo";
import Loading from "react-loading-animation";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";
import TagManager from "react-gtm-module";
import DayPlan from "../comps/DayPlan";
import { connect } from "react-redux";

//move credentials to hidden files
const styles = (theme) => ({
  root: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      marginTop: "100px",
    },
    [theme.breakpoints.down("md")]: {
      marginTop: "180px",
    },
    [theme.breakpoints.up("md")]: {
      marginTop: "150px",
    },
    marginRight: "10px",
    marginLeft: "10px",
  },

  menuButton: {
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },

  content: {
    flexGrow: 1,
    padding: 0,
  },
});

class DayPlanPage extends Component {
  constructor() {
    super();
    this.state = {
      mobileOpen: false,
      setMobileOpen: false,
      pageData: null,
      location: "Los_Angeles",
      noResult: true,
      // params: {
      //   location_id: null,
      //   items_per_day: null,
      //   hotel_poi_id: null,
      //   max_distance: null,
      //   items_per_day: null,
      //   start_date: null,
      //   end_date: null,
      //   arrival_time: null,
      //   departure_time: null,
      //   seed: null
      // }
    };
  }

  // componentWillMount() {
  //   this.unlisten = this.props.history.listen((location, action) => {});
  // }

  // componentWillUnmount() {
  //   this.unlisten();
  // }

  async componentWillReceiveProps(nextProps) {
    if (
      nextProps.location !== this.props.location ||
      nextProps.date !== this.props.date
    ) {
      const tagManagerArgs = {
        gtmId: "GTM-N3RP2F7",
      };
      TagManager.initialize(tagManagerArgs);

      try {
        const start = nextProps.date.start_date;
        const end = nextProps.date.end_date;

        const queryParamsString = nextProps.location.search.substring(1), // remove the "?" at the start
          searchParams = new URLSearchParams(queryParamsString);
        var location = searchParams.get("location_id");
        if (location === "null") {
          location = "Los_Angeles";
        }
        //location,hotel_poi='',distance='',items='',start= '' ,end = '',arrival='',departure='',Isseed=false
        const results = await this.props.Triposo.dayPlanner({
          location_id: location,
          start_date:
            start.getFullYear() +
            "-" +
            (start.getMonth() + 1) +
            "-" +
            start.getDate(),
          end_date:
            end.getFullYear() +
            "-" +
            (end.getMonth() + 1) +
            "-" +
            end.getDate(),
        });
        this.setState({
          pageData: results,
          mounted: true,
          noResult: false,
          location: location,
        });
      } catch (e) {
        this.setState({ noResult: true });
      }
    }
  }

  async componentDidMount() {
    const tagManagerArgs = {
      gtmId: "GTM-N3RP2F7",
    };
    TagManager.initialize(tagManagerArgs);
    try {
      const start = this.props.date.start_date;
      const end = this.props.date.end_date;
      const queryParamsString = this.props.location.search.substring(1), // remove the "?" at the start
        searchParams = new URLSearchParams(queryParamsString);
      var location = searchParams.get("location_id");

      if (location === "null") {
        location = "Los_Angeles";
      }
      //location,hotel_poi='',distance='',items='',start= '' ,end = '',arrival='',departure='',Isseed=false
      const results = await this.props.Triposo.dayPlanner({
        location_id: location,
        start_date:
          start.getFullYear() +
          "-" +
          (start.getMonth() + 1) +
          "-" +
          start.getDate(),
        end_date:
          end.getFullYear() + "-" + (end.getMonth() + 1) + "-" + end.getDate(),
      });

      if (results.error) {
        this.setState({
          noResult: true,
        });
      } else {
        this.setState({
          pageData: results,
          mounted: true,
          noResult: false,
          location: location,
        });
      }
    } catch (e) {
      console.log(e);
      this.setState({ noResult: true });
    }
  }

  render() {
    if (this.state.mounted) {
      const { classes } = this.props;
      var { pageData, noResult } = this.state;
      const queryParamsString = this.props.location.search.substring(1), // remove the "?" at the start
        searchParams = new URLSearchParams(queryParamsString);
      const location = searchParams.get("location_id").replace("_", " ");
      return (
        <div className={classes.root}>
          <CssBaseline />
          <DayPlan
            location={location}
            pageData={pageData}
            noResult={noResult}
          />
        </div>
      );
    } else {
      return <Loading />;
    }
  }
}

function mapStateToProps(state, props) {
  return {
    date: state.date,
  };
}

DayPlanPage.propTypes = {
  // Injected by the documentation to work in an iframe.
  // You won't need it on your project.
  container: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, null)(DayPlanPage));
