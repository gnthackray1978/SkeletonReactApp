
import { UserManager, WebStorageStateStore, Log } from "oidc-client";
import {evtAccessTokenExpired, evtAccessTokenExpiring,evtOnUserSignedOut,evtOnUserUnloaded,evtOnSilentRenewError,evtOnUserLoaded} from './idsActions.jsx';
import { push } from 'react-router-redux';

var retryCount =0;

//Retrieval States
const RS = {
    TOKENVALID: 'existing token valid',
    SIGNINFAILED : 'signinRedirectCallback errored ',
    FETCHEDEXPIRED: 'fetched expired token',
    FETCHEDVALID: 'fetched valid token',
    USERLOOKUPFAILED: 'user lookup failed',
    USEREXPIRED : 'user expired',
    USERUNDEFINED : 'user undefined',
    USERVALID : 'valid user',
    APIERROR : 'api error',
    TOOMANYATTEMPTS : 'too many attempts'
};

const makeLoginDetailAction = (user, googleToken)=>{

  let actionObj = {
            type: "SET_USERINFO_SUCCESS",
            profileObj :{
              name : user.profile.name,
              email :user.profile.email,
              givenName : user.profile.given_name,
              familyName : user.profile.family_name,
              userName : 'not retrieved',
              imageUrl : user.profile.picture
            },
            access_token : user.access_token,
            expires_at : user.expires_at,
            token : googleToken
          };

  return actionObj;
};


const formatDate = (current_datetime,isUtc)=>{
    if(current_datetime instanceof Date && !isNaN(current_datetime.valueOf())){
      let formatted_date =
         (current_datetime.getMonth() + 1) +
           "-" + current_datetime.getDate() + " "
           + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
        if(isUtc)
          return formatted_date + 'UTC';

        return formatted_date;
    }
    return "Invalid Date";
  };

const getCurrentTime = function(utc){
  let addMinutes = function (date, minutes) {
    return new Date(date.getTime() + minutes*60000);
  };

  var d = new Date(Date.now());

  if(utc){
    let now = d.getTimezoneOffset();
    d = addMinutes(d,now);
  }
  return d;
};

const userExpired = (user)=>{
  let jsUserExpiresAt = new Date(user.expires_at *1000);

  let now = getCurrentTime();

  if(jsUserExpiresAt > now){
    console.log('IDS user token NOT expired - expires at: '   +  user.expires_at + ' ' + formatDate(jsUserExpiresAt)  + ' now ' +  formatDate(now));
    return false;
  }

  console.log('IDS user token expired - expired at: ' +  user.expires_at + ' ' + formatDate(jsUserExpiresAt) + ' now ' + formatDate(now));
  return true;
};

const validateUser = (user)=>{
  if(!user || userExpired(user))
  {
    if(!user)
      return { type: RS.USERUNDEFINED, message : 'Could not find logged in user. getUser returned undefined' };
    else{
      return { type: RS.USEREXPIRED, message : 'No valid user. User expired' };
    }
  }
  else{

    return { type: RS.USERVALID, message : 'IDS user appears logged in OK. Attempting to get google token.' };
  }
};

