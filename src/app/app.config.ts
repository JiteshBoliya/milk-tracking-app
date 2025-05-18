import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { routes } from './app.routes';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyDbstpDDbMQuIxCbiwmQZtFR4jMhVbh6Mc",
  authDomain: "milkcollectiondb.firebaseapp.com",
  projectId: "milkcollectiondb",
  storageBucket: "milkcollectiondb.firebasestorage.app",
  messagingSenderId: "955290780775",
  appId: "1:955290780775:web:9173ecc939fa35424080c2",
  measurementId: "G-5VZC14TKYR"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    ReactiveFormsModule
  ]
};
