import { combineReducers } from "redux";

import userReducer from "./userReducer"
import todoReducer from "./todoReducer"
import stepsReducer from "./stepsReducer"
import coresReducer from "./coresReducer"
import scenariosReducer from "./scenariosReducer"
import testsReducer from "./testsReducer"

export default combineReducers({
    user: userReducer,
    toso: todoReducer,
    steps:stepsReducer,
    cores: coresReducer,
    scenarios: scenariosReducer,
    tests: testsReducer
})