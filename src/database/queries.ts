import { pool } from './pool';

export interface DBPlayer {
  id: string;
  username: string;
  total_money: number;
  created_at: Date;
  last_active: Date;
}

export async function createOrGetPlayer(username: string): Promise<DBPlayer> {
  const query = `
    INSERT INTO players (username) 
    VALUES ($1) 
    ON CONFLICT (username) 
    DO UPDATE SET last_active = CURRENT_TIMESTAMP
    RETURNING *
  `;
  
  const result = await pool.query(query, [username]);
  return result.rows[0];
}

export async function updatePlayerMoney(playerId: string, amount: number): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    await client.query(
      'UPDATE players SET total_money = total_money + $1 WHERE id = $2',
      [amount, playerId]
    );
    
    await client.query(
      'INSERT INTO money_collections (player_id, amount) VALUES ($1, $2)',
      [playerId, amount]
    );
    
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function getTopPlayers(limit: number = 10): Promise<DBPlayer[]> {
  const query = `
    SELECT * FROM players 
    ORDER BY total_money DESC 
    LIMIT $1
  `;
  
  const result = await pool.query(query, [limit]);
  return result.rows;
}

export async function getPlayerStats(playerId: string) {
  const query = `
    SELECT 
      p.*,
      COUNT(mc.id) as collection_count,
      COALESCE(SUM(mc.amount), 0) as total_collected
    FROM players p
    LEFT JOIN money_collections mc ON p.id = mc.player_id
    WHERE p.id = $1
    GROUP BY p.id
  `;
  
  const result = await pool.query(query, [playerId]);
  return result.rows[0];
}