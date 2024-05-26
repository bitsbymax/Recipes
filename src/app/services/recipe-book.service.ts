import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Recipe } from '../components/recipes/recipes.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeBookService {
  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe('Recipe 1', 'Some desc', '../../../assets/RecipeBook.svg', [
  //     new Ingredient('Meat', 1),
  //   ]),
  //   new Recipe('Recipe 2', 'Some desc', '../../../assets/RecipeBook.svg', [
  //     new Ingredient('Potato', 1),
  //     new Ingredient('Meat', 4),
  //   ]),
  //   new Recipe('Recipe 3', 'Some desc', '../../../assets/RecipeBook.svg', [
  //     new Ingredient('Tomato', 3),
  //   ]),
  //   new Recipe('Recipe 4', 'Some desc', '../../../assets/RecipeBook.svg', [
  //     new Ingredient('Cucumber', 2),
  //   ]),
  // ];
  private recipes: Recipe[] = [];
  constructor(private shoppingService: ShoppingListService) { }

  getRecipe = (id: number) => this.recipes[id];

  getRecipes = () => [...this.recipes];

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next([...this.recipes]);
  }

  addIngredientsToSL(ingredients: Ingredient[]) {
    this.shoppingService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next([...this.recipes]);
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next([...this.recipes]);
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next([...this.recipes]);
  }

  deleteAllRecipe() {
    this.recipes = [];
    this.recipesChanged.next([...this.recipes]);
  }
}
