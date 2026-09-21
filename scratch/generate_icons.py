import math
from PIL import Image, ImageDraw

def create_pwa_icon(size):
    # Supersample at 4x for smooth antialiasing
    scale = 4
    s = size * scale
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background card with rounded corners
    bg_color = (248, 247, 244, 255) # #F8F7F4
    radius = int(s * 0.22)
    draw.rounded_rectangle([0, 0, s, s], radius=radius, fill=bg_color)

    # Colors
    steel_blue = (122, 152, 191, 255) # #7A98BF
    terracotta = (115, 72, 47, 255)   # #73482F
    white = (255, 255, 255, 255)

    # Coordinates
    x1, y1 = s * 0.28, s * 0.70
    x2, y2 = s * 0.70, s * 0.28
    mid_x, mid_y = s * 0.49, s * 0.49

    # Connecting Line
    line_width = int(s * 0.04)
    draw.line([x1, y1, x2, y2], fill=steel_blue, width=line_width)

    # Node 1: Bottom-Left Ring
    r1 = s * 0.085
    stroke1 = s * 0.035
    draw.ellipse([x1 - r1, y1 - r1, x1 + r1, y1 + r1], fill=white, outline=steel_blue, width=int(stroke1))

    # Node 2: Middle Circle
    r2 = s * 0.09
    stroke2 = s * 0.015
    draw.ellipse([mid_x - r2, mid_y - r2, mid_x + r2, mid_y + r2], fill=steel_blue, outline=white, width=int(stroke2))

    # Node 3: Top-Right Rotated Diamond with Star
    diamond_size = s * 0.19
    # Create diamond on separate image to rotate cleanly
    d_img_size = int(diamond_size * 2)
    d_img = Image.new("RGBA", (d_img_size, d_img_size), (0, 0, 0, 0))
    d_draw = ImageDraw.Draw(d_img)
    
    # Draw rounded rect centered
    rect_w = diamond_size
    rect_rad = rect_w * 0.22
    rect_box = [
        (d_img_size - rect_w) / 2,
        (d_img_size - rect_w) / 2,
        (d_img_size + rect_w) / 2,
        (d_img_size + rect_w) / 2
    ]
    d_draw.rounded_rectangle(rect_box, radius=int(rect_rad), fill=terracotta, outline=white, width=int(s * 0.012))

    # Draw Star in center of diamond
    star_r_outer = diamond_size * 0.28
    star_r_inner = star_r_outer * 0.4
    cx_d, cy_d = d_img_size / 2, d_img_size / 2
    star_pts = []
    for i in range(10):
        r = star_r_outer if i % 2 == 0 else star_r_inner
        angle = i * math.pi / 5 - math.pi / 2
        star_pts.append((cx_d + r * math.cos(angle), cy_d + r * math.sin(angle)))
    d_draw.polygon(star_pts, fill=white)

    # Rotate 45 degrees
    rotated_d = d_img.rotate(45, resample=Image.Resampling.BICUBIC, expand=False)
    
    # Paste centered at x2, y2
    paste_pos = (int(x2 - d_img_size / 2), int(y2 - d_img_size / 2))
    img.paste(rotated_d, paste_pos, rotated_d)

    # Downsample to target size with Lanczos
    final_img = img.resize((size, size), Image.Resampling.LANCZOS)
    return final_img

# Generate icons
for sz, filename in [
    (192, "public/pwa-192x192.png"),
    (512, "public/pwa-512x512.png"),
    (180, "public/apple-touch-icon.png")
]:
    icon = create_pwa_icon(sz)
    icon.save(filename, "PNG")
    print(f"Generated {filename} ({sz}x{sz})")
