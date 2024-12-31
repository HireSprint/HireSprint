import { clientType } from "@/types/clients";
import { toast } from "react-toastify";


export const sendToDiscordUpcNotFound = async (invalidUpcs: string[], formData: any, clientes: any[]) => {
    
    if (!invalidUpcs || invalidUpcs.length === 0) return;
    
    const webhookUrl = "https://discordapp.com/api/webhooks/1320767862679404616/xfjoTxLs1GiElTvNXlvTZ3v5mshze7fsc_VSioY-k-7YpshTS9Hg0h8favT1_ye3lPtX";
    
    const clientDatos = clientes.find((item:clientType) => Number(formData?.idClient) === item.id_client);
    
    const message = {
        content: `⚠️ Usuario UPCs Inválidos Detectados:`,
        embeds: [{
            title: `Detalles del Circular`,
            description: `**Nombre:** ${formData.circularName}\n**Semana:** ${formData.weekCircular}\n**Fecha:** ${formData.dateCircular}\n**Cliente:** ${clientDatos?.client_name}`,
            fields: [
                {
                    name: "UPCs Inválidos",
                    value: invalidUpcs.join('\n'),
                },
            ],
            color: 15158332, // Rojo
            timestamp: new Date().toISOString()
        }]
    };
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message)
        });
        
        if (!response.ok) {
            throw new Error('Error al enviar mensaje a Discord');
        }
    } catch (error) {
        console.error('Error:', error);
        toast.error('Error al enviar notificación a Discord');
    }
};


export const SendProductSuggestDiscord = async (imageUrl: string, category: any, newProductForm: any, user: any) => {

    if (!imageUrl.match(/^https?:\/\//i)) {
        toast.error('La URL de la imagen debe comenzar con http:// o https://');
        return;
    }
    
    const webhookUrl = "https://discordapp.com/api/webhooks/1323301355431006228/fmF31YM5xJMLO9JwFmcrAWEEx_jwbNDyU53SSJ7jJ3bNWD4d4wPMby899PDS3d6ld8tV";
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                embeds: [{
                    title: "🆕 Nuevo Producto Sugerido",
                    color: 3447003, 
                    fields: [
                        {
                            name: "👤 Cliente",
                            value: user?.userData?.name || "No especificada",
                            inline: true
                        },
                        {
                            name: "📁 Categoría",
                            value: category.name_category || "No especificada",
                            inline: true
                        },
                        {
                            name: "🏷️ Marca",
                            value: newProductForm.brand || "No especificada",
                            inline: true
                        },
                        {
                            name: "🏢 Marca Principal",
                            value: newProductForm.master_brand || "No especificada",
                            inline: true
                        },
                        {
                            name: "📝 Descripción",
                            value: newProductForm.desc || "No especificada"
                        },
                        {
                            name: "📏 Tamaño",
                            value: newProductForm.size || "No especificado",
                            inline: true
                        },
                        {
                            name: "🔖 Variedad",
                            value: newProductForm.variety || "No especificada",
                            inline: true
                        }
                    ],
                    image: {
                        url: imageUrl
                    },
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: "Sistema de Sugerencias de Productos"
                    }
                }]
            })
        });

        if (!response.ok) {
            throw new Error('Error al enviar la imagen a Discord');
        }
    } catch (error) {
        console.error('Error:', error);
        toast.error('Error al enviar la imagen a Discord');
    }
};