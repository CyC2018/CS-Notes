"""把 src/*.svg 渲染成 notes/pics/*.png。

用法：
    python3 tools/diagram/build.py            # 渲染全部
    python3 tools/diagram/build.py paxos-example cache-aside

依赖：Pillow，以及 Chrome、Edge 或 Chromium 之一（无头模式截图）。
浏览器路径可用环境变量 CHROME 指定。

图片按 2 倍分辨率输出，在笔记里用 width 指定为 SVG 的宽度即可。
渲染结果不带水印，水印由 tools/watermark.py 添加，启用 tools/hooks 后提交时会自动执行。
"""
import os
import shutil
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "src")
OUT = os.path.join(HERE, "..", "..", "notes", "pics")
SCALE = 2  # 按 2 倍分辨率输出，在高分屏上也清晰

BROWSERS = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "google-chrome", "chromium", "chromium-browser", "microsoft-edge",
]


def browser():
    if os.environ.get("CHROME"):
        return os.environ["CHROME"]
    for b in BROWSERS:
        path = b if os.path.isabs(b) else shutil.which(b)
        if path and os.path.exists(path):
            return path
    sys.exit("找不到 Chrome/Edge/Chromium，请用环境变量 CHROME 指定浏览器路径")


def render(name, exe, profile):
    svg = os.path.join(SRC, name + ".svg")
    root = ET.parse(svg).getroot()
    w, h = int(float(root.get("width"))), int(float(root.get("height")))
    png = os.path.abspath(os.path.join(OUT, name + ".png"))
    subprocess.run([
        exe, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
        "--user-data-dir=" + profile, f"--force-device-scale-factor={SCALE}",
        f"--window-size={w},{h}", "--default-background-color=ffffffff",
        "--screenshot=" + png, "file://" + os.path.abspath(svg),
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    img = Image.open(png).convert("RGB")
    img.save(png, optimize=True)
    print(f"{name}.svg -> notes/pics/{name}.png {img.size[0]}x{img.size[1]}")


def main():
    names = sys.argv[1:] or sorted(f[:-4] for f in os.listdir(SRC) if f.endswith(".svg"))
    exe = browser()
    with tempfile.TemporaryDirectory() as profile:
        for name in names:
            render(name, exe, profile)


if __name__ == "__main__":
    main()
