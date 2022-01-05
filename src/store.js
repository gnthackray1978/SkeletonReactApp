import {combineReducers, createStore, applyMiddleware,compose  } from "redux";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import thunk from "redux-thunk";


import googleReducers from "./shared/GoogleConnect/googleReducers.js";
import googleMiddleware from "./shared/GoogleConnect/googleMiddleware.jsx";
import idsReducers from "./shared/IDSConnect/idsReducers.js";
import alReducers from "./features/ApplicationList/alReducers.jsx";

import oidcMiddleware from "./shared/IDSConnect/oidcMiddleware.jsx";

import { apiMiddleware, RSAA } from 'redux-api-middleware';



import { createBrowserHistory } from 'history';

import { syncHistoryWithStore, routerReducer,routerMiddleware, push  } from 'react-router-redux';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const apiAuthorizationMiddleware = (store) => (next) => (action) => {

 // Pass to next middleware if not a redux-api-middleware action
    if (!action[RSAA]) {
        return next(action);
    }

    let newAction ={
        ...action,
        [RSAA]: {
            ...action[RSAA],
            headers: {
                ...action[RSAA].headers,
                Authorization:  'Bearer ' + store.getState().ids.access_token
            }
        }
    };

    return next(newAction);
};

// export const apiAuthorizationMiddleware = (store) => (next) => (action) => {
//     if (!action[MY_AUTHORIZED_REQUEST]) {
//         return next(action);
//     }
//
//     const { [MY_AUTHORIZED_REQUEST]: request, ...newAction} = action;
//
//     const headers = request.headers ? {...request.headers} : {};
//     const state = store.getState();
//
//     headers.Authorization = 'Bearer ' + store.getState().ids.access_token;
//
//     request.headers = headers;
//
//     newAction[RSAA] = request;
//     return next(newAction);
// };

const rootReducer = combineReducers({
  al : alReducers,
  google : googleReducers,
  ids : idsReducers,
  routing: routerReducer
});

const oidcMW = oidcMiddleware('argh');

const googleMW = googleMiddleware('');

const routerMW = routerMiddleware(createBrowserHistory());

const store = createStore(
 rootReducer,
 undefined,
  composeEnhancers(
    applyMiddleware(apiAuthorizationMiddleware, apiMiddleware,oidcMW,routerMW,googleMW,thunk)
   )
);

//const c =  composeEnhancers(
//    applyMiddleware(thunk,oidcMW,routerMW,googleMW)
//  );

//const store = configureStore({
  // reducer: rootReducer,
  // enhancers : [thunk,oidcMW,routerMW,googleMW]
//});

export default store;
