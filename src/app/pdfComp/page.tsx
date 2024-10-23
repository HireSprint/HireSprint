"use client";
import WebViewer, { WebViewerInstance } from '@pdftron/webviewer';
import { useEffect, useRef, useState } from 'react';

interface CuadroProps {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl?: string;

}

export type { CuadroProps };

const PdfComponent: React.FC = () => {
  const viewer = useRef<HTMLDivElement | null>(null);
  const beenInitialised = useRef<boolean>(false);
  const instanceRef = useRef<WebViewerInstance | null>(null);
  const [cuadros, setCuadros] = useState<CuadroProps[]>([]);
  const [selectedCuadroId, setSelectedCuadroId] = useState<string | null>(null);

  const crearCuadro = (cuadro: CuadroProps) => {
    if (!instanceRef.current) return;
    const { Core } = instanceRef.current;
    const { annotationManager } = Core;
    const rectangleAnnot = new Core.Annotations.RectangleAnnotation();
    rectangleAnnot.X = cuadro.x + cuadros.length * 140;
    rectangleAnnot.Y = cuadro.y;
    rectangleAnnot.Width = cuadro.width;
    rectangleAnnot.Height = cuadro.height;
    rectangleAnnot.LockedContents = true;
    rectangleAnnot.ReadOnly = true;
    rectangleAnnot.IsClickableOutsideRect = true;
    rectangleAnnot.Id = (cuadros.length + 1).toString();
    rectangleAnnot.NoMove = true;
    rectangleAnnot.NoResize = true;
    rectangleAnnot.NoRotate = true;
    rectangleAnnot.CustomData = { type: 'customCuadro' }; // Add custom data to identify our annotations
    annotationManager.addAnnotation(rectangleAnnot);
    annotationManager.redrawAnnotation(rectangleAnnot);
    const newCuadro = { ...cuadro, id: cuadros.length + 1 };
    setCuadros([...cuadros, newCuadro]);
    console.log('Cuadro creado:', newCuadro);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedCuadroId && instanceRef.current) {
      const { Core } = instanceRef.current;
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const annotation = Core.annotationManager
          .getAnnotationsList()
          .find((annot) => annot.Id === selectedCuadroId);
        
        if (annotation) {
          const image = new Image();
          image.src = imageUrl;
          image.onload = () => {
            const tool = new Core.Tools.AddImageContentTool(Core.documentViewer);
            tool.addEventListener(annotation);
            Core.annotationManager.redrawAnnotation(annotation);
          };
        }

        // Actualizar el estado de cuadros
        setCuadros(cuadros.map(cuadro => 
          cuadro.id.toString() === selectedCuadroId ? { ...cuadro, imageUrl } : cuadro
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!beenInitialised.current && viewer.current) {
      beenInitialised.current = true;
      WebViewer({
          fullAPI: true,
          path: '/lib',
          initialDoc: '/file/demo.pdf',
          licenseKey: 'demo:1729194445261:7e1f3970030000000031fed22190e04bc631e1d19e8c1f27f1765967ee',
          ui: 'beta'
        },
        viewer.current
      ).then((instance: WebViewerInstance) => {
        instanceRef.current = instance;
        const { annotationManager } = instance.Core;
        // Add event listener for annotation selection
        annotationManager.addEventListener('annotationSelected', (annotations, action) => {
          if (action === 'selected' && annotations.length > 0) {
            const selectedAnnot = annotations[0];
            if (selectedAnnot.CustomData && selectedAnnot.CustomData.type === 'customCuadro') {
              console.log('Cuadro seleccionado, ID:', selectedAnnot.Id);
              setSelectedCuadroId(selectedAnnot.Id);
              console.log(`Posición del cuadro - X: ${selectedAnnot.X}, Y: ${selectedAnnot.Y}`);
            } else {
              setSelectedCuadroId(null);
            }
          } else {
            setSelectedCuadroId(null);
          }
        });
      });
    }
  }, []);

  return (
    <div>
      <div className="m-8 h-[90vh]" ref={viewer}>
        <div className="absolute bottom-10 space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => crearCuadro({ id: 1, x: 0, y: 300, width: 100, height: 100 })}
          >
            Crear Cuadro
          </button>
        </div>
      </div>
      {selectedCuadroId && (
        <div className="mt-4">
          <p>Cuadro seleccionado: {selectedCuadroId}</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-2"
          />
        </div>
      )}
    </div>
  );
};

export default PdfComponent;
