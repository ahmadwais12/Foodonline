const db = require('../config/db');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT id, email, username, avatar_url, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: users[0]
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, avatar_url } = req.body;

    const [result] = await db.execute(
      'UPDATE users SET username = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [username, avatar_url, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    const [users] = await db.execute(
      'SELECT id, email, username, avatar_url, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: users[0]
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Get user addresses
exports.getAddresses = async (req, res) => {
  try {
    const [addresses] = await db.execute(
      'SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [req.user.id]
    );

    res.status(200).json({
      status: 'success',
      data: {
        addresses
      }
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Add user address
exports.addAddress = async (req, res) => {
  try {
    const { label, address_line1, address_line2, city, state, postal_code, latitude, longitude, is_default } = req.body;

    // If setting as default, unset other defaults first
    if (is_default) {
      await db.execute(
        'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
        [req.user.id]
      );
    }

    const [result] = await db.execute(
      `INSERT INTO user_addresses 
       (user_id, label, address_line1, address_line2, city, state, postal_code, latitude, longitude, is_default) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, label, address_line1, address_line2, city, state, postal_code, latitude, longitude, is_default || false]
    );

    const addressId = result.insertId;

    const [addresses] = await db.execute(
      'SELECT * FROM user_addresses WHERE id = ?',
      [addressId]
    );

    res.status(201).json({
      status: 'success',
      message: 'Address added successfully',
      data: {
        address: addresses[0]
      }
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Update user address
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, address_line1, address_line2, city, state, postal_code, latitude, longitude, is_default } = req.body;

    // If setting as default, unset other defaults first
    if (is_default) {
      await db.execute(
        'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
        [req.user.id]
      );
    }

    const [result] = await db.execute(
      `UPDATE user_addresses SET 
       label = ?, address_line1 = ?, address_line2 = ?, city = ?, state = ?, postal_code = ?, 
       latitude = ?, longitude = ?, is_default = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ? AND user_id = ?`,
      [label, address_line1, address_line2, city, state, postal_code, latitude, longitude, is_default || false, id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Address not found'
      });
    }

    const [addresses] = await db.execute(
      'SELECT * FROM user_addresses WHERE id = ?',
      [id]
    );

    res.status(200).json({
      status: 'success',
      message: 'Address updated successfully',
      data: {
        address: addresses[0]
      }
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Delete user address
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      'DELETE FROM user_addresses WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Address not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// Set default address
exports.setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    // Unset all defaults
    await db.execute(
      'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
      [req.user.id]
    );

    // Set new default
    const [result] = await db.execute(
      'UPDATE user_addresses SET is_default = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Address not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Default address updated successfully'
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};