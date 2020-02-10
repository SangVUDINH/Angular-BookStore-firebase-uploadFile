import { Component } from '@angular/core';
import * as firebase from 'firebase';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Angular-Book-OCR';

  constructor() {
    var firebaseConfig = {
      apiKey: "AIzaSyAnwpTicCrjZuclmG6ircwMyRGbKYWaVAY",
      authDomain: "books-c8166.firebaseapp.com",
      databaseURL: "https://books-c8166.firebaseio.com",
      projectId: "books-c8166",
      storageBucket: "books-c8166.appspot.com",
      messagingSenderId: "954812934916",
      appId: "1:954812934916:web:1c945af245f139cbda7e51"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig)
  }
}
