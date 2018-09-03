import React from 'react';
import Link from 'next/link';
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
    const { handleCalculatorSave, settings = {} } = this.props;
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

          this.setState({ isSaved: true }, () => setSubmitting(false));
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

                  <GridCell span="6">
                    <Typography use="overline" tag="div">
                      Workout days
                    </Typography>
                    <ListDivider />
                    <Checkbox
                      onChange={handleChange}
                      value={values.workoutOnSunday}
                      name="workoutOnSunday"
                      label="Sunday"
                    />

                    <Checkbox
                      onChange={handleChange}
                      value={values.workoutOnMonday}
                      name="workoutOnMonday"
                      label="Monday"
                    />
                    <Checkbox
                      onChange={handleChange}
                      value={values.workoutOnTuesday}
                      name="workoutOnTuesday"
                      label="Tuesday"
                    />
                    <Checkbox
                      onChange={handleChange}
                      value={values.workoutOnWednesday}
                      name="workoutOnWednesday"
                      label="Wednesday"
                    />
                    <Checkbox
                      onChange={handleChange}
                      value={values.workoutOnThursday}
                      name="workoutOnThursday"
                      label="Thursday"
                    />
                    <Checkbox
                      onChange={handleChange}
                      value={values.workoutOnFriday}
                      name="workoutOnFriday"
                      label="Friday"
                    />
                    <Checkbox
                      onChange={handleChange}
                      value={values.workoutOnSaturday}
                      name="workoutOnSaturday"
                      label="Saturday"
                    />
                  </GridCell>
                </Grid>

                <div
                  className={`banner text-center${
                    this.state.isSaved ? ' banner-open' : ''
                  }`}
                >
                  <Typography use="body1" theme="onPrimary">
                    Saved! Now continue to{' '}
                    <Link href="/recipes">
                      <a className="link">Recipes</a>
                    </Link>{' '}
                    or{' '}
                    <Link href="/plan">
                      <a className="link">Meal Plan</a>
                    </Link>
                  </Typography>
                </div>
                <footer className="flex justify-end mt-4 mb-8">
                  <Button onClick={handleReset}>reset</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    save
                  </Button>
                </footer>
                <Typography use="headline5" tag="div" className="mx-4 mt-4">
                  Preview Macros
                </Typography>

                <Grid>
                  <GridCell span="6">
                    <Typography use="overline" tag="div">
                      Rest
                    </Typography>
                    <ListDivider />
                    <Preview {...computeMacros(values)} />
                  </GridCell>
                  <GridCell span="6">
                    <Typography use="overline" tag="div">
                      Workout
                    </Typography>
                    <ListDivider />
                    <Preview {...computeMacros(values, true)} />
                  </GridCell>
                </Grid>

                <ListDivider />
              </Form>

              <style jsx>{`
                .banner {
                  background-color: var(--mdc-theme-secondary);
                  opacity: 0;
                  height: 0;
                  padding: 0;
                  margin: 0;
                }
                .banner-open {
                  transition: all 0.3s ease-in;
                  opacity: 1;
                  height: auto;
                  padding: 1rem;
                }
                .link {
                  color: white;
                }
                .max {
                  max-width: 400px;
                }
              `}</style>
            </div>
          );
        }}
      />
    );
  }
}

export default withCoreContext(Calculator);
