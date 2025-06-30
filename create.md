# Real-Time Multiplayer Grid Game - Project Creation Instructions

# ⚠️ READ THIS FIRST - CRITICAL OPERATIONAL ENFORCEMENT ⚠️

## 🚨 CRITICAL VIOLATION ENFORCEMENT 🚨

**MANDATORY**: AI must follow strict operational directives to prevent command lockups and violations.

**BEFORE EVERY COMMAND**: AI must state which operational rule justifies the command. Commands without justification are FORBIDDEN.

**FORBIDDEN COMMANDS - NEVER RUN THESE:**
- Development server commands (without nohup/background flags) - WILL HANG TERMINAL
  - Examples: `npm run dev`, `yarn dev`, `pnpm dev`, `cargo run`, `go run`, `python app.py`
- **CRITICAL STATUS CHECKING VIOLATIONS** - Use restart instead of ANY status verification:
  - `curl` (health checks, API testing, endpoint verification)
  - `wget` (endpoint testing, connectivity checks)
  - `nc` or `netcat` (port testing, connectivity checks)
  - `telnet` (port testing, service availability)
  - `ping` (service availability testing)
  - HTTP clients (axios, fetch, requests) for health checking
  - Database connection testing after container start
  - Service availability polling/waiting loops
- **PROCESS/CONTAINER STATUS CHECKING** - Use restart instead:
  - `ps aux | grep` (process status checking)
  - `pgrep` (process identification)
  - `docker ps` (container status)
  - `docker-compose ps` (service status)
  - `kubectl get pods` (k8s status)
  - `systemctl status` (service status)
- **CRITICAL**: Global process killing that affects IDE/Editor
  - `pkill -f "node"` (kills Node.js-based IDEs like VSCode, Cursor)
  - `pkill -f "python"` (kills Python-based IDEs)
  - `pkill -f "java"` (kills Java-based IDEs like IntelliJ)
  - `killall [process]` (global killing)
- **PORT CONFLICT PATTERNS** - Use automated detection instead:
  - Manual port checking before service start
  - Interactive port conflict resolution
  - Hardcoded port assignments without conflict detection
- Any command that starts servers in foreground
- Any command for "checking status" - ALWAYS restart instead

**⚠️ IDE CRASH PREVENTION:**
- NEVER use global process killing that affects your development environment
- ALWAYS use targeted process killing (by port, project name, specific PID)
- Many IDEs run on common runtimes (Node.js, Python, Java) and will crash with global kills
- Use `lsof -ti:PORT | xargs kill` for port-specific termination

**VIOLATION CONSEQUENCES:**
1. First violation: User interrupts and demands justification
2. Second violation: Session restart required
3. Third violation: Complete operational guidelines rewrite

**🔍 VIOLATION DETECTION TRIGGERS (User: Watch for these!):**
- Agent runs commands without stating justification first
- Agent uses forbidden commands from the list above
- **CRITICAL STATUS CHECKING PHRASES** - These indicate violations:
  - "let me check if..." or "let me see if..." (status checking)
  - "let me test the connection" (forbidden verification)
  - "let me verify the server is running" (status checking)
  - "wait for services to be ready" (polling/waiting)
  - "check if the database is accessible" (connection testing)
  - "ensure the service is healthy" (health checking)
- **FORBIDDEN COMMAND PATTERNS:**
  - `curl`, `wget`, `nc`, `telnet` for any verification
  - `ps aux | grep`, `docker ps`, `docker-compose ps`
  - Database connection scripts run immediately after container start
  - HTTP requests to health endpoints
  - Port testing or service availability checks
- **PROCESS MANAGEMENT VIOLATIONS:**
  - Commands that hang and don't return to prompt
  - Terminal becomes unresponsive
  - Server started but not properly backgrounded
  - Multiple status checks in sequence
- **PORT CONFLICT INDICATORS:**
  - Manual port changes in config files
  - "port already in use" errors not handled automatically
  - Interactive port conflict resolution

**🛑 INTERRUPTION PROCEDURES (User: Do this immediately!):**
1. **Press Ctrl+C** to interrupt hanging commands
2. **Type "STOP"** in chat and demand justification 
3. **Quote the specific violated rule** from this document
4. **Demand restart** if violations continue
5. **For IDE crashes**: Restart your editor and demand session restart

