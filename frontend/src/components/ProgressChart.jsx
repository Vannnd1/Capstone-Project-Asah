import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useApp } from '../context/AppContext';

const ProgressChart = ({ data }) => {
    const { darkMode } = useApp();

    // Warna Bar (Kondisional)
    const activeColor = '#3B82F6'; // Blue-500
    const hoverColor = '#2563EB';  // Blue-600

    return (
        <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#374151' : '#E5E7EB'} />
                    
                    {/* XAxis sekarang menggunakan key 'label' (Sen, Sel / Minggu 1, Minggu 2) */}
                    <XAxis 
                        dataKey="label" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }} 
                        dy={10}
                    />
                    
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }} 
                    />
                    
                    <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ 
                            backgroundColor: darkMode ? '#1F2937' : '#FFFFFF', 
                            borderColor: darkMode ? '#374151' : '#E5E7EB',
                            borderRadius: '8px',
                            color: darkMode ? '#FFFFFF' : '#000000'
                        }}
                    />
                    
                    {/* Bar menggunakan key 'value' */}
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={activeColor} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProgressChart;