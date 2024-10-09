import Image from 'next/image'
import React, { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

function MyDropzone({ className }: { className: string }) {
  const [files, setFiles] = useState<any[]>([]) 
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

  return (
    <form>
      <div {...getRootProps({ className })}>
        <input {...getInputProps()} />
        {
          isDragActive ? (
            <p>Arrastra las Imágenes Aquí...</p>
          ) : (
            <p className='cursor-pointer'>Añadir Imagen</p>
          )
        }
      </div>

      <ul>
        {files.map((file) => (
          <li key={file.name}>
            <Image src={file.preview} alt={file.name} width={100} height={100} />
          </li>
        ))}
      </ul>
    </form>
  )
}

export default MyDropzone
