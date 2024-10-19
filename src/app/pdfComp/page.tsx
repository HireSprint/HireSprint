"use client";
import WebViewer, { WebViewerInstance } from '@pdftron/webviewer';
import { useEffect, useRef, useState } from 'react';

interface CuadroProps {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    imageUrl?: string; 
  }
  
  interface PDFViewerProps {
    initialCuadros: CuadroProps[];

  }

const PdfComponent: React.FC<PDFViewerProps> = ({ initialCuadros }) => {
  const viewer = useRef<HTMLDivElement | null>(null);
  const beenInitialised = useRef<boolean>(false); 
  const instanceRef = useRef<WebViewerInstance | null>(null);
  const [cuadros, setCuadros] = useState<CuadroProps[]>(initialCuadros || []);


  useEffect(() => {
    if (!beenInitialised.current && viewer.current) {
      beenInitialised.current = true;
      WebViewer({
          fullAPI: true,
          path: '/lib',
          initialDoc: '/file/demoUpdated.pdf',
          licenseKey: 'demo:1729194445261:7e1f3970030000000031fed22190e04bc631e1d19e8c1f27f1765967ee',
        },
        viewer.current
      ).then((instance: WebViewerInstance) => {
        instanceRef.current = instance
        const { Core } = instance;
        const { documentViewer, annotationManager } = Core;
        documentViewer.addEventListener('documentLoaded', () => {
          instance.UI.disableTools(['Tools'])
        });

        annotationManager.addEventListener('annotationChanged', (annotations, action) => {
          if (action === 'modify') {
            const updatedCuadros = getUpdatedCuadros();
            setCuadros(updatedCuadros);
          }
        });
      });
    }
  }, [cuadros]);

  const createCuadros = (cuadrosData: CuadroProps[]) => {
    if (!instanceRef.current) return;
    const { Core } = instanceRef.current;
    const { annotationManager } = Core;

    cuadrosData.forEach((cuadro) => {
      const rectangleAnnot = new Core.Annotations.RectangleAnnotation();
      rectangleAnnot.setX(cuadro.x);
      rectangleAnnot.setY(cuadro.y);
      rectangleAnnot.setWidth(cuadro.width);
      rectangleAnnot.setHeight(cuadro.height);
      rectangleAnnot.setContents(`ID: ${cuadro.id}`);
      rectangleAnnot.CustomData = { id: cuadro.id, imageUrl: cuadro.imageUrl };

      annotationManager.addAnnotation(rectangleAnnot);
      annotationManager.redrawAnnotation(rectangleAnnot);
    });
  };

  const getUpdatedCuadros = (): CuadroProps[] => {
    if (!instanceRef.current) return [];
    const { Core } = instanceRef.current;
    const { annotationManager } = Core;

    const annotations = annotationManager.getAnnotationsList();
    return annotations
      .filter((annot) => annot instanceof Core.Annotations.RectangleAnnotation)
      .map((annot) => ({
        id: annot.CustomData.id,
        x: annot.getX(),
        y: annot.getY(),
        width: annot.getWidth(),
        height: annot.getHeight(),
      }));
  };

  const handleCreateCuadro = () => {
    console.log("Current cuadros:", cuadros); 
    if (!instanceRef.current) return;
    const { Core } = instanceRef.current;
    const { annotationManager } = Core;

    const newId = `cuadro-${Date.now()}`;
    const newCuadro: CuadroProps = {
      id: newId,
      x: 100,
      y: 100,
      width: 140,
      height: 80,
    };

    const rectangleAnnot = new Core.Annotations.RectangleAnnotation();
    rectangleAnnot.setX(newCuadro.x);
    rectangleAnnot.setY(newCuadro.y);
    rectangleAnnot.setWidth(newCuadro.width);
    rectangleAnnot.setHeight(newCuadro.height);
    rectangleAnnot.setContents(`ID: ${newCuadro.id}`);
    rectangleAnnot.CustomData = { id: newCuadro.id };

    annotationManager.addAnnotation(rectangleAnnot);
    annotationManager.redrawAnnotation(rectangleAnnot);

    setCuadros((prevCuadros) => [...prevCuadros, newCuadro]);
    console.log(cuadros, newCuadro)
  };

  const handleSave = () => {
    const updatedCuadros = getUpdatedCuadros();
    setCuadros(updatedCuadros);

  };

  return (
    <div>
      <div className="m-8 h-[90vh]" ref={viewer}>
      <div className="absolute bottom-10 space-x-4 ">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleCreateCuadro}>
          Crear Cuadro
        </button>
      </div>
      </div>
    </div>
  );
};

export default PdfComponent
