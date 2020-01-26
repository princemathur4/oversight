import React, { Fragment } from 'react';
import './App.scss';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import NavBar from "./components/NavBar";
import { routes } from "./constants/routes";
import Auth from '@aws-amplify/auth';
import "./imports";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isAuthenticated: false,
			isAuthenticating: true,
			user: null,
		}
	}

	setAuthStatus = authenticated => {
		this.setState({ isAuthenticated: authenticated });
	};

	setUser = user => {
		try {
			this.setState({ user: user });
			console.log("user", user);
		} catch (ex) {
			console.error(ex);
		}
	};

	async componentDidMount() {
		this.authenticateUser();
	}

	async authenticateUser() {
		try {
			const session = await Auth.currentSession();
			const user = await Auth.currentAuthenticatedUser();
			console.log("user", user);
			this.setState({
				user: user,
				isAuthenticated: true,
				isAuthenticating: false
			});
		} catch (error) {
			console.log("user", null);
			this.setState({
				user: null,
				isAuthenticated: false,
				isAuthenticating: false
			});

			console.log(error);
		}
	}

	render() {
		const authProps = {
			isAuthenticated: this.state.isAuthenticated,
			user: this.state.user,
			setAuthStatus: this.setAuthStatus,
			setUser: this.setUser,
		};
		return (
			!this.state.isAuthenticating &&
			<div className="App">
				<Router >
					{
						routes.map(({ path, component: C, name, customProps, authRequired }) => (
							<Route path={path} exact={true} key={name}
								render={
									(props) => {
											return (
												<Fragment>
													{
														path !== "/login" &&
														<NavBar {...props} name={customProps.name} auth={authProps} />
													}
													{
														!authRequired ?
															<C
																{...props}
																{...customProps}
																auth={authProps}
															/>
															: (
																(authRequired && this.state.isAuthenticated)
																	?
																	<C
																		{...props}
																		{...customProps}
																		auth={authProps}
																	/>
																	:
																	<Redirect to="/login" />
															)
													}
												</Fragment>
											)
									}
								}
							>
							</Route>
						))
					}
				</Router>
			</div>
		);
	}
}

export default App;
