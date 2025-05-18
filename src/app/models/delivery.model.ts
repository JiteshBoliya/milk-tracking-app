export interface Delivery {
    id?: string;
    clientId: string;
    date: Date;
    quantity: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
} 