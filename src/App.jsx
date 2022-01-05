import React, { Component } from 'react';
import { connect } from "react-redux";

import { withStyles } from '@material-ui/core/styles';

// import {
//   Router,
//   BrowserRouter,
//   Switch,
//   Route
// } from "react-router-dom";
import { createBrowserHistory } from 'history';

import { Router,  IndexRoute, browserHistory,   BrowserRouter,   Switch,   Route } from 'react-router'

import { syncHistoryWithStore, routerReducer } from 'react-router-redux'


import Main from './Main.jsx';

import IDSRedirect from './shared/IDSConnect/Components/IDSRedirect.jsx';
import store from './store.js';


const styles = theme => ({

});

const history = syncHistoryWithStore(createBrowserHistory(), store);

class App extends Component {
  constructor(props) {
     super(props);
   }

   componentDidMount() {

   }



   render() {

    let result;

    result = <Main/>

    let test = <IDSRedirect/>;

    return (
      <div>
        <Router history={history}>
          <div>
            <Route exact path="/" component={()=>result}/>
            <Route exact path="/redirect" component={()=>test}/>
          </div>
        </Router>

      </div>


    );
  }
}

const mapStateToProps = state => {
  return {
   };
};

const mapDispatchToProps = dispatch => {return {}; };



//export default connect(mapStateToProps, mapDispatchToProps)(App);
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(App));
