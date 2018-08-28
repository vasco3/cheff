import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { TextField } from 'rmwc/TextField';
import { Button } from 'rmwc/Button';

const recipeAttributes = [
  { name: 'name', label: 'Recipe name', defaultValue: 'New Recipe' },
  { name: 'Calories', label: 'Calories', defaultValue: 1 },
  { name: 'Protein', label: 'Protein (g)', defaultValue: 1 },
  { name: 'Carbs', label: 'Carbs (g)', defaultValue: 1 },
  { name: 'Fat', label: 'Fat (g)', defaultValue: 1 },
  { name: 'servings', label: 'Servings per recipe', defaultValue: 1 },
];

const RecipeForm = ({ recipe = {}, onCancel, onSave }) => {
  return (
    <Formik
      initialValues={{
        _key: recipe._key,
        name: recipe.name || 'New Recipe',
        Calories: recipe.Calories || 100,
        Protein: recipe.Protein || 20,
        Carbs: recipe.Carbs || 30,
        Fat: recipe.Fat || 8,
        servings: recipe.servings || 1,
      }}
      validationSchema={yup.object().shape({
        _key: yup.string(),
        name: yup.string().required(),
        Calories: yup.number().required(),
        Protein: yup.number().required(),
        Carbs: yup.number().required(),
        Fat: yup.number().required(),
        servings: yup.number().required(),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        await onSave(values);
        setSubmitting(false);
      }}
      render={({
        values,
        // errors,
        // touched,
        handleChange,
        handleBlur,
        isSubmitting,
      }) => {
        return (
          <Form className="recipeForm">
            {recipeAttributes.map(function mapRecipeForm(
              { name, label, defaultValue },
              index,
            ) {
              return (
                <TextField
                  key={index}
                  name={name}
                  value={values[name]}
                  onBlur={handleBlur}
                  outlined
                  label={label}
                  onChange={handleChange}
                  type={typeof defaultValue === 'string' ? 'text' : 'number'}
                  rootProps={{
                    style: {
                      ...(name === 'name' ? { gridColumn: '1 / 4' } : {}),
                    },
                  }}
                />
              );
            })}
            <footer className="recipeFormFooter">
              <Button onClick={onCancel}>cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                save recipe
              </Button>
            </footer>
            <style jsx>{`
              .recipeForm {
                padding: 0 1rem 1rem;
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                grid-column-gap: 1rem;
              }
              .recipeFormFooter {
                display: flex;
                justify-content: flex-end;
                grid-column: 1 / 4;
              }
            `}</style>
          </Form>
        );
      }}
    />
  );
};

export default RecipeForm;
