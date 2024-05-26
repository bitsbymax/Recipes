import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { Recipe } from '../components/recipes/recipes.model';
import { RecipeBookService } from './recipe-book.service';

@Injectable({ //дає можливість цьому сервісу бути використаним в іншому сервісі
  providedIn: 'root'//ця опція говорить, що цей сервіс буде автоматично додано в головний модуль і тому цей сервіс буде доступний у всього веб застосунку
})
export class DataStorageService {//Сервіс, який відповідає за збереження рецептів на бекенді і їх отримання звідти по запиту
  constructor(
    private http: HttpClient,
    private recipeService: RecipeBookService,
  ) { }

  saveRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://course-project-e0683-default-rtdb.europe-west1.firebasedatabase.app/recipes.json', recipes)
      .subscribe(res => {
        console.log(res);
      }); //Зберігаємо рецепти на бекенді
  }

  loadRecipes() {
    return this.http.get<Recipe[]>('https://course-project-e0683-default-rtdb.europe-west1.firebasedatabase.app/recipes.json')
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return { //для того, щоб зберегти правильну структуру об'єкта рецепту, так як ми можемо створити рецепт без інгредієнтів, і тоді така властивість додана в об'єкт не буде, робимо перевірку на наявність такої властивості. Якщо її немає, додаємо і ставимо як значення []
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        }));
  }//Отримуємо рецепти з бекенду і передаєм в сервіс, де вони зберігаються і розподіляються
}