**🔧 RECOVERY WORKFLOWS:**
- After violation: Force agent to use `npm run reset` before continuing
- After IDE crash: Restart editor, then restart session
- After hanging: Ctrl+C, then demand fresh restart approach
- After repeated violations: Request complete session restart

## 🚨 CRITICAL: Learned Violations from Previous Failures 🚨

**THESE EXACT PATTERNS CAUSED PREVIOUS PROJECT FAILURES:**

### **Status Checking Violation Example**
```bash
# ❌ VIOLATION PATTERN (caused previous failure):
nohup node server.js > logs/server.log 2>&1 &
sleep 5 && curl -s http://localhost:3000/health  # FORBIDDEN!

# ✅ CORRECT PATTERN:
npm run reset  # Trust the reset process completely
# No status checking - if reset completes, services are ready
```

### **Port Conflict Resolution Violation**
```bash
# ❌ VIOLATION PATTERN (caused previous failure):
# Manual port changes in docker-compose.yml and .env
# Interactive conflict resolution
# "port already in use" errors requiring manual intervention

# ✅ CORRECT PATTERN:
# Automated port detection in reset script
auto_assign_ports()  # Handles conflicts automatically
```

### **Background Process Management Violation**
```bash
# ❌ VIOLATION PATTERN (caused previous failure):
nohup node server.js > logs/server.log 2>&1 &  # Start server
curl -s http://localhost:3000/health | jq .      # Then check status - FORBIDDEN!

# ✅ CORRECT PATTERN:
npm run reset     # Complete environment setup
npm run start     # Server starts in background
# NO status checking - trust the process
```

### **Dependency Management Violation**
```bash
# ❌ VIOLATION PATTERN (caused previous failure):
# Missing dotenv in package.json
# Runtime dependency errors during execution
# "Cannot find module" errors

# ✅ CORRECT PATTERN:
# Pre-validate all dependencies in reset script
validate_dependencies()  # Check before any execution
```

**CRITICAL LESSON**: The previous agent violated core rules by:
1. **Using curl for health checks** after starting services
2. **Manually resolving port conflicts** instead of automation
3. **Starting server then immediately checking status** (forbidden pattern)
4. **Missing dependency validation** causing runtime failures
5. **Not using npm run reset** for fresh environment

**PREVENTION**: Every command must be justified against these learned violations.

## Core Operational Rules - ZERO TOLERANCE
1. **Command Logging**: Log all operations for transparency and debugging
2. **Never Skip Components**: Complete all tasks, tests, and dependencies
3. **Handle Permission Requests**: Stop and ask user for help with elevated privileges
4. **Prevent Process Hanging**: Never run commands that start long-running processes without background flags
5. **Fresh Environment**: Use reset mechanisms instead of status checking - NO EXCEPTIONS
6. **No Workaround Fixes**: Fix root causes rather than masking issues
7. **No Status Checking**: NEVER check if services are running. ALWAYS restart everything fresh instead

**REQUIRED JUSTIFICATION FORMAT:**
Before every command, state: "Operational justification: [rule] - [command purpose]"

**ENHANCED JUSTIFICATION EXAMPLES (Learned from Previous Failures):**
```bash
# ✅ CORRECT JUSTIFICATIONS:
"Operational justification: Fresh Environment - npm run reset to ensure clean state (no status checking)"
"Operational justification: Background Processes - npm run start to launch server in background (no verification)"
"Operational justification: Automated Port Detection - using reset script port assignment"
"Operational justification: Dependency Validation - pre-build dependency check to prevent runtime errors"

# ❌ VIOLATION JUSTIFICATIONS (These indicate the agent will violate rules):
"Let me check if the server is running" (STATUS CHECKING VIOLATION)
"I'll test the database connection" (VERIFICATION VIOLATION)  
"Let me see if the services are ready" (POLLING VIOLATION)
"I'll verify the health endpoint" (HEALTH CHECK VIOLATION)
```

**TEMPLATE JUSTIFICATIONS (copy-paste these):**
- ✅ "Operational justification: Fresh Environment - [reset command] to ensure clean state"
- ✅ "Operational justification: Background Processes - [restart command] to start server in background"  
- ✅ "Operational justification: Command Logging - adding [logging] for monitoring"
- ✅ "Operational justification: Non-Interactive Testing - using [non-interactive flags] to prevent hanging"
- ✅ "Operational justification: Targeted Process Kill - using lsof -ti:PORT to avoid IDE crash"
- ❌ "Let me check if the server is running" (FORBIDDEN - use restart instead)
- ❌ "I'll start the dev server" (FORBIDDEN - must specify background execution)

