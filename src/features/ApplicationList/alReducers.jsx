import { FETCHAPPLIST_START, FETCHAPPLIST_SUCCESS, FETCHAPPLIST_FAIL } from './actionTypes.jsx';

export default (state = {
  appList :undefined,
  isFetchingList :false,
  error: undefined
}, action) => {


  switch (action.type) {

      case "FETCHAPPLIST_START":
          console.log('FETCHAPPLIST_START');
          return {
            ...state,
             isFetchingList :true,
             error: undefined
          };
      case "FETCHAPPLIST_SUCCESS":
          console.log('FETCHAPPLIST_SUCCESS');
          return {
            ...state,
             appList : action.payload,
             isFetchingList :false,
             error: ''
          };
      case "FETCHAPPLIST_FAIL":
          console.log('FETCHAPPLIST_FAIL');
          return {
            ...state,
            error : action.payload,
            isFetchingList :false
          };



      default:
          return state;

    }
};
