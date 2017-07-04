import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'; // ES6
import { logout } from '../actions/userActions'
// import { logout } from '../actions/authActions';

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_in: this.props.logged_in
    };
    this.logout = this.logout.bind(this);
  }

 static get contextTypes() {
        return {
            router: PropTypes.object.isRequired,
        };
    }
    
  logout(e) {
    e.preventDefault();
    this.props.logout()
    .then(() => {
                this.context.router.history.push('/')
            })
  }

  render() {
    const { logged_in } = this.props;
    const userLinks = (
      <ul className="nav navbar-nav navbar-right">
        <li><a href="#" onClick={this.logout.bind(this)}><span className="glyphicon glyphicon-log-out"></span> Logout</a></li>
      </ul>
    );

    const guestLinks = (
      <ul className="nav navbar-nav navbar-right">
        <li><Link to="/register"><span className="glyphicon glyphicon-user"></span> Register</Link></li>
        <li><Link to="/login" ><span className="glyphicon glyphicon-log-in"></span> Login</Link></li>
      </ul>
    );

    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <ul className="nav navbar-nav">
              <li className="active"><Link to="/" className="navbar-brand">Home</Link></li>
              <li className="dropdown">
                <a className="dropdown-toggle " data-toggle="dropdown" href="#">Data

                <span className="caret"></span>
                </a>
                <ul className="dropdown-menu">
                  <li><Link to="/data/steps"  >steps</Link></li>
                  <li><Link to="/data/scenarios">scenarios</Link></li>
                  <li><Link to="/data/tests">tests</Link></li>
                  <li><Link to="/data/cores">cores</Link></li>
                  <li><Link to="/data/users">users</Link></li>
                </ul>
              </li>
            </ul>
            
          </div>

          <div className="collapse navbar-collapse">
            {logged_in ? userLinks : guestLinks}
          </div>
        </div>
      </nav>
    );
  }
}


function mapStateToProps(state) {
  return {
    logged_in: state.user.logged_in,
    logout: PropTypes.func.isRequired

  };
}

export default connect(mapStateToProps, { logout })(NavigationBar);
