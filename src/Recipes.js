import { Typography } from 'rmwc/Typography';
import { ListDivider } from 'rmwc';

const Recipes = props => {
  return (
    <section>
      <Typography use="overline">
        Recipes
        <ListDivider />
      </Typography>

      {props.recipes.map(
        ({ _key, name, Calories, Protein, Carbs, Fat, type, servings }) => (
          <article key={_key}>
            <Typography use="caption">
              {`${Calories}cal | protein ${Protein}g | Carbs${Carbs}g | Fat${Fat}g | ${type} | ${servings} servings | ${name}`}
            </Typography>
          </article>
        ),
      )}
    </section>
  );
};

export default Recipes;
