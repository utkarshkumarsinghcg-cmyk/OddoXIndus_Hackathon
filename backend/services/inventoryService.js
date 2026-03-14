const pool = require('../db/pool');

/**
 * 1️⃣ POST /receipts
 * Increase stock when goods arrive from suppliers.
 */
const addReceipt = async (product_id, warehouse_id, quantity, supplier) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insert Receipt
    await client.query(
      `INSERT INTO Receipts (product_id, warehouse_id, quantity, supplier) VALUES ($1, $2, $3, $4)`,
      [product_id, warehouse_id, quantity, supplier]
    );

    // Update Inventory
    const inventoryResult = await client.query(
      `UPDATE Inventory SET quantity = quantity + $1 WHERE product_id = $2 AND warehouse_id = $3 RETURNING *`,
      [quantity, product_id, warehouse_id]
    );

    // If inventory doesn't exist for this product/warehouse combination, insert it.
    if (inventoryResult.rowCount === 0) {
      await client.query(
        `INSERT INTO Inventory (product_id, warehouse_id, quantity) VALUES ($1, $2, $3)`,
        [product_id, warehouse_id, quantity]
      );
    }

    // Insert Ledger Entry
    await client.query(
      `INSERT INTO Ledger (type, product_id, warehouse_id, quantity) VALUES ($1, $2, $3, $4)`,
      ['RECEIPT', product_id, warehouse_id, quantity]
    );

    await client.query('COMMIT');
    return { success: true, message: 'Receipt recorded successfully' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * 2️⃣ POST /delivery
 * Decrease stock when items are shipped to customers.
 */
const addDelivery = async (product_id, warehouse_id, quantity, customer) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check Stock
    const inventoryResult = await client.query(
      `SELECT quantity FROM Inventory WHERE product_id = $1 AND warehouse_id = $2 FOR UPDATE`,
      [product_id, warehouse_id]
    );

    if (inventoryResult.rowCount === 0 || inventoryResult.rows[0].quantity < quantity) {
      throw new Error('Insufficient stock');
    }

    // Insert Delivery
    await client.query(
      `INSERT INTO Deliveries (product_id, warehouse_id, quantity, customer) VALUES ($1, $2, $3, $4)`,
      [product_id, warehouse_id, quantity, customer]
    );

    // Update Inventory
    await client.query(
      `UPDATE Inventory SET quantity = quantity - $1 WHERE product_id = $2 AND warehouse_id = $3`,
      [quantity, product_id, warehouse_id]
    );

    // Insert Ledger Entry
    await client.query(
      `INSERT INTO Ledger (type, product_id, warehouse_id, quantity) VALUES ($1, $2, $3, $4)`,
      ['DELIVERY', product_id, warehouse_id, -quantity]
    );

    await client.query('COMMIT');
    return { success: true, message: 'Delivery recorded successfully' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * 3️⃣ POST /transfer
 * Transfer stock between warehouses.
 */
const addTransfer = async (product_id, from_warehouse, to_warehouse, quantity) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check Source Stock
    const sourceInventoryResult = await client.query(
      `SELECT quantity FROM Inventory WHERE product_id = $1 AND warehouse_id = $2 FOR UPDATE`,
      [product_id, from_warehouse]
    );

    if (sourceInventoryResult.rowCount === 0 || sourceInventoryResult.rows[0].quantity < quantity) {
      throw new Error('Insufficient stock in source warehouse');
    }

    // Deduct from Source
    await client.query(
      `UPDATE Inventory SET quantity = quantity - $1 WHERE product_id = $2 AND warehouse_id = $3`,
      [quantity, product_id, from_warehouse]
    );

    // Add to Destination
    const destInventoryResult = await client.query(
      `UPDATE Inventory SET quantity = quantity + $1 WHERE product_id = $2 AND warehouse_id = $3 RETURNING *`,
      [quantity, product_id, to_warehouse]
    );

    if (destInventoryResult.rowCount === 0) {
       await client.query(
        `INSERT INTO Inventory (product_id, warehouse_id, quantity) VALUES ($1, $2, $3)`,
        [product_id, to_warehouse, quantity]
      );
    }

    // Insert Transfer Record
    // Assuming Transfers table needs from_warehouse, to_warehouse etc.
    await client.query(
      `INSERT INTO Transfers (product_id, from_warehouse, to_warehouse, quantity) VALUES ($1, $2, $3, $4)`,
      [product_id, from_warehouse, to_warehouse, quantity]
    );

    // Insert Ledger Entries
    await client.query(
      `INSERT INTO Ledger (type, product_id, warehouse_id, quantity) VALUES ($1, $2, $3, $4)`,
      ['TRANSFER_OUT', product_id, from_warehouse, -quantity]
    );
     await client.query(
      `INSERT INTO Ledger (type, product_id, warehouse_id, quantity) VALUES ($1, $2, $3, $4)`,
      ['TRANSFER_IN', product_id, to_warehouse, quantity]
    );

    await client.query('COMMIT');
    return { success: true, message: 'Transfer successful' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * 4️⃣ POST /adjustment
 * Adjust stock after physical inventory count.
 */
const addAdjustment = async (product_id, warehouse_id, new_quantity, reason) => {
   const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Fetch current quantity
    const inventoryResult = await client.query(
      `SELECT quantity FROM Inventory WHERE product_id = $1 AND warehouse_id = $2 FOR UPDATE`,
      [product_id, warehouse_id]
    );

    let current_quantity = 0;
    if (inventoryResult.rowCount > 0) {
        current_quantity = inventoryResult.rows[0].quantity;
    }

    const difference = new_quantity - current_quantity;

    // Update Inventory
    if (inventoryResult.rowCount > 0) {
        await client.query(
            `UPDATE Inventory SET quantity = $1 WHERE product_id = $2 AND warehouse_id = $3`,
            [new_quantity, product_id, warehouse_id]
        );
    } else {
         await client.query(
            `INSERT INTO Inventory (product_id, warehouse_id, quantity) VALUES ($1, $2, $3)`,
            [product_id, warehouse_id, new_quantity]
        );
    }

    // Insert Adjustment Record
    await client.query(
      `INSERT INTO Adjustments (product_id, warehouse_id, old_quantity, new_quantity, reason) VALUES ($1, $2, $3, $4, $5)`,
      [product_id, warehouse_id, current_quantity, new_quantity, reason]
    );

    // Insert Ledger Entry
    await client.query(
      `INSERT INTO Ledger (type, product_id, warehouse_id, quantity) VALUES ($1, $2, $3, $4)`,
      ['ADJUSTMENT', product_id, warehouse_id, difference]
    );

    await client.query('COMMIT');
    return { success: true, message: 'Adjustment successful' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * 5️⃣ GET /inventory-history
 * Retrieve complete stock movement history.
 */
const getInventoryHistory = async (product_id, warehouse_id, startDate, endDate) => {
    let query = `SELECT * FROM Ledger WHERE 1=1`;
    const values = [];
    let paramIndex = 1;

    if (product_id) {
        query += ` AND product_id = $${paramIndex}`;
        values.push(product_id);
        paramIndex++;
    }

    if (warehouse_id) {
        query += ` AND warehouse_id = $${paramIndex}`;
        values.push(warehouse_id);
        paramIndex++;
    }

    // Provided date filters (assuming created_at column exists in Ledger)
    if (startDate) {
        query += ` AND created_at >= $${paramIndex}`;
        values.push(startDate);
        paramIndex++;
    }

    if (endDate) {
         query += ` AND created_at <= $${paramIndex}`;
        values.push(endDate);
        paramIndex++;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, values);
    return result.rows;
};

module.exports = {
  addReceipt,
  addDelivery,
  addTransfer,
  addAdjustment,
  getInventoryHistory
};
