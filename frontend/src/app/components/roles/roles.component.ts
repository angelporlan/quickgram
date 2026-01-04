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
  processingPlanId: string | null = null;

  plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: '€0',
      aiLimit: 3,
      features: [
        '3 daily AI queries',
        'Access to basic exercises',
        'Progress tracking',
        'Basic stats',
        '10 coins per exercise'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '€9.99',
      aiLimit: 15,
      recommended: true,
      features: [
        '15 daily AI queries',
        'Access to all exercises',
        'Advanced stats',
        'Exam simulations',
        'Priority support',
        '1.5x coins per exercise'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '€19.99',
      aiLimit: 40,
      features: [
        '40 daily AI queries',
        'Everything in Pro',
        'Exclusive content',
        'Personalized analysis',
        '1-on-1 sessions',
        'Official certificates',
        '2x coins per exercise'
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

    this.processingPlanId = planId;
    let paymentObservable;

    if (planId === 'pro') {
      paymentObservable = this.paymentService.createCheckoutSessionPro();
    } else if (planId === 'premium') {
      paymentObservable = this.paymentService.createCheckoutSessionPremium();
    } else {
      this.processingPlanId = null;
      return;
    }

    paymentObservable.subscribe({
      next: (response: any) => {
        if (response && response.url) {
          window.location.href = response.url;
        } else {
          this.notificationService.error('Error al iniciar el pago');
          this.processingPlanId = null;
        }
      },
      error: (err: any) => {
        console.error('Payment error', err);
        this.notificationService.error('Error al conectar con el servidor de pagos');
        this.processingPlanId = null;
      }
    });
  }
}
