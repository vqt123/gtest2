-- Drop existing tables if they exist
DROP TABLE IF EXISTS money_collections CASCADE;
DROP TABLE IF EXISTS players CASCADE;

-- Create players table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    total_money INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create money_collections table
CREATE TABLE money_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL,
    amount INTEGER NOT NULL,
    collected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_players_username ON players(username);
CREATE INDEX idx_players_total_money ON players(total_money DESC);
CREATE INDEX idx_collections_player_id ON money_collections(player_id);
CREATE INDEX idx_collections_collected_at ON money_collections(collected_at DESC);