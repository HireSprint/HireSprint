export const getProductsByCategory = async (reqBody: { category: number }) => {
    try {
        const resp = await fetch(`https://hiresprintcanvas.dreamhosters.com/getProductsByCategory`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                category: reqBody.category,
            }),
        });
        const data = await resp.json();
        if (data.status === 200) {
            return data;
        } else {
            return []
        }
    } catch (e: unknown) {
        console.error(e);
        return {
            status: 500,
            message: e instanceof Error ? e.message : 'Un error desconocido ha ocurrido',
        };
    }
}
