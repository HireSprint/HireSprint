import Airtable from "airtable";
import { ProductTypes } from "@/types/product";

const baseRF = new Airtable({apiKey: 'pat43oy35gnnqisLE.de53fde6af103790ef4d26e5421a53a75df7c09f93759ce1fa19b872c787b1aa'}).base('app1cSmD9pprWVvGd');


export const getProductsRF = async (searchTerm = ''): Promise<ProductTypes[]> => {
    return new Promise((resolve, reject) => {
        const allProducts: ProductTypes[] = [];
        const filterFormula = searchTerm ?
            `SEARCH('${searchTerm}', {Product_Name})` :
            '';

        baseRF('Products-RF').select({
            view: "Grid view",
            filterByFormula: filterFormula
        }).eachPage(
            function page(records, fetchNextPage) {
                records.forEach(function (record) {
                    const attachments = record.get('Product_Image') as { url: string }[] | undefined;
                    const imageUrl = attachments && attachments.length > 0 ? attachments[0].url : '';
                    const descriptions = record.get('Product_Subline') as string[] | undefined;
                   
                    allProducts.push({
                        id: record.id,
                        name: record.get('Product_Name') as string,
                        image: imageUrl,
                        descriptions: descriptions || [],
                       
                    });
                });
                fetchNextPage();
            },
            function done(err) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(allProducts);
                }
            }
        );
    });
};


export const getTableName = async (): Promise<ProductTypes[]> => {
    return new Promise((resolve, reject) => {
        const allProducts: ProductTypes[] = [];
        baseRF('J004S').select({
            view: "Grid view",
        }).eachPage(
            function page(records, fetchNextPage) {
                records.forEach(function (record) {
                    const attachments = record.get('Product_Image (from Products-RF)') as { url: string }[] | undefined;
                    const imageUrl = attachments && attachments.length > 0 ? attachments[0].url : '';
                    const descriptions = record.get('Product_Subline (from Products-RF)') as string[] | undefined;
                    const names = record.get('Product_Name (from Products-RF)') as string[] | undefined;
                    const productName = names && names.length > 0 ? names[0] : 'Sin nombre';
                    const price = record.get('Price') as string;
                    const gridId = record.get('gridID') as string;
                    allProducts.push({
                        id: record.id,
                        name: productName,
                        image: imageUrl,
                        descriptions: descriptions || [],
                        price: parseFloat(price) || 0,
                        gridId: parseInt(gridId)
                    });
                });
                fetchNextPage();
            },
            function done(err) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(allProducts);
                }
            }
        );
    });
};


// export const addGoogleSheet = async (data) => {
//     const url = "https://script.google.com/macros/s/AKfycbwdeSTowK-wDllI2-cCWD9DWBshmKmUVQ4L0BpC1U-sIw4r3t0_5y5vWYG2_F9_z58vxw/exec";
//     console.log('Datos a enviar:', data);
//
//     try {
//         // Enviar la solicitud en modo "no-cors"
//         await fetch(url, {
//             method: 'POST',
//             mode: 'no-cors', // Usar "no-cors"
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(data),
//         });
//
//         // En modo "no-cors", no se puede verificar el estado de la respuesta
//         console.log('Solicitud enviada en modo no-cors. No se puede verificar el estado de la respuesta.');
//
//     } catch (error) {
//         console.error('Error al enviar datos a Google Sheet:', error);
//         throw error;
//     }
// };

export const addGoogleSheet2 = async (dataArray: ProductTypes[]): Promise<any> => {
    const url = "https://script.google.com/macros/s/AKfycbx7sIsNM0SKAUnK9QSmMsgUuSrC_m1Kbu1vweBtqfmcW5NQxM_I3dGkI9JEIlVAZ5LJ/exec";

    try {
        // Convertir los productos al formato adecuado para la API de Google Sheets
        const formattedData = dataArray.map(product => ({
            id: product.id,
            name: product.name,
            image: product.image,
            gridId: product.gridId || null,
            price: product.price || null,
            descriptions: Array.isArray(product.descriptions) ? product.descriptions.join(", ") : ""
        }));

        // Hacer la solicitud HTTP POST al script de Google Apps
        const response = await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({productos: formattedData}),
        });

        // Verificar si la respuesta HTTP fue exitosa
        if (!response.ok) {
            throw new Error(`Error en la solicitud HTTP! status: ${response.status}`);
        }

        // Obtener el resultado en formato JSON
        const result = await response.json();
        console.log("Respuesta de Google Sheet:", result);
        return result;

    } catch (error) {
        console.error('Error al interactuar con Google Sheet:', error);
        throw error;
    }
};

