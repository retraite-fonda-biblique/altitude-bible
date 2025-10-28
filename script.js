document.addEventListener('DOMContentLoaded', async () => {
    // Gérer les transitions de page
    document.querySelectorAll('a').forEach(link => {
        // Ignorer les liens externes et les ancres
        if (link.hostname === window.location.hostname && !link.hash && !link.hasAttribute('target')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const destination = this.href;

                // Ajouter les classes de transition
                document.body.classList.add('page-transition');
                
                // Petit délai pour s'assurer que la classe est appliquée
                requestAnimationFrame(() => {
                    document.body.classList.add('fade-out');
                    
                    // Attendre la fin de l'animation avant de changer de page
                    setTimeout(() => {
                        window.location.href = destination;
                    }, 800);
                });
            });
        }
    });
    // Charger le template
    async function loadTemplate() {
        try {
            const response = await fetch('template.html');
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Récupérer le header et le footer du template
            const header = doc.querySelector('header');
            const footer = doc.querySelector('footer');
            
            // Insérer le header au début du body
            document.body.insertBefore(header, document.body.firstChild);
            
            // Insérer le footer à la fin du body
            document.body.appendChild(footer);
            
            // Mettre à jour les liens actifs dans la navigation
            updateActiveLink();
        } catch (error) {
            console.error('Erreur lors du chargement du template:', error);
        }
    }
    
    // Mettre à jour le lien actif dans la navigation
    function updateActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('nav a').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Charger le template au chargement de la page
    await loadTemplate();
});

// Fonction pour jouer la vidéo
function playVideo() {
    const thumbnail = document.querySelector('.video-thumbnail');
    const video = document.getElementById('mainVideo');
    const rightContent = document.querySelector('.right-content');
    
    if (thumbnail && video) {
        // Masquer la miniature
        thumbnail.style.display = 'none';
        
        // Sur mobile, supprimer le fond du conteneur parent
        if (rightContent && window.innerWidth <= 768) {
            rightContent.style.background = 'transparent';
            rightContent.style.padding = '0';
        }
        
        // Afficher et jouer la vidéo
        video.style.display = 'block';
        video.style.position = 'relative';
        
        // Jouer la vidéo
        video.play().catch(error => {
            console.log('Erreur lors de la lecture:', error);
        });
        
        // Sur mobile, proposer le plein écran
        if (window.innerWidth <= 768 && video.requestFullscreen) {
            video.addEventListener('play', function requestFullscreenOnce() {
                // Petite temporisation pour laisser la vidéo se charger
                setTimeout(() => {
                    if (document.fullscreenEnabled || document.webkitFullscreenEnabled) {
                        if (video.requestFullscreen) {
                            video.requestFullscreen();
                        } else if (video.webkitRequestFullscreen) {
                            video.webkitRequestFullscreen();
                        } else if (video.webkitEnterFullscreen) {
                            video.webkitEnterFullscreen();
                        }
                    }
                }, 100);
                video.removeEventListener('play', requestFullscreenOnce);
            });
        }
    }
}

// Script pour la galerie d'images (galerie.html)
// Liste de toutes les images du dossier data
const images = [
    { path: './data/alpes.jpg', title: 'Vue des Alpes' },
    { path: './data/bible.jpg', title: 'Étude biblique' },
    { path: './data/calme_1.jpg', title: 'Moment de calme' },
    { path: './data/calme_2.jpg', title: 'Sérénité' },
    { path: './data/communion.jpg', title: 'Communion' },
    { path: './data/groupe.jpg', title: 'Groupe de participants' },
    { path: './data/conf.jpg', title: 'Conférence' },
    { path: './data/luge.jpg', title: 'Activités de luge' },
    { path: './data/luge_2.jpg', title: 'Moments de luge' },
    { path: './data/messe.jpg', title: 'Célébration' },
    { path: './data/table_2.jpg', title: 'Moment de convivialité' },
    { path: './data/montagnes.jpg', title: 'Vue sur les montagnes' },
    { path: './data/nuit.jpg', title: 'Vue nocturne' },
    { path: './data/pretre.jpg', title: 'Prêtre' },
    { path: './data/rire.jpg', title: 'Moments de joie' },
    { path: './data/table.jpg', title: 'Repas partagé' },
];

let currentImageIndex = 0;

// Fonction pour charger les images dans la grille
function loadGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return; // Si on n'est pas sur la page galerie
    
    grid.innerHTML = '';
    
    images.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.onclick = () => openModal(index);
        
        galleryItem.innerHTML = `
            <img src="${image.path}" alt="${image.title}">
            <div class="gallery-overlay">
                <i class="fas fa-search-plus"></i>
            </div>
        `;
        
        grid.appendChild(galleryItem);
    });
}

// Fonction pour ouvrir le modal avec l'image
function openModal(index) {
    currentImageIndex = index;
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    if (!modal || !modalImage) return;
    
    modalImage.src = images[index].path;
    modalImage.alt = images[index].title;
    modal.classList.add('show');
    
    // Empêcher le défilement de la page
    document.body.style.overflow = 'hidden';
}

// Fonction pour fermer le modal
function closeModal() {
    const modal = document.getElementById('imageModal');
    if (!modal) return;
    
    modal.classList.remove('show');
    
    // Rétablir le défilement de la page
    document.body.style.overflow = 'auto';
}

// Fonction pour image précédente
function previousImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    const modalImage = document.getElementById('modalImage');
    if (!modalImage) return;
    
    modalImage.src = images[currentImageIndex].path;
    modalImage.alt = images[currentImageIndex].title;
}

// Fonction pour image suivante
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    const modalImage = document.getElementById('modalImage');
    if (!modalImage) return;
    
    modalImage.src = images[currentImageIndex].path;
    modalImage.alt = images[currentImageIndex].title;
}

// Initialisation spécifique à la galerie
document.addEventListener('DOMContentLoaded', function() {
    // Charger la galerie si on est sur la page galerie
    if (document.getElementById('galleryGrid')) {
        loadGallery();
        
        // Fermer le modal en cliquant à l'extérieur
        const imageModal = document.getElementById('imageModal');
        if (imageModal) {
            imageModal.onclick = function(event) {
                if (event.target === this) {
                    closeModal();
                }
            };
        }
        
        // Navigation au clavier
        document.addEventListener('keydown', function(event) {
            const modal = document.getElementById('imageModal');
            if (modal && modal.classList.contains('show')) {
                switch(event.key) {
                    case 'Escape':
                        closeModal();
                        break;
                    case 'ArrowLeft':
                        previousImage();
                        break;
                    case 'ArrowRight':
                        nextImage();
                        break;
                }
            }
        });
    }

    // Fonction pour télécharger le flyer
    function setupDownloadFlyer(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', async function() {
                try {
                    const response = await fetch('data/flyer_2026.pdf');
                    const blob = await response.blob();
                    
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = 'flyer_2026.pdf';
                    
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    
                    window.URL.revokeObjectURL(url);
                } catch (error) {
                    console.error('Erreur lors du téléchargement:', error);
                    alert('Erreur lors du téléchargement du flyer. Veuillez réessayer.');
                }
            });
        }
    }

    setupDownloadFlyer('downloadFlyer');
    
    setupDownloadFlyer('downloadFlyerHome');
});
