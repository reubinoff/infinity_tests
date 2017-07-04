import React from "react"
import ReactDOM from "react-dom"
import {Provider} from "react-redux"
import {Route} from 'react-router-dom';
import {ConnectedRouter} from 'react-router-redux'
import store from "./js/store"
import createHistory from 'history/createBrowserHistory'
const history = createHistory()
import { get_user_by_id } from './js/actions/userActions'
import Layout from './js/containers/Layout';
import Register from './js/components/signup/signup_page';
import Login from './js/components/login/login_page';
import AdminPages from './js/components/admin'
import Greeting from './js/components/Greeting';
import _ from 'lodash'


const root = document.getElementById('root')


 console.log('debug token: ' + _.isUndefined(localStorage.token));
if (localStorage.token && !_.isUndefined(localStorage.token)){
        console.log('debug token: ' + localStorage.token);
       store.dispatch(get_user_by_id(localStorage.token))
}
let admins = []
for (var page in AdminPages) {
        admins.push( <Route key={page} path={`/data/${page}`} component={AdminPages[page]}/> )
}
ReactDOM.render(
        <Provider store={store}>
                <ConnectedRouter history={history} component={Layout}>
                        <Layout>
                                <Route exact path="/" component={Greeting}/>
                                <Route path="/login" component={Login}/>
                                <Route path="/register" component={Register}/>    
                                {admins}
                        </Layout>       
                </ConnectedRouter>
        </Provider>
, root);
