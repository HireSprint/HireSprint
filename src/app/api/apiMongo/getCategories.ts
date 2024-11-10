import nextConfig from "../../../../next.config.mjs";


export const getCategories = async () => {
    try {
        if (!nextConfig.env?.API_URL) {
            throw new Error("API_URL no está definido en la configuración.");
        }

        const resp = await fetch(`${nextConfig.env.API_URL}/getCategories`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!resp.ok) {
            throw new Error(`Error en la respuesta de la API: ${resp.statusText}`);
        }

        const respCategories = await resp.json();

        if (respCategories.status === 200) {
            return respCategories;
        } else {
            throw new Error(respCategories.message || "Error desconocido");
        }

    } catch (err) {
        console.error(err);
        return err as Error;
    }
};
