import AddIcon from '@material-ui/icons/Add';

import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ButtonContent from './button-content'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ControlIcon from '@material-ui/icons/OpenWith';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';

import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/FeedBack';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import Navbar from 'react-bootstrap/Navbar';
import NavigationIcon from '@material-ui/icons/Navigation';
import PersonIcon from '@material-ui/icons/Person';

import React, { Component } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';

import { withStyles } from '@material-ui/core/styles';
import {PropTypes,func} from 'prop-types';


import ImageButton from "./ImageButton.jsx";


const styles = theme => ({
  // fab: {
  //   margin: theme.spacing.unit,
  // },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  root: {
  flexGrow: 1,
  },
  grow: {
    marginLeft: 50,
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  tolowerBtn : {
    textTransform: 'none'
  },
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },

});


class GooglePopup extends React.Component {

  constructor(props) {
    super(props)
  //  console.log('GooglePopup');
  }

  handleClose = () => {
    this.props.onClose(false);
  };


  render() {

    const {className, theme, ProfileObj,classes, onClose, selectedValue, open,children } = this.props;

    if(this.props.ProfileObj == undefined){
     
      return null;
    }

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open = {open}>

        <div>


          <List>
            <ListItem>
              <ListItemText primary= "Name" secondary = {this.props.ProfileObj.name} />
            </ListItem>
            <ListItem>
              <ListItemText primary= "Email"  secondary={this.props.ProfileObj.email}/>
            </ListItem>
            <ListItem>
              <ListItemText primary= "First Name"  secondary={this.props.ProfileObj.givenName}/>
            </ListItem>
            <ListItem>
              <ListItemText primary= "Surname" secondary={this.props.ProfileObj.familyName}/>
            </ListItem>
            <ListItem>
                {children}
            </ListItem>


          </List>


        </div>
      </Dialog>
    );
  }
}

GooglePopup.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
};

export default withStyles(styles)(GooglePopup);
