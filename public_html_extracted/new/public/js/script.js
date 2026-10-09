/**
 * Indian Short Movie - Vanilla JavaScript Core Script
 * Production Ready: Home, About, Gallery/Projects, Contact, and Admin Portal
 */

// Default Seed Catalog
const DEFAULT_FILMS = [
  {
    id: 'film-1',
    title: 'The Last Note',
    director: 'Aarav Sharma',
    language: 'Kannada',
    genre: 'Drama',
    duration: '18 mins',
    likesCount: 1420,
    viewsCount: 42300,
    rating: 4.9,
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    synopsis: 'A passionate classical violinist in the mist-laden hills of Chikmagalur struggles to compose his farewell masterpiece while losing his hearing.',
    isFeatured: true,
    status: 'approved'
  },
  {
    id: 'film-2',
    title: 'Maya: Illusions of Malnad',
    director: 'Priya Hegde',
    language: 'Kannada',
    genre: 'Folklore / Mystery',
    duration: '22 mins',
    likesCount: 1890,
    viewsCount: 56100,
    rating: 4.8,
    posterUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    synopsis: 'A folklore researcher visits a sacred grove in Shivamogga and encounters the enigmatic guardian deity of the Western Ghats.',
    isFeatured: true,
    status: 'approved'
  },
  {
    id: 'film-3',
    title: 'Kaalchakra - The Wheel',
    director: 'Vikramaditya Roy',
    language: 'Hindi',
    genre: 'Sci-Fi / Thriller',
    duration: '15 mins',
    likesCount: 2310,
    viewsCount: 78900,
    rating: 4.7,
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    synopsis: 'An antique clockmaker in Varanasi uncovers a rhythmic time-loop apparatus that rewinds the holy city by seven minutes every sunset.',
    isFeatured: false,
    status: 'approved'
  },
  {
    id: 'film-4',
    title: 'Bengaluru 6 AM',
    director: 'Karthik Rao',
    language: 'Kannada',
    genre: 'Drama / Urban',
    duration: '12 mins',
    likesCount: 980,
    viewsCount: 31200,
    rating: 4.6,
    posterUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    synopsis: 'Two strangers meet at an iconic filter coffee darshini in Basavanagudi as the sunrise mist covers the city streets.',
    isFeatured: false,
    status: 'approved'
  },
  {
    id: 'film-5',
    title: 'Vanishing Echoes',
    director: 'Meera Nambiar',
    language: 'Malayalam',
    genre: 'Documentary / Nature',
    duration: '24 mins',
    likesCount: 1650,
    viewsCount: 48900,
    rating: 4.9,
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    synopsis: 'An evocative documentary exploring the ancient ritual songs of the Theyyam performers through nocturnal backwaters.',
    isFeatured: true,
    status: 'approved'
  },
  {
    id: 'film-6',
    title: "Karnad's Solitude",
    director: 'Suhas Kulkarni',
    language: 'Kannada',
    genre: 'Biographical',
    duration: '26 mins',
    likesCount: 2100,
    viewsCount: 65400,
    rating: 4.8,
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    synopsis: 'A tribute to classical Kannada theatre exploring a playwright facing the empty stage before a historic premiere.',
    isFeatured: false,
    status: 'approved'
  }
];

// LocalStorage Helper
function getFilms() {
  try {
    const saved = localStorage.getItem('ism_films');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_FILMS;
}

function saveFilms(films) {
  try {
    localStorage.setItem('ism_films', JSON.stringify(films));
  } catch (e) {
    console.error(e);
  }
}

// Global Modal Handlers
function openVideoModal(filmId) {
  const films = getFilms();
  const film = films.find(f => f.id === filmId) || films[0];
  const modal = document.getElementById('global-video-modal');
  const modalTitle = document.getElementById('modal-film-title');
  const modalVideo = document.getElementById('modal-video-player');

  if (modal && modalVideo && film) {
    modalTitle.textContent = film.title + ' (' + film.duration + ')';
    modalVideo.src = film.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    modal.classList.add('active');
    modalVideo.play().catch(e => console.log('Autoplay prevented', e));
  }
}

function closeVideoModal() {
  const modal = document.getElementById('global-video-modal');
  const modalVideo = document.getElementById('modal-video-player');
  if (modal && modalVideo) {
    modalVideo.pause();
    modalVideo.src = '';
    modal.classList.remove('active');
  }
}

// Carousel Scroll Handlers
function scrollTrack(trackId, direction) {
  const track = document.getElementById(trackId);
  if (track) {
    const amount = direction === 'next' ? 400 : -400;
    track.scrollBy({ left: amount, behavior: 'smooth' });
  }
}

// Mobile Menu Toggle
function toggleMobileNav() {
  const menu = document.getElementById('mobile-nav-menu');
  if (menu) {
    menu.classList.toggle('active');
  }
}

// Contact Form Submission
function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('contact-name')?.value;
  const email = document.getElementById('contact-email')?.value;
  const message = document.getElementById('contact-message')?.value;
  const alertBox = document.getElementById('contact-alert');

  if (!name || !email || !message) {
    alert('Please fill out all required fields.');
    return;
  }

  // Save to messages store
  const existingMsgs = JSON.parse(localStorage.getItem('ism_contact_messages') || '[]');
  existingMsgs.unshift({
    id: 'msg-' + Date.now(),
    name,
    email,
    message,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  });
  localStorage.setItem('ism_contact_messages', JSON.stringify(existingMsgs));

  if (alertBox) {
    alertBox.style.display = 'block';
    alertBox.textContent = 'Thank you! Your message has been received. Our team will contact you shortly.';
  }

  e.target.reset();
}

// Init Page Logic on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Ensure starting at top without delay
  window.scrollTo(0, 0);

  // Close modal on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVideoModal();
  });
});
