import _ from 'lodash'
const TOKEN_KEY = 'token'

const initial_state = {
    user: "moshe",
    email: "somone@somwhere.com",
    key: "",
    fetching: false,
    err: "wooohhh",
    auth: true,
    errors: "noooo",
    logged_in: false,
    users_db: []
}
export default function userReducer(state = initial_state, action) {
    switch (action.type) {
        case "GET_USERS":
            return {
                ...state
            }
        case "GET_USERS_REJECTED":
            return {
                ...state
            }
        case "GET_USERS_FULFILLED":
            return {
                ...state,
                users_db: action.payload.data
            }
        case "SET_CURRENT_USER":
            localStorage.setItem(TOKEN_KEY, action.payload.data.id)
            return update_state_with_user_data(state, action.payload)
        case "LOGIN_FULFILLED":
            alert("you logged in as " + action.payload.data.user.username)
            localStorage.setItem(TOKEN_KEY, action.payload.data.id)
            return update_state_with_user_data(state, action.payload)
        case "CLEAR_USER":
            return {
                ...state,
                key: "",
                logged_in: false,
                user: "",
                email: ""
            }
        default:
            break;

    }
    return state

}

function update_state_with_user_data(state, payload) {
    return {
        ...state,
        key: payload.data.id,
        logged_in: !_.isEmpty(payload),
        user: _.isEmpty(payload) ? "" : payload.data.user.username,
        email: _.isEmpty(payload) ? "" : payload.data.user.email
    }
}