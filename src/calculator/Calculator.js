import React from 'react';
import Router from 'next/router';

import { Formik, Form } from 'formik';
import * as yup from 'yup';

import { Button } from 'rmwc/Button';
import { Checkbox } from 'rmwc/Checkbox';
import { ListDivider } from 'rmwc/List';
import { Grid, GridCell } from 'rmwc';
import { TextField, TextFieldHelperText } from 'rmwc/TextField';
import { Typography } from 'rmwc/Typography';

import { computeMacros } from './utils';
import { withCoreContext } from '../CoreContext';

import Preview from './Preview';

class Calculator extends React.Component {
  state = { isSaved: false };
  render() {
    const { handleCalculatorSave, settings = {}, recipes } = this.props;
    return (
      <Formik
        initialValues={{
          bodyWeight: settings.bodyWeight,
          calories: settings.calories,
          caloriesExtraForWorkoutDay: settings.caloriesExtraForWorkoutDay,
          fatCaloriesRatio: settings.fatCaloriesRatio,
          proteinGramsPerBodyWeightLb: settings.proteinGramsPerBodyWeightLb,
          workoutOnSunday: settings.workoutOnSunday || false,
          workoutOnMonday: settings.workoutOnMonday || false,
          workoutOnTuesday: settings.workoutOnTuesday || false,
          workoutOnWednesday: settings.workoutOnWednesday || false,
          workoutOnThursday: settings.workoutOnThursday || false,
          workoutOnFriday: settings.workoutOnFriday || false,
        }}
        validationSchema={yup.object().shape({
          bodyWeight: yup.number().required(),
          calories: yup.number().required(),
          caloriesExtraForWorkoutDay: yup.number().required(),
          fatCaloriesRatio: yup.number().required(),
          proteinGramsPerBodyWeightLb: yup.number().required(),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          const macrosRest = computeMacros(values);
          const macrosWorkout = computeMacros(values, true);

          handleCalculatorSave({
            settings: {
              ...values,
              bodyWeight: parseInt(values.bodyWeight, 10),
              calories: parseInt(values.calories, 10),
              caloriesExtraForWorkoutDay: parseInt(
                values.caloriesExtraForWorkoutDay,
                10,
              ),
              fatCaloriesRatio: parseInt(values.fatCaloriesRatio, 10),
              proteinGramsPerBodyWeightLb: parseFloat(
                values.proteinGramsPerBodyWeightLb,
                10,
              ),
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
                    <div className="mb-4">
                      <Typography use="overline" tag="div">
                        Calories / Macros
                      </Typography>
                      <ListDivider />
                    </div>
                  </GridCell>
                  <GridCell span="4">
                    <TextField
                      className="mb-4 mr-4"
                      label="Total Calories"
                      name="calories"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      outlined
                      defaultValue={values.calories}
                    />
                    {errors.calories && (
                      <TextFieldHelperText validationMsg persistent>
                        {errors.calories}
                      </TextFieldHelperText>
                    )}
                  </GridCell>
                  <GridCell span="4">
                    <TextField
                      className="mb-4 mr-4"
                      label="Workoutday Extra Calories"
                      name="caloriesExtraForWorkoutDay"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      outlined
                      defaultValue={values.caloriesExtraForWorkoutDay}
                    />
                    {errors.caloriesExtraForWorkoutDay && (
                      <TextFieldHelperText validationMsg persistent>
                        {errors.caloriesExtraForWorkoutDay}
                      </TextFieldHelperText>
                    )}
                  </GridCell>
                  <GridCell span="4">
                    <TextField
                      className="mb-4 mr-4"
                      label="Body weight (lbs)"
                      name="bodyWeight"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      outlined
                      defaultValue={values.bodyWeight}
                    />
                    {errors.bodyWeight && (
                      <TextFieldHelperText validationMsg persistent>
                        {errors.bodyWeight}
                      </TextFieldHelperText>
                    )}
                  </GridCell>
                  <GridCell span="4">
                    <TextField
                      className="mb-4 mr-4"
                      label="Fat % from calories"
                      name="fatCaloriesRatio"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      outlined
                      defaultValue={values.fatCaloriesRatio}
                    />
                    {errors.fatCaloriesRatio && (
                      <TextFieldHelperText validationMsg persistent>
                        {errors.fatCaloriesRatio}
                      </TextFieldHelperText>
                    )}
                  </GridCell>
                  <GridCell span="4">
                    <TextField
                      className="mb-4 mr-4"
                      label="Protein (g) per Body (lb)"
                      name="proteinGramsPerBodyWeightLb"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      outlined
                      defaultValue={values.proteinGramsPerBodyWeightLb}
                    />
                    {errors.proteinGramsPerBodyWeightLb && (
                      <TextFieldHelperText validationMsg persistent>
                        {errors.proteinGramsPerBodyWeightLb}
                      </TextFieldHelperText>
                    )}
                  </GridCell>
                </Grid>

                <Typography use="overline" tag="div" className="mx-4 mt-4">
                  Preview Macros
                </Typography>

                <ListDivider />

                <div className="m-4">
                  <Preview
                    rest={computeMacros(values)}
                    workout={computeMacros(values, true)}
                    bodyLbs={values.bodyWeight}
                  />
                </div>

                <ListDivider />

                <footer className="flex justify-end mt-8 mb-8 pr-4">
                  <Button type="reset" className="mr-4" onClick={handleReset}>
                    reset
                  </Button>
                  <Button type="submit" raised disabled={isSubmitting}>
                    save
                  </Button>
                </footer>
              </Form>
            </div>
          );
        }}
      />
    );
  }
}

export default withCoreContext(Calculator);
