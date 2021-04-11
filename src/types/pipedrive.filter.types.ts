export interface FilterDealsHttpResponse {
  success: boolean
  data: Data
}

export interface Data {
  id: number
  name: string
  active_flag: boolean
  type: string
  temporary_flag: any
  user_id: number
  add_time: string
  update_time: string
  visible_to: string
  custom_view_id: any
  conditions: Conditions
}

export interface Conditions {
  glue: string
  conditions: Condition[]
}
export interface Condition {
  object: string
  field_id: string
  operator: string
  value: string
  extra_value: any
}
