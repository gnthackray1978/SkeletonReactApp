import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";

const styles = theme => ({

});

function Default(props) {

    const {className, theme, classes} = props;

    return (
        <div>
          Default page
        </div>
    );

}


export default withStyles(styles)(Default);
