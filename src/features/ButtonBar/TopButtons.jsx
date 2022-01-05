import React, { Component } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import {PropTypes} from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import { connect } from "react-redux";
import IDSConnect   from "../../shared/IDSConnect/Components/IDSConnect.jsx";
import AppsIcon from '@material-ui/icons/Apps';

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  root: {
  flexGrow: 1,
  },
  grow: {
    marginLeft: 5,
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,

  },
  tolowerBtn : {
    textTransform: 'none'
  }
});

class TopButtons extends Component {

  constructor(props) {
     super(props);
     //console.log('TopButtons');
   }
//     <GoogleConnect mode = "login"/>


  render() {

    const { classes,modeChanged} = this.props;

    let createNewTest = ()=>{

    };

    return (
         <Toolbar>
             <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={()=>{ modeChanged('data'); }}>
                 <MenuIcon />
             </IconButton>
             <Button color="inherit"  onClick={()=>createNewTest()}>
                 <Typography variant="h6" color="inherit"  className ={classes.tolowerBtn}>
                  Start
                 </Typography>
             </Button>
             <Button color="inherit"  className={classes.grow}>
                 <Typography variant="h6" color="inherit"  className ={classes.tolowerBtn}>
                     PlaceHolder
                 </Typography>
             </Button>
             <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                 <AppsIcon />
             </IconButton>
             <IDSConnect mode = "login"/>

         </Toolbar>
     )
   }

}

TopButtons.propTypes = {
  classes: PropTypes.object.isRequired,
  modeChanged : PropTypes.func
};

TopButtons.defaultProps  = {
  isData: true
};


const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
  };
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(TopButtons));
