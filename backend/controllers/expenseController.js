const db = require('../config/db');

exports.getExpenses = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.addExpense = async (req, res) => {
  try {
    const { id, amount, date, category, description } = req.body;
    
    const result = await db.query(
      'INSERT INTO expenses (id, user_id, amount, date, category, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, req.user.id, amount, date, category, description]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { amount, date, category, description } = req.body;
    
    const result = await db.query(
      'UPDATE expenses SET amount = $1, date = $2, category = $3, description = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
      [amount, date, category, description, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found or unauthorized' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const result = await db.query('DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *', [req.params.id, req.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found or unauthorized' });
    }

    res.json({ msg: 'Expense deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
