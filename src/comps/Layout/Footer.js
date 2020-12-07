import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo_ww_pat.png";
import * as Icon from "react-feather";

export default class Footer extends React.Component {
  render() {
    return (
      <footer className="footer-area bg-f7fafd">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="single-footer-widget">
                <div className="row">
                  <Link to={"/"}>
                    <a>
                      <img src={logo} alt="logo" />
                    </a>
                  </Link>
                </div>
                {/* 
                <div className="row">
                  <Icon.Mail />
                  Email:{" "}
                  <Link to={`/`}>
                    <a>contact@goplanatrip.com</a>
                  </Link>
                </div>

                <div className="row">
                  <Icon.PhoneCall />
                  Phone:{" "}
                  <Link to={`/`}>
                    <a>+ (949) 522 1389</a>
                  </Link>
                </div> */}
                <div className="row">
                  <div className="col-lg-4">
                    <Link
                      to={`/https://www.facebook.com/Plan-A-Trip-1890547231215935`}
                    >
                      <a className="facebook">
                        <Icon.Facebook />
                      </a>
                    </Link>
                  </div>
                  {/* <li>
                    <Link to={`/`}>
                      <a className="twitter">
                        <Icon.Twitter />
                      </a>
                    </Link>
                  </li> */}
                  <div className="col-lg-4">
                    <Link to={`/https://www.instagram.com/goplanatrip`}>
                      <a className="instagram">
                        <Icon.Instagram />
                      </a>
                    </Link>
                  </div>
                  <div className="col-lg-4">
                    <Link to={`/https://www.linkedin.com/company/plan-a-trip`}>
                      <a className="linkedin">
                        <Icon.Linkedin />
                      </a>
                    </Link>
                  </div>
                  <div className="col-lg-4">
                    <a className="PhoneCall" href="tel:949-522-1389">
                      <Icon.PhoneCall />
                    </a>
                  </div>
                  <div className="col-lg-4">
                    <a className="Mail" href="mailto:contact@goplanatrip.com">
                      <Icon.Mail />
                    </a>
                  </div>
                </div>
                <p>Fun, fast, free travel planning.</p>
                <div className="copyright-area">
                  <p>Copyright @2020 Plan A Trip. All rights reserved.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="col-lg-3 col-md-6">
              <div className="single-footer-widget pl-5">
                <h3>Company</h3>
                <ul className="list">
                  <li>
                    <Link to={`/`}>
                      <a>About Us</a>
                    </Link>
                  </li>
                  <li>
                    <Link to={`/`}>
                      <a>Services</a>
                    </Link>
                  </li>
                  <li>
                    <Link to={`/`}>
                      <a>Features</a>
                    </Link>
                  </li>
                  <li>
                    <Link to={`/`}>
                      <a>Latest News</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div> */}

        {/* <div className="col-lg-3 col-md-6">
              <div className="single-footer-widget">
                <h3>Support</h3>
                <ul className="list">
                  <li>
                    <Link to={`/`}>
                      <a>FAQ's</a>
                    </Link>
                  </li>
                  <li>
                    <Link to={`/`}>
                      <a>Privacy Policy</a>
                    </Link>
                  </li>
                  <li>
                    <Link to={`/`}>
                      <a>Terms & Condition</a>
                    </Link>
                  </li>
                  <li>
                    <Link to={`/`}>
                      <a>Community</a>
                    </Link>
                  </li>
                  <li>
                    <Link to={`/`}>
                      <a>Contact Us</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div> */}

        {/* <div className="col-lg-3 col-md-6">
              <div className="single-footer-widget">
                <h3>Address</h3>

                <ul className="footer-contact-info">
                  <li>
                    <Icon.Mail />
                    Email:{" "}
                    <Link to={`/`}>
                      <a>contact@goplanatrip.com</a>
                    </Link>
                  </li>
                  <li>
                    <Icon.PhoneCall />
                    Phone:{" "}
                    <Link to={`/`}>
                      <a>+ (949) 522 1389</a>
                    </Link>
                  </li>
                </ul>
                <ul className="social-links">
                  <li>
                    <Link
                      to={`/https://www.facebook.com/Plan-A-Trip-1890547231215935`}
                    >
                      <a className="facebook">
                        <Icon.Facebook />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link to={`/`}>
                      <a className="twitter">
                        <Icon.Twitter />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link to={`/https://www.instagram.com/goplanatrip`}>
                      <a className="instagram">
                        <Icon.Instagram />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link to={`/https://www.linkedin.com/company/plan-a-trip`}>
                      <a className="linkedin">
                        <Icon.Linkedin />
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div> */}
      </footer>
    );
  }
}
