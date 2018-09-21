import React from 'react';
import Router from 'next/router';

import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { Button } from 'rmwc/Button';
import { Checkbox } from 'rmwc/Checkbox';
import { ListDivider } from 'rmwc/List';
import { Select, Grid, GridCell } from 'rmwc';
import { TextField, TextFieldHelperText } from 'rmwc/TextField';
import { Typography } from 'rmwc/Typography';

import { computeMacros } from './utils';
import { macroOptions, kinobodyProgramModeOptions } from './constants';
import { withCoreContext } from '../CoreContext';

import Preview from './Preview';

class Calculator extends React.Component {
  state = { isSaved: false };
  render() {
    const { handleCalculatorSave, settings = {}, recipes } = this.props;
    return (
      <Formik
        initialValues={{
          bodyWeight: settings.bodyWeight || 180,
          bodyWeightIsInLbs: settings.bodyWeightIsInLbs || 'lbs',
          kinobodyProgram: settings.kinobodyProgram || 'GGP',
          kinobodyProgramMode: settings.kinobodyProgramMode || 'LEAN_BULK',
          kinobodyMacroOption:
            settings.kinobodyMacroOption || 'PROTEIN_DEFAULT',
          workoutOnSunday: settings.workoutOnSunday || false,
          workoutOnMonday: settings.workoutOnMonday || false,
          workoutOnTuesday: settings.workoutOnTuesday || false,
          workoutOnWednesday: settings.workoutOnWednesday || false,
          workoutOnThursday: settings.workoutOnThursday || false,
          workoutOnFriday: settings.workoutOnFriday || false,
        }}
        validationSchema={yup.object().shape({
          bodyWeight: yup.number().required(),
          bodyWeightIsInLbs: yup.string().required(),
          kinobodyProgram: yup.string().required(),
          kinobodyProgramMode: yup.string().required(),
          kinobodyMacroOption: yup.string().required(),
        })}
        onSubmit={(values, { setSubmitting }) => {
          const macrosRest = computeMacros(values);
          const macrosWorkout = computeMacros(values, true);

          handleCalculatorSave({
            settings: {
              ...values,
              bodyWeight: parseInt(values.bodyWeight),
            },
            macrosRest,
            macrosWorkout,
          });

          if (recipes.size > 0) {
            Router.push('/plan');
          } else {
            Router.push('/recipes');
          }
        }}
        render={({
          errors,
          handleBlur,
          handleChange,
          handleReset,
          isSubmitting,
          values,
        }) => {
          return (
            <div>
              <Typography use="subtitle1" tag="div" className="p-4">
                Set your daily targets to compute your meal plan
              </Typography>
              <Form>
                <Grid>
                  <GridCell span="6">
                    <Typography use="overline" tag="div">
                      Workout days
                    </Typography>
                    <ListDivider />
                    <Checkbox
                      onChange={handleChange}
                      checked={values.workoutOnSunday}
                      name="workoutOnSunday"
                      label="Sunday"
                    />

                    <Checkbox
                      onChange={handleChange}
                      checked={values.workoutOnMonday}
                      name="workoutOnMonday"
                      label="Monday"
                    />
                    <Checkbox
                      onChange={handleChange}
                      checked={values.workoutOnTuesday}
                      name="workoutOnTuesday"
                      label="Tuesday"
                    />
                    <Checkbox
                      onChange={handleChange}
                      checked={values.workoutOnWednesday}
                      name="workoutOnWednesday"
                      label="Wednesday"
                    />
                    <Checkbox
                      onChange={handleChange}
                      checked={values.workoutOnThursday}
                      name="workoutOnThursday"
                      label="Thursday"
                    />
                    <Checkbox
                      onChange={handleChange}
                      checked={values.workoutOnFriday}
                      name="workoutOnFriday"
                      label="Friday"
                    />
                    <Checkbox
                      onChange={handleChange}
                      checked={values.workoutOnSaturday}
                      name="workoutOnSaturday"
                      label="Saturday"
                    />
                  </GridCell>
                  <GridCell span="6">
                    <Typography use="overline" tag="div">
                      Kinobody Calories / Macros
                    </Typography>
                    <ListDivider />
                    <Select
                      className="my-4 mr-4"
                      label="Kinobody Program"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      options={[
                        { label: 'GGP - Greek God Program', value: 'GGP' },
                      ]}
                      outlined
                      value={values.kinobodyProgram}
                    />
                    <Select
                      className="mb-4 mr-4"
                      label="Program Mode"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      options={kinobodyProgramModeOptions}
                      outlined
                      name="kinobodyProgramMode"
                      value={values.kinobodyProgramMode}
                    />
                    <Select
                      className="mb-4 mr-4"
                      label="Macro Options"
                      name="kinobodyMacroOption"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      options={macroOptions}
                      outlined
                      value={values.kinobodyMacroOption}
                    />
                    <TextField
                      className="mb-4 mr-4"
                      label="Body weight"
                      name="bodyWeight"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      outlined
                      value={values.bodyWeight}
                    />
                    {errors.bodyWeight && (
                      <TextFieldHelperText validationMsg persistent>
                        {errors.bodyWeight}
                      </TextFieldHelperText>
                    )}
                    <Select
                      className="mb-4 mr-4"
                      label="units"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      options={['lbs']}
                      outlined
                      name="bodyWeightIsInLbs"
                      value={values.bodyWeightIsInLbs}
                    />
                  </GridCell>
                </Grid>

                <footer className="flex justify-end mt-4 mb-8 pr-4">
                  <Button className="mr-4" onClick={handleReset}>
                    reset
                  </Button>
                  <Button type="submit" raised disabled={isSubmitting}>
                    save
                  </Button>
                </footer>

                <Typography use="headline5" tag="div" className="mx-4 mt-4">
                  Preview Macros
                </Typography>

                <Grid>
                  <GridCell span="6">
                    <Typography use="overline" tag="div">
                      Rest Day
                    </Typography>
                    <ListDivider />
                    <Preview {...computeMacros(values)} />
                  </GridCell>
                  <GridCell span="6">
                    <Typography use="overline" tag="div">
                      Workout Day
                    </Typography>
                    <ListDivider />
                    <Preview {...computeMacros(values, true)} />
                  </GridCell>
                </Grid>

                <ListDivider />
              </Form>
            </div>
          );
        }}
      />
    );
  }
}

export default withCoreContext(Calculator);
