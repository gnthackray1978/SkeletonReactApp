import {GoogleLib} from "./GoogleLib.js";

//import {setQuizMetaData } from "./dbActions.jsx";

import {setCatSelection } from "./appStateActions.jsx";


export const setProfileObj= profileObj =>{
  return async dispatch  => {
    dispatch({
      type: "SET_PROFILE",
      profileObj :profileObj
    });
  };
}

// const authResponse = res.getAuthResponse();
//
//     this.props.setGoogleApiActive(true);
//     this.props.setGoogleToken(basicProfile.getId(),authResponse,authResponse.id_token,authResponse.access_token);
//
//     this.props.setProfileObj({
//       googleId: basicProfile.getId(),
//       imageUrl: basicProfile.getImageUrl(),
//       email: basicProfile.getEmail(),
//       name: basicProfile.getName(),
//       givenName: basicProfile.getGivenName(),
//       familyName: basicProfile.getFamilyName()
//     });


export const setGoogleToken= (googleId,tokenObj,tokenId,accessToken) =>{
  return async dispatch  => {
    dispatch({
      type: "SET_GOOGLETOKEN",
      GoogleToken : {
        googleId :googleId,
        tokenObj :tokenObj,
        tokenId :tokenId,
        accessToken :accessToken,
      }
    });
  };
}

export const setGoogleApi = gapi =>{
  return async (dispatch, getState)  => {

    const google = getState().google;

    let scriptId = google.GoogleApiParams.scriptId;

    const params = {
      client_id: google.GoogleApiParams.clientId,
      cookie_policy: google.GoogleApiParams.cookie_policy,
      login_hint: google.GoogleApiParams.login_hint,
      hosted_domain: undefined,
      fetch_basic_profile: google.GoogleApiParams.fetch_basic_profile,
      discoveryDocs : undefined,
      ux_mode: google.GoogleApiParams.uxMode,
      redirect_uri: undefined,
      scope: google.GoogleApiParams.scopes,
      access_type: google.GoogleApiParams.accessType,
      responseType: google.responseType
    };

    GoogleLib.AutoConnect(gapi, params, (res)=>{


      const basicProfile = res.getBasicProfile();
      const authResponse = res.getAuthResponse();

      const profileObj = {
            googleId: basicProfile.getId(),
            imageUrl: basicProfile.getImageUrl(),
            email: basicProfile.getEmail(),
            name: basicProfile.getName(),
            givenName: basicProfile.getGivenName(),
            familyName: basicProfile.getFamilyName()
          };

      console.log('setGoogleApi');





      GoogleLib.SearchForQuizFiles(gapi, scriptId, (arg)=>{

        console.log('SearchForQuizFiles returned');

        dispatch({
          type: "SET_GOOGLEBATCH_PROFILE_ISACTIVE_TOKEN",
          googleApiLoggedIn :true,
          GoogleToken : {
            googleId :basicProfile.getId(),
            tokenObj :authResponse,
            tokenId :authResponse.id_token,
            accessToken :authResponse.access_token,
          },
          profileObj :profileObj
        });

        dispatch({
          type: "SET_QUIZMETADATA",
          quizMetaData :arg
        });

        var selection =[];
        if(arg){
          arg.forEach((arg)=>{
            selection.push({key: arg.key , open:false});
          });
        }

        dispatch({
          type: "SET_CATSELECTION",
          catSelection :selection
        });


      });

    });

  };
}

export const setGoogleApiSignIn = () =>{
  return async (dispatch, getState)  => {

    const google = getState().google;

    if (!google.googleApiLoggedIn) {

      GoogleLib.SignIn(window.gapi, this.props.responseType, (loginResponse)=>{

      const basicProfile = loginResponse.getBasicProfile();
      const authResponse = loginResponse.getAuthResponse();

      const profileObj = {
            googleId: basicProfile.getId(),
            imageUrl: basicProfile.getImageUrl(),
            email: basicProfile.getEmail(),
            name: basicProfile.getName(),
            givenName: basicProfile.getGivenName(),
            familyName: basicProfile.getFamilyName()
          };

      console.log('setGoogleApiSignIn');

      dispatch({
        type: "SET_GOOGLEBATCH_PROFILE_ISACTIVE_TOKEN",
        googleApiLoggedIn :true,
        GoogleToken : {
          googleId :basicProfile.getId(),
          tokenObj :authResponse,
          tokenId :authResponse.id_token,
          accessToken :authResponse.access_token,
        },
        profileObj :profileObj
      });

      });

    }


  };
}

export const setGoogleApiActive = isActive =>{
  return async dispatch  => {
    console.log('setGoogleApiActive');
    dispatch({
      type: "SET_GOOGLEAPIACTIVE",
      googleApiLoggedIn :isActive
    });
  };
}

export const setGoogleSignOutState = () =>{
  return async dispatch  => {
    GoogleLib.SignOut(window.gapi, ()=>{
      dispatch({
        type: "SET_GOOGLESIGNOUT",
        googleApiLoggedIn :false
      });
    });
  };
}


export const setAuth2 = () =>{
  return async dispatch  => {
    dispatch({
      type: "LOAD_AUTH2"
    });
  };
}

export const setGoogleProfile= () =>{
  return async dispatch  => {
    dispatch({
      type: "LOAD_PROFILE"
    });
  };
}
