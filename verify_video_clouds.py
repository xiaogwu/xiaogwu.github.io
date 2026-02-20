
import asyncio
from playwright.async_api import async_playwright
import os
import subprocess
import time

async def run():
    # Start the server
    server_process = subprocess.Popen(["npx", "serve", "-l", "8081"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    # Wait for server to start
    time.sleep(2)

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            await page.goto("http://localhost:8081")

            # Wait for the video element to be visible
            video = page.locator("video#bg-video")
            await video.wait_for(state="visible")

            # Check if video has a source and is playing (we can check readyState)
            is_playing = await video.evaluate("video => video.readyState >= 3") # HAVE_FUTURE_DATA or higher
            print(f"Video ready state check: {is_playing}")

            # Take a screenshot
            await page.screenshot(path="verification_screenshot_clouds.png")
            print("Screenshot saved to verification_screenshot_clouds.png")

            await browser.close()
    finally:
        # Stop the server
        server_process.terminate()

if __name__ == "__main__":
    asyncio.run(run())