export interface ProductDataTest {
    _id: string;
    id_category: string;
    name: string;
    brand: string;
    upc: string;
    size: string;
    variety: string;
    price: number;
    conditions: string;
    sku: string;
    desc: string;
    main: string;
    addl: string;
    burst: string;
    sale_price: number;
    price_text: string;
    reg_price: number;
    save_up_to: string;
    item_code: string;
    group_code: string;
    burst2: string;
    burst3: string;
    burst4: string;
    with_cart: boolean;
    color: string;
    notes: string;
    buyer_notes: string;
    effective: string;
    unit_price: number;
    id_product: string;
    __v: number;
}
export const addGoogleSheet3 = async (dataArray : ProductDataTest[]) => {
    const url = "https://script.google.com/macros/s/AKfycbwdeSTowK-wDllI2-cCWD9DWBshmKmUVQ4L0BpC1U-sIw4r3t0_5y5vWYG2_F9_z58vxw/exec";

    try {
        // Convertir los productos al formato adecuado para la API de Google Sheets
        const formattedData = dataArray.map(product => ({
            _id: product._id,
            id_category: product.id_category,
            name: product.name,
            brand: product.brand,
            upc: product.upc,
            size: product.size,
            variety: product.variety,
            price: product.price,
            conditions: product.conditions,
            sku: product.sku,
            desc: product.desc,
            main: product.main,
            addl: product.addl,
            burst: product.burst,
            sale_price: product.sale_price,
            price_text: product.price_text,
            reg_price: product.reg_price,
            save_up_to: product.save_up_to,
            item_code: product.item_code,
            group_code: product.group_code,
            burst2: product.burst2,
            burst3: product.burst3,
            burst4: product.burst4,
            with_cart: product.with_cart,
            color: product.color,
            notes: product.notes,
            buyer_notes: product.buyer_notes,
            effective: product.effective,
            unit_price: product.unit_price,
            id_product: product.id_product,
            __v: product.__v
        }));

        // Hacer la solicitud HTTP POST al script de Google Apps
        const response = await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({productos: formattedData}),
        });

        // Verificar si la respuesta HTTP fue exitosa (aunque en no-cors no puedes ver el resultado)
        if (!response.ok) {
            throw new Error(`Error en la solicitud HTTP! status: ${response.status}`);
        }

        // Intentar obtener el resultado en formato JSON (esto no funcionará en modo no-cors)
        const result = await response.json();
        console.log("Respuesta de Google Sheet:", result);
        return result;

    } catch (error) {
        console.error('Error al interactuar con Google Sheet:', error);
        throw error;
    }
};

// export const addGoogleSheet2 = async (dataArray: any) => {
//     const url = "https://script.google.com/macros/s/AKfycbyrtdLbUcOcx4JLzHKiT_RVVoppbg3KO1bXpnYxD3oz2zi__fWYA_OX8FJ0qAZMoyLBzw/exec";
//
//     try {
//         const response = await fetch(url, {
//             method: 'POST',
//             mode: "no-cors",
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({data: dataArray}),
//         });
//
//         // Verificar si la respuesta HTTP fue exitosa
//         if (!response.ok) {
//             throw new Error(`Error en la solicitud HTTP! status: ${response.status}`);
//         }
//
//         // Obtener el resultado en formato JSON
//         const result = await response.json();
//         console.log('Respuesta de Google Sheet:', result);
//         return result;
//
//     } catch (error) {
//         console.error('Error al interactuar con Google Sheet:', error);
//         throw error;
//     }
// };



{/*  AIzaSyDRdER7z-xWfILxTUO-nhuo96uULVp02Rw*/
}
{/*479944829804-u47ce5ne0n2f7c0qbccsirr1be0nu110.apps.googleusercontent.com */
}