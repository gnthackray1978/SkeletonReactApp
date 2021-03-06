import { APPLICATIONLISTLOADED, APPLICATIONSELECTED, FUNCTIONLISTLOADED,METADATALOADED,
  FUNCTIONSELECTED,APPDIALOGOPEN,APPDIALOGCLOSED,FUNCDIALOGOPEN,FUNCDIALOGCLOSED,
   TREESELECTED ,TREEPERSONSELECTED,DIAGRAMSELECTED} from './actionTypes.jsx';

export default (state = {
  appName :1,
  appList : [
      {
        id: 1,
        name: 'Front Page',
        defaultPageName : 'default',
        defaultPageTitle :'Default',
        __typename: 'SiteType'
      }],

  funcName :0,
  funcList : [],

  loadedAppList :false,
  loadedFuncList :false,
  showAppListDialog :false,
  showFuncListDialog :false,
  selectedTreeData : undefined,
  selectedTreePersonData : undefined,
  diagramId : 0,
  error: undefined
}, action) => {


  switch (action.type) {

    case TREEPERSONSELECTED:
        //console.log('APPLICATIONSELECTED');
        return {
          ...state,
           selectedTreePersonData : action.payload
        };
    case TREESELECTED:
        //console.log('APPLICATIONSELECTED');
        return {
          ...state,
           selectedTreeData : action.payload
        };
    case DIAGRAMSELECTED:
        //console.log('APPLICATIONSELECTED');
        return {
          ...state,
           diagramId : action.payload
        };


    case METADATALOADED:
        //console.log('APPLICATIONLISTLOADED');
        return {
          ...state,
           appList: action.payload.sites,
           funcList: action.payload.funcs,
           appName : action.payload.appId,
           funcName :action.payload.pageId
        };

    case FUNCTIONSELECTED:
        //console.log('APPLICATIONSELECTED');
        return {
          ...state,
           funcName : action.payload
        };

      case APPLICATIONSELECTED:
          // if we have a new app selected
          // then invalidate the func list & selected Function
          // if same app nothing will change
          if(state.appName != action.payload){
            return {
               ...state,
            //   funcList: [],
              // loadedFuncList :false,
               funcName : 0,
               appName : action.payload
            };
          }

        case APPDIALOGOPEN:
            //console.log('APPDIALOGOPEN');
            return {
              ...state,
               showAppListDialog : true
            };

        case APPDIALOGCLOSED:
            //console.log('APPDIALOGCLOSED');
            return {
              ...state,
               showAppListDialog : false
            };

        case FUNCDIALOGOPEN:
            //console.log('APPDIALOGOPEN');
            return {
              ...state,
               showFuncListDialog : true
            };

        case FUNCDIALOGCLOSED:
            //console.log('APPDIALOGCLOSED');
            return {
              ...state,
               showFuncListDialog : false
            };


      default:
          return state;

    }
};
