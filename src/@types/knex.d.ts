// arquivo .d.ts é um arquivo para definição de tipos. Nao suporta JS, apenas TS.
// eslint-disable-next-line
import { Knex } from "knex";

declare module '/knex/types/tables' {
  export interface Tables {
    transactions: {
      id: string
      title: string
      amount: number
      created_at: string
      session_id?: string
    }
  }
}
