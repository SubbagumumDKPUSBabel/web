// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('info-terkini');
    const closeBtn = document.querySelector('.close');
    const infoBtn = document.querySelector('.btn-primary');

    // Open modal when Info Terkini button is clicked
    infoBtn.addEventListener('click', function(e) {
        e.preventDefault();
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    // Close modal when X button is clicked
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// Data section logic (client-side, in-memory)
document.addEventListener('DOMContentLoaded', function() {
    const fileForm = document.getElementById('fileUploadForm');
    const fileInput = document.getElementById('fileInput');
    const linkForm = document.getElementById('linkAddForm');
    const linkTitle = document.getElementById('linkTitle');
    const linkUrl = document.getElementById('linkUrl');
    const cloudFileForm = document.getElementById('cloudFileForm');
    const cloudFileName = document.getElementById('cloudFileName');
    const cloudFileUrl = document.getElementById('cloudFileUrl');
    const cloudFileType = document.getElementById('cloudFileType');
    const fileListEl = document.getElementById('dataFileList');
    const linkListEl = document.getElementById('dataLinkList');
    const cloudFileListEl = document.getElementById('dataCloudFileList');

    if (!fileListEl || !linkListEl || !cloudFileListEl) return;

    const STORAGE_KEY = 'dkpus-data-items';

    function loadItems() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const savedItems = raw ? JSON.parse(raw) : [];
            
            // If no saved items, return sample cloud files for demonstration
            if (savedItems.length === 0) {
                return [
                    {
                        kind: 'cloud-file',
                        name: 'Laporan Keuangan 2024',
                        url: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view',
                        fileType: 'spreadsheet',
                        ts: Date.now() - 86400000
                    },
                    {
                        kind: 'cloud-file',
                        name: 'Proposal Pengembangan Perpustakaan',
                        url: 'https://1drv.ms/w/s!Aq8vQwXqXqXqXqXqXqXqXqXqXqXqXq',
                        fileType: 'document',
                        ts: Date.now() - 172800000
                    },
                    {
                        kind: 'cloud-file',
                        name: 'Presentasi Rapat Koordinasi',
                        url: 'https://docs.google.com/presentation/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
                        fileType: 'presentation',
                        ts: Date.now() - 259200000
                    }
                ];
            }
            
            return savedItems;
        } catch {
            return [];
        }
    }

    function saveItems(items) {
        // Save items to localStorage for cloud files
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function fileToDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function iconFor(nameOrType, cloudType = null) {
        if (cloudType) {
            switch(cloudType) {
                case 'document': return 'file-word';
                case 'spreadsheet': return 'file-excel';
                case 'presentation': return 'file-powerpoint';
                case 'pdf': return 'file-pdf';
                case 'image': return 'file-image';
                case 'video': return 'file-video';
                default: return 'file';
            }
        }
        const lower = (nameOrType || '').toLowerCase();
        if (lower.includes('xls')) return 'file-excel';
        if (lower.includes('doc')) return 'file-word';
        if (lower.includes('pdf')) return 'file-pdf';
        return 'file';
    }

    function render() {
        const items = loadItems();
        const files = items.filter(i => i.kind === 'file');
        const links = items.filter(i => i.kind === 'link');
        const cloudFiles = items.filter(i => i.kind === 'cloud-file');

        function renderList(el, arr, emptyText, isCloudFile = false) {
            el.innerHTML = '';
            if (!arr.length) {
                const empty = document.createElement('li');
                empty.className = 'data-item';
                empty.innerHTML = `<div class="meta"><i class=\"fas fa-info-circle\"></i><span>${emptyText}</span></div>`;
                el.appendChild(empty);
                return;
            }
            arr.forEach((it, visibleIdx) => {
                const li = document.createElement('li');
                li.className = 'data-item';
                const icon = isCloudFile ? iconFor(it.name, it.fileType) : iconFor(it.name || it.type);
                const label = it.kind === 'file' ? it.name : (it.kind === 'cloud-file' ? it.name : (it.title || it.url));
                
                let actions = '';
                if (it.kind === 'file') {
                    actions = `<a href="${it.data}" target="_blank" rel="noopener"><i class="fas fa-eye"></i> Lihat</a>
                              <a href="${it.data}" download="${it.name}"><i class="fas fa-download"></i> Download</a>`;
                } else if (it.kind === 'cloud-file') {
                    actions = `<a href="${it.url}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Buka</a>
                              <a href="${it.url}" target="_blank" rel="noopener"><i class="fas fa-download"></i> Download</a>`;
                } else {
                    actions = `<a href="${it.url}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Buka</a>`;
                }
                
                li.innerHTML = `
                    <div class="meta">
                        <i class="fas fa-${icon}"></i>
                        <span>${label}</span>
                        ${isCloudFile ? `<small class="file-type">${it.fileType}</small>` : ''}
                    </div>
                    <div class="actions">
                        ${actions}
                    </div>
                    <div class="actions"><button data-ts="${it.ts}" class="btn-delete"><i class="fas fa-trash"></i> Hapus</button></div>
                `;
                el.appendChild(li);
            });

            el.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', () => {
                    const ts = Number(btn.getAttribute('data-ts'));
                    const current = loadItems();
                    const idx = current.findIndex(x => x.ts === ts);
                    if (idx >= 0) {
                        current.splice(idx, 1);
                        saveItems(current);
                        render();
                    }
                });
            });
        }

        renderList(fileListEl, files, 'Belum ada file');
        renderList(linkListEl, links, 'Belum ada tautan');
        renderList(cloudFileListEl, cloudFiles, 'Belum ada file cloud', true);
    }

    if (fileForm && fileInput) {
        fileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!fileInput.files || !fileInput.files.length) return;
            const file = fileInput.files[0];
            const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
            if (!allowed.includes(file.type)) {
                showNotification('Format file tidak didukung. Gunakan PDF/DOCX/XLSX.', 'error');
                return;
            }
            const dataUrl = await fileToDataUrl(file);
            const items = loadItems();
            items.unshift({ kind: 'file', name: file.name, type: file.type, data: dataUrl, ts: Date.now() });
            saveItems(items);
            fileInput.value = '';
            showNotification('File berhasil diunggah.', 'success');
            render();
        });
    }

    if (linkForm && linkTitle && linkUrl) {
        linkForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = linkTitle.value.trim();
            const url = linkUrl.value.trim();
            if (!url) return;
            try { new URL(url); } catch { showNotification('URL tidak valid.', 'error'); return; }
            const items = loadItems();
            items.unshift({ kind: 'link', title, url, ts: Date.now() });
            saveItems(items);
            linkTitle.value = '';
            linkUrl.value = '';
            showNotification('Tautan ditambahkan.', 'success');
            render();
        });
    }

    if (cloudFileForm && cloudFileName && cloudFileUrl && cloudFileType) {
        cloudFileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = cloudFileName.value.trim();
            const url = cloudFileUrl.value.trim();
            const fileType = cloudFileType.value;
            
            if (!name || !url || !fileType) {
                showNotification('Semua field harus diisi.', 'error');
                return;
            }
            
            try { 
                new URL(url); 
            } catch { 
                showNotification('URL tidak valid.', 'error'); 
                return; 
            }
            
            // Validasi URL OneDrive atau Google Drive
            const isOneDrive = url.includes('onedrive.live.com') || url.includes('1drv.ms');
            const isGoogleDrive = url.includes('drive.google.com') || url.includes('docs.google.com');
            
            if (!isOneDrive && !isGoogleDrive) {
                showNotification('URL harus dari OneDrive atau Google Drive.', 'error');
                return;
            }
            
            const items = loadItems();
            items.unshift({ 
                kind: 'cloud-file', 
                name, 
                url, 
                fileType, 
                ts: Date.now() 
            });
            saveItems(items);
            cloudFileName.value = '';
            cloudFileUrl.value = '';
            cloudFileType.value = '';
            showNotification('File cloud berhasil ditambahkan.', 'success');
            render();
        });
    }

    render();
});

