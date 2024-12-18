import { ProductTypes } from "@/types/product";

interface RightClickProps {
    gridId: number;
    handleRemoveProduct: (gridId: number) => void;
    handleChangeProduct: (gridId: number) => void;
    onCopyProduct: (product: ProductTypes) => void;
    selectedProduct: ProductTypes | null; // Agregar esta prop
    copiedProduct: ProductTypes | null;
}

const RightClick: React.FC<RightClickProps> = ({
    gridId,
    handleRemoveProduct,
    handleChangeProduct,
    onCopyProduct,
    selectedProduct,
    copiedProduct
}) => {
    return (
        <div className="flex items-center justify-around w-64 bg-[#7cc304] rounded-lg p-2 shadow-md">
            <button
                className="flex flex-col items-center text-gray-600 text-sm hover:scale-105 transition-all duration-300 px-2  border-r border-gray-600"
                onClick={() => handleRemoveProduct(gridId)}
            >
           
                <span>Delete</span>
            </button>
            <button
                className="flex flex-col items-center text-gray-600 text-sm hover:scale-105 transition-all duration-300 px-2 border-r border-gray-600"
                onClick={() => handleChangeProduct(gridId)}
            >
               
                <span>Replace</span>
            </button>
            <button
                className="flex flex-col items-center text-gray-600 text-sm hover:scale-105 transition-all duration-300 px-2"
                onClick={() => selectedProduct && onCopyProduct(selectedProduct)}
            >
             
                <span>Copy</span>
            </button>
        </div>
    )
}

export default RightClick;