const manageGoogleTokenRetrieval = async (storeAPI, user) => {


  const retrieveGoogleToken =  (storeAPI,google_token_uri,access_token,googleToken)=>{

    const googleTokenExpired = (token)=>{

        if(!token){
          throw "invalid token received";
        }

        let expirationDate = new Date(token.expires);

        let now = getCurrentTime(true);


        if(expirationDate > now){
          console.log('google token NOT expired - date: ' + formatDate(expirationDate,true) + ' now ' + formatDate(now,true));
          return false;
        }

        console.log('google token expired - date: ' + formatDate(expirationDate,true) + ' now ' + formatDate(now,true));
        return true;
      };

    const getTokenFromAPI = (google_token_uri,access_token)=>{
        //  var url = 'https://msgauth01.azurewebsites.net/token/test';
        return new Promise((resolve, reject) => {
          console.log('--getTokenFromAPI--');
          var xhr = new XMLHttpRequest();
          xhr.open("GET", google_token_uri);
          xhr.onload = () => {
              console.log('--Fetched google token');
              if (xhr.status >= 200 && xhr.status < 300)
                  resolve(JSON.parse(xhr.response));
               else
                  reject(xhr.statusText);
          }
          xhr.setRequestHeader("Authorization", "Bearer " + access_token);
          xhr.send();
        });

      };

    console.log('**Retrieve Google Token**');


    return new Promise(async (res, rej) => {
        // we already have a valid token and it hasn't expired.
        // so dont set anything
        if(googleToken && !googleTokenExpired(googleToken)){
          console.log('**Existing Token Valid No call to API made');
          res({type: RS.TOKENVALID,  googleToken :googleToken});
        }

        // we assume that user is valid and has not expired
        let tokenObj = await getTokenFromAPI(google_token_uri, access_token).catch((e)=>{
          console.log(e);
          res({type: RS.APIERROR,  message :e});
        });

        if(tokenObj){
          if(googleTokenExpired(tokenObj)){
            res({type : RS.FETCHEDEXPIRED, googleToken :undefined});
          }
          else{
            res({type : RS.FETCHEDVALID, googleToken :tokenObj});
          }
        };


      });

  };



  let mgr;

  ensureValidUserManage(mgr,storeAPI);

  let validationResult = validateUser(user);//

  validationResult.user = user;

  return new Promise(async (resolve, reject) => {

    if(validationResult.type != RS.USERVALID){
      console.log('sign in silent user validation failed ' + validationResult.message);
      resolve(validationResult);
      return;
    }

    const google_token_uri = storeAPI.getState().ids.IdServParams.google_token_uri;
    const googleToken = storeAPI.getState().google.googleRawToken;

    let tokenResult = await retrieveGoogleToken(storeAPI,google_token_uri,user.access_token,googleToken);

    resolve(tokenResult);
  });
};

const fetchUser = (mgr)=>{

  let countOfLoginAttempts = localStorage.getItem("loginAttemptCounter");

  return new Promise((resolve, reject) => {
    mgr.getUser().then((user)=>{
      let result = validateUser(user);
      result.message = result.message + ' on attempt ' +countOfLoginAttempts;
      result.user = user;
      resolve(result);
    });
  }).catch((e)=>{
    resolve({ status: 'failure', message : e });
  });

  //  dispatch({
  //    type: "USER_REFRESHED"
  //  });


};

