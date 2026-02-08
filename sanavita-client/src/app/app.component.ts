import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sanavita-client';
  constructor(private translate: TranslateService) {
    const savedLanguage = localStorage.getItem('language') || 'ua';
    this.translate.setDefaultLang(savedLanguage);
    this.translate.use(savedLanguage); 
  }
}
