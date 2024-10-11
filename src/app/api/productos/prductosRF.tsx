
import Airtable from "airtable";



const baseRF = new Airtable({ apiKey: 'pat43oy35gnnqisLE.00e929837212ed5b878c453028fd6dbe7275950a15d764ebdc3152174d5c4edc' }).base('app1cSmD9pprWVvGd');
interface Product {
  id: string;
  name: string;
  image: string;
}
export const getProductsRF = async (searchTerm = ''): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    const allProducts: Product[] = []; 
    const filterFormula = searchTerm ? 
      `SEARCH('${searchTerm}', {Product_Name})` : 
      ''; 

    baseRF('Products-RF').select({
      view: "Grid view",
      filterByFormula: filterFormula
    }).eachPage(
      function page(records, fetchNextPage) {
        records.forEach(function(record) {
          const attachments = record.get('Product_Image') as { url: string }[] | undefined;
          const imageUrl = attachments && attachments.length > 0 ? attachments[0].url : '';

          allProducts.push({
            id: record.id,
            name: record.get('Product_Name') as string,
            image: imageUrl
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


export const getTableName = async (tableName = ''): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    const allProducts: Product[] = [];

    if (!tableName) {
      reject(new Error('El nombre de la tabla no puede estar vacío.'));
      return;
    }

    baseRF(tableName).select({
      view: "Grid view", 
    }).eachPage(
      function page(records, fetchNextPage) {
        records.forEach(function (record) {
          const attachments = record.get('Product_Image (from Products-RF)') as { url: string }[] | undefined;
          const imageUrl = attachments && attachments.length > 0 ? attachments[0].url : '';
          
          const names = record.get('Product_Name (from Products-RF)') as string[] | undefined; 
          const productName = names && names.length > 0 ? names[0] : 'Sin nombre'; 

          allProducts.push({
            id: record.id,
            name: productName, 
            image: imageUrl,
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
