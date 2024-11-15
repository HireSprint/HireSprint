import {ProductTypes} from "@/types/product";
import {CategoryProvider, useCategoryContext} from "@/app/context/categoryContext";
import {useProductContext} from "@/app/context/productContext";
import {categoriesInterface} from "@/types/category";

{/*const baseRF = new Airtable({apiKey: 'pat43oy35gnnqisLE.de53fde6af103790ef4d26e5421a53a75df7c09f93759ce1fa19b872c787b1aa'}).base('app1cSmD9pprWVvGd');*/
}


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
    const url = "https://script.google.com/macros/s/AKfycbxAtyQcahGuH7L2Q2ihxMRUnXGLAEbjgb33rzrG1vjGSWwZOgt69bmSQur9fz1aIvd_/exec";

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


export const addGoogleSheet3 = async (sheetId: string, categoriesData: categoriesInterface[], selectedProducts: ProductTypes[]) => {
  
    const url = "https://script.google.com/macros/s/AKfycby_Fai8CGt9_uX4yTP1JAgjKwZQMfmlr3BlCN08DAq0trwnMf88P_TwX8ofKfTOPtuL/exec";
    
    try {
        // Convertir los productos al formato adecuado para la API de Google Sheets
        const formattedData = selectedProducts.map(product => ({
            upc: product.upc,
            idCell : product.id_product,
            masterBrand: product.master_brand,
            brand: product.brand,
            description: product.desc,
            category: categoriesData.find((category: categoriesInterface) => category.id_category === product.id_category)?.name_category,
            variety: product.variety && product.variety[0] ? product.variety : '',
            pack_Size: product.size,
            qualityCf: product.quality__Cf,
            typeOfMeat: product.type_of_meat,
            typeOfCutVariety: product.type_of_cut,
            price: product.price,

        }));
        console.log(formattedData);
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

{/*  AIzaSyDRdER7z-xWfILxTUO-nhuo96uULVp02Rw*/
}
{/*479944829804-u47ce5ne0n2f7c0qbccsirr1be0nu110.apps.googleusercontent.com */
}