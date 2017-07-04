import React from 'react';
import { connect } from 'react-redux';

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user
    };
  }


  render() {
    const { user, email, logged_in } = this.props;
    const user_tag = (
      <ul className="nav navbar-nav navbar-right">
        <div className="navbar-brand">{logged_in ? (user + " (" + email + ")") : ""}</div>
      </ul>
    );

    return (
      <div className="navbar navbar-inverse navbar-fixed-bottom">
        <div className="container-fluid">
          <div className="container">
            <div className="navbar-collapse collapse" id="footer-body" style={{ position: 'absolute', right: 0 }}>{user_tag}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.user,
    logged_in: state.user.logged_in,
    email: state.user.email
  };
}

export default connect(mapStateToProps, null)(NavigationBar);
