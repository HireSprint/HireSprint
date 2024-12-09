

export const addCircular = async (reqBody:object) => {
    try {
        const resp = await fetch(`https://hiresprintcanvas.dreamhosters.com/createCircular`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reqBody),
        });
        const data = await resp.json();
        console.log("prueba",data);
        if (data.status === 201) {
            return data;
        }else if (data.status === 409) {
            return data;
        }else if(resp.status === 500) {
            return {message:"A type error occurred",status:500};
        }
    }catch (e: unknown) {
        console.error(e);

        return {
            status: 500,
            message: e instanceof Error ? e.message : 'An unknown error occurred',
        };
    }
}