**EXAMPLES BY TECHNOLOGY:**
- **Node.js**: "npm run reset", "npm test -- --reporter=line"
- **Python**: "python manage.py restart", "pytest --tb=short"  
- **Java**: "./gradlew clean build", "mvn test -Dtest.output=minimal"
- **Go**: "go run . &", "go test -v"
- **Rust**: "cargo run &", "cargo test --quiet"

---

## Project Overview
Create a real-time multiplayer 2D grid game where players move around a grid collecting randomly spawning items. Players can see each other in real-time, and all interactions are tracked persistently in a database.

## System Dependencies & Prerequisites

### Required Software Categories
- **Runtime Environment**: Modern version supporting latest language features
- **Package Manager**: Latest version compatible with runtime
- **Containerization**: For isolated service environments
- **Container Orchestration**: For multi-container coordination

### Critical Setup Requirements

#### AI Agent Dependency Verification Protocol
The AI agent must verify and guide installation of dependencies based on the user's operating system:

1. **Runtime Version Compatibility Check**
   - Verify both user and system (sudo/admin) runtime versions are compatible
   - If versions don't match or are incompatible, guide user through platform-appropriate installation
   - Test both user and elevated privilege environments

2. **Browser Testing Dependencies**
   - Check if end-to-end testing framework dependencies are installed
   - If testing fails with dependency errors, guide user to install platform-specific browser libraries
   - Use platform-appropriate package managers or built-in installers

3. **System Service Management**
   - Identify if passwordless admin access is needed for stopping conflicting services
   - Guide user to configure appropriate permissions for development workflow
   - Focus on services that might conflict with containerized services

4. **Container Environment Verification**
   - Ensure containerization platform is installed and running
   - Test container creation permissions
   - Verify port availability for required services

## Technical Requirements

### Backend Stack
- **Language**: Strongly-typed language with modern async features
- **Web Framework**: Lightweight HTTP server framework
- **Real-time Communication**: WebSocket library for multiplayer features
- **Database**: Relational database for persistent data
- **Cache/Session Store**: In-memory database for real-time state management
- **Build System**: Compilation toolchain with proper configuration
- **Testing**: End-to-end browser testing framework

### Frontend Stack
- **Client**: HTML5 with Canvas for game rendering
- **Styling**: Utility-first CSS framework for responsive UI
- **Real-time Client**: WebSocket client for server communication
- **Input Handling**: Keyboard controls for player movement

### Game Features Required
1. **Player System**: Username-based player creation and tracking
2. **Movement System**: Real-time player movement on fixed grid with boundary checking
3. **Item System**: Random item spawning with collision detection
4. **Persistence**: All interactions saved to database with timestamps
5. **Multiplayer**: Multiple players can interact simultaneously
6. **Leaderboard**: Track player progress and statistics

### Database Design Requirements
- Player entities: Store usernames, progress metrics, timestamps
- Interaction tracking: Record all player actions with metadata
- Proper indexes for performance
- Relational integrity between entities

### Development Infrastructure
- **CLAUDE.md operational guidelines file** - MANDATORY first step for agent compliance
- **Screenshot testing infrastructure** - MANDATORY second step for visual validation
- Container orchestration for database and cache services
- Command logging system for monitoring all operations
- Reset/restart scripts for development workflow
- Build configuration with source maps
- Development server with auto-reload capability
- **Single command teardown/rebuild** for complete environment reset

### Game Mechanics Specifications
- **Grid System**: Fixed-size grid (recommend 20x20)
- **Player Representation**: Distinct visual indicators per player
- **Item Representation**: Visually distinct collectible items
- **Movement**: Discrete movement system with boundary enforcement
- **Collection**: Automatic detection when player reaches item
- **Spawning**: Random positioning avoiding occupied cells
- **UI**: Display player information and progress

### Technical Architecture
- Server handles all game logic and validation
- Cache stores temporary game state (positions, active items)
- Database stores permanent data (accounts, history)
- Client sends commands, receives state updates
- Real-time updates broadcast to all connected players

## Success Criteria
The completed project should:
1. Allow multiple players to join with unique identifiers
2. Display real-time movement of all players
3. Spawn collectible items that players can obtain
4. Persist all player interactions to database
5. Show live progress for each player
6. Handle player connections and disconnections gracefully
7. Provide smooth, responsive user experience

