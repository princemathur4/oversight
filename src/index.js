import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import Auth from '@aws-amplify/auth';
import { theme } from "./theme";

Auth.configure({
    mandatorySignId: true,
    region: 'ap-south-1',
    userPoolId: 'ap-south-1_BjqcH8ikX',
    userPoolWebClientId: '3efn10okeae2re6jojakrb84m8',
});

ReactDOM.render( <App/>, document.getElementById('root') );