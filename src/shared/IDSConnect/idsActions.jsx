
const queryString = require('query-string');
import { push } from 'react-router-redux';


export const evtAccessTokenExpired = () =>{
  console.log('evtAccessTokenExpired');
  return async (dispatch, getState)  => {
       dispatch({
         type: "AccessTokenExpired",
       });
    }
};

export const evtAccessTokenExpiring = () =>{
  console.log('evtAccessTokenExpiring action');
  return async (dispatch, getState)  => {
       dispatch({
         type: "AccessTokenExpiring",
       });
    }
};

export const evtOnUserSignedOut = () =>{
  console.log('evtOnUserSignedOut action');
  return async (dispatch, getState)  => {
       dispatch({
         type: "OnUserSignedOut",
       });
    }
};

export const evtOnUserUnloaded = () =>{
  console.log('evtOnUserUnloaded action');
  return async (dispatch, getState)  => {
       dispatch({
         type: "OnUserUnloaded",
       });
    }
};

export const evtOnSilentRenewError = (error) =>{
  console.log('evtOnSilentRenewError action');
  return async (dispatch, getState)  => {
       dispatch({
         type: "OnSilentRenewError",
         payload: error
       });
    }
};

export const evtOnUserLoaded = (user) =>{
  console.log('evtOnUserLoaded action');
  return async (dispatch, getState)  => {
       dispatch({
         type: "OnUserLoaded",
         payload: user
       });
    }
};




export const setPath = () =>{
  return async (dispatch, getState)  => {
      dispatch(push("/"));
    }
};

export const login = () =>{
  return async (dispatch, getState)  => {

    dispatch({
      type: "IDS_ATTEMPT_CONNECT"
    });

    }
};


//
export const setIdsLoginScreenVisible = (isVisible) =>{
  return async (dispatch, getState)  => {
      dispatch({
        type: "SET_IDSLOGINLOADVISIBLE",
        payload : isVisible
      });
    }
};

export const logout = () =>{
  console.log('logout action');
  return async (dispatch, getState)  => {
       dispatch({
         type: "DISCONNECT",
       });
    }
};

export const loginRedirect = () =>{
  var query = queryString.parse(window.location.search);

  return async (dispatch, getState)  => {
       dispatch({
         type: "PAGE_LOAD",
         payload : query
       });
    }

};
