import { Drawer, DrawerContent } from 'rmwc/Drawer';
import { TextField } from 'rmwc/TextField';
import { Typography } from 'rmwc/Typography';
import { ListDivider } from 'rmwc/List';

const Settings = ({
  advancedComponents,
  open,
  onChange,
  onClose,
  CALORIES_TOTAL,
  PROTEIN_TOTAL,
}) => {
  return (
    <Drawer temporary open={open == undefined ? true : open} onClose={onClose}>
      <DrawerContent>
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

        <Typography use="overline" tag="div" className="px-4">
          Advanced
        </Typography>
        <ListDivider />

        {advancedComponents}
      </DrawerContent>
    </Drawer>
  );
};

export default Settings;
