export const calculateTotalProduct = (cantidadProductos, productosPorPagina = 100) => {
    if (cantidadProductos < 0 || productosPorPagina <= 0) {
        throw new Error("La cantidad de productos y productos por página deben ser mayores que cero.");
    }
    return Math.ceil(cantidadProductos / productosPorPagina);
};
