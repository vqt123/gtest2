const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Initializing database...');

try {
    // Read the schema file
    const schemaPath = path.join(__dirname, '../src/database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Execute the schema using psql
    const command = `docker exec -i grid-game-postgres psql -U gameuser -d gridgame`;
    const result = execSync(command, { 
        input: schema, 
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
    });
    
    console.log('Database schema executed successfully:');
    console.log(result);
    console.log('Database initialized successfully!');
} catch (error) {
    console.error('Failed to initialize database:', error.message);
    if (error.stdout) console.error('STDOUT:', error.stdout);
    if (error.stderr) console.error('STDERR:', error.stderr);
    process.exit(1);
}