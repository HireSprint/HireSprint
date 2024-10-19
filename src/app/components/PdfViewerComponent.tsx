import React, { useEffect, useRef, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import { CardSide } from './card';

interface PDFViewerProps {
  initialCuadros: any;
}

const PdfViewerComponent: React.FC<PDFViewerProps> = ({ initialCuadros }) => {
  const viewer = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<WebViewerInstance | null>(null);
  const beenInitialised = useRef(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);


  const handleCuadroClick = (cuadro: any) => {
    if (!instanceRef.current) return;
    const { Core } = instanceRef.current;
    const product = getProductFromCuadro(cuadro);
    setSelectedProduct(product);
    console.log("Cuadro seleccionado");
  };

  const createCuadros = (cuadrosData: any[]) => {
    if (!instanceRef.current) return;
    const { Core } = instanceRef.current;
    const { annotationManager } = Core;

    cuadrosData.forEach((cuadro) => {
      const rectangleAnnot = new Core.Annotations.RectangleAnnotation();
      rectangleAnnot.PageNumber = 1; // Asegúrate de establecer el número de página correcto
      rectangleAnnot.X = cuadro.x;
      rectangleAnnot.Y = cuadro.y;
      rectangleAnnot.Width = cuadro.width;
      rectangleAnnot.Height = cuadro.height;
      rectangleAnnot.Locked = true; // Deshabilitar edición
      rectangleAnnot.ReadOnly = true; // Hacerlo solo de lectura
    rectangleAnnot.

      annotationManager.addAnnotation(rectangleAnnot);
      annotationManager.redrawAnnotation(rectangleAnnot);
    

      // Añadir evento de clic
      rectangleAnnot.addEventListener('click', () => handleCuadroClick(cuadro));
    });
  };

  useEffect(() => {
    if (!beenInitialised.current && viewer.current) {
      beenInitialised.current = true;
      WebViewer({
          fullAPI: true,
          path: '/lib',
          initialDoc: '/file/demoUpdated.pdf',
          licenseKey: 'demo:1729194445261:7e1f3970030000000031fed22190e04bc631e1d19e8c1f27f1765967ee',
          ui: false,
          disabledElements: [
            'toolsHeader',
            'viewControlsOverlay',
            'menuOverlay',
            'contextMenuPopup',
            'toolbarGroup-Annotate',
            'toolbarGroup-Edit',
            'toolbarGroup-Insert',
            'toolbarGroup-Measure',
            'toolbarGroup-Forms',
            'header', 
          ]
        },
        viewer.current
      ).then((instance: WebViewerInstance) => {
        instanceRef.current = instance;
        const { Core } = instance;
        const { documentViewer, annotationManager } = Core;
        documentViewer.addEventListener('documentLoaded', () => {
          instance.UI.disableTools(['Tools']);
        });

        annotationManager.addEventListener('annotationChanged', (annotations, action) => {
          if (action === 'modify') {
            const updatedCuadros = getUpdatedCuadros();
            setCuadros(updatedCuadros);
          }
        });
      });
    }
  }, []);

  return (
    <div>
      <div className="m-8 h-[70vh]" ref={viewer}>
        {/* Aquí puedes agregar más contenido si es necesario */}
      </div>
      {selectedProduct && <CardSide product={selectedProduct} />}
    </div>
  );
};

export default PdfViewerComponent;
