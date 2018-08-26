import React from 'react';
import getIn from 'lodash/get';
import { OrderedSet } from 'immutable';
import uuid from 'uuid/v1';
import snakeCase from 'lodash/snakeCase';
import upperFirst from 'lodash/upperFirst';
import { Button } from 'rmwc/Button';
import { Card } from 'rmwc/Card';
import { Icon } from 'rmwc/Icon';
import { List, ListDivider, SimpleListItem } from 'rmwc/List';
import { Typography } from 'rmwc';
import { Snackbar } from 'rmwc/Snackbar';
import { Fab } from 'rmwc/Fab';

import RecipeForm from './RecipeForm';

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
      servings: 1,
      snackbarIsOpen: false,
    };
  }

  addRecipe() {
    const { props, state } = this;

    this.setState({ isAdding: false }, function addRecipeCallback() {
      props.onAdd({
        Calories: parseInt(state.Calories, 10),
        Carbs: parseInt(state.Carbs, 10),
        Fat: parseInt(state.Fat, 10),
        Protein: parseInt(state.Protein, 10),
        _key: snakeCase(state.name || '').toUpperCase() + uuid(),
        name: state.name,
        servings: parseInt(state.servings, 10),
      });
    });
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
        <Typography use="subtitle1" tag="div" className="p-4">
          Recipes ({recipes.length})
        </Typography>

        <ListDivider />

        <List twoLine dense>
          {recipes
            .filter(function filterOutRecipesToDelete(recipe) {
              return !state.recipesToDelete.includes(recipe._key);
            })
            .map(({ _key, name, Calories, Protein, Carbs, Fat, servings }) => (
              <SimpleListItem
                key={_key}
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

        <div>
          {recipes.length < props.recipesMinimumCount && (
            <React.Fragment>
              <Typography use="body2" tag="div" className="p-4 ">
                Add {props.recipesMinimumCount - recipes.length} more recipes{' '}
                <br /> or import{' '}
                <Button dense onClick={props.importDemoRecipes}>
                  demo recipes
                </Button>
              </Typography>
              <ListDivider />
            </React.Fragment>
          )}
        </div>

        {state.isAdding && (
          <div>
            <ListDivider />
            <Typography use="subtitle2" tag="div" className="mx-4 mt-4 mb-0">
              Enter new recipe information
            </Typography>

            <RecipeForm
              onCancel={this.toggleAddRecipe}
              onChange={this.handleRecipeChange}
              onSave={this.addRecipe}
            />
            <ListDivider />
          </div>
        )}

        <div className="flex justify-end pr-4 py-4">
          <Fab onClick={this.toggleAddRecipe} icon="add" />
        </div>

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
      </Card>
    );
  }
}

export default Recipes;
