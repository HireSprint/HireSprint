export interface layoutTypes {
    id?: any;
    w: number;
    h: number;
    x: number;
    y: number;
    moved?: boolean;
    i: string;
    static?: boolean;
    minW?: number;
    minH?: number;
    cellx?: number;
    celly?: number;
    id_grid?: number;
    range_cell_id_start?: number;
    range_cell_id_end?: number;
    id_category: number | string | null;
    gridCells?: layoutTypes[];
    groupI?: string;
}

export type PartialLayoutTypes = Partial<layoutTypes> & Pick<layoutTypes, 'i'>;

export interface gridLayoutTypes {
    _id?: string;
    grid_layout_id?: string;
    url_image?: string;
    url_preview?: string | any;
    img_preview?: string | any;
    amount_products?: number;
    canva_width: number | string;
    canva_height: number | string;
    page_number: number | string;
    page_group_id?: string;
    layout: layoutTypes[]
    image: any
}


export interface groupGridCellsTypes {
    rows: number;
    cols: number;
    totalItems: number;
}
