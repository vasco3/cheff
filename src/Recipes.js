import React from 'react';
import getIn from 'lodash/get';
import { OrderedSet } from 'immutable';
import uuid from 'uuid/v1';
import snakeCase from 'lodash/snakeCase';
import upperFirst from 'lodash/upperFirst';
import { Button } from 'rmwc/Button';
import { Card, CardAction, CardActions } from 'rmwc/Card';
import { Icon } from 'rmwc/Icon';
import { List, ListDivider, SimpleListItem } from 'rmwc/List';
import { TextField } from 'rmwc/TextField';
import { Typography } from 'rmwc';
import { Snackbar } from 'rmwc/Snackbar';

class Recipes extends React.Component {
  constructor(props) {
    super(props);
    this.addRecipe = this.addRecipe.bind(this);
    this.removeRecipeIntent = this.removeRecipeIntent.bind(this);
    this.handleRecipeChange = this.handleRecipeChange.bind(this);
    this.snackbarOnHide = this.snackbarOnHide.bind(this);
    this.toggleAddRecipe = this.toggleAddRecipe.bind(this);

    this.state = {
      Calories: 0,
      Carbs: 0,
      Fat: 0,
      Protein: 0,
      isAdding: false,
      name: '',
      recipesToDelete: OrderedSet([]),
      servings: 0,
      snackbarIsOpen: false,
    };
  }

  addRecipe() {
    const { name, Calories, Protein, Carbs, Fat, servings } = this.state;
    this.setState({ isAdding: false }, () =>
      this.props.onAdd({
        Calories: parseInt(Calories, 10),
        Carbs: parseInt(Carbs, 10),
        Fat: parseInt(Fat, 10),
        Protein: parseInt(Protein, 10),
        _key: snakeCase(name || '').toUpperCase() + uuid(),
        name,
        servings: parseInt(servings, 10),
      }),
    );
  }

  snackbarOnHide() {
    const { props, state } = this;
    if (state.recipesToDelete.size) {
      this.setState(
        { snackbarIsOpen: false, recipesToDelete: OrderedSet([]) },
        function afterSnackbarHide() {
          props.onRemove(state.recipesToDelete);
        },
      );
    } else {
      this.setState({ snackbarIsOpen: false });
    }
  }

  removeRecipeIntent(recipeKey) {
    this.setState(prevState => ({
      recipesToDelete: prevState.recipesToDelete.add(recipeKey),
      snackbarIsOpen: true,
    }));
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
              {['name', 'Calories', 'Protein', 'Carbs', 'Fat', 'servings'].map(
                (attribute, index) => (
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
                        ...(attribute === 'name'
                          ? { gridColumn: '1 / 4' }
                          : {}),
                      },
                    }}
                  />
                ),
              )}
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
            <React.Fragment>
              <Typography use="body2" tag="div" className="p-4 ">
                Add {props.recipesMinimumCount - recipes.length} more recipes or
                import{' '}
                <Button dense onClick={props.importDemoRecipes}>
                  demo recipes
                </Button>
              </Typography>
              <ListDivider />
            </React.Fragment>
          )}
          {recipes
            .filter(function filterOutRecipesToDelete(recipe) {
              return !state.recipesToDelete.includes(recipe._key);
            })
            .map(({ _key, name, Calories, Protein, Carbs, Fat, servings }) => (
              <SimpleListItem
                key={_key}
                graphic="restaurant"
                text={name}
                secondaryText={`${Calories}cal | Protein ${Protein}g | Carbs ${Carbs}g | Fat ${Fat}g | ${servings} servings`}
                meta={
                  <Icon
                    use="delete"
                    onClick={() => this.removeRecipeIntent(_key)}
                  />
                }
              />
            ))}
        </List>
        <Snackbar
          actionHandler={() =>
            this.setState({
              recipesToDelete: OrderedSet([]),
              snackbarIsOpen: false,
            })
          }
          actionText="Undo"
          alignStart
          message="Deleted recipe"
          onHide={this.snackbarOnHide}
          show={state.snackbarIsOpen}
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
