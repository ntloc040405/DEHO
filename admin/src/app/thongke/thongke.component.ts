import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatsService } from '../services/stats.service';
import { ChartsWrapperModule } from '../charts-wrapper.module';
import { ChartConfiguration, ChartOptions, Chart, registerables } from 'chart.js';

// Đăng ký các thành phần của Chart.js thủ công - giải pháp an toàn nhất cho Docker Build
Chart.register(...registerables);

@Component({
  selector: 'app-thongke',
  standalone: true,
  imports: [CommonModule, RouterModule, ChartsWrapperModule],
  templateUrl: './thongke.component.html',
  styleUrl: './thongke.component.css'
})
export class ThongkeComponent implements OnInit {
  stats: any = {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    orderStatusStats: [],
    weeklyRevenue: [],
    topProducts: []
  };

  // Line Chart Configuration
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Doanh thu (VNĐ)',
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3b82f6',
        pointBackgroundColor: '#3b82f6',
        tension: 0.4,
        pointRadius: 4
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 8
      }
    },
    scales: {
      y: { 
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  // Doughnut Chart Configuration
  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [{ 
      data: [],
      backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#6366f1'],
      hoverOffset: 4
    }]
  };

  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom',
        labels: { usePointStyle: true, padding: 20 }
      }
    }
  };

  constructor(private statsService: StatsService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.statsService.getDashboardStats().subscribe({
      next: (res) => {
        if (res.success) {
          this.stats = res.data;
          this.processChartData();
        }
      },
      error: (err) => console.error('Error fetching stats:', err)
    });
  }

  processChartData() {
    if (this.stats.weeklyRevenue && this.stats.weeklyRevenue.length > 0) {
      this.lineChartData.labels = this.stats.weeklyRevenue.map((d: any) => d._id);
      this.lineChartData.datasets[0].data = this.stats.weeklyRevenue.map((d: any) => d.revenue);
    }

    if (this.stats.orderStatusStats && this.stats.orderStatusStats.length > 0) {
      this.doughnutChartData.labels = this.stats.orderStatusStats.map((s: any) => s._id);
      this.doughnutChartData.datasets[0].data = this.stats.orderStatusStats.map((s: any) => s.count);
    }
  }
}