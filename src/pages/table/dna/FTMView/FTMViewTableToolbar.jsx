
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';
import { withStyles } from '@material-ui/core/styles';
//import WillTableHead from './FTMViewTableHeader.jsx';
import Box from '@material-ui/core/Box';
import { connect } from "react-redux";
import {useToolbarStyles} from '../../styleFuncs.jsx';
import TableBox from '../../tableBox.jsx';

const FTMViewTableToolbar = (props) => {
//  console.log('rendered: FTMViewTableToolbar' );

  const classes = useToolbarStyles();
  const { numSelected, title, filterFieldChanged, filterParams } = props.state;

  // numSelected={state.selected.length}
  //   filterParams ={state.filterParams} title = {state.title}
  //   filterFieldChanged = {state.filterFieldChanged}


  const [surname, setSurname] = React.useState(filterParams.surname);
  const [yearStart, setyearStart] = React.useState(String(filterParams.yearStart));
  const [yearEnd, setyearEnd] = React.useState(String(filterParams.yearEnd));
  const [location, setLocation] = React.useState(filterParams.location);

  const boxClick = ()=>{
    filterFieldChanged({
      yearStart : Number(yearStart),
      yearEnd : Number(yearEnd),
      location : location,
      surname : surname
    });
  };

  return (
    <Toolbar
      className={clsx(classes.root, {

        [classes.highlight]: numSelected > 0,
      })}
    >

      <TextField className={classes.filter} id="yearStart" label="Year From"
        value={yearStart}
        variant="standard"  size="small"
        onChange = {(e)=>{
            setyearStart(e.currentTarget.value);
        }}/>

      <TextField className={classes.filter} id="yearEnd" label="Year To"
        value={yearEnd}
        variant="standard"  size="small"
        onChange = {(e)=>{
           setyearEnd(e.currentTarget.value);
        }}/>
      <TextField className={classes.filter} id="location" label="Location"
        value={location}
        variant="standard"  size="small"
        onChange = {(e)=>{
          setLocation(e.currentTarget.value);
        }}/>
      <TextField className={classes.filter} id="surname" label="Surname"
        value={surname}
        variant="standard"  size="small"
        onChange = {(e)=>{
          setSurname(e.currentTarget.value);
        }}/>

      <TableBox boxClick ={boxClick}/>

    </Toolbar>
  );
};

FTMViewTableToolbar.propTypes = {
  state: PropTypes.object.isRequired 
};

export default FTMViewTableToolbar;
