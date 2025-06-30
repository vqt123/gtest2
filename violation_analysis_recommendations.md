# Operational Guidelines Violation Analysis & Recommendations

## Executive Summary
Analysis of failed project creation attempt reveals 5 critical violation categories that require immediate operational guideline updates to prevent recurring issues.

## Violation Categories Identified

### 1. Status Checking Violations
**Issue**: Agent used `curl -s http://localhost:3000/health` despite explicit prohibition
**Current Rule**: Line 14 forbids curl for status checking
**Impact**: Circumvented fresh restart approach, led to cascading issues

### 2. Background Process Mismanagement  
**Issue**: Started server with nohup but immediately attempted status verification
**Current Rule**: Lines 322-326 cover background execution but lack post-start protocols
**Impact**: Created race conditions and process hanging

### 3. Port Conflict Resolution Gaps
**Issue**: Manual resolution of Redis (6379) and PostgreSQL (5432) port conflicts
**Current Rule**: Lines 290-298 mention conflicts but lack specific resolution protocols
**Impact**: Time-consuming manual intervention, potential for missed conflicts

### 4. Dependency Validation Failures
**Issue**: Missing dotenv dependency caused migration script failure
**Current Rule**: Lines 284-298 cover general dependency management
**Impact**: Runtime failures that could have been prevented by validation

### 5. Process Cleanup Deficiencies
**Issue**: Server processes left hanging, required manual termination
**Current Rule**: Lines 317-326 cover reset scripts but lack cleanup verification
**Impact**: Resource leaks, potential IDE crashes from global kills

## Specific Recommendations for create.md Updates

### 1. Enhanced Status Checking Prevention

**ADD TO FORBIDDEN COMMANDS SECTION (after line 24):**
```markdown
- Health check commands (use restart verification instead)
  - Examples: `curl http://localhost:*/health`, `wget --spider`, `nc -z localhost PORT`
- Service readiness polling (use restart with built-in health checks instead)
  - Examples: `while ! curl -s URL; do sleep 1; done`, `wait-for-it.sh`, `dockerize -wait`
- Process existence checking (use restart instead)
  - Examples: `pgrep PROCESS`, `pidof PROCESS`, `lsof -i:PORT` (for status only)
```

**ADD TO VIOLATION DETECTION TRIGGERS (after line 44):**
```markdown
- Agent uses health check endpoints or polling mechanisms
- Agent implements "wait until ready" patterns instead of restart
- Agent checks process existence before starting services
```

### 2. Background Process Management Protocol

**ADD NEW SECTION after line 86:**
```markdown
### Background Process Management Protocol

**POST-START BEHAVIOR REQUIREMENTS:**
- After starting background processes, NEVER verify status
- Use built-in health check mechanisms in restart scripts only
- Trust that restart scripts handle service readiness internally
- NEVER implement polling or waiting logic after background starts

**BACKGROUND START PATTERNS:**
```bash
# ✅ CORRECT: Start and trust restart script validation
nohup node server.js > logs/server.log 2>&1 &
# ✅ CORRECT: Use restart script that includes health verification
npm run reset

# ❌ FORBIDDEN: Start then verify
nohup node server.js > logs/server.log 2>&1 &
curl -s http://localhost:3000/health

# ❌ FORBIDDEN: Polling after start
nohup node server.js > logs/server.log 2>&1 &
while ! curl -s http://localhost:3000; do sleep 1; done
```

**RESTART SCRIPT REQUIREMENTS:**
- Scripts must include internal health verification before completion
- Scripts must return only when services are confirmed ready
- Scripts must handle all readiness logic internally
- No external status checking required after script completion
```

### 3. Port Conflict Detection & Resolution

**ADD NEW SECTION after Background Process Management:**
```markdown
### Automated Port Conflict Detection & Resolution

**MANDATORY PORT CONFLICT PREVENTION:**
All reset scripts must include automated port conflict detection and resolution.

**REQUIRED PORT CONFLICT SCRIPT COMPONENTS:**
```bash
# 1. Check for port conflicts before starting services
check_port_conflicts() {
    local ports=("3000" "5432" "6379" "8080")  # Project-specific ports
    for port in "${ports[@]}"; do
        if lsof -ti:$port > /dev/null 2>&1; then
            echo "Port $port conflict detected. Killing process..."
            lsof -ti:$port | xargs kill -9
        fi
    done
}

# 2. Dynamic port assignment for development services
setup_dynamic_ports() {
    # Use available ports instead of fixed ones for development
    export DB_PORT=$(find_available_port 5432)
    export REDIS_PORT=$(find_available_port 6379)
    export APP_PORT=$(find_available_port 3000)
}

# 3. Container port mapping with conflict avoidance
docker-compose up -d --force-recreate
```

**FORBIDDEN PORT CONFLICT APPROACHES:**
- Manual editing of docker-compose.yml during development
- Manual editing of .env files for port changes
- Assuming ports are available without checking
- Starting services without conflict detection

