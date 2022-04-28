import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgcComponent } from './components/ngc/ngc.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', pathMatch: 'full', component: NgcComponent },
      { path: ':month/:year', component: NgcComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgcRoutingModule {}
