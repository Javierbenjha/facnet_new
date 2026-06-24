export type { Product, ProductListResponse, ProductListParams, CatalogItem } from '../../core/models/product.model';

export function siglaMoneda(tipoMoneda: number): string {
  return tipoMoneda === 2 ? '$' : 'S/';
}