**REQUIRED .ENV AND DOCKER-COMPOSE CONFIGURATION:**
- Use environment variables for all port configurations
- Default to standard ports with fallback detection
- Include port conflict resolution in all reset scripts
```

### 4. Dependency Validation Protocol

**ADD NEW SECTION after Port Conflict Detection:**
```markdown
### Dependency Validation Protocol

**MANDATORY PRE-BUILD VALIDATION:**
All reset scripts must validate dependencies before proceeding with build/start operations.

**REQUIRED VALIDATION CHECKS:**
```bash
# 1. Package.json dependency verification
validate_package_deps() {
    local required_deps=("express" "socket.io" "pg" "redis" "dotenv")
    for dep in "${required_deps[@]}"; do
        if ! npm list "$dep" > /dev/null 2>&1; then
            echo "Missing required dependency: $dep"
            echo "Adding $dep to package.json..."
            npm install "$dep" --save
        fi
    done
}

# 2. System dependency verification
validate_system_deps() {
    command -v docker >/dev/null 2>&1 || { echo "Docker required but not installed."; exit 1; }
    command -v docker-compose >/dev/null 2>&1 || { echo "Docker Compose required but not installed."; exit 1; }
}

# 3. Environment file validation
validate_env_config() {
    local required_vars=("DB_HOST" "DB_PORT" "REDIS_HOST" "REDIS_PORT")
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            echo "Missing required environment variable: $var"
            echo "Please configure $var in .env file"
            exit 1
        fi
    done
}
```

**INTEGRATION REQUIREMENTS:**
- Run all validation checks before any build or start operations
- Fail fast with clear error messages for missing dependencies
- Auto-install missing package.json dependencies where possible
- Validate both runtime and system dependencies
```

### 5. Process Cleanup Verification

**ADD TO RESET SCRIPT REQUIREMENTS (after line 356):**
```markdown
**MANDATORY CLEANUP VERIFICATION:**
11. Verify all project processes are terminated (no hanging processes)
12. Confirm all ports are released and available
13. Validate clean process table (no zombie processes)
14. Log cleanup completion with process counts

**CLEANUP VERIFICATION COMMANDS:**
```bash
# Verify no project processes remain
verify_cleanup() {
    local project_name="your-project-name"
    local remaining=$(ps aux | grep "$project_name" | grep -v grep | wc -l)
    if [ "$remaining" -gt 0 ]; then
        echo "WARNING: $remaining project processes still running"
        ps aux | grep "$project_name" | grep -v grep
        return 1
    fi
    echo "✅ All project processes cleaned up"
    return 0
}

# Verify ports are released
verify_port_cleanup() {
    local ports=("3000" "5432" "6379")
    for port in "${ports[@]}"; do
        if lsof -ti:$port > /dev/null 2>&1; then
            echo "WARNING: Port $port still in use"
            lsof -i:$port
            return 1
        fi
    done
    echo "✅ All ports released"
    return 0
}
```
```

### 6. Enhanced Violation Detection

**ADD TO VIOLATION DETECTION TRIGGERS (after current triggers):**
```markdown
- Agent starts services without port conflict checking
- Agent modifies docker-compose.yml or .env for port conflicts during development
- Agent begins build/start without dependency validation
- Agent leaves processes running without cleanup verification
- Agent implements manual waiting or polling after background starts
- Agent uses process checking commands for readiness verification
```

### 7. Recovery Workflow Updates

**ADD TO RECOVERY WORKFLOWS (after line 57):**
```markdown
**SPECIFIC VIOLATION RECOVERY PROCEDURES:**
- After status checking violation: Force agent to explain why restart wasn't used
- After port conflict: Force agent to implement automated conflict detection
- After dependency failure: Force agent to add validation to reset script
- After process hanging: Force agent to add cleanup verification
- After background process mismanagement: Force agent to remove all post-start verification
```

## Implementation Priority

1. **CRITICAL (Implement Immediately)**: Enhanced status checking prevention (#1)
2. **HIGH**: Background process management protocol (#2)  
3. **HIGH**: Port conflict detection & resolution (#3)
4. **MEDIUM**: Dependency validation protocol (#4)
5. **MEDIUM**: Process cleanup verification (#5)
6. **LOW**: Enhanced violation detection (#6, #7)

## Expected Impact

These changes will prevent:
- ❌ Status checking circumvention of restart approach
- ❌ Background process mismanagement and hanging
- ❌ Manual port conflict resolution during development
- ❌ Runtime failures from missing dependencies
- ❌ Process leaks and cleanup issues

And ensure:
- ✅ Consistent fresh restart approach enforcement
- ✅ Automated conflict detection and resolution
- ✅ Validated dependencies before build/start
- ✅ Clean process management throughout development
- ✅ Reliable, repeatable development environment setup