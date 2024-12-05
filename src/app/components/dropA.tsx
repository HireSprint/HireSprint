import Image from 'next/image'
import React, { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

type FileWithPreview = File & { preview: string };

function MyDropzone({ className }: { className: string }) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [scale, setScale] = useState(1.5); // Valor inicial ajustado si es necesario
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, offsetX: 0, offsetY: 0 });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) => {
          const preview = URL.createObjectURL(file);
          return Object.assign(file, { preview });
        }),
      ]);
    } else {
      console.error('No se aceptaron archivos.');
    }
  }, []);

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.1 : -0.1;
    setScale((prevScale) => Math.max(prevScale + delta, 0.1));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const imgContainer = e.currentTarget as HTMLDivElement;
    setIsDragging(true);

    const offsetX = e.clientX - imgContainer.offsetLeft;
    const offsetY = e.clientY - imgContainer.offsetTop;

    setPosition({ x: imgContainer.offsetLeft, y: imgContainer.offsetTop, offsetX, offsetY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - position.offsetX;
      const newY = e.clientY - position.offsetY;

      setPosition((prevPosition) => ({ ...prevPosition, x: newX, y: newY }));
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleRemoveImage = (fileName: string) => {
    setFiles((files) => files.filter((file) => file.name !== fileName));
  };


  return (
    <form>
    {files.length === 0 && (
      <div {...getRootProps({ className })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="border-2 border-black w-8 h-8">Arrastra las Imágenes Aquí...</p>
        ) : (
          <p>Añadir Imagen</p>
        )}
      </div>
    )}

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
                cursor: isDragging ? 'grab' : 'grabbing',
              }}
            >
              <button
              type="button"
              onClick={() => handleRemoveImage(file.name)}
              className=' absolute right-2 top-2 bg-red-600 text-white rounded-full p-2 cursor-pointer w-10 h-10 '
            >
              X
            </button>
              <Image
                src={file.preview}
                alt={file.name}
                width={500}
                height={500}
                draggable={false}
                className='draggable-image object-contain'
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


