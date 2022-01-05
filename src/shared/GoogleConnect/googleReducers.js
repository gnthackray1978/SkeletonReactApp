
export default (state = {
  GoogleApiParams : {
    scriptId : "MQ9uI5jQzqKm4wt01EV3l5pIG0z7T6jhI",
    clientId : '183174195107-spa00qp12u40nj4kb8od7nudc149l74q.apps.googleusercontent.com',
    scopes : 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/spreadsheets',
    cookie_policy: 'single_host_origin',
    login_hint: 'login hint',
    fetch_basic_profile : true,
    uxMode: 'popup',
    accessType: 'online',

    type: 'button',
    tag: 'button',
    buttonText: 'Sign in with Google',
    logoutButtonTest : 'Logout',
    prompt: '',
    disabledStyle: {
      opacity: 0.6
    },
    icon: true,
    theme: 'light',
    jsSrc: 'https://apis.google.com/js/api.js'
  },
  GoogleToken :{
    googleId :undefined,
    tokenObj :undefined,
    tokenId :undefined,
    accessToken :undefined,
  },
  profileObj : {},
  googleApiLoggedIn : false,
  responseType : '',
  //googleRawToken :undefined,
  //googleTokenExpired : false,
  auth2loaded:false,
  profileUrl : 'https://people.googleapis.com/v1/people/me?requestMask.includeField=person.names',
  setProfileErrorMessage : '',
  loadProfileByDefault : true,
  LogInDetailsVisible : false,
}, action) => {

  switch (action.type) {

    case "SET_LOGINLOADVISIBLE":
      return {
        ...state,
        LogInDetailsVisible : action.visible,
      };

      case "GAPIAUTH_LOADED":
        return {
          ...state,
          auth2loaded : true
        };
      case "SET_PROFILE":
        return {
          ...state,
          profileObj : action.profileObj,
        };
        //SET_PROFILE_ERROR
      case "SET_PROFILE_ERROR":
        return {
          ...state,
          setProfileErrorMessage : action.errorMessage,
        };

      case "SET_GOOGLETOKEN":
        return {
          ...state,
          GoogleToken : action.GoogleToken,
        };

      case "SET_GOOGLEAPIACTIVE":
        return {
          ...state,
          googleApiLoggedIn : action.googleApiLoggedIn,
        };

      case "SET_GOOGLEBATCH_PROFILE_ISACTIVE_TOKEN":
          return {
            ...state,
            googleApiLoggedIn : action.googleApiLoggedIn,
            GoogleToken  : action.GoogleToken,
            profileObj  : action.profileObj,
          };
      default:
          return state;

    }
};
