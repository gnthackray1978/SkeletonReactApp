import React, { Component } from 'react';
import MarriageTable from './MarriageTable.jsx'
import { gql} from '@apollo/client';

import MarriageTableToolbar from './MarriageTableToolbar.jsx'
import TableWrapper from '../../TableWrapper.jsx'
import {useTableState} from '../../useTable';


function Marriages() {


  const GET_MARRIAGES = gql`
  query Adb(
     $limit: Int!,
     $offset : Int!,
     $sortColumn: String!,
     $sortOrder : String!,
     $yearStart : Int!,
     $yearEnd : Int!,
     $maleSurname : String!,
     $femaleSurname : String!,
     $location : String!
   ){
    adb{
      marriagesearch(
                     limit : $limit,
                     offset : $offset,
                     sortColumn: $sortColumn,
                     sortOrder : $sortOrder,
                     yearStart : $yearStart,
                     yearEnd: $yearEnd,
                     maleSurname : $maleSurname,
                     femaleSurname: $femaleSurname,
                     location : $location
           ) {
       page
       totalResults
       results {
                  id
                  maleCname
                  maleSname
                  femaleCname
                  femaleSname
                  marriageLocation
                  yearIntVal
                  marriageCounty
                  source
                  witness1
                  femaleIsKnownWidow
                  maleIsKnownWidower
                  isLicence
                  totalEvents
       }
     }
    }
  }
  `;

    const headCells = [
      { id: 'maleCname', numeric: false, disablePadding: true, label: 'Groom Name' },
      { id: 'maleSname', numeric: false, disablePadding: true, label: 'Groom Surname' },
      { id: 'femaleCname', numeric: false, disablePadding: true, label: 'Bride Name' },
      { id: 'femaleSname', numeric: false, disablePadding: true, label: 'Bride Surname' },
      { id: 'marriageLocation', numeric: false, disablePadding: true, label: 'Loc.' },
      { id: 'yearIntVal', numeric: false, disablePadding: true, label: 'Year' },
      { id: 'marriageCounty', numeric: false, disablePadding: true, label: 'County' },
      { id: 'source', numeric: false, disablePadding: true, label: 'Src' },
      { id: 'witness1', numeric: false, disablePadding: true, label: 'Wit' },
      { id: 'femaleIsKnownWidow', numeric: false, disablePadding: true, label: 'Wid' },
      { id: 'maleIsKnownWidower', numeric: false, disablePadding: true, label: 'Widower' },
      { id: 'isLicence', numeric: false, disablePadding: true, label: 'Lic.' },
      { id: 'totalEvents', numeric: false, disablePadding: true, label: 'Dupes' }
    ];

    var state = useTableState(GET_MARRIAGES,{
      sortColumn : 'maleCname',
      sortOrder : 'asc',
      limit : 0,
      offset :0,
      surname : '',
      yearStart : 1500,
      yearEnd: 1800,
      maleSurname : '',
      femaleSurname: '',
      location :''
    },'adb','marriagesearch');

    state.headCells = headCells;
    state.title = 'Marriage Search';


    return (
    
        <div>
          <TableWrapper state = {state} >
            <MarriageTableToolbar state ={state}/>
            <MarriageTable state ={state}/>
          </TableWrapper>
        </div>
    );

}


export default Marriages;
