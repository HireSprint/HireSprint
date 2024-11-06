import React, {useState} from 'react';

const ProductContainer: React.FC = () => {
    const [activeTab, setActiveTab] = useState('all');
    return (
        <div className="flex h-screen w-[450px] bg-white rounded-lg shadow-md overflow-hidden">


            {/* Sección de Productos */}
            <div className="flex-grow p-3 mt-4">
                {/* Barra de Búsqueda */}
                <input type="text" placeholder="Buscar Producto"
                       className="w-full p-2 mb-3 border border-gray-300 rounded"/>

                {/* Pestañas Superiores */}
                <div className="flex gap-2 mb-1">
                    <button
                        className={`px-3 py-1 bg-transparent text-sm ${
                            activeTab === 'all' ? 'border-b-2 border-green-400 text-black' : 'text-gray-400'
                        }`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Products
                    </button>
                    <button
                        className={`px-3 py-1 bg-transparent text-sm ${
                            activeTab === 'circular' ? 'border-b-2 border-green-400 text-black' : 'text-gray-400'
                        }`}
                        onClick={() => setActiveTab('circular')}
                    >
                        En Circular
                    </button>
                </div>

                {/* Subcategorías */}
                {activeTab === 'all' && (
                    <div
                        className="flex-grow p-3 mt-4 overflow-y-auto h-[calc(100vh-150px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <div className="flex justify-center items-center flex-wrap gap-2 mb-3">
                            <button
                                className="p-1.5 bg-white rounded border-2 border-gray-200 text-xs text-black w-[90px] h-[50px]">Sub
                                Categoría 1
                            </button>
                            <button
                                className="p-1.5 bg-white rounded border-2 border-gray-200 text-xs text-black w-[90px] h-[50px]">Sub
                                Categoría 2
                            </button>
                            <button
                                className="p-1.5 bg-white rounded border-2 border-gray-200 text-xs text-black w-[90px] h-[50px]">Sub
                                Categoría 3
                            </button>
                            <button
                                className="p-1.5 bg-white rounded border-2 border-gray-200 text-xs text-black w-[90px] h-[50px]">Sub
                                Categoría 4
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Aquí se agregarán los productos */}
                            <button
                                className="p-4 bg-white rounded-2xl w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 1</p>
                            </button>
                            <button
                                className="p-4 bg-white rounded-2xl  w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 2</p>
                            </button>
                            <button
                                className="p-4 bg-white rounded-2xl  w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 3</p>
                            </button>
                            <button
                                className="p-4 bg-white rounded-2xl  w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 4</p>
                            </button>
                            <button
                                className="p-4 bg-white rounded-2xl  w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 5</p>
                            </button>
                            <button
                                className="p-4 bg-white rounded-2xl w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 6</p>
                            </button>
                            <button
                                className="p-4 bg-white rounded-2xl  w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 7</p>
                            </button>
                            <button
                                className="p-4 bg-white rounded-2xl w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 8</p>
                            </button>
                        </div>
                    </div>
                )};

                {/* Subcategorías */}
                {activeTab === 'circular' && (
                    <div
                        className="flex-grow p-3 mt-4 overflow-y-auto h-[calc(100vh-150px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <div className="flex justify-center items-center flex-wrap gap-2 mb-3">
                            <button
                                className="p-1.5 bg-white rounded border-2 border-gray-200 text-xs text-black w-[90px] h-[50px]">Sub
                                Categoría 1
                            </button>
                            <button
                                className="p-1.5 bg-white rounded border-2 border-gray-200 text-xs text-black w-[90px] h-[50px]">Sub
                                Categoría 2
                            </button>
                            <button
                                className="p-1.5 bg-white rounded border-2 border-gray-200 text-xs text-black w-[90px] h-[50px]">Sub
                                Categoría 3
                            </button>
                            <button
                                className="p-1.5 bg-white rounded border-2 border-gray-200 text-xs text-black w-[90px] h-[50px]">Sub
                                Categoría 4
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Aquí se agregarán los productos */}
                            <button
                                className="p-4 bg-white rounded-2xl w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 1</p>
                            </button>
                            <button
                                className="p-4 bg-white rounded-2xl  w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 2</p>
                            </button>
                            <button
                                className="p-4 bg-white rounded-2xl  w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 3</p>
                            </button>
                            <button
                                className="p-4 bg-white rounded-2xl  w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 4</p>
                            </button>
                            <button
                                className="p-4 bg-white rounded-2xl  w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 5</p>
                            </button>
                            <button
                                className="p-4 bg-white rounded-2xl w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 6</p>
                            </button>
                            <button
                                className="p-4 bg-white rounded-2xl  w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 7</p>
                            </button>
                            <button
                                className="p-4 bg-white rounded-2xl w-48 h-48 flex flex-col items-center justify-between active:bg-gray-300">
                                <div className="w-32 h-36 border-2 border-black rounded-full"></div>
                                <p className="mt-2 text-center text-gray-950 font-medium">Producto 8</p>
                            </button>
                        </div>
                    </div>
                )};
            </div>
        </div>
    );
};

export default ProductContainer;