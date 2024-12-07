export const getProductsByCircular = async (reqBody:object) => {
    try {
        const resp = await fetch(`https://hiresprintcanvas.dreamhosters.com/getProductsByCircular`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reqBody),
        });

        const data = await resp.json();
        console.log("response",data);
        if (data.status === 200) {
            return data;
        }else {
            return []
        }
    }catch (e: unknown) {
        console.error(e);

        return {
            status: 500,
            message: e instanceof Error ? e.message : 'An unknown error occurred',
        };
    }
}
