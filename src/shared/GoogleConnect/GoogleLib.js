

export class GoogleLib {

  static AutoConnect(gapi, params, response) {

    if(!window.gapi)
      window.gapi = gapi;

    if (params.responseType === 'code') {
      params.access_type = 'offline';
    }



   const loadPlus = ()=>{

     window.gapi.client.load('plus', 'v1', function() {
        var request = gapi.client.plus.people.get({
          'userId': 'me'
        });
        request.execute(function(resp) {
        //    console.log('loadPlus finished');

        });
      });

   };

   window.gapi.load('client', loadPlus);



    window.gapi.load('auth2', () => {

      if (!window.gapi.auth2.getAuthInstance()) {

        let auth2 = gapi.auth2.init({
            client_id: params.client_id,
            scope:  params.scope
        });



        // Listen for sign-in state changes.
        auth2.isSignedIn.listen((res)=>{
      //    console.log('Listen for sign-in state changes.');
          //  loadPlus();
        });

        // Listen for changes to current user.
        auth2.currentUser.listen((res)=>{
          if (auth2.isSignedIn.get() == true) {
            response(res);
          }
        });
        // Sign in the user if they are currently signed in.
        if (auth2.isSignedIn.get() == true) {
          auth2.signIn();
        }


      }

    });
  }

  static SignIn(gapi,responseType,onSuccessParam,onFailureParam) {

    const onSuccess = (res)=>{
      if(onSuccessParam)
        onSuccessParam(res);
    };

    const onFailure = (res)=>{
      if(onFailureParam)
        onFailureParam(res);
    };

    const options = {
      prompt,
      responseType : responseType
    };

    if(!window.gapi)
      window.gapi = gapi;

    const auth2 = window.gapi.auth2.getAuthInstance();

    if (options.responseType === 'code') {
      auth2.grantOfflineAccess(options).then(res => onSuccess(res), err => onFailure(err));
    } else {
      auth2.signIn(options).then(res => onSuccess(res),

       err => onFailure(err));
    }


  }

  static SignOut(gapi, onComplete) {

    if(!window.gapi)
      window.gapi = gapi;

    if (window.gapi) {
      const auth2 = window.gapi.auth2.getAuthInstance();
      if (auth2 != null) {
        auth2.signOut().then(auth2.disconnect().then(()=>{
          onComplete();
        }));
      }
    }
  }

  static ReadSheet(gapi, scriptId,sheetUrl, ocallback){

      var request = {
          'function': 'GetSheet',
          "parameters": [sheetUrl]
      };

      GoogleLib.RunScript(gapi, scriptId,request, function(resp){
         ocallback(resp);
      });
  }


  static RunScript(gapi, scriptId, req,callback){

      if(!window.gapi)
        window.gapi = gapi;

      // Make the API request.
      var op = window.gapi.client.request({
          'root': 'https://script.googleapis.com',
          'path': 'v1/scripts/' + scriptId + ':run',
          'method': 'POST',
          'body': req
      });

      op.execute(function(resp) {
            if (resp.error && resp.error.status) {
              // The API encountered a problem before the script
              // started executing.
              console.log('Error calling API:');
              console.log(JSON.stringify(resp, null, 2));
            } else if (resp.error) {
              // The API executed, but the script returned an error.

              // Extract the first (and only) set of error details.
              // The values of this object are the script's 'errorMessage' and
              // 'errorType', and an array of stack trace elements.
              var error = resp.error.details[0];

              if (error.scriptStackTraceElements) {
                // There may not be a stacktrace if the script didn't start
                // executing.

                for (var i = 0; i < error.scriptStackTraceElements.length; i++) {
                  var trace = error.scriptStackTraceElements[i];
                  console.log(trace);
                }
              }

              console.log(error);

            } else {
              callback(resp.response.result);

            }
          });


  }

