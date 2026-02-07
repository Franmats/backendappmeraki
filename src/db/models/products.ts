export type ProductEstado = 'Pendiente' | 'En Proceso' | 'Completado';

export interface Product {
  id: number;
  modelo_id: number;
  modelo_nombre: string | null;
  codigo_producto: string;
  fecha_creacion: Date;
  sobrante:number;
  estado: ProductEstado;
  observaciones: string | null;
}

export type ProductCreateInput = Omit<Product, 'id' | 'fecha_creacion'>;
