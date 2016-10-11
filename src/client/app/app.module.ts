import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [BrowserModule,FormsModule],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],
  bootstrap: [AppComponent]

})

export class AppModule { }
