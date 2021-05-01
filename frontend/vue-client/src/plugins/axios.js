import axios from "axios";
axios.defaults.baseURL = process.env.VUE_APP_API_URL + process.env.VUE_APP_API_PREFIX;

//Interceptors
axios.interceptors.request.use(function (request) {
    request.headers['Content-Type'] = 'application/json';
    return request;
});

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response.status === 500) {
        //console.log(error.response)
        window.location.href = '/';
    } else {
        return Promise.reject(error);
    }
});

export default axios;
