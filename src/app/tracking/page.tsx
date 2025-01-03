"use client"

import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/provider/authprovider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface TrackingStatus {
    id: string;
    client: string;
    circular_date: string;
    status: 'pending' | 'in_progress' | 'review' | 'completed';
    last_update: string;
    notes?: string;
}

const TrackingPage = () => {
    const { user } = useAuth();
    const [trackingData, setTrackingData] = useState<TrackingStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        // Aquí cargarías los datos reales de tu API
        const fetchTrackingData = async () => {
            try {
                // Simular datos por ahora
                const mockData: TrackingStatus[] = [
                    {
                        id: '1',
                        client: 'Cliente A',
                        circular_date: '2024-01-15',
                        status: 'in_progress',
                        last_update: new Date().toISOString(),
                        notes: 'En proceso de diseño'
                    },
                    // Añadir más datos de ejemplo
                ];
                setTrackingData(mockData);
                setIsLoading(false);
            } catch (error) {
                toast.error('Error al cargar los datos de tracking');
                setIsLoading(false);
            }
        };

        fetchTrackingData();
    }, []);

    const handleStatusChange = async (id: string, newStatus: TrackingStatus['status']) => {
        try {
            // Aquí iría la llamada a tu API para actualizar el status
            setTrackingData(prev =>
                prev.map(item =>
                    item.id === id
                        ? { ...item, status: newStatus, last_update: new Date().toISOString() }
                        : item
                )
            );
            toast.success('Estado actualizado correctamente');
        } catch (error) {
            toast.error('Error al actualizar el estado');
        }
    };

    const handleNotesChange = async (id: string, notes: string) => {
        try {
            // Aquí iría la llamada a tu API para actualizar las notas
            setTrackingData(prev =>
                prev.map(item =>
                    item.id === id
                        ? { ...item, notes, last_update: new Date().toISOString() }
                        : item
                )
            );
            setEditingId(null);
            toast.success('Notas actualizadas correctamente');
        } catch (error) {
            toast.error('Error al actualizar las notas');
        }
    };

    const getStatusColor = (status: TrackingStatus['status']) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            in_progress: 'bg-blue-100 text-blue-800',
            review: 'bg-purple-100 text-purple-800',
            completed: 'bg-green-100 text-green-800'
        };
        return colors[status];
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#4C9A2A]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#4C9A2A] to-[#5BB032] rounded-2xl p-8 mb-8 text-white">
                    <h1 className="text-3xl font-bold">Tracking de Circulares</h1>
                    <p className="mt-2 opacity-80">Seguimiento de producción por cliente</p>
                </div>

                {/* Tabla de Tracking */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha Circular
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Última Actualización
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Notas
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {trackingData.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{item.client}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {new Date(item.circular_date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                            {item.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {new Date(item.last_update).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === item.id ? (
                                            <input
                                                type="text"
                                                className="w-full px-2 py-1 border rounded"
                                                defaultValue={item.notes}
                                                onBlur={(e) => handleNotesChange(item.id, e.target.value)}
                                                autoFocus
                                            />
                                        ) : (
                                            <div
                                                className="text-sm text-gray-900 cursor-pointer hover:text-[#4C9A2A]"
                                                onClick={() => setEditingId(item.id)}
                                            >
                                                {item.notes || 'Agregar nota...'}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            className="text-sm border rounded px-2 py-1 focus:ring-2 focus:ring-[#4C9A2A] focus:border-transparent"
                                            value={item.status}
                                            onChange={(e) => handleStatusChange(item.id, e.target.value as TrackingStatus['status'])}
                                        >
                                            <option value="pending">Pendiente</option>
                                            <option value="in_progress">En Progreso</option>
                                            <option value="review">En Revisión</option>
                                            <option value="completed">Completado</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default TrackingPage; 