import React, { Component } from 'react';
import { connect } from "react-redux";

import { withStyles } from '@material-ui/core/styles';
import SideDrawer from './features/SideDrawer/SideDrawer.jsx';
import TopButtons from './features/ButtonBar/TopButtons.jsx';
import {AuthProvider} from './shared/IDSConnect/AuthProvider.jsx'

const styles = () => ({

});

class Main extends Component {
  constructor(props) {
     super(props);
   }

  handleInput = (e) => {
    this.dataClick();
  }

  render() {
      return (
        <AuthProvider>
          <div >
            <TopButtons isData = {true} modeChanged = { this.handleInput }/>
            <SideDrawer onOpenClick = {click => this.dataClick = click}/>
          </div>
        </AuthProvider>
      );
    }
}

const mapStateToProps = state => {
  return {
    access_token : state.ids.access_token,
  };
};

const mapDispatchToProps = dispatch => {

  return { };
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Main));
