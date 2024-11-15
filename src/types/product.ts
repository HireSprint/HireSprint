export interface ProductTypes {
    id_category: number,
    name: string,
    brand: string,
    upc: number,
    size?: string,
    variety?: [string],
    price: number,
    conditions?: string,
    sku?: string,
    desc?: string,
    main?: string,
    addl?: string,
    burst?: string,
    sale_price?: number,
    price_text?: string,
    reg_price?: number,
    save_up_to?: string,
    item_code?: number,
    group_code?: number,
    burst2?: string,
    burst3?: string,
    burst4?: string,
    with_cart?: boolean,
    id_product?: number | undefined,
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
    quality__Cf: string
    
}
