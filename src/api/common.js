import axios from 'axios';

export default axios.create({
    baseURL: 'http://13.126.25.56/api/',
    timeout: 300000,
});
