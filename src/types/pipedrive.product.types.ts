export interface DealProductsHttpResponse {
  success: boolean
  data: DealProduct[]
  additional_data: AdditionalData
}

export interface DealProduct {
  id: number
  deal_id: number
  order_nr: number
  product_id: number
  product_variation_id: any
  item_price: number
  discount_percentage: number
  duration: number
  duration_unit: any
  sum_no_discount: number
  sum: number
  currency: string
  enabled_flag: boolean
  add_time: string
  last_edit: any
  comments: any
  active_flag: boolean
  tax: number
  name: string
  sum_formatted: string
  quantity_formatted: string
  quantity: number
  product: Product
}

export interface Product {
  id: number
  name: string
  code: any
  description: any
  unit: any
  tax: number
  category: any
  active_flag: boolean
  selectable: boolean
  first_char: string
  visible_to: string
  owner_id: OwnerId
  files_count: any
  followers_count: number
  add_time: string
  update_time: string
  prices: Prices
}

export interface OwnerId {
  id: number
  name: string
  email: string
  has_pic: number
  pic_hash: string
  active_flag: boolean
  value: number
}

export interface Prices {
  BRL: Brl
}

export interface Brl {
  id: number
  product_id: number
  price: number
  currency: string
  cost: number
  overhead_cost: any
}

export interface AdditionalData {
  products_quantity_total: number
  products_sum_total: number
  variations_enabled: boolean
  products_quantity_total_formatted: string
  products_sum_total_formatted: string
  pagination: Pagination
}

export interface Pagination {
  start: number
  limit: number
  more_items_in_collection: boolean
}
