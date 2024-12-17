export const getProductLimit = async () => {
    try {
        const resp = await fetch(`https://hiresprintcanvas.dreamhosters.com/getProductLimit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify({
                page: 1,
            }),
        });

        const data = await resp.json();
        if (!resp.ok) {
            return {
                status: resp.status,
                message: "Error en la petición"
            };
        }

        return {
            products: data.products,
            totalProducts: data.totalProducts,
            totalPages: data.totalPages,
            currentPage: data.currentPage,
            status: data.status
        };

    } catch (e: unknown) {
        console.error("Error en getProductLimit:", e);
        return {
            status: 500,
            message: e instanceof Error ? e.message : 'Error desconocido'
        };
    }
}
