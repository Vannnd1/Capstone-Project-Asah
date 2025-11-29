import React from 'react';
import AvatarDropdown from './AvatarDropdown';

import { mockUser } from '../mockData'; 

const HeaderAvatar = ({ onLogout, children }) => { 
    
    // Fallback yang aman jika mockUser hilang
    const defaultMockUser = { display_name: 'Siswa', image_path: '/assets/avatar-default.png' };
    const userMock = mockUser || defaultMockUser;
    
    // KUNCI DATA PERSONALISASI (Menggunakan data yang diimpor)
    const userName = localStorage.getItem('userName') || userMock.display_name || 'Siswa'; 
    const userImagePath = localStorage.getItem('userAvatarPath') || userMock.image_path || defaultMockUser.image_path; 

    return (
        <header className="flex justify-between items-start mb-8"> 
            
            {/* Sisi Kiri Header: Menerima dan merender children (Judul dan Deskripsi) */}
            <div className="flex-1 pr-8"> 
                {children}
            </div>

            {/* Sisi Kanan Header: Avatar Dropdown */}
            <div className="ml-auto">
                <AvatarDropdown 
                    onLogout={onLogout} 
                    userImagePath={userImagePath}
                    userName={userName}
                />
            </div>
        </header>
    );
};

export default HeaderAvatar;