## Development Approach
1. **FIRST**: Create CLAUDE.md with operational enforcement rules (copy from template)
2. Set up development environment with containerized services
3. **Set up screenshot testing infrastructure** (screenshots directory, test framework configuration)
4. **Create single command for complete teardown/rebuild**
5. Build core server with database connections → **Test database connectivity and basic server functionality**
6. Implement game logic with real-time communication → **Test WebSocket connections and basic game state**
7. Create client interface with input handling → **Test UI rendering and basic player interactions**
8. Implement player system → **Test player creation, movement, and tracking**
9. Implement item/money system → **Test item spawning, visibility, and collection mechanics**
10. Implement multiplayer features → **Test real-time synchronization between multiple players**
11. **MANDATORY**: Run comprehensive final test suite and verify all tests pass (minimum 80% pass rate)
12. **MANDATORY**: Fix any failing tests before considering project complete

## AI Agent Operational Protocol

### 🚨 MANDATORY FIRST STEP - CLAUDE.md CREATION 🚨

**BEFORE ANY CODING**: AI must create CLAUDE.md file in project root with operational enforcement rules.

**CLAUDE.md REQUIREMENTS:**
1. Copy the entire "🚨 CRITICAL VIOLATION ENFORCEMENT" section from this document
2. Add project-specific command logging requirements
3. Include forbidden commands list relevant to chosen technology stack
4. Add violation detection and recovery procedures
5. Ensure CLAUDE.md is referenced throughout the session

**TEMPLATE CLAUDE.md STRUCTURE:**
```markdown
# AI Assistant Operational Guidelines

## 🚨 CRITICAL VIOLATION ENFORCEMENT 🚨
[Copy enforcement section from create.md]

## Core Operational Rules
[Copy rules from create.md]

## Project-Specific Guidelines
- Command logging: All commands must append to logs/command.log
- Reset commands: [project-specific reset commands]
- Background execution: [project-specific background patterns]
- Test commands: [project-specific non-interactive flags]

## Single Command Operations
- Complete teardown/rebuild: [single command for full reset]
- Quick restart: [quick service restart]
- Test run: [full test suite with proper flags]
```

### 🚨 MANDATORY SECOND STEP - SCREENSHOT TESTING INFRASTRUCTURE 🚨

**BEFORE ANY GAME DEVELOPMENT**: AI must set up screenshot testing infrastructure.

**SCREENSHOT INFRASTRUCTURE REQUIREMENTS:**
1. **Create screenshots directory** for test visual validation
2. **Configure test framework** to capture screenshots automatically
3. **Set up .gitignore** to ignore screenshots but preserve directory structure
4. **Add screenshot capture to test setup** for both failures and successes
5. **Configure visual regression testing** for core UI components

**MANDATORY SCREENSHOT SETUP CHECKLIST:**
- ✅ Create `screenshots/` directory in project root
- ✅ Configure test framework to save screenshots
- ✅ Add screenshots to .gitignore with directory preservation
- ✅ Set up automatic screenshot capture on test failures
- ✅ Configure success screenshots for critical game mechanics

**FRAMEWORK-SPECIFIC SETUP:**
- **Playwright**: Configure in `playwright.config.ts` with screenshot options
- **Cypress**: Add screenshot commands to test setup  
- **Selenium**: Configure screenshot capture in test framework setup

**SCREENSHOT IMPLEMENTATION EXAMPLES:**
- **Playwright**: `await page.screenshot({ path: 'screenshots/test-name.png' })`
- **Cypress**: `cy.screenshot('test-name')`
- **Selenium**: `driver.save_screenshot('screenshots/test-name.png')`

**MANDATORY SCREENSHOTS FOR CRITICAL GAME MECHANICS:**
- Money/items spawning and being visible
- Player movement and position updates  
- Money collection and counter updates
- Multiple players on same screen
- Leaderboard functionality

**EXAMPLE .GITIGNORE ENTRY:**
```
# Screenshots directory structure preserved, but files ignored
screenshots/
!screenshots/.gitkeep
```

### Dependency Management Protocol

#### Version Compatibility
- Ensure consistent versions across user and system environments
- Test compatibility before proceeding with dependent installations
- Guide platform-specific installation when needed

#### **CRITICAL: Automated Port Conflict Detection Protocol**
**MANDATORY**: All reset scripts must include automated port conflict detection and resolution.

