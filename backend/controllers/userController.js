const pool = require('../db/pool');

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Users ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// GET user by id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM Users WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// POST create user
const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'name and email are required' });
    }
    const result = await pool.query(
      'INSERT INTO Users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// PUT update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const result = await pool.query(
      'UPDATE Users SET name = COALESCE($1, name), email = COALESCE($2, email) WHERE id = $3 RETURNING *',
      [name, email, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// DELETE user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM Users WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
