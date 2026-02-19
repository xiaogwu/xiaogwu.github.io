from playwright.sync_api import sync_playwright
import sys

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            page.goto("http://localhost:8080")
            page.wait_for_load_state("networkidle")

            # Verify Section Backgrounds
            # Hero is 1st (video), About is 2nd (even -> secondary bg), Skills is 3rd (odd -> primary bg or transparent)
            # Wait, my CSS says: section:nth-of-type(even) { bg: secondary }

            # Check About Section (2nd section)
            about_bg = page.evaluate("window.getComputedStyle(document.querySelector('#about')).backgroundColor")
            print(f"About section background: {about_bg}")

            # Check Skills Section (3rd section)
            skills_bg = page.evaluate("window.getComputedStyle(document.querySelector('#skills')).backgroundColor")
            print(f"Skills section background: {skills_bg}")

            if about_bg == skills_bg:
                print("WARNING: About and Skills sections have the same background color. Banding might be broken.")
            else:
                print("SUCCESS: Section banding detected.")

            # Take Screenshot
            page.screenshot(path="verification_visual.png", full_page=True)
            print("Screenshot saved to verification_visual.png")

            # Test Light Mode
            # Click theme toggle
            page.click("#theme-toggle")
            page.wait_for_timeout(500) # Wait for transition

            body_bg_light = page.evaluate("window.getComputedStyle(document.body).backgroundColor")
            print(f"Light mode body background: {body_bg_light}")

            if "rgb(248, 250, 252)" in body_bg_light or "rgb(255, 255, 255)" in body_bg_light:
                 print("SUCCESS: Light mode background detected.")
            else:
                 print(f"WARNING: Unexpected light mode background: {body_bg_light}")

            page.screenshot(path="verification_visual_light.png", full_page=True)
            print("Light mode screenshot saved to verification_visual_light.png")

        except Exception as e:
            print(f"Error: {e}")
            sys.exit(1)
        finally:
            browser.close()

if __name__ == "__main__":
    verify()
