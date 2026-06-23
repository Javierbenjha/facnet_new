import {
  ChangeDetectionStrategy, Component, TemplateRef,
  computed, input, output, viewChild,
} from '@angular/core';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DataTable, TableColumn } from '../../../shared/data-table/data-table';
import { GuiaRemision, EstadoGuia, EstadoSunat } from '../referral-guide.models';

@Component({
  selector: 'app-referral-guide-table',
  templateUrl: './referral-guide-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataTable, Tag, Button, TooltipModule],
})
export class ReferralGuideTable {
  readonly guias      = input.required<GuiaRemision[]>();
  readonly viewDetail = output<GuiaRemision>();
  readonly anular     = output<GuiaRemision>();

  // ── Cell template refs ─────────────────────────────────────────────────────
  readonly tplComprobante = viewChild.required<TemplateRef<unknown>>('tplComprobante');
  readonly tplFecha       = viewChild.required<TemplateRef<unknown>>('tplFecha');
  readonly tplMotivo      = viewChild.required<TemplateRef<unknown>>('tplMotivo');
  readonly tplEstado      = viewChild.required<TemplateRef<unknown>>('tplEstado');
  readonly tplSunat       = viewChild.required<TemplateRef<unknown>>('tplSunat');
  readonly tplTransporte  = viewChild.required<TemplateRef<unknown>>('tplTransporte');
  readonly tplAcciones    = viewChild.required<TemplateRef<unknown>>('tplAcciones');

  readonly columns = computed<TableColumn[]>(() => [
    { key: 'serie',              label: 'Comprobante',     cellTemplate: this.tplComprobante() },
    { key: 'fecha',              label: 'Fecha',           cellTemplate: this.tplFecha()       },
    { key: 'motivo',             label: 'Motivo',          cellTemplate: this.tplMotivo()      },
    { key: 'destino_direccion',  label: 'Destino',         class: 'max-w-52 truncate'          },
    { key: 'empresa_transporte', label: 'Transporte',      cellTemplate: this.tplTransporte()  },
    { key: 'placa',              label: 'Placa'                                                 },
    { key: 'estado',             label: 'Estado',          cellTemplate: this.tplEstado()      },
    { key: 'estado_sunat',       label: 'SUNAT',           cellTemplate: this.tplSunat()       },
    { key: '_actions',           label: '',                cellTemplate: this.tplAcciones()    },
  ]);

  estadoSev(e: EstadoGuia): 'success' | 'danger' {
    return e === 'ACTIVO' ? 'success' : 'danger';
  }

  sunatSev(s: EstadoSunat): 'success' | 'warn' | 'danger' | 'secondary' {
    return { ACEPTADO: 'success', PENDIENTE: 'warn', RECHAZADO: 'danger', NO_ENVIADO: 'secondary' }[s] as any;
  }

  sunatLabel(s: EstadoSunat): string {
    return { ACEPTADO: 'Aceptado', PENDIENTE: 'Pendiente', RECHAZADO: 'Rechazado', NO_ENVIADO: 'No enviado' }[s];
  }

  fmtDate(s: string) {
    const d = new Date(s + 'T00:00:00');
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}
