import nextConfig from "../../../../next.config.mjs";

export const getProduct = async () => {
    try {
        const resp = await fetch(`${nextConfig.env.API_URL}/getProduct`, {
            method: "Get",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const respProductos = await resp.json();

        console.log("productos Mongo",respProductos);

        if (respProductos.status == 200) {
            return respProductos;
        }

    }catch(err) {
        console.error(err)
        return err;
    }
}
