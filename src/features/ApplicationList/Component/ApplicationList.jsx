import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SelectionToolBar from "./SelectionToolBar.jsx";
import {fetchApplicationList} from "../alActions.jsx";
import {useAuthProvider} from "../../../shared/IDSConnect/AuthProvider.jsx";

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

function ApplicationList(props) {
  console.log('ApplicationList');
  const { fetchApplicationListInternal} = props;

//  let tp = useAuthProvider();

  fetchApplicationListInternal();

//console.log(tp);

  const { classes, closeDrawer} = props;

  return (
      <div className = "inner">
         <AppBar position="static">
           <Toolbar>
               <IconButton className={classes.menuButton} color="inherit"
                 aria-label="Menu" onClick={closeDrawer} >
                 <MenuIcon/>
               </IconButton>

               <Button color="inherit" className ={classes.tolowerBtn}>
                 <Typography variant="h6" color="inherit" >
                   Select Item
                 </Typography>
               </Button>

           </Toolbar>
         </AppBar>
         <List>

         </List>
         <SelectionToolBar/>
      </div>
  );

}


ApplicationList.propTypes = {
  classes: PropTypes.object.isRequired,
  toggleDrawer : PropTypes.func
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchApplicationListInternal: () => dispatch(fetchApplicationList()),
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ApplicationList));