**REQUIRED PORT CONFLICT HANDLING:**
```bash
# CORRECT: Automated port conflict detection
check_port_conflicts() {
    POSTGRES_PORT=5432
    REDIS_PORT=6379
    SERVER_PORT=3000
    
    # Auto-increment ports if conflicts detected
    while lsof -ti:$POSTGRES_PORT >/dev/null 2>&1; do
        POSTGRES_PORT=$((POSTGRES_PORT + 1))
    done
    
    # Update config files automatically
    sed -i "s/DB_PORT=.*/DB_PORT=$POSTGRES_PORT/" .env
    sed -i "s/\"5432:5432\"/\"$POSTGRES_PORT:5432\"/" docker-compose.yml
}
```

**FORBIDDEN PORT HANDLING:**
- ❌ Manual port changes in config files
- ❌ Interactive port conflict resolution
- ❌ Hardcoded port assignments without detection
- ❌ Error messages asking user to resolve conflicts

#### **CRITICAL: Pre-Build Dependency Validation**
**MANDATORY**: Validate all dependencies before any build/start operations.

**REQUIRED DEPENDENCY CHECKS:**
```bash
# CORRECT: Pre-build validation
validate_dependencies() {
    # Check package.json completeness
    node -e "const pkg = require('./package.json'); 
             const required = ['express', 'socket.io', 'pg', 'redis', 'dotenv', 'cors'];
             const missing = required.filter(dep => !pkg.dependencies[dep]);
             if (missing.length) { console.error('Missing:', missing); process.exit(1); }"
    
    # Verify system dependencies
    command -v docker >/dev/null || { echo "Docker required"; exit 1; }
    command -v docker-compose >/dev/null || { echo "Docker Compose required"; exit 1; }
}
```

#### Service Conflicts
- **AUTOMATED**: Detect and handle conflicts between development and system services
- **SCRIPTED**: Implement automated conflict detection in reset scripts
- **NO MANUAL INTERVENTION**: Scripts must resolve conflicts automatically

#### Platform-Specific Requirements
- Install system-level dependencies with appropriate privileges
- Handle platform differences in package management
- **VALIDATE**: Verify successful installation before proceeding with automated testing

### Error Resolution Protocol

#### Build/Compilation Issues
- Fix all compilation errors before proceeding
- Address missing declarations and type handling
- Verify all imports and dependencies

#### **CRITICAL: Process Cleanup Verification Protocol**
**MANDATORY**: Comprehensive process and port cleanup with verification.

**REQUIRED CLEANUP PATTERNS:**
```bash
# CORRECT: Targeted process cleanup with verification
cleanup_processes() {
    # Kill specific project processes by port
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    lsof -ti:5432,5433 | xargs kill -9 2>/dev/null || true
    lsof -ti:6379,6380 | xargs kill -9 2>/dev/null || true
    
    # Stop containers by project name
    docker-compose down --remove-orphans
    docker container prune -f
    
    # Verify cleanup completed
    if lsof -ti:3000,5432,5433,6379,6380 >/dev/null 2>&1; then
        echo "ERROR: Cleanup failed - ports still in use"
        exit 1
    fi
}
```

**FORBIDDEN CLEANUP PATTERNS:**
- ❌ Global process killing (`pkill -f node`, `killall`)
- ❌ Manual process identification
- ❌ Interactive cleanup requiring user input

#### Test Failures
1. **MANDATORY**: Attempt fresh environment reset first
2. If issues persist, stop and report specific details
3. **NEVER** mask fundamental issues with timing adjustments
4. **NEVER** debug for more than 15 minutes without reset

#### **CRITICAL: Background Process Management Protocol**
**MANDATORY**: Strict separation between service startup and verification.

**REQUIRED BACKGROUND PROCESS PATTERNS:**
```bash
# CORRECT: Start services in background, rely on reset script validation
start_services() {
    docker-compose up -d postgres redis
    sleep 10  # Fixed wait, no polling
    nohup node server.js > logs/server.log 2>&1 &
    echo "Services started in background - use 'npm run reset' to verify"
}
```

**FORBIDDEN POST-START VERIFICATION:**
- ❌ `curl` health checks after service start
- ❌ Database connection testing after container start
- ❌ Port polling or availability checking
- ❌ Service status verification
- ❌ "Wait for services to be ready" loops

