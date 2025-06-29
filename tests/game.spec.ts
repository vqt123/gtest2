import { test, expect } from '@playwright/test';

test.describe('Grid Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login screen', async ({ page }) => {
    await page.screenshot({ path: 'screenshots/01-login-screen.png', fullPage: true });
    
    await expect(page.locator('h1')).toContainText('Multiplayer Grid Game');
    await expect(page.locator('#login-screen')).toBeVisible();
    await expect(page.locator('#username-input')).toBeVisible();
    await expect(page.locator('#join-btn')).toBeVisible();
  });

  test('should join game with valid username', async ({ page }) => {
    await page.fill('#username-input', 'TestPlayer1');
    await page.screenshot({ path: 'screenshots/02-username-entered.png' });
    
    await page.click('#join-btn');
    await page.waitForSelector('#game-screen', { state: 'visible' });
    
    await page.screenshot({ path: 'screenshots/03-game-screen.png', fullPage: true });
    
    await expect(page.locator('#game-screen')).toBeVisible();
    await expect(page.locator('#login-screen')).toBeHidden();
    await expect(page.locator('#game-canvas')).toBeVisible();
    await expect(page.locator('#player-money')).toBeVisible();
  });

  test('should display game canvas and controls', async ({ page }) => {
    await page.fill('#username-input', 'TestPlayer2');
    await page.click('#join-btn');
    await page.waitForSelector('#game-screen', { state: 'visible' });
    
    const canvas = page.locator('#game-canvas');
    await expect(canvas).toBeVisible();
    await expect(canvas).toHaveAttribute('width', '600');
    await expect(canvas).toHaveAttribute('height', '600');
    
    await page.screenshot({ path: 'screenshots/04-game-canvas.png' });
    
    await expect(page.locator('text=Use WASD or Arrow Keys to move')).toBeVisible();
    await expect(page.locator('text=Your Money: $')).toBeVisible();
  });

  test('should show player in players list', async ({ page }) => {
    const username = 'TestPlayer3';
    await page.fill('#username-input', username);
    await page.click('#join-btn');
    await page.waitForSelector('#game-screen', { state: 'visible' });
    
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: 'screenshots/05-players-list.png', fullPage: true });
    
    const playersList = page.locator('#players-list');
    await expect(playersList).toBeVisible();
    await expect(playersList).toContainText(username);
  });

  test('should handle player movement', async ({ page }) => {
    await page.fill('#username-input', 'TestMover');
    await page.click('#join-btn');
    await page.waitForSelector('#game-screen', { state: 'visible' });
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/06-before-movement.png' });
    
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/07-after-right-movement.png' });
    
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/08-after-down-movement.png' });
    
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/09-after-left-movement.png' });
    
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/10-after-up-movement.png' });
  });

  test('should display leaderboard', async ({ page }) => {
    await page.fill('#username-input', 'TestLeaderboard');
    await page.click('#join-btn');
    await page.waitForSelector('#game-screen', { state: 'visible' });
    
    await page.waitForTimeout(2000);
    
    const leaderboard = page.locator('#leaderboard');
    await expect(leaderboard).toBeVisible();
    
    await page.screenshot({ path: 'screenshots/11-leaderboard.png', fullPage: true });
  });

  test('should not allow empty username', async ({ page }) => {
    // Set up dialog listener before clicking
    const dialogPromise = page.waitForEvent('dialog');
    
    await page.click('#join-btn');
    
    const dialog = await dialogPromise;
    expect(dialog.message()).toContain('Please enter a username');
    await dialog.accept();
    
    await expect(page.locator('#login-screen')).toBeVisible();
    await expect(page.locator('#game-screen')).toBeHidden();
  });
});

test.describe('Multiplayer Features', () => {
  test('should show multiple players on same grid', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    await page1.goto('/');
    await page2.goto('/');
    
    await page1.fill('#username-input', 'Player1');
    await page1.click('#join-btn');
    await page1.waitForSelector('#game-screen', { state: 'visible' });
    
    await page2.fill('#username-input', 'Player2');
    await page2.click('#join-btn');
    await page2.waitForSelector('#game-screen', { state: 'visible' });
    
    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);
    
    await page1.screenshot({ path: 'screenshots/12-multiplayer-player1-view.png', fullPage: true });
    await page2.screenshot({ path: 'screenshots/13-multiplayer-player2-view.png', fullPage: true });
    
    const player1List = page1.locator('#players-list');
    const player2List = page2.locator('#players-list');
    
    await expect(player1List).toContainText('Player1');
    await expect(player1List).toContainText('Player2');
    await expect(player2List).toContainText('Player1');
    await expect(player2List).toContainText('Player2');
    
    await context1.close();
    await context2.close();
  });

  test('should sync player movements between clients', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    await page1.goto('/');
    await page2.goto('/');
    
    await page1.fill('#username-input', 'Mover1');
    await page1.click('#join-btn');
    await page1.waitForSelector('#game-screen', { state: 'visible' });
    
    await page2.fill('#username-input', 'Observer2');
    await page2.click('#join-btn');
    await page2.waitForSelector('#game-screen', { state: 'visible' });
    
    await page1.waitForTimeout(1000);
    
    await page2.screenshot({ path: 'screenshots/14-before-other-player-moves.png' });
    
    await page1.keyboard.press('ArrowRight');
    await page1.keyboard.press('ArrowRight');
    await page1.keyboard.press('ArrowDown');
    
    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);
    
    await page2.screenshot({ path: 'screenshots/15-after-other-player-moves.png' });
    
    await context1.close();
    await context2.close();
  });
});

test.describe('Money Collection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should wait for money to spawn and be visible', async ({ page }) => {
    // Wait for the page to load completely
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('#username-input', { state: 'visible' });
    
    await page.fill('#username-input', 'MoneyHunter');
    await page.click('#join-btn');
    await page.waitForSelector('#game-screen', { state: 'visible' });
    
    await page.waitForTimeout(15000);
    
    await page.screenshot({ path: 'screenshots/16-money-spawned.png', fullPage: true });
    
    const playerMoney = page.locator('#player-money');
    await expect(playerMoney).toBeVisible();
  });
});