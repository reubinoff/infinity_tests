import axios from "axios"
import _ from 'lodash'
axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
const TOKEN_KEY = 'token'


export function is_user_exists(val) {
    return {
        type: "IS_EXISTS",
        payload: axios.get("/api/steps?access_token=58e0f2ba61f4c81ba1242cdf")
    }
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

export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    return {
        type: "LOGOUT",
        payload: axios.patch('/auth/logout')
    }
}


export function register(_username, _password, _email) {
    return {
        type: "REGISTER_USER",
        payload: {
            username: _username,
            password: _password,
            email: _email
        }
    }
}