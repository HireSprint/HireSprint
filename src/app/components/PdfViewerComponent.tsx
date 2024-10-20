import React, { useEffect, useRef, useState } from 'react';
import WebViewer, { Core, WebViewerInstance } from '@pdftron/webviewer';

interface CuadroProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl?: string;
}

interface PdfViewerProps {
  initialCuadros: CuadroProps[];
  onUpdateCuadros: (cuadros: CuadroProps[]) => void;
}

const PdfViewerComponent: React.FC<PdfViewerProps> = ({
  initialCuadros,
  onUpdateCuadros,
}) => {
  const viewer = useRef<HTMLDivElement>(null);
  const [selectedCuadroId, setSelectedCuadroId] = useState<string | null>(null);
  const instanceRef = useRef<WebViewerInstance | null>(null);
  const beenInitialised = useRef<Boolean>(false); 

  useEffect(() => { 
    if (viewer.current && !beenInitialised.current) {
      beenInitialised.current = true; 
      WebViewer(
        {
          path: '/lib',
          initialDoc: '/file/demo2.pdf', 
          licenseKey: 'demo:1729194445261:7e1f3970030000000031fed22190e04bc631e1d19e8c1f27f1765967ee',
          disabledElements: [
            'header'
          ]
        },
        viewer.current
      ).then((instance: WebViewerInstance) => {
        instanceRef.current = instance;
        if (!instanceRef.current) return;
        const { Core } = instanceRef.current; 
        const docViewer = Core.documentViewer;
        docViewer.on('documentLoaded', () => {
          // Crear una anotación personalizada
          const rectangleAnnot = new Core.Annotations.RectangleAnnotation();
          rectangleAnnot.PageNumber = 1; // Asumiendo que es la primera página
          rectangleAnnot.X = 0;
          rectangleAnnot.Y = 300;
          rectangleAnnot.Width = 100; // Ajusta según sea necesario
          rectangleAnnot.Height = 50; // Ajusta según sea necesario
          
          // Personalizar la apariencia si es necesario
          rectangleAnnot.FillColor = new Core.Annotations.Color(255, 255, 0, 0.5);
          rectangleAnnot.StrokeColor = new Core.Annotations.Color(255, 0, 0);

          // Añadir la anotación al documento
          Core.annotationManager.addAnnotation(rectangleAnnot);
          Core.annotationManager.redrawAnnotation(rectangleAnnot);
        });
      });
    }
  }, [initialCuadros]); 


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedCuadroId && instanceRef.current) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const { Core } = instanceRef.current!;
        const annotation = Core.annotationManager
          .getAnnotationsList()
          .find((annot) => annot.Id === selectedCuadroId);
        
        if (annotation) {
          const image = new Image();
          image.src = imageUrl;
          image.onload = () => {
            annotation.setImageData(image);
            Core.annotationManager.redrawAnnotation(annotation);
          };
        }

        const updatedCuadros = initialCuadros.map((cuadro) =>
          cuadro.id === selectedCuadroId ? { ...cuadro, imageUrl } : cuadro
        );
        onUpdateCuadros(updatedCuadros);
      };
      reader.readAsDataURL(file);
    }
  };

  

  return (
    <div>
      <div className="m-8 h-[70vh] w-fit" ref={viewer} />
      {selectedCuadroId && (
        <div>
          <p>Cuadro seleccionado: {selectedCuadroId}</p>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
      )}
    </div>
  );
};

export default PdfViewerComponent;
