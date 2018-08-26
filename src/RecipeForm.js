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

const RecipeForm = ({ item = {}, onCancel, onChange, onSave }) => {
  return (
    <div className="recipeForm">
      {recipeAttributes.map(function mapRecipeForm(
        { name, label, defaultValue },
        index,
      ) {
        return (
          <TextField
            key={index}
            name={name}
            defaultValue={item[name] || defaultValue}
            outlined
            label={label}
            onChange={onChange}
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
        <Button onClick={onSave}>add recipe</Button>
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
    </div>
  );
};

export default RecipeForm;
