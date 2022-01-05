import React from 'react'
import { connect } from "react-redux";

console.log('context created');
const AuthContext = React.createContext()


function _AuthProvider(props) {

  const {access_token} = props;

//  var access_token =1;

  return (
    <AuthContext.Provider value={access_token}>
        {props.children}
    </AuthContext.Provider>
  )
}

function useAuthProvider() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthProvider must be used within a AuthProvider')
  }
  return context;
}


const mapStateToProps = state => {
  return {
    access_token : state.ids.access_token
  };
};

const mapDispatchToProps = dispatch => {
  return {

  };
};

//export default connect(mapStateToProps, mapDispatchToProps)(CountProvider);

var AuthProvider =  connect(mapStateToProps, mapDispatchToProps)(_AuthProvider);

export {useAuthProvider, AuthProvider}
