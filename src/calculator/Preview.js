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
const center = { textAlign: 'center' };
const styleWorkoutCell = { ...center, color: 'var(--mdc-theme-primary)' };
class Preview extends Component {
  render() {
    const { bodyLbs, rest, workout } = this.props;
    return (
      <DataTable>
        <DataTableContent style={{ textAlign: 'left', width: '100%' }}>
          <DataTableHead>
            <DataTableRow>
              <DataTableHeadCell>Nutrient</DataTableHeadCell>
              <DataTableHeadCell style={center}>Rest Day</DataTableHeadCell>
              <DataTableHeadCell style={center}>Workout Day</DataTableHeadCell>
            </DataTableRow>
          </DataTableHead>
          <DataTableBody>
            <DataTableRow>
              <DataTableCell>cal / body-lb</DataTableCell>
              <DataTableCell style={center}>
                {formatNumber(rest.calories / bodyLbs, '0,0')}
              </DataTableCell>
              <DataTableCell style={styleWorkoutCell}>
                {formatNumber(workout.calories / bodyLbs, '0,0')}
              </DataTableCell>
            </DataTableRow>
            <DataTableRow>
              <DataTableCell>calories</DataTableCell>
              <DataTableCell style={center}>
                {formatNumber(rest.calories, '0,0')}
              </DataTableCell>
              <DataTableCell style={styleWorkoutCell}>
                {formatNumber(workout.calories, '0,0')}
              </DataTableCell>
            </DataTableRow>
            <DataTableRow>
              <DataTableCell>carbs</DataTableCell>
              <DataTableCell style={center}>
                {formatNumber(rest.carbs)}
              </DataTableCell>
              <DataTableCell style={styleWorkoutCell}>
                {formatNumber(workout.carbs)}
              </DataTableCell>
            </DataTableRow>
            <DataTableRow>
              <DataTableCell>fat</DataTableCell>
              <DataTableCell style={center}>
                {formatNumber(rest.fat)}
              </DataTableCell>
              <DataTableCell style={styleWorkoutCell}>
                {formatNumber(workout.fat)}
              </DataTableCell>
            </DataTableRow>
            <DataTableRow>
              <DataTableCell>protein</DataTableCell>
              <DataTableCell style={center}>
                {formatNumber(rest.protein)}
              </DataTableCell>
              <DataTableCell style={styleWorkoutCell}>
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
