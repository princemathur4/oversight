import { AppBar, Toolbar, Button, Typography, IconButton } from "@material-ui/core";
import React, { Component } from "react";
import './style.scss';
import { Hub } from 'aws-amplify';
import Auth from "@aws-amplify/auth";


export default class NavBar extends Component {
    constructor(props){
        super(props);
        Hub.listen("auth", ({ payload: { event, data } }) => {
            switch (event) {
                case "signOut":
                    // window.history.pushState(
                    //     "",
                    //     "", 
                    //     "/" + window.location.href.substring(window.location.href.lastIndexOf('/') + 1).split("?")[0]
                    // ); // clear all params from url
                    this.props.auth.setAuthStatus(false);
                    this.props.auth.setUser(null);
                    console.log("hub signout", window.location.href.split(window.location.origin)[1]);
                    this.props.history.push(window.location.href.split(window.location.origin)[1]);
                    break;

                default:
                    break;
            }
        });
    }

    handleLogout = (event) => {
        event.preventDefault();

        try {
            Auth.signOut();
        } catch (error) {
            console.log(error.message);
        }
    }

    render() {
        return (
            <AppBar position="static" className="navbar">
                <Toolbar className="nav-toolbar">
                    <Typography variant="h6" >Labroz Oversight</Typography>
                    {
                        !this.props.auth.isAuthenticated && this.props.location.pathname !== "/login" &&
                        <Button color="inherit">Login</Button>
                    }
                    {
                        this.props.auth.isAuthenticated && 
                        <Button color="inherit" onClick={this.handleLogout}>Logout</Button>
                    }
                </Toolbar>
            </AppBar>
        )
    }
}