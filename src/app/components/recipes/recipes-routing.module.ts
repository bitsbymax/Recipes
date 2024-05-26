import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/auth/auth.guard";
import { RecipesResolverService } from "src/app/services/recipes-resolver.service";
import { RecipeDetailsComponent } from "./recipe-details/recipe-details.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipesComponent } from "./recipes.component";

const routes: Routes = [
  {
    path: '',
    component: RecipesComponent,
    canActivate: [AuthGuard],
    children: [//потрібно пам'ятати, що порядок {path} важливий, динамічні параметри повинні бути в кінці масиву, щоб шлях правильно парсився
      {
        path: '',
        component: RecipeStartComponent
      },
      {
        path: 'new',
        component: RecipeEditComponent
      },
      {
        path: ':id',
        component: RecipeDetailsComponent,
        resolve: [RecipesResolverService]
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
        resolve: [RecipesResolverService]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)], //forChild() викор для модулів, які ми потім будемо імпортувати в основний модуль
  exports: [RouterModule]
})
export class RecipesRoutingModule { }