
export default (state = {

  profileObj : {},

  IdServParams :{
    authority: "https://msgauth01.azurewebsites.net",
    client_id: "js",
    redirect_uri: "http://localhost:1234",
    response_type: "code",
    scope:"openid profile api1",
    post_logout_redirect_uri: "http://localhost:1234",
    loadUserInfo: true,
    IsExternalLoginOnly :true,
    silent_redirect_uri: 'http://localhost:1234/redirect',
    automaticSilentRenew: true,
    google_token_uri :'https://msgauth01.azurewebsites.net/token'

  },

  // IdServParams :{
  //   authority: "http://localhost:5000",
  //   client_id: "js",
  //   redirect_uri: "http://localhost:1234",
  //   response_type: "code",
  //   scope:"openid profile api1",
  //   post_logout_redirect_uri: "http://localhost:1234",
  //   loadUserInfo: true,
  //   IsExternalLoginOnly :true,
  //   silent_redirect_uri: 'http://localhost:1234/redirect',
  //   automaticSilentRenew: true,
  //   google_token_uri :'http://localhost:5000/token'
  //
  // },
  connected :false,
  infoloaded :false,

  googleToken :undefined,
  googleRawToken :undefined,
  googleTokenExpired : false,
  googleFetchOnGoing : false,
  expiring :false,
  expired :false,
  silentRenewError : '',
  access_token : '',
  expiresAt : undefined,
  expiresAtDesc : undefined,
  expirationHandled :false,
  IdsLogInDetailsVisible :false

}, action) => {


  //
  //OnUserUnloaded
  //OnUserLoaded

  switch (action.type) {

    case "OnUserLoaded":
      return {
        ...state
      };



    case "SET_IDSLOGINLOADVISIBLE":
      console.log('reducer SET_IDSLOGINLOADVISIBLE');
      return {
        ...state,
        IdsLogInDetailsVisible : action.payload,
      };

    case "OnSilentRenewError":
      console.log('reducer OnUserSignedOut');
      return {
        ...state,
        silentRenewError : action.error
      };

   case "OnUserLoaded":
     console.log('reducer OnUserLoaded');
     return {
       ...state,
       userSignedIn : true
     };

    case "OnUserSignedOut":
      console.log('reducer OnUserSignedOut');
      return {
        ...state,
        userSignedIn : false
      };

    case "AccessTokenExpired":
      console.log('reducer AccessTokenExpired');
      return {
        ...state,
        expired : true
      };

    case "AccessTokenExpiring":
    console.log('reducer AccessTokenExpiring');
      return {
        ...state,
        expiring : true
      };


//silentRenewError
    // case "SET_ACCESS_TOKEN_EXPIRED":
    //   return {
    //     ...state,
    //     connected :false,
    //     expiring :false,
    //     expired :true
    //   };

      case "SET_USERINFO_SUCCESS":
        console.log('reducer SET_USERINFO_SUCCESS');
        let expires = new Date('1970-01-01T00:00:00Z');

        expires.setSeconds( expires.getSeconds() + action.expires_at);

        return {
          ...state,
          infoloaded : true,
          connected : true,
          profileObj : action.profileObj,
          access_token : action.access_token,

          expiring :false,
          expired :false,
          expirationHandled :false,
          expiresAt :action.expires_at,
          expiresAtDesc : expires.toString(),

          googleRawToken : action.token,
          googleTokenExpired : false,
          googleFetchOnGoing : false
        };

      case "SET_USER_LOGOUT":
      case "AUTH_FAILED":
        console.log('reducer SET_USER_LOGOUT AUTH_FAILED');
        return {
          ...state,
          infoloaded : false,
          connected : false,
          profileObj : undefined,
          access_token : undefined,
          googleRawToken : undefined,
          googleFetchOnGoing : false
        };

      case "RETRIEVE_GOOGLE_TOKEN":
          return {
            ...state,
             googleFetchOnGoing :true
          };

      case "FINISHED_GOOGLE_FETCH":
          return {
            ...state,
             googleFetchOnGoing :false
          };

      case "expirationHandled":
          return {
            ...state,
             expirationHandled :true
          };


      default:
          return state;

    }
};
