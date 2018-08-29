import React from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { Button } from 'rmwc/Button';
import { ListDivider } from 'rmwc/List';
import { TextField } from 'rmwc/TextField';
import { Typography } from 'rmwc/Typography';

import { withCoreContext } from '../CoreContext';

class Calculator extends React.Component {
  state = { isSaved: false };
  render() {
    const {
      handleCalculatorUpdate,
      CALORIES_TOTAL,
      PROTEIN_TOTAL,
    } = this.props;
    return (
      <Formik
        initialValues={{
          CALORIES_TOTAL,
          PROTEIN_TOTAL,
        }}
        validationSchema={yup.object().shape({
          CALORIES_TOTAL: yup.number().required(),
          PROTEIN_TOTAL: yup.number().required(),
        })}
        onSubmit={(values, { setSubmitting }) => {
          handleCalculatorUpdate({
            CALORIES_TOTAL: parseFloat(values.CALORIES_TOTAL, 10),
            PROTEIN_TOTAL: parseFloat(values.PROTEIN_TOTAL, 10),
          });
          setSubmitting(false);
          this.setState({ isSaved: true });
        }}
        render={({
          values,
          // errors,
          // touched,
          handleBlur,
          handleChange,
          handleReset,
          isSubmitting,
        }) => {
          return (
            <Form>
              <Typography use="subtitle1" tag="div" className="p-4">
                Set your daily targets to compute your meal plan
              </Typography>
              <Typography use="overline" tag="div" className="px-4">
                Daily targets
              </Typography>

              <ListDivider />

              <TextField
                name="CALORIES_TOTAL"
                value={values.CALORIES_TOTAL}
                outlined
                label="Total Calories per day"
                onChange={handleChange}
                onBlur={handleBlur}
                className="mx-4"
              />
              <TextField
                name="PROTEIN_TOTAL"
                value={values.PROTEIN_TOTAL}
                outlined
                label="Total Protein (g) per day"
                onChange={handleChange}
                onBlur={handleBlur}
                className="mx-4"
              />
              <footer className="flex justify-end mr-4">
                <Button onClick={handleReset}>reset</Button>
                <Button type="submit" disabled={isSubmitting}>
                  save
                </Button>
              </footer>
            </Form>
          );
        }}
      />
    );
  }
}

export default withCoreContext(Calculator);
