-- 1. สร้าง Database และเลือกใช้งาน
CREATE DATABASE IF NOT EXISTS workshop_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE workshop_db;

-- 2. สร้างตาราง Master Data (ข้อมูลพื้นฐาน)
CREATE TABLE faculties (
    faculty_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE platforms (
    platform_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE -- e.g., Zoom, Google Meet, On-site
);

-- 3. สร้างตาราง Users (ผู้ใช้งาน)
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('student', 'organizer', 'admin', 'approver') NOT NULL DEFAULT 'student',
    faculty_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES faculties(faculty_id) ON DELETE SET NULL
);

-- 4. สร้างตาราง Workshops (กิจกรรมอบรม)
CREATE TABLE workshops (
    workshop_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    speaker_name VARCHAR(150),
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    max_seats INT NOT NULL,
    meeting_url TEXT, -- ลิงก์ห้องเรียน หรือสถานที่
    location_detail TEXT, -- รายละเอียดสถานที่เพิ่มเติม
    
    -- Status
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    
    -- Foreign Keys
    organizer_id INT NOT NULL,
    category_id INT,
    platform_id INT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (organizer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    FOREIGN KEY (platform_id) REFERENCES platforms(platform_id) ON DELETE SET NULL
);

-- 5. สร้างตาราง Enrollments (การลงทะเบียน)
CREATE TABLE enrollments (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    workshop_id INT NOT NULL,
    status ENUM('active', 'cancelled') DEFAULT 'active',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (workshop_id) REFERENCES workshops(workshop_id) ON DELETE CASCADE,
    
    -- ป้องกันการสมัครซ้ำใน Workshop เดิม
    UNIQUE KEY unique_enrollment (user_id, workshop_id)
);

-- 6. สร้าง Indexes เพื่อความเร็วในการค้นหา
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_workshops_status ON workshops(status);
CREATE INDEX idx_workshops_start_time ON workshops(start_time);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);