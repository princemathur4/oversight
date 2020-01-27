import axios from 'axios';

export default axios.create({
    baseURL: 'https://labroz.herokuapp.com/api/',
    timeout: 300000,
});
