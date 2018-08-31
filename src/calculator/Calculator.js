import React from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { Button } from 'rmwc/Button';
// import { ListDivider } from 'rmwc/List';
import { Select } from 'rmwc';
import { TextField, TextFieldHelperText } from 'rmwc/TextField';
import { Typography } from 'rmwc/Typography';

import { calculateCaloriesTotal, calculateProteinTotal } from './utils';
import { macroOptions, kinobodyProgramModeOptions } from './constants';
import { withCoreContext } from '../CoreContext';
class Calculator extends React.Component {
  state = { isSaved: false };
  render() {
    const { handleCalculatorUpdate, settings = {} } = this.props;
    return (
      <Formik
        initialValues={{
          bodyWeight: settings.bodyWeight || 180,
          bodyWeightIsInLbs: settings.bodyWeightIsInLbs || 'lbs',
          kinobodyProgram: settings.kinobodyProgram || 'GGP',
          kinobodyProgramMode: settings.kinobodyProgramMode || 'LEAN_BULK',
          kinobodyMacroOption:
            settings.kinobodyMacroOption || 'PROTEIN_DEFAULT',
        }}
        validationSchema={yup.object().shape({
          bodyWeight: yup.number().required(),
          bodyWeightIsInLbs: yup.string().required(),
          kinobodyProgram: yup.string().required(),
          kinobodyProgramMode: yup.string().required(),
          kinobodyMacroOption: yup.string().required(),
        })}
        onSubmit={(values, { setSubmitting }) => {
          const CALORIES_TOTAL = calculateCaloriesTotal(values);
          const PROTEIN_TOTAL = calculateProteinTotal(values, CALORIES_TOTAL);

          handleCalculatorUpdate({
            ...values,
            bodyWeight: parseInt(values.bodyWeight),
            CALORIES_TOTAL,
            PROTEIN_TOTAL,
          });
          setSubmitting(false);
          this.setState({ isSaved: true });
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
            <div className="m-4">
              <Typography use="subtitle1" tag="div" className="p-4">
                Set your daily targets to compute your meal plan
              </Typography>
              <Typography use="overline" tag="div" className="px-4">
                Kinobody Calories / Macros (Daily Targets)
              </Typography>
              <Form>
                <Select
                  label="Kinobody Program"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  options={[{ label: 'GGP - Greek God Program', value: 'GGP' }]}
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
                <TextFieldHelperText validationMsg persistent>
                  {errors.bodyWeight}
                </TextFieldHelperText>

                <Select
                  label="units"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  options={['lbs', 'kg']}
                  outlined
                  name="bodyWeightIsInLbs"
                  value={values.bodyWeightIsInLbs}
                />

                <footer className="flex justify-end items-center mr-4">
                  <TextFieldHelperText persistent>
                    {this.state.isSaved && 'Saved'}
                  </TextFieldHelperText>
                  <Button onClick={handleReset}>reset</Button>
                  <Button type="submit" disabled={isSubmitting}>
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
