import {categoriesInterface} from "@/types/category";
import {useCategoryContext} from "@/app/context/categoryContext";
import {ProductTypes} from "@/types/product";


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

    const url = "https://script.google.com/macros/s/AKfycby2pDrtASzSikiPtF0rMsW1qU571uF1ULN-NKVQ2bQAAJ338atx7onnv_xQKyFsIVo1/exec";


    try {
        let allProducts: ProductTypes[] = [];

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
                    price: '0',
                    notes: '',
                    burst: 0,
                    addl: '',
                    limit: '',
                    must_buy: "",
                    with_card: false,
                    per: '',
                    limit_type: '',
                    pack: 0,
                    count: 0,
                    w_simbol: '',
                    embase: ''
                  
                });
            }
        });


        selectedProducts.forEach((product: ProductTypes) => {
            const index = allProducts.findIndex((p) => p.id_grid === product.id_grid);
            if (index !== -1) {
                allProducts[index] = {
                    ...allProducts[index],
                    ...product
                };
            }
        });

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
            notes: product.notes,
            burst: Number(product.burst),
            addl: product.addl,
            limit: product.limit ? `Limit ${product.limit}` : '',
            must_buy: product.must_buy ? `Must Buy ${product.must_buy}` : '',
            with_cart: product.with_card,
            per: product.per,
            limit_type: product.limit_type,
            pack: product.pack,
            count: product.count,
            w_simbol: product.w_simbol,
            embase: product.embase

        }));
        await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sheetId: sheetId,
                productos: formattedData
            }),
        });

        console.log("Solicitud enviada a Google Sheets.",formattedData);

    } catch (error) {
        console.error('Error al interactuar con Google Sheet:', error);
        throw error;
    }
}
