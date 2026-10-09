/**
 * Indian Short Movie - Core Interactive JavaScript
 * Production-ready Vanilla JS for PHP & Standalone Environments
 */

// 20 Verified Indian Short Films
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
    genre: 'Documentary',
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
  },
  {
    id: 'film-7',
    title: 'Nila: Blue Horizon',
    director: 'Arvind Swamy',
    language: 'Tamil',
    genre: 'Romance / Drama',
    duration: '16 mins',
    likesCount: 3420,
    viewsCount: 89300,
    rating: 4.8,
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    synopsis: 'A deaf painter and an acoustic recordist capture the changing sounds of Chennai shores before the monsoons arrive.',
    isFeatured: true,
    status: 'approved'
  },
  {
    id: 'film-8',
    title: 'The Clay Potter of Kutch',
    director: 'Bhavna Patel',
    language: 'Gujarati',
    genre: 'Documentary',
    duration: '19 mins',
    likesCount: 1120,
    viewsCount: 38400,
    rating: 4.7,
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    synopsis: 'The meditative rhythm of salt plains and terracotta wheels in the arid beauty of Gujarat white desert.',
    isFeatured: false,
    status: 'approved'
  },
  {
    id: 'film-9',
    title: 'Midnight Express',
    director: 'Aarav Sharma',
    language: 'Hindi',
    genre: 'Suspense',
    duration: '14 mins',
    likesCount: 2780,
    viewsCount: 71200,
    rating: 4.9,
    posterUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    synopsis: 'A single train compartment, six unacquainted passengers, and an unaddressed telegram that changes everything.',
    isFeatured: true,
    status: 'approved'
  },
  {
    id: 'film-10',
    title: 'Chai & Stories',
    director: 'Ananya Sen',
    language: 'Kannada',
    genre: 'Slice of Life',
    duration: '11 mins',
    likesCount: 1450,
    viewsCount: 29800,
    rating: 4.8,
    posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    synopsis: 'Over steaming clay cups of ginger tea, an artisan and an aspiring animator connect across generational gaps.',
    isFeatured: false,
    status: 'approved'
  },
  {
    id: 'film-11',
    title: 'Kaveri Calling',
    director: 'Chetan Gowda',
    language: 'Kannada',
    genre: 'Folklore',
    duration: '18 mins',
    likesCount: 1840,
    viewsCount: 45600,
    rating: 4.8,
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    synopsis: 'A tribute to Karnataka sacred river valley through the eyes of its village elders.',
    isFeatured: true,
    status: 'approved'
  },
  {
    id: 'film-12',
    title: 'The Silent Ghat',
    director: 'Sourav Mukherjee',
    language: 'Bengali',
    genre: 'Mystery',
    duration: '17 mins',
    likesCount: 1980,
    viewsCount: 52100,
    rating: 4.7,
    posterUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    synopsis: 'A mist-veiled morning on the Hooghly river where an old ferryman reveals a decades-old town mystery.',
    isFeatured: false,
    status: 'approved'
  },
  {
    id: 'film-13',
    title: 'The Amber Loom',
    director: 'Manoj Verma',
    language: 'Hindi',
    genre: 'Drama',
    duration: '15 mins',
    likesCount: 1220,
    viewsCount: 34100,
    rating: 4.6,
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    synopsis: 'A traditional Benarasi silk weaver weaves his ancestral pattern for one final customer.',
    isFeatured: false,
    status: 'approved'
  },
  {
    id: 'film-14',
    title: 'Godavari Rhythms',
    director: 'Venkatesh Rao',
    language: 'Telugu',
    genre: 'Musical / Drama',
    duration: '21 mins',
    likesCount: 2890,
    viewsCount: 84200,
    rating: 4.8,
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    synopsis: 'A celebration of Godavari delta folk musicians seeking to preserve river ballad poetry.',
    isFeatured: true,
    status: 'approved'
  },
  {
    id: 'film-15',
    title: 'Whispers of Sahyadri',
    director: 'Tanvi Joshi',
    language: 'Marathi',
    genre: 'Adventure',
    duration: '20 mins',
    likesCount: 1760,
    viewsCount: 46200,
    rating: 4.7,
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    synopsis: 'Trekkers traversing the historic forts of Shivaji Maharaj uncover an undisturbed cavern archive.',
    isFeatured: false,
    status: 'approved'
  },
  {
    id: 'film-16',
    title: 'The Basavanagudi Postman',
    director: 'Karthik Rao',
    language: 'Kannada',
    genre: 'Slice of Life',
    duration: '13 mins',
    likesCount: 1540,
    viewsCount: 39800,
    rating: 4.8,
    posterUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    synopsis: 'A heartwarming journey of a veteran postman delivering handwritten letters across heritage South Bangalore.',
    isFeatured: true,
    status: 'approved'
  },
  {
    id: 'film-17',
    title: 'Rain over Fort Kochi',
    director: 'Meera Nambiar',
    language: 'Malayalam',
    genre: 'Romance',
    duration: '14 mins',
    likesCount: 2450,
    viewsCount: 68100,
    rating: 4.9,
    posterUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    synopsis: 'Chinese fishing nets, sudden monsoon showers, and two travelers stranded under an antique colonial portico.',
    isFeatured: false,
    status: 'approved'
  },
  {
    id: 'film-18',
    title: 'Kathakali: Face of gods',
    director: 'Suresh Menon',
    language: 'Malayalam',
    genre: 'Art / Culture',
    duration: '25 mins',
    likesCount: 3100,
    viewsCount: 92400,
    rating: 4.9,
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    synopsis: 'Intimate visual poetry revealing the six hours of sacred facial makeup transformation of a master Kathakali artist.',
    isFeatured: true,
    status: 'approved'
  },
  {
    id: 'film-19',
    title: 'The Hyderabad Cafe',
    director: 'Faizan Ahmed',
    language: 'Telugu',
    genre: 'Comedy / Drama',
    duration: '16 mins',
    likesCount: 1890,
    viewsCount: 47200,
    rating: 4.7,
    posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    synopsis: 'A hilarious yet poignant negotiation between three cousins inside an old Irani Chai cafe in Charminar.',
    isFeatured: false,
    status: 'approved'
  },
  {
    id: 'film-20',
    title: 'Shadows of Ahmedabad',
    director: 'Bhavna Patel',
    language: 'Gujarati',
    genre: 'Architectural / Noir',
    duration: '18 mins',
    likesCount: 1670,
    viewsCount: 41900,
    rating: 4.8,
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    synopsis: 'The winding Pols of heritage Ahmedabad, carved wooden Havelis, and an untold story from the 1960s.',
    isFeatured: true,
    status: 'approved'
  }
];

