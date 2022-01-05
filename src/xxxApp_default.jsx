import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({

});

class App extends Component {
  constructor(props) {
     super(props);
   }

   componentDidMount() {

   }



   render() {
    return (<div> hello </div>);
  }
}



//export default connect(mapStateToProps, mapDispatchToProps)(App);
export default withStyles(styles)(App);
