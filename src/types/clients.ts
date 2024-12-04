export interface clientType {
    id_client:number,
    client_products?:number[],
    client_name:string,
    address?:string,
    email:string,
    password:string,
    phone?:string,
    status:boolean,
    level_client:number,
}
