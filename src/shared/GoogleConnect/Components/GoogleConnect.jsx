import Fab from '@material-ui/core/Fab';
import React, { Component } from 'react';
import blue from '@material-ui/core/colors/blue';

import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import {PropTypes} from 'prop-types';

import {setGoogleApi, setGoogleSignOutState, setLoginScreenVisible} from "../googleActions.jsx";

import loadScript from "../../LoginShared/load-script.js";
import ImageButton from "../../LoginShared/ImageButton.jsx";
import GooglePopup from "../../LoginShared/GooglePopup.jsx";
import GoogleButton from "../../LoginShared/GoogleButton.jsx";


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

class GoogleConnect extends Component {

  constructor(props) {
    super(props);

  }

  componentDidMount() {
    if (window.gapi) return;

    loadScript(document, 'script', 'google-login', this.props.jsSrc, () => this.props.setGoogleApi(window.gapi));

  }



  renderLogoutOptions(){

    const {setGoogleSignOutState, handleClick} = this.props;

    return(
        <div>
            <GoogleButton label ="Logout" mode = "logout" onClick ={()=>{
                  setGoogleSignOutState();
                  handleClick();
          }}/>
        <GoogleButton label ="Cancel" mode = "cancel" onClick ={()=>handleClick()}/>
        </div>);
  }

  renderLogin() {


    const { classes, isImageButton, isFabButton, imageUrl,profileObjName,
      ProfileObj, LogInDetailsVisible, setLoginScreenVisible, setGoogleApiSignIn} = this.props;


    let buttons = (
        <GoogleButton label ="Login" mode = "login" onClick ={e=>{
            if (e) e.preventDefault();
            setGoogleApiSignIn();
      }}/>);

//    console.log(imageUrl);

    if(isImageButton)
      buttons = <ImageButton url = {imageUrl}  onClick={()=>setLoginScreenVisible(true)}/>

    if(isFabButton)
      buttons = <Fab color="primary" aria-label="Add" className={classes.fab}  onClick={()=>setLoginScreenVisible(true)}>{profileObjName}</Fab>

     return (
         <div>
             {buttons}
             <GooglePopup open={LogInDetailsVisible} ProfileObj ={ProfileObj} >
               <GoogleConnect mode = 'logout' handleClick = {()=>setLoginScreenVisible(false)}/>
             </GooglePopup>
         </div>
     )

  }

  render() {

    let buttons = this.renderLogin();

    if(this.props.mode == 'logout'){
      buttons = this.renderLogoutOptions();
    }

    return(
        <div>
            {buttons}
        </div>
    );

   }

}


GoogleConnect.propTypes = {
//  classes: PropTypes.object.isRequired,
  setGoogleApi : PropTypes.func,
  setGoogleSignOutState : PropTypes.func,
  handleClick : PropTypes.func,
  jsSrc: PropTypes.string,
  isImageButton: PropTypes.bool,
  isFabButton: PropTypes.bool,
  imageUrl: PropTypes.string,
  profileObjName: PropTypes.string,
  ProfileObj : PropTypes.object,
  LogInDetailsVisible: PropTypes.bool,
  setLoginScreenVisible : PropTypes.func,
  setGoogleApiSignIn : PropTypes.func,
  onClick : PropTypes.func,
  mode: PropTypes.string,
  disabled : PropTypes.bool,
  render : PropTypes.func,
  type: PropTypes.string,
  tag: PropTypes.string,
  icon: PropTypes.bool,
};

const mapStateToProps = state => {
//  console.log('mapStateToProps');

  const params = {
    client_id: state.google.GoogleApiParams.clientId,
    cookie_policy: state.google.GoogleApiParams.cookie_policy,
    login_hint: state.google.GoogleApiParams.login_hint,
    hosted_domain: undefined,
    fetch_basic_profile: state.google.GoogleApiParams.fetch_basic_profile,
    discoveryDocs : undefined,
    ux_mode: state.google.GoogleApiParams.uxMode,
    redirect_uri: undefined,
    scope: state.google.GoogleApiParams.scopes,
    access_type: state.google.GoogleApiParams.accessType,
    responseType: state.google.responseType
  };

  let isImageButton = false;
  let isFabButton =false;


  if(state.google.googleApiLoggedIn && state.google.profileObj){
    if(state.google.profileObj.imageUrl!= '')
      isImageButton = true;
    else{
      if(state.google.profileObj.name!= '')
        isFabButton = true;
    }
  }

  let profileObjName ='';
  let imageUrl ='';



  if(state.google.profileObj && state.google.profileObj.name)
    profileObjName = state.google.profileObj.name.charAt();

  if(state.google.profileObj)
    imageUrl = state.google.profileObj.imageUrl;

  return {
    profileObjName,
    imageUrl,
    isImageButton : isImageButton,
    isFabButton : isFabButton,
    GoogleConnectParam : params,

    LogInDetailsVisible : state.google.LogInDetailsVisible,
    ClientId : state.google.GoogleApiParams.clientId,
    ScriptId : state.google.GoogleApiParams.scriptId,
    Scope : state.google.GoogleApiParams.scopes,
    cookiePolicy: state.google.GoogleApiParams.cookie_policy,
    LoginHint: state.google.GoogleApiParams.login_hint,
    FetchBasicProfile : state.google.GoogleApiParams.fetch_basic_profile,
    UxMode: state.google.GoogleApiParams.uxMode,
    AccessType: state.google.GoogleApiParams.accessType,
    type: state.google.GoogleApiParams.type,
    tag: state.google.GoogleApiParams.tag,
    buttonText: state.google.GoogleApiParams.buttonText,
    prompt: state.google.GoogleApiParams.prompt,
    disabledStyle: state.google.GoogleApiParams.disabledStyle,
    icon: state.google.GoogleApiParams.icon,
    theme: state.google.GoogleApiParams.theme,
    jsSrc: state.google.GoogleApiParams.jsSrc,

    QuizMetaData : state.db.quizMetaData,
    DisplayName : state.displayName,
    GoogleApiLoggedIn : state.google.googleApiLoggedIn,
    ProfileObj : state.google.profileObj
  };
};

const mapDispatchToProps = dispatch => {

  return {
    setGoogleApi : loginResponse =>{
      dispatch(setGoogleApi(loginResponse))
    },

    setGoogleSignOutState :() =>{
      dispatch(setGoogleSignOutState())
    },

    setQuizMetaData :data =>{
      dispatch(setQuizMetaData(data))
    },

    setLoginScreenVisible :isVisible =>{
      dispatch(setLoginScreenVisible(isVisible))
    }

  };
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(GoogleConnect));
