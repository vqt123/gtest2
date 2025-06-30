# AI Assistant Operational Guidelines

## 🚨 CRITICAL VIOLATION ENFORCEMENT 🚨

**MANDATORY**: AI must follow strict operational directives to prevent command lockups and violations.

**BEFORE EVERY COMMAND**: AI must state which operational rule justifies the command. Commands without justification are FORBIDDEN.

**MANDATORY COMPLIANCE CONFIRMATION:**
Every 3 commands, the agent MUST confirm: "✅ OPERATIONAL COMPLIANCE: I am following all rules - no status checking, using npm run reset, background processes only"

## 🚫 FORBIDDEN COMMANDS - NEVER RUN THESE

**CRITICAL STATUS CHECKING VIOLATIONS** - Use restart instead of ANY status verification:
- `curl`, `wget` for status checking, health checks, API testing, endpoint verification
- `nc`, `netcat`, `telnet` for port testing, connectivity checks
- `ping` for service availability testing
- HTTP clients (axios, fetch, requests) for health checking
- Database connection testing after container start
- Service availability polling/waiting loops

**PROCESS/CONTAINER STATUS CHECKING** - Use restart instead:
- `ps aux | grep` for process status checking
- `pgrep` for process identification
- `docker ps`, `docker-compose ps` for service status
- `kubectl get pods` for k8s status
- `systemctl status` for service status

**DEVELOPMENT SERVER COMMANDS** (without nohup/background flags) - WILL HANG TERMINAL:
- `npm run dev`, `yarn dev`, `pnpm dev`
- `node server.js` (without `nohup ... &`)
- `cargo run`, `go run`, `python app.py`

**CRITICAL**: Global process killing that affects IDE/Editor:
- `pkill -f "node"` (kills Node.js-based IDEs like VSCode, Cursor)
- `pkill -f "python"` (kills Python-based IDEs)
- `pkill -f "java"` (kills Java-based IDEs like IntelliJ)
- `killall [process]` (global killing)

**PORT CONFLICT PATTERNS** - Use automated detection instead:
- Manual port checking before service start
- Interactive port conflict resolution
- Hardcoded port assignments without conflict detection

**SYSTEM DEPENDENCY INSTALLATION**:
- `npx playwright install-deps` (requires sudo)
- Any `sudo` commands (will ask for password)

## ✅ REQUIRED OPERATIONAL PATTERNS

**FRESH ENVIRONMENT APPROACH:**
- Use `npm run reset` instead of ANY status checking
- Trust the reset process completely
- No verification after reset - if it completes, everything is ready

**BACKGROUND PROCESS MANAGEMENT:**
- Background servers: `nohup node server.js > server.log 2>&1 &`
- Kill by port: `lsof -ti:3000 | xargs kill -9`
- Save PIDs: `echo $! > .server.pid`

**BROWSER INSTALLATION:**
- Use: `npx playwright install chromium --force`
- Never use: `npx playwright install-deps`

## 🔍 VIOLATION DETECTION TRIGGERS

**CRITICAL STATUS CHECKING PHRASES** - These indicate violations:
- "let me check if..." or "let me see if..." (status checking)
- "let me test the connection" (forbidden verification)
- "let me verify the server is running" (status checking)
- "wait for services to be ready" (polling/waiting)
- "check if the database is accessible" (connection testing)
- "ensure the service is healthy" (health checking)

**FORBIDDEN COMMAND PATTERNS:**
- `curl`, `wget`, `nc`, `telnet` for any verification
- `ps aux | grep`, `docker ps`, `docker-compose ps`
- Database connection scripts run immediately after container start
- HTTP requests to health endpoints
- Port testing or service availability checks

**PROCESS MANAGEMENT VIOLATIONS:**
- Commands that hang and don't return to prompt
- Terminal becomes unresponsive
- Server started but not properly backgrounded
- Multiple status checks in sequence

**PORT CONFLICT INDICATORS:**
- Manual port changes in config files
- "port already in use" errors not handled automatically
- Interactive port conflict resolution

## 🛑 INTERRUPTION PROCEDURES (User: Do this immediately!)

1. **Press Ctrl+C** to interrupt hanging commands
2. **Type "STOP"** in chat and demand justification 
3. **Quote the specific violated rule** from this document
4. **Demand restart** if violations continue
5. **For IDE crashes**: Restart your editor and demand session restart

## 🔧 RECOVERY WORKFLOWS

- After violation: Force agent to use `npm run reset` before continuing
- After IDE crash: Restart editor, then restart session
- After hanging: Ctrl+C, then demand fresh restart approach
- After repeated violations: Request complete session restart

## 📋 MANDATORY COMPLIANCE CHECKPOINTS

**REQUIRED JUSTIFICATION FORMAT:**
Before every command, state: "Rule: [reason] - [command]"

**MANDATORY CHECKPOINTS** - Agent must confirm at these milestones:

1. **After setup**: "✅ CHECKPOINT 1: Setup complete using only allowed commands, no status checking performed"
2. **After services start**: "✅ CHECKPOINT 2: Services started in background only, no verification attempts made"
3. **Before testing**: "✅ CHECKPOINT 3: Using npm run reset for fresh environment, no manual health checks"
4. **Before browser install**: "✅ CHECKPOINT BROWSER: Installing Playwright browsers with npx playwright install chromium --force"
5. **After each major feature**: "✅ CHECKPOINT: Feature implemented without status checking violations"
6. **MANDATORY FINAL TEST**: "✅ CHECKPOINT FINAL: Running npm run test to verify complete system with screenshots"

