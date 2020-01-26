import { AppBar, Toolbar, Button, Typography, IconButton } from "@material-ui/core";
import React, { Component, Fragment } from "react";
import './style.scss';
import { Hub } from 'aws-amplify';
import Auth from "@aws-amplify/auth";
import { Link } from "react-router-dom";


export default class NavBar extends Component {
    constructor(props) {
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
            <div className="nav-bar">
                <div className="nav-header">
                    <img src="larboz-logo.png" className="logo-img"></img>
                    <div className="heading">Labroz Oversight</div>
                </div>
                {this.props.auth.isAuthenticated &&
                <Fragment>
                    <div class="tabs">
                        <ul>
                            <li class={this.props.location.pathname === "/add_product" ? "is-active" : ""}>
                                <Link to="/add_product">Add Products</Link>
                            </li>
                            <li class={this.props.location.pathname === "/update_product" ? "is-active" : ""}>
                                <Link to="/update_product">Update Products</Link>
                            </li>
                            <li class={this.props.location.pathname === "/update_order" ? "is-active" : ""}>
                                <Link to="/update_order">Update Orders</Link>
                            </li>
                        </ul>
                    </div>
                    <button className="logout-btn button is-light" onClick={this.handleLogout}>Logout</button>
                </Fragment>
                }
            </div>
        )
    }
}