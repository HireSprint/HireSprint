const safeLocalStorage = {
    getItem: (key: string) => {
      if (typeof window !== 'undefined') {
        try {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        } catch {
          return null;
        }
      }
      return null;
    },
  
    setItem: (key: string, value: any) => {
      if (typeof window !== 'undefined') {
        try {
          const totalSize = new Blob([JSON.stringify(value)]).size;
          if (totalSize > 4800000) {
            if (key === 'selectedProducts' || key === 'circularProducts') {
              const reducedData = Array.isArray(value) ? 
                value.slice(-100) :
                value;
              localStorage.setItem(key, JSON.stringify(reducedData));
              return;
            }
          }
          localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error('Error al guardar en localStorage:', error);
          localStorage.clear();
          try {
            localStorage.setItem(key, JSON.stringify(value));
          } catch {
            console.error('No se pudo guardar incluso después de limpiar');
          }
        }
      }
    }
  };
  
  export { safeLocalStorage };