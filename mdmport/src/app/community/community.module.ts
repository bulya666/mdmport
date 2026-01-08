import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommunityComponent } from './community.component';

@NgModule({
  declarations: [
    CommunityComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CommunityComponent
  ]
})
export class CommunityModule { }