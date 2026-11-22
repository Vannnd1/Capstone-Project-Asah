// Daftar avatar bawaan bertema kartun & karakter ilustrasi (100% Open-Source / Bebas Lisensi)
export const AVATAR_CATEGORIES = [
  { id: 'all', label: 'Semua', icon: 'Sparkles' },
  { id: 'characters', label: 'Siswa & Karakter', icon: 'Smile' },
  { id: 'robots', label: 'Robot & AI', icon: 'Bot' },
  { id: 'emojis', label: 'Ekspresi & Emoji', icon: 'SmilePlus' },
  { id: 'adventurers', label: 'Petualang Fantasi', icon: 'Shield' },
  { id: 'creatures', label: 'Makhluk Lucu', icon: 'Heart' },
];

export const DEFAULT_AVATARS = [
  // --- SISWA & KARAKTER ILUSTRASI ---
  { id: 'char-felix', name: 'Felix Pelajar', category: 'characters', path: '/avatars/characters/char-felix.svg' },
  { id: 'char-aneka', name: 'Aneka Desainer', category: 'characters', path: '/avatars/characters/char-aneka.svg' },
  { id: 'char-zoe', name: 'Zoe Tech', category: 'characters', path: '/avatars/characters/char-zoe.svg' },
  { id: 'char-leo', name: 'Leo Peneliti', category: 'characters', path: '/avatars/characters/char-leo.svg' },
  { id: 'char-milo', name: 'Milo Kreatif', category: 'characters', path: '/avatars/characters/char-milo.svg' },
  { id: 'char-luna', name: 'Luna Data', category: 'characters', path: '/avatars/characters/char-luna.svg' },
  { id: 'char-kira', name: 'Kira Coder', category: 'characters', path: '/avatars/characters/char-kira.svg' },
  { id: 'char-jasper', name: 'Jasper Mentor', category: 'characters', path: '/avatars/characters/char-jasper.svg' },
  { id: 'char-aria', name: 'Aria Artist', category: 'characters', path: '/avatars/characters/char-aria.svg' },
  { id: 'char-oliver', name: 'Oliver Developer', category: 'characters', path: '/avatars/characters/char-oliver.svg' },
  { id: 'char-maya', name: 'Maya Scientist', category: 'characters', path: '/avatars/characters/char-maya.svg' },
  { id: 'char-noah', name: 'Noah Innovator', category: 'characters', path: '/avatars/characters/char-noah.svg' },

  // --- ROBOT & AI ---
  { id: 'robot-bolt', name: 'Bolt Bot', category: 'robots', path: '/avatars/robots/robot-bolt.svg' },
  { id: 'robot-byte', name: 'Byte Droid', category: 'robots', path: '/avatars/robots/robot-byte.svg' },
  { id: 'robot-cyber', name: 'Cyber Core', category: 'robots', path: '/avatars/robots/robot-cyber.svg' },
  { id: 'robot-echo', name: 'Echo AI', category: 'robots', path: '/avatars/robots/robot-echo.svg' },
  { id: 'robot-gizmo', name: 'Gizmo Tech', category: 'robots', path: '/avatars/robots/robot-gizmo.svg' },
  { id: 'robot-nano', name: 'Nano Unit', category: 'robots', path: '/avatars/robots/robot-nano.svg' },
  { id: 'robot-pixel', name: 'Pixel Bot', category: 'robots', path: '/avatars/robots/robot-pixel.svg' },
  { id: 'robot-spark', name: 'Spark Prime', category: 'robots', path: '/avatars/robots/robot-spark.svg' },
  { id: 'robot-titan', name: 'Titan Mech', category: 'robots', path: '/avatars/robots/robot-titan.svg' },
  { id: 'robot-vortex', name: 'Vortex Bot', category: 'robots', path: '/avatars/robots/robot-vortex.svg' },

  // --- EKSPRESI & EMOJI ---
  { id: 'emoji-happy', name: 'Senyum Ceria', category: 'emojis', path: '/avatars/emojis/emoji-happy.svg' },
  { id: 'emoji-cool', name: 'Kacamata Keren', category: 'emojis', path: '/avatars/emojis/emoji-cool.svg' },
  { id: 'emoji-wink', name: 'Kedip Semangat', category: 'emojis', path: '/avatars/emojis/emoji-wink.svg' },
  { id: 'emoji-star', name: 'Bintang Terang', category: 'emojis', path: '/avatars/emojis/emoji-star.svg' },
  { id: 'emoji-smirk', name: 'Percaya Diri', category: 'emojis', path: '/avatars/emojis/emoji-smirk.svg' },
  { id: 'emoji-laugh', name: 'Tawa Riang', category: 'emojis', path: '/avatars/emojis/emoji-laugh.svg' },
  { id: 'emoji-glasses', name: 'Kutu Buku Pintar', category: 'emojis', path: '/avatars/emojis/emoji-glasses.svg' },
  { id: 'emoji-joy', name: 'Bahagia Penuh', category: 'emojis', path: '/avatars/emojis/emoji-joy.svg' },
  { id: 'emoji-silly', name: 'Lucu Gemas', category: 'emojis', path: '/avatars/emojis/emoji-silly.svg' },
  { id: 'emoji-party', name: 'Pesta Sukses', category: 'emojis', path: '/avatars/emojis/emoji-party.svg' },

  // --- PETUALANG FANTASI ---
  { id: 'adv-alex', name: 'Alex Pengelana', category: 'adventurers', path: '/avatars/adventurers/adv-alex.svg' },
  { id: 'adv-jordan', name: 'Jordan Ksatria', category: 'adventurers', path: '/avatars/adventurers/adv-jordan.svg' },
  { id: 'adv-morgan', name: 'Morgan Ranger', category: 'adventurers', path: '/avatars/adventurers/adv-morgan.svg' },
  { id: 'adv-riley', name: 'Riley Pemanah', category: 'adventurers', path: '/avatars/adventurers/adv-riley.svg' },
  { id: 'adv-robin', name: 'Robin Petualang', category: 'adventurers', path: '/avatars/adventurers/adv-robin.svg' },
  { id: 'adv-sam', name: 'Sam Paladin', category: 'adventurers', path: '/avatars/adventurers/adv-sam.svg' },
  { id: 'adv-shadow', name: 'Shadow Mage', category: 'adventurers', path: '/avatars/adventurers/adv-shadow.svg' },
  { id: 'adv-taylor', name: 'Taylor Bard', category: 'adventurers', path: '/avatars/adventurers/adv-taylor.svg' },
  { id: 'adv-casey', name: 'Casey Explorer', category: 'adventurers', path: '/avatars/adventurers/adv-casey.svg' },
  { id: 'adv-skyler', name: 'Skyler Guardian', category: 'adventurers', path: '/avatars/adventurers/adv-skyler.svg' },

  // --- MAKHLUK LUCU & MINI ---
  { id: 'blob-blobby', name: 'Blobby Pink', category: 'creatures', path: '/avatars/creatures/blob-blobby.svg' },
  { id: 'blob-gummy', name: 'Gummy Biru', category: 'creatures', path: '/avatars/creatures/blob-gummy.svg' },
  { id: 'blob-sunny', name: 'Sunny Kuning', category: 'creatures', path: '/avatars/creatures/blob-sunny.svg' },
  { id: 'blob-berry', name: 'Berry Ungu', category: 'creatures', path: '/avatars/creatures/blob-berry.svg' },
  { id: 'blob-chubby', name: 'Chubby Hijau', category: 'creatures', path: '/avatars/creatures/blob-chubby.svg' },
  { id: 'blob-sprout', name: 'Sprout Cilik', category: 'creatures', path: '/avatars/creatures/blob-sprout.svg' },
  { id: 'blob-puff', name: 'Puff Oranye', category: 'creatures', path: '/avatars/creatures/blob-puff.svg' },
  { id: 'blob-ziggy', name: 'Ziggy Ceria', category: 'creatures', path: '/avatars/creatures/blob-ziggy.svg' },
];
