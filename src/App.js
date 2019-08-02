import React from 'react';
import {BrowserRouter as Router,Route,Redirect,Switch} from 'react-router-dom';
import './App.css';
import jwt from 'jsonwebtoken'
import Signin from './Components/members/Signin'
import Signup from './Components/members/Signup'
import Google from './Components/members/Google'
import Verify from './Components/members/EmailVerification'
import ResetPassword from './Components/members/ResetPassword'
import profile from './Components/members/profile'
import index from './Components/index'
import Signout from './Components/members/Signout'
import NavBar from './Components/utils/NavBar'
import ViewQuestion from './Components/questions/View'
import tagQList from './Components/questions/tagList'
import TagAskList from './Components/questions/TagAskList'
import search from './Components/questions/search'
import NotFound from './Components/errors/NotFound'
import InternalError from './Components/errors/InternalError'
function isLoggedUser(){
    let token = localStorage.getItem('user');
    return token!==null;
}

function LogoutPage({ component: Component, ...rest }) {
    return (
        <Route {...rest} render={props => (
            isLoggedUser()
                ? <Component {...props} />
                :  <Redirect to="/"/>
        )} />
    );
}

function GuestRoot({ component: Component, ...rest }) {
    return (
        <Route {...rest} render={props => (
            isLoggedUser()
                ? <Redirect to={{ pathname: '/signout', state: { from: props.location } }} />
                : <Component {...props} />
        )} />
    );
}
function verify() {
    jwt.verify(localStorage.getItem('user'), process.env.REACT_APP_KEY, function (err, decoded) {
        if (err){
            localStorage.clear();
        }
    })
}

const DefaultContainer = () => (
    <div>
        <NavBar/>
        <Route exact path="/" component={index}/>
        {/*<Route exact path="/search" component={search}/>*/}
        <Route exact path="/search/:keyword" component={search}/>
        <Route exact path="/tag/:tagName" component={tagQList}/>
        <Route exact path="/tags/:tagName" component={TagAskList}/>
        <Route exact path="/questions/:question" component={ViewQuestion}/>
        <Route exact path="/user/:username" component={profile}/>
        <Route exact path="/errors/404" component={NotFound}/>
        <Route exact path="/errors/500" component={InternalError}/>
        <LogoutPage exact path="/signout" component={Signout}/>
    </div>
);
function App() {

  return (
    <div>
      <Router>
          {verify()}
          <Switch>
              <GuestRoot exact path="/signin" component={Signin}/>
              <GuestRoot exact path="/signup" component={Signup}/>
              <GuestRoot exact path="/members/verify" component={Verify}/>
              <GuestRoot exact path="/resetpassword/:hash/:shortID" component={ResetPassword}/>
              <GuestRoot exact path="/0auth/continue/:user" component={Google}/>
              <Route component={DefaultContainer}/>
          </Switch>
      </Router>
    </div>
  );
}

export default App;
