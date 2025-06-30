# Universal Application Builder - Automated Creation Guide

## 🎯 USER: Describe Your Application Here

**Instructions for User:** Replace this section with your application description. Be specific about:

### Application Type
- [ ] **Web Application** (React, Vue, vanilla JS)
- [ ] **API/Backend Service** (REST API, GraphQL, microservice)
- [ ] **Real-time Application** (chat, gaming, collaboration)
- [ ] **Dashboard/Admin Panel** (analytics, monitoring, CMS)
- [ ] **E-commerce** (store, marketplace, booking)
- [ ] **Other:** ________________

### Core Features Required
Describe 3-5 main features your application needs:
1. 
2. 
3. 
4. 
5. 

### Technical Preferences (Optional)
- **Frontend:** React/Vue/Vanilla JS/None
- **Database:** PostgreSQL/MySQL/MongoDB/SQLite
- **Authentication:** Yes/No
- **Real-time features:** WebSockets/Server-Sent Events/None
- **Special requirements:** ________________

---

## 🚨 Critical Operational Rules

**MANDATORY COMPLIANCE CONFIRMATION:**
Every 3 commands, the agent MUST confirm: "✅ OPERATIONAL COMPLIANCE: I am following all rules - no status checking, using npm run reset, background processes only"

**BEFORE EVERY COMMAND**: State "Rule: [reason] - [command]"

**FORBIDDEN (Will hang terminal):**
- `npm run dev`, `node server.js` (without `nohup ... &`)
- `curl`, `wget` for status checking
- `docker ps`, `ps aux | grep` for status checking  
- `pkill -f node` (kills IDE)

**REQUIRED:**
- Use `npm run reset` instead of status checking
- Background servers: `nohup node server.js &`
- Kill by port: `lsof -ti:PORT | xargs kill`

**USER INTERRUPTION TRIGGERS:**
If agent says ANY of these phrases, immediately type "STOP":
- "let me check if..."
- "let me see if the server..."
- "I'll test the connection..."
- "wait for the service to be ready..."
- Uses `curl`, `wget`, `docker ps` commands

## 🛠 Universal Tech Stack

### Core Infrastructure
- **Runtime**: Node.js + Express
- **Database**: PostgreSQL (configurable)
- **Cache/Session**: Redis (optional)
- **Testing**: Playwright with screenshots
- **Infrastructure**: Docker Compose

### Frontend Options (Agent will choose based on requirements)
- **Simple**: HTML5 + Vanilla JS + CSS
- **Interactive**: HTML5 + Modern JS (ES6+) + CSS Grid/Flexbox
- **Complex**: React/Vue (if specifically requested)

### Backend Capabilities
- RESTful API endpoints
- WebSocket support (if real-time needed)
- Database ORM/queries
- Authentication (if required)
- File uploads (if needed)

## 📋 Universal Implementation Pattern

### 1. MANDATORY FIRST STEP: Create CLAUDE.md
**BEFORE ANY ANALYSIS OR CODING**: Agent must create CLAUDE.md file in project root with operational enforcement rules.

Copy the complete CLAUDE.md template from: `/wsl-code/gtest2/CLAUDE.md`

This file ensures operational compliance for all future development work on this project.

### 2. Analysis & Planning
Agent MUST first analyze the user's requirements and confirm:
- Application type and complexity
- Required features and functionality  
- Database schema needs
- Frontend complexity level
- Testing scenarios needed

### 3. Setup
```bash
npm init -y
npm install express cors dotenv
# Additional packages based on requirements analysis
npm install -D @playwright/test playwright

# Install Playwright browsers
npx playwright install chromium --force
```

**CRITICAL: Update package.json scripts to prevent test hanging:**
```json
{
  "scripts": {
    "reset": "node reset.js",
    "start": "node server.js", 
    "stop": "lsof -ti:3000 | xargs kill -9 2>/dev/null || true",
    "test": "playwright test --reporter=line --timeout=30000"
  }
}
```

**CRITICAL: Create playwright.config.js to prevent hanging:**
```javascript
module.exports = {
  testDir: './tests',
  timeout: 30000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'line',
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...require('@playwright/test').devices['Desktop Chrome'] }
    }
  ]
};
```