// Store initial fallback demo films
const INITIAL_DEMO_FILMS = JSON.parse(JSON.stringify(DEFAULT_FILMS));

// NEW API INTEGRATION
async function fetchFilmsFromDB() {
  try {
    const ts = new Date().getTime();
    const prefix = window.location.pathname.includes('/admin/') ? '../' : './';
    const res = await fetch(prefix + 'php/api_get_films.php?_t=' + ts, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data) && data.length > 0) {
        // Collect DB film titles and IDs
        const dbTitles = new Set(data.map(f => String(f.title || '').toLowerCase().trim()));
        
        // Find remaining demo films that do not conflict with DB titles
        const remainingDemos = INITIAL_DEMO_FILMS.filter(f => !dbTitles.has(String(f.title || '').toLowerCase().trim()));
        
        DEFAULT_FILMS.length = 0;
        // DB films at the top
        data.forEach(f => DEFAULT_FILMS.push(f));
        // Remaining demo films below
        remainingDemos.forEach(f => DEFAULT_FILMS.push(f));
      } else if (data && Array.isArray(data) && data.length === 0) {
        // If DB returned 0 films, preserve demo catalog
        DEFAULT_FILMS.length = 0;
        INITIAL_DEMO_FILMS.forEach(f => DEFAULT_FILMS.push(f));
      }
      
      // Re-render components across pages
      if (typeof updateHomeHero === 'function') updateHomeHero();
      if (typeof renderHomeTrendingFilms === 'function') renderHomeTrendingFilms();
      if (typeof renderAdminFilmsTable === 'function') renderAdminFilmsTable();
      if (typeof filterCatalog === 'function') filterCatalog();
      if (typeof renderFilmmakersDirectory === 'function') renderFilmmakersDirectory();
    }
  } catch(e) {
    console.error("Failed to fetch films from DB", e);
  }
}

