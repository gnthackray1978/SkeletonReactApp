import { gapi, loadAuth2 } from 'gapi-script'


const googleMiddleware = (params) => {


    return storeAPI => next => action => {

        const google = storeAPI.getState().google;
        //loadProfileByDefault


        switch(action.type) {
            case "SAMPLE": {
                console.log('CONNECT reached');
                return;
            }
            case "LOAD_PROFILE":
            {
                console.log('LOAD_PROFILE reached');

                if(google.auth2loaded){

                  var op = gapi.client.request({
                      'path': google.profileUrl,
                  });

                  op.execute(function (resp) {
                    //  log(200, resp);

                    console.log('got profile response');

                    storeAPI.dispatch({
                              type: "SET_PROFILE",
                              profileObj : resp
                            });

                    if(resp.error){

                      storeAPI.dispatch({
                                type: "SET_PROFILE_ERROR",
                                errorMessage : resp.error.message
                              });

                      console.log('resp'+resp.error.message);
                    }
                  });
                }
                return;
            }

            case "LOAD_AUTH2":
                console.log('LOAD_AUTH2 googleMiddleware reached');

                let contents =action.token;
                let expiresIn = new Date(contents.expires);

                let seconds = (Date.now() - expiresIn)/1000;


                gapi.load('client:auth2', () => {
                    var accessTokenObj = {};
                    accessTokenObj.access_token = contents.value;
                    accessTokenObj.token_type = "Bearer";
                    accessTokenObj.expires_in = "3600";

                    gapi.auth.setToken(accessTokenObj);

                    storeAPI.dispatch({
                              type: "GAPIAUTH_LOADED",
                            });

                    if(google.loadProfileByDefault){
                      storeAPI.dispatch({
                                type: "LOAD_PROFILE",
                              });

                    }

                });
                break;

        }

        return next(action);
    };
};

export default googleMiddleware;
