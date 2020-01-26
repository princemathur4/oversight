import React, { Component, Fragment } from 'react';
import common from "../../api/common";
import { getSession } from "../../utils/AuthUtils";
import "./style.scss";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Select, MenuItem, TextField, FormControl, InputLabel } from '@material-ui/core';
import { titleCase } from "../../utils/utilFunctions";
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Dropdown, Header } from 'semantic-ui-react';


const moment = require('moment');

axios.interceptors.response.use((response) => {
    return response;
}, error => {
    let err;
    if (error.hasOwnProperty("response")) {
        console.log("interceptor", error.response)
        err = error.response;
    } else {
        err = error;
    }
    return Promise.reject(err);
});

export default class UpdateProduct extends Component {
    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
        this.state = {
            isLoading: false,
            isDropdownActive: false,
            fileInputKey: moment.now(),
            files: [],
            screen: "selection",
            productResults: [],
            productListLoader: true,
            responseText: "",
            responseType: "error",
            activeDropdown: false,
            errors: {
                file_invalid: null,
            },
            dropdownOptions: [],
            sizeOptions: [],
            currentProductJson: {},
            stock: 0,
            size: null,
            payload: {}
        };
        this.node = null;
    }

    clearErrorState = () => {
        this.setState({
            responseText: "",
            errors: {
                file_invalid: null,
            }
        });
    };


    componentDidMount() {
        this.getAllProducts();
    }

    getAllProducts = async () => {
        this.setState({ productListLoader: true });

        let session = await getSession();
        if (!session) {
            return;
        }
        let response;
        try {
            response = await common.post(
                'products',
            );
            console.log("response", response);
            if (response && response.status === 200 && response.data.success) {
                this.setState({
                    productResults: response.data.data.products,
                    productListLoader: false
                });
            } else {
                this.setState({
                    productResults: [],
                    productListLoader: false,
                    responseType: "error",
                    responseText: response.data.message
                });
            }
        } catch (err) {
            this.setState({
                productResults: [], productListLoader: false,
            });
        }
        this.updateDropdownOptions();
    }

    handleSubmit = async () => {
        if (!this.state.size){
            this.setState({
                responseText: "Please select a size from dropdown",
                responseType: "error"
            })
        }
        if (!this.state.stock && (!Object.keys(this.state.payload).length)){
            this.setState({
                responseText: "Update a field before submitting",
                responseType: "error"
            })
        }
        let payload = { size: this.state.size, product_code: this.state.currentProductJson._id ,...this.state.payload };
        if (this.state.stock){
            payload = {...payload, stock: Number(this.state.stock)}
        }
        let session = await getSession();
        if (!session) {
            return;
        }
        let response;
        try {
            response = await common.post(
                'update_product_stock', payload, { headers: { "Authorization": session.accessToken.jwtToken } }
            );
            console.log("response", response);
            if (response && response.status === 200 && response.data.success) {
                this.setState({
                    productResults: response.data.data.products,
                    productListLoader: false
                });
            } else {
                this.setState({
                    productResults: [],
                    productListLoader: false,
                    responseType: "error",
                    responseText: response.data.message
                });
            }
        } catch (err) {
            this.setState({
                
            });
        }

    }

    getDropdownItem = (productObj, idx) => {
        return (
            <div className="product-dropdown-item">
                <div className="product-dropdown-left-container">
                    <img src={productObj.images && productObj.images.length ? productObj.images[0] : "https://i.ibb.co/48hHjC8/Plum-01-900x.png"}
                        className="product-dropdown-thumbnail-image"
                    />
                </div>
                <div className="product-dropdown-right-container">
                    <div className="first-column">
                        <div className="product-title">
                            {productObj.title ? productObj.title : "Product Title"} {`(${titleCase(productObj.category)}/${titleCase(productObj.sub_category)})`}
                        </div>
                        <div className="product-description">
                            {productObj.description ? productObj.description : "Product description"}
                        </div>
                        <div className="product-stock">
                            Available Stock: {productObj.total_stock}
                        </div>
                    </div>
                    <div className="second-column">
                        <div className="price">
                            ₹{productObj.price}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    updateSizeDropdownOptions = (currentProductJson) => {
        let sizeOptions = currentProductJson.available_sizes.map((size) => {
            return (
                { key: size, value: size, text: size }
            )
        })
        this.setState({
            sizeOptions
        })
    }

    updateDropdownOptions = () => {
        let optionsList = this.state.productResults.map((productObj, idx) => {
            return (
                {
                    key: idx,
                    text: productObj.title,
                    value: idx,
                    content: this.getDropdownItem(productObj, idx),
                }
            )
        })
        this.setState({
            dropdownOptions: optionsList
        })
    }

    handleScreenChange = (screen) => {
        this.setState({
            screen
        })
    }

    handleProductChange = (e, f) => {
        this.setState({
            screen: "form",
            currentProductJson: this.state.productResults[f.value]
        })
        this.updateSizeDropdownOptions(this.state.productResults[f.value]);
    }

    handleSizeChange = (e, f) => {
        this.setState({
            size: f.value
        })
    }

    handleInputChange = (e, f) => {
        console.log(e, f)
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    getTextInputJSX = (type, name, title, classname) => {
        return (
            <TextField
                className={classname}
                name={name}
                type={type}
                variant="outlined"
                label={title}
                onChange={this.onInputChange}
                value={this.state.payload.hasOwnProperty(name) ? this.state.payload[name] : this.state.currentProductJson[name]}
            />
        )
    }

    onInputChange = event => {
        let payload = { ...this.state.payload };
        payload[event.target.name] = event.target.value;
        this.setState({
            payload
        });
    };

    render() {
        return (
            <div className="update-products-container">
                {
                    this.state.productListLoader ?
                        <CircularProgress className="product-list-loader" />
                        :
                        this.state.screen === "selection" ?
                            <div className="dropdown-container">
                                <Dropdown
                                    placeholder='Select a Product'
                                    fluid
                                    search
                                    selection
                                    options={this.state.dropdownOptions}
                                    onChange={this.handleProductChange}
                                />
                            </div>
                            :
                            this.state.screen === "form" &&
                            <div className="product-content">
                                <div className="product-images">
                                    <button class="button" onClick={() => { this.handleScreenChange("selection") }}>
                                        <span class="icon">
                                            <FontAwesomeIcon icon="angle-left" />
                                        </span>
                                        <span>Go Back</span>
                                    </button>
                                    <img src={this.state.currentProductJson.images && this.state.currentProductJson.images.length ?
                                        this.state.currentProductJson.images[0] : "https://i.ibb.co/48hHjC8/Plum-01-900x.png"}
                                        className="product-dropdown-image"
                                    />
                                </div>
                                <div className="update-form">
                                    <div className="title">Update Product Details</div>

                                    <div className="field-container">
                                        <div className="field-title">Category</div>
                                        <div className="field-form">
                                            {titleCase(this.state.currentProductJson.category)}
                                        </div>
                                    </div>
                                    <div className="field-container">
                                        <div className="field-title">Sub-Category</div>
                                        <div className="field-form">
                                            {titleCase(this.state.currentProductJson.sub_category)}
                                        </div>
                                    </div>
                                    <div className="field-container">
                                        <div className="field-title">Select a size</div>
                                        <div className="field-form">
                                            <Dropdown
                                                placeholder='Product Sizes'
                                                fluid
                                                search
                                                selection
                                                options={this.state.sizeOptions}
                                                onChange={this.handleSizeChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="field-container">
                                        <div className="field-title">Add Product Stock</div>
                                        <div className="field-form">
                                            <TextField
                                                name="stock"
                                                type="number"
                                                variant="outlined"                                                variant="outlined"
                                                label="Stock"
                                                onChange={this.handleInputChange}
                                                value={this.state.stock}
                                            />
                                        </div>
                                    </div>
                                    <div className="field-container">
                                        <div className="field-title">Product Title</div>
                                        <div className="field-form">
                                            {this.getTextInputJSX("text", "title", "Title", "" )}
                                        </div>
                                    </div>
                                    <div className="field-container">
                                        <div className="field-title">Product Description</div>
                                        <div className="field-form">
                                            {this.getTextInputJSX("text", "description", "Description", "" )}
                                        </div>
                                    </div>
                                    <div className="field-container">
                                        <div className="field-title">Color</div>
                                        <div className="field-form">
                                            {this.getTextInputJSX("text", "color", "Color", "" )}
                                        </div>
                                    </div>
                                    <div className="field-container">
                                        <div className="field-title">Color code</div>
                                        <div className="field-form">
                                            {this.getTextInputJSX("text", "color_code", "Color code", "" )}
                                        </div>
                                    </div>
                                    <div className="field-container">
                                        <div className="field-title">Product Fit</div>
                                        <div className="field-form">
                                            {this.getTextInputJSX("text", "fit", "Fit", "" )}
                                        </div>
                                    </div>
                                    <div className="field-container">
                                        <div className="field-title">Fabric</div>
                                        <div className="field-form">
                                            {this.getTextInputJSX("text", "fabric", "Fabric", "" )}
                                        </div>
                                    </div>
                                    {
                                        this.state.responseText &&
                                        <div className={`response-text is-${this.state.responseType}`}>
                                            <span className="response-tag">
                                                {this.state.responseText}
                                            </span>
                                        </div>
                                    }
                                    <Button variant="contained" className="submit-btn" onClick={this.handleSubmit}>
                                        Submit
                                    </Button>
                                </div>
                            </div>
                }
            </div>
        );
    }
}
