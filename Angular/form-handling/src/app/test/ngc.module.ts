import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgcRoutingModule } from './ngc-routing.module';
import { NgcComponent } from './components/ngc/ngc.component';

@NgModule({
  declarations: [NgcComponent],
  imports: [CommonModule, NgcRoutingModule],
})
export class NgcModule {}
