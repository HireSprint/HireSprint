interface RightClickProps {
    productId: string;
    handleRemoveProduct: (productId: string) => void;
    handleEditProduct: (productId: string) => void;
    handleChangeProduct: (productId: string) => void;
}

const RightClick: React.FC<RightClickProps> = ({
    productId,
    handleRemoveProduct,
    handleEditProduct,
    handleChangeProduct
}) => {
    return (
        <div className=" absolute flex flex-col items-center justify-center w-36 bg-[#393939] rounded">
            <button className=" text-white w-full h-full hover:scale-105 transition-all duration-300 hover:bg-[#7cc304]" onClick={() => handleRemoveProduct(productId)}>
                Eliminar
            </button>
            <button className=" text-white w-full h-full hover:scale-105 transition-all duration-300 hover:bg-[#7cc304]" onClick={() => handleEditProduct(productId)}>
                Editar
            </button>
            <button className=" text-white w-full h-full hover:scale-105 transition-all duration-300 hover:bg-[#7cc304]" onClick={() => handleChangeProduct(productId)}>
                Cambiar
            </button>
        </div>
    )
}

export default RightClick;
