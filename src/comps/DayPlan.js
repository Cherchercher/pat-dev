/*Location *Hotel Nearby (optional) *start date* end date *items per day (optional)
*recent plans (login to view)
options: like this plan, save this plan, share this plan with a friend */

import React from "react";
import Loading from "react-loading-animation";
import Day from "./Day";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import "font-awesome/css/font-awesome.css";

const styles = (theme) => ({
  layout: {
    width: "auto",
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
});

class DayPlan extends React.Component {
  constructor() {
    super();
    this.state = {
      mounted: false,
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  render() {
    if (this.state.mounted) {
      return (
        <Day
          noResult={this.props.noResult}
          data={this.props.pageData}
          location={this.props.location}
        />
      );
    } else {
      return <Loading />;
    }
  }
}

DayPlan.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DayPlan);
