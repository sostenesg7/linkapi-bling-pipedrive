export interface BlingOrderType {
  value: number;
  id: string | number;
  products: Array<BlingProductType>
}

export interface BlingProductType {
  value: number;
  id: string | number;
}
