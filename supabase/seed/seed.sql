-- Seed Data for Indian Short Films Platform
-- Marked as Demo Content for Development & Testing

-- 1. SEED LANGUAGES
INSERT INTO public.languages (id, name, code, native_name) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Hindi', 'hi', 'हिन्दी'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Gujarati', 'gu', 'ગુજરાતી'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Tamil', 'ta', 'தமிழ்'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Telugu', 'te', 'తెలుగు'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Malayalam', 'ml', 'മലയാളം'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Kannada', 'kn', 'கன்னட'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'Marathi', 'mr', 'मराठी'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'Bengali', 'bn', 'বাংলা'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'Punjabi', 'pa', 'ਪੰਜਾਬੀ'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'English', 'en', 'English')
ON CONFLICT (code) DO NOTHING;

-- 2. SEED GENRES
INSERT INTO public.genres (id, name, slug, description, icon) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'Drama', 'drama', 'Heartfelt emotional stories and human narratives', 'film'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12', 'Comedy', 'comedy', 'Lighthearted humor and hilarious slice-of-life short films', 'smile'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13', 'Thriller', 'thriller', 'Suspenseful, high-stakes edge-of-the-seat cinema', 'zap'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b14', 'Horror', 'horror', 'Eerie supernatural tales and psychological chills', 'ghost'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b15', 'Romance', 'romance', 'Poetic love stories and relational connections', 'heart'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b16', 'Documentary', 'documentary', 'Real-world Indian cultural & social documentaries', 'camera'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b17', 'Animation', 'animation', 'Creative visual stories and 2D/3D animation', 'sparkles'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b18', 'Sci-Fi', 'sci-fi', 'Futuristic and technology-themed Indian concepts', 'cpu')
ON CONFLICT (slug) DO NOTHING;

