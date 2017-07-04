import axios from "axios"
import _ from 'lodash'
axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
const TOKEN_KEY = 'token'


export function is_user_exists(val) {
    const query = `email=${val}&username=${val}`
    return dispatch => {
        return axios.get("auth/users?" + query)
    }
}


export function get_users(user) {
    return {
        type: "GET_USERS",
        payload:  axios.get("/auth/users")
    };
}


export function setCurrentUser(user) {
    return {
        type: "SET_CURRENT_USER",
        payload: user
    };
}

export function get_user_by_id(id) {
    if (_.isEmpty(id) || _.isUndefined(id) || _.isNull(id)) {
        return;
    }
    return dispatch => {
        return axios.get('/auth/users/' + id).then(res => {
            const token = res.data.id;
            localStorage.setItem(TOKEN_KEY, token);
            // setAuthorizationToken(token);
            dispatch(setCurrentUser(res));
        }).catch((err) => {
            if (err.response.status === 404) {
                console.log('user not found');
            } else {
                console.error("Code: " + err.response.status + " >> " + err.response.data.error);
            }
        })
    }
}

export function login(_username, _password) {
    const params = {
        username: _username,
        password: _password
    }
    return {
        type: "LOGIN",
        payload: axios.post('/auth/login', params)
    }

}


export function clear_user(){
    return {
        type : "CLEAR_USER"
    }
}
export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    return dispatch => {
        return axios.patch('/auth/logout')
            .then(dispatch(clear_user()))
    }
}


export function user_register(info) {
    return dispatch => {
        return axios.post('/auth/register', info)
            .then((res) => {
                dispatch(setCurrentUser(res))
            })
    }
}