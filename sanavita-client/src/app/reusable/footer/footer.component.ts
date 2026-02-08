import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css'
})
export class FooterComponent {
    constructor(private router: Router) {

    }

    scrollToSection(fragment: string) {
        if (this.router.url.startsWith('/home')) {
            document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth' });
        } else {
            this.router.navigate(['/home']).then(() => {
                setTimeout(() => {
                    document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            });
        }
    }
}