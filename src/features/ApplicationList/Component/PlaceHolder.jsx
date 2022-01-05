import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import { connect } from "react-redux";

import './ApplicationList.css';

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

class PlaceHolder extends Component {

  constructor(props) {
    super(props);

  }

  render() {

    const {classes} = this.props;

    const startClick = ()=>{
      console.log('place holder clicked');
    };

    startClick.bind(this);

    let layout;


    layout = <Button color="inherit" onClick = {startClick}>PlaceHolder</Button>


    return (
        <div>{layout}</div>
    );

  }

}

PlaceHolder.propTypes = {
  classes: PropTypes.object
};


const mapStateToProps = state => {
  return { };
};

const mapDispatchToProps = dispatch => {
  return { };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PlaceHolder));