const ensureValidUserManage= (userManager,storeAPI, params)=>{




  // event callback when the user has been loaded (on silent renew or redirect)

  //onUserLoaded evtOnUserLoaded
  let onUserLoaded = (user) => {
    //console.log('> user found');
    console.log('> user loaded');

    storeAPI.dispatch({
              type: "OnUserLoaded",
              user :user
            });

  };

  // event callback when silent renew errored
  // onSilentRenewError evtOnSilentRenewError
  let onSilentRenewError = (error) => {
    console.log('> silent renew error');
    storeAPI.dispatch({
              type: "onSilentRenewError",
              error :error
            });
  };

  // event callback when the access token expired
  //onAccessTokenExpired evtAccessTokenExpired
  let onAccessTokenExpired = () => {
    console.log('> access token expired');
    storeAPI.dispatch({
              type: "AccessTokenExpired"
            });
  };

  // event callback when the user is logged out
  //onUserUnloaded evtOnUserUnloaded
  let onUserUnloaded = () => {
    console.log('> user loaded');
    storeAPI.dispatch({
          type: "OnUserUnloaded"
        });
  };

  // event callback when the user is expiring
  //onAccessTokenExpiring evtAccessTokenExpiring
  let onAccessTokenExpiring = () => {
    console.log('> user expiring');
    storeAPI.dispatch({
              type: "AccessTokenExpiring"
            });
  }

  // event callback when the user is signed out
  //onUserSignedOut evtOnUserSignedOut
  let onUserSignedOut = () => {
    console.log('> user signed out');
    storeAPI.dispatch({
              type: "OnUserSignedOut"
            });
  }

  let setEvents = (mgr)=>{
    mgr.events.addUserLoaded(onUserLoaded);
    mgr.events.addSilentRenewError(onSilentRenewError);
    mgr.events.addAccessTokenExpired(onAccessTokenExpired);
    mgr.events.addAccessTokenExpiring(onAccessTokenExpiring);
    mgr.events.addUserUnloaded(onUserUnloaded);
    mgr.events.addUserSignedOut(onUserSignedOut);
  };

  let unsetEvents = (mgr)=>{
    mgr.events.removeUserLoaded(onUserLoaded);
    mgr.events.removeSilentRenewError(onSilentRenewError);
    mgr.events.removeAccessTokenExpired(onAccessTokenExpired);
    mgr.events.removeAccessTokenExpiring(onAccessTokenExpiring);
    mgr.events.removeUserUnloaded(onUserUnloaded);
    mgr.events.removeUserSignedOut(onUserSignedOut);
  };

  //reset usermanager
  //this might be unecessary but the example i looked at did thus
  //in future need to experiment removing this because it seems
  //not needed to me
  if(params){
    if(userManager)
      unsetEvents(userManager);

    userManager = new UserManager(params);
    setEvents(userManager);
    return userManager;
  }

  if(userManager)
    return userManager;

  const ids = storeAPI.getState().ids.IdServParams;
  const connected = storeAPI.getState().ids.connected;

  var config = {
      authority: ids.authority,
      client_id: ids.client_id,
      redirect_uri: ids.redirect_uri,
      response_type: ids.response_type,
      scope:ids.scope,
      post_logout_redirect_uri: window.location.origin ,
      loadUserInfo:ids.loadUserInfo,
      IsExternalLoginOnly :ids.loadUserInfo,
      silent_redirect_uri : ids.silent_redirect_uri,
      automaticSilentRenew  : ids.automaticSilentRenew
  };


  if(!userManager){
    userManager = new UserManager(config);
    setEvents(userManager);
  }

  return userManager;
}

const signInSilent = async (storeAPI, mgr, success)=>{


  const makeSignInConfig = (storeAPI)=>{

      const ids = storeAPI.getState().ids.IdServParams;

      var config = {
          authority: ids.authority,
          client_id: ids.client_id,
          redirect_uri: ids.redirect_uri,
          response_type: ids.response_type,
          scope:ids.scope,
          post_logout_redirect_uri: window.location.origin ,
          loadUserInfo:ids.loadUserInfo,
          IsExternalLoginOnly :ids.loadUserInfo,
          silent_redirect_uri : ids.silent_redirect_uri,
          automaticSilentRenew  : ids.automaticSilentRenew
      };

      return config;
    };


  let config = makeSignInConfig(storeAPI);

  let validationResult;

  let user = null;
  let tokenResult = null;

  return new Promise(async (resolve, reject) => {

    let loginAttemptCounter = localStorage.getItem("loginAttemptCounter");



    if(loginAttemptCounter > 2){
      console.log('signinsilent login attempt cutoff reached: ' +loginAttemptCounter );
      resolve({type: RS.TOOMANYATTEMPTS, message : 'attempted signin limit reached'});
      return; // let's not try this anymore it's clearly not working.
    }

    loginAttemptCounter++;

    localStorage.setItem("loginAttemptCounter",loginAttemptCounter);
    console.log('signinSilent: '+loginAttemptCounter);
    user = await mgr.signinSilent(config)
        .catch(async (error) =>
        {
            console.log('sign in silent failed reattempting: ' + error);
           //Work around to handle to Iframe window timeout errors on browsers
            user = await mgr.getUser().catch(async (error) =>
            {
              console.log('sign in silent get user error: ' + error);
              resolve({type: RS.USERUNDEFINED ,message : 'sign in silent resulted in no valid user'});
            });

            if(user){
              console.log('sign in silent 2nd attempt seems to have been a success');

              resolve({type: RS.USERVALID ,user: user, message : 'sign in silent 2nd attempt seems to have been a success'});
            }
            else{
              console.log('sign in silent 2nd attempt failed');
            }
        });
        console.log('signinSilent finished 2');
        if(user)
        {
          resolve({type: RS.USERVALID ,user: user, message : 'sign in silent 1st attempt seems to have been a success'});
        }
        else{
          resolve({type: RS.USERUNDEFINED ,message : 'sign in silent resulted in no valid user'});
        }

  });
};

