# Real-Time Multiplayer Grid Game - Project Creation Instructions

# ⚠️ READ THIS FIRST - CRITICAL OPERATIONAL ENFORCEMENT ⚠️

## 🚨 CRITICAL VIOLATION ENFORCEMENT 🚨

**MANDATORY**: AI must follow strict operational directives to prevent command lockups and violations.

**BEFORE EVERY COMMAND**: AI must state which operational rule justifies the command. Commands without justification are FORBIDDEN.

**FORBIDDEN COMMANDS - NEVER RUN THESE:**
- Development server commands (without nohup/background flags) - WILL HANG TERMINAL
  - Examples: `npm run dev`, `yarn dev`, `pnpm dev`, `cargo run`, `go run`, `python app.py`
- `curl` (for status checking - use restart instead)
- `ps aux | grep` (for status checking - use restart instead) 
- Container status commands (for status checking - use restart instead)
  - Examples: `docker-compose ps`, `docker ps`, `kubectl get pods`
- **CRITICAL**: Global process killing that affects IDE/Editor
  - `pkill -f "node"` (kills Node.js-based IDEs like VSCode, Cursor)
  - `pkill -f "python"` (kills Python-based IDEs)
  - `pkill -f "java"` (kills Java-based IDEs like IntelliJ)
  - `killall [process]` (global killing)
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
- Agent says "let me check if..." or "let me see if..." (status checking)
- Agent runs `npm run dev` without background flags
- Agent uses `curl`, `ps aux | grep`, `docker ps` for status checking
- Commands hang and don't return to prompt
- Terminal becomes unresponsive

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

#### Service Conflicts
- Detect and handle conflicts between development and system services
- Provide clear resolution guidance for manual intervention
- Implement automated conflict detection in reset scripts

#### Platform-Specific Requirements
- Install system-level dependencies with appropriate privileges
- Handle platform differences in package management
- Verify successful installation before proceeding

### Error Resolution Protocol

#### Build/Compilation Issues
- Fix all compilation errors before proceeding
- Address missing declarations and type handling
- Verify all imports and dependencies

#### Test Failures
1. Attempt fresh environment reset first
2. If issues persist, stop and report specific details
3. Never mask fundamental issues with timing adjustments

#### Service Conflicts
- Implement automated detection and resolution where possible
- Guide manual resolution for system-level conflicts
- Test service availability before dependent operations

### Reset Script Requirements - CRITICAL FOR PREVENTING LOCKUPS
- **Target specific processes rather than global termination** - NEVER use global kills that affect IDE
- **Detect and handle container conflicts automatically**
- **Guide resolution of system service conflicts**
- **Clean and rebuild environment completely**
- **NEVER auto-start development servers in foreground** - Use background flags or separate start commands
- **Include comprehensive operation logging**
- **Scripts must complete and return to prompt** - No hanging processes
- **Use background execution (nohup &, screen, tmux) for any long-running processes**

### Single Command Operation Requirements - MANDATORY
**MUST CREATE**: One command that performs complete teardown and rebuild of entire environment.

**SINGLE COMMAND SPECIFICATIONS:**
- **Command name**: `npm run reset` (Node.js) or equivalent for chosen stack
- **Complete teardown**: Kill all processes, remove containers, clean volumes, clear logs
- **Environment rebuild**: Restart services, initialize databases, build code
- **Dependency check**: Verify all services are healthy before completion
- **Background execution**: Start servers in background, never hang terminal
- **Comprehensive logging**: Log every step for debugging
- **Return to prompt**: Command must complete and return control

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

### Development Server Management
- **Development servers MUST run in background during testing**
- **Use separate commands for starting servers interactively vs testing**
- **Scripts should prepare environment but not start hanging processes**
- **Provide clear instructions for manual server startup when needed**

### Testing Protocol - MANDATORY EXECUTION
- **ALWAYS use fresh restart before testing** - No status checking allowed
- **Use non-interactive flags to prevent hanging** - Examples: `--reporter=line`, `--tb=short`, `--quiet`, `-v`
- **Start servers in background before running tests**
- **Never run tests against potentially stale environments**
- **Report clear success/failure metrics and remaining issues**

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
1. **STOP development** - do not proceed to next feature
2. **Run fresh environment reset** - use npm run reset
3. **Investigate and fix** the specific feature issue
4. **Re-test the feature** until it passes
5. **Only then proceed** to the next feature implementation

**🚨 ANTI-PATTERN PREVENTION:**
- **NEVER** implement multiple features without testing each one
- **NEVER** create workaround implementations (SQLite instead of PostgreSQL)
- **NEVER** debug infrastructure for more than 15 minutes without reset
- **NEVER** ignore feature testing requirements
- **ALWAYS** test database connectivity before building game logic
- **ALWAYS** test WebSocket connections before building client
- **ALWAYS** test UI rendering before implementing game mechanics

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