### 4. Infrastructure Setup
**docker-compose.yml:** (Use non-standard ports to avoid conflicts)
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: appuser  
      POSTGRES_PASSWORD: apppass
    ports:
      - "5440:5432"  # High non-standard port to avoid conflicts
  redis:
    image: redis:7-alpine
    ports:
      - "6390:6379"  # High non-standard port to avoid conflicts
    profiles: ["with-redis"]  # Optional service
```

### 5. Core Application Structure
**Required Files (Agent creates based on analysis):**
- `server.js` - Express server with appropriate middleware
- `public/index.html` - Frontend interface
- `public/app.js` - Client-side application logic
- `public/style.css` - Styling
- `database.js` - Database connection and queries
- `reset.js` - Enhanced reset script
- `tests/app.spec.js` - Comprehensive test suite

### 6. Database Schema (Generated based on requirements)
Agent will create appropriate tables for the application type:
- User management (if authentication needed)
- Core business logic tables
- Audit/logging tables (if needed)

### 7. Enhanced Reset Script
```javascript
#!/usr/bin/env node
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function reset() {
  console.log('🔄 Starting reset process...');
  
  try {
    // Stop containers FIRST to release ports
    console.log('🧹 Cleaning up Docker containers...');
    await execAsync('docker-compose down 2>/dev/null || true');
    await execAsync('docker system prune -f 2>/dev/null || true');
    
    // Kill processes by port (use non-standard ports)
    console.log('⏹️ Stopping existing processes...');
    await execAsync('lsof -ti:3000 | xargs kill -9 2>/dev/null || true');
    await execAsync('lsof -ti:5440 | xargs kill -9 2>/dev/null || true');
    await execAsync('lsof -ti:6390 | xargs kill -9 2>/dev/null || true');
    
    // Start services based on requirements
    console.log('🐳 Starting required services...');
    await execAsync('docker-compose up -d postgres');
    // Add redis if needed: await execAsync('docker-compose --profile with-redis up -d');
    
    // Fixed wait (no status checking)
    console.log('⏳ Waiting for services...');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // Initialize database
    console.log('🗄️ Initializing database...');
    await runMigrations();
    
    // Start server in background
    console.log('🚀 Starting server...');
    await execAsync('nohup node server.js > server.log 2>&1 &');
    
    console.log('✅ Environment ready - no status checking performed');
  } catch (error) {
    console.error('❌ Reset failed:', error.message);
    process.exit(1);
  }
}

reset();
```

### 8. Universal Test Suite Template
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Application Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.waitForTimeout(2000);
  });

  // Core functionality tests (agent customizes based on requirements)
  test('Application loads successfully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.screenshot({ path: 'screenshots/app-loaded.png' });
    
    // Verify basic UI elements are present
    await expect(page.locator('body')).toBeVisible();
  });

  test('Main features work correctly', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Agent will customize this based on application requirements
    await page.screenshot({ path: 'screenshots/main-features.png' });
  });

  test('Database operations work', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Test CRUD operations specific to the application
    await page.screenshot({ path: 'screenshots/database-ops.png' });
  });

  test('Error handling works', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Test error scenarios
    await page.screenshot({ path: 'screenshots/error-handling.png' });
  });
});
```

## ✅ Universal Success Criteria
- Application loads successfully in browser
- All core features function as specified
- Database operations work correctly
- Error handling is robust
- All tests pass with screenshot evidence
- Responsive design (if applicable)
- User experience is intuitive

## 🔧 Commands Summary
```bash
npm run reset    # Complete environment setup
npx playwright install chromium --force  # Install browser (if needed)
npm run test     # Run all tests with screenshots
```

## 🚫 What NOT to do
- Never check if server is running - use `npm run reset`
- Never start server in foreground
- Never use curl/wget for testing
- Never manually resolve port conflicts
- Never skip the screenshot tests
- **Never use `npx playwright install-deps` (requires sudo)**
- **Never use `sudo` commands (will ask for password)**

## 🚨 COMPLIANCE CHECKPOINTS

**MANDATORY**: Agent must confirm compliance at these milestones:

