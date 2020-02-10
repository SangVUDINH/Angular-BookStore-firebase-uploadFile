import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
// subject est un observable peut etre observer par plusieur observeurs.
import { Book } from'../models/Book.model';
import * as firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  // un tableau qui est rempli depuis firebase
  books: Book[]=[];
  booksSubject = new Subject<Book[]>();

  constructor() { }

  emitBook() {
    this.booksSubject.next(this.books);
  }

  //add Book
  saveBooks() {
    console.log(this.books);
    firebase.database().ref('/books').set(this.books);
  }

  getBooks(){
    firebase.database().ref('/books').on('value', (data:DataSnapshot)=>{
      this.books= data.val() ? data.val():[]
      }
    );
  }

  getSingleBook(id:number){
    return new Promise(
      (resolve,reject) => {
        firebase.database().ref('/books/'+ id).once('value').then(
          (data:DataSnapshot)=> {
            resolve(data.val());
          },(error) => {
            reject(error);
          }
        )
      }
    );
  }

  createBook(newBook:Book) {
    this.books.push(newBook);
    this.saveBooks();
    this.emitBook();
  }

  removeBook(book:Book){
    if(book.photo){
      const storageRef = firebase.storage().refFromURL(book.photo);
      storageRef.delete().then(
        ()=>{
          console.log('photo removed !');
        },
        (error)=>{
          console.log(error);
        }
      );
    }

    const bookIndexToRemove = this.books.findIndex(
      (BookEl)=>{
        if(BookEl === book){
          return true;
        }
      }
    );
    this.books.splice(bookIndexToRemove,1);
    this.saveBooks();
    this.emitBook();
  }

  uploadFile(file:File){
    return new Promise(
      (resolve,reject)=>{
        const almostUniqueFileName = Date.now().toString();
        const upload= firebase.storage().ref()
          .child('images/' + almostUniqueFileName + file.name).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          ()=> {
            console.log('Chargement...');
          },
          (error)=>{
            console.log('Erreur de chargement ! :'+ error);
            reject();
          },
          () => {
            resolve(upload.snapshot.ref.getDownloadURL());
          }
        );
      }
    );
  }
}
