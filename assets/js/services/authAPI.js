import axios from "axios";
import jwtDecode from "jwt-decode";


function authenticate(credentials) {
    return axios
        .post("https://127.0.0.1:8001/api/login_check", credentials)
        .then((response) => {
            let token = response.data.token;

            //stocker le token dans un localStorage
            window.localStorage.setItem("authToken", token);

            //Prévient axios qu'on a maintenant un header par défaut
            setAxiosToken(token);
        })

}

function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"]
}

function setAxiosToken(token) {
    return axios.defaults.headers["Authorization"] = "Bearer " + token;
}

function setup() {
    const token = window.localStorage.getItem("authToken");

    if(token) 
    {
        const jwtData = jwtDecode(token);
        if(jwtData.exp * 1000 > new Date().getTime())
        {
            setAxiosToken(token);
        }
    }
}

function isAuthenticated() {
    const token = window.localStorage.getItem("authToken");

    if(token) 
    {
        const jwtData = jwtDecode(token);
        if(jwtData.exp * 1000 > new Date().getTime())
        {
            return true;
        }
        return false;
    }
    return false;
}

export default {
    authenticate: authenticate,
    logout: logout,
    setup: setup,
    isAuthenticated: isAuthenticated
}