import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();
  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Bananas', 3),
  ];
  constructor() {}

  getIngredients = () => [...this.ingredients];

  getIngredient = (index: number) => this.ingredients[index];

  addIngredient = (ingredient: Ingredient) => {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next([...this.ingredients]); // цей метод next() дає модливість всім підписникам через Subject дізнатися про те, що масив інгредієнтів було оновлено
  };
  addIngredients(ingredients: Ingredient[]) {
    console.log(ingredients)
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next([...this.ingredients]);
  }
  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient; //записуємо новий об'єкт в масив
    this.ingredientsChanged.next([...this.ingredients]);
  }
  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next([...this.ingredients]);
  }
}
