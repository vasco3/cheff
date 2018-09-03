import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { TextField } from 'rmwc/TextField';
import { Button } from 'rmwc/Button';

const RECIPE_ATTRIBUTES = [
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
        handleChange,
        handleBlur,
        isSubmitting,
      }) => {
        return (
          <Form>
            <div className="flex flex-wrap p-4">
              {RECIPE_ATTRIBUTES.map(function mapRecipeForm(
                { name, label, defaultValue },
                index,
              ) {
                return (
                  <TextField
                    className="mb-4 mr-4"
                    key={index}
                    name={name}
                    value={values[name]}
                    onBlur={handleBlur}
                    outlined
                    label={label}
                    onChange={handleChange}
                    type={typeof defaultValue === 'string' ? 'text' : 'number'}
                  />
                );
              })}
            </div>
            <footer className="recipeFormFooter pr-4 mb-4">
              <Button className="mr-4" onClick={onCancel}>
                cancel
              </Button>
              <Button type="submit" raised disabled={isSubmitting}>
                add recipe
              </Button>
            </footer>
            <style jsx>{`
              .recipeFormFooter {
                display: flex;
                justify-content: flex-end;
              }
            `}</style>
          </Form>
        );
      }}
    />
  );
};

export default RecipeForm;