// Dark mode toggle with persistence
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.querySelector('.theme-toggle');
    const rootBody = document.body;
    const stored = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    function applyTheme(mode) {
        if (mode === 'dark') {
            rootBody.classList.add('dark');
            themeToggle.setAttribute('aria-pressed', 'true');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            rootBody.classList.remove('dark');
            themeToggle.setAttribute('aria-pressed', 'false');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    const initial = stored || (systemPrefersDark ? 'dark' : 'light');
    applyTheme(initial);

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDark = rootBody.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            applyTheme(isDark ? 'dark' : 'light');
        });
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('.navigation');
    if (toggle && navigation) {
        toggle.addEventListener('click', function() {
            const isOpen = navigation.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(isOpen));
        });

        // Close menu when a link is clicked (mobile)
        navigation.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Don't close menu if it's a dropdown toggle
                if (!link.classList.contains('dropdown-toggle') && navigation.classList.contains('open')) {
                    navigation.classList.remove('open');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navigation.contains(e.target) && !toggle.contains(e.target) && navigation.classList.contains('open')) {
                navigation.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const isDarkMode = document.body.classList.contains('dark');
    
    if (window.scrollY > 100) {
        if (isDarkMode) {
            header.style.background = 'rgba(31, 41, 55, 0.95)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
        header.style.backdropFilter = 'blur(20px)';
    } else {
        if (isDarkMode) {
            header.style.background = 'linear-gradient(135deg, #1f2937 0%, #111827 100%)';
        } else {
            header.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)';
        }
        header.style.backdropFilter = 'blur(10px)';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.info-card, .footer-section');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});



// Real-time information updates
function updateRealTimeInfo() {
    const visitorCount = Math.floor(Math.random() * 50) + 100;
    const onlineCount = Math.floor(Math.random() * 30) + 10;
    
    const visitorElement = document.querySelector('.info-card:last-child .card-content p:first-of-type');
    const onlineElement = document.querySelector('.info-card:last-child .card-content p:last-of-type');
    
    if (visitorElement && onlineElement) {
        visitorElement.textContent = `Total: ${visitorCount} pengunjung`;
        onlineElement.textContent = `Online: ${onlineCount} pengunjung`;
    }
}

// Update visitor count every 30 seconds
setInterval(updateRealTimeInfo, 30000);

// Add loading animation for buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.classList.contains('btn-primary')) {
            return; // Don't add loading for modal button
        }
        
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        this.style.pointerEvents = 'none';
        
        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.pointerEvents = 'auto';
        }, 2000);
    });
});

