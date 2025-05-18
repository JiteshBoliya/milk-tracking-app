import { Routes } from '@angular/router';
import { DeliveryFormComponent } from './delivery-form/delivery-form.component';
import { DeliveryListComponent } from './delivery-list/delivery-list.component';

export const DELIVERIES_ROUTES: Routes = [
  {
    path: '',
    component: DeliveryListComponent
  },
  {
    path: 'new',
    component: DeliveryFormComponent
  },
  {
    path: ':id/edit',
    component: DeliveryFormComponent
  }
]; 