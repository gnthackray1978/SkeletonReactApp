import React, { Component } from 'react'
import { connect } from "react-redux";
import { loginRedirect, setPath} from "../idsActions.jsx";
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({

});

class IDSRedirect extends Component {
  constructor(props) {
     super(props);
   }

   componentDidMount() {
     console.log('IDSRedirect loginRedirect');
     this.props.loginRedirect();
     //this.props.setPath();


   }

   render() { return (<div>redirect</div> ); }

}


const mapStateToProps = state => {
  return { };
};

const mapDispatchToProps = dispatch => {

  return {
    loginRedirect :() =>{
      dispatch(loginRedirect())
    },
    setPath : () =>{
      dispatch(setPath())
    }

  };
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(IDSRedirect));
