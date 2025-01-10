const pagefind_version = "1.2.0";
let wasm_bindgen;
(() => {
  const __exports = {};
  let script_src;
  if (typeof document !== "undefined" && document.currentScript !== null) {
    script_src = new URL("UNHANDLED", location.href).toString();
  }
  let wasm = undefined;
  let cachedUint8Memory0 = null;
  function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
      cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
  }
  let WASM_VECTOR_LEN = 0;
  function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
  }
  __exports.init_pagefind = (metadata_bytes) => {
    const ptr0 = passArray8ToWasm0(metadata_bytes, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.init_pagefind(ptr0, len0);
    return ret >>> 0;
  };
  const cachedTextEncoder =
    typeof TextEncoder !== "undefined"
      ? new TextEncoder("utf-8")
      : {
          encode: () => {
            throw Error("TextEncoder not available");
          }
        };
  const encodeString =
    typeof cachedTextEncoder.encodeInto === "function"
      ? (arg, view) => cachedTextEncoder.encodeInto(arg, view)
      : (arg, view) => {
          const buf = cachedTextEncoder.encode(arg);
          view.set(buf);
          return { read: arg.length, written: buf.length };
        };
  function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
      const buf = cachedTextEncoder.encode(arg);
      const ptr = malloc(buf.length, 1) >>> 0;
      getUint8Memory0()
        .subarray(ptr, ptr + buf.length)
        .set(buf);
      WASM_VECTOR_LEN = buf.length;
      return ptr;
    }
    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;
    const mem = getUint8Memory0();
    let offset = 0;
    for (; offset < len; offset++) {
      const code = arg.charCodeAt(offset);
      if (code > 0x7f) break;
      mem[ptr + offset] = code;
    }
    if (offset !== len) {
      if (offset !== 0) {
        arg = arg.slice(offset);
      }
      ptr = realloc(ptr, len, (len = offset + arg.length * 3), 1) >>> 0;
      const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
      const ret = encodeString(arg, view);
      offset += ret.written;
      ptr = realloc(ptr, len, offset, 1) >>> 0;
    }
    WASM_VECTOR_LEN = offset;
    return ptr;
  }
  __exports.set_ranking_weights = (ptr, weights) => {
    const ptr0 = passStringToWasm0(
      weights,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.set_ranking_weights(ptr, ptr0, len0);
    return ret >>> 0;
  };
  __exports.load_index_chunk = (ptr, chunk_bytes) => {
    const ptr0 = passArray8ToWasm0(chunk_bytes, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.load_index_chunk(ptr, ptr0, len0);
    return ret >>> 0;
  };
  __exports.load_filter_chunk = (ptr, chunk_bytes) => {
    const ptr0 = passArray8ToWasm0(chunk_bytes, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.load_filter_chunk(ptr, ptr0, len0);
    return ret >>> 0;
  };
  __exports.add_synthetic_filter = (ptr, filter) => {
    const ptr0 = passStringToWasm0(
      filter,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.add_synthetic_filter(ptr, ptr0, len0);
    return ret >>> 0;
  };
  let cachedInt32Memory0 = null;
  function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
      cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
  }
  const cachedTextDecoder =
    typeof TextDecoder !== "undefined"
      ? new TextDecoder("utf-8", { ignoreBOM: true, fatal: true })
      : {
          decode: () => {
            throw Error("TextDecoder not available");
          }
        };
  if (typeof TextDecoder !== "undefined") {
    cachedTextDecoder.decode();
  }
  function getStringFromWasm0(ptr, len) {
    ptr >>>= 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
  }
  __exports.request_indexes = (ptr, query) => {
    let deferred2_0;
    let deferred2_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        query,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.request_indexes(retptr, ptr, ptr0, len0);
      const r0 = getInt32Memory0()[retptr / 4 + 0];
      const r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred2_0 = r0;
      deferred2_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  };
  __exports.request_filter_indexes = (ptr, filters) => {
    let deferred2_0;
    let deferred2_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        filters,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.request_filter_indexes(retptr, ptr, ptr0, len0);
      const r0 = getInt32Memory0()[retptr / 4 + 0];
      const r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred2_0 = r0;
      deferred2_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  };
  __exports.request_all_filter_indexes = (ptr) => {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.request_all_filter_indexes(retptr, ptr);
      const r0 = getInt32Memory0()[retptr / 4 + 0];
      const r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  };
  __exports.filters = (ptr) => {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.filters(retptr, ptr);
      const r0 = getInt32Memory0()[retptr / 4 + 0];
      const r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
  };
  __exports.search = (ptr, query, filter, sort, exact) => {
    let deferred4_0;
    let deferred4_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        query,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passStringToWasm0(
        filter,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len1 = WASM_VECTOR_LEN;
      const ptr2 = passStringToWasm0(
        sort,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc
      );
      const len2 = WASM_VECTOR_LEN;
      wasm.search(retptr, ptr, ptr0, len0, ptr1, len1, ptr2, len2, exact);
      const r0 = getInt32Memory0()[retptr / 4 + 0];
      const r1 = getInt32Memory0()[retptr / 4 + 1];
      deferred4_0 = r0;
      deferred4_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
    }
  };
  async function __wbg_load(module, imports) {
    if (typeof Response === "function" && module instanceof Response) {
      if (typeof WebAssembly.instantiateStreaming === "function") {
        try {
          return await WebAssembly.instantiateStreaming(module, imports);
        } catch (e) {
          if (module.headers.get("Content-Type") !== "application/wasm") {
            console.warn(
              "`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",
              e
            );
          } else {
            throw e;
          }
        }
      }
      const bytes = await module.arrayBuffer();
      return await WebAssembly.instantiate(bytes, imports);
    }
    const instance = await WebAssembly.instantiate(module, imports);
    if (instance instanceof WebAssembly.Instance) {
      return { instance, module };
    }
    return instance;
  }
  function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    return imports;
  }
  function __wbg_init_memory(imports, maybe_memory) {}
  function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedInt32Memory0 = null;
    cachedUint8Memory0 = null;
    return wasm;
  }
  function initSync(module) {
    if (wasm !== undefined) return wasm;
    const imports = __wbg_get_imports();
    __wbg_init_memory(imports);
    if (!(module instanceof WebAssembly.Module)) {
      module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
  }
  async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;
    if (typeof input === "undefined" && typeof script_src !== "undefined") {
      input = script_src.replace(/\.js$/, "_bg.wasm");
    }
    const imports = __wbg_get_imports();
    if (
      typeof input === "string" ||
      (typeof Request === "function" && input instanceof Request) ||
      (typeof URL === "function" && input instanceof URL)
    ) {
      input = fetch(input);
    }
    __wbg_init_memory(imports);
    const { instance, module } = await __wbg_load(await input, imports);
    return __wbg_finalize_init(instance, module);
  }
  wasm_bindgen = Object.assign(__wbg_init, { initSync }, __exports);
})();
const u8 = Uint8Array;
const u16 = Uint16Array;
const u32 = Uint32Array;
const fleb = new u8([
  0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0,
  0, 0, 0
]);
const fdeb = new u8([
  0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12,
  12, 13, 13, 0, 0
]);
const clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
const freb = (eb, start) => {
  const b = new u16(31);
  for (let i2 = 0; i2 < 31; ++i2) {
    b[i2] = start += 1 << eb[i2 - 1];
  }
  const r = new u32(b[30]);
  for (let i2 = 1; i2 < 30; ++i2) {
    for (let j = b[i2]; j < b[i2 + 1]; ++j) {
      r[j] = ((j - b[i2]) << 5) | i2;
    }
  }
  return [b, r];
};
const _a = freb(fleb, 2);
const fl = _a[0];
const revfl = _a[1];
(fl[28] = 258), (revfl[258] = 28);
const _b = freb(fdeb, 0);
const fd = _b[0];
const revfd = _b[1];
const rev = new u16(32768);
for (i = 0; i < 32768; ++i) {
  x = ((i & 43690) >>> 1) | ((i & 21845) << 1);
  x = ((x & 52428) >>> 2) | ((x & 13107) << 2);
  x = ((x & 61680) >>> 4) | ((x & 3855) << 4);
  rev[i] = (((x & 65280) >>> 8) | ((x & 255) << 8)) >>> 1;
}
let x;
let i;
const hMap = (cd, mb, r) => {
  const s = cd.length;
  let i2 = 0;
  const l = new u16(mb);
  for (; i2 < s; ++i2) {
    if (cd[i2]) ++l[cd[i2] - 1];
  }
  const le = new u16(mb);
  for (i2 = 0; i2 < mb; ++i2) {
    le[i2] = (le[i2 - 1] + l[i2 - 1]) << 1;
  }
  let co;
  if (r) {
    co = new u16(1 << mb);
    const rvb = 15 - mb;
    for (i2 = 0; i2 < s; ++i2) {
      if (cd[i2]) {
        const sv = (i2 << 4) | cd[i2];
        const r_1 = mb - cd[i2];
        let v = le[cd[i2] - 1]++ << r_1;
        for (const m = v | ((1 << r_1) - 1); v <= m; ++v) {
          co[rev[v] >>> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);
    for (i2 = 0; i2 < s; ++i2) {
      if (cd[i2]) {
        co[i2] = rev[le[cd[i2] - 1]++] >>> (15 - cd[i2]);
      }
    }
  }
  return co;
};
const flt = new u8(288);
for (i = 0; i < 144; ++i) flt[i] = 8;
let i;
for (i = 144; i < 256; ++i) flt[i] = 9;
let i;
for (i = 256; i < 280; ++i) flt[i] = 7;
let i;
for (i = 280; i < 288; ++i) flt[i] = 8;
let i;
const fdt = new u8(32);
for (i = 0; i < 32; ++i) fdt[i] = 5;
let i;
const flrm = hMap(flt, 9, 1);
const fdrm = hMap(fdt, 5, 1);
const max = (a) => {
  let m = a[0];
  for (let i2 = 1; i2 < a.length; ++i2) {
    if (a[i2] > m) m = a[i2];
  }
  return m;
};
const bits = (d, p, m) => {
  const o = (p / 8) | 0;
  return ((d[o] | (d[o + 1] << 8)) >> (p & 7)) & m;
};
const bits16 = (d, p) => {
  const o = (p / 8) | 0;
  return (d[o] | (d[o + 1] << 8) | (d[o + 2] << 16)) >> (p & 7);
};
const shft = (p) => ((p + 7) / 8) | 0;
const slc = (v, s, e) => {
  if (s == null || s < 0) s = 0;
  if (e == null || e > v.length) e = v.length;
  const n = new (v.BYTES_PER_ELEMENT === 2 ? u16 : v.BYTES_PER_ELEMENT === 4 ? u32 : u8)(
    e - s
  );
  n.set(v.subarray(s, e));
  return n;
};
const ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  undefined,
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
];
const err = (ind, msg, nt) => {
  const e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace) Error.captureStackTrace(e, err);
  if (!nt) throw e;
  return e;
};
const inflt = (dat, buf, st) => {
  const sl = dat.length;
  if (!sl || (st?.f && !st.l)) return buf || new u8(0);
  const noBuf = !buf || st;
  const noSt = !st || st.i;
  if (!st) st = {};
  if (!buf) buf = new u8(sl * 3);
  const cbuf = (l2) => {
    const bl = buf.length;
    if (l2 > bl) {
      const nbuf = new u8(Math.max(bl * 2, l2));
      nbuf.set(buf);
      buf = nbuf;
    }
  };
  let final = st.f || 0;
  let pos = st.p || 0;
  let bt = st.b || 0;
  let lm = st.l;
  let dm = st.d;
  let lbt = st.m;
  let dbt = st.n;
  const tbts = sl * 8;
  do {
    if (!lm) {
      final = bits(dat, pos, 1);
      const type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        const s = shft(pos) + 4;
        const l = dat[s - 4] | (dat[s - 3] << 8);
        const t = s + l;
        if (t > sl) {
          if (noSt) err(0);
          break;
        }
        if (noBuf) cbuf(bt + l);
        buf.set(dat.subarray(s, t), bt);
        (st.b = bt += l), (st.p = pos = t * 8), (st.f = final);
        continue;
      }
      if (type === 1) (lm = flrm), (dm = fdrm), (lbt = 9), (dbt = 5);
      else if (type === 2) {
        const hLit = bits(dat, pos, 31) + 257;
        const hcLen = bits(dat, pos + 10, 15) + 4;
        const tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        const ldt = new u8(tl);
        const clt = new u8(19);
        for (let i2 = 0; i2 < hcLen; ++i2) {
          clt[clim[i2]] = bits(dat, pos + i2 * 3, 7);
        }
        pos += hcLen * 3;
        const clb = max(clt);
        const clbmsk = (1 << clb) - 1;
        const clm = hMap(clt, clb, 1);
        for (let i2 = 0; i2 < tl; ) {
          const r = clm[bits(dat, pos, clbmsk)];
          pos += r & 15;
          const s = r >>> 4;
          if (s < 16) {
            ldt[i2++] = s;
          } else {
            let c = 0;
            let n = 0;
            if (s === 16) (n = 3 + bits(dat, pos, 3)), (pos += 2), (c = ldt[i2 - 1]);
            else if (s === 17) (n = 3 + bits(dat, pos, 7)), (pos += 3);
            else if (s === 18) (n = 11 + bits(dat, pos, 127)), (pos += 7);
            while (n--) ldt[i2++] = c;
          }
        }
        const lt = ldt.subarray(0, hLit);
        const dt = ldt.subarray(hLit);
        lbt = max(lt);
        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else err(1);
      if (pos > tbts) {
        if (noSt) err(0);
        break;
      }
    }
    if (noBuf) cbuf(bt + 131072);
    const lms = (1 << lbt) - 1;
    const dms = (1 << dbt) - 1;
    let lpos = pos;
    for (; ; lpos = pos) {
      const c = lm[bits16(dat, pos) & lms];
      const sym = c >>> 4;
      pos += c & 15;
      if (pos > tbts) {
        if (noSt) err(0);
        break;
      }
      if (!c) err(2);
      if (sym < 256) buf[bt++] = sym;
      else if (sym === 256) {
        (lpos = pos), (lm = null);
        break;
      } else {
        let add = sym - 254;
        if (sym > 264) {
          const i2 = sym - 257;
          const b = fleb[i2];
          add = bits(dat, pos, (1 << b) - 1) + fl[i2];
          pos += b;
        }
        const d = dm[bits16(dat, pos) & dms];
        const dsym = d >>> 4;
        if (!d) err(3);
        pos += d & 15;
        let dt = fd[dsym];
        if (dsym > 3) {
          const b = fdeb[dsym];
          (dt += bits16(dat, pos) & ((1 << b) - 1)), (pos += b);
        }
        if (pos > tbts) {
          if (noSt) err(0);
          break;
        }
        if (noBuf) cbuf(bt + 131072);
        const end = bt + add;
        for (; bt < end; bt += 4) {
          buf[bt] = buf[bt - dt];
          buf[bt + 1] = buf[bt + 1 - dt];
          buf[bt + 2] = buf[bt + 2 - dt];
          buf[bt + 3] = buf[bt + 3 - dt];
        }
        bt = end;
      }
    }
    (st.l = lm), (st.p = lpos), (st.b = bt), (st.f = final);
    if (lm) (final = 1), (st.m = lbt), (st.d = dm), (st.n = dbt);
  } while (!final);
  return bt === buf.length ? buf : slc(buf, 0, bt);
};
const et = new u8(0);
const gzs = (d) => {
  if (d[0] !== 31 || d[1] !== 139 || d[2] !== 8) err(6, "invalid gzip data");
  const flg = d[3];
  let st = 10;
  if (flg & 4) st += d[10] | ((d[11] << 8) + 2);
  for (let zs = ((flg >> 3) & 1) + ((flg >> 4) & 1); zs > 0; zs -= !d[st++]);
  return st + (flg & 2);
};
const gzl = (d) => {
  const l = d.length;
  return (d[l - 4] | (d[l - 3] << 8) | (d[l - 2] << 16) | (d[l - 1] << 24)) >>> 0;
};
function gunzipSync(data, out) {
  return inflt(data.subarray(gzs(data), -8), out || new u8(gzl(data)));
}
const td = typeof TextDecoder !== "undefined" && new TextDecoder();
let tds = 0;
try {
  td.decode(et, { stream: true });
  tds = 1;
} catch (e) {}
const gz_default = gunzipSync;
const calculate_excerpt_region = (word_positions, excerpt_length) => {
  if (word_positions.length === 0) {
    return 0;
  }
  const words = [];
  for (const word of word_positions) {
    words[word.location] = words[word.location] || 0;
    words[word.location] += word.balanced_score;
  }
  if (words.length <= excerpt_length) {
    return 0;
  }
  let densest = words
    .slice(0, excerpt_length)
    .reduce((partialSum, a) => partialSum + a, 0);
  let working_sum = densest;
  let densest_at = [0];
  for (let i2 = 0; i2 < words.length; i2++) {
    const boundary = i2 + excerpt_length;
    working_sum += (words[boundary] ?? 0) - (words[i2] ?? 0);
    if (working_sum > densest) {
      densest = working_sum;
      densest_at = [i2];
    } else if (working_sum === densest && densest_at[densest_at.length - 1] === i2 - 1) {
      densest_at.push(i2);
    }
  }
  const midpoint = densest_at[Math.floor(densest_at.length / 2)];
  return midpoint;
};
const build_excerpt = (content, start, length, locations, not_before, not_from) => {
  const is_zws_delimited = content.includes("\u200B");
  let fragment_words = [];
  if (is_zws_delimited) {
    fragment_words = content.split("\u200B");
  } else {
    fragment_words = content.split(/[\r\n\s]+/g);
  }
  for (const word of locations) {
    if (fragment_words[word]?.startsWith("<mark>")) {
      continue;
    }
    fragment_words[word] = `<mark>${fragment_words[word]}</mark>`;
  }
  const endcap = not_from ?? fragment_words.length;
  const startcap = not_before ?? 0;
  if (endcap - startcap < length) {
    length = endcap - startcap;
  }
  if (start + length > endcap) {
    start = endcap - length;
  }
  if (start < startcap) {
    start = startcap;
  }
  return fragment_words
    .slice(start, start + length)
    .join(is_zws_delimited ? "" : " ")
    .trim();
};
const calculate_sub_results = (fragment, desired_excerpt_length) => {
  const anchors = fragment.anchors
    .filter((a) => /h\d/i.test(a.element) && a.text?.length && /\S/.test(a.text))
    .sort((a, b) => a.location - b.location);
  const results = [];
  let current_anchor_position = 0;
  let current_anchor = {
    title: fragment.meta.title,
    url: fragment.url,
    weighted_locations: [],
    locations: [],
    excerpt: ""
  };
  const add_result = (end_range) => {
    if (current_anchor.locations.length) {
      const relative_weighted_locations = current_anchor.weighted_locations.map((l) => {
        return {
          weight: l.weight,
          balanced_score: l.balanced_score,
          location: l.location - current_anchor_position
        };
      });
      const excerpt_start =
        calculate_excerpt_region(relative_weighted_locations, desired_excerpt_length) +
        current_anchor_position;
      const excerpt_length = end_range
        ? Math.min(end_range - excerpt_start, desired_excerpt_length)
        : desired_excerpt_length;
      current_anchor.excerpt = build_excerpt(
        fragment.raw_content ?? "",
        excerpt_start,
        excerpt_length,
        current_anchor.locations,
        current_anchor_position,
        end_range
      );
      results.push(current_anchor);
    }
  };
  for (const word of fragment.weighted_locations) {
    if (!anchors.length || word.location < anchors[0].location) {
      current_anchor.weighted_locations.push(word);
      current_anchor.locations.push(word.location);
    } else {
      let next_anchor = anchors.shift();
      add_result(next_anchor.location);
      while (anchors.length && word.location >= anchors[0].location) {
        next_anchor = anchors.shift();
      }
      let anchored_url = fragment.url;
      try {
        const url_is_fq = /^((https?:)?\/\/)/.test(anchored_url);
        if (url_is_fq) {
          const fq_url = new URL(anchored_url);
          fq_url.hash = next_anchor.id;
          anchored_url = fq_url.toString();
        } else {
          if (!/^\//.test(anchored_url)) {
            anchored_url = `/${anchored_url}`;
          }
          const fq_url = new URL(`https://example.com${anchored_url}`);
          fq_url.hash = next_anchor.id;
          anchored_url = fq_url.toString().replace(/^https:\/\/example.com/, "");
        }
      } catch (e) {
        console.error(`Pagefind: Couldn't process ${anchored_url} for a search result`);
      }
      current_anchor_position = next_anchor.location;
      current_anchor = {
        title: next_anchor.text,
        url: anchored_url,
        anchor: next_anchor,
        weighted_locations: [word],
        locations: [word.location],
        excerpt: ""
      };
    }
  }
  add_result(anchors[0]?.location);
  return results;
};
const asyncSleep = async (ms = 100) => {
  return new Promise((r) => setTimeout(r, ms));
};
const PagefindInstance = class {
  constructor(opts = {}) {
    this.version = pagefind_version;
    this.backend = wasm_bindgen;
    this.decoder = new TextDecoder("utf-8");
    this.wasm = null;
    this.basePath = opts.basePath || "/pagefind/";
    this.primary = opts.primary;
    if (this.primary && !opts.basePath) {
      this.initPrimary();
    }
    if (/[^\/]$/.test(this.basePath)) {
      this.basePath = `${this.basePath}/`;
    }
    if (window?.location?.origin && this.basePath.startsWith(window.location.origin)) {
      this.basePath = this.basePath.replace(window.location.origin, "");
    }
    this.baseUrl = opts.baseUrl || this.defaultBaseUrl();
    if (!/^(\/|https?:\/\/)/.test(this.baseUrl)) {
      this.baseUrl = `/${this.baseUrl}`;
    }
    this.indexWeight = opts.indexWeight ?? 1;
    this.excerptLength = opts.excerptLength ?? 30;
    this.mergeFilter = opts.mergeFilter ?? {};
    this.ranking = opts.ranking;
    this.highlightParam = opts.highlightParam ?? null;
    this.loaded_chunks = {};
    this.loaded_filters = {};
    this.loaded_fragments = {};
    this.raw_ptr = null;
    this.searchMeta = null;
    this.languages = null;
  }
  initPrimary() {
    const derivedBasePath = import.meta.url.match(/^(.*\/)pagefind.js.*$/)?.[1];
    if (derivedBasePath) {
      this.basePath = derivedBasePath;
    } else {
      console.warn(
        [
          "Pagefind couldn't determine the base of the bundle from the import path. Falling back to the default.",
          "Set a basePath option when initialising Pagefind to ignore this message."
        ].join("\n")
      );
    }
  }
  defaultBaseUrl() {
    const default_base = this.basePath.match(/^(.*\/)_?pagefind/)?.[1];
    return default_base || "/";
  }
  async options(options2) {
    const opts = [
      "basePath",
      "baseUrl",
      "indexWeight",
      "excerptLength",
      "mergeFilter",
      "highlightParam",
      "ranking"
    ];
    for (const [k, v] of Object.entries(options2)) {
      if (k === "mergeFilter") {
        const filters2 = this.stringifyFilters(v);
        const ptr = await this.getPtr();
        this.raw_ptr = this.backend.add_synthetic_filter(ptr, filters2);
      } else if (k === "ranking") {
        await this.set_ranking(options2.ranking);
      } else if (opts.includes(k)) {
        if (k === "basePath" && typeof v === "string") this.basePath = v;
        if (k === "baseUrl" && typeof v === "string") this.baseUrl = v;
        if (k === "indexWeight" && typeof v === "number") this.indexWeight = v;
        if (k === "excerptLength" && typeof v === "number") this.excerptLength = v;
        if (k === "mergeFilter" && typeof v === "object") this.mergeFilter = v;
        if (k === "highlightParam" && typeof v === "string") this.highlightParam = v;
      } else {
        console.warn(
          `Unknown Pagefind option ${k}. Allowed options: [${opts.join(", ")}]`
        );
      }
    }
  }
  decompress(data, file = "unknown file") {
    if (this.decoder.decode(data.slice(0, 12)) === "pagefind_dcd") {
      return data.slice(12);
    }
    data = gz_default(data);
    if (this.decoder.decode(data.slice(0, 12)) !== "pagefind_dcd") {
      console.error(`Decompressing ${file} appears to have failed: Missing signature`);
      return data;
    }
    return data.slice(12);
  }
  async set_ranking(ranking) {
    if (!ranking) return;
    const rankingWeights = {
      term_similarity: ranking.termSimilarity ?? null,
      page_length: ranking.pageLength ?? null,
      term_saturation: ranking.termSaturation ?? null,
      term_frequency: ranking.termFrequency ?? null
    };
    const ptr = await this.getPtr();
    this.raw_ptr = this.backend.set_ranking_weights(ptr, JSON.stringify(rankingWeights));
  }
  async init(language, opts) {
    await this.loadEntry();
    const index = this.findIndex(language);
    const lang_wasm = index.wasm ? index.wasm : "unknown";
    const resources = [this.loadMeta(index.hash)];
    if (opts.load_wasm === true) {
      resources.push(this.loadWasm(lang_wasm));
    }
    await Promise.all(resources);
    this.raw_ptr = this.backend.init_pagefind(new Uint8Array(this.searchMeta));
    if (Object.keys(this.mergeFilter)?.length) {
      const filters2 = this.stringifyFilters(this.mergeFilter);
      const ptr = await this.getPtr();
      this.raw_ptr = this.backend.add_synthetic_filter(ptr, filters2);
    }
    if (this.ranking) {
      await this.set_ranking(this.ranking);
    }
  }
  async loadEntry() {
    try {
      const entry_response = await fetch(
        `${this.basePath}pagefind-entry.json?ts=${Date.now()}`
      );
      const entry_json = await entry_response.json();
      this.languages = entry_json.languages;
      if (entry_json.version !== this.version) {
        if (this.primary) {
          console.warn(
            [
              "Pagefind JS version doesn't match the version in your search index.",
              `Pagefind JS: ${this.version}. Pagefind index: ${entry_json.version}`,
              "If you upgraded Pagefind recently, you likely have a cached pagefind.js file.",
              "If you encounter any search errors, try clearing your cache."
            ].join("\n")
          );
        } else {
          console.warn(
            [
              "Merging a Pagefind index from a different version than the main Pagefind instance.",
              `Main Pagefind JS: ${this.version}. Merged index (${this.basePath}): ${entry_json.version}`,
              "If you encounter any search errors, make sure that both sites are running the same version of Pagefind."
            ].join("\n")
          );
        }
      }
    } catch (e) {
      console.error(`Failed to load Pagefind metadata:
${e?.toString()}`);
      throw new Error("Failed to load Pagefind metadata");
    }
  }
  findIndex(language) {
    if (this.languages) {
      let index = this.languages[language];
      if (index) return index;
      index = this.languages[language.split("-")[0]];
      if (index) return index;
      const topLang = Object.values(this.languages).sort(
        (a, b) => b.page_count - a.page_count
      );
      if (topLang[0]) return topLang[0];
    }
    throw new Error("Pagefind Error: No language indexes found.");
  }
  async loadMeta(index) {
    try {
      const compressed_resp = await fetch(`${this.basePath}pagefind.${index}.pf_meta`);
      const compressed_meta = await compressed_resp.arrayBuffer();
      this.searchMeta = this.decompress(
        new Uint8Array(compressed_meta),
        "Pagefind metadata"
      );
    } catch (e) {
      console.error(`Failed to load the meta index:
${e?.toString()}`);
    }
  }
  async loadWasm(language) {
    try {
      const wasm_url = `${this.basePath}wasm.${language}.pagefind`;
      const compressed_resp = await fetch(wasm_url);
      const compressed_wasm = await compressed_resp.arrayBuffer();
      const final_wasm = this.decompress(
        new Uint8Array(compressed_wasm),
        "Pagefind WebAssembly"
      );
      if (!final_wasm) {
        throw new Error("No WASM after decompression");
      }
      this.wasm = await this.backend(final_wasm);
    } catch (e) {
      console.error(`Failed to load the Pagefind WASM:
${e?.toString()}`);
      throw new Error(`Failed to load the Pagefind WASM:
${e?.toString()}`);
    }
  }
  async _loadGenericChunk(url, method) {
    try {
      const compressed_resp = await fetch(url);
      const compressed_chunk = await compressed_resp.arrayBuffer();
      const chunk = this.decompress(new Uint8Array(compressed_chunk), url);
      const ptr = await this.getPtr();
      this.raw_ptr = this.backend[method](ptr, chunk);
    } catch (e) {
      console.error(`Failed to load the index chunk ${url}:
${e?.toString()}`);
    }
  }
  async loadChunk(hash) {
    if (!this.loaded_chunks[hash]) {
      const url = `${this.basePath}index/${hash}.pf_index`;
      this.loaded_chunks[hash] = this._loadGenericChunk(url, "load_index_chunk");
    }
    return await this.loaded_chunks[hash];
  }
  async loadFilterChunk(hash) {
    if (!this.loaded_filters[hash]) {
      const url = `${this.basePath}filter/${hash}.pf_filter`;
      this.loaded_filters[hash] = this._loadGenericChunk(url, "load_filter_chunk");
    }
    return await this.loaded_filters[hash];
  }
  async _loadFragment(hash) {
    const compressed_resp = await fetch(`${this.basePath}fragment/${hash}.pf_fragment`);
    const compressed_fragment = await compressed_resp.arrayBuffer();
    const fragment = this.decompress(
      new Uint8Array(compressed_fragment),
      `Fragment ${hash}`
    );
    return JSON.parse(new TextDecoder().decode(fragment));
  }
  async loadFragment(hash, weighted_locations, search_term) {
    if (!this.loaded_fragments[hash]) {
      this.loaded_fragments[hash] = this._loadFragment(hash);
    }
    const fragment = await this.loaded_fragments[hash];
    fragment.weighted_locations = weighted_locations;
    fragment.locations = weighted_locations.map((l) => l.location);
    if (!fragment.raw_content) {
      fragment.raw_content = fragment.content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      fragment.content = fragment.content.replace(/\u200B/g, "");
    }
    if (!fragment.raw_url) {
      fragment.raw_url = fragment.url;
    }
    fragment.url = this.processedUrl(fragment.raw_url, search_term);
    const excerpt_start = calculate_excerpt_region(
      weighted_locations,
      this.excerptLength
    );
    fragment.excerpt = build_excerpt(
      fragment.raw_content,
      excerpt_start,
      this.excerptLength,
      fragment.locations
    );
    fragment.sub_results = calculate_sub_results(fragment, this.excerptLength);
    return fragment;
  }
  fullUrl(raw) {
    if (/^(https?:)?\/\//.test(raw)) {
      return raw;
    }
    return `${this.baseUrl}/${raw}`.replace(/\/+/g, "/").replace(/^(https?:\/)/, "$1/");
  }
  processedUrl(url, search_term) {
    const normalized = this.fullUrl(url);
    if (this.highlightParam === null) {
      return normalized;
    }
    const individual_terms = search_term.split(/\s+/);
    try {
      const processed = new URL(normalized);
      for (const term of individual_terms) {
        processed.searchParams.append(this.highlightParam, term);
      }
      return processed.toString();
    } catch (e) {
      try {
        const processed = new URL(`https://example.com${normalized}`);
        for (const term of individual_terms) {
          processed.searchParams.append(this.highlightParam, term);
        }
        return processed.toString().replace(/^https:\/\/example\.com/, "");
      } catch (e2) {
        return normalized;
      }
    }
  }
  async getPtr() {
    while (this.raw_ptr === null) {
      await asyncSleep(50);
    }
    if (!this.raw_ptr) {
      console.error("Pagefind: WASM Error (No pointer)");
      throw new Error("Pagefind: WASM Error (No pointer)");
    }
    return this.raw_ptr;
  }
  parseFilters(str) {
    const output = {};
    if (!str) return output;
    for (const block of str.split("__PF_FILTER_DELIM__")) {
      const [filter, values] = block.split(/:(.*)$/);
      output[filter] = {};
      if (values) {
        for (const valueBlock of values.split("__PF_VALUE_DELIM__")) {
          if (valueBlock) {
            const extract = valueBlock.match(/^(.*):(\d+)$/);
            if (extract) {
              const [, value, count] = extract;
              output[filter][value] = Number.parseInt(count) ?? count;
            }
          }
        }
      }
    }
    return output;
  }
  stringifyFilters(obj = {}) {
    return JSON.stringify(obj);
  }
  stringifySorts(obj = {}) {
    const sorts = Object.entries(obj);
    for (const [sort, direction] of sorts) {
      if (sorts.length > 1) {
        console.warn(
          `Pagefind was provided multiple sort options in this search, but can only operate on one. Using the ${sort} sort.`
        );
      }
      if (direction !== "asc" && direction !== "desc") {
        console.warn(
          `Pagefind was provided a sort with unknown direction ${direction}. Supported: [asc, desc]`
        );
      }
      return `${sort}:${direction}`;
    }
    return "";
  }
  async filters() {
    let ptr = await this.getPtr();
    const filters2 = this.backend.request_all_filter_indexes(ptr);
    const filter_chunks = filters2
      .split(" ")
      .filter((v) => v)
      .map((chunk) => this.loadFilterChunk(chunk));
    await Promise.all([...filter_chunks]);
    ptr = await this.getPtr();
    const results = this.backend.filters(ptr);
    return this.parseFilters(results);
  }
  async preload(term, options2 = {}) {
    await this.search(term, { ...options2, preload: true });
  }
  async search(term, options2 = {}) {
    options2 = { verbose: false, filters: {}, sort: {}, ...options2 };
    const log = (str) => {
      if (options2.verbose) console.log(str);
    };
    log(`Starting search on ${this.basePath}`);
    const start = Date.now();
    let ptr = await this.getPtr();
    const filter_only = term === null;
    term = term ?? "";
    const exact_search = /^\s*".+"\s*$/.test(term);
    if (exact_search) {
      log("Running an exact search");
    }
    term = term
      .toLowerCase()
      .trim()
      .replace(/[\.`~!@#\$%\^&\*\(\)\{\}\[\]\\\|:;'",<>\/\?\-]/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();
    log(`Normalized search term to ${term}`);
    if (!(term?.length || filter_only)) {
      return {
        results: [],
        unfilteredResultCount: 0,
        filters: {},
        totalFilters: {},
        timings: {
          preload: Date.now() - start,
          search: Date.now() - start,
          total: Date.now() - start
        }
      };
    }
    const sort_list = this.stringifySorts(options2.sort);
    log(`Stringified sort to ${sort_list}`);
    const filter_list = this.stringifyFilters(options2.filters);
    log(`Stringified filters to ${filter_list}`);
    const index_resp = this.backend.request_indexes(ptr, term);
    const filter_resp = this.backend.request_filter_indexes(ptr, filter_list);
    const chunks = index_resp
      .split(" ")
      .filter((v) => v)
      .map((chunk) => this.loadChunk(chunk));
    const filter_chunks = filter_resp
      .split(" ")
      .filter((v) => v)
      .map((chunk) => this.loadFilterChunk(chunk));
    await Promise.all([...chunks, ...filter_chunks]);
    log("Loaded necessary chunks to run search");
    if (options2.preload) {
      log("Preload \u2014 bailing out of search operation now.");
      return null;
    }
    ptr = await this.getPtr();
    const searchStart = Date.now();
    const result = this.backend.search(ptr, term, filter_list, sort_list, exact_search);
    log(`Got the raw search result: ${result}`);
    const [unfilteredResultCount, all_results, filters2, totalFilters] = result.split(
      /:([^:]*):(.*)__PF_UNFILTERED_DELIM__(.*)$/
    );
    const filterObj = this.parseFilters(filters2);
    const totalFilterObj = this.parseFilters(totalFilters);
    log(`Remaining filters: ${JSON.stringify(result)}`);
    const results = all_results.length ? all_results.split(" ") : [];
    const resultsInterface = results.map((result2) => {
      const [hash, score, all_locations] = result2.split("@");
      log(`Processing result: 
  hash:${hash}
  score:${score}
  locations:${all_locations}`);
      const weighted_locations = all_locations.length
        ? all_locations.split(",").map((l) => {
            const [weight, balanced_score, location] = l.split(">");
            return {
              weight: Number.parseInt(weight) / 24,
              balanced_score: Number.parseFloat(balanced_score),
              location: Number.parseInt(location)
            };
          })
        : [];
      const locations = weighted_locations.map((l) => l.location);
      return {
        id: hash,
        score: Number.parseFloat(score) * this.indexWeight,
        words: locations,
        data: async () => await this.loadFragment(hash, weighted_locations, term)
      };
    });
    const searchTime = Date.now() - searchStart;
    const realTime = Date.now() - start;
    log(
      `Found ${results.length} result${results.length === 1 ? "" : "s"} for "${term}" in ${Date.now() - searchStart}ms (${Date.now() - start}ms realtime)`
    );
    return {
      results: resultsInterface,
      unfilteredResultCount: Number.parseInt(unfilteredResultCount),
      filters: filterObj,
      totalFilters: totalFilterObj,
      timings: { preload: realTime - searchTime, search: searchTime, total: realTime }
    };
  }
};
const Pagefind = class {
  constructor(options2 = {}) {
    this.backend = wasm_bindgen;
    this.primaryLanguage = "unknown";
    this.searchID = 0;
    this.primary = new PagefindInstance({ ...options2, primary: true });
    this.instances = [this.primary];
    this.init(options2?.language);
  }
  async options(options2) {
    await this.primary.options(options2);
  }
  async init(overrideLanguage) {
    if (document?.querySelector) {
      const langCode = document.querySelector("html")?.getAttribute("lang") || "unknown";
      this.primaryLanguage = langCode.toLocaleLowerCase();
    }
    await this.primary.init(overrideLanguage ? overrideLanguage : this.primaryLanguage, {
      load_wasm: true
    });
  }
  async mergeIndex(indexPath, options2 = {}) {
    if (this.primary.basePath.startsWith(indexPath)) {
      console.warn(
        `Skipping mergeIndex ${indexPath} that appears to be the same as the primary index (${this.primary.basePath})`
      );
      return;
    }
    const newInstance = new PagefindInstance({ primary: false, basePath: indexPath });
    this.instances.push(newInstance);
    while (this.primary.wasm === null) {
      await asyncSleep(50);
    }
    await newInstance.init(options2.language || this.primaryLanguage, {
      load_wasm: false
    });
    options2.language = undefined;
    await newInstance.options(options2);
  }
  mergeFilters(filters2) {
    const merged = {};
    for (const searchFilter of filters2) {
      for (const [filterKey, values] of Object.entries(searchFilter)) {
        if (!merged[filterKey]) {
          merged[filterKey] = values;
        } else {
          const filter = merged[filterKey];
          for (const [valueKey, count] of Object.entries(values)) {
            filter[valueKey] = (filter[valueKey] || 0) + count;
          }
        }
      }
    }
    return merged;
  }
  async filters() {
    const filters2 = await Promise.all(this.instances.map((i2) => i2.filters()));
    return this.mergeFilters(filters2);
  }
  async preload(term, options2 = {}) {
    await Promise.all(this.instances.map((i2) => i2.preload(term, options2)));
  }
  async debouncedSearch(term, options2, debounceTimeoutMs) {
    const thisSearchID = ++this.searchID;
    this.preload(term, options2);
    await asyncSleep(debounceTimeoutMs);
    if (thisSearchID !== this.searchID) {
      return null;
    }
    const searchResult = await this.search(term, options2);
    if (thisSearchID !== this.searchID) {
      return null;
    }
    return searchResult;
  }
  async search(term, options2 = {}) {
    const search2 = await Promise.all(
      this.instances.map((i2) => i2.search(term, options2))
    );
    const filters2 = this.mergeFilters(search2.map((s) => s.filters));
    const totalFilters = this.mergeFilters(search2.map((s) => s.totalFilters));
    const results = search2.flatMap((s) => s.results).sort((a, b) => b.score - a.score);
    const timings = search2.map((s) => s.timings);
    const unfilteredResultCount = search2.reduce(
      (sum, s) => sum + s.unfilteredResultCount,
      0
    );
    return { results, unfilteredResultCount, filters: filters2, totalFilters, timings };
  }
};
let pagefind = void 0;
let initial_options = void 0;
const init_pagefind = () => {
  if (!pagefind) {
    pagefind = new Pagefind(initial_options ?? {});
  }
};
const options = async (new_options) => {
  if (pagefind) {
    await pagefind.options(new_options);
  } else {
    initial_options = new_options;
  }
};
const init = async () => {
  init_pagefind();
};
const destroy = async () => {
  pagefind = void 0;
  initial_options = void 0;
};
const mergeIndex = async (indexPath, options2) => {
  init_pagefind();
  return await pagefind.mergeIndex(indexPath, options2);
};
const search = async (term, options2) => {
  init_pagefind();
  return await pagefind.search(term, options2);
};
const debouncedSearch = async (term, options2, debounceTimeoutMs = 300) => {
  init_pagefind();
  return await pagefind.debouncedSearch(term, options2, debounceTimeoutMs);
};
const preload = async (term, options2) => {
  init_pagefind();
  return await pagefind.preload(term, options2);
};
const filters = async () => {
  init_pagefind();
  return await pagefind.filters();
};
export { debouncedSearch, destroy, filters, init, mergeIndex, options, preload, search };
