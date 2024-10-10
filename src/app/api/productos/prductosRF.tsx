import Airtable from "airtable";

// Inicializa la base de Airtable
const baseRF = new Airtable({ apiKey: 'pat43oy35gnnqisLE.00e929837212ed5b878c453028fd6dbe7275950a15d764ebdc3152174d5c4edc' }).base('app1cSmD9pprWVvGd');

export const getProductsRF = async (searchTerm = '') => {
  return new Promise((resolve, reject) => {
    const allProducts = [];

    // Filtros para buscar por nombre
    const filterFormula = searchTerm ? 
      SEARCH('${searchTerm}', {Product_Name}) : 
      '';

    baseRF('Products-RF').select({
      view: "Grid view",
      filterByFormula: filterFormula
    }).eachPage(
      function page(records, fetchNextPage) {
        records.forEach(function(record) {
          const attachments = record.get('Product_Image');
          const imageUrl = attachments && attachments.length > 0 ? attachments[0].url : '';
          allProducts.push({
            id: record.id,
            name: record.get('Product_Name'),
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

export const getProductsByTableName = async (tableName) => {
  return new Promise((resolve, reject) => {
    const allProducts = [];

    // Asegúrate de que 'Table_Name' sea el nombre correcto del campo
    baseRF('Products-RF').select({
      view: "Grid view",
      filterByFormula: `{Table_Name} = '${tableName}'`
    }).eachPage(
      function page(records, fetchNextPage) {
        records.forEach(function(record) {
          const attachments = record.get('Product_Image');
          const imageUrl = attachments && attachments.length > 0 ? attachments[0].url : '';
          allProducts.push({
            id: record.id,
            name: record.get('Product_Name'),
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