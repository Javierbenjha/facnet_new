import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UnitMeasures } from './unit_measures';

describe('UnitMeasures', () => {
  let component: UnitMeasures;
  let fixture: ComponentFixture<UnitMeasures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, UnitMeasures],
    }).compileComponents();

    fixture = TestBed.createComponent(UnitMeasures);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial unit measures list', () => {
    const units = component.filteredUnitMeasures();
    expect(units.length).toBeGreaterThan(0);
    expect(units[0].descripcion).toBeDefined();
    expect(units[0].siglas).toBeDefined();
  });

  it('should filter unit measures by query', () => {
    component.query.set('litros');
    const filtered = component.filteredUnitMeasures();
    expect(filtered.every(u => u.descripcion.toLowerCase().includes('litros') || u.siglas.toLowerCase().includes('litros'))).toBe(true);
  });

  it('should open modal for new unit measure', () => {
    component.openNew();
    expect(component.editing()).toBe('new');
    expect(component.showModal()).toBe(true);
    expect(component.modalTitle()).toBe('New Unit of Measure');
  });

  it('should open modal for editing', () => {
    const unit = component.unitMeasures()[0];
    component.openEdit(unit);
    expect(component.editing()).toEqual(unit);
    expect(component.showModal()).toBe(true);
    expect(component.modalTitle()).toContain(unit.descripcion);
  });

  it('should create a new unit of measure', () => {
    component.openNew();
    component.form.setValue({
      descripcion: 'Mililitros',
      siglas: 'ML'
    });
    component.save();

    const units = component.unitMeasures();
    const created = units.find(u => u.siglas === 'ML');
    expect(created).toBeDefined();
    expect(created?.descripcion).toBe('Mililitros');
    expect(component.editing()).toBeNull();
  });

  it('should update an existing unit of measure', () => {
    const target = component.unitMeasures()[0];
    component.openEdit(target);
    component.form.patchValue({
      descripcion: 'Unidades Modificadas'
    });
    component.save();

    const units = component.unitMeasures();
    const updated = units.find(u => u.id_unidad === target.id_unidad);
    expect(updated?.descripcion).toBe('Unidades Modificadas');
    expect(component.editing()).toBeNull();
  });

  it('should delete a unit of measure', () => {
    const initialLength = component.unitMeasures().length;
    const target = component.unitMeasures()[0];
    component.delete(target.id_unidad);

    expect(component.unitMeasures().length).toBe(initialLength - 1);
    expect(component.unitMeasures().find(u => u.id_unidad === target.id_unidad)).toBeUndefined();
  });
});
