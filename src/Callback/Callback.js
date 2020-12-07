import { Component } from "react";

class Callback extends Component {
  // componentWillMount() {
  //   const { isAuthenticated } = this.props.auth;
  //   if (isAuthenticated()) {
  //     if (localStorage.getItem("prevPath") === "/plans") {
  //       this.props.history.push(`/plans`);
  //     } else {
  //       this.props.history.push(`/persona`);
  //     }
  //   } else {
  //     this.props.auth.login();
  //   }
  // }

  componentDidMount() {
    const { isAuthenticated } = this.props.auth;
    if (isAuthenticated()) {
      if (localStorage.getItem("prevPath") === "/plans") {
        this.props.history.push(`/plans`);
      } else {
        this.props.history.push(`/persona`);
      }
    } else {
      this.props.auth.login();
    }
  }
  render() {
    return null;
  }
}

export default Callback;
