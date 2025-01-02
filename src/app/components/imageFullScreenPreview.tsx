import React from 'react';
import Image from 'next/image';

interface ImageFullScreenPreviewInterface {
    urlImage:string;
    setUrlImage: (urlImage:string|null) => void;
}

const ImageFullScreenPreview = ({urlImage,setUrlImage}:ImageFullScreenPreviewInterface) => {

    return(
        <>
            <div onClick={()=>setUrlImage(null)}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-110 p-5">
                <Image
                    src={urlImage? urlImage : "http://hiresprintcanvas.dreamhosters.com/products/no-image-1734115532067.png"}
                    alt={urlImage|| ''}
                    className="w-1/2 h-3/4 object-contain rounded"
                    width={1800}
                    height={960}
                    draggable={false}
                    onContextMenu={(e)=>e.preventDefault()}
                />
            </div>
        </>
    )
};
export default ImageFullScreenPreview
