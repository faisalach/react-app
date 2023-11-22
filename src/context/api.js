import axios from 'axios';

const Api = axios.create({
    //set default endpoint API
    baseURL: 'http://localhost:8080/api',
    // baseURL: 'http://sistem-manajemen-kendaraan.rf.gd/api',
    withCredentials : true
})

export default Api