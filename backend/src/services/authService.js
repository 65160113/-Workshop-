// backend/src/services/authService.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

class AuthService {
  async register(userData) {
    const { username, password, email, firstName, lastName, faculty_id, role } =
      userData;

    // 🌟 เช็คทั้ง email และ username
    const existingUser = await userRepository.findByEmailOrUsername(
      email,
      username,
    );
    if (existingUser) {
      throw new Error("Username or Email already exists");
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUserId = await userRepository.createUser({
      username,
      passwordHash,
      email, 
      firstName, 
      lastName, 
      faculty_id,
      role,
    });

    return { id: newUserId, username, email, role };
  }

  async login(username, password) {
    const user = await userRepository.findByEmailOrUsername(username, username);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
      throw new Error("Invalid credentials");
    }

    const payload = {
      id: user.user_id,
      username: user.username,
      role: user.role,
    };

    const secretKey = process.env.JWT_SECRET || "super_secret_key";
    const token = jwt.sign(payload, secretKey, { expiresIn: "1d" });

    return { user: payload, token };
  }
}

module.exports = new AuthService();
