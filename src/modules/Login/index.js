import React, { Component, Fragment } from 'react';
import Auth from '@aws-amplify/auth';
import { Link } from "react-router-dom";
import commonApi from "../../api/common";
import { Button, TextField, } from '@material-ui/core';
import './style.scss';


class Login extends Component {
    state = {
        mobile: '',
        mobile: '',
        password: '',
        isLoading: false,
        isAuthenticated: false,
        user: null,
        responseText: "",
        responseType: "error",
        errors: {
            mobileInvalid: false,
            passwordInvalid: false,
        },
        isSubmitted: false
    };

    componentDidMount(){
        if(this.props.auth.isAuthenticated){
            this.props.history.push('/add_product')
        }
    }
    
    componentDidUpdate(){
        if(this.props.auth.isAuthenticated){
            this.props.history.push('/add_product')
        }
    }

    clearErrorState = () => {
        this.setState({
            responseText: "",
            errors: {
                mobileInvalid: false,
                mobileInvalid: false,
                passwordInvalid: false,
            }
        });
    };

    onLoginSubmit = async event => {
        event.preventDefault();

        try {
            this.setState({ isLoading: true });
            this.clearErrorState();

            if (!this.state.mobile || !this.state.password) {
                this.setState({
                    mobileInvalid: !this.state.mobile,
                    passwordInvalid: !this.state.password
                })
                return;
            }

            // AWS Cognito integration here
            const { password } = this.state;
            const username = "+91" + this.state.mobile;
            const user = await Auth.signIn(username, password);

            if (user.hasOwnProperty("challengeName") && user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                console.log("challenge encountered");
                //     "Seems like you are entering a temporary password. Please create a fresh new password using the link previously sent to your mail or generate a new link here.",
                //     {
                //         link: "/resendmail",
                //         text: "Resend link",
                //         className: ""
                //     }
                // this.props.store.mobileFromPreviousScreen = this.state.mobile;
                return;
            }

            try {
                await commonApi.post('login', {},
                    { headers: { "Authorization": user.signInUserSession.accessToken.jwtToken } }
                );
            } catch (e) {
                console.log(e);
            }
            this.setState({ isLoading: false });
            this.props.auth.setAuthStatus(true);
            this.props.auth.setUser(user);
        } catch (err) {
            let responseText = 'Something went wrong, Please try again later!';
            if (err.code === 'UserNotConfirmedException') {
                responseText = "Seems like you didn't finish the mobile verification. Please click on the link below to resend verification mail.";
                this.setState({ resendLinkActive: true })
                // The error happens if the user didn't finish the confirmation step when signing up
                // In this case you need to resend the code and confirm the user
                // About how to resend the code and confirm the user, please check the signUp part
            } else if (err.code === 'PasswordResetRequiredException') {
                responseText = "Password needs to be reset. Please go to forgot password page to finish the process.";
                // The error happens when the password is reset in the Cognito console
                // In this case you need to call forgotPassword to reset the password
                // Please check the Forgot Password part.
            } else if (err.code === 'NotAuthorizedException') {
                responseText = "Incorrect phone number or password";
                // The error happens when the incorrect password is provided
            } else if (err.code === 'UserNotFoundException') {
                responseText = "User does not exist. Please try signing up with us first to login.";
                // The error happens when the supplied username/mobile does not exist in the Cognito user pool
            } else {
                console.log(err);
            }
            this.setState({
                responseText,
                errors: {
                    ...this.state.errors,
                },
                isLoading: false
            });
        }
    };

    onInputChange = event => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    onKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.onLoginSubmit(e);
        }
    };

    handleClose = () => {
        this.setState({
            responseText: "",
            responseType: ""
        })
    }

    render() {
        return (
            <Fragment>
                <div className="login-container">
                    <div className="login-card">
                        <div className="login-header">
                            Login
                        </div>
                        <div className="login-body">

                            <div className="field">
                                <TextField
                                    className="mobile-input"
                                    name="mobile"
                                    type="text"
                                    variant="outlined"
                                    error={this.state.errors.mobileInvalid}
                                    label="Phone number"
                                    onChange={this.onInputChange}
                                    onKeyPress={this.onKeyPress}
                                />
                            </div>
                            <div className="field">
                                <TextField
                                    className="password-input"
                                    name="password"
                                    type="password"
                                    variant="outlined"
                                    label="Password"
                                    onChange={this.onInputChange}
                                    onKeyPress={this.onKeyPress}
                                />
                            </div>
                            {
                                this.state.responseText &&
                                <div className={`response-text is-${this.state.responseType}`}>
                                    <span className="response-tag">
                                        {this.state.responseText}
                                    </span>
                                </div>
                            }
                            <button
                                className={this.state.isLoading ? "button login-button is-loading" : "login-button"}
                                onClick={this.onLoginSubmit}
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </Fragment >
        );
    }
}

export default Login;
