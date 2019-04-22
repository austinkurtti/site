import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo:'about'},
    {path: 'about', loadChildren: '../about/about.module#AboutModule'},
    {path: 'resume', loadChildren: '../resume/resume.module#ResumeModule'},
    {path: 'contact', loadChildren: '../contact/contact.module#ContactModule'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
