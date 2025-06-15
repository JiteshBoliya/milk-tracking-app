import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface DailyRecord {
  date: string;
  quantity: number;
}

interface ReportData {
  clientName: string;
  month: string;
  year: string;
  milkRate: number;
  milkType: string;
  dailyRecords: DailyRecord[];
}

@Component({
  selector: 'app-report',
    standalone: true,
  imports:[
    FormsModule,
    CommonModule
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent {
 reportData: ReportData = {
    clientName: 'Rajesh Dairy Farm',
    month: 'March',
    year: '2024',
    milkRate: 55,
    milkType: 'Buffalo Milk',
    dailyRecords: [
      { date: '2024-03-01', quantity: 25 },
      { date: '2024-03-02', quantity: 28 },
      { date: '2024-03-03', quantity: 30 },
      { date: '2024-03-04', quantity: 26 },
      { date: '2024-03-05', quantity: 32 },
      { date: '2024-03-06', quantity: 29 },
      { date: '2024-03-07', quantity: 31 },
      { date: '2024-03-08', quantity: 27 },
      { date: '2024-03-09', quantity: 33 },
      { date: '2024-03-10', quantity: 28 },
      { date: '2024-03-11', quantity: 35 },
      { date: '2024-03-12', quantity: 30 },
      { date: '2024-03-13', quantity: 29 },
      { date: '2024-03-14', quantity: 31 },
      { date: '2024-03-15', quantity: 34 },
      { date: '2024-03-16', quantity: 28 },
      { date: '2024-03-17', quantity: 32 },
      { date: '2024-03-18', quantity: 30 },
      { date: '2024-03-19', quantity: 27 },
      { date: '2024-03-20', quantity: 36 },
      { date: '2024-03-21', quantity: 29 },
      { date: '2024-03-22', quantity: 33 },
      { date: '2024-03-23', quantity: 31 },
      { date: '2024-03-24', quantity: 28 },
      { date: '2024-03-25', quantity: 35 },
      { date: '2024-03-26', quantity: 32 },
      { date: '2024-03-27', quantity: 30 },
      { date: '2024-03-28', quantity: 34 },
      { date: '2024-03-29', quantity: 29 },
      { date: '2024-03-30', quantity: 31 },
      { date: '2024-03-31', quantity: 33 }
    ]
  };

  get totalQuantity(): number {
    return this.reportData.dailyRecords.reduce((sum, record) => sum + record.quantity, 0);
  }

  get totalAmount(): number {
    return this.totalQuantity * this.reportData.milkRate;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  }

  getDateNumber(dateString: string): number {
    return new Date(dateString).getDate();
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-IN');
  }

  shareOnWhatsApp(): void {
    const message = `📊 Milk Report - ${this.reportData.month} ${this.reportData.year}
🏪 Client: ${this.reportData.clientName}
🥛 Type: ${this.reportData.milkType}
💰 Rate: ₹${this.reportData.milkRate}/L
📈 Total Quantity: ${this.totalQuantity}L
💵 Total Amount: ₹${this.totalAmount.toLocaleString('en-IN')}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }
}
