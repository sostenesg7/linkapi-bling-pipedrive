export interface PipedriveOrderType {
  value: number;
  id: string | number;
  products: Array<PipedriveProductType>
}

export interface PipedriveProductType {
  value: number;
  id: string | number;
}
