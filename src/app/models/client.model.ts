export interface Client {
    id?: string;
    name: string;
    address: string;
    contact: string;
    milkType: 'cow' | 'buffalo';
    quantityPerDay: number;
    ratePerLiter: number;
    createdAt: Date;
    updatedAt: Date;
} 