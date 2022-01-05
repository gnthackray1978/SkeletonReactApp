import { createAction } from 'redux-api-middleware';

import { FETCHAPPLIST_START, FETCHAPPLIST_SUCCESS, FETCHAPPLIST_FAIL } from './actionTypes.jsx';

import { appListURI } from './constants.js';

export const fetchApplicationList = () => createAction({
  endpoint: appListURI,
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
  types: [
    FETCHAPPLIST_START,
    FETCHAPPLIST_SUCCESS,
    FETCHAPPLIST_FAIL,
  ],
});
