import {categoriesInterface} from "@/types/category";
import {useCategoryContext} from "@/app/context/categoryContext";
import {ProductTypes} from "@/types/product";


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

    const {categoriesData} = useCategoryContext()

    const url = "https://script.google.com/macros/s/AKfycbxAtyQcahGuH7L2Q2ihxMRUnXGLAEbjgb33rzrG1vjGSWwZOgt69bmSQur9fz1aIvd_/exec"

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

export let InfoHojaIdInicialIdFinal = [
    {
        hoja: 1,
        startId: 1001,
        endId: 1051,
    },
    {
        hoja: 2,
        startId: 2001,
        endId: 2067,
    },
    {
        hoja: 3,
        startId: 3001,
        endId: 3107,
    },
    {
        hoja: 4,
        startId: 4001,
        endId: 4054,
    }
]
export const addGoogleSheet3 = async (sheetId: string, categoriesData: categoriesInterface[], selectedProducts: ProductTypes[]) => {

    const url = "https://script.google.com/macros/s/AKfycbzjzJtD9AUUy7hhbJNh4uTu3ccRqqb3pkk7unDAong-LUsSFBqA1ysnXobD1WUuuSkT/exec";


    try {
        // Paso 1: Crear todos los espacios necesarios según los rangos de InfoHojaIdInicialIdFinal
        let allProducts: ProductTypes[] = [];

// Paso 1: Crear todos los espacios necesarios según los rangos de InfoHojaIdInicialIdFinal
        InfoHojaIdInicialIdFinal.forEach((hoja) => {
            for (let id = hoja.startId; id <= hoja.endId; id++) {
                allProducts.push({
                    id_grid: id,
                    upc: '',
                    master_brand: '',
                    brand: '',
                    desc: '',
                    name: '',
                    id_category: 0,
                    variety: undefined,
                    size: '',
                    quality_cf: '',
                    type_of_meat: '',
                    type_of_cut: '',
                    price: 0,
                });
            }
        });


        selectedProducts.forEach((product: ProductTypes) => {
            const index = allProducts.findIndex((p) => p.id_grid === product.id_grid);
            if (index !== -1) {
                // Reemplaza el placeholder con el producto real, manteniendo propiedades existentes cuando no estén presentes
                allProducts[index] = {
                    ...allProducts[index], // Mantén los valores del placeholder que no se hayan sobreescrito
                    ...product // Inserta los valores reales del producto
                };
            }
        });

// Ordena el array allProducts de menor a mayor según el campo id_grid
        allProducts = allProducts.filter(product => product.id_grid !== undefined);

        allProducts.sort((a, b) => a.id_grid! - b.id_grid!);
        const formattedData = allProducts.map(product => ({
            upc: product.upc,
            idCell: product.id_grid,
            masterBrand: product.master_brand,
            brand: product.brand,
            description: product.desc ? product.desc : product.name,
            category: categoriesData.find((category: categoriesInterface) => category.id_category === product.id_category)?.name_category,
            variety: product.variety && product.variety[0] ? product.variety[0] : '',
            pack_Size: product.size,
            qualityCf: product.quality_cf,
            typeOfMeat: product.type_of_meat,
            typeOfCutVariety: product.type_of_cut,
            price: product.price,

        }));
        // Hacer la solicitud HTTP POST al script de Google Apps con `sheetId`
        await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
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

