
import { useCategoryContext } from "@/app/context/categoryContext";
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
    const { categoriesData } = useCategoryContext()

    const url = "https://script.google.com/macros/s/AKfycbx7sIsNM0SKAUnK9QSmMsgUuSrC_m1Kbu1vweBtqfmcW5NQxM_I3dGkI9JEIlVAZ5LJ/exec";

    try {
        // Convertir los productos al formato adecuado para la API de Google Sheets
        const formattedData = dataArray.map(product => ({
            id_product: product.id_product,
            name: product.name,
            url_image: product.url_image,
            id_category: product.id_category,
           
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