const connectRedirect = async (connected,mgr,storeAPI)=>{


    mgr = ensureValidUserManage(mgr,storeAPI,{ response_mode: "query" });

    //try getting user from manager
    console.log('connect Redirect system set to NOT connected calling fetchuser');

    let userResult = await fetchUser(mgr);


    return new Promise(async (resolve, reject) => {
      if(userResult.type == RS.USERVALID)
      {
      //  console.log('connect Redirect success 1 ' + userResult.message);
      //  localStorage.setItem("loginAttemptCounter", "0");
        resolve(userResult);
      }
      else
      {
         console.log('connect Redirect fetch user couldnt find user with error:' + userResult.message);
         console.log('connect Redirect calling signinredirect');

         let signInResult = await mgr.signinRedirectCallback().catch((e)=> {
          //   console.log('Exception connect Redirect signinRedirectCallback' + e);
          //   storeAPI.dispatch({type: "AUTH_FAILED"});
          //   storeAPI.dispatch(push("/"));
             resolve({type:RS.SIGNINFAILED, message :'Exception connect Redirect signinRedirectCallback' + e });
         });

         if(signInResult){
           console.log('connect Redirect in signinRedirectCallback calling fetchuser to check we have logged in');

           userResult = await fetchUser(mgr);

           resolve(userResult);
          //  if(userResult.type == RS.USERVALID){
          // //   localStorage.setItem("loginAttemptCounter", "0");
          // //   console.log('connect Redirect success 2 ' + userResult.message);
          //
          //   resolve(userResult);
          //  }
          //  else{
          //    console.log('connect Redirect failure 2 ' + userResult.message);
          //    storeAPI.dispatch({type: "AUTH_FAILED"});
          //  }

        //   storeAPI.dispatch(push("/"));
         }
      };
    });




};

const loadUser =async (mgr,storeAPI)=>{
  console.log('loadUser reached');

  const ids = storeAPI.getState().ids;
  //if we are not logged in i.e. if we dont have a valid user already
  if(!ids.connected){
    localStorage.setItem("loginAttemptCounter", "0");

    mgr = ensureValidUserManage(mgr,storeAPI);

    let signInResult = await fetchUser(mgr);

    if(signInResult.type == RS.USERVALID){

      storeAPI.dispatch({ type: "RETRIEVE_GOOGLE_TOKEN"});

      let tokenResult = await manageGoogleTokenRetrieval(storeAPI, signInResult.user);
      storeAPI.dispatch({ type: "FINISHED_GOOGLE_FETCH"});
      if(tokenResult.type == RS.TOKENVALID || tokenResult.type == RS.FETCHEDVALID){
        storeAPI.dispatch(makeLoginDetailAction(signInResult.user, tokenResult.googleToken));
      }
      else {
        console.log('loadUser couldnt get google token :' + tokenResult.message);
      }
    }
    else{
      console.log('loadUser couldnt get user :' + signInResult.message);
    }
  }

}




