import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy } from '@angular/fire/firestore';
import { Delivery } from '../models/delivery.model';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  constructor(private firestore: Firestore) {}

  async addDelivery(delivery: Omit<Delivery, 'id'>): Promise<string> {
    const deliveryRef = collection(this.firestore, 'deliveries');
    const docRef = await addDoc(deliveryRef, {
      ...delivery,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  }

  async updateDelivery(id: string, delivery: Partial<Delivery>): Promise<void> {
    const deliveryRef = doc(this.firestore, 'deliveries', id);
    await updateDoc(deliveryRef, {
      ...delivery,
      updatedAt: new Date()
    });
  }

  deleteDelivery(id: string): Observable<void> {
    const deliveryRef = doc(this.firestore, 'deliveries', id);
    return from(deleteDoc(deliveryRef));
  }

  getDeliveriesByClient(clientId: string): Observable<Delivery[]> {
    const deliveryRef = collection(this.firestore, 'deliveries');
    const q = query(
      deliveryRef,
      where('clientId', '==', clientId),
      orderBy('date', 'desc')
    );
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Delivery))
      )
    );
  }

  getDeliveriesByDateRange(startDate: Date, endDate: Date): Observable<Delivery[]> {
    const deliveryRef = collection(this.firestore, 'deliveries');
    const q = query(
      deliveryRef,
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Delivery))
      )
    );
  }

  getMonthlyTotal(clientId: string, month: Date): Observable<number> {
    const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
    return this.getDeliveriesByDateRange(startDate, endDate).pipe(
      map(deliveries => 
        deliveries
          .filter(d => d.clientId === clientId)
          .reduce((total, delivery) => total + delivery.quantity, 0)
      )
    );
  }
} 