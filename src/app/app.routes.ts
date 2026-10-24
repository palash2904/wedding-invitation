import { Routes } from '@angular/router';
import { InvitationComponent } from './components/invitation/invitation.component';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
  {
    path: '',
    component: InvitationComponent,
    title: 'Palash & Sonam — Royal Wedding Invitation'
  },
  {
    path: 'admin',
    component: AdminComponent,
    title: 'Admin Portal — Wedding Invitation Manager'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