let currentHeroIndex = 0;
let heroAutoSlideTimer = null;

function getFeaturedFilmsList() {
  const featured = DEFAULT_FILMS.filter(f => f.isFeatured);
  return featured.length > 0 ? featured : DEFAULT_FILMS.slice(0, 6);
}

function updateHomeHero() {
  if (!document.getElementById('hero-bg')) return;
  renderHeroSlide(currentHeroIndex);
  startHeroAutoSlide();
}

function startHeroAutoSlide() {
  if (heroAutoSlideTimer) clearInterval(heroAutoSlideTimer);
  heroAutoSlideTimer = setInterval(() => {
    nextHeroSlide();
  }, 7000);
}

function nextHeroSlide() {
  const list = getFeaturedFilmsList();
  if (list.length === 0) return;
  currentHeroIndex = (currentHeroIndex + 1) % list.length;
  renderHeroSlide(currentHeroIndex);
}

function prevHeroSlide() {
  const list = getFeaturedFilmsList();
  if (list.length === 0) return;
  currentHeroIndex = (currentHeroIndex - 1 + list.length) % list.length;
  renderHeroSlide(currentHeroIndex);
}

function renderHeroSlide(index) {
  const list = getFeaturedFilmsList();
  if (list.length === 0) return;

  currentHeroIndex = (index + list.length) % list.length;
  const f = list[currentHeroIndex];

  const bg = document.getElementById('hero-bg');
  const title = document.getElementById('hero-title');
  const director = document.getElementById('hero-director');
  const lang = document.getElementById('hero-lang');
  const duration = document.getElementById('hero-duration');
  const genre = document.getElementById('hero-genre');
  const rating = document.getElementById('hero-rating');
  const synopsis = document.getElementById('hero-synopsis');
  const watchBtn = document.getElementById('hero-watch-btn');
  const watchlistBtn = document.getElementById('hero-watchlist-btn');
  const dotsContainer = document.getElementById('hero-dots-container');

  if (bg) {
    bg.style.opacity = '0.3';
    setTimeout(() => {
      bg.src = f.backdropUrl || f.posterUrl;
      bg.style.opacity = '1';
    }, 150);
  }

  if (title) title.textContent = f.title;
  if (director) director.textContent = 'Dir. ' + (f.director || 'Visionary Filmmaker');
  if (lang) lang.innerHTML = `<i data-lucide="globe" class="w-3.5 h-3.5"></i> ${f.language}`;
  if (duration) duration.innerHTML = `<i data-lucide="clock" class="w-3.5 h-3.5"></i> ${f.duration}`;
  if (genre) genre.textContent = f.genre || 'Drama';
  if (rating) {
    const rVal = f.rating ? (typeof f.rating === 'number' ? f.rating.toFixed(1) : f.rating) : '4.8';
    const votes = f.likesCount ? f.likesCount.toLocaleString() : '1,200';
    rating.innerHTML = `<i data-lucide="star" class="w-3.5 h-3.5 fill-cinema-gold"></i> ${rVal} (${votes} votes)`;
  }
  if (synopsis) synopsis.textContent = f.synopsis;

  const fid = f.id || f.uuid;
  if (watchBtn) watchBtn.setAttribute('onclick', `playFilm('${fid}')`);
  
  const wl = JSON.parse(localStorage.getItem('ism_watchlist') || '[]');
  const inWl = wl.includes(String(fid));
  if (watchlistBtn) {
    watchlistBtn.setAttribute('onclick', `toggleWatchlist('${fid}')`);
    watchlistBtn.innerHTML = inWl
      ? `<i data-lucide="check" class="w-4 h-4 text-cinema-gold"></i> In Watchlist`
      : `<i data-lucide="bookmark" class="w-4 h-4 text-cinema-gold"></i> Watchlist`;
  }

  if (dotsContainer) {
    dotsContainer.innerHTML = list.map((_, i) => `
      <button 
        onclick="renderHeroSlide(${i}); startHeroAutoSlide();" 
        class="h-2 rounded-full transition-all duration-300 ${i === currentHeroIndex ? 'w-8 bg-cinema-accent' : 'w-2 bg-white/40 hover:bg-white/70'}"
        title="Go to slide ${i+1}"
      ></button>
    `).join('');
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Call fetch on load
document.addEventListener('DOMContentLoaded', fetchFilmsFromDB);

// Universal Film Card HTML Generator
function createFilmCardHTML(f) {
  const fid = f.id || f.uuid;
  const wl = JSON.parse(localStorage.getItem('ism_watchlist') || '[]');
  const inWl = wl.includes(String(fid));
  const rVal = f.rating ? (typeof f.rating === 'number' ? f.rating.toFixed(1) : f.rating) : '4.8';
  const imgUrl = f.posterUrl || f.backdropUrl || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80';
  const duration = f.duration || '15 mins';
  const language = f.language || 'Gujarati';
  const director = f.director || 'Independent Director';

  return `
    <div class="group relative flex flex-col w-full">
      <div class="relative aspect-[2/3] min-h-[260px] w-full rounded-2xl overflow-hidden bg-cinema-card border border-cinema-border transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-cinema-accent/60 shadow-lg cursor-pointer" onclick="playFilm('${fid}')">
        <img src="${imgUrl}" alt="${f.title || 'Short Film'}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
        
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button class="w-12 h-12 rounded-full bg-cinema-accent flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <i data-lucide="play" class="w-5 h-5 text-white fill-white ml-0.5"></i>
          </button>
        </div>

        <div class="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <span class="text-[10px] font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-cinema-teal px-2 py-0.5 rounded-md border border-cinema-teal/30 pointer-events-none">
            ${language}
          </span>
          <button
            id="wl-btn-${fid}"
            onclick="event.stopPropagation(); toggleWatchlist('${fid}')"
            title="${inWl ? 'Remove from Watchlist' : 'Add to Watchlist'}"
            style="width:30px;height:30px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;background:${inWl ? 'rgba(229,9,20,0.9)' : 'rgba(0,0,0,0.7)'};backdrop-filter:blur(4px);"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="${inWl ? 'white' : 'none'}" stroke="white" stroke-width="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>

        <div class="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span class="text-[10px] font-bold bg-black/80 backdrop-blur-md text-cinema-gold px-2 py-0.5 rounded-md border border-cinema-gold/30 flex items-center gap-1">
            <i data-lucide="star" class="w-3 h-3 fill-cinema-gold"></i>
            ${rVal}
          </span>
          <span class="text-[10px] font-medium bg-black/80 backdrop-blur-md text-gray-300 px-2 py-0.5 rounded-md flex items-center gap-1">
            <i data-lucide="clock" class="w-2.5 h-2.5"></i>
            ${duration}
          </span>
        </div>
      </div>

      <div class="mt-3 flex flex-col">
        <a href="discover.php" class="font-semibold text-sm text-white hover:text-cinema-accent transition-colors line-clamp-1">
          ${f.title || 'Untitled Film'}
        </a>
        <span class="text-xs text-cinema-muted line-clamp-1 mt-0.5">
          Dir. ${director}
        </span>
      </div>
    </div>
  `;
}

// Home page trending films render
function renderHomeTrendingFilms() {
  const trendingContainer = document.getElementById('home-trending-grid');
  const topRatedContainer = document.getElementById('home-toprated-grid');
  const recentContainer = document.getElementById('home-recent-grid');

  if (!trendingContainer && !topRatedContainer && !recentContainer) return;

  if (DEFAULT_FILMS.length === 0) {
    const emptyHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-16 text-center">
        <div class="w-20 h-20 bg-cinema-card border border-cinema-border rounded-full flex items-center justify-center mx-auto mb-4">
          <i data-lucide="film" class="w-10 h-10 text-cinema-muted"></i>
        </div>
        <h3 class="text-lg font-bold text-white mb-2">No Films Available</h3>
        <p class="text-sm text-cinema-muted max-w-sm">Films added will appear here.</p>
      </div>
    `;
    if (trendingContainer) trendingContainer.innerHTML = emptyHTML;
    if (topRatedContainer) topRatedContainer.innerHTML = emptyHTML;
    if (recentContainer) recentContainer.innerHTML = emptyHTML;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }

  // 1. Trending Grid
  if (trendingContainer) {
    const trending = DEFAULT_FILMS.filter(f => f.isFeatured).concat(DEFAULT_FILMS.filter(f => !f.isFeatured)).slice(0, 10);
    trendingContainer.innerHTML = trending.map(createFilmCardHTML).join('');
  }

  // 2. Top Rated Grid
  if (topRatedContainer) {
    const sortedTop = [...DEFAULT_FILMS].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);
    topRatedContainer.innerHTML = sortedTop.map(createFilmCardHTML).join('');
  }

  // 3. Recent Releases Grid
  if (recentContainer) {
    const recent = [...DEFAULT_FILMS].slice(0, 10);
    recentContainer.innerHTML = recent.map(createFilmCardHTML).join('');
  }
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// Filmmakers Directory Dynamic Renderer
function renderFilmmakersDirectory() {
  const container = document.getElementById('filmmakers-grid');
  if (!container) return;

  if (!DEFAULT_FILMS || DEFAULT_FILMS.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center bg-cinema-surface border border-cinema-border rounded-2xl w-full">
        <i data-lucide="users" class="w-12 h-12 text-cinema-muted mx-auto mb-4"></i>
        <h3 class="text-xl font-bold text-white mb-2">No Filmmakers Listed Yet</h3>
        <p class="text-sm text-cinema-muted mb-4">Submit your short film to be featured in the Filmmakers Directory!</p>
        <button onclick="openSubmitFilmModal()" class="px-5 py-2.5 bg-cinema-accent hover:bg-cinema-accentHover text-white font-bold text-xs rounded-xl">
          + Join as a Filmmaker
        </button>
      </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }

  // Group films by director name
  const directorsMap = {};
  DEFAULT_FILMS.forEach(film => {
    const dirName = (film.director || 'Visionary Director').trim();
    if (!directorsMap[dirName]) {
      directorsMap[dirName] = {
        name: dirName,
        films: [],
        poster: film.posterUrl || film.backdropUrl,
        language: film.language || 'Hindi',
        ratings: []
      };
    }
    directorsMap[dirName].films.push(film);
    if (film.rating) directorsMap[dirName].ratings.push(film.rating);
    if (film.posterUrl && (!directorsMap[dirName].poster || directorsMap[dirName].poster.includes('unsplash'))) {
      directorsMap[dirName].poster = film.posterUrl;
    }
  });

  const directors = Object.values(directorsMap);

  container.innerHTML = directors.map(d => {
    const avgRating = d.ratings.length > 0 ? (d.ratings.reduce((a, b) => Number(a) + Number(b), 0) / d.ratings.length).toFixed(1) : '5.0';
    const filmTitles = d.films.map(f => `"${f.title}"`).join(', ');

    return `
      <div class="creator-card" style="background: #111319; border: 1px solid #262a36; border-radius: 1.5rem; padding: 1.75rem; display: flex; flex-direction: column; align-items: center; text-align: center;">
        <div style="width: 88px; height: 88px; border-radius: 50%; overflow: hidden; border: 2px solid #e50914; margin-bottom: 1rem; background: #1f2330;">
          <img src="${d.poster || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}" alt="${d.name}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <h3 style="font-size: 1.2rem; font-weight: 800; color: #ffffff;">${d.name}</h3>
        <span style="font-size: 0.75rem; color: #66fcf1; font-weight: 600; margin-top: 0.2rem;">Director & Screenwriter</span>
        <span style="font-size: 0.75rem; color: #8e95a5; margin-top: 0.1rem;">India</span>
        <p style="font-size: 0.75rem; color: #8e95a5; line-height: 1.5; margin: 0.85rem 0 1.25rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
          Independent short film creator. Known for ${filmTitles}.
        </p>
        <div style="width: 100%; padding-top: 1rem; border-top: 1px solid rgba(38,42,54,0.6); display: flex; justify-content: space-around; font-size: 0.75rem;">
          <div>
            <div style="font-weight: 800; color: #ffffff;">${d.films.length}</div>
            <div style="color: #8e95a5; font-size: 10px;">Short Films</div>
          </div>
          <div>
            <div style="font-weight: 800; color: #ffb703;">★ ${avgRating}</div>
            <div style="color: #8e95a5; font-size: 10px;">Rating</div>
          </div>
          <div>
            <div style="font-weight: 800; color: #10b981;">${d.language}</div>
            <div style="color: #8e95a5; font-size: 10px;">Language</div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Global Video Modal Handler
function playFilm(filmId) {
  const film = DEFAULT_FILMS.find(f => String(f.id) === String(filmId) || String(f.uuid) === String(filmId));
  const modal = document.getElementById('video-modal');
  const title = document.getElementById('modal-film-title');
  const director = document.getElementById('modal-film-director');
  const desc = document.getElementById('modal-film-desc');
  const player = document.getElementById('modal-video-player');

  if (modal && player && film) {
    if (title) title.textContent = film.title + ' (' + film.language + ' • ' + film.duration + ')';
    if (director) director.textContent = 'Director: ' + (film.director || 'Unknown');
    if (desc) desc.textContent = film.synopsis;

    let vUrl = film.videoUrl || '';
    if (vUrl && !vUrl.startsWith('http://') && !vUrl.startsWith('https://') && !vUrl.startsWith('/')) {
        const prefix = window.location.pathname.includes('/admin/') ? '../' : './';
        vUrl = prefix + vUrl;
    }

    player.src = vUrl;
    modal.style.display = 'flex';
    player.play().catch(e => console.log('Autoplay:', e));
  } else if (!film) {
    console.warn('Film not found for ID:', filmId);
  }
}

function closeVideoModal() {
  const modal = document.getElementById('video-modal');
  const player = document.getElementById('modal-video-player');
  if (player) {
    player.pause();
    player.src = '';
  }
  if (modal) {
    modal.style.display = 'none';
  }
}

// Watchlist LocalStorage
function toggleWatchlist(filmId) {
  let saved = JSON.parse(localStorage.getItem('ism_watchlist') || '[]');
  const id = String(filmId);
  let added;
  if (saved.includes(id)) {
    saved = saved.filter(s => s !== id);
    added = false;
  } else {
    saved.push(id);
    added = true;
  }
  localStorage.setItem('ism_watchlist', JSON.stringify(saved));

  // Update bookmark button icon on card if present
  const btn = document.getElementById('wl-btn-' + filmId);
  if (btn) {
    btn.style.background = added ? 'rgba(229,9,20,0.9)' : 'rgba(0,0,0,0.7)';
    btn.querySelector('svg').setAttribute('fill', added ? 'white' : 'none');
    btn.title = added ? 'Remove from Watchlist' : 'Add to Watchlist';
  }

  // Show toast notification
  showWatchlistToast(added);
}

function showWatchlistToast(added) {
  let toast = document.getElementById('wl-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'wl-toast';
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);background:#181b24;border:1px solid #262a36;color:#fff;font-size:13px;font-weight:600;padding:10px 20px;border-radius:999px;z-index:9999;opacity:0;transition:all 0.3s ease;pointer-events:none;display:flex;align-items:center;gap:8px;box-shadow:0 8px 24px rgba(0,0,0,0.5);';
    document.body.appendChild(toast);
  }
  toast.innerHTML = added
    ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="#e50914" stroke="#e50914" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> Added to Watchlist'
    : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8e95a5" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> Removed from Watchlist';
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 2500);
}

// Close modals on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeVideoModal();
    const subModal = document.getElementById('submit-film-modal');
    if (subModal) subModal.style.display = 'none';
    const signModal = document.getElementById('signin-modal');
    if (signModal) signModal.style.display = 'none';
    const addFilmModal = document.getElementById('add-film-modal');
    if (addFilmModal) addFilmModal.style.display = 'none';
  }
});
