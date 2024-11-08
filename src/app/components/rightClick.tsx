
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
        <div className="flex items-center justify-around w-64 bg-[#7cc304] rounded-lg p-2 shadow-md">
            <button
                className="flex flex-col items-center text-gray-600 text-sm hover:scale-105 transition-all duration-300 px-2  border-r border-gray-600"
                onClick={() => handleRemoveProduct(productId)}
            >
           
                <span>Eliminar</span>
            </button>
            <button
                className="flex flex-col items-center text-gray-600 text-sm hover:scale-105 transition-all duration-300 px-2 border-r border-gray-600"
                onClick={() => handleChangeProduct(productId)}
            >
               
                <span>Reemplazar</span>
            </button>
            <button
                className="flex flex-col items-center text-gray-600 text-sm hover:scale-105 transition-all duration-300 px-2"
                onClick={() => handleEditProduct(productId)}
            >
             
                <span>Editar</span>
            </button>
        </div>
    )
}

export default RightClick;