// Add hover effects for cultural figure
document.addEventListener('DOMContentLoaded', function() {
    const culturalFigure = document.querySelector('.cultural-figure');
    
    if (culturalFigure) {
        culturalFigure.addEventListener('mouseenter', function() {
            this.style.transform = 'translate(-50%, -50%) scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        culturalFigure.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }
});

// Add parallax effect to moon background
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const moonBackground = document.querySelector('.moon-background');
    
    if (moonBackground) {
        const rate = scrolled * -0.5;
        moonBackground.style.transform = `translateY(${rate}px)`;
    }
});

// Add typing effect to main heading
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', function() {
    const headings = document.querySelectorAll('.main-heading h1');
    headings.forEach((heading, index) => {
        const text = heading.textContent;
        setTimeout(() => {
            typeWriter(heading, text, 150);
        }, index * 500);
    });
});

// Gallery tabs
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.gallery-tab');
    const panels = {
        foto: document.getElementById('tab-foto'),
        video: document.getElementById('tab-video')
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            Object.values(panels).forEach(p => p.classList.remove('active'));
            const key = this.getAttribute('data-tab');
            if (panels[key]) {
                panels[key].classList.add('active');
            }
        });
    });
});

// Add notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Add notification styles to CSS
const notificationStyles = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Example usage of notifications
document.addEventListener('DOMContentLoaded', function() {
    // Show welcome notification
    setTimeout(() => {
        showNotification('Selamat datang di website Subbagian Umum Dinas Kearsipan dan Perpustakaan Provinsi Kepulauan Bangka Belitung', 'success');
    }, 2000);
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + I for info
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        document.querySelector('.btn-primary').click();
    }
});

// Add tooltip for keyboard shortcuts
document.addEventListener('DOMContentLoaded', function() {
    const infoBtn = document.querySelector('.btn-primary');
    
    infoBtn.title = 'Info Terkini (Ctrl+I)';
});

// Dropdown menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const arrow = dropdown.querySelector('.dropdown-arrow');
        
        // Toggle dropdown on click (both toggle and arrow)
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        });
        
        if (arrow) {
            arrow.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
        
        // Close dropdown on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                dropdown.classList.remove('active');
            }
        });
    });
});

// Lapor Bos form functionality
document.addEventListener('DOMContentLoaded', function() {
    const pengaduanForm = document.getElementById('pengaduanForm');
    
    if (pengaduanForm) {
        pengaduanForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showNotification('Laporan berhasil dikirim! Tim kami akan segera menindaklanjuti laporan Anda.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
});
