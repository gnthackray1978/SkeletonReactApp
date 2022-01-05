import Fab from '@material-ui/core/Fab';
import React, { Component } from 'react';
import blue from '@material-ui/core/colors/blue';
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import {PropTypes} from 'prop-types';

import loadScript from "../../LoginShared/load-script.js";
import ImageButton from "../../LoginShared/ImageButton.jsx";
import GooglePopup from "../../LoginShared/GooglePopup.jsx";
import GoogleButton from "../../LoginShared/GoogleButton.jsx";

import {login,logout,loginRedirect,setIdsLoginScreenVisible} from "../idsActions.jsx";



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

class IDSConnect extends Component {

  constructor(props) {
    super(props);

  }

  componentDidMount() {
    const {loginRedirect} = this.props;
    console.log('IDSConnect loginRedirect');
    loginRedirect();
  }



  renderLogin() {


    const { classes,login,IdsLogInDetailsVisible,ProfileObj,imageUrl,isImageButton,
            isFabButton,profileObjName,setIdsLoginScreenVisible,Connected,logout} = this.props;

  //  console.log('imageUrl: ' + imageUrl);

    let buttons ;

    if(Connected){
        if(isImageButton)
          buttons = <ImageButton url = {imageUrl}
            onClick={()=>setIdsLoginScreenVisible(true)}/>

        if(isFabButton)
          buttons = <Fab color="primary" aria-label="Add" className={classes.fab}
            onClick={()=>setIdsLoginScreenVisible(true)}>{profileObjName}</Fab>
    }
    else{
        buttons = (
            <GoogleButton label ="Login" mode = "login" onClick ={e=>{
                if (e) e.preventDefault();
                login();
          }}/>);
    }

     return (
         <div>
             {buttons}
              <GooglePopup open={IdsLogInDetailsVisible} ProfileObj ={ProfileObj} >
                  <div>
                      <GoogleButton label ="Logout" mode = "logout" onClick ={()=>{
                          // console.log('Logout: ');

                            logout();
                            setIdsLoginScreenVisible(false);
                          }}/>
                      <GoogleButton label ="Cancel" mode = "cancel" onClick ={()=>setIdsLoginScreenVisible(false)}/>
                  </div>
              </GooglePopup>
         </div>
     )

  }

  render() {

    const { classes,login,Connected} = this.props;


    let buttons = this.renderLogin();


    return(
        <div>
            {buttons}
        </div>
    );

   }

}

IDSConnect.propTypes = {
  handleClick : PropTypes.func,
  jsSrc: PropTypes.string,
  isImageButton: PropTypes.bool,
  isFabButton: PropTypes.bool,
  imageUrl: PropTypes.string,
  profileObjName: PropTypes.string,
  ProfileObj : PropTypes.object,
  LogInDetailsVisible: PropTypes.bool,
  onClick : PropTypes.func,
  mode: PropTypes.string,
  disabled : PropTypes.bool,
  render : PropTypes.func,
  type: PropTypes.string,
  tag: PropTypes.string,
  icon: PropTypes.bool,
  Connected : PropTypes.bool
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


  if(state.ids.connected && state.ids.profileObj){
    if(state.ids.profileObj.imageUrl!= '')
      isImageButton = true;
    else{
      if(state.ids.profileObj.name!= '')
        isFabButton = true;
    }
  }

  let profileObjName ='';
  let imageUrl ='';



  if(state.ids.profileObj && state.ids.profileObj.name)
    profileObjName = state.ids.profileObj.name.charAt();

  if(state.ids.profileObj)
    imageUrl = state.ids.profileObj.imageUrl;

  return {
    profileObjName,
    imageUrl,
    isImageButton : isImageButton,
    isFabButton : isFabButton,
    GoogleConnectParam : params,
    LogInDetailsVisible : state.google.LogInDetailsVisible,
    IdsLogInDetailsVisible : state.ids.IdsLogInDetailsVisible,
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

    DisplayName : state.displayName,
    GoogleApiLoggedIn : state.google.googleApiLoggedIn,
    ProfileObj : state.ids.profileObj,
    Connected : state.ids.connected
  };
};

const mapDispatchToProps = dispatch => {

  return {

    logout :() =>{
      dispatch(logout())
    },
    login :() =>{
      dispatch(login())
    },
    setIdsLoginScreenVisible :isVisible =>{
      dispatch(setIdsLoginScreenVisible(isVisible))
    },
    loginRedirect : () =>{
      dispatch(loginRedirect())
    },
  };
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(IDSConnect));
