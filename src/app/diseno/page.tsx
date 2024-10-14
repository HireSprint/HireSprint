"use client"
import CardProduct from "../components/card";
import MyDropzone from "../components/dropA";
import { getTableName } from "../api/productos/prductosRF";
import { useState } from "react";
import { useProductContext } from "../context/productContext";
import Draggable from "react-draggable";

interface Product
{
  id: string;
  name: string;
  image: string;
}
interface Grid
{
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  products: Product[];
}

const Diseno = () =>
{
  const [ showProducts, setShowProducts ] = useState( false );
  const { setProducts, setClient } = useProductContext();
  const [ tableName, setTableName ] = useState( "" );
  const [ grids, setGrids ] = useState<Grid[]>( [] );

  const toggleProducts = () => setShowProducts( ( prev ) => !prev );

  const resizeGrid = ( id: number, newWidth?: number, newHeight?: number ) =>
  {
    setGrids( ( prevGrids ) =>
      prevGrids.map( ( grid ) =>
        grid.id === id
          ? {
            ...grid,
            width: newWidth !== undefined ? newWidth : grid.width,
            height: newHeight !== undefined ? newHeight : grid.height,
          }
          : grid
      )
    );
    console.log( newHeight, newWidth )
  };
  const handleSearch = async ( e: React.FormEvent ) =>
  {
    e.preventDefault();
    try
    {
      const fetchedProducts = await getTableName( tableName );
      setProducts( fetchedProducts );
      setClient( tableName );
    } catch ( error )
    {
      console.error( "Error al obtener los productos:", error );
    }
  };

  const addGrid = () =>
  {
    const newGrid: Grid = {
      id: grids.length + 1,
      x: 0,
      y: 0,
      width: 180,
      height: 150,
      products: [],
    };
    setGrids( [ ...grids, newGrid ] );
  };


  const removeGrid = ( id: number ) =>
  {
    setGrids( ( prevGrids ) => prevGrids.filter( ( grid ) => grid.id !== id ) );
  };

  const handleProductSelect = ( product: Product ) =>
  {
    const availableGrid = grids.find( ( grid ) => grid.products.length === 0 );

    if ( !availableGrid )
    {
      console.error( "No hay cuadros disponibles para asignar el producto." );
      return;
    }

    setGrids( ( prevGrids ) =>
      prevGrids.map( ( grid ) =>
        grid.id === availableGrid.id
          ? { ...grid, products: [ ...grid.products, product ] }
          : grid
      )
    );
  };



  return (
    <div className="relative flex flex-col h-screen items-center">
      <div className="m-4 flex">
        <form onSubmit={ handleSearch } className="flex space-x-2">
          <input
            type="text"
            value={ tableName }
            onChange={ ( e ) => setTableName( e.target.value ) }
            className="p-2 text-center text-black"
            placeholder="Nombre de la tabla"
          />
          <button type="submit" className="bg-green-200 text-black p-2">
            Sincronizar Tienda
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 w-11/12 h-[90%] space-x-2">
        <div className="border-2 border-black flex justify-center items-center">
          <MyDropzone className="border-green-400 border-2 text-green-500 p-4 cursor-pointer" />
        </div>
        <div className="border-2 border-black flex justify-center items-center">
          <MyDropzone className="border-green-400 border-2 text-green-500 p-4 cursor-pointer" />
        </div>
      </div>



      <div className="absolute cursor-pointer top-2/4 left-2/4">
        { grids.map( ( grid ) => (
          <div
            key={ grid.id }
            className="absolute"
            style={ {
              width: grid.width,
              height: grid.height,
              top: `${ grid.y }px`,
              left: `${ grid.x }px`,
            } }
          >
            <Draggable>
              <div className="border border-blue-500 bg-white p-2" style={ { height: '100%', width: '100%' } }>
                <div className="flex space-x-1 relative bottom-12 left-0">
                  <button
                    onClick={ () => resizeGrid( grid.id, grid.width + 10, undefined ) }
                    className="bg-green-500 p-1 rounded"
                  >
                    +W
                  </button>
                  <button
                    onClick={ () => resizeGrid( grid.id, grid.width - 10, undefined ) }
                    className="bg-green-500 p-1 rounded"
                  >
                    -W
                  </button>
                  <button
                    onClick={ () => resizeGrid( grid.id, undefined, grid.height + 10 ) }
                    className="bg-blue-500 p-1 rounded"
                  >
                    +H
                  </button>
                  <button
                    onClick={ () => resizeGrid( grid.id, undefined, grid.height - 10 ) }
                    className="bg-blue-500 p-1 rounded"
                  >
                    -H
                  </button>
                  <button
                    onClick={ () => removeGrid( grid.id ) }
                    className="bg-red-500 text-white p-2 w-fit h-fit rounded"
                  >
                    x
                  </button>
                </div>
                <div className="">
                <p>Cuadro { grid.id }</p>
                  { grid.products.length > 0 ? (
                    grid.products.map( ( product ) => (
                      <div key={ product.id } className="border p-1 w-2/5 h-2/5 ">
                        { product.name }
                      </div>
                    ) )
                  ) : (
                    <p>No hay productos en este cuadro.</p>
                  ) }
                </div>
              </div>
            </Draggable>
          </div>
        ) ) }
      </div>
      <div className="flex space-x-2 ">
      <button
        onClick={ addGrid }
        className="mt-4 bg-green-500 text-white p-2 rounded"
        >
        Añadir Cuadro
      </button>
      <div>
        { showProducts ? (
          <GridProduct onHideProducts={ toggleProducts } onProductSelect={ handleProductSelect } />
        ) : (
          <button
          onClick={ toggleProducts }
          className="mt-4 bg-blue-500 text-white p-2 rounded"
          >
            Mostrar Productos
          </button>
        ) }
      </div>
        </div>
    </div>
  );
};

interface GridProductProps
{
  onHideProducts: () => void;
  onProductSelect: ( product: Product ) => void;
}

const GridProduct: React.FC<GridProductProps> = ( { onHideProducts, onProductSelect } ) =>
{
  const { products } = useProductContext();
  const [ searchTerm, setSearchTerm ] = useState( "" );

  const filteredProducts = products.filter(
    ( product ) =>
      product.name &&
      product.name.toLowerCase().includes( searchTerm.toLowerCase() )
  );

  return (
    <div className="absolute bottom-0 left-0 w-full bg-gray-200 p-4">
      <input
        type="text"
        placeholder="Buscar productos..."
        value={ searchTerm }
        onChange={ ( e ) => setSearchTerm( e.target.value ) }
        className="mb-4 p-2 border rounded "
      />
      <div className="flex overflow-x-auto space-x-4 whitespace-nowrap">
        { filteredProducts.length > 0 ? (
          filteredProducts.map( ( product ) => (
            <CardProduct product={ product } key={ product.id } onProductSelect={ onProductSelect } />
          ) )
        ) : (
          <p>No hay productos disponibles.</p>
        ) }
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={ onHideProducts }
          className="bg-red-500 text-white p-2 rounded"
        >
          Ocultar Productos
        </button>
      </div>
    </div>
  );
};

export default Diseno


