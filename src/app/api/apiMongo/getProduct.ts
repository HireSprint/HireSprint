import nextConfig from "../../../../next.config.mjs";


export const getProduct = async () => {
    try {
        if (!nextConfig.env?.API_URL) {
            throw new Error("API_URL no está definido en la configuración.");
        }

        const resp = await fetch(`${nextConfig.env.API_URL}/getProduct`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!resp.ok) {
            throw new Error(`Error en la respuesta de la API: ${resp.statusText}`);
        }

        const respProductos = await resp.json();

        if (respProductos.status === 200) {
            return respProductos;
        } else {
            throw new Error(respProductos.message || "Error desconocido");
        }

    } catch (err) {
        console.error(err);
        return err as Error;
    }
};
