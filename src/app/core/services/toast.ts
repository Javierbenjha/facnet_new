import { Service, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Service()
export class Toaster {
  private readonly msg = inject(MessageService);

  success(title: string, message: string, life = 4000) {
    this.msg.add({ severity: 'success', summary: title, detail: message, life });
  }

  error(title: string, message: string, life = 5000) {
    this.msg.add({ severity: 'error', summary: title, detail: message, life });
  }

  warning(title: string, message: string, life = 4000) {
    this.msg.add({ severity: 'warn', summary: title, detail: message, life });
  }

  info(title: string, message: string, life = 4000) {
    this.msg.add({ severity: 'info', summary: title, detail: message, life });
  }
}
