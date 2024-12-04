import React, { useState } from "react";

const HoverGrid = ({ rows, cols, onSelection }: { rows: number, cols: number, onSelection: (data: any) => void }) => {
  const [hoveredCells, setHoveredCells] = useState<{ row: number, col: number }[]>([]);
  const [selectedCells, setSelectedCells] = useState<{ row: number, col: number }[]>([]);

  const handleMouseEnter = (row: number, col: number) => {
    const newHoveredCells = [];
    for (let r = 0; r <= row; r++) {
      for (let c = 0; c <= col; c++) {
        newHoveredCells.push({ row: r + 1, col: c + 1 });
      }
    }
    setHoveredCells(newHoveredCells);
  };

  const handleClick = () => {
    setSelectedCells(hoveredCells);
    const selectedRows = Math.max(...hoveredCells.map((cell) => cell.row));
    const selectedCols = Math.max(...hoveredCells.map((cell) => cell.col));
    const totalItems = hoveredCells.length;

    // Retorna los datos al componente padre
    onSelection({
      rows: selectedRows,
      cols: selectedCols,
      totalItems,
    });
  };

  return (
    <div
      className="grid gap-[2px]"
      style={{
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
      onMouseLeave={() => setHoveredCells(selectedCells)}
    >
      {Array.from({ length: rows }).map((_, rowIndex) =>
        Array.from({ length: cols }).map((_, colIndex) => {
          const isHovered = hoveredCells.some(
            (cell) => cell.row === rowIndex + 1 && cell.col === colIndex + 1
          );
          const isSelected = selectedCells.some(
            (cell) => cell.row === rowIndex + 1 && cell.col === colIndex + 1
          );
          
          const isOutOfRange = isSelected && !isHovered;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
              onClick={handleClick}
              className={`w-full h-[25px] border-[1px] border-black cursor-pointer ${
                isHovered && !isSelected 
                  ? 'bg-[#7cc304]' 
                  : isSelected 
                    ? isOutOfRange 
                      ? 'bg-red-500'
                      : 'bg-green-600' 
                    : 'bg-white'
              }`}
            ></div>
          );
        })
      )}
    </div>
  );
};

export default HoverGrid;
