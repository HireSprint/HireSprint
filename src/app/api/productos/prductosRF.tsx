import Airtable from "airtable";

// Inicializa la base de Airtable
const baseRF = new Airtable({ apiKey: 'pat43oy35gnnqisLE.00e929837212ed5b878c453028fd6dbe7275950a15d764ebdc3152174d5c4edc' }).base('app1cSmD9pprWVvGd');


export const getProductsRF = async () => {
  return new Promise((resolve, reject) => {
    const allProducts = [ ];

    baseRF('Products-RF').select({
      view: "Grid view"
    }).eachPage(
      function page(records, fetchNextPage) {
        records.forEach(function(record) {
          allProducts.push({
            id: record.id,
            name: record.get('Product_Name'),

          });
        });

        fetchNextPage(); 
      },
      function done(err) {
        if (err) {
          console.error(err);
          reject(err); // Rechazar en caso de error
        } else {
          resolve(allProducts); // Resolver con todos los productos
        }
      }
    );
  });
};

