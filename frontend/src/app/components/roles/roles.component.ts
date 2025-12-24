import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { PaymentService } from '../../services/payment.service';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  aiLimit: number;
  features: string[];
  recommended?: boolean;
  current?: boolean;
}

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit {
  currentRole: string = 'free';
  loading = true;

  plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: '€0',
      aiLimit: 3,
      features: [
        '3 consultas IA diarias',
        'Acceso a ejercicios básicos',
        'Seguimiento de progreso',
        'Estadísticas básicas'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '€9.99',
      aiLimit: 15,
      recommended: true,
      features: [
        '15 consultas IA diarias',
        'Acceso a todos los ejercicios',
        'Estadísticas avanzadas',
        'Simulacros de examen',
        'Soporte prioritario'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '€19.99',
      aiLimit: 40,
      features: [
        '40 consultas IA diarias',
        'Todo lo de Pro',
        'Contenido exclusivo',
        'Análisis personalizado',
        'Sesiones 1-on-1',
        'Certificados oficiales'
      ]
    }
  ];

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private paymentService: PaymentService
  ) { }

  ngOnInit() {
    this.userService.getUserInfo().subscribe({
      next: (user) => {
        this.currentRole = user.subscription_role || 'free';
        this.updateCurrentPlan();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading user data', err);
        this.loading = false;
      }
    });
  }

  updateCurrentPlan() {
    this.plans.forEach(plan => {
      plan.current = plan.id === this.currentRole;
    });
  }

  selectPlan(planId: string) {
    if (planId === this.currentRole) {
      this.notificationService.info('Ya tienes este plan activo');
      return;
    }

    if (planId === 'free') {
      this.notificationService.info('Contacta a soporte para cancelar tu suscripción');
      return;
    }

    // this.loading = true;
    let paymentObservable;

    if (planId === 'pro') {
      paymentObservable = this.paymentService.createCheckoutSessionPro();
    } else if (planId === 'premium') {
      paymentObservable = this.paymentService.createCheckoutSessionPremium();
    } else {
      this.loading = false;
      return;
    }

    paymentObservable.subscribe({
      next: (response: any) => {
        if (response && response.url) {
          window.location.href = response.url;
        } else {
          this.notificationService.error('Error al iniciar el pago');
          this.loading = false;
        }
      },
      error: (err: any) => {
        console.error('Payment error', err);
        this.notificationService.error('Error al conectar con el servidor de pagos');
        this.loading = false;
      }
    });
  }
}
