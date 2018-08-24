import { Drawer, DrawerContent } from 'rmwc/Drawer';
import { TextField } from 'rmwc/TextField';
import { Typography } from 'rmwc/Typography';
import { ListDivider } from 'rmwc/List';

const Settings = ({ open, onChange, CALORIES_TOTAL, PROTEIN_TOTAL }) => {
  return (
    <Drawer persistent open={open == undefined ? true : open}>
      <DrawerContent className="flex flex-col justify-center">
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
      </DrawerContent>
    </Drawer>
  );
};

export default Settings;
