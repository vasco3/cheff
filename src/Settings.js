import { Drawer, DrawerContent } from 'rmwc/Drawer';
import { TextField } from 'rmwc/TextField';

const Settings = ({
  open,
  onChange,
  BODY_WEIGHT_LBS,
  CALORIES_TOLERANCE,
  PROTEIN_PER_BODY_LB,
  TOTAL_CALORIES,
}) => {
  return (
    <Drawer persistent open={open == undefined ? true : open}>
      <DrawerContent className="flex flex-col justify-center">
        <TextField
          name="TOTAL_CALORIES"
          defaultValue={TOTAL_CALORIES}
          outlined
          label="calories"
          onChange={onChange}
          className="mx-4"
        />
        <TextField
          name="BODY_WEIGHT_LBS"
          defaultValue={BODY_WEIGHT_LBS}
          outlined
          label="Body lbs"
          onChange={onChange}
          className="mx-4"
        />
        <TextField
          name="CALORIES_TOLERANCE"
          defaultValue={CALORIES_TOLERANCE}
          outlined
          label="Calorie Tolerance"
          onChange={onChange}
          className="mx-4"
        />
        <TextField
          name="PROTEIN_PER_BODY_LB"
          defaultValue={PROTEIN_PER_BODY_LB}
          outlined
          label="Protein g per body lb"
          onChange={onChange}
          className="mx-4"
        />
      </DrawerContent>
    </Drawer>
  );
};

export default Settings;
