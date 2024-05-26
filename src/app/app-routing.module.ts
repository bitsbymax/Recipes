import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' }, //стандартний pathMatch: 'prefix' - не працюватиме для  path: '', бо такий шлях є частиною будь-якого шляху
  {
    path: 'recipes',
    loadChildren: () => import('./components/recipes/recipes.module')
      .then(module => module.RecipesModule)
  }, //loadChildren - спец. властивість яка говорить Ангуляру завантажувати модуль/компонент лише тоді, коли відбувається перехід за адресою в path. Ефект від використання цього методу полягає в тому, що код буде на цьому моменті поділений і все, що знаходиться за вказаним в loadChildren шляхом(модуль і весь вміст в declarations[]) буде складено в окремий бандл який буде завантажений браузером і зпарсений тоді, коли юзер перейде за адресою з path і не раніше
  {
    path: 'shopping-list',
    loadChildren: () => import('./components/shopping-list/shopping-list.module')
      .then(module => module.ShoppingListModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module')
      .then(module => module.AuthModule)
  }
]; //Також для маршрутів які ми оптимізуємо, у разі якщо у них є дочірні маршрути

@NgModule({
  //NgModule трансформує звичайний TypeScript клас в модуль Angular
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })], //в вбудований модуль RouterModule ми передаємо свою конфігурацію шляхів. forRoot() викор. лише раз для вказання кореневих шляхів
  //? PreloadAllModules - говорить ангуляру про те, що потрібно завантажити всі бандли, створені loadChildren, одразу ж при ініціалізації кореневого/початкового модуля. При цьому сам початковий модуль, який теж завантажується як окремий бандл, залишається малим по розміру.
  exports: [RouterModule], //і тут ми цей сконфігурований модуль експортуємо, щоб потім імпортувати і використати в основному модулі AppModule
})
export class AppRoutingModule { } //!Модуль в якому прописані шляхи для компонентів з Lazy Loading
