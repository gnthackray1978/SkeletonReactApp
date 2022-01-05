import React from 'react'
import {PropTypes} from 'prop-types';

const ButtonContent = ({ children, icon }) => (
    <span style={{ paddingRight: 10, fontWeight: 500, paddingLeft: icon ? 0 : 10, paddingTop: 10, paddingBottom: 10 }}>{children}</span>
)

ButtonContent.propTypes = {
  children: PropTypes.string.isRequired,
  icon: PropTypes.bool
};

export default ButtonContent
