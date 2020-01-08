import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import Auth from '@aws-amplify/auth';
import { theme } from "./theme";

if (module.hot) {
    module.hot.accept();
}
console.log("REACT_APP_USER_POOL_ID",process.env.REACT_APP_USER_POOL_ID)

Auth.configure({
    mandatorySignId: true,
    region: 'ap-south-1',
    userPoolId: 'ap-south-1_iQH2KYatG',
    userPoolWebClientId: 'it76hptiugtkcb4oqbq1mtr3j',
});

ReactDOM.render(<App />, document.getElementById('root'));