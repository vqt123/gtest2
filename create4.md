# Universal MVP Application Builder - Essential Operational Guide

## 🎯 USER: Describe Your Application Here

**Instructions for User:** Replace this section with your application description. Be specific about what you want to build.

---

## 🚨 CRITICAL OPERATIONAL RULES - ZERO TOLERANCE

**MANDATORY COMPLIANCE CONFIRMATION:**
Every 3 commands, the agent MUST confirm: "✅ OPERATIONAL COMPLIANCE: I am following all rules - no status checking, using npm run reset, background processes only"

**BEFORE EVERY COMMAND**: State "Rule: [reason] - [command]"

### FORBIDDEN COMMANDS (Will hang terminal or crash IDE):
- `npm run dev`, `node server.js` (without `nohup ... &`)
- `curl`, `wget`, `nc`, `telnet`, `ping` for status checking
- `docker ps`, `ps aux | grep`, `docker-compose ps` for status checking  
- `pkill -f node`, `killall` (kills IDE)
- `npx playwright install-deps` (requires sudo)
- Any `sudo` commands (will ask for password)

### REQUIRED PATTERNS:
- Use `npm run reset` instead of ANY status checking
- Background servers: `nohup node server.js > server.log 2>&1 &`
- Kill by port: `lsof -ti:PORT | xargs kill -9`
- Browser install: `npx playwright install chromium --force`

### USER INTERRUPTION TRIGGERS:
If agent says ANY of these phrases, immediately type "STOP":
- "let me check if..."
- "let me see if the server..."
- "I'll test the connection..."
- "wait for the service to be ready..."

## 📋 MANDATORY IMPLEMENTATION STEPS

### 1. FIRST STEP: Create CLAUDE.md
**BEFORE ANY CODING**: Agent must create CLAUDE.md file in project root.
Copy complete template from: `/wsl-code/gtest2/CLAUDE.md`

### 2. Setup with Essential Configurations
```bash
npm init -y
npm install express cors dotenv
# Add packages based on requirements
npm install -D @playwright/test playwright

# Install browsers
npx playwright install chromium --force
```

**CRITICAL: Update package.json scripts:**
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

**CRITICAL: Create playwright.config.js:**
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
  projects: [{
    name: 'chromium',
    use: { ...require('@playwright/test').devices['Desktop Chrome'] }
  }]
};
```

### 3. Docker Services Setup
**Use HIGH non-standard ports to avoid conflicts:**
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
      - "5440:5432"  # High port to avoid conflicts
  redis:
    image: redis:7-alpine
    ports:
      - "6390:6379"  # High port to avoid conflicts
    profiles: ["with-redis"]  # Optional
```

### 4. Enhanced Reset Script
```javascript
#!/usr/bin/env node
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function reset() {
  console.log('🔄 Starting reset process...');
  
  try {
    // Stop containers FIRST
    console.log('🧹 Cleaning up Docker containers...');
    await execAsync('docker-compose down 2>/dev/null || true');
    await execAsync('docker system prune -f 2>/dev/null || true');
    
    // Kill processes by port
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
    
    // Initialize database if needed
    console.log('🗄️ Initializing database...');
    // Add migration logic here
    
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

### 5. E2E Test Template with MANDATORY Gameplay Verification
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Application Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.waitForTimeout(2000);
  });

  test('Application loads successfully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.screenshot({ path: 'screenshots/app-loaded.png' });
    await expect(page.locator('body')).toBeVisible();
  });

  test('Core gameplay mechanics work', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Take initial screenshot
    await page.screenshot({ path: 'screenshots/initial-state.png' });
    
    // Start the game/join room
    await page.click('button:has-text("Start")').catch(() => {});
    await page.click('button:has-text("Join")').catch(() => {});
    await page.click('button:has-text("Play")').catch(() => {});
    
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/game-started.png' });
    
    // Test core game controls - take screenshot after each action
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/after-down-press.png' });
    
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/after-left-press.png' });
    
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/after-right-press.png' });
    
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/after-space-press.png' });
  });

  test('Game state changes are visible', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(3000);
    
    // Take multiple screenshots over time to catch dynamic content
    await page.screenshot({ path: 'screenshots/state-check-1.png' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/state-check-2.png' });
    await page.waitForTimeout(2000);  
    await page.screenshot({ path: 'screenshots/state-check-3.png' });
  });

  test('Interactive elements respond', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Test all clickable elements
    const buttons = await page.locator('button').all();
    for (let i = 0; i < Math.min(buttons.length, 3); i++) {
      await buttons[i].click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `screenshots/button-click-${i}.png` });
    }
  });
});
```

