# Lógica de cálculo — Módulo de Venta

> Fuente de verdad: `sale.ts` (computed signals) + `sale.models.ts` (tipos y constantes).

---

## Variables globales (signals en `Sale`)

| Signal | Tipo | Descripción |
|---|---|---|
| `cart` | `signal<CartItem[]>` | Líneas del carrito |
| `descuento` | `signal<number>` | Porcentaje de descuento global (0–100) |

### Estructura de una línea (`CartItem`)

```ts
interface CartItem {
  producto:     PosProducto;  // el producto
  cantidad:     number;       // unidades
  precio_venta: number;       // precio modificable; 0 = bonificación/gratuito
}
```

### Campo clave del producto

```ts
interface PosProducto {
  st_afecto:      0 | 1;   // 1 = gravado con IGV, 0 = inafecto
  precio_publico: number;  // precio de referencia (usado solo en gratuito)
  precio_costo:   number;
  precio_min:     number;
}
```

---

## Cadena de cálculo

### 1. `brutoGravado` — base imponible bruta

```ts
cart()
  .filter(i => i.producto.st_afecto === 1 && i.precio_venta > 0)
  .reduce((s, i) => s + i.precio_venta * i.cantidad, 0)
```

- Productos **con IGV** (`st_afecto === 1`).
- Excluye gratuitos (`precio_venta > 0`).
- Valor **antes** de aplicar descuento.

---

### 2. `brutoInafecto` — base inafecta bruta

```ts
cart()
  .filter(i => i.producto.st_afecto === 0 && i.precio_venta > 0)
  .reduce((s, i) => s + i.precio_venta * i.cantidad, 0)
```

- Productos **sin IGV** (`st_afecto === 0`).
- Excluye gratuitos.
- Valor **antes** de aplicar descuento.

---

### 3. `gratuito` — valor de bonificaciones

```ts
cart()
  .filter(i => i.precio_venta === 0)
  .reduce((s, i) => s + i.producto.precio_publico * i.cantidad, 0)
```

- Un ítem es gratuito cuando `precio_venta === 0` (independiente de `st_afecto`).
- El valor se calcula sobre `precio_publico`, **no** sobre `precio_venta` (que sería 0).
- Es una línea **informativa** en el CPE; **no entra** en el total de la venta.

---

### 4. `descuentoMonto` — monto de descuento

```ts
(brutoGravado + brutoInafecto) * (descuento / 100)
```

- Se aplica sobre el total bruto (gravado + inafecto).
- **No** afecta al gratuito.

---

### 5. `subtotal` — base imponible neta (gravado)

```ts
brutoGravado * (1 - descuento / 100)
```

- Base sobre la que se calculará el IGV.
- Es el `brutoGravado` después del descuento proporcional.

---

### 6. `inafecto` — inafecto neto

```ts
brutoInafecto * (1 - descuento / 100)
```

- Productos sin IGV después del descuento proporcional.

---

### 7. `igv` — impuesto

```ts
subtotal * 0.18
```

- Tasa fija 18%.
- Se aplica **solo** sobre `subtotal` (la base gravada neta).
- Los productos `st_afecto === 0` no generan IGV.

---

### 8. `total` — monto a cobrar

```ts
subtotal + igv + inafecto
```

- **No** incluye `gratuito` ni `descuentoMonto` (ya están absorbidos en subtotal/inafecto).

---

### 9. `vuelto`

```ts
Math.max(0, efectivo - total)
```

---

## Resumen visual

```
cart
 ├─ st_afecto=1, precio_venta>0  →  brutoGravado
 │                                       │
 │                                 × (1 - desc%)  →  subtotal  →  × 0.18  →  igv
 │
 ├─ st_afecto=0, precio_venta>0  →  brutoInafecto
 │                                       │
 │                                 × (1 - desc%)  →  inafecto
 │
 └─ precio_venta=0 (cualquier st_afecto)
        → usa precio_publico × cantidad  →  gratuito  (solo display)

total = subtotal + igv + inafecto
```

---

## Constante IGV

No hay una constante extraída en el código actual; la tasa está inlineada:

```ts
// sale.ts:123
readonly igv = computed(() => this.subtotal() * 0.18);
```

Si la tasa cambia, actualizar en ese único lugar.

---

## Ejemplo de cálculo

### Carrito de prueba

| # | Producto | `st_afecto` | `precio_publico` | `precio_venta` | `cantidad` | Tipo |
|---|---|---|---|---|---|---|
| 1 | Coca Cola 600ml | `1` | 3.50 | 3.50 | 2 | gravado |
| 2 | Detergente Ariel 360g | `1` | 7.50 | 7.50 | 1 | gravado |
| 3 | Leche Gloria 1L | `0` | 5.90 | 5.90 | 3 | inafecto |
| 4 | Agua San Luis 625ml | `1` | 1.50 | **0.00** | 1 | **gratuito** |

Descuento global: **10 %**

---

### Paso a paso

**1. `brutoGravado`** — ítems 1 y 2 (st_afecto=1, precio_venta>0)
```
(3.50 × 2) + (7.50 × 1) = 7.00 + 7.50 = 14.50
```

**2. `brutoInafecto`** — ítem 3 (st_afecto=0, precio_venta>0)
```
5.90 × 3 = 17.70
```

**3. `gratuito`** — ítem 4 (precio_venta=0 → usa precio_publico)
```
1.50 × 1 = 1.50   ← solo display, no entra en el total
```

**4. `descuentoMonto`**
```
(14.50 + 17.70) × 0.10 = 32.20 × 0.10 = 3.22
```

**5. `subtotal`** — base gravada neta
```
14.50 × (1 - 0.10) = 14.50 × 0.90 = 13.05
```

**6. `inafecto`** — inafecto neto
```
17.70 × (1 - 0.10) = 17.70 × 0.90 = 15.93
```

**7. `igv`**
```
13.05 × 0.18 = 2.349 ≈ 2.35
```

**8. `total`**
```
13.05 + 2.35 + 15.93 = 31.33
```

---

### Resultado final

| Campo | Valor |
|---|---|
| Bruto gravado | S/ 14.50 |
| Bruto inafecto | S/ 17.70 |
| Descuento (10 %) | − S/ 3.22 |
| **Subtotal** (base IGV) | **S/ 13.05** |
| **Inafecto** | **S/ 15.93** |
| **IGV (18 %)** | **S/ 2.35** |
| **Total** | **S/ 31.33** |
| Gratuito (display) | S/ 1.50 |

> El gratuito aparece en el comprobante como línea informativa pero **no suma al total**.

---

## `CartTotals` — contrato hacia los hijos

```ts
interface CartTotals {
  subtotal:       number;  // base gravada neta
  brutoGravado:   number;  // base gravada antes de descuento
  inafecto:       number;  // inafecto neto
  igv:            number;
  total:          number;
  gratuito:       number;  // valor referencial de bonificaciones
  descuentoMonto: number;  // monto absoluto descontado
  descuento:      number;  // porcentaje (0–100)
}
```

El componente `SaleCart` recibe este objeto vía `input.required<CartTotals>()` y lo usa solo para display; **no recalcula nada**.
