import React from 'react';
import getIn from 'lodash/get';
import snakeCase from 'lodash/snakeCase';
import upperFirst from 'lodash/upperFirst';
import { Button } from 'rmwc/Button';
import { Card, CardAction, CardActions } from 'rmwc/Card';
import { Icon } from 'rmwc/Icon';
import { ListDivider } from 'rmwc/List';
import { List, SimpleListItem } from 'rmwc/List';
import { TextField } from 'rmwc/TextField';
import { Typography } from 'rmwc';
import { Snackbar } from 'rmwc/Snackbar';

class Recipes extends React.Component {
  state = {
    Calories: 0,
    Carbs: 0,
    Fat: 0,
    Protein: 0,
    isAdding: false,
    snackbarIsOpen: false,
    name: '',
    servings: 0,
    type: 'Meal',
  };

  constructor(props) {
    super(props);
    this.addRecipe = this.addRecipe.bind(this);
    this.removeRecipe = this.removeRecipe.bind(this);
    this.handleRecipeChange = this.handleRecipeChange.bind(this);
    this.toggleAddRecipe = this.toggleAddRecipe.bind(this);
  }

  addRecipe() {
    const { name, Calories, Protein, Carbs, Fat, type, servings } = this.state;
    this.setState({ isAdding: false }, () =>
      this.props.onAdd({
        Calories: parseInt(Calories, 10),
        Carbs: parseInt(Carbs, 10),
        Fat: parseInt(Fat, 10),
        Protein: parseInt(Protein, 10),
        _key: snakeCase(name || '').toUpperCase(),
        name,
        servings: parseInt(servings, 10),
        type,
      }),
    );
  }

  removeRecipe(recipeIndex) {
    this.setState({
      recipeIndexHidden: recipeIndex,
      snackbarIsOpen: true,
      snackbarOnHide() {
        this.props.onRemove(recipeIndex);
      },
    });
  }

  handleRecipeChange(event) {
    const name = getIn(event, 'target.name');
    const value = getIn(event, 'target.value');
    this.setState({ [name]: value });
  }

  toggleAddRecipe() {
    this.setState(prevState => ({ isAdding: !prevState.isAdding }));
  }

  render() {
    const { state, props } = this;
    const { recipes } = props;
    return (
      <Card outlined>
        <CardActions fullBleed>
          <CardAction onClick={this.toggleAddRecipe}>
            Recipes ({recipes.length})
            <span
              className={
                state.isAdding || props.hasEnoughRecipes ? '' : 'add-icon'
              }
            >
              <Icon use="add" />
            </span>
          </CardAction>
        </CardActions>
        <ListDivider />
        {state.isAdding && (
          <React.Fragment>
            <Typography use="subtitle2" tag="div" className="mx-4 mt-4 mb-0">
              Enter new recipe information
            </Typography>
            <div className="recipeForm">
              {[
                'name',
                'type',
                'Calories',
                'Protein',
                'Carbs',
                'Fat',
                'servings',
              ].map((attribute, index) => (
                <TextField
                  key={index}
                  name={attribute}
                  defaultValue={state[attribute]}
                  outlined
                  label={upperFirst(attribute)}
                  onChange={this.handleRecipeChange}
                  type={
                    typeof state[attribute] === 'string' ? 'text' : 'number'
                  }
                  rootProps={{
                    style: {
                      ...(attribute === 'name' ? { gridColumn: '1 / 4' } : {}),
                    },
                  }}
                />
              ))}
              <footer className="recipeFormFooter">
                <Button onClick={this.toggleAddRecipe}>cancel</Button>
                <Button onClick={this.addRecipe}>add recipe</Button>
              </footer>
            </div>
            <ListDivider />
          </React.Fragment>
        )}
        <List twoLine dense>
          {recipes.length < props.recipesMinimumCount && (
            <Typography use="body2" tag="div" className="p-4 ">
              Add {props.recipesMinimumCount - recipes.length} more recipes or
              import{' '}
              <Button dense onClick={props.importDemoRecipes}>
                demo recipes
              </Button>
            </Typography>
          )}
          {recipes
            .filter((recipe, index) => index !== state.recipeIndexHidden)
            .map(
              (
                { _key, name, Calories, Protein, Carbs, Fat, type, servings },
                index,
              ) => (
                <SimpleListItem
                  key={_key}
                  graphic="restaurant"
                  text={`${name} (${type.toLowerCase()})`}
                  secondaryText={`${Calories}cal | Protein ${Protein}g | Carbs ${Carbs}g | Fat ${Fat}g | ${servings} servings`}
                  meta={
                    <Icon
                      use="delete"
                      onClick={() => this.removeRecipe(index)}
                    />
                  }
                />
              ),
            )}
        </List>
        <Snackbar
          actionHandler={() =>
            this.setState({
              recipeIndexHidden: undefined,
              snackbarIsOpen: false,
              snackbarOnHide() {},
            })
          }
          actionText="Undo"
          alignStart
          message="Deleted recipe"
          onHide={() =>
            this.setState({ snackbarIsOpen: false }, this.state.snackbarOnHide)
          }
          show={this.state.snackbarIsOpen}
          timeout={5000}
        />
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
          @keyframes bounce {
            from {
              transform: scale(1);
            }
            to {
              transform: scale(1.2);
            }
          }
          .add-icon {
            animation-direction: alternate;
            animation-duration: 1s;
            animation-iteration-count: infinite;
            animation-name: bounce;
            animation-timing-function: cubic-bezier(0.3, 0.51, 0, 1.38);
          }
        `}</style>
      </Card>
    );
  }
}

export default Recipes;
