
import { ProductTypes } from "@/types/product";

{/*const baseRF = new Airtable({apiKey: 'pat43oy35gnnqisLE.de53fde6af103790ef4d26e5421a53a75df7c09f93759ce1fa19b872c787b1aa'}).base('app1cSmD9pprWVvGd');*/}


export const addGoogleSheet = async (data: any) => {
    const url = "https://script.google.com/macros/s/AKfycbzJAeQpfaBhzTdRv46eW2F9mADydMk7hg9UsglE9DQ2n54tNsOH7TFT157SiICSQMTJiw/exec";  // url vieja "https://script.google.com/macros/s/AKfycbx5uzWgfSHSu2MXMbakyBOGDKtWCBZFoZqNdL73wbu9VokxYWzF50OleQF044ChGfhx/exec";

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Datos enviados a Google Sheet:', result);
        return result;
    } catch (error) {
        console.error('Error al enviar datos a Google Sheet:', error);
        throw error;
    }
};

export const addGoogleSheet2 = async (dataArray: ProductTypes[]): Promise<any> => {
    const url = "https://script.google.com/macros/s/AKfycbx7sIsNM0SKAUnK9QSmMsgUuSrC_m1Kbu1vweBtqfmcW5NQxM_I3dGkI9JEIlVAZ5LJ/exec";

    try {
        // Convertir los productos al formato adecuado para la API de Google Sheets
        const formattedData = dataArray.map(product => ({
            id_product: product.id_product,
            name: product.name,
            url_image: product.url_image,
           
            price: product.price || null,
            desc: Array.isArray(product.desc) ? product.desc.join(", ") : ""
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

export const addGoogleSheet3 = async (sheetId : string, dataArray : ProductDataTest[]) => {
    const url = "https://script.google.com/macros/s/AKfycby92_O7xjGxZADE4opKDlOYcP_VV1nqTs7Yw6voZU8aoB86c6mDtXK4sAOfacpmJkdE/exec";

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

        // Hacer la solicitud HTTP POST al script de Google Apps con `sheetId`
        await fetch(url, {
            method: 'POST',
            mode: 'no-cors', // Habilitar no-cors
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sheetId: sheetId, // Agregar el `sheetId` aquí
                productos: formattedData
            }),
        });

        // Solo un mensaje de confirmación en consola (sin datos de la respuesta)
        console.log("Solicitud enviada a Google Sheets.");

    } catch (error) {
        console.error('Error al interactuar con Google Sheet:', error);
        throw error;
    }
};
// export const addGoogleSheet3 = async (dataArray: ProductDataTest[]) => {
//     const url = "https://script.google.com/macros/s/AKfycbxSzFx8XtIAxKOMqZNa9L8k7ODR-fs7PPyo6PQvPGGb7PQI94-WVTSxpNWxfgHf9EHY/exec";
//
//     try {
//         // Convertir los productos al formato adecuado para la API de Google Sheets
//         const formattedData = dataArray.map(product => ({
//             _id: product._id,
//             id_category: product.id_category,
//             name: product.name,
//             brand: product.brand,
//             upc: product.upc,
//             size: product.size,
//             variety: product.variety,
//             price: product.price,
//             conditions: product.conditions,
//             sku: product.sku,
//             desc: product.desc,
//             main: product.main,
//             addl: product.addl,
//             burst: product.burst,
//             sale_price: product.sale_price,
//             price_text: product.price_text,
//             reg_price: product.reg_price,
//             save_up_to: product.save_up_to,
//             item_code: product.item_code,
//             group_code: product.group_code,
//             burst2: product.burst2,
//             burst3: product.burst3,
//             burst4: product.burst4,
//             with_cart: product.with_cart,
//             color: product.color,
//             notes: product.notes,
//             buyer_notes: product.buyer_notes,
//             effective: product.effective,
//             unit_price: product.unit_price,
//             id_product: product.id_product,
//             __v: product.__v
//         }));
//
//         // Hacer la solicitud HTTP POST al script de Google Apps con `sheetId`
//         const response = await fetch(url, {
//             method: 'POST',
//             mode: 'no-cors',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 //sheetId: sheetId, // Agregar el `sheetId` aquí
//                 productos: formattedData
//             }),
//         });
//
//         // Verificar si la respuesta HTTP fue exitosa (aunque en no-cors no puedes ver el resultado)
//         if (!response.ok) {
//             throw new Error(`Error en la solicitud HTTP! status: ${response.status}`);
//         }
//
//         // Intentar obtener el resultado en formato JSON (esto no funcionará en modo no-cors)
//         const result = await response.json();
//         console.log("Respuesta de Google Sheet:", result);
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