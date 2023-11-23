import axios from 'axios';

const Api = axios.create({
    //set default endpoint API
    // baseURL: 'http://localhost:8080/api',
    baseURL: 'https://m-fuel-backend.000webhostapp.com/api',
    withCredentials : true,
    headers : {
        "Content-Type" : "application/x-www-form-urlencoded",
        "Accept" : "application/json"
    }
})

export default Api