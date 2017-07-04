import React from 'react';
import TextFieldGroup from '../common/TextFirldGroup';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'; // ES6
import { login } from '../../actions/userActions'


class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      identifier: '',
      password: '',
      errors: {},
      isLoading: false
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }
 static get contextTypes() {
    return {
      router: PropTypes.object.isRequired,
    };
  }


  onSubmit(e) {
    e.preventDefault();
    this.setState({ errors: {}, isLoading: true });
    this.props.login(this.state.identifier, this.state.password).then(
      (res) => this.context.router.history.push('/'),
      (err) => this.setState({ errors: err.response.data.errors, isLoading: false })
    );
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { identifier, password, isLoading } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <h1>Login</h1>


        <TextFieldGroup
          field="identifier"
          label="Username / Email"
          value={identifier}

          onChange={this.onChange}
        />

        <TextFieldGroup
          field="password"
          label="Password"
          value={password}
          onChange={this.onChange}
          type="password"
        />

        <div className="form-group"><button className="btn btn-primary btn-lg" disabled={isLoading}>Login</button></div>
      </form>
    );
  }
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired
}


export default connect(null, { login })(LoginForm);
