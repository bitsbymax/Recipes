import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { Ingredient } from '../../../shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;

  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private shoppingService: ShoppingListService) {}

  ngOnInit(): void {
    this.subscription = this.shoppingService.startedEditing.subscribe(
      //підписуємось на Subject startedEditing, куди приходить індекс айтема, який ми передаємо в shopping-list компоненті
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.shoppingService.getIngredient(
          this.editedItemIndex
        ); //беремо по індексу інгредієнт з масива інгредієнтів
        this.slForm.setValue({
          // сетимо відповідні значення в поля форми
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      }
    );
  }

  onAddItem(form: NgForm) {
    //метод на сабміт форми

    const value = form.value; //сюди попаде об'єкт зі значеннями полів, які ми ввели і засабмітили
    //{name: 'Bread', amount: 5}
    const newIngredient = new Ingredient(value.name, value.amount); //створюємо новий інгредієнт
    if (this.editMode) {
      //перезаписуємо інгредієнт по індексу, якщо ми в режимі редагування
      this.shoppingService.updateIngredient(
        this.editedItemIndex,
        newIngredient
      );
    } else {
      //інакше додаємо новий
      this.shoppingService.addIngredient(newIngredient);
    }
    this.editMode = false;

    form.reset();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