**USER: Watch for missing checkpoints - demand confirmation if agent skips them!**

## 🚨 CRITICAL PROJECT-SPECIFIC PROTOCOLS

### Enhanced Reset Script Requirements
**MANDATORY RESET SCRIPT COMPONENTS:**

1. **Automated Port Conflict Detection and Resolution**
2. **Comprehensive Dependency Validation**  
3. **Targeted Process Cleanup (IDE-Safe)**
4. **Background Service Management**

### Port Management Protocol
**ALWAYS use HIGH non-standard ports to avoid conflicts:**
- PostgreSQL: `5440:5432` (not 5432 or 5433)
- Redis: `6390:6379` (not 6379 or 6380)
- Application: `3000` (standard is usually free)

### Reset Script Template
```javascript
#!/usr/bin/env node
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function reset() {
  console.log('🔄 Starting reset process...');
  
  try {
    // CRITICAL: Stop containers FIRST to release ports
    console.log('🧹 Cleaning up Docker containers...');
    await execAsync('docker-compose down 2>/dev/null || true');
    await execAsync('docker system prune -f 2>/dev/null || true');
    
    // Kill processes by port (use non-standard ports)
    console.log('⏹️ Stopping existing processes...');
    await execAsync('lsof -ti:3000 | xargs kill -9 2>/dev/null || true');
    await execAsync('lsof -ti:5440 | xargs kill -9 2>/dev/null || true');
    await execAsync('lsof -ti:6390 | xargs kill -9 2>/dev/null || true');
    
    // Start services
    console.log('🐳 Starting Docker services...');
    await execAsync('docker-compose up -d');
    
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

### Package.json Scripts Template
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

### Playwright Config Template (CRITICAL to prevent hanging)
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

### Docker Compose Template
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
```

## 🚨 CRITICAL LESSONS FROM PREVIOUS FAILURES

**Port Conflict Pattern (FORBIDDEN):**
```bash
# ❌ WRONG: Manual port resolution when reset fails
docker-compose up -d  # Fails with port conflict
# Then manually editing docker-compose.yml, server.js files

# ✅ CORRECT: Reset script handles conflicts automatically
# Use non-standard ports (5433, 6380) from the start
# Reset script stops containers BEFORE starting new ones
```

**Status Checking Pattern (FORBIDDEN):**
```bash
# ❌ WRONG: Verification after service start
nohup node server.js > logs/server.log 2>&1 &
sleep 5 && curl -s http://localhost:3000/health  # FORBIDDEN!

# ✅ CORRECT: Trust the reset process
npm run reset  # Trust the reset process completely
# No status checking - if reset completes, services are ready
```

**Playwright Installation Pattern:**
```bash
# ❌ WRONG: Requires sudo password
npx playwright install-deps  # Asks for password

# ✅ CORRECT: Force install browsers only
npx playwright install chromium --force  # No sudo needed
```

**Background Process Management Violation:**
```bash
# ❌ WRONG: Starting server then immediately checking status
nohup node server.js > logs/server.log 2>&1 &  # Start server
curl -s http://localhost:3000/health | jq .    # Then check status - FORBIDDEN!

# ✅ CORRECT: Background server with proper management
npm run reset     # Complete environment setup
npm run start     # Server starts in background
# NO status checking - trust the process
```

## 🎯 SUCCESS CRITERIA FOR ALL WORK

### Mandatory Requirements
- All tests pass with screenshot evidence
- No status checking violations
- All checkpoints confirmed
- Background processes only
- Reset script functional
- No manual config changes due to port conflicts

### Testing Protocol
- ALWAYS use fresh restart before testing (`npm run reset`)
- Use non-interactive flags: `playwright test --reporter=line --headed=false`
- Start servers in background before running tests
- Never run tests against potentially stale environments
- Generate screenshots for all major functionality

### Final Validation
- Agent MUST run `npm run test` and confirm all tests pass
- Agent MUST provide screenshot evidence
- Saying "project complete" without testing is a violation

## 🚀 OPERATIONAL COMMAND EXAMPLES

**Correct Command Patterns:**
```bash
# ✅ ALWAYS justify commands
Rule: Fresh Environment - npm run reset to ensure clean state
Rule: Background Processes - npm run start to launch server in background
Rule: Targeted Process Kill - using lsof -ti:PORT to avoid IDE crash
Rule: Non-Interactive Testing - using --reporter=line to prevent hanging
```

**Template Justifications:**
- ✅ "Rule: Fresh Environment - [reset command] to ensure clean state"
- ✅ "Rule: Background Processes - [restart command] to start server in background"  
- ✅ "Rule: Command Logging - adding [logging] for monitoring"
- ✅ "Rule: Non-Interactive Testing - using [non-interactive flags] to prevent hanging"
- ✅ "Rule: Targeted Process Kill - using lsof -ti:PORT to avoid IDE crash"

**Violation Indicators:**
- ❌ "Let me check if the server is running" (FORBIDDEN - use restart instead)
- ❌ "I'll start the dev server" (FORBIDDEN - must specify background execution)
- ❌ "Let me test the connection" (FORBIDDEN - use restart instead)
- ❌ "Wait for services to be ready" (FORBIDDEN - use fixed timing)

---

**CRITICAL REMINDER**: This CLAUDE.md file must be referenced before every command execution. All operational rules apply to initial creation AND ongoing development work. No exceptions.