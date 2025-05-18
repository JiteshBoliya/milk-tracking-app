import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from '@angular/fire/firestore';
import { Client } from '../models/client.model';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(private firestore: Firestore) {}

  async addClient(client: Omit<Client, 'id'>): Promise<string> {
    const clientRef = collection(this.firestore, 'clients');
    const docRef = await addDoc(clientRef, {
      ...client,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  }

  async updateClient(id: string, client: Partial<Client>): Promise<void> {
    const clientRef = doc(this.firestore, 'clients', id);
    await updateDoc(clientRef, {
      ...client,
      updatedAt: new Date()
    });
  }

  async deleteClient(id: string): Promise<void> {
    const clientRef = doc(this.firestore, 'clients', id);
    await deleteDoc(clientRef);
  }

  getClients(): Observable<Client[]> {
    const clientRef = collection(this.firestore, 'clients');
    return from(getDocs(clientRef)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Client))
      )
    );
  }

  getClientById(id: string): Observable<Client | null> {
    const clientRef = collection(this.firestore, 'clients');
    const q = query(clientRef, where('__name__', '==', id));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        const doc = snapshot.docs[0];
        return doc ? { id: doc.id, ...doc.data() } as Client : null;
      })
    );
  }
} 