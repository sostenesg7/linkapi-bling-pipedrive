export interface DealSummaryHttpResponse {
  success: boolean
  data: Data
}

export interface Data {
  values_total: ValuesTotal
  weighted_values_total: Value
  total_count: number
  total_currency_converted_value: number
  total_weighted_currency_converted_value: number
  total_currency_converted_value_formatted: string
  total_weighted_currency_converted_value_formatted: string
}

export interface ValuesTotal {
  BRL: Value
}

export interface Value {
  value: number
  count: number
  value_converted: number
  value_formatted: string
  value_converted_formatted: string
}