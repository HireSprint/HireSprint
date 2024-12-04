export interface ProductTypes {
    id_category: number,
    name: string,
    brand: string,
    upc: string,
    size?: string,
    variety?: [string],
    price: string,
    conditions?: string,
    sku?: string,
    desc?: string,
    main?: string,
    addl?: string,
    burst?: number,
    sale_price?: number,
    price_text?: string,
    reg_price?: number,
    save_up_to?: string,
    item_code?: number,
    group_code?: number,
    with_cart?: boolean,
    id_product?: number,
    id_grid?: number,
    notes?: string,
    buyer_notes?: string,
    effective?: string,
    unit_price?: string,
    color?: string,
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
