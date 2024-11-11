import nextConfig from "../../../../next.config.mjs";


export const getCategory = async () => {
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

        const respCategory = await resp.json();

        if (respCategory.status === 200) {
            return respCategory;
        } else {
            throw new Error(respCategory.message || "Error desconocido");
        }

    } catch (err) {
        console.error(err);
        return err as Error;
    }
};