## 🔍 MANDATORY: Screenshot Analysis Protocol

**AFTER TESTS COMPLETE**: Agent MUST examine ALL screenshots and verify:

1. **Visual Functionality**: Are game elements actually visible?
2. **User Interactions**: Do controls produce visible changes?
3. **Rendering Issues**: Are canvases black/empty when they shouldn't be?
4. **Error States**: Are there visual error indicators?

**SYSTEMATIC SCREENSHOT VERIFICATION REQUIRED:**
```bash
# Agent must read EVERY screenshot file and describe what's visible:
Read(screenshots/app-loaded.png)     # Describe: What UI elements are shown?
Read(screenshots/main-features.png)  # Describe: Are interactive elements working?
Read(screenshots/after-interactions.png) # Describe: Did user input cause changes?
Read(screenshots/visual-check.png)   # Describe: Are core features rendering?
```

**MANDATORY VISUAL VERIFICATION CHECKLIST:**
- [ ] **Canvas/Game Area**: Not completely black/empty
- [ ] **Interactive Elements**: Buttons, controls visible and styled
- [ ] **User Feedback**: Visual changes after interactions
- [ ] **Core Functionality**: Main features actually rendering
- [ ] **Error States**: No visual error indicators

**CRITICAL**: Agent must use Read tool on ALL screenshot files and provide detailed description of what's actually visible. Saying "tests pass" is NOT sufficient - must verify visual functionality works.

## 🔧 DEBUGGING WORKFLOW (When Visual Issues Found)

**IF SCREENSHOTS SHOW PROBLEMS** (black screens, missing elements, etc.):

1. **DO NOT claim it's fixed** - verify with fresh screenshots
2. **Use npm run reset** - get clean environment 
3. **Make specific code changes** - target the visual issue
4. **Run npm run test again** - generate new screenshots
5. **Examine new screenshots** - verify the fix actually worked
6. **REPEAT until screenshots show working functionality**

**FORBIDDEN DEBUGGING PATTERNS:**
- ❌ "The rendering should now work" (without screenshot verification)
- ❌ "Fixed the canvas rendering" (without checking screenshots)
- ❌ Making multiple changes without testing each one
- ❌ Assuming code changes work without visual proof

## 🚨 COMPLIANCE CHECKPOINTS

**MANDATORY**: Agent must confirm at these milestones:

1. **After CLAUDE.md creation**: "✅ CHECKPOINT CLAUDE: CLAUDE.md file created for operational compliance"
2. **After setup**: "✅ CHECKPOINT 1: Setup complete using only allowed commands"
3. **After services start**: "✅ CHECKPOINT 2: Services started in background only"
4. **Before testing**: "✅ CHECKPOINT BROWSER: Installing Playwright browsers"
5. **MANDATORY FINAL TEST**: "✅ CHECKPOINT FINAL: Running npm run test with screenshots"
6. **MANDATORY SCREENSHOT ANALYSIS**: "✅ CHECKPOINT VISUAL: Examined all screenshots and verified visual functionality works correctly"

## 🛑 INSTANT VIOLATION DETECTION

**Type "STOP" immediately if agent:**
- Runs commands without "Rule:" prefix
- Uses forbidden phrases like "let me check if..."
- Skips compliance checkpoints
- Uses `curl`, `docker ps`, `ps aux | grep`
- Starts servers in foreground
- **Manually changes ports in config files**
- **Says project is "complete" without running npm run test**
- **Says tests are "passing" without examining screenshots**
- **Claims visual fixes work without verifying screenshots**
- **Describes what screenshots "should" show instead of what they actually show**
- **Uses `sudo` commands**

## ✅ SUCCESS CRITERIA

- Application loads successfully in browser
- All tests pass with screenshot evidence
- **Screenshots show actual visual functionality (not blank/black screens)**
- Docker services running properly
- No hanging commands or processes
- All compliance checkpoints confirmed
- **Agent has examined screenshots and confirmed visual elements work**

## 🔧 Essential Commands

```bash
npm run reset    # Complete environment setup
npm run test     # Run E2E tests with screenshots
```

## 🚫 CRITICAL: What NOT to do

- Never check if server is running - use `npm run reset`
- Never start server in foreground
- Never use curl/wget for testing
- Never manually resolve port conflicts
- Never skip screenshot tests
- Never use `sudo` commands
- Never manually edit config files when ports conflict

---

**Key Principle**: Trust the reset process completely. If `npm run reset` completes successfully, everything is ready. No status checking needed.