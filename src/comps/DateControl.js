import React from "react";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as Actions from "../action/dateActions";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

/*Location *Hotel Nearby (optional) *start date* end date *items per day (optional)*/

const styles = (theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  input: {
    fontSize: 13,
    height: "10px",
  },
  marginTop: {
    marginTop: 1.4 * theme.spacing.unit,
  },
  tap: {
    marginTop: 1.4 * theme.spacing.unit,
    marginRight: 1.7 * theme.spacing.unit,
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: "block",
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none",
  },
  hidden: {
    display: "none",
  },
  borderedIcons: {
    borderRadius: "5px",
  },
});

class DateControl extends React.Component {
  componentDidMount() {
    this.props.getDate();
  }

  handleDepartDate = (event, newValue) => {
    this.props.setStartDate(newValue);
  };

  handleReturnDate = (event, newValue) => {
    this.props.setEndDate(newValue);
  };

  render() {
    return (
      <Grid
        container
        style={{
          paddingTop: "10px",
        }}
      >
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            margin="normal"
            id="mui-pickers-date"
            label="Departure"
            value={this.props.date.start_date}
            format="MM/dd/yy"
            onChange={this.handleDepartDate.bind(this)}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />

          <KeyboardDatePicker
            margin="normal"
            id="mui-pickers-date"
            label="Return"
            format="MM/dd/yy"
            value={this.props.date.end_date}
            onChange={this.handleReturnDate.bind(this)}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
      </Grid>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    date: state.date,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(DateControl)
);
