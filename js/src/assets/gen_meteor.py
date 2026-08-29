from PIL import Image, ImageDraw, ImageFilter
import math, random

random.seed(7)
W = H = 256
img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
px = img.load()

cx, cy = 170, 128
R = 58

# 球体：左上受光，右下变暗，边缘加入暖色（高速摩擦感）
for y in range(H):
    for x in range(W):
        dx, dy = x - cx, y - cy
        d = math.hypot(dx, dy)
        if d > R:
            continue
        t = d / R                      # 0 中心 -> 1 边缘
        lx, ly = -0.55, -0.6           # 光照方向（左上）
        ld = max(0.0, (-dx * lx - dy * ly) / R)
        shade = 0.5 + 0.5 * ld
        base = 165 + 65 * (1 - t)      # 中心更亮
        v = int(base * shade)
        # 右缘（运动前方）轻微暖色
        warm = max(0.0, dx / R) * 40
        r = max(40, min(235, v + int(warm)))
        g = max(40, min(235, v + int(warm * 0.55)))
        b = max(40, min(235, int(v * 0.92)))
        px[x, y] = (r, g, b, 255)

# 陨石坑：亮边 + 暗心
def crater(ccx, ccy, cr):
    d = ImageDraw.Draw(img)
    d.ellipse([ccx - cr, ccy - cr, ccx + cr, ccy + cr],
              fill=(205, 205, 205, 70))
    ir = max(1, int(cr * 0.82))
    d.ellipse([ccx - ir, ccy - ir, ccx + ir, ccy + ir],
              fill=(70, 70, 70, 115))

crater(cx - 18, cy - 10, 14)
crater(cx + 14, cy - 4, 10)
crater(cx - 4, cy + 16, 12)
crater(cx + 20, cy + 18, 8)
crater(cx - 26, cy + 12, 7)

# 拖尾：黄->橙->暗红，向后（左）渐隐，带抖动
trail = Image.new("RGBA", (W, H), (0, 0, 0, 0))
td = ImageDraw.Draw(trail)
n = 46
sx = cx - R * 0.5
for i in range(n):
    f = i / (n - 1)                    # 0 贴体 -> 1 远端
    x = sx - f * (sx - 8)
    y = cy + math.sin(f * 6.0) * 10 * f + random.uniform(-3, 3)
    rr = 5 + 16 * (1 - f) + random.uniform(-2, 2)
    if f < 0.28:
        col = (255, 232, 130)
    elif f < 0.65:
        col = (255, 150, 45)
    else:
        col = (205, 70, 25)
    a = int(190 * (1 - f) ** 1.3)
    td.ellipse([x - rr, y - rr, x + rr, y + rr], fill=(col[0], col[1], col[2], a))

# 前端火花
sp = ImageDraw.Draw(trail)
for _ in range(14):
    ang = random.uniform(-0.5, 0.5)
    dist = R * (0.4 + random.random() * 0.5)
    x = cx + math.cos(ang) * dist
    y = cy + math.sin(ang) * dist
    rr = random.uniform(1.5, 4.0)
    sp.ellipse([x - rr, y - rr, x + rr, y + rr],
               fill=(255, 220, 150, random.randint(120, 220)))

trail = trail.filter(ImageFilter.GaussianBlur(5))
img = Image.alpha_composite(img, trail)

# 把球体重新盖在拖尾之上（拖尾不应遮挡本体）
body = Image.new("RGBA", (W, H), (0, 0, 0, 0))
bpx = body.load()
for y in range(H):
    for x in range(W):
        if math.hypot(x - cx, y - cy) <= R:
            body.putpixel((x, y), img.getpixel((x, y)))
img = body

# 本体外的暖色辉光（运动前方更强）
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
gd.ellipse([cx - R - 6, cy - R - 6, cx + R + 22, cy + R + 6],
           fill=(255, 140, 50, 60))
glow = glow.filter(ImageFilter.GaussianBlur(10))
img = Image.alpha_composite(glow, img)

out = "/Users/wey/work/flutter_dynamic/fuickjs_demo/js/src/assets/meteor.png"
img.save(out)
print("saved", out, img.size)
