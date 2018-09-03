import React from 'react';
import getIn from 'lodash/get';
import { OrderedSet } from 'immutable';
import uuid from 'uuid/v1';
import snakeCase from 'lodash/snakeCase';
import { Button } from 'rmwc/Button';
import { Card } from 'rmwc/Card';
import { Icon } from 'rmwc/Icon';
import i from 'immutable';
import { List, ListDivider, SimpleListItem } from 'rmwc/List';
import { Typography } from 'rmwc';
import { Snackbar } from 'rmwc/Snackbar';
import { Fab } from 'rmwc/Fab';

import { withCoreContext } from '../CoreContext';
import RecipeForm from './RecipeForm';

import { RECIPES_MINIMUM } from './constants';

class Recipes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Calories: 0,
      Carbs: 0,
      Fat: 0,
      Protein: 0,
      isAdding: false,
      name: '',
      recipesToDelete: OrderedSet([]),
      recipeToEdit: undefined,
      servings: 1,
      snackbarIsOpen: false,
    };
  }

  addRecipe = recipe => {
    const { props } = this;

    this.setState({ isAdding: false }, function addRecipeCallback() {
      props.handleRecipeAdd({
        Calories: parseInt(recipe.Calories, 10),
        Carbs: parseInt(recipe.Carbs, 10),
        Fat: parseInt(recipe.Fat, 10),
        Protein: parseInt(recipe.Protein, 10),
        _key: snakeCase(recipe.name || '').toUpperCase() + uuid(),
        name: recipe.name,
        servings: parseInt(recipe.servings, 10),
      });
    });
  };

  editRecipe = recipe => {
    const { props } = this;

    this.setState({ recipeToEdit: undefined }, function editRecipeCallback() {
      props.handleRecipeEdit({
        Calories: parseInt(recipe.Calories, 10),
        Carbs: parseInt(recipe.Carbs, 10),
        Fat: parseInt(recipe.Fat, 10),
        Protein: parseInt(recipe.Protein, 10),
        _key: recipe._key,
        name: recipe.name,
        servings: parseInt(recipe.servings, 10),
      });
    });
  };

  snackbarOnHide = () => {
    const { props, state } = this;
    if (state.recipesToDelete.size) {
      this.setState(
        { snackbarIsOpen: false, recipesToDelete: OrderedSet([]) },
        function afterSnackbarHide() {
          props.handleRecipeRemove(state.recipesToDelete);
        },
      );
    } else {
      this.setState({ snackbarIsOpen: false });
    }
  };

  removeRecipeIntent = recipeKey => {
    this.setState(prevState => ({
      recipesToDelete: prevState.recipesToDelete.add(recipeKey),
      snackbarIsOpen: true,
    }));
  };

  handleRecipeChange = event => {
    const name = getIn(event, 'target.name');
    const value = getIn(event, 'target.value');
    this.setState({ [name]: value });
  };

  toggleAddRecipe = () => {
    this.setState(prevState => ({ isAdding: !prevState.isAdding }));
  };

  selectRecipeToEdit = key => {
    this.setState({ recipeToEdit: key });
  };

  render() {
    const { state, props } = this;
    const { recipes = i.List() } = props;

    return (
      <Card outlined>
        <Typography use="subtitle1" tag="div" className="p-4">
          Recipes ({recipes.size})
        </Typography>

        <ListDivider />

        <div className="fab flex justify-end pr-4">
          <span className={`addIcon${state.isAdding ? ' rotate' : ''}`}>
            <Fab onClick={this.toggleAddRecipe} icon="add" />
          </span>
        </div>

        <div className={`addingSection${state.isAdding ? ' adding-open' : ''}`}>
          <Typography use="subtitle2" tag="div" className="mx-4 mb-0">
            Enter new recipe information
          </Typography>

          <RecipeForm
            onCancel={() => this.setState({ isAdding: false })}
            onChange={this.handleRecipeChange}
            onSave={this.addRecipe}
          />
          <ListDivider />
        </div>

        <List twoLine dense>
          {recipes
            .filter(function filterOutRecipesToDelete(recipe) {
              return !state.recipesToDelete.includes(recipe._key);
            })
            .map(({ _key, name, Calories, Protein, Carbs, Fat, servings }) => (
              <React.Fragment key={_key}>
                <SimpleListItem
                  onClick={() => this.selectRecipeToEdit(_key)}
                  text={name}
                  secondaryText={`${Calories}cal | Protein ${Protein}g | Carbs ${Carbs}g | Fat ${Fat}g | ${servings} servings`}
                  meta={
                    <Icon
                      icon="delete"
                      onClick={() => this.removeRecipeIntent(_key)}
                    />
                  }
                />
                {_key === state.recipeToEdit && (
                  <RecipeForm
                    recipe={{
                      _key,
                      name,
                      Calories,
                      Protein,
                      Carbs,
                      Fat,
                      servings,
                    }}
                    onCancel={() => this.setState({ recipeToEdit: undefined })}
                    onChange={this.handleRecipeChange}
                    onSave={this.editRecipe}
                  />
                )}
              </React.Fragment>
            ))}
        </List>

        <div>
          {recipes.size < RECIPES_MINIMUM && (
            <React.Fragment>
              <Typography use="body2" tag="div" className="p-4 ">
                Add {RECIPES_MINIMUM - recipes.size} more recipes <br /> or
                import{' '}
                <Button dense onClick={props.handleRecipesImportDemo}>
                  Starter Pack
                </Button>
              </Typography>
              <ListDivider />
            </React.Fragment>
          )}
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
        <style jsx>{`
          .fab {
            margin-top: -2rem;
          }
          .addIcon {
            transition: all 0.3s ease-in-out;
          }
          .rotate {
            transform: rotateZ(45deg);
          }

          .addingSection {
            height: 0;
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
          }
          .adding-open {
            height: auto;
            opacity: 1;
          }
        `}</style>
      </Card>
    );
  }
}

export default withCoreContext(Recipes);
