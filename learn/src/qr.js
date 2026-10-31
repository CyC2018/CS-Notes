// 二维码生成（ISO/IEC 18004）：字节模式、纠错等级 M、版本 1～10，最多 213 字节，用于分享图片中的链接。
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LearnQR = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  // 纠错等级 M 下每个版本的分块：[每块的纠错码字数, 第一组块数, 第一组每块数据码字数, 第二组块数, 第二组每块数据码字数]
  var BLOCKS = [null,
    [10, 1, 16, 0, 0], [16, 1, 28, 0, 0], [26, 1, 44, 0, 0], [18, 2, 32, 0, 0], [24, 2, 43, 0, 0],
    [16, 4, 27, 0, 0], [18, 4, 31, 0, 0], [22, 2, 38, 2, 39], [22, 3, 36, 2, 37], [26, 4, 43, 1, 44]];
  var ALIGN = [null, [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]];

  // GF(256) 上的乘法，本原多项式 x^8 + x^4 + x^3 + x^2 + 1
  function mul(x, y) {
    var z = 0;
    for (var i = 7; i >= 0; i--) {
      z = (z << 1) ^ ((z >>> 7) * 0x11D);
      z ^= ((y >>> i) & 1) * x;
    }
    return z;
  }
  function divisor(degree) {
    var result = [], root = 1, i, j;
    for (i = 0; i < degree; i++) result.push(0);
    result[degree - 1] = 1;
    for (i = 0; i < degree; i++) {
      for (j = 0; j < degree; j++) {
        result[j] = mul(result[j], root);
        if (j + 1 < degree) result[j] ^= result[j + 1];
      }
      root = mul(root, 2);
    }
    return result;
  }
  function remainder(data, div) {
    var result = div.map(function () { return 0; });
    data.forEach(function (b) {
      var factor = b ^ result.shift();
      result.push(0);
      for (var i = 0; i < div.length; i++) result[i] ^= mul(div[i], factor);
    });
    return result;
  }
  function utf8(text) {
    if (typeof TextEncoder !== 'undefined') return Array.from(new TextEncoder().encode(text));
    return Array.from(unescape(encodeURIComponent(text)), function (c) { return c.charCodeAt(0); });
  }
  function capacity(v) { var b = BLOCKS[v]; return b[1] * b[2] + b[3] * b[4]; }

  function encode(text) {
    var bytes = utf8(text), version = 0;
    for (var v = 1; v <= 10; v++) {
      var countBits = v < 10 ? 8 : 16;
      if (4 + countBits + bytes.length * 8 <= capacity(v) * 8) { version = v; break; }
    }
    if (!version) throw new Error('内容过长，无法生成二维码');
    // 数据位流：模式指示 0100、字符数、内容、终止符，补齐到整字节后用 0xEC、0x11 填充
    var bits = [];
    function put(value, n) { for (var i = n - 1; i >= 0; i--) bits.push((value >>> i) & 1); }
    put(4, 4);
    put(bytes.length, version < 10 ? 8 : 16);
    bytes.forEach(function (b) { put(b, 8); });
    var cap = capacity(version) * 8;
    put(0, Math.min(4, cap - bits.length));
    put(0, (8 - bits.length % 8) % 8);
    for (var pad = 0xEC; bits.length < cap; pad ^= 0xEC ^ 0x11) put(pad, 8);
    var codewords = [];
    for (var i = 0; i < bits.length; i += 8) codewords.push(parseInt(bits.slice(i, i + 8).join(''), 2));

    // 分块计算纠错码，再交错排列
    var spec = BLOCKS[version], div = divisor(spec[0]), blocks = [], offset = 0;
    for (var g = 0; g < 2; g++) {
      for (var k = 0; k < spec[1 + g * 2]; k++) {
        var part = codewords.slice(offset, offset + spec[2 + g * 2]);
        offset += part.length;
        blocks.push({ data: part, ecc: remainder(part, div) });
      }
    }
    var all = [], maxData = Math.max.apply(null, blocks.map(function (b) { return b.data.length; }));
    for (i = 0; i < maxData; i++) blocks.forEach(function (b) { if (i < b.data.length) all.push(b.data[i]); });
    for (i = 0; i < spec[0]; i++) blocks.forEach(function (b) { all.push(b.ecc[i]); });
    return draw(version, all);
  }

  function draw(version, all) {
    var size = version * 4 + 17, modules = [], fixed = [], x, y, i;
    for (y = 0; y < size; y++) { modules.push([]); fixed.push([]); for (x = 0; x < size; x++) { modules[y].push(false); fixed[y].push(false); } }
    function set(px, py, dark) { modules[py][px] = dark; fixed[py][px] = true; }
    for (i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
    [[3, 3], [size - 4, 3], [3, size - 4]].forEach(function (c) {
      for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) {
        var d = Math.max(Math.abs(dx), Math.abs(dy)), xx = c[0] + dx, yy = c[1] + dy;
        if (xx >= 0 && xx < size && yy >= 0 && yy < size) set(xx, yy, d !== 2 && d !== 4);
      }
    });
    var pos = ALIGN[version], n = pos.length;
    for (i = 0; i < n; i++) for (var j = 0; j < n; j++) {
      if ((i === 0 && j === 0) || (i === 0 && j === n - 1) || (i === n - 1 && j === 0)) continue;
      for (var ay = -2; ay <= 2; ay++) for (var ax = -2; ax <= 2; ax++) set(pos[i] + ax, pos[j] + ay, Math.max(Math.abs(ax), Math.abs(ay)) !== 1);
    }
    function formatBits(mask) {
      // 纠错等级 M 的指示位为 00
      var value = mask, rem = value;
      for (var k = 0; k < 10; k++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      var b = ((value << 10) | rem) ^ 0x5412;
      function bit(k) { return ((b >>> k) & 1) !== 0; }
      for (k = 0; k <= 5; k++) set(8, k, bit(k));
      set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8));
      for (k = 9; k < 15; k++) set(14 - k, 8, bit(k));
      for (k = 0; k < 8; k++) set(size - 1 - k, 8, bit(k));
      for (k = 8; k < 15; k++) set(8, size - 15 + k, bit(k));
      set(8, size - 8, true);
    }
    formatBits(0);
    if (version >= 7) {
      var rem = version;
      for (i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
      var vb = (version << 12) | rem;
      for (i = 0; i < 18; i++) {
        var on = ((vb >>> i) & 1) !== 0, a = size - 11 + i % 3, b = Math.floor(i / 3);
        set(a, b, on); set(b, a, on);
      }
    }
    // 从右下角开始，两列一组，按之字形放入数据位
    var bit = 0;
    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var vert = 0; vert < size; vert++) for (var c = 0; c < 2; c++) {
        x = right - c;
        y = ((right + 1) & 2) === 0 ? size - 1 - vert : vert;
        if (!fixed[y][x] && bit < all.length * 8) {
          modules[y][x] = ((all[bit >>> 3] >>> (7 - (bit & 7))) & 1) !== 0;
          bit++;
        }
      }
    }
    var MASKS = [
      function (x, y) { return (x + y) % 2 === 0; }, function (x, y) { return y % 2 === 0; },
      function (x) { return x % 3 === 0; }, function (x, y) { return (x + y) % 3 === 0; },
      function (x, y) { return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; },
      function (x, y) { return x * y % 2 + x * y % 3 === 0; },
      function (x, y) { return (x * y % 2 + x * y % 3) % 2 === 0; },
      function (x, y) { return ((x + y) % 2 + x * y % 3) % 2 === 0; }];
    function apply(m) {
      for (var yy = 0; yy < size; yy++) for (var xx = 0; xx < size; xx++) if (!fixed[yy][xx] && MASKS[m](xx, yy)) modules[yy][xx] = !modules[yy][xx];
    }
    // 选罚分最低的掩码（计算连续同色、2×2 同色块和深浅比例三项）
    var best = 0, bestScore = Infinity;
    for (var m = 0; m < 8; m++) {
      apply(m); formatBits(m);
      var score = penalty(modules, size);
      if (score < bestScore) { best = m; bestScore = score; }
      apply(m);
    }
    apply(best); formatBits(best);
    return { version: version, size: size, modules: modules };
  }
  function penalty(mod, size) {
    var score = 0, dark = 0, x, y;
    for (var dir = 0; dir < 2; dir++) {
      for (var a = 0; a < size; a++) {
        var run = 1;
        for (var b = 1; b <= size; b++) {
          var cur = b < size ? (dir ? mod[b][a] : mod[a][b]) : null, prev = dir ? mod[b - 1][a] : mod[a][b - 1];
          if (cur === prev) run++;
          else { if (run >= 5) score += run - 2; run = 1; }
        }
      }
    }
    for (y = 0; y < size; y++) for (x = 0; x < size; x++) {
      if (mod[y][x]) dark++;
      if (x < size - 1 && y < size - 1 && mod[y][x] === mod[y][x + 1] && mod[y][x] === mod[y + 1][x] && mod[y][x] === mod[y + 1][x + 1]) score += 3;
    }
    return score + Math.floor(Math.abs(dark * 20 - size * size * 10) / (size * size)) * 10;
  }
  return { encode: encode };
});
