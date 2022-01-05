import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    width: 42
  },
  image: {
    position: "relative",
    height: 40,

    [theme.breakpoints.down("xs")]: {
      width: "42", // Overrides inline-style
      height: 40
    },
    "&:hover, &$focusVisible": {
      zIndex: 1,
      "& $imageBackdrop": {
        opacity: 0.15
      },
      "& $imageMarked": {
        opacity: 0
      },
      "& $imageTitle": {
        border: "4px solid currentColor"
      }
    }
  },
  focusVisible: {},
  imageButton: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 80,
    color: theme.palette.common.white
  },
  imageSrc: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 80,
    backgroundSize: "cover",
    backgroundPosition: "center 100%"
  },
  imageBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 80,

    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create("opacity")
  },
  imageTitle: {
    position: "relative",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px ${theme
      .spacing.unit + 6}px`
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: "absolute",
    bottom: -2,
    left: "calc(50% - 9px)",
    transition: theme.transitions.create("opacity")
  },
  img__overlayInner: {
    alignItems: "center",

    display: "flex",
    justifyContent: "center",
    left: -5,
    width: 53,
    height: 50,
    opacity: 1,
    position: "absolute",

     borderRadius: 100,
     background: 'linear-gradient(to right, red, green, yellow)',
    top: -5,

    zIndex: 0
  },
  img__overlayOuter: {
    alignItems: "center",

    display: "flex",
    justifyContent: "center",
    left: -2,
    width: 46,
    height: 44,
    opacity: 1,
    position: "absolute",

     borderRadius: 100,
     background: 'white',
    top: -2,

    zIndex: 0
  }
});

// const images = {
//   url:
//     "https://lh4.googleusercontent.com/-uj_JmOo3IsY/AAAAAAAAAAI/AAAAAAAAoJ8/-wzqV0HBTnI/s96-c/photo.jpg",
//   title: "Breakfast",
//   width: "100%"
// };

function ImageButton(props) {
  //console.log('ImageButton');

  const { classes } = props;

  return (
      <div className={classes.root}>
          <ButtonBase
              focusRipple
              className={classes.image}
              focusVisibleClassName={classes.focusVisible}
              onClick={props.onClick}
              style={{
                width: '100%'
              }}
          >
              <span className={classes.img__overlayInner} />
              <span className={classes.img__overlayOuter} />
              <span className={classes.imageSrc}
                  style={{
                    backgroundImage: `url(${props.url})`
                  }}
              />
              <span className={classes.imageBackdrop} />
              <span className={classes.imageButton} />
          </ButtonBase>
      </div>
  );
}

ImageButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick : PropTypes.func,
  url : PropTypes.string
};

export default withStyles(styles)(ImageButton);
