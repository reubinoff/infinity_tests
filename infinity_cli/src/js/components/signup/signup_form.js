import React from 'react';
import TextFieldGroup from '../common/TextFirldGroup';
import PropTypes from 'prop-types'; // ES6
import { user_register, is_user_exists, setCurrentUser } from '../../actions/userActions'
import { connect } from 'react-redux';

class SignupForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            timezone: '',
            errors: {},
            isLoading: false,
            invalid: false
        }

        this.onChange = this
            .onChange
            .bind(this);
        this.onSubmit = this
            .onSubmit
            .bind(this);
        this.checkUserExists = this
            .checkUserExists
            .bind(this);
    }
    static get contextTypes() {
        return {
            router: PropTypes.object.isRequired,
        };
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    checkUserExists(e) {
        const field = e.target.name;
        const val = e.target.value;
        if (val !== '') {
            this
                .props
                .is_user_exists(val)
                .then(res => {
                    let errors = this.state.errors;
                    let invalid;
                    if (res.data.user) {
                        errors[field] = 'There is user with such ' + field;
                        invalid = true;
                    } else {
                        errors[field] = '';
                        invalid = false;
                    }
                    this.setState({ errors, invalid });
                })
                .catch(
                err => {
                    let errors = this.state.errors;
                    let invalid;
                    errors[field] = '';
                    invalid = false;
                    this.setState({ errors, invalid });
                }
                )
        }
    }

    onSubmit(e) {
        e.preventDefault();

        this.setState({ errors: {}, isLoading: true });
        this
            .props
            .user_register(this.state)
            .then(() => {
                this.context.router.history.push('/')
            }
            ,
            (err) => {
                this.setState({ errors: err.response.data.errors, isLoading: false })
            }
            )

    }

    render() {
        const { errors } = this.state;

        return (
            <form onSubmit={this.onSubmit}>
                <h1>Join our community!</h1>

                <TextFieldGroup
                    error={errors.username}
                    label="Username"
                    onChange={this.onChange}
                    checkUserExists={this.checkUserExists}
                    value={this.state.username}
                    field="username" />

                <TextFieldGroup
                    error={errors.email}
                    label="Email"
                    onChange={this.onChange}
                    checkUserExists={this.checkUserExists}
                    value={this.state.email}
                    field="email" />

                <TextFieldGroup
                    error={errors.password}
                    label="Password"
                    onChange={this.onChange}
                    value={this.state.password}
                    field="password"
                    type="password" />

                <TextFieldGroup
                    error={errors.passwordConfirmation}
                    label="Password Confirmation"
                    onChange={this.onChange}
                    value={this.state.passwordConfirmation}
                    field="passwordConfirmation"
                    type="password" />


                <div className="form-group">
                    <button
                        disabled={this.state.isLoading || this.state.invalid}
                        className="btn btn-primary btn-lg">
                        Sign up
                    </button>
                </div>
            </form>
        );
    }
}


SignupForm.propTypes = {
    user_register: PropTypes.func.isRequired
}



export default connect(null, { user_register, is_user_exists, setCurrentUser })(SignupForm);
