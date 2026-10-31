"""生成学习站的图标和链接预览图（src/icons/、src/og.png），改了配色或文字后重新运行：python3 learn/make_images.py"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
THEME, BG, INK, MUTED, SOFT = (91, 91, 214), (246, 246, 248), (21, 21, 28), (94, 94, 106), (238, 238, 253)
CJK = '/System/Library/Fonts/Hiragino Sans GB.ttc'
LATIN = '/System/Library/Fonts/Helvetica.ttc'


def icon(size, maskable=False):
    # 绿色底上一张白色题卡，卡上三行“要点”和一个对勾；maskable 版本留出安全区
    scale = 4
    s = size * scale
    img = Image.new('RGB', (s, s), THEME)
    d = ImageDraw.Draw(img)
    pad = s * (0.2 if maskable else 0.14)
    if not maskable:
        img = Image.new('RGBA', (s, s), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        d.rounded_rectangle([0, 0, s - 1, s - 1], radius=s * 0.22, fill=THEME)
    x0, y0, x1, y1 = pad, pad * 1.1, s - pad, s - pad * 1.1
    d.rounded_rectangle([x0, y0, x1, y1], radius=s * 0.07, fill=(255, 255, 255))
    w = x1 - x0
    for i, frac in enumerate((0.62, 0.48, 0.38)):
        y = y0 + (y1 - y0) * (0.26 + i * 0.2)
        d.rounded_rectangle([x0 + w * 0.14, y, x0 + w * (0.14 + frac), y + s * 0.045], radius=s * 0.0225, fill=SOFT if i else (201, 201, 245))
    cx, cy = x0 + w * 0.72, y0 + (y1 - y0) * 0.7
    d.line([(cx - s * 0.07, cy), (cx - s * 0.02, cy + s * 0.05), (cx + s * 0.08, cy - s * 0.06)], fill=THEME, width=int(s * 0.04), joint='curve')
    return img.resize((size, size), Image.LANCZOS)


def og(count):
    w, h = 1200, 630
    img = Image.new('RGB', (w, h), BG)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([40, 40, w - 40, h - 40], radius=28, fill=(255, 255, 255), outline=(228, 228, 234), width=2)
    img.paste(icon(96), (96, 96), icon(96))
    d.text((216, 112), 'CS-Notes 学习', font=ImageFont.truetype(CJK, 40), fill=THEME)
    d.text((96, 236), '先测水平，再按天学，', font=ImageFont.truetype(CJK, 64), fill=INK)
    d.text((96, 322), '记到面试那天', font=ImageFont.truetype(CJK, 64), fill=INK)
    d.text((96, 432), f'{count} 道面试题 · 自评定级 · 每日计划 · 间隔复习', font=ImageFont.truetype(CJK, 30), fill=MUTED)
    d.text((96, 490), '免费、无需注册，学习记录只保存在自己的浏览器中', font=ImageFont.truetype(CJK, 30), fill=MUTED)
    # 右侧一张示意题卡
    x, y = 820, 150
    d.rounded_rectangle([x, y, x + 300, y + 330], radius=20, fill=SOFT)
    for i, frac in enumerate((0.8, 0.62, 0.7, 0.45)):
        d.rounded_rectangle([x + 32, y + 48 + i * 46, x + 32 + 236 * frac, y + 68 + i * 46], radius=10, fill=(201, 201, 245) if i == 0 else (255, 255, 255))
    for i, (label, color) in enumerate((('不会', (180, 42, 51)), ('模糊', (138, 80, 0)), ('会', THEME))):
        bx = x + 24 + i * 88
        d.rounded_rectangle([bx, y + 250, bx + 76, y + 300], radius=12, fill=(255, 255, 255))
        f = ImageFont.truetype(CJK, 24)
        tw = d.textlength(label, font=f)
        d.text((bx + 38 - tw / 2, y + 260), label, font=f, fill=color)
    return img


if __name__ == '__main__':
    out = HERE / 'src' / 'icons'
    out.mkdir(exist_ok=True)
    for size in (180, 192, 512):
        icon(size).save(out / f'icon-{size}.png', optimize=True)
    icon(512, maskable=True).save(out / 'maskable-512.png', optimize=True)
    icon(32).save(out / 'favicon-32.png', optimize=True)
    # 题数取自构建结果，先运行 build.py
    import json
    count = len(json.loads((HERE / 'dist' / 'data.json').read_text())['questions'])
    og(count).save(HERE / 'src' / 'og.png', optimize=True)
    print('done')