**SERVICE CONFLICT RESOLUTION:**
- **AUTOMATED**: Scripts detect and resolve conflicts automatically
- **NO MANUAL STEPS**: Never require user intervention for conflicts
- **NO STATUS CHECKING**: Never test service availability - use restart approach

### **🚨 CRITICAL: Enhanced Reset Script Requirements**

**MANDATORY RESET SCRIPT COMPONENTS:**

#### **1. Automated Port Conflict Detection and Resolution**
```bash
# REQUIRED: Dynamic port assignment
auto_assign_ports() {
    find_free_port() {
        local port=$1
        while lsof -ti:$port >/dev/null 2>&1; do
            port=$((port + 1))
        done
        echo $port
    }
    
    export POSTGRES_PORT=$(find_free_port 5432)
    export REDIS_PORT=$(find_free_port 6379)
    export SERVER_PORT=$(find_free_port 3000)
    
    # Auto-update all config files
    update_config_ports
}
```

#### **2. Comprehensive Dependency Validation**
```bash
# REQUIRED: Pre-build validation
validate_environment() {
    # System dependencies
    command -v docker >/dev/null || { echo "Missing: docker"; exit 1; }
    command -v node >/dev/null || { echo "Missing: node"; exit 1; }
    
    # Package dependencies
    npm list express socket.io pg redis dotenv cors >/dev/null 2>&1 || {
        echo "Installing missing dependencies..."
        npm install
    }
}
```

#### **3. Targeted Process Cleanup (IDE-Safe)**
```bash
# REQUIRED: Safe process termination
cleanup_safely() {
    # Target specific ports only
    for port in 3000 5432 5433 6379 6380; do
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
    done
    
    # Project-specific containers only
    docker-compose down --remove-orphans 2>/dev/null || true
    
    # Verify cleanup success
    verify_cleanup_complete
}
```

#### **4. Background Service Management**
```bash
# REQUIRED: Proper background execution
start_services_background() {
    docker-compose up -d postgres redis
    sleep 10  # Fixed wait, no status checking
    
    nohup node server.js > logs/server.log 2>&1 &
    echo $! > .server.pid  # Save PID for cleanup
    
    echo "Services started - environment ready"
    # NO status checking - trust the restart process
}
```

**CRITICAL REQUIREMENTS:**
- **Target specific processes** - NEVER use global kills that affect IDE
- **Automate port conflict resolution** - NO manual config changes
- **Validate dependencies pre-build** - Prevent runtime failures
- **Background service management** - NO foreground hanging
- **Comprehensive logging** - All operations logged
- **Scripts return to prompt** - NO hanging processes
- **NO STATUS CHECKING** - Trust restart process completely

### **🚨 MANDATORY: Single Command Operation Requirements**

**ENHANCED SINGLE COMMAND SPECIFICATIONS:**

#### **Complete Reset Command Structure**
```bash
#!/usr/bin/env node
// REQUIRED: npm run reset implementation
const { exec, spawn } = require('child_process');
const fs = require('fs');

async function fullReset() {
    console.log('🔄 Starting complete environment reset...');
    
    // 1. Automated port conflict detection
    await autoAssignPorts();
    
    // 2. Comprehensive cleanup (IDE-safe)
    await cleanupSafely();
    
    // 3. Dependency validation
    await validateEnvironment();
    
    // 4. Service startup (background)
    await startServicesBackground();
    
    // 5. Database initialization
    await initializeDatabase();
    
    // 6. Build verification
    await buildProject();
    
    console.log('✅ Environment reset complete - ready for development');
    process.exit(0);  // Return to prompt
}
```

**MANDATORY RESET FEATURES:**
- **Automated port detection**: No manual port configuration
- **Complete teardown**: Kill processes, remove containers, clean volumes
- **Dependency validation**: Pre-validate all requirements
- **Background service startup**: No hanging processes
- **Database initialization**: Automated schema setup
- **Build verification**: Ensure compilation success
- **Return to prompt**: Command completes and exits
- **NO STATUS CHECKING**: Trust the reset process completely

**FORBIDDEN IN RESET SCRIPTS:**
- ❌ Health check polling after service start
- ❌ Interactive configuration
- ❌ Manual port conflict resolution
- ❌ Global process killing
- ❌ Foreground server startup
- ❌ Status verification commands

