import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeBookService } from 'src/app/services/recipe-book.service';
import { Recipe } from '../recipes.model';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
})
export class RecipeDetailsComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private recipeService: RecipeBookService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.recipe = this.recipeService.getRecipe(this.id);
    });
  }

  onAddToShoppingList() {
    this.recipeService.addIngredientsToSL(this.recipe.ingredients);
  }
  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }
  onEditRecipe() {
    // this.router.navigate(['edit'], { relativeTo: this.route });
    this.router.navigate(['../', this.id, 'edit'], { relativeTo: this.route }); //можна використовувати обидва варіанта, 2 варіант складніший, доданий для прикладу того, як можна побудувати маршрут
  }
}
