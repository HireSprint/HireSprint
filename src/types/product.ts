export interface ProductTypes {
    id_category: number,
    brand: string,
    upc: string,
    size?: string | string[],
    variety?: string[],
    price: string,
    desc?: string,
    addl?: string,
    burst?: number,
    with_card?: boolean,
    id_product?: number,
    id_grid?: number,
    notes?: string,
    url_image?: string
    image?:any
    type_of_meat?: string
    quantity?: string
    master_brand?: string
    type_of_cut?: string
    quality_cf?: string
    category?: string,
    plu?: string,
    limit?: string
    must_buy?: string,
    status_active?:boolean
    createdAt?:string
    limit_type: string
    per: string,
    pack: number,
    count: number,
    w_simbol: string,
    embase: string,
    variety_set:string[],
    verify?:boolean
}

export interface ProductDraggingType {
    from: string;
    id_product: number | undefined;
    id_grid?: number;
    page?: number;
}

export interface ProductReadyToDrag {
    from: string;
    id_product: number | undefined;
    id_grid?: number;
    page?: number;
}