**IMPLEMENTATION EXAMPLES:**
- **Node.js**: `npm run reset` calls script that does full teardown/rebuild
- **Python**: `python manage.py reset_all` for Django projects
- **Java**: `./gradlew resetEnvironment` for Gradle projects
- **Go**: `make reset` using Makefile
- **Rust**: `cargo run --bin reset` for custom reset binary

**SCRIPT REQUIREMENTS:**
1. Stop all project processes (targeted, not global)
2. Stop and remove all containers/services
3. Clean volumes and temporary data
4. Restart infrastructure services
5. Wait for services to be healthy
6. Initialize/migrate databases
7. Build application code
8. Start application in background
9. Verify everything is working
10. Return to prompt with status message

### **🚨 CRITICAL: Development Server Management Protocol**

#### **Background Server Requirements**
```bash
# CORRECT: Background server with proper management
start_dev_server() {
    # Kill existing server processes
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    
    # Start in background with logging
    nohup node server.js > logs/server.log 2>&1 &
    echo $! > .server.pid
    
    echo "Development server started in background (PID: $(cat .server.pid))"
    echo "Logs: tail -f logs/server.log"
    echo "Stop: npm run stop"
}

# CORRECT: Clean server shutdown
stop_dev_server() {
    if [ -f .server.pid ]; then
        kill $(cat .server.pid) 2>/dev/null || true
        rm .server.pid
    fi
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
}
```

**MANDATORY SERVER MANAGEMENT RULES:**
- **Always background**: Use `nohup ... &` for server processes
- **PID tracking**: Save process IDs for clean shutdown
- **Separate start/stop commands**: `npm run start`, `npm run stop`
- **No foreground execution**: Scripts never hang terminal
- **No status checking**: Never verify server health after start

**FORBIDDEN SERVER PATTERNS:**
- ❌ `node server.js` (foreground execution)
- ❌ `npm run dev` without background flags
- ❌ Health checks after server start
- ❌ Polling for server readiness
- ❌ Interactive server management

### **🚨 MANDATORY: Enhanced Testing Protocol**

#### **Pre-Test Environment Preparation**
```bash
# REQUIRED: Fresh environment before every test run
setup_test_environment() {
    echo "🔄 Preparing fresh test environment..."
    
    # 1. Complete reset (no status checking)
    npm run reset
    
    # 2. Wait for services (fixed time, no polling)
    sleep 15
    
    # 3. Start application in background
    npm run start
    
    echo "✅ Test environment ready"
}
```

**MANDATORY TEST EXECUTION RULES:**
1. **Fresh restart ALWAYS**: Use `npm run reset` before every test
2. **Non-interactive flags**: Prevent hanging with proper flags
3. **Background services**: All servers run in background during tests
4. **Fixed timing**: Use sleep, never polling or status checks
5. **Clean reporting**: Clear pass/fail metrics only

**REQUIRED NON-INTERACTIVE FLAGS:**
- **Playwright**: `--reporter=line --headed=false`
- **Jest**: `--verbose --no-watch --forceExit`
- **Mocha**: `--reporter spec --timeout 10000`
- **npm test**: `-- --reporter=line`

**FORBIDDEN TEST PATTERNS:**
- ❌ Status checking before test execution
- ❌ Health endpoint verification
- ❌ Service availability polling
- ❌ Interactive test runners
- ❌ Tests against potentially stale environments
- ❌ Manual test environment setup

### Incremental Testing Requirements - AFTER EACH MAJOR FEATURE
**MANDATORY**: Agent must test each major feature immediately after implementation.

**INCREMENTAL TESTING PROTOCOL:**
1. **After database/server setup**: Test basic connectivity and health endpoints
2. **After WebSocket implementation**: Test real-time communication and game state updates
3. **After UI creation**: Test basic rendering, controls, and user interactions
4. **After player system**: Test player creation, movement, position tracking
5. **After item/money system**: Test item spawning, visibility, collection detection
6. **After multiplayer features**: Test real-time synchronization between multiple clients

**FEATURE-SPECIFIC TEST REQUIREMENTS:**
- **Database connectivity**: Connection success, table creation, basic queries
- **WebSocket communication**: Connect, disconnect, message sending/receiving
- **UI rendering**: Canvas display, player visualization, UI controls
- **Player movement**: Arrow key controls, boundary checking, position updates
- **Money/item system**: Spawning mechanics, visual display, collection detection
- **Multiplayer sync**: Multiple players visible, real-time position updates

