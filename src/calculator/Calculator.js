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
              <Typography use="overline" tag="div" className="px-4">
                Kinobody Calories / Macros
              </Typography>
              <ListDivider />
              <Form>
                <div className="max m-4">
                  <Select
                    className="mb-4 mr-4"
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
                </div>

                <Typography use="overline" tag="div" className="mx-4">
                  Workout days
                </Typography>
                <ListDivider />

                <div className="max">
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
                </div>

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
