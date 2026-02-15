from PIL import Image, ImageEnhance, ImageOps
import sys

def process_headshot(input_path, output_path):
    try:
        img = Image.open(input_path)

        # Convert to grayscale for professional look
        img = ImageOps.grayscale(img)

        # Enhance contrast slightly
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.2)

        # Enhance brightness slightly if needed (often headshots benefit from a bit more light)
        enhancer_brightness = ImageEnhance.Brightness(img)
        img = enhancer_brightness.enhance(1.1)

        # Ensure square crop (center)
        width, height = img.size
        new_size = min(width, height)

        left = (width - new_size) / 2
        top = (height - new_size) / 2
        right = (width + new_size) / 2
        bottom = (height + new_size) / 2

        img = img.crop((left, top, right, bottom))

        # Resize to standard headshot size (e.g., 400x400 for high DPI)
        img = img.resize((400, 400), Image.LANCZOS)

        img.save(output_path, quality=95)
        print(f"Successfully processed image to {output_path}")

    except Exception as e:
        print(f"Error processing image: {e}")
        sys.exit(1)

if __name__ == "__main__":
    process_headshot("images/headshot.jpg", "images/headshot_professional.jpg")