**IF FEATURE TESTS FAIL:**
1. **STOP development immediately** - do not proceed to next feature
2. **Run fresh environment reset** - use `npm run reset` (no status checking)
3. **Wait fixed time** - sleep 15 seconds, no polling
4. **Re-run test once** - if still fails, investigate code issue
5. **Fix root cause** - never mask with workarounds or timeouts
6. **Verify fix with fresh reset** - run `npm run reset` then test again
7. **Only proceed** when feature passes consistently

**🚨 ENHANCED ANTI-PATTERN PREVENTION:**
- **NEVER** implement multiple features without testing each one
- **NEVER** create workaround implementations (SQLite instead of PostgreSQL)
- **NEVER** debug infrastructure for more than 15 minutes without reset
- **NEVER** ignore feature testing requirements
- **NEVER** use status checking to verify feature functionality
- **NEVER** poll or wait for services to be "ready"
- **NEVER** implement health checks or connectivity testing
- **NEVER** manually resolve port conflicts
- **NEVER** start services in foreground during development
- **ALWAYS** use `npm run reset` for clean environment
- **ALWAYS** trust the reset process completely
- **ALWAYS** use background service execution
- **ALWAYS** validate dependencies before building

### Final Test Execution Requirements - ZERO TOLERANCE
**MANDATORY**: Agent must run comprehensive final test suite after all features are implemented and tested.

**FINAL TEST EXECUTION PROTOCOL:**
1. **Fresh environment restart** before running any tests
2. **Run complete integrated test suite** using non-interactive flags (includes screenshot testing)
3. **Verify test results** - minimum 80% pass rate required
4. **Fix all failing tests** before considering project complete

**FINAL TESTING SCOPE:**
- Integration testing of all features working together
- Full user workflow testing (join → move → collect → leaderboard)
- Multi-player scenario testing with screenshot evidence
- Database persistence verification across sessions
- Performance and stability testing

**CORE MECHANICS TESTING CHECKLIST (verified by automated tests with screenshots):**
- ✅ Player can join game with username
- ✅ Player movement works in all directions
- ✅ **Money/items spawn and are visible** (screenshot evidence)
- ✅ **Money/items can be collected by walking onto them** (screenshot evidence)
- ✅ **Player money total updates when collecting items** (screenshot evidence)
- ✅ Multiple players can join simultaneously
- ✅ Real-time updates work between players
- ✅ Leaderboard displays and updates
- ✅ Database persistence works

**FAILURE SCENARIOS THAT MUST BE CAUGHT:**
- Money acts as obstacles instead of collectibles
- Collection detection not working
- Real-time updates not syncing between players
- Database not persisting player progress
- Tests passing but game mechanics broken

**IF TESTS FAIL:**
1. Do NOT consider project complete
2. Investigate and fix root cause
3. Re-run full test suite (including screenshot validation)
4. Only complete when all tests pass with screenshot evidence


### Command Execution Safety Rules
1. **Fresh Start Mandatory**: Always use project reset/restart commands before testing
2. **Background Processes**: Any long-running command must use background execution (`nohup ... &`, `screen`, `tmux`) or be in separate scripts
3. **No Status Checking**: Replace status checks with restart operations
4. **Command Justification**: Every command must be justified against operational rules using CLAUDE.md
5. **Logging Required**: All commands must include appropriate logging for monitoring
6. **CLAUDE.md Reference**: Agent must reference CLAUDE.md before every command execution
7. **Screenshot Documentation**: Tests must capture screenshots for debugging and validation
8. **Incremental Testing Mandatory**: Agent must test each major feature immediately after implementation
9. **Final Test Execution Mandatory**: Agent must run comprehensive final test suite before considering project complete

## Expected Outcomes
- High test pass rate (target 80%+ of test scenarios)
- Clean service startup without conflicts
- Functional real-time multiplayer gameplay
- Persistent data storage working correctly
- Robust reset and restart mechanisms
- **CLAUDE.md file created and referenced throughout session**
- **Screenshot testing infrastructure working**
- **Single command complete teardown/rebuild functional**
- **Agent follows command justification protocol consistently**
- **🚨 CRITICAL: Incremental testing completed after each major feature**
- **🚨 CRITICAL: Final comprehensive test suite executed and passing (with screenshot evidence)**
- **🚨 CRITICAL: Core game mechanics verified through automated tests at each development stage**
- **🚨 CRITICAL: Money/item collection functionality confirmed with screenshots**