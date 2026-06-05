const db = require('../config/db');

exports.getBudgets = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM budgets WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const { category_id, amount } = req.body;
    
    // Upsert logic
    const result = await db.query(
      `INSERT INTO budgets (id, user_id, category_id, amount) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (user_id, category_id) 
       DO UPDATE SET amount = EXCLUDED.amount 
       RETURNING *`,
      [`${req.user.id}-${category_id}`, req.user.id, category_id, amount]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
