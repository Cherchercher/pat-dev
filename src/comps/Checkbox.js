import React from "react";
import Checkbox from "material-ui/Checkbox";
import ActionFavorite from "material-ui/svg-icons/action/favorite";
import ActionFavoriteBorder from "material-ui/svg-icons/action/favorite-border";
const styles = {
  margin: 12,
  block: {
    maxWidth: 250
  },
  checkbox: {
    marginBottom: 16
  },
  checkboxNested: {
    marginBottom: 16,
    marginLeft: 28
  }
};

export class CheckboxField extends React.PureComponent {
  handleCheck = (event, isInputChecked) => {
    this.props.onChange(event, isInputChecked, this.props.category);
  };

  render() {
    return (
      <Checkbox
        label={this.props.label}
        value={this.props.category}
        onCheck={this.handleCheck}
        defaultChecked={this.props.checked}
        checkedIcon={<ActionFavorite />}
        uncheckedIcon={<ActionFavoriteBorder />}
        style={styles.checkboxNested}
      />
    );
  }
}

export default CheckboxField;
