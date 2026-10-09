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

// Home page trending films render
function renderHomeTrendingFilms() {
  const container = document.getElementById('home-trending-grid');
  if (!container) return;

  const trending = DEFAULT_FILMS.slice(0, 8);
  container.innerHTML = trending.map(f => `
    <div class="film-card" style="background: #111319; border: 1px solid #262a36; border-radius: 1.25rem; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.3s, border-color 0.3s;">
      <div style="position: relative; aspect-ratio: 16/9; background: #0f1117; overflow: hidden; cursor: pointer;" onclick="playFilm('${f.id}')">
        <img src="${f.posterUrl || f.backdropUrl}" alt="${f.title}" style="width: 100%; height: 100%; object-fit: cover;">
        <div style="position: absolute; top: 0.75rem; right: 0.75rem; background: rgba(0,0,0,0.75); padding: 0.25rem 0.5rem; border-radius: 0.4rem; font-size: 10px; font-weight: 700; color: #ffffff;">
          ${f.duration}
        </div>
        <div style="position: absolute; top: 0.75rem; left: 0.75rem; background: rgba(229, 9, 20, 0.9); padding: 0.25rem 0.5rem; border-radius: 0.4rem; font-size: 10px; font-weight: 800; color: #ffffff; text-transform: uppercase;">
          ${f.language}
        </div>
      </div>

      <div style="padding: 1.25rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem; color: #ffb703; font-weight: 700; margin-bottom: 0.25rem;">
            <span>★ ${f.rating}</span>
            <span style="color: #8e95a5; font-weight: normal;">${f.viewsCount.toLocaleString()} views</span>
          </div>
          <h3 style="font-size: 1.05rem; font-weight: 800; color: #ffffff; margin-bottom: 0.2rem;">${f.title}</h3>
          <p style="font-size: 0.75rem; color: #66fcf1; font-weight: 600; margin-bottom: 0.4rem;">Dir. ${f.director}</p>
          <p style="font-size: 0.75rem; color: #8e95a5; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${f.synopsis}</p>
        </div>

        <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid rgba(38,42,54,0.6);">
          <button onclick="playFilm('${f.id}')" style="flex: 1; background: #e50914; color: #ffffff; font-weight: 700; font-size: 0.75rem; padding: 0.5rem; border-radius: 0.5rem; border: none; cursor: pointer;">
            Watch Now
          </button>
          <button onclick="toggleWatchlist('${f.id}')" title="Save to Watchlist" style="background: #181b24; color: #ffffff; border: 1px solid #262a36; padding: 0.5rem; border-radius: 0.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Global Video Modal Handler
function playFilm(filmId) {
  const film = DEFAULT_FILMS.find(f => f.id === filmId) || DEFAULT_FILMS[0];
  const modal = document.getElementById('video-modal');
  const title = document.getElementById('modal-film-title');
  const desc = document.getElementById('modal-film-desc');
  const player = document.getElementById('modal-video-player');

  if (modal && player && film) {
    if (title) title.textContent = film.title + ' (' + film.language + ' • ' + film.duration + ')';
    if (desc) desc.textContent = film.synopsis;
    player.src = film.videoUrl;
    modal.style.display = 'flex';
    player.play().catch(e => console.log('Autoplay:', e));
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
  if (saved.includes(filmId)) {
    saved = saved.filter(id => id !== filmId);
    alert('Removed from your watchlist.');
  } else {
    saved.push(filmId);
    alert('Added to your watchlist!');
  }
  localStorage.setItem('ism_watchlist', JSON.stringify(saved));
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
