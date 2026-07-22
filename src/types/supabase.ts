export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string
          title: string
          amount: number
          type: string
          category: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          amount: number
          type: string
          category: string
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          amount?: number
          type?: string
          category?: string
          date?: string
          created_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          title: string
          target: number
          saved: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          target: number
          saved?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          target?: number
          saved?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
