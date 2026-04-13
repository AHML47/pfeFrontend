import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
//                                                 👆 sans '.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar
    
  ],
  templateUrl: './app.html'
})
export class App { }