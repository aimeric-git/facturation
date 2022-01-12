import axios from "axios";

function register(user) {
    return axios
    .post("https://127.0.0.1:8001/api/users", user)
}

export default {
    register
}