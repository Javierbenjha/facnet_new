import { Component, input, output, computed } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-table-pagination',
  templateUrl: './table-pagination.html',
  imports: [PaginatorModule],
})
export class TablePagination {
  currentPage      = input(1);
  totalItems       = input(0);
  pageSize         = input(10);
  pageSizeOptions  = input([8, 12, 16, 20]);

  pageChange     = output<number>();
  pageSizeChange = output<number>();

  // p-paginator uses zero-based page index
  readonly first = computed(() => (this.currentPage() - 1) * this.pageSize());

  onPageChange(event: PaginatorState): void {
    const newPage = (event.page ?? 0) + 1;
    if (event.rows !== this.pageSize()) {
      this.pageSizeChange.emit(event.rows ?? this.pageSize());
    }
    if (newPage !== this.currentPage()) {
      this.pageChange.emit(newPage);
    }
  }
}