  static SearchForQuizFiles(gapi, scriptId, ocallback){


    const hasher = function(str) {
      var hash = 0, i, chr;
      if (str.length === 0) return hash;
      for (i = 0; i < str.length; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    };


      var fileArray = [];

      var request = {
          'function': 'readQuizs'
      };

      GoogleLib.RunScript(gapi, scriptId, request, function(resp){
          var idx =0;

          while(idx < resp.length){
              fileArray.push({ key: hasher(resp[idx].quiz), quiz: resp[idx].quiz, url : resp[idx].quiz , cats : resp[idx].cats});
              idx++;
          }

          ocallback(fileArray);
      });

  }


  static DeleteFile(name,callback){
     console.log(name);
     callback();

  //     var that =this;
  //
  //     var request = {
  //         'function': 'createQuiz',
  //         "parameters": [name]
  //     };
  //
  //     that.RunScript(request, function(resp){
  //         if(resp)
  //             that._channel.publish( "FileCreated", { value: name} );
  //         //do something else if failed
  //     })
  }

   static CreateFile(gapi, scriptId, name,callback){
      console.log('CreateFile: ' +name);
  //    callback();

      var that =this;

      var request = {
          'function': 'createQuiz',
          "parameters": [name]
      };

      GoogleLib.RunScript(gapi, scriptId,request, function(resp){
          if(resp)
           callback();
      });
  }


}

// /*global gapi*/
//
//
//
//
//
// export function GoogleLib(view,channel) {
//
//     // this.scriptId = "MQ9uI5jQzqKm4wt01EV3l5pIG0z7T6jhI";
//     // this.CLIENT_ID = '586728196968-cpt57v8ps0n4c1d5hcrmjrmmivoccu7c.apps.googleusercontent.com';
//     // this.SCOPES = 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/spreadsheets';
//     // this.data = null;
//     // this._channel = channel;
//     //
//     // this.authResult = null;
//     //
//     // this._view = view;
//     // this.driveLoaded;
//     //
//     // this.CheckLogin();
// }
//
//
//
//
//
//
// GoogleLib.prototype.LogInGoogle= function(){
//     console.log('Login Google');
//     var that = this;
//
//     gapi.auth.authorize(
//           {
//             client_id: that.CLIENT_ID,
//             scope: that.SCOPES,
//             immediate: false
//           },
//           $.proxy(that.autherizeResult, that) );//handleAuthResult
//         return false;
// };
//
// GoogleLib.prototype.CheckLogin= function(){
//     console.log('Login Google');
//     var that = this;
//
//     gapi.auth.authorize(
//           {
//             client_id: that.CLIENT_ID,
//             scope: that.SCOPES,
//             immediate: true
//           },
//           $.proxy(that.autherizeResult, that) );//handleAuthResult
//
//     return false;
// };
//
//
// GoogleLib.prototype.LogOutGoogle= function(){
//     console.log('Logout Google');
//     window.open("https://accounts.google.com/logout");
// };
//
//
// GoogleLib.prototype.autherizeResult = function(authResult) {
//     var that = this;
//     if (authResult && !authResult.error) {
//         writeStatement('Authenticated');
//         //SET AUTH RESULT
//         that.authResult = authResult;
//
//         that._channel.publish( "Login", { value: false} );
//
//         gapi.client.load('plus', 'v1', function() {
//           var request = gapi.client.plus.people.get({
//             'userId': 'me'
//           });
//           request.execute(function(resp) {
//
//             that._channel.publish( "LoginData", { value: resp} );
//           });
//         });
//
//     }
//     else {
//         writeStatement('Couldnt authenticate displaying button!');
//
//         that._channel.publish( "Login", { value: true} );
//     }
// };
//
// GoogleLib.prototype.init = function(driveLoaded){
//
// };
//
// GoogleLib.prototype.SearchForQuizFiles = function(ocallback){
//     var that =this;
//
//     var fileArray = [];
//
//     var request = {
//         'function': 'readQuizs'
//     };
//
//     that.RunScript(request, function(resp){
//         var idx =0;
//
//         while(idx < resp.length){
//             fileArray.push({ key: idx, value: resp[idx], url : resp[idx] });
//
//             idx++;
//         }
//
//         ocallback(fileArray);
//     })
//
// };
//
// GoogleLib.prototype.SearchForQuizFolder = function(name, ocallback){
//     var that = this;
//
//     this.SearchForQuizFiles( ocallback);
//
// };
//
// GoogleLib.prototype.ReadSheet = function(sheetUrl, ocallback){
//     var that =this;
//
//     var request = {
//         'function': 'quizCategoryQuestions',
//         "parameters": [sheetUrl,'']
//     };
//
//     that.RunScript(request, function(resp){
//        ocallback(resp.catData,resp.csvData);
//     })
//
//
// };
//


//
// GoogleLib.prototype.OpenFile = function(name){
//     console.log(name);
//     var that =this;
//
//     var request = {
//         'function': 'getURLByName',
//         "parameters": [name]
//     };
//
//     that.RunScript(request, function(resp){
//
//         if(resp!= ""){
//             console.log(resp);
//             window.open(resp);
//         }
//         else
//             console.log("Couldn't get URL");
//
//     })
// }
//
// GoogleLib.prototype.RunScript = function(req,callback){
//
//
//         // Make the API request.
//         var op = gapi.client.request({
//             'root': 'https://script.googleapis.com',
//             'path': 'v1/scripts/' + this.scriptId + ':run',
//             'method': 'POST',
//             'body': req
//         });
//
//         op.execute(function(resp) {
//           if (resp.error && resp.error.status) {
//             // The API encountered a problem before the script
//             // started executing.
//             console.log('Error calling API:');
//             console.log(JSON.stringify(resp, null, 2));
//           } else if (resp.error) {
//             // The API executed, but the script returned an error.
//
//             // Extract the first (and only) set of error details.
//             // The values of this object are the script's 'errorMessage' and
//             // 'errorType', and an array of stack trace elements.
//             var error = resp.error.details[0];
//
//             if (error.scriptStackTraceElements) {
//               // There may not be a stacktrace if the script didn't start
//               // executing.
//
//               for (var i = 0; i < error.scriptStackTraceElements.length; i++) {
//                 var trace = error.scriptStackTraceElements[i];
//                 console.log(trace);
//               }
//             }
//
//             console.log(error);
//
//           } else {
//             callback(resp.response.result);
//
//           }
//         });
//
//
// };
//
//
//
// function writeStatement(statement){
//    console.log(statement);
//      var d = new Date();
//      var n = d.toLocaleTimeString();
//
//      var output = $('#output').html();
//
//      output += '<br/>'+n+ ' ' + statement;
//
//      $('#output').html(output);
// }
