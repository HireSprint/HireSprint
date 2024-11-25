import { NextApiResponse } from "next";
import { NextApiRequest } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!process.env?.API_URL) {
            return res.status(400).json({ 
                error: "API_URL no está definido en la configuración." 
            });
        }

        const resp = await fetch(`${process.env.API_URL}/getCirculars`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!resp.ok) {
            return res.status(resp.status).json({ 
                error: `Error en la respuesta de la API: ${resp.statusText}` 
            });
        }

        const respCirculars = await resp.json();

        if (respCirculars.status === 200) {
            return res.status(200).json(respCirculars);
        } else {
            return res.status(400).json({ 
                error: respCirculars.message || "Error desconocido" 
            });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ 
            error: "Error interno del servidor" 
        });
    }
};
