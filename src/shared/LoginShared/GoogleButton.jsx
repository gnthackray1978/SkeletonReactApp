import ButtonContent from './button-content'
import IconGoogle from './icon';
import React from 'react';
import blue from '@material-ui/core/colors/blue';
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import {PropTypes} from 'prop-types';


const styles = theme => ({
  fab: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  root: {
  flexGrow: 1,
  },
  grow: {
    marginLeft: 50,
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  tolowerBtn : {
    textTransform: 'none'
  },
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  initialStyle : {
    backgroundColor: theme === 'dark' ? 'rgb(66, 133, 244)' : '#fff',
    display: 'inline-flex',
    alignItems: 'center',
    color: theme === 'dark' ? '#fff' : 'rgba(0, 0, 0, .54)',
    boxShadow: '0 2px 2px 0 rgba(0, 0, 0, .24), 0 0 1px 0 rgba(0, 0, 0, .24)',
    padding: 0,
    borderRadius: 2,
    border: '1px solid transparent',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Roboto, sans-serif',
    marginLeft:25
  },

  hoveredStyle : {
    cursor: 'pointer',
    opacity: 0.9
  },

  activeStyle : {
    cursor: 'pointer',
    backgroundColor: theme === 'dark' ? '#3367D6' : '#eee',
    color: theme === 'dark' ? '#fff' : 'rgba(0, 0, 0, .54)',
    opacity: 1
  },


});


class GoogleButton extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      hovered: false,
      active: false
    };

  }



  render() {

    const { tag, type, render, theme, icon,classes, disabled , mode, onClick, label} = this.props;


    if (render) {
      return render({ onClick: onClick(false), disabled });
    }

    const defaultStyle = () => {
      if (this.state.active) {
        if (theme === 'dark')  return classes.initialStyle + ' ' + classes.activeStyle;

        return classes.initialStyle + ' '+classes.activeStyle;
      }

      if (this.state.hovered)  return classes.initialStyle + ' ' + classes.hoveredStyle;

      return classes.initialStyle;
    };

    const genericProps = {
      onMouseEnter: () => this.setState({ hovered: true }),
      onMouseLeave: () => this.setState({ hovered: false, active: false }),
      onMouseDown: () => this.setState({ active: true }),
      onMouseUp: () => this.setState({ active: false }),
      onClick: ()=> onClick(false),
      style :{},
      type,
      disabled :false,
      className:defaultStyle()
    };

    let content;

    if(mode == 'cancel'){
      content = [
          <ButtonContent key ="1">
              {label}
          </ButtonContent>
      ];
    }

    if(mode == 'login' || mode == 'logout'){
      content = [
        icon && <IconGoogle key={1} active={this.state.active} />,
          <ButtonContent icon={icon} key={2}>
            {label}
          </ButtonContent>
      ];
    }

    return React.createElement(tag, genericProps,content);
  }
}

GoogleButton.propTypes = {
  classes: PropTypes.object.isRequired,
  label : PropTypes.string,
  onClick : PropTypes.func,
  mode: PropTypes.string,
  disabled : PropTypes.bool,
  render : PropTypes.func,
  type: PropTypes.string,
  tag: PropTypes.string,
  theme: PropTypes.string,
  icon: PropTypes.bool,
};


const mapStateToProps = (state, ownProps) => {

  let disabled = false;

  if(ownProps.mode != 'cancel'){

    if(ownProps.mode == 'logout' && state.google.GoogleApiLoggedIn){
      disabled = false;
    }
    if(ownProps.mode == 'logout' && !state.google.GoogleApiLoggedIn){
      disabled = true;
    }
    if(ownProps.mode == 'login' && state.google.GoogleApiLoggedIn){
      disabled = true;
    }
  }



  return {
    disabled,
    ClientId : state.google.GoogleApiParams.clientId,
    Scope : state.google.GoogleApiParams.scopes,
    cookiePolicy: state.google.GoogleApiParams.cookie_policy,
    LoginHint: state.google.GoogleApiParams.login_hint,
    FetchBasicProfile : state.google.GoogleApiParams.fetch_basic_profile,
    UxMode: state.google.GoogleApiParams.uxMode,
    AccessType: state.google.GoogleApiParams.accessType,
    type: state.google.GoogleApiParams.type,
    tag: state.google.GoogleApiParams.tag,
    buttonText: state.google.GoogleApiParams.buttonText,
    prompt: state.google.GoogleApiParams.prompt,
    disabledStyle: state.google.GoogleApiParams.disabledStyle,
    icon: state.google.GoogleApiParams.icon,
    theme: state.google.GoogleApiParams.theme,
    jsSrc: state.google.GoogleApiParams.jsSrc,
    GoogleApiLoggedIn : state.google.googleApiLoggedIn,
    ProfileObj : state.google.profileObj
  };
};


export default withStyles(styles)(connect(mapStateToProps, ()=>  {return {};})(GoogleButton));
