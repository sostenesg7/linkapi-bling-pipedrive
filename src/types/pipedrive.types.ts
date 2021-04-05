export interface DealListHttpResponse {
  success: boolean
  data: Array<Deal>
  additional_data: AdditionalData
}
export interface Deal {
  id: number
  creator_user_id: CreatorUserId
  user_id: UserId
  person_id: any
  org_id: any
  stage_id: number
  title: string
  value: number
  currency: string
  add_time: string
  update_time: string
  stage_change_time: any
  active: boolean
  deleted: boolean
  status: string
  probability: any
  next_activity_date: any
  next_activity_time: any
  next_activity_id: any
  last_activity_id: any
  last_activity_date: any
  lost_reason: any
  visible_to: string
  close_time: string
  pipeline_id: number
  won_time: string
  first_won_time: string
  lost_time: any
  products_count: number
  files_count: number
  notes_count: number
  followers_count: number
  email_messages_count: number
  activities_count: number
  done_activities_count: number
  undone_activities_count: number
  participants_count: number
  expected_close_date: any
  last_incoming_mail_time: any
  last_outgoing_mail_time: any
  label: any
  renewal_type: string
  stage_order_nr: number
  person_name: any
  org_name: any
  next_activity_subject: any
  next_activity_type: any
  next_activity_duration: any
  next_activity_note: any
  group_id: any
  group_name: any
  formatted_value: string
  weighted_value: number
  formatted_weighted_value: string
  weighted_value_currency: string
  rotten_time: any
  owner_name: string
  cc_email: string
  org_hidden: boolean
  person_hidden: boolean
}

export interface CreatorUserId {
  id: number
  name: string
  email: string
  has_pic: number
  pic_hash: string
  active_flag: boolean
  value: number
}

export interface UserId {
  id: number
  name: string
  email: string
  has_pic: number
  pic_hash: string
  active_flag: boolean
  value: number
}

export interface AdditionalData {
  pagination: Pagination
}

export interface Pagination {
  start: number
  limit: number
  more_items_in_collection: boolean
}
