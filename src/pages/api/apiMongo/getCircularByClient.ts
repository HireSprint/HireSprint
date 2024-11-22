export const getCircularByClient = async (reqBody) => {
    try {
        const resp = await fetch(`https://hiresprintcanvas.dreamhosters.com/getCircularsByClient`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reqBody),
        });
        const data = await resp.json();
        if (data.status === 200) {
            return data;
        }
    }catch (e){
        console.error(e);
        return {
            status: 500,
            message: e.message,
        }
    }
}
