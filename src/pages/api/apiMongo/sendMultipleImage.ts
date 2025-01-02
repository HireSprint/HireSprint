
export const sendMultipleImage = async (reqBody: FormData) => {
    try {
        const resp = await fetch(`https://hiresprintcanvas.dreamhosters.com/uploadMultipleImage`, {
            method: "POST",
            body: reqBody,
        });

        const data = await resp.json();
        console.log("consulta", data);

        if (resp.ok) {
            return data;
        } else {
            return null;
        }
    } catch (e: unknown) {
        console.error(e);

        return {
            status: 500,
            message: e instanceof Error ? e.message : 'An unknown error occurred',
        };
    }
};
