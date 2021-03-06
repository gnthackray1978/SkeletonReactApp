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
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';


import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import {useTableState} from '../../useTable.jsx';
import {theme,useStyles} from '../../styleFuncs.jsx';
import TableHeaderFromState  from '../../TableHeaderFromState.jsx';

export default function SourceTable(props) {

  const {state} = props;

  const classes = useStyles();

  return (
    <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size='small'
              aria-label="source table"
            >
              <TableHeaderFromState state= {state}/>

              <TableBody>
                {

                  state.rows.map((row, index) => {
                    //console.log(row.reference);
                    const isItemSelected = state.isSelected(row.id);
                    const labelId = `source-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => state.handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >

                        <TableCell component="th" id={labelId} scope="row" padding="none">
                          {row.sourceRef}
                        </TableCell>
                        <TableCell  padding="none">{row.sourceDate}</TableCell>
                        <TableCell  padding="none">{row.sourceDateTo}</TableCell>
                        <TableCell  padding="none">{row.originalLocation}</TableCell>
                        <TableCell  padding="none">{row.isCopyHeld}</TableCell>
                        <TableCell  padding="none">{row.isViewed}</TableCell>
                        <TableCell  padding="none">{row.isThackrayFound}</TableCell>
                      </TableRow>
                    );
                  })}

              </TableBody>
            </Table>
          </TableContainer>

  );
}
