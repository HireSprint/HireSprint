import { NextApiResponse } from "next";
import { NextApiRequest } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!process.env?.API_URL) {
            return res.status(400).json({ 
                error: "API_URL no está definido en la configuración." 
            });
        }

        // No enviar headers de Content-Type para que fetch maneje el FormData correctamente
        const resp = await fetch(`${process.env.API_URL}/createProduct`, {
            method: "POST",
            body: req.body // Enviar el FormData directamente
        });

        if (!resp.ok) {
            const errorData = await resp.json().catch(() => ({ message: resp.statusText }));
            return res.status(resp.status).json({ 
                error: errorData.message || `Error en la respuesta de la API: ${resp.statusText}` 
            });
        }

        const respProductos = await resp.json();

        if (respProductos.status === 200) {
            return res.status(200).json(respProductos);
        } else {
            return res.status(400).json({ 
                error: respProductos.message || "Error desconocido" 
            });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ 
            error: err instanceof Error ? err.message : "Error interno del servidor" 
        });
    }
}