import React, { Component, Fragment } from 'react';
import common from "../../api/common";
import { getSession } from "../../utils/AuthUtils";
import "./style.scss";
import axios from "axios";
// import find from "lodash.find";
import { Button, Select, MenuItem, TextField, FormControl, InputLabel } from '@material-ui/core';
import { titleCase } from "../../utils/utilFunctions";

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

export default class ProductUpload extends Component {
    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
        this.state = {
            isLoading: false,
            fileInputKey: moment.now(),
            files: [],
            payload: {
                category: "",
                sub_category: "",
                price: "",
                discount: "",
                title: "",
                description: "",
                color: "",
                color_code: "",
                size: "",
                fabric: "",
                stock: "",
            },
            responseText: "",
            responseType: "error",
            activeDropdown: false,
            errors: {
                file_invalid: null,
            },
        };
    }

    clearFieldStates = () => {
        this.setState({
            fileInputKey: moment.now(),
            files: [],
            payload: {
                category: "",
                sub_category: "",
                price: "",
                discount: "",
                title: "",
                description: "",
                color: "",
                color_code: "",
                size: "",
                fabric: "",
                stock: "",
            }
        });
    }

    clearErrorState = () => {
        this.setState({
            responseText: "",
            errors: {
                file_invalid: null,
            }
        });
    };

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({ isLoading: true });
        this.clearErrorState();

        let form_data = new FormData();
        Array.from(this.state.files).forEach((file, idx)=>{
            form_data.append('files[]', this.state.files[idx])
        });

        let payloadState = { ...this.state.payload };
        form_data.append('data', JSON.stringify(payloadState));

        let session = await getSession();
        if (!session) {
            return;
        }
        let response;
        try {
            response = await common.post(
                'add_product',
                form_data,
                {
                    headers: { "Content-Type": "text/plain", "Authorization": session.accessToken.jwtToken }
                }
            );
            console.log("response", response);
            if (response && response.status === 200 && response.data.status) {
                this.clearFieldStates();
            } else {
                this.setState({
                    responseType: "error",
                    responseText: response.data.message
                }); 
            }
            this.setState({ isLoading: false });
        } catch (err) {
            this.setState({ isLoading: false });
        }
    };

    componentDidMount() {
    }

    // handleDropdownOpen
    // createDropdownInput = (name) => {
    //     return (
    //         <div>
    //             <Button onClick={() => { this.handleDropdownOpen(name) }}>
    //                 Select {titleCase(name)}
    //             </Button>
    //             <FormControl >
    //                 <InputLabel id={`dropdown-${name}`}>Age</InputLabel>
    //                 <Select
    //                     labelId={`dropdown-${name}`}
    //                     open={this.state.activeDropdown === name}
    //                     // onClose={handleClose}
    //                     // onOpen={handleOpen}
    //                     value={this.state[name]}
    //                     onChange={this.handleDropdownChange}
    //                 >
    //                     {
    //                         this
    //                     }
    //                     <MenuItem value={10}>Ten</MenuItem>
    //                     <MenuItem value={20}>Twenty</MenuItem>
    //                     <MenuItem value={30}>Thirty</MenuItem>
    //                 </Select>
    //             </FormControl>
    //         </div>
    //     )
    // }

    getTextInputJSX = (type, name, title, classname) => {
        return (
            <TextField
                className={classname}
                name={name}
                type={type}
                variant="outlined"
                label={title}
                onChange={this.onInputChange}
                value={this.state.payload[name]}
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

    handleChooseBtnClick = () =>{
        this.fileInput.current.click();
    }

    onFilesSelect = (e) => {
        let files = e.target.files;
        console.log("file chosen",files);
        this.setState({
            files
        });
    }

    render() {
        return (
            <div className="product-form-container">
                <div className="product-form-card">
                    <div className="card-header">
                        <div className="card-title">
                            Add products
                        </div>
                    </div>
                    <div className="card-body">
                        <input 
                            type="file" 
                            key={this.state.fileInputKey}
                            ref={this.fileInput} 
                            accept="image/*" 
                            multiple 
                            onChange={this.onFilesSelect}
                            hidden
                        />
                        <Button variant="contained" className="choose-file-btn" onClick={()=>{this.handleChooseBtnClick()}}>
                            Choose Files
                        </Button>
                        {
                            !!this.state.files.length && 
                            <div className="files-container">
                                {
                                    Array.from(this.state.files).map((fileObj, fileIdx)=>{
                                        return (
                                            <div className="file-item">
                                                <div className="file-index">
                                                    {fileIdx + 1}
                                                </div>
                                                <div className="file-name">
                                                    {fileObj.name}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                        <div className="field">
                            {this.getTextInputJSX("text", "category", "Category", "field-input")}
                        </div>
                        <div className="field">
                            {this.getTextInputJSX("text", "sub_category", "Sub-Category", "field-input")}
                        </div>
                        <div className="field-row">
                            {this.getTextInputJSX("text", "title", "Title", "field-input-first")}
                            {this.getTextInputJSX("text", "description", "Description", "field-input")}
                        </div>
                        <div className="field-row">
                            {this.getTextInputJSX("number", "price", "Price", "field-input-first")}
                            {this.getTextInputJSX("number", "discount", "Discount", "field-input")}
                        </div>
                        <div className="field-row">
                            {this.getTextInputJSX("text", "color", "Color Name", "field-input-first")}
                            {this.getTextInputJSX("text", "color_code", "Hex Code", "field-input")}
                        </div>
                        <div className="field">
                            {this.getTextInputJSX("text", "size", "Size", "field-input")}
                        </div>
                        <div className="field">
                            {this.getTextInputJSX("text", "fabric", "Fabric", "field-input")}
                        </div>
                        <div className="field">
                            {this.getTextInputJSX("number", "stock", "Stock", "field-input")}
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
            </div>
        );
    }
}
