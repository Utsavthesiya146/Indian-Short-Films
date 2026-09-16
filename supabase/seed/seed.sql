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
    'Chai & Stories (चाय और किस्से)',
    'chai-and-stories',
    'A poignant tale set in a bustling Mumbai tea stall where two strangers discover an unexpected connection over evening masala chai. (Demo Short Film)',
    'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    720, 2024, 'U', 'Aarav Sharma', 'Meera Kapoor',
    '[{"name": "Rohan Joshi", "role": "Kabir"}, {"name": "Priya Roy", "role": "Ananya"}]'::jsonb,
    'Katha Independent Talkies', 'approved', 'public', 1450, 320, 4.80, 45, NOW() - INTERVAL '5 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c12',
    'The Last Letter (અંતિમ પત્ર)',
    'the-last-letter',
    'A nostalgic Gujarati short film exploring an elderly artisan''s journey through forgotten letters in vintage Ahmedabad. (Demo Short Film)',
    'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    950, 2024, 'U', 'Devang Patel', 'Kavita Patel',
    '[{"name": "Hasmukh Vora", "role": "Dada Ji"}, {"name": "Kinjal Shah", "role": "Granddaughter"}]'::jsonb,
    'Sabarmati Cinema', 'approved', 'public', 980, 210, 4.65, 28, NOW() - INTERVAL '12 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c13',
    'Midnight Express (இரவு பயணம்)',
    'midnight-express',
    'A gripping Tamil psychological thriller centered around a late-night commuter in Chennai who notices a mysterious suitcase. (Demo Short Film)',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    840, 2023, 'UA 13+', 'Karthik Raja', 'Venkatesh Iyer',
    '[{"name": "Surya Kumar", "role": "Vikram"}, {"name": "Divya Nambiar", "role": "Stranger"}]'::jsonb,
    'Marina Wave Pictures', 'approved', 'public', 2300, 540, 4.90, 62, NOW() - INTERVAL '2 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c14',
    'Shadows of Mysore (ಮೈಸೂರು ನೆರಳುಗಳು)',
    'shadows-of-mysore',
    'An evocative Kannada mystery exploring historical secrets hidden inside centuries-old royal silk looms. (Demo Short Film)',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    1100, 2024, 'U', 'Ramesh Gowda', 'Sujata Rao',
    '[{"name": "Chetan Kumar", "role": "Rajesh"}, {"name": "Shreya Hegde", "role": "Kavya"}]'::jsonb,
    'Kaveri Talkies', 'approved', 'public', 1120, 195, 4.50, 19, NOW() - INTERVAL '8 days'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c15',
    'Monsoon Melodies (వర్షం స్వరాలు)',
    'monsoon-melodies',
    'A heartwarming Telugu romantic drama about two musicians creating a song during a heavy Hyderabad rainstorm. (Demo Short Film)',
    'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    660, 2024, 'U', 'Teja Varma', 'Anitha Reddy',
    '[{"name": "Varun Tej", "role": "Sid"}, {"name": "Keerthy S.", "role": "Riya"}]'::jsonb,
    'Deccan Beats Studio', 'approved', 'public', 1890, 430, 4.75, 51, NOW() - INTERVAL '3 days'
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
