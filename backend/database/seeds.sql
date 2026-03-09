USE workshop_db;

-- 1. Insert Master Data
INSERT INTO faculties (name) VALUES 
('Informatics'), ('Science'), ('Engineering'), ('Humanities');

INSERT INTO categories (name) VALUES 
('Technology'), ('Business'), ('Language'), ('Health');

INSERT INTO platforms (name) VALUES 
('Zoom'), ('Google Meet'), ('Microsoft Teams'), ('On-site');

-- 2. Insert Users (Password is 'password123')
-- Admin
INSERT INTO users (username, password_hash, email, first_name, last_name, role, faculty_id) VALUES
('admin', '$2b$10$X7...', 'admin@univ.ac.th', 'Admin', 'System', 'admin', 1);

-- Organizer (อาจารย์/ผู้จัด)
INSERT INTO users (username, password_hash, email, first_name, last_name, role, faculty_id) VALUES
('org01', '$2b$10$X7...', 'somchai.t@univ.ac.th', 'Somchai', 'Teachwell', 'organizer', 1);

-- Approver (ผู้อนุมัติ)
INSERT INTO users (username, password_hash, email, first_name, last_name, role, faculty_id) VALUES
('app01', '$2b$10$X7...', 'director@univ.ac.th', 'Director', 'Bigboss', 'approver', 1);

-- Students
INSERT INTO users (username, password_hash, email, first_name, last_name, role, faculty_id) VALUES
('std01', '$2b$10$X7...', 'student1@univ.ac.th', 'Nadech', 'Kugimiya', 'student', 1),
('std02', '$2b$10$X7...', 'student2@univ.ac.th', 'Yaya', 'Urassaya', 'student', 2);

-- 3. Insert Workshops
INSERT INTO workshops (title, description, start_time, end_time, max_seats, meeting_url, status, organizer_id, category_id, platform_id) VALUES
('Intro to React', 'Learn React hooks and components', '2026-03-01 09:00:00', '2026-03-01 16:00:00', 50, 'https://zoom.us/j/123', 'approved', 2, 1, 1),
('English for Career', 'Resume writing workshop', '2026-03-05 13:00:00', '2026-03-05 15:00:00', 30, 'Room IF-404', 'pending', 2, 3, 4);

-- 4. Insert Enrollments
INSERT INTO enrollments (user_id, workshop_id) VALUES
(4, 1), -- Nadech enrolls in React
(5, 1); -- Yaya enrolls in React