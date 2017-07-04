import _ from 'lodash'

const initial_state = {
    steps: []
}
export default function stepsReducer(state = initial_state, action) {
    // if(action.payload.response.data === 'Unauthorized'){
    //     alert("sd")
    // }

    if(action.type.includes("REJECTED")){
       if(action.payload.response.data === "Unauthorized"){
           console.warn('Unauthorized request. Please login');
           alert('Unauthorized request. Please login')
           return {
                ...state
            }
       }
    }
    switch (action.type) {
        case "GET_STEPS_PENDING":
            return {
                ...state
            }
        case "GET_STEPS_FULFILLED":
            return {
                ...state,
                steps: action.payload.data
            }
        default:
            break;

    }
    return {
        ...state
    }

}