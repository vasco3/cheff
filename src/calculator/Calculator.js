import React from 'react';
import Link from 'next/link';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { Button } from 'rmwc/Button';
import { Checkbox } from 'rmwc/Checkbox';
import { ListDivider } from 'rmwc/List';
import { Select } from 'rmwc';
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
          workoutOnSunday: settings.workoutOnSunday,
          workoutOnMonday: settings.workoutOnMonday,
          workoutOnTuesday: settings.workoutOnTuesday,
          workoutOnWednesday: settings.workoutOnWednesday,
          workoutOnThursday: settings.workoutOnThursday,
          workoutOnFriday: settings.workoutOnFriday,
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
              <Typography use="overline" tag="div" className="px-4">
                Kinobody Calories / Macros
              </Typography>
              <ListDivider />
              <Form>
                <div className="form max m-4">
                  <Select
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
                    label="Program Mode"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    options={kinobodyProgramModeOptions}
                    outlined
                    name="kinobodyProgramMode"
                    value={values.kinobodyProgramMode}
                  />
                  <Select
                    label="Macro Options"
                    name="kinobodyMacroOption"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    options={macroOptions}
                    outlined
                    value={values.kinobodyMacroOption}
                  />
                  <TextField
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
                    label="units"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    options={['lbs', 'kg']}
                    outlined
                    name="bodyWeightIsInLbs"
                    value={values.bodyWeightIsInLbs}
                  />
                </div>

                <Typography use="overline" tag="div" className="mx-4">
                  Workout days
                </Typography>
                <ListDivider />
                <Checkbox
                  onBlur={handleBlur}
                  onChange={handleChange}
                  checked={!!values.workoutOnSunday}
                  name="workoutOnSunday"
                >
                  Sunday
                </Checkbox>

                <Checkbox
                  onBlur={handleBlur}
                  onChange={handleChange}
                  checked={!!values.workoutOnMonday}
                  name="workoutOnMonday"
                >
                  Monday
                </Checkbox>
                <Checkbox
                  onBlur={handleBlur}
                  onChange={handleChange}
                  checked={!!values.workoutOnTuesday}
                  name="workoutOnTuesday"
                >
                  Tuesday
                </Checkbox>
                <Checkbox
                  onBlur={handleBlur}
                  onChange={handleChange}
                  checked={!!values.workoutOnWednesday}
                  name="workoutOnWednesday"
                >
                  Wednesday
                </Checkbox>
                <Checkbox
                  onBlur={handleBlur}
                  onChange={handleChange}
                  checked={!!values.workoutOnThursday}
                  name="workoutOnThursday"
                >
                  Thursday
                </Checkbox>
                <Checkbox
                  onBlur={handleBlur}
                  onChange={handleChange}
                  checked={!!values.workoutOnFriday}
                  name="workoutOnFriday"
                >
                  Friday
                </Checkbox>
                <Checkbox
                  onBlur={handleBlur}
                  onChange={handleChange}
                  checked={!!values.workoutOnSaturday}
                  name="workoutOnSaturday"
                >
                  Saturday
                </Checkbox>

                <Typography use="overline" tag="div" className="mx-4">
                  Preview
                </Typography>
                <ListDivider />

                <Typography use="headline6" tag="div" className="mx-4">
                  Macros Rest
                </Typography>
                <Preview {...computeMacros(values)} />

                <Typography use="headline6" tag="div" className="mx-4">
                  Macros Workout
                </Typography>
                <Preview {...computeMacros(values, true)} />

                <ListDivider />

                <footer className="flex max justify-end mt-4 mb-8">
                  <Button onClick={handleReset}>reset</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    save
                  </Button>
                </footer>
                {this.state.isSaved && (
                  <Typography use="headline6" tag="div">
                    Saved! Now continue to <Link href="/recipes">Recipes</Link>{' '}
                    or <Link href="/plan">Meal Plan</Link>
                  </Typography>
                )}
              </Form>
              <style jsx>{`
                .form {
                  display: grid;
                  grid-template-columns: 1fr;
                  grid-gap: 1rem;
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
