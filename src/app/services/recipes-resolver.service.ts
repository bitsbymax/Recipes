import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Recipe } from '../components/recipes/recipes.model';
import { DataStorageService } from './data-storage.service';
import { RecipeBookService } from './recipe-book.service';

@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]> {// Цей резолвер нам потрібен для того, щоб при відкритті, наприклад, деталей рецепта і після перезавантаження сторінки, у нас не відображався порожній компонент. Резолвер буде викликатися перед переходом за адресою, до якої він застсований і виконувати відповідний код  
  constructor(
    private storageService: DataStorageService,
    private recipeService: RecipeBookService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const recipes = this.recipeService.getRecipes();
    if (recipes.length === 0) { //Робимо перевірку для того, аби при редагуванні рецепту і перезавантаженні сторінки у нас зберігались зміни рецепту
      return this.storageService.loadRecipes();
    } else return recipes;
  }
}
