import {categoriesInterface} from "@/types/category";
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
        endId: 2071,
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
export const addGoogleSheet3 = async (sheetId: string, categoriesData: categoriesInterface[], selectedProducts: ProductTypes[], numPages : number[]) => {

    const url = "https://script.google.com/macros/s/AKfycbw4YNQlBq4JyLB8GalpOmHS9xuyyxW_S1_GRqqr-bfln6KsLBko7HjPiXxA74a0F0RT/exec";

    console.log(numPages, 'numPages');
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
                    id_category: 0,
                    variety_set: [],
                    size: [""],
                    quality_cf: '',
                    type_of_meat: '',
                    type_of_cut: '',
                    price: '0',
                    notes: '',
                    url_image: '',
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
                    embase: '',
                    variety: [],
                    image2 : '',
                });
            }
        });

        if (numPages.length > 0 && numPages[0] !== 0) {
            const filteredPrefixes = new Set(numPages);
            selectedProducts.forEach((product: ProductTypes) => {
                const productPrefix = Math.floor(product.id_grid! / 1000);
                if (filteredPrefixes.has(productPrefix)) {
                    const index = allProducts.findIndex((p) => p.id_grid === product.id_grid);
                    if (index !== -1) { allProducts[index] = {...allProducts[index],...product,};
                    }
                }
            });
        } else {
            selectedProducts.forEach((product: ProductTypes) => {
                const index = allProducts.findIndex((p) => p.id_grid === product.id_grid);
                if (index !== -1) { allProducts[index] = {...allProducts[index],...product,};
                }
            });
        }


        allProducts = allProducts.filter(product => product.id_grid !== undefined);

        allProducts.sort((a, b) => a.id_grid! - b.id_grid!);
        const formattedData = allProducts.map(product => {
            const formattedProduct = {
                upc: product.upc,
                idCell: product.id_grid,
                masterBrand: product.master_brand,
                brand: product.brand,
                description: product.desc,
                category: categoriesData.find((category: categoriesInterface) => category.id_category === product.id_category)?.name_category,
                variety: (() => {
                    if (Array.isArray(product?.variety_set)) {
                        if (product.variety_set.length === 0) {
                            return product.variety;
                        }
                        if (product.variety_set.includes('Selected Varieties')) {
                            return 'Selected Varieties';
                        }
                        if (product.variety_set.includes('Assorted Varieties')) {
                            return 'Assorted Varieties';
                        }
                        if (product.variety_set.length > 4) {
                            return 'Selected Varieties';
                        }
                        return product.variety_set.join(', ');
                    }

                    return product.variety;
                })(),
                pack_Size: Array.isArray(product.size) ? product.size.join(', ') : product.size,
                qualityCf: product.quality_cf,
                typeOfMeat: product.type_of_meat,
                typeOfCutVariety: product.type_of_cut,
                price: product.price,
                notes: product.notes,
                burst: Number(product.burst),
                addl: product.addl !== '0' && product.addl !== '' ? `with add'l $${product.addl} purchase or more` : '',
                limit: product.limit ? `Limit ${product.limit}` : '',
                must_buy: product.must_buy ? `Must Buy ${product.must_buy}` : '',
                with_cart: product.with_card,
                per: product.per,
                limit_type: product.limit_type,
                pack: product.pack,
                count: product.count,
                w_simbol: product.w_simbol,
                embase: product.embase,
                upcImage2 : product.image2,
                url_image : product.url_image,
            };

            console.log('Producto formateado:', formattedProduct);
            return formattedProduct;
        });

        console.log('Todos los productos formateados:', formattedData);

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


    } catch (error) {
        console.error('Error al interactuar con Google Sheet:', error);
        throw error;
    }
}
