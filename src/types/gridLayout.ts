export interface gridLayoutTypes {
  w: number;
  h: number;
  x: number;
  y: number;
  moved: boolean;
  i: string;
  static: boolean;
  minW?: number;
  minH?: number;
  cellx?: number;
  celly?: number;
  id_grid?: number,
  range_cell_id_start?: number,
  range_cell_id_end?: number,
  id_category: number | null;
  gridCells?: gridLayoutTypes[];
  groupI?: string;
}

export type PartialGridLayoutTypes = Partial<gridLayoutTypes> &
  Pick<gridLayoutTypes, "i">;

export interface groupGridCellsTypes {
  rows: number;
  cols: number;
  totalItems: number;
}
