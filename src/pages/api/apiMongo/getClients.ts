export const getClients = async () => {
    try {
        const resp = await fetch(`https://hiresprintcanvas.dreamhosters.com/getClients`, {
            method: "Get",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await resp.json();
        if (data.status === 200) {
            return data;
        }
    }catch (e: unknown) {
        console.error(e);

        return {
            status: 500,
            message: e instanceof Error ? e.message : 'An unknown error occurred',
        };
    }
}