1. **After CLAUDE.md creation**: "✅ CHECKPOINT CLAUDE: CLAUDE.md file created to ensure operational compliance for all future development"

2. **After analysis**: "✅ CHECKPOINT ANALYSIS: Requirements analyzed, implementation plan confirmed"

3. **After setup**: "✅ CHECKPOINT 1: Setup complete using only allowed commands, no status checking performed"

4. **After services start**: "✅ CHECKPOINT 2: Services started in background only, no verification attempts made"

5. **Before testing**: "✅ CHECKPOINT BROWSER: Installing Playwright browsers with npx playwright install chromium --force"

6. **After each major feature**: "✅ CHECKPOINT: Feature implemented without status checking violations"

7. **MANDATORY FINAL TEST**: "✅ CHECKPOINT FINAL: Running npm run test to verify complete system with screenshots"

**USER: Watch for missing checkpoints - demand confirmation if agent skips them!**
**CRITICAL: Agent MUST run `npm run test` at the very end - no exceptions!**
**SUCCESS CRITERIA: All tests must pass with screenshot evidence**

## 🛑 INSTANT VIOLATION DETECTION

**Type "STOP" immediately if agent:**
- Runs commands without "Rule:" prefix
- Uses forbidden phrases like "let me check if..."
- Skips compliance checkpoints
- Uses `curl`, `docker ps`, `ps aux | grep`
- Starts servers in foreground
- **🚨 CRITICAL VIOLATION: Manually changes ports in config files due to conflicts (FORBIDDEN - this exact pattern happened in latest logs)**
- **Says project is "complete" without running npm run test**
- **Updates docker-compose.yml ports manually instead of using reset script**
- **Tries to install system dependencies with sudo (requires password)**
- **Uses `npx playwright install-deps` (requires sudo)**

---

## 🚨 CRITICAL LESSONS FROM PREVIOUS FAILURES

**🚨 EXACT VIOLATION PATTERN FROM LATEST LOGS (FORBIDDEN):**
```bash
# ❌ AGENT VIOLATED THIS EXACT PATTERN:
npm run reset  # Fails with port 6380 conflict
# Agent then manually edited docker-compose.yml: "6380" → "6381"
# Agent then manually edited reset.js: "6380" → "6381" 
# Agent then manually edited .env: "5433" → "5434"
# THIS IS FORBIDDEN - MAJOR VIOLATION!

# ✅ CORRECT: Update reset script to use different starting ports
# Use even higher ports (6390, 5440) to avoid conflicts
# Let reset script handle conflicts automatically
```

**Port Conflict Pattern (FORBIDDEN):**
```bash
# ❌ WRONG: Manual port resolution when reset fails
docker-compose up -d  # Fails with port conflict
# Then manually editing docker-compose.yml, server.js files

# ✅ CORRECT: Reset script handles conflicts automatically
# Use non-standard ports (5433, 6380) from the start
# Reset script stops containers BEFORE starting new ones
```

**Playwright Flag Error (FROM LATEST LOGS):**
```bash
# ❌ WRONG: Invalid flag caused error in latest logs
"test": "playwright test --reporter=line --headed=false --timeout=30000"
# Error: unknown option '--headed=false'

# ✅ CORRECT: Use headless mode in playwright.config.js, not command line
"test": "playwright test --reporter=line --timeout=30000"
# Configure headless: true in playwright.config.js instead
```

**Playwright Installation Pattern:**
```bash
# ❌ WRONG: Requires sudo password
npx playwright install-deps  # Asks for password

# ✅ CORRECT: Force install browsers only
npx playwright install chromium --force  # No sudo needed
```

**Test Success Criteria:**
- All tests must pass = SUCCESS ✅
- Focus on screenshot generation and major functionality

**Reset Script Failure Protocol:**
1. If reset fails due to port conflicts → Update reset script, don't manually change configs
2. Docker containers must be stopped FIRST before starting new ones
3. Use non-standard ports (5433, 6380) to avoid conflicts from the start

**MANDATORY FINAL STEP:**
Agent MUST run `npm run test` and confirm all tests pass with screenshots. Saying "project complete" without testing is a violation.

---

**Key Insight**: Trust the reset process completely. If `npm run reset` completes successfully, everything is ready. No status checking needed.