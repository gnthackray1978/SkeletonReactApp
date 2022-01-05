import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import PlaceHolder from "./PlaceHolder.jsx";
import './ApplicationList.css';
import { connect } from "react-redux";


const styles = theme => ({

  root: {
    paddingRight: theme.spacing.unit,
    minHeight : window.innerHeight -10
  },

  list: {
    width: 420,
  },

  fullList: {
    width: 'auto',
  },
  mygrid:{
    margin:'0px'
  },
  input:{
    width: '100px'
  },
  label: {

    textAlign: 'center',

  },
  toolBar: {
    paddingLeft :'12px',
    minHeight: '0px'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  appBar: {
     top: 'auto',
     bottom: 0,
   },
});


class SelectionToolBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answerInput : ''
    };
  }

  render() {

    const { classes} = this.props;


    const addClick = (param => {
    });

    let bottomToolbar =[];


    bottomToolbar.push(<PlaceHolder  key="1" onAdd = {addClick} />);



    return(
      <AppBar position="fixed" color="default" className={classes.appBar}>
        <Toolbar>
        {bottomToolbar}
        </Toolbar>
      </AppBar>);
  }

}

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {

  return {

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SelectionToolBar));
