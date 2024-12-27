import React from 'react';

interface ImageFullScreenPreviewInterface {
    urlImage:string;
    setUrlImage: (urlImage:string|null) => void;
}

const ImageFullScreenPreview = ({urlImage,setUrlImage}:ImageFullScreenPreviewInterface) => {

    return(
        <>
            <div onClick={()=>setUrlImage(null)}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-110 p-5">
                <img
                    src={urlImage? urlImage : "http://hiresprintcanvas.dreamhosters.com/products/no-image-1734115532067.png"}
                    alt={"Preview Image"}
                    className="w-1/2 h-3/4 object-contain rounded"
                />
            </div>
        </>
    )
};
export default ImageFullScreenPreview
