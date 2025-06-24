import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StepperFormComponent } from './components/esco/stepper-form/stepper-form.component';


const routes: Routes = [
  { path: '', component: StepperFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
