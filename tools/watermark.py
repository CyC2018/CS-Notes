"""给配图加 CyC2018 浅水印。

用法：
    python3 tools/watermark.py notes/pics/a.png notes/pics/b.jpg
    python3 tools/watermark.py --check notes/pics/*.png    # 只检查，不修改

水印分两层：
- 整张图斜向平铺一层很淡的 “CyC2018” 文字，不影响阅读；
- 右下角加上与已有配图一致的浅灰色猫头图标和 “CyC2018”，右下角有内容时在底部补白边。
角标大小按图片宽度自动缩放，也可以用 --scale 指定。

加过水印的图片会在元数据中写入标记，再次执行时直接跳过，不会重复叠加。
GIF 动图不处理。依赖 Pillow。
"""
import argparse
import os
import sys

from PIL import Image, ImageDraw, ImageFont, PngImagePlugin

TEXT = "CyC2018"
MARK = "Watermark: CyC2018"
GRAY = (128, 128, 128)
ALPHA = 0.57          # 角标：白底上约为 #B7B7B7，与已有配图的水印深浅一致
TILE_ALPHA = 0.07     # 平铺：白底上约为 #F6F6F6，只在留意时可见
TILE_ANGLE = 30       # 平铺文字的倾斜角度
SS = 4                # 超采样倍数，用于抗锯齿

FONTS = [  # 等宽字体，与已有水印一致
    "/System/Library/Fonts/Menlo.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
    "C:/Windows/Fonts/consola.ttf",
]


def _font(size):
    for path in FONTS:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default(size)


def _mark(scale):
    """生成右下角水印的 alpha 蒙版。"""
    icon = round(24 * scale) * SS
    font = _font(round(19 * scale) * SS)
    left, top, right, bottom = font.getbbox(TEXT)
    gap = round(8 * scale) * SS
    w = icon + gap + right
    h = max(icon, bottom - top)
    mask = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(mask)

    # 猫头图标：按 100×100 网格绘制后缩放
    def p(x, y):
        return (x * icon / 100, (h - icon) / 2 + y * icon / 100)

    d.polygon([p(10, 50), p(14, 4), p(46, 26)], fill=255)
    d.polygon([p(90, 50), p(86, 4), p(54, 26)], fill=255)
    d.rounded_rectangle([p(6, 22), p(94, 96)], radius=34 * icon / 100, fill=255)
    d.rounded_rectangle([p(18, 54), p(82, 88)], radius=16 * icon / 100, fill=0)
    d.ellipse([p(31, 61), p(41, 79)], fill=255)
    d.ellipse([p(59, 61), p(69, 79)], fill=255)

    d.text((icon + gap, (h - (bottom - top)) / 2 - top), TEXT, font=font, fill=255)
    return mask.resize((w // SS, h // SS), Image.LANCZOS)


def _tiles(size, scale):
    """生成整张图斜向平铺的文字蒙版。"""
    W, H = size
    font = _font(round(15 * scale))
    right = font.getbbox(TEXT)[2]
    dx, dy = round(right * 2.6), round(85 * scale)
    side = int((W ** 2 + H ** 2) ** 0.5) + 2 * dx
    big = Image.new("L", (side, side), 0)
    d = ImageDraw.Draw(big)
    for row, y in enumerate(range(0, side, dy)):
        for x in range(-dx + (dx // 2) * (row % 2), side, dx):
            d.text((x, y), TEXT, font=font, fill=255)
    big = big.rotate(TILE_ANGLE, resample=Image.BICUBIC)
    l, t = (side - W) // 2, (side - H) // 2
    return big.crop((l, t, l + W, t + H))


def _blank(img, box):
    """判断区域内是否基本为空白。"""
    region = img.crop(box).convert("L")
    dark = sum(1 for v in region.getdata() if v < 235)
    return dark <= region.width * region.height * 0.002


def add(img, scale=None):
    """返回加了水印的新图片。scale 默认按宽度计算，1000px 宽的图为 1。"""
    if scale is None:
        scale = min(max(img.width / 1000, 0.6), 2.0)
    img = img.convert("RGBA") if img.mode in ("P", "LA", "RGBA") else img.convert("RGB")
    mask = _mark(scale)
    mx, my = round(12 * scale), round(6 * scale)
    W, H = img.size
    box = (W - mask.width - 2 * mx, H - mask.height - 2 * my, W, H)
    if box[0] < 0 or not _blank(img, box):
        bg = (255, 255, 255, 255) if img.mode == "RGBA" else (255, 255, 255)
        padded = Image.new(img.mode, (W, H + mask.height + 2 * my), bg)
        padded.paste(img, (0, 0))
        img, H = padded, padded.height
    layer = Image.new(img.mode, img.size, GRAY + ((255,) if img.mode == "RGBA" else ()))
    img.paste(layer, (0, 0), _tiles(img.size, scale).point(lambda v: round(v * TILE_ALPHA)))
    corner = Image.new("L", img.size, 0)
    corner.paste(mask.point(lambda v: round(v * ALPHA)), (W - mask.width - mx, H - mask.height - my))
    img.paste(layer, (0, 0), corner)
    return img


def marked(img):
    """图片是否已经加过水印。"""
    value = img.info.get("Watermark") or img.info.get("comment") or b""
    if isinstance(value, bytes):
        value = value.decode("utf-8", "ignore")
    return "CyC2018" in value


def save(img, path):
    """保存图片并写入水印标记。"""
    if path.lower().endswith(".png"):
        info = PngImagePlugin.PngInfo()
        info.add_text("Watermark", "CyC2018")
        img.save(path, pnginfo=info, optimize=True)
    else:
        img.convert("RGB").save(path, quality=92, comment=MARK.encode())


def main():
    ap = argparse.ArgumentParser(description="给配图加 CyC2018 浅水印")
    ap.add_argument("images", nargs="+")
    ap.add_argument("--scale", type=float, help="角标缩放，默认按图片宽度计算")
    ap.add_argument("--check", action="store_true", help="只检查是否已加水印")
    ap.add_argument("--mark-only", action="store_true", help="图片已有水印，只写入标记")
    args = ap.parse_args()
    missing = 0
    for path in args.images:
        if not path.lower().endswith((".png", ".jpg", ".jpeg")):
            print("skip (not png/jpg)", path)
            continue
        img = Image.open(path)
        if marked(img):
            print("ok", path)
        elif args.check:
            print("missing watermark", path)
            missing += 1
        elif args.mark_only:
            save(img, path)
            print("marked", path)
        else:
            save(add(img, args.scale), path)
            print("watermarked", path)
    sys.exit(1 if missing else 0)


if __name__ == "__main__":
    main()
