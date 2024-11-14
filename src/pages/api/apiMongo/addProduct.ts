import { NextApiResponse } from "next";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!process.env?.API_URL) {
            return res.status(400).json({error: "API_URL no está definido en la configuración."});
        }

        // Realizar fetch sin encabezado `Content-Type`
        const resp = await fetch(`${process.env.API_URL}/createProduct`, {
            method: "POST",
            body: req.body,
        });

        if (!resp.ok) {
            return res.status(resp.status).json({
                error: `Error en la respuesta de la API: ${resp.statusText}`,
            });
        }

        const respProductos = await resp.json();
        return res.status(respProductos.status || 200).json(respProductos);

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Error interno del servidor",
        });
    }
}

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     try {
//         if (!process.env?.API_URL) {
//             return res.status(400).json({
//                 error: "API_URL no está definido en la configuración."
//             });
//         }
//
//         const resp = await fetch(`${process.env.API_URL}/createProduct`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: req.body
//         });
//
//         if (!resp.ok) {
//             return res.status(resp.status).json({
//                 error: `Error en la respuesta de la API: ${resp.statusText}`
//             });
//         }
//
//         const respProductos = await resp.json();
//
//         if (respProductos.status === 200) {
//             return res.status(200).json(respProductos);
//         } else {
//             return res.status(400).json({
//                 error: respProductos.message || "Error desconocido"
//             });
//         }
//
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({
//             error: "Error interno del servidor"
//         });
//     }
// };
