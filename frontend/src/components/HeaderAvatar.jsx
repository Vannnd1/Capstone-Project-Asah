import React from 'react';
import AvatarDropdown from './AvatarDropdown';
import { useAuth } from '../context/AuthContext';
import { mockUser } from '../mockData'; 

const HeaderAvatar = ({ onLogout, children }) => { 
    const { user } = useAuth();
    
    // Fallback yang aman jika mockUser hilang
    const defaultMockUser = { display_name: 'Siswa', image_path: '/avatars/netflix/nf-1.png' };
    const userMock = mockUser || defaultMockUser;
    
    // KUNCI DATA PERSONALISASI (Reactive terhadap AuthContext)
    const userName = user?.display_name || user?.username || localStorage.getItem('userName') || userMock.display_name || 'Siswa'; 
    const userImagePath = user?.image_path || localStorage.getItem('userAvatarPath') || userMock.image_path || defaultMockUser.image_path; 

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