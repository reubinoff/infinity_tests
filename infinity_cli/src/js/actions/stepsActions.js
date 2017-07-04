import axios from "axios"
import _ from 'lodash'


axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';


export function get_steps(user) {
    return {
        type: "GET_STEPS",
        payload: axios.get("/api/steps?access_token=" + user.key)
    }
}



