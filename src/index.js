import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import Auth from '@aws-amplify/auth';
import { theme } from "./theme";
import * as serviceWorker from './serviceWorker';

if (module.hot) {
    module.hot.accept();
}

Auth.configure({
    mandatorySignId: true,
    region: 'ap-south-1',
    userPoolId: 'ap-south-1_iQH2KYatG',
    userPoolWebClientId: 'it76hptiugtkcb4oqbq1mtr3j',
});

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();