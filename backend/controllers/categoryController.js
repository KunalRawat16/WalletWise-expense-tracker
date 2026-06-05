const db = require('../config/db');

exports.getCategories = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM categories WHERE is_default = TRUE OR user_id = $1',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