const oidcMiddleware =  (url) => {
    let mgr;

    return storeAPI => next => async (action) => {

        const connected = storeAPI.getState().ids.connected;

        const expires_at_desc = storeAPI.getState().ids.expiresAtDesc;
        const expires_at  = storeAPI.getState().ids.expiresAt;

        const google_token_uri = storeAPI.getState().ids.IdServParams.google_token_uri;
        const access_token = storeAPI.getState().ids.access_token;
        const googleToken = storeAPI.getState().google.googleRawToken;

        const googleFetchOnGoing =  storeAPI.getState().ids.googleFetchOnGoing;
        const expired  =  storeAPI.getState().ids.expired;
        const expirationHandled = storeAPI.getState().ids.expirationHandled;

        let tokenResult = undefined;
        let signInResult = undefined; //fix compiler errors

        switch(action.type) {
            case "IDS_ATTEMPT_CONNECT":
                console.log('ATTEMPT_CONNECT starting connection attempt');

                const ids = storeAPI.getState().ids;
                // we aren't already logged in and
                // in the middle of an existing auto login
                if(!ids.connected){
                  mgr = ensureValidUserManage(mgr,storeAPI);
                  mgr.signinRedirect();
                }

                return;

            case "PAGE_LOAD":
               console.log('reload');
               const query = action.payload;

               //if we're connected already we shouldn't
               //need to do anything
               if(connected){
                console.log('reload no action required already connected');
                break;
               }

               if(query.code){
                 console.log('reload with: ' + query.code);
                 if(googleFetchOnGoing)
                   break;

                 let connectRedirectResult = await connectRedirect(connected,mgr,storeAPI);

                 if(connectRedirectResult.type == RS.USERVALID){
                   storeAPI.dispatch({ type: "RETRIEVE_GOOGLE_TOKEN"});
                   tokenResult = await manageGoogleTokenRetrieval(storeAPI, connectRedirectResult.user);

                   storeAPI.dispatch({ type: "FINISHED_GOOGLE_FETCH"});

                   if(tokenResult.type == RS.TOKENVALID || tokenResult.type == RS.FETCHEDVALID){
                     storeAPI.dispatch(makeLoginDetailAction(connectRedirectResult.user, tokenResult.user));
                   }
                 }
                 else{
                    storeAPI.dispatch({type: "AUTH_FAILED"});
                    storeAPI.dispatch(push("/"));
                 }

               }
               else{
                 if(query.state){
                   console.log('reload with: ' + query.state + ' ' + query.error);
                    storeAPI.dispatch({
                             type: "SET_USER_LOGOUT"
                           });
                   storeAPI.dispatch(push("/"));
                 }else{
                   console.log('loginRedirect Nothing in query string assumed page has been reloaded somehow');
                   localStorage.setItem("loginAttemptCounter",0);
                   loadUser(mgr,storeAPI);
                 }


               }

               break;

            case "DISCONNECT":
                console.log('=DISCONNECT action reached in middleware=');
                console.log('=Attempting to log out');

                let logOutUrl =  window.location.origin;

                mgr = ensureValidUserManage(mgr,storeAPI);

                mgr.getUser().then(function (user) {
                    if (user) {
                        mgr.signoutRedirect({
                          'id_token_hint': user.id_token ,
                          'post_logout_redirect_uri' : logOutUrl,
                          'state' : 'zzzz'
                        }).then(function() {
                          console.log('=signoutRedirect 1');
                        })
                        .finally(function() {
                            console.log('=signoutRedirect 3');

                        });
                    }
                    else {
                        console.log('=couldnt log out because there is no user');
                    }
                });
                return;

            case "AccessTokenExpired":
                console.log('AccessTokenExpired - calling signInSilent');

                if(expirationHandled)
                  break;

                storeAPI.dispatch({type: 'expirationHandled'});

                mgr = ensureValidUserManage(mgr,storeAPI);

                signInResult = await signInSilent(storeAPI,mgr);

                if(signInResult.type == RS.USERVALID){
                  tokenResult = await manageGoogleTokenRetrieval(storeAPI, signInResult.user);
                  if(tokenResult.type == RS.TOKENVALID ||
                        tokenResult.type == RS.FETCHEDVALID){
                          storeAPI.dispatch(makeLoginDetailAction(signInResult.user, tokenResult.googleToken));
                        }
                }

                // switch(signInResult.type){
                //     case  RS.USERVALID :
                //       let tokenResult = manageGoogleTokenRetrieval(storeAPI, signInResult.payload);
                //       break;
                //     case RS.TOOMANYATTEMPTS:
                //       break;
                //     case RS.FETCHEDEXPIRED:
                //       storeAPI.dispatch({type: "DISCONNECT"});
                //       break;
                //     case RS.TOKENVALID:
                //     case RS.FETCHEDVALID:
                //       //set state to reflect we have valid ids user and valid google token
                //       storeAPI.dispatch(makeLoginDetailAction(user, action));
                //       break;
                //     case RS.USERLOOKUPFAILED:
                //     case RS.USEREXPIRED:
                //       storeAPI.dispatch({type: "AUTH_FAILED"});
                //       break;
                //   }



                break;

        }

        return next(action);
    };
};

export default oidcMiddleware;
