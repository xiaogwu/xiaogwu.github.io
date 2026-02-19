from playwright.sync_api import sync_playwright
import sys

def verify(page):
    print("Navigating to http://localhost:8080")
    page.goto("http://localhost:8080")

    print("Checking video element...")
    video = page.locator("#bg-video")
    if video.count() == 0:
        print("Video not found")
        sys.exit(1)

    # Check if video has correct source
    src = video.locator("source").get_attribute("src")
    if src != "images/background.mp4":
        print(f"Video source mismatch: {src}")
        sys.exit(1)

    print("Checking overlay...")
    overlay = page.locator(".hero-overlay")
    if overlay.count() == 0:
        print("Overlay not found")
        sys.exit(1)

    print("Checking content wrapper...")
    content = page.locator(".hero-content")
    if content.count() == 0:
        print("Content wrapper not found")
        sys.exit(1)

    print("Checking h1 text...")
    if page.locator(".hero-content h1").inner_text() != "Hi, I'm Sean Wu":
        print("H1 text mismatch")
        sys.exit(1)

    print("Taking screenshot...")
    page.screenshot(path="verification_screenshot_real_video.png")
    print("Verification successful, screenshot taken.")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    try:
        verify(page)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
    finally:
        browser.close()
