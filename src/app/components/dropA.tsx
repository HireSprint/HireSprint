import Image from 'next/image'
import React, { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

function MyDropzone({ className }: { className: string }) {
  const [files, setFiles] = useState<any[]>([]) 
  const [scale, setScale] = useState(1); // Estado para el zoom
  const [isDragging, setIsDragging] = useState(false); // Estado para el arrastre
  const [position, setPosition] = useState({ x: 0, y: 0, offsetX: 0, offsetY: 0 }); // Posición de la imagen

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFiles(previousFiles => [
        ...previousFiles,
        ...acceptedFiles.map(file => {
          const preview = URL.createObjectURL(file)
          return Object.assign(file, { preview })
        })
      ])
    } else {
      console.error("No se aceptaron archivos.")
    }
  }, [])

  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview))
    }
  }, [files])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true 
  })

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.1 : -0.1; // Determina la dirección del zoom
    setScale(prevScale => Math.max(prevScale + delta, 0.1)); // Limitar el zoom mínimo
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const imgContainer = e.currentTarget; // Captura el contenedor de la imagen
    const offsetX = e.clientX - imgContainer.offsetLeft; // Distancia desde el borde izquierdo
    const offsetY = e.clientY - imgContainer.offsetTop; // Distancia desde el borde superior

    // Establece la posición inicial de arrastre
    setPosition({
      x: imgContainer.offsetLeft,
      y: imgContainer.offsetTop,
      offsetX,
      offsetY,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - position.offsetX;
      const newY = e.clientY - position.offsetY;

      setPosition(prevPosition => ({
        ...prevPosition,
        x: newX,
        y: newY,
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <form>
      <div {...getRootProps({ className })}>
        <input {...getInputProps()} />
        {/* Oculta el mensaje "Añadir Imagen" si hay al menos una imagen */}
        {files.length === 0 && (isDragActive ? (
          <p className='border-2 border-black w-8 h-8'>Arrastra las Imágenes Aquí...</p>
        ) : (
          <p className='cursor-pointer'>Añadir Imagen</p>
        ))}
      </div>

      <ul>
        {files.map((file) => (
          <li key={file.name}>
            <div
              className='draggable-image-container'
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
            >
              <Image
                src={file.preview}
                alt={file.name}
                width={500}
                height={500}
                className='draggable-image'
                style={{
                  transition: 'transform 0.1s',
                  transform: `scale(${scale})`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </form>
  )
}

export default MyDropzone;


