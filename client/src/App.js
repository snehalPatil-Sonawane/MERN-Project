import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from "./components/layout/Alert";
import Dashboard from "./components/Dashboard/Dashboard";
import CreateProfile from "./components/ProfileForms/CreateProfile";
import EditProfile from "./components/ProfileForms/EditProfile";
import AddExperience from "./components/ProfileForms/AddExperience";
import AddEducation from "./components/ProfileForms/AddEducation";
import Profiles from "./components/Profiles/Profiles";
import Profile from "./components/Profile/Profile";
import Posts from "./components/Posts/Post";

import PrivateRoute from "./components/routing/PrivateRoute";

//Redux
import {Provider} from "react-redux";
import store from "./store/store";
import setAuthToken from "./utils/setAuthToken";
import {loadUser} from "./store/actions/auth";
if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const App = () => { 
  useEffect(() => {
      store.dispatch(loadUser());
  }, []);   //adding square brackets leads to only one time execution at componentDidMount()
  return(
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Alert />
          <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profiles" component={Profiles} />
            <Route exact path="/profile/:id" component={Profile} />

            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/create-profile" component={CreateProfile} />
            <PrivateRoute exact path="/edit-profile" component={EditProfile} />
            <PrivateRoute exact path="/add-experience" component={AddExperience} />
            <PrivateRoute exact path="/add-education" component={AddEducation} />
            <PrivateRoute exact path="/posts" component={Posts} />
            
          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider>
)};

export default App;
