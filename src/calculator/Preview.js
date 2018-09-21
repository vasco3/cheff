import React, { Component } from 'react';
import numeral from 'numeral';

import {
  DataTable,
  DataTableContent,
  DataTableHead,
  DataTableBody,
  DataTableHeadCell,
  DataTableRow,
  DataTableCell,
} from '@rmwc/data-table';

function formatNumber(number, format) {
  return numeral(number).format(format || '0');
}
class Preview extends Component {
  render() {
    const { bodyLbs, rest, workout } = this.props;
    return (
      <DataTable>
        <DataTableContent>
          <DataTableHead>
            <DataTableRow>
              <DataTableHeadCell>Nutrient</DataTableHeadCell>
              <DataTableHeadCell alignEnd>Rest Day</DataTableHeadCell>
              <DataTableHeadCell alignEnd>Workout Day</DataTableHeadCell>
            </DataTableRow>
          </DataTableHead>
          <DataTableBody>
            <DataTableRow>
              <DataTableCell>cal / body-lb</DataTableCell>
              <DataTableCell alignEnd>
                {formatNumber(rest.calories / bodyLbs, '0,0')}
              </DataTableCell>
              <DataTableCell alignEnd>
                {formatNumber(workout.calories / bodyLbs, '0,0')}
              </DataTableCell>
            </DataTableRow>
            <DataTableRow activated>
              <DataTableCell>calories</DataTableCell>
              <DataTableCell alignEnd>
                {formatNumber(rest.calories, '0,0')}
              </DataTableCell>
              <DataTableCell alignEnd>
                {formatNumber(workout.calories, '0,0')}
              </DataTableCell>
            </DataTableRow>
            <DataTableRow>
              <DataTableCell>Carbs</DataTableCell>
              <DataTableCell alignEnd>{formatNumber(rest.carbs)}</DataTableCell>
              <DataTableCell alignEnd>
                {formatNumber(workout.carbs)}
              </DataTableCell>
            </DataTableRow>
            <DataTableRow>
              <DataTableCell>Fat</DataTableCell>
              <DataTableCell alignEnd>{formatNumber(rest.fat)}</DataTableCell>
              <DataTableCell alignEnd>
                {formatNumber(workout.fat)}
              </DataTableCell>
            </DataTableRow>
            <DataTableRow>
              <DataTableCell>Protein</DataTableCell>
              <DataTableCell alignEnd>
                {formatNumber(rest.protein)}
              </DataTableCell>
              <DataTableCell alignEnd>
                {formatNumber(workout.protein)}
              </DataTableCell>
            </DataTableRow>
          </DataTableBody>
        </DataTableContent>
      </DataTable>
    );
  }
}

export default Preview;
