import React from 'react';
import { TextField } from 'rmwc/TextField';
import { Typography } from 'rmwc/Typography';
import { ListDivider } from 'rmwc/List';

const Settings = ({ onChange, CALORIES_TOTAL, PROTEIN_TOTAL }) => {
  return (
    <React.Fragment>
      <Typography use="headline5" tag="div" className="p-4">
        Settings
      </Typography>
      <Typography use="overline" tag="div" className="px-4">
        Daily targets
      </Typography>
      <ListDivider />
      <TextField
        name="CALORIES_TOTAL"
        defaultValue={CALORIES_TOTAL}
        outlined
        label="Calories"
        onChange={onChange}
        className="mx-4"
      />
      <TextField
        name="PROTEIN_TOTAL"
        defaultValue={PROTEIN_TOTAL}
        outlined
        label="Protein (g)"
        onChange={onChange}
        className="mx-4"
      />
    </React.Fragment>
  );
};

export default Settings;
