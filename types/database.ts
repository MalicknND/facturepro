export type QuoteStatus = "draft" | "sent" | "accepted" | "rejected";
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export interface CompanyProfile {
  id: string;
  user_id: string;
  name: string;
  address: string | null;
  email: string | null;
  phone: string | null;
  logo_url: string | null;
  vat_exempt: boolean;
  vat_number: string | null;
  payment_delay_days: number;
  late_penalty_rate: number | null;
  late_penalty_fixed: number | null;
  legal_mention: string | null;
  created_at: string;
  updated_at: string;
}

export type ClientType = "person" | "company";

export interface Client {
  id: string;
  user_id: string;
  name: string;
  client_type?: ClientType;
  contact_name?: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  siret: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuoteLine {
  id: string;
  quote_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  order_index: number;
}

export interface Quote {
  id: string;
  user_id: string;
  client_id: string;
  number: string;
  status: QuoteStatus;
  issue_date: string;
  valid_until: string | null;
  vat_rate: number;
  note: string | null;
  created_at: string;
  updated_at: string;
  client?: Client;
  lines?: QuoteLine[];
}

export interface InvoiceLine {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  order_index: number;
}

export interface Invoice {
  id: string;
  user_id: string;
  client_id: string;
  number: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  vat_rate: number;
  note: string | null;
  quote_id: string | null;
  created_at: string;
  updated_at: string;
  client?: Client;
  lines?: InvoiceLine[];
}

export interface NumberingCounter {
  id: string;
  user_id: string;
  year: number;
  type: "invoice" | "quote";
  last_number: number;
}
