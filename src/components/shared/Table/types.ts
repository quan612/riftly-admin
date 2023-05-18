import type { ColumnDef } from 'react-table';

export type TableProps<T extends object> = {
  tableData: T[];
  columnsData: ColumnDef<T>[];
}