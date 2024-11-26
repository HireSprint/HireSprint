export interface CircularProductsUpcType {
    grid_id:number,
    upc:string
}

export interface circularType {
    id_client: number;
    name_circular: string;
    week_circular: string;
    date_circular: string;
    circular_options: string[];
    circular_products_upc: CircularProductsUpcType[];

}