-- 3. SEED FILMS (Fictional Demo Short Films using Royalty-Free Video Media)
INSERT INTO public.films (
    id, title, slug, description, poster_url, banner_url, video_url, trailer_url,
    duration_seconds, release_year, certificate, director, producer, cast_members,
    production_house, status, visibility, views_count, likes_count, rating_average, rating_count, published_at
) VALUES
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11',
    'The Last Note',
    'the-last-note',
    'A passionate classical violinist in the mist-laden hills of Chikmagalur struggles to compose his farewell masterpiece while losing his hearing.',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80',
    '',
    '',
    1080, 2024, 'U', 'Aarav Sharma', 'Independent',
    '[]'::jsonb,
    'Independent', 'approved', 'public', 42300, 1420, 4.9, 142, NOW() - INTERVAL '21 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c12',
    'Maya: Illusions of Malnad',
    'maya-illusions-of-malnad',
    'A folklore researcher visits a sacred grove in Shivamogga and encounters the enigmatic guardian deity of the Western Ghats.',
    'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80',
    '',
    '',
    1320, 2024, 'U', 'Priya Hegde', 'Independent',
    '[]'::jsonb,
    'Independent', 'approved', 'public', 56100, 1890, 4.8, 189, NOW() - INTERVAL '24 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c13',
    'Kaalchakra - The Wheel',
    'kaalchakra-the-wheel',
    'An antique clockmaker in Varanasi uncovers a rhythmic time-loop apparatus that rewinds the holy city by seven minutes every sunset.',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1920&q=80',
    '',
    '',
    900, 2024, 'U', 'Vikramaditya Roy', 'Independent',
    '[]'::jsonb,
    'Independent', 'approved', 'public', 78900, 2310, 4.7, 231, NOW() - INTERVAL '21 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c14',
    'Bengaluru 6 AM',
    'bengaluru-6-am',
    'Two strangers meet at an iconic filter coffee darshini in Basavanagudi as the sunrise mist covers the city streets.',
    'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80',
    '',
    '',
    720, 2024, 'U', 'Karthik Rao', 'Independent',
    '[]'::jsonb,
    'Independent', 'approved', 'public', 31200, 980, 4.6, 98, NOW() - INTERVAL '26 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c15',
    'Vanishing Echoes',
    'vanishing-echoes',
    'An evocative documentary exploring the ancient ritual songs of the Theyyam performers through nocturnal backwaters.',
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=1920&q=80',
    '',
    '',
    1440, 2024, 'U', 'Meera Nambiar', 'Independent',
    '[]'::jsonb,
    'Independent', 'approved', 'public', 48900, 1650, 4.9, 165, NOW() - INTERVAL '25 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c16',
    'Karnad''s Solitude',
    'karnad-s-solitude',
    'A tribute to classical Kannada theatre exploring a playwright facing the empty stage before a historic premiere.',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80',
    '',
    '',
    1560, 2024, 'U', 'Suhas Kulkarni', 'Independent',
    '[]'::jsonb,
    'Independent', 'approved', 'public', 65400, 2100, 4.8, 210, NOW() - INTERVAL '22 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c17',
    'Nila: Blue Horizon',
    'nila-blue-horizon',
    'A deaf painter and an acoustic recordist capture the changing sounds of Chennai shores before the monsoons arrive.',
    'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=1920&q=80',
    '',
    '',
    960, 2024, 'U', 'Arvind Swamy', 'Independent',
    '[]'::jsonb,
    'Independent', 'approved', 'public', 89300, 3420, 4.8, 342, NOW() - INTERVAL '9 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c18',
    'The Clay Potter of Kutch',
    'the-clay-potter-of-kutch',
    'The meditative rhythm of salt plains and terracotta wheels in the arid beauty of Gujarat white desert.',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1920&q=80',
    '',
    '',
    1140, 2024, 'U', 'Bhavna Patel', 'Independent',
    '[]'::jsonb,
    'Independent', 'approved', 'public', 38400, 1120, 4.7, 112, NOW() - INTERVAL '28 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c19',
    'Midnight Express',
    'midnight-express',
    'A single train compartment, six unacquainted passengers, and an unaddressed telegram that changes everything.',
    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80',
    '',
    '',
    840, 2024, 'U', 'Aarav Sharma', 'Independent',
    '[]'::jsonb,
    'Independent', 'approved', 'public', 71200, 2780, 4.9, 278, NOW() - INTERVAL '7 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c20',
    'Chai & Stories',
    'chai-stories',
    'Over steaming clay cups of ginger tea, an artisan and an aspiring animator connect across generational gaps.',
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1920&q=80',
    '',
    '',
    660, 2024, 'U', 'Ananya Sen', 'Independent',
    '[]'::jsonb,
    'Independent', 'approved', 'public', 29800, 1450, 4.8, 145, NOW() - INTERVAL '22 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c21',
    'Kaveri Calling',
    'kaveri-calling',
    'A tribute to Karnataka sacred river valley through the eyes of its village elders.',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1920&q=80',
    '',
    '',
    1080, 2024, 'U', 'Chetan Gowda', 'Independent',
    '[]'::jsonb,
    'Independent', 'approved', 'public', 45600, 1840, 4.8, 184, NOW() - INTERVAL '6 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c22',
    'The Silent Ghat',
    'the-silent-ghat',
    'A mist-veiled morning on the Hooghly river where an old ferryman reveals a decades-old town mystery.',
    'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80',
    '',
    '',
    1020, 2024, 'U', 'Sourav Mukherjee', 'Independent',
    '[]'::jsonb,
    'Independent', 'approved', 'public', 52100, 1980, 4.7, 198, NOW() - INTERVAL '1 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c23',
    'The Amber Loom',
    'the-amber-loom',
    'A traditional Benarasi silk weaver weaves his ancestral pattern for one final customer.',
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1920&q=80',
    '',
    '',
    900, 2024, 'U', 'Manoj Verma', 'Independent',
    '[]'::jsonb,
    'Independent', 'approved', 'public', 34100, 1220, 4.6, 122, NOW() - INTERVAL '7 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c24',
    'Godavari Rhythms',
    'godavari-rhythms',
    'A celebration of Godavari delta folk musicians seeking to preserve river ballad poetry.',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=1920&q=80',
    '',
    '',
    1260, 2024, 'U', 'Venkatesh Rao', 'Independent',
    '[]'::jsonb,
    'Independent', 'approved', 'public', 84200, 2890, 4.8, 289, NOW() - INTERVAL '10 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c25',
    'Whispers of Sahyadri',
    'whispers-of-sahyadri',
    'Trekkers traversing the historic forts of Shivaji Maharaj uncover an undisturbed cavern archive.',
    'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1920&q=80',
    '',
    '',
    1200, 2024, 'U', 'Tanvi Joshi', 'Independent',
    '[]'::jsonb,
    'Independent', 'approved', 'public', 46200, 1760, 4.7, 176, NOW() - INTERVAL '12 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c26',
    'The Basavanagudi Postman',
    'the-basavanagudi-postman',
    'A heartwarming journey of a veteran postman delivering handwritten letters across heritage South Bangalore.',
    'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80',
    '',
    '',
    780, 2024, 'U', 'Karthik Rao', 'Independent',
    '[]'::jsonb,
    'Independent', 'approved', 'public', 39800, 1540, 4.8, 154, NOW() - INTERVAL '12 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c27',
    'Rain over Fort Kochi',
    'rain-over-fort-kochi',
    'Chinese fishing nets, sudden monsoon showers, and two travelers stranded under an antique colonial portico.',
    'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1920&q=80',
    '',
    '',
    840, 2024, 'U', 'Meera Nambiar', 'Independent',
    '[]'::jsonb,
    'Independent', 'approved', 'public', 68100, 2450, 4.9, 245, NOW() - INTERVAL '12 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c28',
    'Kathakali: Face of gods',
    'kathakali-face-of-gods',
    'Intimate visual poetry revealing the six hours of sacred facial makeup transformation of a master Kathakali artist.',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80',
    '',
    '',
    1500, 2024, 'U', 'Suresh Menon', 'Independent',
    '[]'::jsonb,
    'Independent', 'approved', 'public', 92400, 3100, 4.9, 310, NOW() - INTERVAL '26 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c29',
    'The Hyderabad Cafe',
    'the-hyderabad-cafe',
    'A hilarious yet poignant negotiation between three cousins inside an old Irani Chai cafe in Charminar.',
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1920&q=80',
    '',
    '',
    960, 2024, 'U', 'Faizan Ahmed', 'Independent',
    '[]'::jsonb,
    'Independent', 'approved', 'public', 47200, 1890, 4.7, 189, NOW() - INTERVAL '18 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c30',
    'Shadows of Ahmedabad',
    'shadows-of-ahmedabad',
    'The winding Pols of heritage Ahmedabad, carved wooden Havelis, and an untold story from the 1960s.',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80',
    '',
    '',
    1080, 2024, 'U', 'Bhavna Patel', 'Independent',
    '[]'::jsonb,
    'Independent', 'approved', 'public', 41900, 1670, 4.8, 167, NOW() - INTERVAL '19 days'
)
ON CONFLICT (slug) DO NOTHING;

-- 4. SEED FILM LANGUAGES & GENRES
INSERT INTO public.film_languages (film_id, language_id) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c14', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c15', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14')
ON CONFLICT DO NOTHING;

INSERT INTO public.film_genres (film_id, genre_id) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c12', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c13', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c14', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c15', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b15')
ON CONFLICT DO NOTHING;

-- 5. SEED FEATURED FILMS
INSERT INTO public.featured_films (film_id, display_order) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 1),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c13', 2),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c15', 3)
ON CONFLICT DO NOTHING;

-- 6. SEED TRENDING FILMS (INITIAL RANKING)
SELECT public.calculate_trending_films();
