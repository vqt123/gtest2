# AI Assistant Operational Guidelines

## 🚨 CRITICAL VIOLATION ENFORCEMENT 🚨

**BEFORE EVERY COMMAND**: The AI must state which CLAUDE.md rule justifies the command. Commands without justification are FORBIDDEN.

**FORBIDDEN COMMANDS - NEVER RUN THESE:**
- `npm run dev` (without nohup/background)
- `curl` (for status checking - use restart instead)
- `ps aux | grep` (for status checking - use restart instead) 
- `docker-compose ps` (for status checking - use restart instead)
- Any command that starts servers in foreground
- Any command for "checking status" - ALWAYS restart instead

**VIOLATION CONSEQUENCES:**
1. First violation: User interrupts and demands justification
2. Second violation: Session restart required
3. Third violation: Complete operational guidelines rewrite

## Core Operational Rules

### Command Execution Requirements
**CRITICAL**: Always append command logging to ALL bash commands for monitoring
- Create and use a dedicated logs directory
- This allows real-time monitoring of all command outputs
- No exceptions - every command must be logged

### Critical Constraints - ZERO TOLERANCE
- **NEVER SKIP ANYTHING**: Do not skip tests, dependencies, or any part of the requested task. Always fix issues completely rather than working around them
- **STOP FOR PASSWORD PROMPTS**: If any command requires a password prompt, STOP immediately and ask the user for help. Show them exactly what command needs to be run with sudo. Do not continue or hang waiting for password input
- **PREVENT COMMAND LOCKUPS**: Never run commands that start long-running processes without background flags. Scripts should prepare services but not start development servers that hang
- **NO TIMEOUT FIXES**: Do not add waits or timeouts to fix failing tests. Always tear everything down and bring everything back up for a fresh test. If that doesn't work, stop and notify the user
- **USE NON-INTERACTIVE FLAGS**: For long-running commands like test runners, use appropriate flags to avoid hanging on report servers
- **NO STATUS CHECKING**: NEVER check if services are running. ALWAYS restart everything fresh instead.

## Development Workflow Protocol

### Fresh Start Approach - MANDATORY
**ALWAYS** use reset/restart mechanisms instead of checking service status. This ensures a clean environment and prevents conflicts.

**REQUIRED JUSTIFICATION FORMAT:**
Before every command, state: "CLAUDE.md justification: [rule] - [command purpose]"

**EXAMPLES:**
- ✅ "CLAUDE.md justification: Fresh Start Approach - npm run reset"
- ❌ "Let me check if the server is running" (FORBIDDEN - use restart instead)

### Dependency Management Protocol

#### Version Compatibility Requirements
- Both user AND system (sudo) environments must have compatible software versions
- Test both user and system versions before proceeding
- If mismatch detected, guide user through platform-specific installation
- Required for tools that need system-level dependencies

#### System Service Conflicts
- Local development services may conflict with system services on same ports
- Configure appropriate permissions for service management when needed
- Scripts should detect conflicts and guide user to resolve them

#### Platform-Specific Dependencies
- Some tools require system-level libraries
- Must install system dependencies with appropriate privileges
- May need additional platform-specific packages

### Error Resolution Protocol

#### Compilation/Build Errors
- Always fix compilation errors completely before proceeding
- Common issues include:
  - Missing variable declarations
  - Proper null/undefined handling
  - Import verification and dependency installation

#### Test Failures
1. **First attempt**: Complete fresh restart using reset mechanisms
2. **If still failing**: Stop and notify user with specific failure details
3. **Never mask issues** with timeouts, waits, or workarounds

#### Service Conflicts
- Use automated scripts to handle container/service conflicts
- For system service conflicts, guide user to resolve manually
- Detect common port conflicts and provide resolution guidance

#### Command Hanging Issues
- Use appropriate non-interactive flags for long-running processes
- Scripts should NOT auto-start development servers
- Background flags required for long-running processes

## Environment-Aware Dependency Resolution

The AI agent must:
1. **Detect Operating System**: Use system commands to identify platform
2. **Check Existing Installations**: Verify current software versions before suggesting changes  
3. **Provide Platform-Specific Guidance**: Give appropriate commands for the user's environment
4. **Verify After Installation**: Test that dependencies work after user installs them

## General Troubleshooting Patterns

### Process Management
- Use targeted process identification (by port, project name, etc.)
- Avoid global process termination that affects other applications
- Implement graceful cleanup and restart mechanisms

### Service Management  
- Detect and handle service conflicts automatically where possible
- Provide clear guidance for manual resolution when required
- Test service availability before proceeding with dependent operations

### Testing Protocol
- Use appropriate reporters/flags to prevent hanging
- Fresh environment for each test run when issues occur
- Stop and report when fundamental issues can't be resolved with restart

## Documentation Requirements

Create project-specific documentation separate from these general guidelines:
- Service connection details and credentials
- Project structure and file organization  
- Environment variables and configuration
- Specific commands and scripts for the project
- Known issues and their resolutions specific to the project