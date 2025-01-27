import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../../recipes.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.scss'],
})
export class RecipeItemComponent implements OnInit {
  @Input() recipe: Recipe;
  @Input() index: number; //ми беремо індекс елемента масива як його ID, який передаємо в маршрут

  ngOnInit() {
    
  }
}
