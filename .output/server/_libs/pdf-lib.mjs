import { __extends, __spreadArrays, __assign, __awaiter, __generator, __rest } from "tslib";
import { a as FontNames, E as Encodings, F as Font } from "./pdf-lib__standard-fonts.mjs";
import { p as pako } from "./pako.mjs";
import { U as UPNG } from "./pdf-lib__upng.mjs";
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var lookup = new Uint8Array(256);
for (var i = 0; i < chars.length; i++) {
  lookup[chars.charCodeAt(i)] = i;
}
var encodeToBase64 = function(bytes) {
  var base64 = "";
  var len = bytes.length;
  for (var i = 0; i < len; i += 3) {
    base64 += chars[bytes[i] >> 2];
    base64 += chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
    base64 += chars[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
    base64 += chars[bytes[i + 2] & 63];
  }
  if (len % 3 === 2) {
    base64 = base64.substring(0, base64.length - 1) + "=";
  } else if (len % 3 === 1) {
    base64 = base64.substring(0, base64.length - 2) + "==";
  }
  return base64;
};
var decodeFromBase64 = function(base64) {
  var bufferLength = base64.length * 0.75;
  var len = base64.length;
  var i;
  var p = 0;
  var encoded1;
  var encoded2;
  var encoded3;
  var encoded4;
  if (base64[base64.length - 1] === "=") {
    bufferLength--;
    if (base64[base64.length - 2] === "=") {
      bufferLength--;
    }
  }
  var bytes = new Uint8Array(bufferLength);
  for (i = 0; i < len; i += 4) {
    encoded1 = lookup[base64.charCodeAt(i)];
    encoded2 = lookup[base64.charCodeAt(i + 1)];
    encoded3 = lookup[base64.charCodeAt(i + 2)];
    encoded4 = lookup[base64.charCodeAt(i + 3)];
    bytes[p++] = encoded1 << 2 | encoded2 >> 4;
    bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
    bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
  }
  return bytes;
};
var DATA_URI_PREFIX_REGEX = /^(data)?:?([\w\/\+]+)?;?(charset=[\w-]+|base64)?.*,/i;
var decodeFromBase64DataUri = function(dataUri) {
  var trimmedUri = dataUri.trim();
  var prefix = trimmedUri.substring(0, 100);
  var res = prefix.match(DATA_URI_PREFIX_REGEX);
  if (!res)
    return decodeFromBase64(trimmedUri);
  var fullMatch = res[0];
  var data = trimmedUri.substring(fullMatch.length);
  return decodeFromBase64(data);
};
var toCharCode = function(character) {
  return character.charCodeAt(0);
};
var toCodePoint = function(character) {
  return character.codePointAt(0);
};
var toHexStringOfMinLength = function(num, minLength) {
  return padStart(num.toString(16), minLength, "0").toUpperCase();
};
var toHexString = function(num) {
  return toHexStringOfMinLength(num, 2);
};
var charFromCode = function(code) {
  return String.fromCharCode(code);
};
var charFromHexCode = function(hex) {
  return charFromCode(parseInt(hex, 16));
};
var padStart = function(value, length, padChar) {
  var padding = "";
  for (var idx = 0, len = length - value.length; idx < len; idx++) {
    padding += padChar;
  }
  return padding + value;
};
var copyStringIntoBuffer = function(str, buffer, offset) {
  var length = str.length;
  for (var idx = 0; idx < length; idx++) {
    buffer[offset++] = str.charCodeAt(idx);
  }
  return length;
};
var escapeRegExp = function(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
var cleanText = function(text) {
  return text.replace(/\t|\u0085|\u2028|\u2029/g, "    ").replace(/[\b\v]/g, "");
};
var escapedNewlineChars = ["\\n", "\\f", "\\r", "\\u000B"];
var isNewlineChar = function(text) {
  return /^[\n\f\r\u000B]$/.test(text);
};
var lineSplit = function(text) {
  return text.split(/[\n\f\r\u000B]/);
};
var mergeLines = function(text) {
  return text.replace(/[\n\f\r\u000B]/g, " ");
};
var charAtIndex = function(text, index) {
  var cuFirst = text.charCodeAt(index);
  var cuSecond;
  var nextIndex = index + 1;
  var length = 1;
  if (
    // Check if it's the start of a surrogate pair.
    cuFirst >= 55296 && cuFirst <= 56319 && // high surrogate
    text.length > nextIndex
  ) {
    cuSecond = text.charCodeAt(nextIndex);
    if (cuSecond >= 56320 && cuSecond <= 57343)
      length = 2;
  }
  return [text.slice(index, index + length), length];
};
var charSplit = function(text) {
  var chars2 = [];
  for (var idx = 0, len = text.length; idx < len; ) {
    var _a = charAtIndex(text, idx), c = _a[0], cLen = _a[1];
    chars2.push(c);
    idx += cLen;
  }
  return chars2;
};
var buildWordBreakRegex = function(wordBreaks) {
  var newlineCharUnion = escapedNewlineChars.join("|");
  var escapedRules = ["$"];
  for (var idx = 0, len = wordBreaks.length; idx < len; idx++) {
    var wordBreak = wordBreaks[idx];
    if (isNewlineChar(wordBreak)) {
      throw new TypeError("`wordBreak` must not include " + newlineCharUnion);
    }
    escapedRules.push(wordBreak === "" ? "." : escapeRegExp(wordBreak));
  }
  var breakRules = escapedRules.join("|");
  return new RegExp("(" + newlineCharUnion + ")|((.*?)(" + breakRules + "))", "gm");
};
var breakTextIntoLines = function(text, wordBreaks, maxWidth, computeWidthOfText) {
  var regex = buildWordBreakRegex(wordBreaks);
  var words = cleanText(text).match(regex);
  var currLine = "";
  var currWidth = 0;
  var lines = [];
  var pushCurrLine = function() {
    if (currLine !== "")
      lines.push(currLine);
    currLine = "";
    currWidth = 0;
  };
  for (var idx = 0, len = words.length; idx < len; idx++) {
    var word = words[idx];
    if (isNewlineChar(word)) {
      pushCurrLine();
    } else {
      var width = computeWidthOfText(word);
      if (currWidth + width > maxWidth)
        pushCurrLine();
      currLine += word;
      currWidth += width;
    }
  }
  pushCurrLine();
  return lines;
};
var dateRegex = /^D:(\d\d\d\d)(\d\d)?(\d\d)?(\d\d)?(\d\d)?(\d\d)?([+\-Z])?(\d\d)?'?(\d\d)?'?$/;
var parseDate = function(dateStr) {
  var match = dateStr.match(dateRegex);
  if (!match)
    return void 0;
  var year = match[1], _a = match[2], month = _a === void 0 ? "01" : _a, _b = match[3], day = _b === void 0 ? "01" : _b, _c = match[4], hours = _c === void 0 ? "00" : _c, _d = match[5], mins = _d === void 0 ? "00" : _d, _e = match[6], secs = _e === void 0 ? "00" : _e, _f = match[7], offsetSign = _f === void 0 ? "Z" : _f, _g = match[8], offsetHours = _g === void 0 ? "00" : _g, _h = match[9], offsetMins = _h === void 0 ? "00" : _h;
  var tzOffset = offsetSign === "Z" ? "Z" : "" + offsetSign + offsetHours + ":" + offsetMins;
  var date = /* @__PURE__ */ new Date(year + "-" + month + "-" + day + "T" + hours + ":" + mins + ":" + secs + tzOffset);
  return date;
};
var findLastMatch = function(value, regex) {
  var _a;
  var position = 0;
  var lastMatch;
  while (position < value.length) {
    var match = value.substring(position).match(regex);
    if (!match)
      return { match: lastMatch, pos: position };
    lastMatch = match;
    position += ((_a = match.index) !== null && _a !== void 0 ? _a : 0) + match[0].length;
  }
  return { match: lastMatch, pos: position };
};
var last = function(array) {
  return array[array.length - 1];
};
var typedArrayFor = function(value) {
  if (value instanceof Uint8Array)
    return value;
  var length = value.length;
  var typedArray = new Uint8Array(length);
  for (var idx = 0; idx < length; idx++) {
    typedArray[idx] = value.charCodeAt(idx);
  }
  return typedArray;
};
var mergeIntoTypedArray = function() {
  var arrays = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    arrays[_i] = arguments[_i];
  }
  var arrayCount = arrays.length;
  var typedArrays = [];
  for (var idx = 0; idx < arrayCount; idx++) {
    var element = arrays[idx];
    typedArrays[idx] = element instanceof Uint8Array ? element : typedArrayFor(element);
  }
  var totalSize = 0;
  for (var idx = 0; idx < arrayCount; idx++) {
    totalSize += arrays[idx].length;
  }
  var merged = new Uint8Array(totalSize);
  var offset = 0;
  for (var arrIdx = 0; arrIdx < arrayCount; arrIdx++) {
    var arr = typedArrays[arrIdx];
    for (var byteIdx = 0, arrLen = arr.length; byteIdx < arrLen; byteIdx++) {
      merged[offset++] = arr[byteIdx];
    }
  }
  return merged;
};
var mergeUint8Arrays = function(arrays) {
  var totalSize = 0;
  for (var idx = 0, len = arrays.length; idx < len; idx++) {
    totalSize += arrays[idx].length;
  }
  var mergedBuffer = new Uint8Array(totalSize);
  var offset = 0;
  for (var idx = 0, len = arrays.length; idx < len; idx++) {
    var array = arrays[idx];
    mergedBuffer.set(array, offset);
    offset += array.length;
  }
  return mergedBuffer;
};
var arrayAsString = function(array) {
  var str = "";
  for (var idx = 0, len = array.length; idx < len; idx++) {
    str += charFromCode(array[idx]);
  }
  return str;
};
var byAscendingId = function(a, b) {
  return a.id - b.id;
};
var sortedUniq = function(array, indexer) {
  var uniq = [];
  for (var idx = 0, len = array.length; idx < len; idx++) {
    var curr = array[idx];
    var prev = array[idx - 1];
    if (idx === 0 || indexer(curr) !== indexer(prev)) {
      uniq.push(curr);
    }
  }
  return uniq;
};
var reverseArray = function(array) {
  var arrayLen = array.length;
  for (var idx = 0, len = Math.floor(arrayLen / 2); idx < len; idx++) {
    var leftIdx = idx;
    var rightIdx = arrayLen - idx - 1;
    var temp = array[idx];
    array[leftIdx] = array[rightIdx];
    array[rightIdx] = temp;
  }
  return array;
};
var sum = function(array) {
  var total = 0;
  for (var idx = 0, len = array.length; idx < len; idx++) {
    total += array[idx];
  }
  return total;
};
var range = function(start, end) {
  var arr = new Array(end - start);
  for (var idx = 0, len = arr.length; idx < len; idx++) {
    arr[idx] = start + idx;
  }
  return arr;
};
var pluckIndices = function(arr, indices) {
  var plucked = new Array(indices.length);
  for (var idx = 0, len = indices.length; idx < len; idx++) {
    plucked[idx] = arr[indices[idx]];
  }
  return plucked;
};
var canBeConvertedToUint8Array = function(input) {
  return input instanceof Uint8Array || input instanceof ArrayBuffer || typeof input === "string";
};
var toUint8Array = function(input) {
  if (typeof input === "string") {
    return decodeFromBase64DataUri(input);
  } else if (input instanceof ArrayBuffer) {
    return new Uint8Array(input);
  } else if (input instanceof Uint8Array) {
    return input;
  } else {
    throw new TypeError("`input` must be one of `string | ArrayBuffer | Uint8Array`");
  }
};
var waitForTick = function() {
  return new Promise(function(resolve) {
    setTimeout(function() {
      return resolve();
    }, 0);
  });
};
var utf16Encode = function(input, byteOrderMark) {
  if (byteOrderMark === void 0) {
    byteOrderMark = true;
  }
  var encoded = [];
  if (byteOrderMark)
    encoded.push(65279);
  for (var idx = 0, len = input.length; idx < len; ) {
    var codePoint = input.codePointAt(idx);
    if (codePoint < 65536) {
      encoded.push(codePoint);
      idx += 1;
    } else if (codePoint < 1114112) {
      encoded.push(highSurrogate(codePoint), lowSurrogate(codePoint));
      idx += 2;
    } else
      throw new Error("Invalid code point: 0x" + toHexString(codePoint));
  }
  return new Uint16Array(encoded);
};
var isWithinBMP = function(codePoint) {
  return codePoint >= 0 && codePoint <= 65535;
};
var hasSurrogates = function(codePoint) {
  return codePoint >= 65536 && codePoint <= 1114111;
};
var highSurrogate = function(codePoint) {
  return Math.floor((codePoint - 65536) / 1024) + 55296;
};
var lowSurrogate = function(codePoint) {
  return (codePoint - 65536) % 1024 + 56320;
};
var ByteOrder;
(function(ByteOrder2) {
  ByteOrder2["BigEndian"] = "BigEndian";
  ByteOrder2["LittleEndian"] = "LittleEndian";
})(ByteOrder || (ByteOrder = {}));
var REPLACEMENT = "�".codePointAt(0);
var utf16Decode = function(input, byteOrderMark) {
  if (byteOrderMark === void 0) {
    byteOrderMark = true;
  }
  if (input.length <= 1)
    return String.fromCodePoint(REPLACEMENT);
  var byteOrder = byteOrderMark ? readBOM(input) : ByteOrder.BigEndian;
  var idx = byteOrderMark ? 2 : 0;
  var codePoints = [];
  while (input.length - idx >= 2) {
    var first = decodeValues(input[idx++], input[idx++], byteOrder);
    if (isHighSurrogate(first)) {
      if (input.length - idx < 2) {
        codePoints.push(REPLACEMENT);
      } else {
        var second = decodeValues(input[idx++], input[idx++], byteOrder);
        if (isLowSurrogate(second)) {
          codePoints.push(first, second);
        } else {
          codePoints.push(REPLACEMENT);
        }
      }
    } else if (isLowSurrogate(first)) {
      idx += 2;
      codePoints.push(REPLACEMENT);
    } else {
      codePoints.push(first);
    }
  }
  if (idx < input.length)
    codePoints.push(REPLACEMENT);
  return String.fromCodePoint.apply(String, codePoints);
};
var isHighSurrogate = function(codePoint) {
  return codePoint >= 55296 && codePoint <= 56319;
};
var isLowSurrogate = function(codePoint) {
  return codePoint >= 56320 && codePoint <= 57343;
};
var decodeValues = function(first, second, byteOrder) {
  if (byteOrder === ByteOrder.LittleEndian)
    return second << 8 | first;
  if (byteOrder === ByteOrder.BigEndian)
    return first << 8 | second;
  throw new Error("Invalid byteOrder: " + byteOrder);
};
var readBOM = function(bytes) {
  return hasUtf16BigEndianBOM(bytes) ? ByteOrder.BigEndian : hasUtf16LittleEndianBOM(bytes) ? ByteOrder.LittleEndian : ByteOrder.BigEndian;
};
var hasUtf16BigEndianBOM = function(bytes) {
  return bytes[0] === 254 && bytes[1] === 255;
};
var hasUtf16LittleEndianBOM = function(bytes) {
  return bytes[0] === 255 && bytes[1] === 254;
};
var hasUtf16BOM = function(bytes) {
  return hasUtf16BigEndianBOM(bytes) || hasUtf16LittleEndianBOM(bytes);
};
var numberToString = function(num) {
  var numStr = String(num);
  if (Math.abs(num) < 1) {
    var e = parseInt(num.toString().split("e-")[1]);
    if (e) {
      var negative = num < 0;
      if (negative)
        num *= -1;
      num *= Math.pow(10, e - 1);
      numStr = "0." + new Array(e).join("0") + num.toString().substring(2);
      if (negative)
        numStr = "-" + numStr;
    }
  } else {
    var e = parseInt(num.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      num /= Math.pow(10, e);
      numStr = num.toString() + new Array(e + 1).join("0");
    }
  }
  return numStr;
};
var sizeInBytes = function(n) {
  return Math.ceil(n.toString(2).length / 8);
};
var bytesFor = function(n) {
  var bytes = new Uint8Array(sizeInBytes(n));
  for (var i = 1; i <= bytes.length; i++) {
    bytes[i - 1] = n >> (bytes.length - i) * 8;
  }
  return bytes;
};
var error = function(msg) {
  throw new Error(msg);
};
var values = function(obj) {
  return Object.keys(obj).map(function(k) {
    return obj[k];
  });
};
var StandardFontValues = values(FontNames);
var isStandardFont = function(input) {
  return StandardFontValues.includes(input);
};
var rectanglesAreEqual = function(a, b) {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
};
var backtick = function(val) {
  return "`" + val + "`";
};
var singleQuote = function(val) {
  return "'" + val + "'";
};
var formatValue = function(value) {
  var type = typeof value;
  if (type === "string")
    return singleQuote(value);
  else if (type === "undefined")
    return backtick(value);
  else
    return value;
};
var createValueErrorMsg = function(value, valueName, values2) {
  var allowedValues = new Array(values2.length);
  for (var idx = 0, len = values2.length; idx < len; idx++) {
    var v = values2[idx];
    allowedValues[idx] = formatValue(v);
  }
  var joinedValues = allowedValues.join(" or ");
  return backtick(valueName) + " must be one of " + joinedValues + ", but was actually " + formatValue(value);
};
var assertIsOneOf = function(value, valueName, allowedValues) {
  if (!Array.isArray(allowedValues)) {
    allowedValues = values(allowedValues);
  }
  for (var idx = 0, len = allowedValues.length; idx < len; idx++) {
    if (value === allowedValues[idx])
      return;
  }
  throw new TypeError(createValueErrorMsg(value, valueName, allowedValues));
};
var assertIsOneOfOrUndefined = function(value, valueName, allowedValues) {
  if (!Array.isArray(allowedValues)) {
    allowedValues = values(allowedValues);
  }
  assertIsOneOf(value, valueName, allowedValues.concat(void 0));
};
var assertIsSubset = function(values$1, valueName, allowedValues) {
  if (!Array.isArray(allowedValues)) {
    allowedValues = values(allowedValues);
  }
  for (var idx = 0, len = values$1.length; idx < len; idx++) {
    assertIsOneOf(values$1[idx], valueName, allowedValues);
  }
};
var getType = function(val) {
  if (val === null)
    return "null";
  if (val === void 0)
    return "undefined";
  if (typeof val === "string")
    return "string";
  if (isNaN(val))
    return "NaN";
  if (typeof val === "number")
    return "number";
  if (typeof val === "boolean")
    return "boolean";
  if (typeof val === "symbol")
    return "symbol";
  if (typeof val === "bigint")
    return "bigint";
  if (val.constructor && val.constructor.name)
    return val.constructor.name;
  if (val.name)
    return val.name;
  if (val.constructor)
    return String(val.constructor);
  return String(val);
};
var isType = function(value, type) {
  if (type === "null")
    return value === null;
  if (type === "undefined")
    return value === void 0;
  if (type === "string")
    return typeof value === "string";
  if (type === "number")
    return typeof value === "number" && !isNaN(value);
  if (type === "boolean")
    return typeof value === "boolean";
  if (type === "symbol")
    return typeof value === "symbol";
  if (type === "bigint")
    return typeof value === "bigint";
  if (type === Date)
    return value instanceof Date;
  if (type === Array)
    return value instanceof Array;
  if (type === Uint8Array)
    return value instanceof Uint8Array;
  if (type === ArrayBuffer)
    return value instanceof ArrayBuffer;
  if (type === Function)
    return value instanceof Function;
  return value instanceof type[0];
};
var createTypeErrorMsg = function(value, valueName, types) {
  var allowedTypes = new Array(types.length);
  for (var idx = 0, len = types.length; idx < len; idx++) {
    var type = types[idx];
    if (type === "null")
      allowedTypes[idx] = backtick("null");
    if (type === "undefined")
      allowedTypes[idx] = backtick("undefined");
    if (type === "string")
      allowedTypes[idx] = backtick("string");
    else if (type === "number")
      allowedTypes[idx] = backtick("number");
    else if (type === "boolean")
      allowedTypes[idx] = backtick("boolean");
    else if (type === "symbol")
      allowedTypes[idx] = backtick("symbol");
    else if (type === "bigint")
      allowedTypes[idx] = backtick("bigint");
    else if (type === Array)
      allowedTypes[idx] = backtick("Array");
    else if (type === Uint8Array)
      allowedTypes[idx] = backtick("Uint8Array");
    else if (type === ArrayBuffer)
      allowedTypes[idx] = backtick("ArrayBuffer");
    else
      allowedTypes[idx] = backtick(type[1]);
  }
  var joinedTypes = allowedTypes.join(" or ");
  return backtick(valueName) + " must be of type " + joinedTypes + ", but was actually of type " + backtick(getType(value));
};
var assertIs = function(value, valueName, types) {
  for (var idx = 0, len = types.length; idx < len; idx++) {
    if (isType(value, types[idx]))
      return;
  }
  throw new TypeError(createTypeErrorMsg(value, valueName, types));
};
var assertOrUndefined = function(value, valueName, types) {
  assertIs(value, valueName, types.concat("undefined"));
};
var assertEachIs = function(values2, valueName, types) {
  for (var idx = 0, len = values2.length; idx < len; idx++) {
    assertIs(values2[idx], valueName, types);
  }
};
var assertRange = function(value, valueName, min, max) {
  assertIs(value, valueName, ["number"]);
  assertIs(min, "min", ["number"]);
  assertIs(max, "max", ["number"]);
  max = Math.max(min, max);
  if (value < min || value > max) {
    throw new Error(backtick(valueName) + " must be at least " + min + " and at most " + max + ", but was actually " + value);
  }
};
var assertRangeOrUndefined = function(value, valueName, min, max) {
  assertIs(value, valueName, ["number", "undefined"]);
  if (typeof value === "number")
    assertRange(value, valueName, min, max);
};
var assertMultiple = function(value, valueName, multiplier) {
  assertIs(value, valueName, ["number"]);
  if (value % multiplier !== 0) {
    throw new Error(backtick(valueName) + " must be a multiple of " + multiplier + ", but was actually " + value);
  }
};
var assertInteger = function(value, valueName) {
  if (!Number.isInteger(value)) {
    throw new Error(backtick(valueName) + " must be an integer, but was actually " + value);
  }
};
var assertPositive = function(value, valueName) {
  if (![1, 0].includes(Math.sign(value))) {
    throw new Error(backtick(valueName) + " must be a positive number or 0, but was actually " + value);
  }
};
var pdfDocEncodingToUnicode = new Uint16Array(256);
for (var idx$2 = 0; idx$2 < 256; idx$2++) {
  pdfDocEncodingToUnicode[idx$2] = idx$2;
}
pdfDocEncodingToUnicode[22] = toCharCode("");
pdfDocEncodingToUnicode[24] = toCharCode("˘");
pdfDocEncodingToUnicode[25] = toCharCode("ˇ");
pdfDocEncodingToUnicode[26] = toCharCode("ˆ");
pdfDocEncodingToUnicode[27] = toCharCode("˙");
pdfDocEncodingToUnicode[28] = toCharCode("˝");
pdfDocEncodingToUnicode[29] = toCharCode("˛");
pdfDocEncodingToUnicode[30] = toCharCode("˚");
pdfDocEncodingToUnicode[31] = toCharCode("˜");
pdfDocEncodingToUnicode[127] = toCharCode("�");
pdfDocEncodingToUnicode[128] = toCharCode("•");
pdfDocEncodingToUnicode[129] = toCharCode("†");
pdfDocEncodingToUnicode[130] = toCharCode("‡");
pdfDocEncodingToUnicode[131] = toCharCode("…");
pdfDocEncodingToUnicode[132] = toCharCode("—");
pdfDocEncodingToUnicode[133] = toCharCode("–");
pdfDocEncodingToUnicode[134] = toCharCode("ƒ");
pdfDocEncodingToUnicode[135] = toCharCode("⁄");
pdfDocEncodingToUnicode[136] = toCharCode("‹");
pdfDocEncodingToUnicode[137] = toCharCode("›");
pdfDocEncodingToUnicode[138] = toCharCode("−");
pdfDocEncodingToUnicode[139] = toCharCode("‰");
pdfDocEncodingToUnicode[140] = toCharCode("„");
pdfDocEncodingToUnicode[141] = toCharCode("“");
pdfDocEncodingToUnicode[142] = toCharCode("”");
pdfDocEncodingToUnicode[143] = toCharCode("‘");
pdfDocEncodingToUnicode[144] = toCharCode("’");
pdfDocEncodingToUnicode[145] = toCharCode("‚");
pdfDocEncodingToUnicode[146] = toCharCode("™");
pdfDocEncodingToUnicode[147] = toCharCode("ﬁ");
pdfDocEncodingToUnicode[148] = toCharCode("ﬂ");
pdfDocEncodingToUnicode[149] = toCharCode("Ł");
pdfDocEncodingToUnicode[150] = toCharCode("Œ");
pdfDocEncodingToUnicode[151] = toCharCode("Š");
pdfDocEncodingToUnicode[152] = toCharCode("Ÿ");
pdfDocEncodingToUnicode[153] = toCharCode("Ž");
pdfDocEncodingToUnicode[154] = toCharCode("ı");
pdfDocEncodingToUnicode[155] = toCharCode("ł");
pdfDocEncodingToUnicode[156] = toCharCode("œ");
pdfDocEncodingToUnicode[157] = toCharCode("š");
pdfDocEncodingToUnicode[158] = toCharCode("ž");
pdfDocEncodingToUnicode[159] = toCharCode("�");
pdfDocEncodingToUnicode[160] = toCharCode("€");
pdfDocEncodingToUnicode[173] = toCharCode("�");
var pdfDocEncodingDecode = function(bytes) {
  var codePoints = new Array(bytes.length);
  for (var idx = 0, len = bytes.length; idx < len; idx++) {
    codePoints[idx] = pdfDocEncodingToUnicode[bytes[idx]];
  }
  return String.fromCodePoint.apply(String, codePoints);
};
var Cache = (
  /** @class */
  (function() {
    function Cache2(populate) {
      this.populate = populate;
      this.value = void 0;
    }
    Cache2.prototype.getValue = function() {
      return this.value;
    };
    Cache2.prototype.access = function() {
      if (!this.value)
        this.value = this.populate();
      return this.value;
    };
    Cache2.prototype.invalidate = function() {
      this.value = void 0;
    };
    Cache2.populatedBy = function(populate) {
      return new Cache2(populate);
    };
    return Cache2;
  })()
);
var MethodNotImplementedError = (
  /** @class */
  (function(_super) {
    __extends(MethodNotImplementedError2, _super);
    function MethodNotImplementedError2(className, methodName) {
      var _this = this;
      var msg = "Method " + className + "." + methodName + "() not implemented";
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return MethodNotImplementedError2;
  })(Error)
);
var PrivateConstructorError = (
  /** @class */
  (function(_super) {
    __extends(PrivateConstructorError2, _super);
    function PrivateConstructorError2(className) {
      var _this = this;
      var msg = "Cannot construct " + className + " - it has a private constructor";
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return PrivateConstructorError2;
  })(Error)
);
var UnexpectedObjectTypeError = (
  /** @class */
  (function(_super) {
    __extends(UnexpectedObjectTypeError2, _super);
    function UnexpectedObjectTypeError2(expected, actual) {
      var _this = this;
      var name = function(t) {
        var _a, _b;
        return (_a = t === null || t === void 0 ? void 0 : t.name) !== null && _a !== void 0 ? _a : (_b = t === null || t === void 0 ? void 0 : t.constructor) === null || _b === void 0 ? void 0 : _b.name;
      };
      var expectedTypes = Array.isArray(expected) ? expected.map(name) : [name(expected)];
      var msg = "Expected instance of " + expectedTypes.join(" or ") + ", " + ("but got instance of " + (actual ? name(actual) : actual));
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return UnexpectedObjectTypeError2;
  })(Error)
);
var UnsupportedEncodingError = (
  /** @class */
  (function(_super) {
    __extends(UnsupportedEncodingError2, _super);
    function UnsupportedEncodingError2(encoding) {
      var _this = this;
      var msg = encoding + " stream encoding not supported";
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return UnsupportedEncodingError2;
  })(Error)
);
var ReparseError = (
  /** @class */
  (function(_super) {
    __extends(ReparseError2, _super);
    function ReparseError2(className, methodName) {
      var _this = this;
      var msg = "Cannot call " + className + "." + methodName + "() more than once";
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return ReparseError2;
  })(Error)
);
(function(_super) {
  __extends(MissingCatalogError, _super);
  function MissingCatalogError(ref) {
    var _this = this;
    var msg = "Missing catalog (ref=" + ref + ")";
    _this = _super.call(this, msg) || this;
    return _this;
  }
  return MissingCatalogError;
})(Error);
var MissingPageContentsEmbeddingError = (
  /** @class */
  (function(_super) {
    __extends(MissingPageContentsEmbeddingError2, _super);
    function MissingPageContentsEmbeddingError2() {
      var _this = this;
      var msg = "Can't embed page with missing Contents";
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return MissingPageContentsEmbeddingError2;
  })(Error)
);
var UnrecognizedStreamTypeError = (
  /** @class */
  (function(_super) {
    __extends(UnrecognizedStreamTypeError2, _super);
    function UnrecognizedStreamTypeError2(stream2) {
      var _a, _b, _c;
      var _this = this;
      var streamType = (_c = (_b = (_a = stream2 === null || stream2 === void 0 ? void 0 : stream2.contructor) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : stream2 === null || stream2 === void 0 ? void 0 : stream2.name) !== null && _c !== void 0 ? _c : stream2;
      var msg = "Unrecognized stream type: " + streamType;
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return UnrecognizedStreamTypeError2;
  })(Error)
);
var PageEmbeddingMismatchedContextError = (
  /** @class */
  (function(_super) {
    __extends(PageEmbeddingMismatchedContextError2, _super);
    function PageEmbeddingMismatchedContextError2() {
      var _this = this;
      var msg = "Found mismatched contexts while embedding pages. All pages in the array passed to `PDFDocument.embedPages()` must be from the same document.";
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return PageEmbeddingMismatchedContextError2;
  })(Error)
);
var PDFArrayIsNotRectangleError = (
  /** @class */
  (function(_super) {
    __extends(PDFArrayIsNotRectangleError2, _super);
    function PDFArrayIsNotRectangleError2(size) {
      var _this = this;
      var msg = "Attempted to convert PDFArray with " + size + " elements to rectangle, but must have exactly 4 elements.";
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return PDFArrayIsNotRectangleError2;
  })(Error)
);
var InvalidPDFDateStringError = (
  /** @class */
  (function(_super) {
    __extends(InvalidPDFDateStringError2, _super);
    function InvalidPDFDateStringError2(value) {
      var _this = this;
      var msg = 'Attempted to convert "' + value + '" to a date, but it does not match the PDF date string format.';
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return InvalidPDFDateStringError2;
  })(Error)
);
var InvalidTargetIndexError = (
  /** @class */
  (function(_super) {
    __extends(InvalidTargetIndexError2, _super);
    function InvalidTargetIndexError2(targetIndex, Count) {
      var _this = this;
      var msg = "Invalid targetIndex specified: targetIndex=" + targetIndex + " must be less than Count=" + Count;
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return InvalidTargetIndexError2;
  })(Error)
);
var CorruptPageTreeError = (
  /** @class */
  (function(_super) {
    __extends(CorruptPageTreeError2, _super);
    function CorruptPageTreeError2(targetIndex, operation) {
      var _this = this;
      var msg = "Failed to " + operation + " at targetIndex=" + targetIndex + " due to corrupt page tree: It is likely that one or more 'Count' entries are invalid";
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return CorruptPageTreeError2;
  })(Error)
);
var IndexOutOfBoundsError = (
  /** @class */
  (function(_super) {
    __extends(IndexOutOfBoundsError2, _super);
    function IndexOutOfBoundsError2(index, min, max) {
      var _this = this;
      var msg = "index should be at least " + min + " and at most " + max + ", but was actually " + index;
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return IndexOutOfBoundsError2;
  })(Error)
);
var InvalidAcroFieldValueError = (
  /** @class */
  (function(_super) {
    __extends(InvalidAcroFieldValueError2, _super);
    function InvalidAcroFieldValueError2() {
      var _this = this;
      var msg = "Attempted to set invalid field value";
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return InvalidAcroFieldValueError2;
  })(Error)
);
var MultiSelectValueError = (
  /** @class */
  (function(_super) {
    __extends(MultiSelectValueError2, _super);
    function MultiSelectValueError2() {
      var _this = this;
      var msg = "Attempted to select multiple values for single-select field";
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return MultiSelectValueError2;
  })(Error)
);
var MissingDAEntryError = (
  /** @class */
  (function(_super) {
    __extends(MissingDAEntryError2, _super);
    function MissingDAEntryError2(fieldName) {
      var _this = this;
      var msg = "No /DA (default appearance) entry found for field: " + fieldName;
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return MissingDAEntryError2;
  })(Error)
);
var MissingTfOperatorError = (
  /** @class */
  (function(_super) {
    __extends(MissingTfOperatorError2, _super);
    function MissingTfOperatorError2(fieldName) {
      var _this = this;
      var msg = "No Tf operator found for DA of field: " + fieldName;
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return MissingTfOperatorError2;
  })(Error)
);
var NumberParsingError = (
  /** @class */
  (function(_super) {
    __extends(NumberParsingError2, _super);
    function NumberParsingError2(pos, value) {
      var _this = this;
      var msg = "Failed to parse number " + ("(line:" + pos.line + " col:" + pos.column + " offset=" + pos.offset + '): "' + value + '"');
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return NumberParsingError2;
  })(Error)
);
var PDFParsingError = (
  /** @class */
  (function(_super) {
    __extends(PDFParsingError2, _super);
    function PDFParsingError2(pos, details) {
      var _this = this;
      var msg = "Failed to parse PDF document " + ("(line:" + pos.line + " col:" + pos.column + " offset=" + pos.offset + "): " + details);
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return PDFParsingError2;
  })(Error)
);
var NextByteAssertionError = (
  /** @class */
  (function(_super) {
    __extends(NextByteAssertionError2, _super);
    function NextByteAssertionError2(pos, expectedByte, actualByte) {
      var _this = this;
      var msg = "Expected next byte to be " + expectedByte + " but it was actually " + actualByte;
      _this = _super.call(this, pos, msg) || this;
      return _this;
    }
    return NextByteAssertionError2;
  })(PDFParsingError)
);
var PDFObjectParsingError = (
  /** @class */
  (function(_super) {
    __extends(PDFObjectParsingError2, _super);
    function PDFObjectParsingError2(pos, byte) {
      var _this = this;
      var msg = "Failed to parse PDF object starting with the following byte: " + byte;
      _this = _super.call(this, pos, msg) || this;
      return _this;
    }
    return PDFObjectParsingError2;
  })(PDFParsingError)
);
var PDFInvalidObjectParsingError = (
  /** @class */
  (function(_super) {
    __extends(PDFInvalidObjectParsingError2, _super);
    function PDFInvalidObjectParsingError2(pos) {
      var _this = this;
      var msg = "Failed to parse invalid PDF object";
      _this = _super.call(this, pos, msg) || this;
      return _this;
    }
    return PDFInvalidObjectParsingError2;
  })(PDFParsingError)
);
var PDFStreamParsingError = (
  /** @class */
  (function(_super) {
    __extends(PDFStreamParsingError2, _super);
    function PDFStreamParsingError2(pos) {
      var _this = this;
      var msg = "Failed to parse PDF stream";
      _this = _super.call(this, pos, msg) || this;
      return _this;
    }
    return PDFStreamParsingError2;
  })(PDFParsingError)
);
var UnbalancedParenthesisError = (
  /** @class */
  (function(_super) {
    __extends(UnbalancedParenthesisError2, _super);
    function UnbalancedParenthesisError2(pos) {
      var _this = this;
      var msg = "Failed to parse PDF literal string due to unbalanced parenthesis";
      _this = _super.call(this, pos, msg) || this;
      return _this;
    }
    return UnbalancedParenthesisError2;
  })(PDFParsingError)
);
var StalledParserError = (
  /** @class */
  (function(_super) {
    __extends(StalledParserError2, _super);
    function StalledParserError2(pos) {
      var _this = this;
      var msg = "Parser stalled";
      _this = _super.call(this, pos, msg) || this;
      return _this;
    }
    return StalledParserError2;
  })(PDFParsingError)
);
var MissingPDFHeaderError = (
  /** @class */
  (function(_super) {
    __extends(MissingPDFHeaderError2, _super);
    function MissingPDFHeaderError2(pos) {
      var _this = this;
      var msg = "No PDF header found";
      _this = _super.call(this, pos, msg) || this;
      return _this;
    }
    return MissingPDFHeaderError2;
  })(PDFParsingError)
);
var MissingKeywordError = (
  /** @class */
  (function(_super) {
    __extends(MissingKeywordError2, _super);
    function MissingKeywordError2(pos, keyword) {
      var _this = this;
      var msg = "Did not find expected keyword '" + arrayAsString(keyword) + "'";
      _this = _super.call(this, pos, msg) || this;
      return _this;
    }
    return MissingKeywordError2;
  })(PDFParsingError)
);
var CharCodes;
(function(CharCodes2) {
  CharCodes2[CharCodes2["Null"] = 0] = "Null";
  CharCodes2[CharCodes2["Backspace"] = 8] = "Backspace";
  CharCodes2[CharCodes2["Tab"] = 9] = "Tab";
  CharCodes2[CharCodes2["Newline"] = 10] = "Newline";
  CharCodes2[CharCodes2["FormFeed"] = 12] = "FormFeed";
  CharCodes2[CharCodes2["CarriageReturn"] = 13] = "CarriageReturn";
  CharCodes2[CharCodes2["Space"] = 32] = "Space";
  CharCodes2[CharCodes2["ExclamationPoint"] = 33] = "ExclamationPoint";
  CharCodes2[CharCodes2["Hash"] = 35] = "Hash";
  CharCodes2[CharCodes2["Percent"] = 37] = "Percent";
  CharCodes2[CharCodes2["LeftParen"] = 40] = "LeftParen";
  CharCodes2[CharCodes2["RightParen"] = 41] = "RightParen";
  CharCodes2[CharCodes2["Plus"] = 43] = "Plus";
  CharCodes2[CharCodes2["Minus"] = 45] = "Minus";
  CharCodes2[CharCodes2["Dash"] = 45] = "Dash";
  CharCodes2[CharCodes2["Period"] = 46] = "Period";
  CharCodes2[CharCodes2["ForwardSlash"] = 47] = "ForwardSlash";
  CharCodes2[CharCodes2["Zero"] = 48] = "Zero";
  CharCodes2[CharCodes2["One"] = 49] = "One";
  CharCodes2[CharCodes2["Two"] = 50] = "Two";
  CharCodes2[CharCodes2["Three"] = 51] = "Three";
  CharCodes2[CharCodes2["Four"] = 52] = "Four";
  CharCodes2[CharCodes2["Five"] = 53] = "Five";
  CharCodes2[CharCodes2["Six"] = 54] = "Six";
  CharCodes2[CharCodes2["Seven"] = 55] = "Seven";
  CharCodes2[CharCodes2["Eight"] = 56] = "Eight";
  CharCodes2[CharCodes2["Nine"] = 57] = "Nine";
  CharCodes2[CharCodes2["LessThan"] = 60] = "LessThan";
  CharCodes2[CharCodes2["GreaterThan"] = 62] = "GreaterThan";
  CharCodes2[CharCodes2["A"] = 65] = "A";
  CharCodes2[CharCodes2["D"] = 68] = "D";
  CharCodes2[CharCodes2["E"] = 69] = "E";
  CharCodes2[CharCodes2["F"] = 70] = "F";
  CharCodes2[CharCodes2["O"] = 79] = "O";
  CharCodes2[CharCodes2["P"] = 80] = "P";
  CharCodes2[CharCodes2["R"] = 82] = "R";
  CharCodes2[CharCodes2["LeftSquareBracket"] = 91] = "LeftSquareBracket";
  CharCodes2[CharCodes2["BackSlash"] = 92] = "BackSlash";
  CharCodes2[CharCodes2["RightSquareBracket"] = 93] = "RightSquareBracket";
  CharCodes2[CharCodes2["a"] = 97] = "a";
  CharCodes2[CharCodes2["b"] = 98] = "b";
  CharCodes2[CharCodes2["d"] = 100] = "d";
  CharCodes2[CharCodes2["e"] = 101] = "e";
  CharCodes2[CharCodes2["f"] = 102] = "f";
  CharCodes2[CharCodes2["i"] = 105] = "i";
  CharCodes2[CharCodes2["j"] = 106] = "j";
  CharCodes2[CharCodes2["l"] = 108] = "l";
  CharCodes2[CharCodes2["m"] = 109] = "m";
  CharCodes2[CharCodes2["n"] = 110] = "n";
  CharCodes2[CharCodes2["o"] = 111] = "o";
  CharCodes2[CharCodes2["r"] = 114] = "r";
  CharCodes2[CharCodes2["s"] = 115] = "s";
  CharCodes2[CharCodes2["t"] = 116] = "t";
  CharCodes2[CharCodes2["u"] = 117] = "u";
  CharCodes2[CharCodes2["x"] = 120] = "x";
  CharCodes2[CharCodes2["LeftCurly"] = 123] = "LeftCurly";
  CharCodes2[CharCodes2["RightCurly"] = 125] = "RightCurly";
  CharCodes2[CharCodes2["Tilde"] = 126] = "Tilde";
})(CharCodes || (CharCodes = {}));
var PDFHeader = (
  /** @class */
  (function() {
    function PDFHeader2(major, minor) {
      this.major = String(major);
      this.minor = String(minor);
    }
    PDFHeader2.prototype.toString = function() {
      var bc = charFromCode(129);
      return "%PDF-" + this.major + "." + this.minor + "\n%" + bc + bc + bc + bc;
    };
    PDFHeader2.prototype.sizeInBytes = function() {
      return 12 + this.major.length + this.minor.length;
    };
    PDFHeader2.prototype.copyBytesInto = function(buffer, offset) {
      var initialOffset = offset;
      buffer[offset++] = CharCodes.Percent;
      buffer[offset++] = CharCodes.P;
      buffer[offset++] = CharCodes.D;
      buffer[offset++] = CharCodes.F;
      buffer[offset++] = CharCodes.Dash;
      offset += copyStringIntoBuffer(this.major, buffer, offset);
      buffer[offset++] = CharCodes.Period;
      offset += copyStringIntoBuffer(this.minor, buffer, offset);
      buffer[offset++] = CharCodes.Newline;
      buffer[offset++] = CharCodes.Percent;
      buffer[offset++] = 129;
      buffer[offset++] = 129;
      buffer[offset++] = 129;
      buffer[offset++] = 129;
      return offset - initialOffset;
    };
    PDFHeader2.forVersion = function(major, minor) {
      return new PDFHeader2(major, minor);
    };
    return PDFHeader2;
  })()
);
var PDFObject = (
  /** @class */
  (function() {
    function PDFObject2() {
    }
    PDFObject2.prototype.clone = function(_context) {
      throw new MethodNotImplementedError(this.constructor.name, "clone");
    };
    PDFObject2.prototype.toString = function() {
      throw new MethodNotImplementedError(this.constructor.name, "toString");
    };
    PDFObject2.prototype.sizeInBytes = function() {
      throw new MethodNotImplementedError(this.constructor.name, "sizeInBytes");
    };
    PDFObject2.prototype.copyBytesInto = function(_buffer, _offset) {
      throw new MethodNotImplementedError(this.constructor.name, "copyBytesInto");
    };
    return PDFObject2;
  })()
);
var PDFNumber = (
  /** @class */
  (function(_super) {
    __extends(PDFNumber2, _super);
    function PDFNumber2(value) {
      var _this = _super.call(this) || this;
      _this.numberValue = value;
      _this.stringValue = numberToString(value);
      return _this;
    }
    PDFNumber2.prototype.asNumber = function() {
      return this.numberValue;
    };
    PDFNumber2.prototype.value = function() {
      return this.numberValue;
    };
    PDFNumber2.prototype.clone = function() {
      return PDFNumber2.of(this.numberValue);
    };
    PDFNumber2.prototype.toString = function() {
      return this.stringValue;
    };
    PDFNumber2.prototype.sizeInBytes = function() {
      return this.stringValue.length;
    };
    PDFNumber2.prototype.copyBytesInto = function(buffer, offset) {
      offset += copyStringIntoBuffer(this.stringValue, buffer, offset);
      return this.stringValue.length;
    };
    PDFNumber2.of = function(value) {
      return new PDFNumber2(value);
    };
    return PDFNumber2;
  })(PDFObject)
);
var PDFArray = (
  /** @class */
  (function(_super) {
    __extends(PDFArray2, _super);
    function PDFArray2(context) {
      var _this = _super.call(this) || this;
      _this.array = [];
      _this.context = context;
      return _this;
    }
    PDFArray2.prototype.size = function() {
      return this.array.length;
    };
    PDFArray2.prototype.push = function(object) {
      this.array.push(object);
    };
    PDFArray2.prototype.insert = function(index, object) {
      this.array.splice(index, 0, object);
    };
    PDFArray2.prototype.indexOf = function(object) {
      var index = this.array.indexOf(object);
      return index === -1 ? void 0 : index;
    };
    PDFArray2.prototype.remove = function(index) {
      this.array.splice(index, 1);
    };
    PDFArray2.prototype.set = function(idx, object) {
      this.array[idx] = object;
    };
    PDFArray2.prototype.get = function(index) {
      return this.array[index];
    };
    PDFArray2.prototype.lookupMaybe = function(index) {
      var _a;
      var types = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        types[_i - 1] = arguments[_i];
      }
      return (_a = this.context).lookupMaybe.apply(_a, __spreadArrays([this.get(index)], types));
    };
    PDFArray2.prototype.lookup = function(index) {
      var _a;
      var types = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        types[_i - 1] = arguments[_i];
      }
      return (_a = this.context).lookup.apply(_a, __spreadArrays([this.get(index)], types));
    };
    PDFArray2.prototype.asRectangle = function() {
      if (this.size() !== 4)
        throw new PDFArrayIsNotRectangleError(this.size());
      var lowerLeftX = this.lookup(0, PDFNumber).asNumber();
      var lowerLeftY = this.lookup(1, PDFNumber).asNumber();
      var upperRightX = this.lookup(2, PDFNumber).asNumber();
      var upperRightY = this.lookup(3, PDFNumber).asNumber();
      var x = lowerLeftX;
      var y = lowerLeftY;
      var width = upperRightX - lowerLeftX;
      var height = upperRightY - lowerLeftY;
      return { x, y, width, height };
    };
    PDFArray2.prototype.asArray = function() {
      return this.array.slice();
    };
    PDFArray2.prototype.clone = function(context) {
      var clone = PDFArray2.withContext(context || this.context);
      for (var idx = 0, len = this.size(); idx < len; idx++) {
        clone.push(this.array[idx]);
      }
      return clone;
    };
    PDFArray2.prototype.toString = function() {
      var arrayString = "[ ";
      for (var idx = 0, len = this.size(); idx < len; idx++) {
        arrayString += this.get(idx).toString();
        arrayString += " ";
      }
      arrayString += "]";
      return arrayString;
    };
    PDFArray2.prototype.sizeInBytes = function() {
      var size = 3;
      for (var idx = 0, len = this.size(); idx < len; idx++) {
        size += this.get(idx).sizeInBytes() + 1;
      }
      return size;
    };
    PDFArray2.prototype.copyBytesInto = function(buffer, offset) {
      var initialOffset = offset;
      buffer[offset++] = CharCodes.LeftSquareBracket;
      buffer[offset++] = CharCodes.Space;
      for (var idx = 0, len = this.size(); idx < len; idx++) {
        offset += this.get(idx).copyBytesInto(buffer, offset);
        buffer[offset++] = CharCodes.Space;
      }
      buffer[offset++] = CharCodes.RightSquareBracket;
      return offset - initialOffset;
    };
    PDFArray2.prototype.scalePDFNumbers = function(x, y) {
      for (var idx = 0, len = this.size(); idx < len; idx++) {
        var el = this.lookup(idx);
        if (el instanceof PDFNumber) {
          var factor = idx % 2 === 0 ? x : y;
          this.set(idx, PDFNumber.of(el.asNumber() * factor));
        }
      }
    };
    PDFArray2.withContext = function(context) {
      return new PDFArray2(context);
    };
    return PDFArray2;
  })(PDFObject)
);
var ENFORCER$2 = {};
var PDFBool = (
  /** @class */
  (function(_super) {
    __extends(PDFBool2, _super);
    function PDFBool2(enforcer, value) {
      var _this = this;
      if (enforcer !== ENFORCER$2)
        throw new PrivateConstructorError("PDFBool");
      _this = _super.call(this) || this;
      _this.value = value;
      return _this;
    }
    PDFBool2.prototype.asBoolean = function() {
      return this.value;
    };
    PDFBool2.prototype.clone = function() {
      return this;
    };
    PDFBool2.prototype.toString = function() {
      return String(this.value);
    };
    PDFBool2.prototype.sizeInBytes = function() {
      return this.value ? 4 : 5;
    };
    PDFBool2.prototype.copyBytesInto = function(buffer, offset) {
      if (this.value) {
        buffer[offset++] = CharCodes.t;
        buffer[offset++] = CharCodes.r;
        buffer[offset++] = CharCodes.u;
        buffer[offset++] = CharCodes.e;
        return 4;
      } else {
        buffer[offset++] = CharCodes.f;
        buffer[offset++] = CharCodes.a;
        buffer[offset++] = CharCodes.l;
        buffer[offset++] = CharCodes.s;
        buffer[offset++] = CharCodes.e;
        return 5;
      }
    };
    PDFBool2.True = new PDFBool2(ENFORCER$2, true);
    PDFBool2.False = new PDFBool2(ENFORCER$2, false);
    return PDFBool2;
  })(PDFObject)
);
var IsDelimiter = new Uint8Array(256);
IsDelimiter[CharCodes.LeftParen] = 1;
IsDelimiter[CharCodes.RightParen] = 1;
IsDelimiter[CharCodes.LessThan] = 1;
IsDelimiter[CharCodes.GreaterThan] = 1;
IsDelimiter[CharCodes.LeftSquareBracket] = 1;
IsDelimiter[CharCodes.RightSquareBracket] = 1;
IsDelimiter[CharCodes.LeftCurly] = 1;
IsDelimiter[CharCodes.RightCurly] = 1;
IsDelimiter[CharCodes.ForwardSlash] = 1;
IsDelimiter[CharCodes.Percent] = 1;
var IsWhitespace = new Uint8Array(256);
IsWhitespace[CharCodes.Null] = 1;
IsWhitespace[CharCodes.Tab] = 1;
IsWhitespace[CharCodes.Newline] = 1;
IsWhitespace[CharCodes.FormFeed] = 1;
IsWhitespace[CharCodes.CarriageReturn] = 1;
IsWhitespace[CharCodes.Space] = 1;
var IsIrregular = new Uint8Array(256);
for (var idx$1 = 0, len$1 = 256; idx$1 < len$1; idx$1++) {
  IsIrregular[idx$1] = IsWhitespace[idx$1] || IsDelimiter[idx$1] ? 1 : 0;
}
IsIrregular[CharCodes.Hash] = 1;
var decodeName = function(name) {
  return name.replace(/#([\dABCDEF]{2})/g, function(_, hex) {
    return charFromHexCode(hex);
  });
};
var isRegularChar = function(charCode) {
  return charCode >= CharCodes.ExclamationPoint && charCode <= CharCodes.Tilde && !IsIrregular[charCode];
};
var ENFORCER$1 = {};
var pool$1 = /* @__PURE__ */ new Map();
var PDFName = (
  /** @class */
  (function(_super) {
    __extends(PDFName2, _super);
    function PDFName2(enforcer, name) {
      var _this = this;
      if (enforcer !== ENFORCER$1)
        throw new PrivateConstructorError("PDFName");
      _this = _super.call(this) || this;
      var encodedName = "/";
      for (var idx = 0, len = name.length; idx < len; idx++) {
        var character = name[idx];
        var code = toCharCode(character);
        encodedName += isRegularChar(code) ? character : "#" + toHexString(code);
      }
      _this.encodedName = encodedName;
      return _this;
    }
    PDFName2.prototype.asBytes = function() {
      var bytes = [];
      var hex = "";
      var escaped = false;
      var pushByte = function(byte2) {
        if (byte2 !== void 0)
          bytes.push(byte2);
        escaped = false;
      };
      for (var idx = 1, len = this.encodedName.length; idx < len; idx++) {
        var char = this.encodedName[idx];
        var byte = toCharCode(char);
        var nextChar = this.encodedName[idx + 1];
        if (!escaped) {
          if (byte === CharCodes.Hash)
            escaped = true;
          else
            pushByte(byte);
        } else {
          if (byte >= CharCodes.Zero && byte <= CharCodes.Nine || byte >= CharCodes.a && byte <= CharCodes.f || byte >= CharCodes.A && byte <= CharCodes.F) {
            hex += char;
            if (hex.length === 2 || !(nextChar >= "0" && nextChar <= "9" || nextChar >= "a" && nextChar <= "f" || nextChar >= "A" && nextChar <= "F")) {
              pushByte(parseInt(hex, 16));
              hex = "";
            }
          } else {
            pushByte(byte);
          }
        }
      }
      return new Uint8Array(bytes);
    };
    PDFName2.prototype.decodeText = function() {
      var bytes = this.asBytes();
      return String.fromCharCode.apply(String, Array.from(bytes));
    };
    PDFName2.prototype.asString = function() {
      return this.encodedName;
    };
    PDFName2.prototype.value = function() {
      return this.encodedName;
    };
    PDFName2.prototype.clone = function() {
      return this;
    };
    PDFName2.prototype.toString = function() {
      return this.encodedName;
    };
    PDFName2.prototype.sizeInBytes = function() {
      return this.encodedName.length;
    };
    PDFName2.prototype.copyBytesInto = function(buffer, offset) {
      offset += copyStringIntoBuffer(this.encodedName, buffer, offset);
      return this.encodedName.length;
    };
    PDFName2.of = function(name) {
      var decodedValue = decodeName(name);
      var instance = pool$1.get(decodedValue);
      if (!instance) {
        instance = new PDFName2(ENFORCER$1, decodedValue);
        pool$1.set(decodedValue, instance);
      }
      return instance;
    };
    PDFName2.Length = PDFName2.of("Length");
    PDFName2.FlateDecode = PDFName2.of("FlateDecode");
    PDFName2.Resources = PDFName2.of("Resources");
    PDFName2.Font = PDFName2.of("Font");
    PDFName2.XObject = PDFName2.of("XObject");
    PDFName2.ExtGState = PDFName2.of("ExtGState");
    PDFName2.Contents = PDFName2.of("Contents");
    PDFName2.Type = PDFName2.of("Type");
    PDFName2.Parent = PDFName2.of("Parent");
    PDFName2.MediaBox = PDFName2.of("MediaBox");
    PDFName2.Page = PDFName2.of("Page");
    PDFName2.Annots = PDFName2.of("Annots");
    PDFName2.TrimBox = PDFName2.of("TrimBox");
    PDFName2.ArtBox = PDFName2.of("ArtBox");
    PDFName2.BleedBox = PDFName2.of("BleedBox");
    PDFName2.CropBox = PDFName2.of("CropBox");
    PDFName2.Rotate = PDFName2.of("Rotate");
    PDFName2.Title = PDFName2.of("Title");
    PDFName2.Author = PDFName2.of("Author");
    PDFName2.Subject = PDFName2.of("Subject");
    PDFName2.Creator = PDFName2.of("Creator");
    PDFName2.Keywords = PDFName2.of("Keywords");
    PDFName2.Producer = PDFName2.of("Producer");
    PDFName2.CreationDate = PDFName2.of("CreationDate");
    PDFName2.ModDate = PDFName2.of("ModDate");
    return PDFName2;
  })(PDFObject)
);
var PDFNull = (
  /** @class */
  (function(_super) {
    __extends(PDFNull2, _super);
    function PDFNull2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFNull2.prototype.asNull = function() {
      return null;
    };
    PDFNull2.prototype.clone = function() {
      return this;
    };
    PDFNull2.prototype.toString = function() {
      return "null";
    };
    PDFNull2.prototype.sizeInBytes = function() {
      return 4;
    };
    PDFNull2.prototype.copyBytesInto = function(buffer, offset) {
      buffer[offset++] = CharCodes.n;
      buffer[offset++] = CharCodes.u;
      buffer[offset++] = CharCodes.l;
      buffer[offset++] = CharCodes.l;
      return 4;
    };
    return PDFNull2;
  })(PDFObject)
);
const PDFNull$1 = new PDFNull();
var PDFDict = (
  /** @class */
  (function(_super) {
    __extends(PDFDict2, _super);
    function PDFDict2(map, context) {
      var _this = _super.call(this) || this;
      _this.dict = map;
      _this.context = context;
      return _this;
    }
    PDFDict2.prototype.keys = function() {
      return Array.from(this.dict.keys());
    };
    PDFDict2.prototype.values = function() {
      return Array.from(this.dict.values());
    };
    PDFDict2.prototype.entries = function() {
      return Array.from(this.dict.entries());
    };
    PDFDict2.prototype.set = function(key, value) {
      this.dict.set(key, value);
    };
    PDFDict2.prototype.get = function(key, preservePDFNull) {
      if (preservePDFNull === void 0) {
        preservePDFNull = false;
      }
      var value = this.dict.get(key);
      if (value === PDFNull$1 && !preservePDFNull)
        return void 0;
      return value;
    };
    PDFDict2.prototype.has = function(key) {
      var value = this.dict.get(key);
      return value !== void 0 && value !== PDFNull$1;
    };
    PDFDict2.prototype.lookupMaybe = function(key) {
      var _a;
      var types = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        types[_i - 1] = arguments[_i];
      }
      var preservePDFNull = types.includes(PDFNull$1);
      var value = (_a = this.context).lookupMaybe.apply(_a, __spreadArrays([this.get(key, preservePDFNull)], types));
      if (value === PDFNull$1 && !preservePDFNull)
        return void 0;
      return value;
    };
    PDFDict2.prototype.lookup = function(key) {
      var _a;
      var types = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        types[_i - 1] = arguments[_i];
      }
      var preservePDFNull = types.includes(PDFNull$1);
      var value = (_a = this.context).lookup.apply(_a, __spreadArrays([this.get(key, preservePDFNull)], types));
      if (value === PDFNull$1 && !preservePDFNull)
        return void 0;
      return value;
    };
    PDFDict2.prototype.delete = function(key) {
      return this.dict.delete(key);
    };
    PDFDict2.prototype.asMap = function() {
      return new Map(this.dict);
    };
    PDFDict2.prototype.uniqueKey = function(tag) {
      if (tag === void 0) {
        tag = "";
      }
      var existingKeys = this.keys();
      var key = PDFName.of(this.context.addRandomSuffix(tag, 10));
      while (existingKeys.includes(key)) {
        key = PDFName.of(this.context.addRandomSuffix(tag, 10));
      }
      return key;
    };
    PDFDict2.prototype.clone = function(context) {
      var clone = PDFDict2.withContext(context || this.context);
      var entries = this.entries();
      for (var idx = 0, len = entries.length; idx < len; idx++) {
        var _a = entries[idx], key = _a[0], value = _a[1];
        clone.set(key, value);
      }
      return clone;
    };
    PDFDict2.prototype.toString = function() {
      var dictString = "<<\n";
      var entries = this.entries();
      for (var idx = 0, len = entries.length; idx < len; idx++) {
        var _a = entries[idx], key = _a[0], value = _a[1];
        dictString += key.toString() + " " + value.toString() + "\n";
      }
      dictString += ">>";
      return dictString;
    };
    PDFDict2.prototype.sizeInBytes = function() {
      var size = 5;
      var entries = this.entries();
      for (var idx = 0, len = entries.length; idx < len; idx++) {
        var _a = entries[idx], key = _a[0], value = _a[1];
        size += key.sizeInBytes() + value.sizeInBytes() + 2;
      }
      return size;
    };
    PDFDict2.prototype.copyBytesInto = function(buffer, offset) {
      var initialOffset = offset;
      buffer[offset++] = CharCodes.LessThan;
      buffer[offset++] = CharCodes.LessThan;
      buffer[offset++] = CharCodes.Newline;
      var entries = this.entries();
      for (var idx = 0, len = entries.length; idx < len; idx++) {
        var _a = entries[idx], key = _a[0], value = _a[1];
        offset += key.copyBytesInto(buffer, offset);
        buffer[offset++] = CharCodes.Space;
        offset += value.copyBytesInto(buffer, offset);
        buffer[offset++] = CharCodes.Newline;
      }
      buffer[offset++] = CharCodes.GreaterThan;
      buffer[offset++] = CharCodes.GreaterThan;
      return offset - initialOffset;
    };
    PDFDict2.withContext = function(context) {
      return new PDFDict2(/* @__PURE__ */ new Map(), context);
    };
    PDFDict2.fromMapWithContext = function(map, context) {
      return new PDFDict2(map, context);
    };
    return PDFDict2;
  })(PDFObject)
);
var PDFStream = (
  /** @class */
  (function(_super) {
    __extends(PDFStream2, _super);
    function PDFStream2(dict) {
      var _this = _super.call(this) || this;
      _this.dict = dict;
      return _this;
    }
    PDFStream2.prototype.clone = function(_context) {
      throw new MethodNotImplementedError(this.constructor.name, "clone");
    };
    PDFStream2.prototype.getContentsString = function() {
      throw new MethodNotImplementedError(this.constructor.name, "getContentsString");
    };
    PDFStream2.prototype.getContents = function() {
      throw new MethodNotImplementedError(this.constructor.name, "getContents");
    };
    PDFStream2.prototype.getContentsSize = function() {
      throw new MethodNotImplementedError(this.constructor.name, "getContentsSize");
    };
    PDFStream2.prototype.updateDict = function() {
      var contentsSize = this.getContentsSize();
      this.dict.set(PDFName.Length, PDFNumber.of(contentsSize));
    };
    PDFStream2.prototype.sizeInBytes = function() {
      this.updateDict();
      return this.dict.sizeInBytes() + this.getContentsSize() + 18;
    };
    PDFStream2.prototype.toString = function() {
      this.updateDict();
      var streamString = this.dict.toString();
      streamString += "\nstream\n";
      streamString += this.getContentsString();
      streamString += "\nendstream";
      return streamString;
    };
    PDFStream2.prototype.copyBytesInto = function(buffer, offset) {
      this.updateDict();
      var initialOffset = offset;
      offset += this.dict.copyBytesInto(buffer, offset);
      buffer[offset++] = CharCodes.Newline;
      buffer[offset++] = CharCodes.s;
      buffer[offset++] = CharCodes.t;
      buffer[offset++] = CharCodes.r;
      buffer[offset++] = CharCodes.e;
      buffer[offset++] = CharCodes.a;
      buffer[offset++] = CharCodes.m;
      buffer[offset++] = CharCodes.Newline;
      var contents = this.getContents();
      for (var idx = 0, len = contents.length; idx < len; idx++) {
        buffer[offset++] = contents[idx];
      }
      buffer[offset++] = CharCodes.Newline;
      buffer[offset++] = CharCodes.e;
      buffer[offset++] = CharCodes.n;
      buffer[offset++] = CharCodes.d;
      buffer[offset++] = CharCodes.s;
      buffer[offset++] = CharCodes.t;
      buffer[offset++] = CharCodes.r;
      buffer[offset++] = CharCodes.e;
      buffer[offset++] = CharCodes.a;
      buffer[offset++] = CharCodes.m;
      return offset - initialOffset;
    };
    return PDFStream2;
  })(PDFObject)
);
var PDFRawStream = (
  /** @class */
  (function(_super) {
    __extends(PDFRawStream2, _super);
    function PDFRawStream2(dict, contents) {
      var _this = _super.call(this, dict) || this;
      _this.contents = contents;
      return _this;
    }
    PDFRawStream2.prototype.asUint8Array = function() {
      return this.contents.slice();
    };
    PDFRawStream2.prototype.clone = function(context) {
      return PDFRawStream2.of(this.dict.clone(context), this.contents.slice());
    };
    PDFRawStream2.prototype.getContentsString = function() {
      return arrayAsString(this.contents);
    };
    PDFRawStream2.prototype.getContents = function() {
      return this.contents;
    };
    PDFRawStream2.prototype.getContentsSize = function() {
      return this.contents.length;
    };
    PDFRawStream2.of = function(dict, contents) {
      return new PDFRawStream2(dict, contents);
    };
    return PDFRawStream2;
  })(PDFStream)
);
var ENFORCER = {};
var pool = /* @__PURE__ */ new Map();
var PDFRef = (
  /** @class */
  (function(_super) {
    __extends(PDFRef2, _super);
    function PDFRef2(enforcer, objectNumber, generationNumber) {
      var _this = this;
      if (enforcer !== ENFORCER)
        throw new PrivateConstructorError("PDFRef");
      _this = _super.call(this) || this;
      _this.objectNumber = objectNumber;
      _this.generationNumber = generationNumber;
      _this.tag = objectNumber + " " + generationNumber + " R";
      return _this;
    }
    PDFRef2.prototype.clone = function() {
      return this;
    };
    PDFRef2.prototype.toString = function() {
      return this.tag;
    };
    PDFRef2.prototype.sizeInBytes = function() {
      return this.tag.length;
    };
    PDFRef2.prototype.copyBytesInto = function(buffer, offset) {
      offset += copyStringIntoBuffer(this.tag, buffer, offset);
      return this.tag.length;
    };
    PDFRef2.of = function(objectNumber, generationNumber) {
      if (generationNumber === void 0) {
        generationNumber = 0;
      }
      var tag = objectNumber + " " + generationNumber + " R";
      var instance = pool.get(tag);
      if (!instance) {
        instance = new PDFRef2(ENFORCER, objectNumber, generationNumber);
        pool.set(tag, instance);
      }
      return instance;
    };
    return PDFRef2;
  })(PDFObject)
);
var PDFOperator = (
  /** @class */
  (function() {
    function PDFOperator2(name, args) {
      this.name = name;
      this.args = args || [];
    }
    PDFOperator2.prototype.clone = function(context) {
      var args = new Array(this.args.length);
      for (var idx = 0, len = args.length; idx < len; idx++) {
        var arg = this.args[idx];
        args[idx] = arg instanceof PDFObject ? arg.clone(context) : arg;
      }
      return PDFOperator2.of(this.name, args);
    };
    PDFOperator2.prototype.toString = function() {
      var value = "";
      for (var idx = 0, len = this.args.length; idx < len; idx++) {
        value += String(this.args[idx]) + " ";
      }
      value += this.name;
      return value;
    };
    PDFOperator2.prototype.sizeInBytes = function() {
      var size = 0;
      for (var idx = 0, len = this.args.length; idx < len; idx++) {
        var arg = this.args[idx];
        size += (arg instanceof PDFObject ? arg.sizeInBytes() : arg.length) + 1;
      }
      size += this.name.length;
      return size;
    };
    PDFOperator2.prototype.copyBytesInto = function(buffer, offset) {
      var initialOffset = offset;
      for (var idx = 0, len = this.args.length; idx < len; idx++) {
        var arg = this.args[idx];
        if (arg instanceof PDFObject) {
          offset += arg.copyBytesInto(buffer, offset);
        } else {
          offset += copyStringIntoBuffer(arg, buffer, offset);
        }
        buffer[offset++] = CharCodes.Space;
      }
      offset += copyStringIntoBuffer(this.name, buffer, offset);
      return offset - initialOffset;
    };
    PDFOperator2.of = function(name, args) {
      return new PDFOperator2(name, args);
    };
    return PDFOperator2;
  })()
);
var PDFOperatorNames;
(function(PDFOperatorNames2) {
  PDFOperatorNames2["NonStrokingColor"] = "sc";
  PDFOperatorNames2["NonStrokingColorN"] = "scn";
  PDFOperatorNames2["NonStrokingColorRgb"] = "rg";
  PDFOperatorNames2["NonStrokingColorGray"] = "g";
  PDFOperatorNames2["NonStrokingColorCmyk"] = "k";
  PDFOperatorNames2["NonStrokingColorspace"] = "cs";
  PDFOperatorNames2["StrokingColor"] = "SC";
  PDFOperatorNames2["StrokingColorN"] = "SCN";
  PDFOperatorNames2["StrokingColorRgb"] = "RG";
  PDFOperatorNames2["StrokingColorGray"] = "G";
  PDFOperatorNames2["StrokingColorCmyk"] = "K";
  PDFOperatorNames2["StrokingColorspace"] = "CS";
  PDFOperatorNames2["BeginMarkedContentSequence"] = "BDC";
  PDFOperatorNames2["BeginMarkedContent"] = "BMC";
  PDFOperatorNames2["EndMarkedContent"] = "EMC";
  PDFOperatorNames2["MarkedContentPointWithProps"] = "DP";
  PDFOperatorNames2["MarkedContentPoint"] = "MP";
  PDFOperatorNames2["DrawObject"] = "Do";
  PDFOperatorNames2["ConcatTransformationMatrix"] = "cm";
  PDFOperatorNames2["PopGraphicsState"] = "Q";
  PDFOperatorNames2["PushGraphicsState"] = "q";
  PDFOperatorNames2["SetFlatness"] = "i";
  PDFOperatorNames2["SetGraphicsStateParams"] = "gs";
  PDFOperatorNames2["SetLineCapStyle"] = "J";
  PDFOperatorNames2["SetLineDashPattern"] = "d";
  PDFOperatorNames2["SetLineJoinStyle"] = "j";
  PDFOperatorNames2["SetLineMiterLimit"] = "M";
  PDFOperatorNames2["SetLineWidth"] = "w";
  PDFOperatorNames2["SetTextMatrix"] = "Tm";
  PDFOperatorNames2["SetRenderingIntent"] = "ri";
  PDFOperatorNames2["AppendRectangle"] = "re";
  PDFOperatorNames2["BeginInlineImage"] = "BI";
  PDFOperatorNames2["BeginInlineImageData"] = "ID";
  PDFOperatorNames2["EndInlineImage"] = "EI";
  PDFOperatorNames2["ClipEvenOdd"] = "W*";
  PDFOperatorNames2["ClipNonZero"] = "W";
  PDFOperatorNames2["CloseAndStroke"] = "s";
  PDFOperatorNames2["CloseFillEvenOddAndStroke"] = "b*";
  PDFOperatorNames2["CloseFillNonZeroAndStroke"] = "b";
  PDFOperatorNames2["ClosePath"] = "h";
  PDFOperatorNames2["AppendBezierCurve"] = "c";
  PDFOperatorNames2["CurveToReplicateFinalPoint"] = "y";
  PDFOperatorNames2["CurveToReplicateInitialPoint"] = "v";
  PDFOperatorNames2["EndPath"] = "n";
  PDFOperatorNames2["FillEvenOddAndStroke"] = "B*";
  PDFOperatorNames2["FillEvenOdd"] = "f*";
  PDFOperatorNames2["FillNonZeroAndStroke"] = "B";
  PDFOperatorNames2["FillNonZero"] = "f";
  PDFOperatorNames2["LegacyFillNonZero"] = "F";
  PDFOperatorNames2["LineTo"] = "l";
  PDFOperatorNames2["MoveTo"] = "m";
  PDFOperatorNames2["ShadingFill"] = "sh";
  PDFOperatorNames2["StrokePath"] = "S";
  PDFOperatorNames2["BeginText"] = "BT";
  PDFOperatorNames2["EndText"] = "ET";
  PDFOperatorNames2["MoveText"] = "Td";
  PDFOperatorNames2["MoveTextSetLeading"] = "TD";
  PDFOperatorNames2["NextLine"] = "T*";
  PDFOperatorNames2["SetCharacterSpacing"] = "Tc";
  PDFOperatorNames2["SetFontAndSize"] = "Tf";
  PDFOperatorNames2["SetTextHorizontalScaling"] = "Tz";
  PDFOperatorNames2["SetTextLineHeight"] = "TL";
  PDFOperatorNames2["SetTextRenderingMode"] = "Tr";
  PDFOperatorNames2["SetTextRise"] = "Ts";
  PDFOperatorNames2["SetWordSpacing"] = "Tw";
  PDFOperatorNames2["ShowText"] = "Tj";
  PDFOperatorNames2["ShowTextAdjusted"] = "TJ";
  PDFOperatorNames2["ShowTextLine"] = "'";
  PDFOperatorNames2["ShowTextLineAndSpace"] = '"';
  PDFOperatorNames2["Type3D0"] = "d0";
  PDFOperatorNames2["Type3D1"] = "d1";
  PDFOperatorNames2["BeginCompatibilitySection"] = "BX";
  PDFOperatorNames2["EndCompatibilitySection"] = "EX";
})(PDFOperatorNames || (PDFOperatorNames = {}));
var PDFFlateStream = (
  /** @class */
  (function(_super) {
    __extends(PDFFlateStream2, _super);
    function PDFFlateStream2(dict, encode) {
      var _this = _super.call(this, dict) || this;
      _this.computeContents = function() {
        var unencodedContents = _this.getUnencodedContents();
        return _this.encode ? pako.deflate(unencodedContents) : unencodedContents;
      };
      _this.encode = encode;
      if (encode)
        dict.set(PDFName.of("Filter"), PDFName.of("FlateDecode"));
      _this.contentsCache = Cache.populatedBy(_this.computeContents);
      return _this;
    }
    PDFFlateStream2.prototype.getContents = function() {
      return this.contentsCache.access();
    };
    PDFFlateStream2.prototype.getContentsSize = function() {
      return this.contentsCache.access().length;
    };
    PDFFlateStream2.prototype.getUnencodedContents = function() {
      throw new MethodNotImplementedError(this.constructor.name, "getUnencodedContents");
    };
    return PDFFlateStream2;
  })(PDFStream)
);
var PDFContentStream = (
  /** @class */
  (function(_super) {
    __extends(PDFContentStream2, _super);
    function PDFContentStream2(dict, operators, encode) {
      if (encode === void 0) {
        encode = true;
      }
      var _this = _super.call(this, dict, encode) || this;
      _this.operators = operators;
      return _this;
    }
    PDFContentStream2.prototype.push = function() {
      var _a;
      var operators = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        operators[_i] = arguments[_i];
      }
      (_a = this.operators).push.apply(_a, operators);
    };
    PDFContentStream2.prototype.clone = function(context) {
      var operators = new Array(this.operators.length);
      for (var idx = 0, len = this.operators.length; idx < len; idx++) {
        operators[idx] = this.operators[idx].clone(context);
      }
      var _a = this, dict = _a.dict, encode = _a.encode;
      return PDFContentStream2.of(dict.clone(context), operators, encode);
    };
    PDFContentStream2.prototype.getContentsString = function() {
      var value = "";
      for (var idx = 0, len = this.operators.length; idx < len; idx++) {
        value += this.operators[idx] + "\n";
      }
      return value;
    };
    PDFContentStream2.prototype.getUnencodedContents = function() {
      var buffer = new Uint8Array(this.getUnencodedContentsSize());
      var offset = 0;
      for (var idx = 0, len = this.operators.length; idx < len; idx++) {
        offset += this.operators[idx].copyBytesInto(buffer, offset);
        buffer[offset++] = CharCodes.Newline;
      }
      return buffer;
    };
    PDFContentStream2.prototype.getUnencodedContentsSize = function() {
      var size = 0;
      for (var idx = 0, len = this.operators.length; idx < len; idx++) {
        size += this.operators[idx].sizeInBytes() + 1;
      }
      return size;
    };
    PDFContentStream2.of = function(dict, operators, encode) {
      if (encode === void 0) {
        encode = true;
      }
      return new PDFContentStream2(dict, operators, encode);
    };
    return PDFContentStream2;
  })(PDFFlateStream)
);
var SimpleRNG = (
  /** @class */
  (function() {
    function SimpleRNG2(seed) {
      this.seed = seed;
    }
    SimpleRNG2.prototype.nextInt = function() {
      var x = Math.sin(this.seed++) * 1e4;
      return x - Math.floor(x);
    };
    SimpleRNG2.withSeed = function(seed) {
      return new SimpleRNG2(seed);
    };
    return SimpleRNG2;
  })()
);
var byAscendingObjectNumber = function(_a, _b) {
  var a = _a[0];
  var b = _b[0];
  return a.objectNumber - b.objectNumber;
};
var PDFContext = (
  /** @class */
  (function() {
    function PDFContext2() {
      this.largestObjectNumber = 0;
      this.header = PDFHeader.forVersion(1, 7);
      this.trailerInfo = {};
      this.indirectObjects = /* @__PURE__ */ new Map();
      this.rng = SimpleRNG.withSeed(1);
    }
    PDFContext2.prototype.assign = function(ref, object) {
      this.indirectObjects.set(ref, object);
      if (ref.objectNumber > this.largestObjectNumber) {
        this.largestObjectNumber = ref.objectNumber;
      }
    };
    PDFContext2.prototype.nextRef = function() {
      this.largestObjectNumber += 1;
      return PDFRef.of(this.largestObjectNumber);
    };
    PDFContext2.prototype.register = function(object) {
      var ref = this.nextRef();
      this.assign(ref, object);
      return ref;
    };
    PDFContext2.prototype.delete = function(ref) {
      return this.indirectObjects.delete(ref);
    };
    PDFContext2.prototype.lookupMaybe = function(ref) {
      var types = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        types[_i - 1] = arguments[_i];
      }
      var preservePDFNull = types.includes(PDFNull$1);
      var result = ref instanceof PDFRef ? this.indirectObjects.get(ref) : ref;
      if (!result || result === PDFNull$1 && !preservePDFNull)
        return void 0;
      for (var idx = 0, len = types.length; idx < len; idx++) {
        var type = types[idx];
        if (type === PDFNull$1) {
          if (result === PDFNull$1)
            return result;
        } else {
          if (result instanceof type)
            return result;
        }
      }
      throw new UnexpectedObjectTypeError(types, result);
    };
    PDFContext2.prototype.lookup = function(ref) {
      var types = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        types[_i - 1] = arguments[_i];
      }
      var result = ref instanceof PDFRef ? this.indirectObjects.get(ref) : ref;
      if (types.length === 0)
        return result;
      for (var idx = 0, len = types.length; idx < len; idx++) {
        var type = types[idx];
        if (type === PDFNull$1) {
          if (result === PDFNull$1)
            return result;
        } else {
          if (result instanceof type)
            return result;
        }
      }
      throw new UnexpectedObjectTypeError(types, result);
    };
    PDFContext2.prototype.getObjectRef = function(pdfObject) {
      var entries = Array.from(this.indirectObjects.entries());
      for (var idx = 0, len = entries.length; idx < len; idx++) {
        var _a = entries[idx], ref = _a[0], object = _a[1];
        if (object === pdfObject) {
          return ref;
        }
      }
      return void 0;
    };
    PDFContext2.prototype.enumerateIndirectObjects = function() {
      return Array.from(this.indirectObjects.entries()).sort(byAscendingObjectNumber);
    };
    PDFContext2.prototype.obj = function(literal) {
      if (literal instanceof PDFObject) {
        return literal;
      } else if (literal === null || literal === void 0) {
        return PDFNull$1;
      } else if (typeof literal === "string") {
        return PDFName.of(literal);
      } else if (typeof literal === "number") {
        return PDFNumber.of(literal);
      } else if (typeof literal === "boolean") {
        return literal ? PDFBool.True : PDFBool.False;
      } else if (Array.isArray(literal)) {
        var array = PDFArray.withContext(this);
        for (var idx = 0, len = literal.length; idx < len; idx++) {
          array.push(this.obj(literal[idx]));
        }
        return array;
      } else {
        var dict = PDFDict.withContext(this);
        var keys = Object.keys(literal);
        for (var idx = 0, len = keys.length; idx < len; idx++) {
          var key = keys[idx];
          var value = literal[key];
          if (value !== void 0)
            dict.set(PDFName.of(key), this.obj(value));
        }
        return dict;
      }
    };
    PDFContext2.prototype.stream = function(contents, dict) {
      if (dict === void 0) {
        dict = {};
      }
      return PDFRawStream.of(this.obj(dict), typedArrayFor(contents));
    };
    PDFContext2.prototype.flateStream = function(contents, dict) {
      if (dict === void 0) {
        dict = {};
      }
      return this.stream(pako.deflate(typedArrayFor(contents)), __assign(__assign({}, dict), { Filter: "FlateDecode" }));
    };
    PDFContext2.prototype.contentStream = function(operators, dict) {
      if (dict === void 0) {
        dict = {};
      }
      return PDFContentStream.of(this.obj(dict), operators);
    };
    PDFContext2.prototype.formXObject = function(operators, dict) {
      if (dict === void 0) {
        dict = {};
      }
      return this.contentStream(operators, __assign(__assign({ BBox: this.obj([0, 0, 0, 0]), Matrix: this.obj([1, 0, 0, 1, 0, 0]) }, dict), { Type: "XObject", Subtype: "Form" }));
    };
    PDFContext2.prototype.getPushGraphicsStateContentStream = function() {
      if (this.pushGraphicsStateContentStreamRef) {
        return this.pushGraphicsStateContentStreamRef;
      }
      var dict = this.obj({});
      var op = PDFOperator.of(PDFOperatorNames.PushGraphicsState);
      var stream2 = PDFContentStream.of(dict, [op]);
      this.pushGraphicsStateContentStreamRef = this.register(stream2);
      return this.pushGraphicsStateContentStreamRef;
    };
    PDFContext2.prototype.getPopGraphicsStateContentStream = function() {
      if (this.popGraphicsStateContentStreamRef) {
        return this.popGraphicsStateContentStreamRef;
      }
      var dict = this.obj({});
      var op = PDFOperator.of(PDFOperatorNames.PopGraphicsState);
      var stream2 = PDFContentStream.of(dict, [op]);
      this.popGraphicsStateContentStreamRef = this.register(stream2);
      return this.popGraphicsStateContentStreamRef;
    };
    PDFContext2.prototype.addRandomSuffix = function(prefix, suffixLength) {
      if (suffixLength === void 0) {
        suffixLength = 4;
      }
      return prefix + "-" + Math.floor(this.rng.nextInt() * Math.pow(10, suffixLength));
    };
    PDFContext2.create = function() {
      return new PDFContext2();
    };
    return PDFContext2;
  })()
);
var PDFPageLeaf = (
  /** @class */
  (function(_super) {
    __extends(PDFPageLeaf2, _super);
    function PDFPageLeaf2(map, context, autoNormalizeCTM) {
      if (autoNormalizeCTM === void 0) {
        autoNormalizeCTM = true;
      }
      var _this = _super.call(this, map, context) || this;
      _this.normalized = false;
      _this.autoNormalizeCTM = autoNormalizeCTM;
      return _this;
    }
    PDFPageLeaf2.prototype.clone = function(context) {
      var clone = PDFPageLeaf2.fromMapWithContext(/* @__PURE__ */ new Map(), context || this.context, this.autoNormalizeCTM);
      var entries = this.entries();
      for (var idx = 0, len = entries.length; idx < len; idx++) {
        var _a = entries[idx], key = _a[0], value = _a[1];
        clone.set(key, value);
      }
      return clone;
    };
    PDFPageLeaf2.prototype.Parent = function() {
      return this.lookupMaybe(PDFName.Parent, PDFDict);
    };
    PDFPageLeaf2.prototype.Contents = function() {
      return this.lookup(PDFName.of("Contents"));
    };
    PDFPageLeaf2.prototype.Annots = function() {
      return this.lookupMaybe(PDFName.Annots, PDFArray);
    };
    PDFPageLeaf2.prototype.BleedBox = function() {
      return this.lookupMaybe(PDFName.BleedBox, PDFArray);
    };
    PDFPageLeaf2.prototype.TrimBox = function() {
      return this.lookupMaybe(PDFName.TrimBox, PDFArray);
    };
    PDFPageLeaf2.prototype.ArtBox = function() {
      return this.lookupMaybe(PDFName.ArtBox, PDFArray);
    };
    PDFPageLeaf2.prototype.Resources = function() {
      var dictOrRef = this.getInheritableAttribute(PDFName.Resources);
      return this.context.lookupMaybe(dictOrRef, PDFDict);
    };
    PDFPageLeaf2.prototype.MediaBox = function() {
      var arrayOrRef = this.getInheritableAttribute(PDFName.MediaBox);
      return this.context.lookup(arrayOrRef, PDFArray);
    };
    PDFPageLeaf2.prototype.CropBox = function() {
      var arrayOrRef = this.getInheritableAttribute(PDFName.CropBox);
      return this.context.lookupMaybe(arrayOrRef, PDFArray);
    };
    PDFPageLeaf2.prototype.Rotate = function() {
      var numberOrRef = this.getInheritableAttribute(PDFName.Rotate);
      return this.context.lookupMaybe(numberOrRef, PDFNumber);
    };
    PDFPageLeaf2.prototype.getInheritableAttribute = function(name) {
      var attribute;
      this.ascend(function(node) {
        if (!attribute)
          attribute = node.get(name);
      });
      return attribute;
    };
    PDFPageLeaf2.prototype.setParent = function(parentRef) {
      this.set(PDFName.Parent, parentRef);
    };
    PDFPageLeaf2.prototype.addContentStream = function(contentStreamRef) {
      var Contents = this.normalizedEntries().Contents || this.context.obj([]);
      this.set(PDFName.Contents, Contents);
      Contents.push(contentStreamRef);
    };
    PDFPageLeaf2.prototype.wrapContentStreams = function(startStream, endStream) {
      var Contents = this.Contents();
      if (Contents instanceof PDFArray) {
        Contents.insert(0, startStream);
        Contents.push(endStream);
        return true;
      }
      return false;
    };
    PDFPageLeaf2.prototype.addAnnot = function(annotRef) {
      var Annots = this.normalizedEntries().Annots;
      Annots.push(annotRef);
    };
    PDFPageLeaf2.prototype.removeAnnot = function(annotRef) {
      var Annots = this.normalizedEntries().Annots;
      var index = Annots.indexOf(annotRef);
      if (index !== void 0) {
        Annots.remove(index);
      }
    };
    PDFPageLeaf2.prototype.setFontDictionary = function(name, fontDictRef) {
      var Font2 = this.normalizedEntries().Font;
      Font2.set(name, fontDictRef);
    };
    PDFPageLeaf2.prototype.newFontDictionaryKey = function(tag) {
      var Font2 = this.normalizedEntries().Font;
      return Font2.uniqueKey(tag);
    };
    PDFPageLeaf2.prototype.newFontDictionary = function(tag, fontDictRef) {
      var key = this.newFontDictionaryKey(tag);
      this.setFontDictionary(key, fontDictRef);
      return key;
    };
    PDFPageLeaf2.prototype.setXObject = function(name, xObjectRef) {
      var XObject = this.normalizedEntries().XObject;
      XObject.set(name, xObjectRef);
    };
    PDFPageLeaf2.prototype.newXObjectKey = function(tag) {
      var XObject = this.normalizedEntries().XObject;
      return XObject.uniqueKey(tag);
    };
    PDFPageLeaf2.prototype.newXObject = function(tag, xObjectRef) {
      var key = this.newXObjectKey(tag);
      this.setXObject(key, xObjectRef);
      return key;
    };
    PDFPageLeaf2.prototype.setExtGState = function(name, extGStateRef) {
      var ExtGState = this.normalizedEntries().ExtGState;
      ExtGState.set(name, extGStateRef);
    };
    PDFPageLeaf2.prototype.newExtGStateKey = function(tag) {
      var ExtGState = this.normalizedEntries().ExtGState;
      return ExtGState.uniqueKey(tag);
    };
    PDFPageLeaf2.prototype.newExtGState = function(tag, extGStateRef) {
      var key = this.newExtGStateKey(tag);
      this.setExtGState(key, extGStateRef);
      return key;
    };
    PDFPageLeaf2.prototype.ascend = function(visitor) {
      visitor(this);
      var Parent = this.Parent();
      if (Parent)
        Parent.ascend(visitor);
    };
    PDFPageLeaf2.prototype.normalize = function() {
      if (this.normalized)
        return;
      var context = this.context;
      var contentsRef = this.get(PDFName.Contents);
      var contents = this.context.lookup(contentsRef);
      if (contents instanceof PDFStream) {
        this.set(PDFName.Contents, context.obj([contentsRef]));
      }
      if (this.autoNormalizeCTM) {
        this.wrapContentStreams(this.context.getPushGraphicsStateContentStream(), this.context.getPopGraphicsStateContentStream());
      }
      var dictOrRef = this.getInheritableAttribute(PDFName.Resources);
      var Resources = context.lookupMaybe(dictOrRef, PDFDict) || context.obj({});
      this.set(PDFName.Resources, Resources);
      var Font2 = Resources.lookupMaybe(PDFName.Font, PDFDict) || context.obj({});
      Resources.set(PDFName.Font, Font2);
      var XObject = Resources.lookupMaybe(PDFName.XObject, PDFDict) || context.obj({});
      Resources.set(PDFName.XObject, XObject);
      var ExtGState = Resources.lookupMaybe(PDFName.ExtGState, PDFDict) || context.obj({});
      Resources.set(PDFName.ExtGState, ExtGState);
      var Annots = this.Annots() || context.obj([]);
      this.set(PDFName.Annots, Annots);
      this.normalized = true;
    };
    PDFPageLeaf2.prototype.normalizedEntries = function() {
      this.normalize();
      var Annots = this.Annots();
      var Resources = this.Resources();
      var Contents = this.Contents();
      return {
        Annots,
        Resources,
        Contents,
        Font: Resources.lookup(PDFName.Font, PDFDict),
        XObject: Resources.lookup(PDFName.XObject, PDFDict),
        ExtGState: Resources.lookup(PDFName.ExtGState, PDFDict)
      };
    };
    PDFPageLeaf2.InheritableEntries = [
      "Resources",
      "MediaBox",
      "CropBox",
      "Rotate"
    ];
    PDFPageLeaf2.withContextAndParent = function(context, parent) {
      var dict = /* @__PURE__ */ new Map();
      dict.set(PDFName.Type, PDFName.Page);
      dict.set(PDFName.Parent, parent);
      dict.set(PDFName.Resources, context.obj({}));
      dict.set(PDFName.MediaBox, context.obj([0, 0, 612, 792]));
      return new PDFPageLeaf2(dict, context, false);
    };
    PDFPageLeaf2.fromMapWithContext = function(map, context, autoNormalizeCTM) {
      if (autoNormalizeCTM === void 0) {
        autoNormalizeCTM = true;
      }
      return new PDFPageLeaf2(map, context, autoNormalizeCTM);
    };
    return PDFPageLeaf2;
  })(PDFDict)
);
var PDFObjectCopier = (
  /** @class */
  (function() {
    function PDFObjectCopier2(src, dest) {
      var _this = this;
      this.traversedObjects = /* @__PURE__ */ new Map();
      this.copy = function(object) {
        return object instanceof PDFPageLeaf ? _this.copyPDFPage(object) : object instanceof PDFDict ? _this.copyPDFDict(object) : object instanceof PDFArray ? _this.copyPDFArray(object) : object instanceof PDFStream ? _this.copyPDFStream(object) : object instanceof PDFRef ? _this.copyPDFIndirectObject(object) : object.clone();
      };
      this.copyPDFPage = function(originalPage) {
        var clonedPage = originalPage.clone();
        var InheritableEntries = PDFPageLeaf.InheritableEntries;
        for (var idx = 0, len = InheritableEntries.length; idx < len; idx++) {
          var key = PDFName.of(InheritableEntries[idx]);
          var value = clonedPage.getInheritableAttribute(key);
          if (!clonedPage.get(key) && value)
            clonedPage.set(key, value);
        }
        clonedPage.delete(PDFName.of("Parent"));
        return _this.copyPDFDict(clonedPage);
      };
      this.copyPDFDict = function(originalDict) {
        if (_this.traversedObjects.has(originalDict)) {
          return _this.traversedObjects.get(originalDict);
        }
        var clonedDict = originalDict.clone(_this.dest);
        _this.traversedObjects.set(originalDict, clonedDict);
        var entries = originalDict.entries();
        for (var idx = 0, len = entries.length; idx < len; idx++) {
          var _a = entries[idx], key = _a[0], value = _a[1];
          clonedDict.set(key, _this.copy(value));
        }
        return clonedDict;
      };
      this.copyPDFArray = function(originalArray) {
        if (_this.traversedObjects.has(originalArray)) {
          return _this.traversedObjects.get(originalArray);
        }
        var clonedArray = originalArray.clone(_this.dest);
        _this.traversedObjects.set(originalArray, clonedArray);
        for (var idx = 0, len = originalArray.size(); idx < len; idx++) {
          var value = originalArray.get(idx);
          clonedArray.set(idx, _this.copy(value));
        }
        return clonedArray;
      };
      this.copyPDFStream = function(originalStream) {
        if (_this.traversedObjects.has(originalStream)) {
          return _this.traversedObjects.get(originalStream);
        }
        var clonedStream = originalStream.clone(_this.dest);
        _this.traversedObjects.set(originalStream, clonedStream);
        var entries = originalStream.dict.entries();
        for (var idx = 0, len = entries.length; idx < len; idx++) {
          var _a = entries[idx], key = _a[0], value = _a[1];
          clonedStream.dict.set(key, _this.copy(value));
        }
        return clonedStream;
      };
      this.copyPDFIndirectObject = function(ref) {
        var alreadyMapped = _this.traversedObjects.has(ref);
        if (!alreadyMapped) {
          var newRef = _this.dest.nextRef();
          _this.traversedObjects.set(ref, newRef);
          var dereferencedValue = _this.src.lookup(ref);
          if (dereferencedValue) {
            var cloned = _this.copy(dereferencedValue);
            _this.dest.assign(newRef, cloned);
          }
        }
        return _this.traversedObjects.get(ref);
      };
      this.src = src;
      this.dest = dest;
    }
    PDFObjectCopier2.for = function(src, dest) {
      return new PDFObjectCopier2(src, dest);
    };
    return PDFObjectCopier2;
  })()
);
var PDFCrossRefSection = (
  /** @class */
  (function() {
    function PDFCrossRefSection2(firstEntry) {
      this.subsections = firstEntry ? [[firstEntry]] : [];
      this.chunkIdx = 0;
      this.chunkLength = firstEntry ? 1 : 0;
    }
    PDFCrossRefSection2.prototype.addEntry = function(ref, offset) {
      this.append({ ref, offset, deleted: false });
    };
    PDFCrossRefSection2.prototype.addDeletedEntry = function(ref, nextFreeObjectNumber) {
      this.append({ ref, offset: nextFreeObjectNumber, deleted: true });
    };
    PDFCrossRefSection2.prototype.toString = function() {
      var section = "xref\n";
      for (var rangeIdx = 0, rangeLen = this.subsections.length; rangeIdx < rangeLen; rangeIdx++) {
        var range2 = this.subsections[rangeIdx];
        section += range2[0].ref.objectNumber + " " + range2.length + "\n";
        for (var entryIdx = 0, entryLen = range2.length; entryIdx < entryLen; entryIdx++) {
          var entry = range2[entryIdx];
          section += padStart(String(entry.offset), 10, "0");
          section += " ";
          section += padStart(String(entry.ref.generationNumber), 5, "0");
          section += " ";
          section += entry.deleted ? "f" : "n";
          section += " \n";
        }
      }
      return section;
    };
    PDFCrossRefSection2.prototype.sizeInBytes = function() {
      var size = 5;
      for (var idx = 0, len = this.subsections.length; idx < len; idx++) {
        var subsection = this.subsections[idx];
        var subsectionLength = subsection.length;
        var firstEntry = subsection[0];
        size += 2;
        size += String(firstEntry.ref.objectNumber).length;
        size += String(subsectionLength).length;
        size += 20 * subsectionLength;
      }
      return size;
    };
    PDFCrossRefSection2.prototype.copyBytesInto = function(buffer, offset) {
      var initialOffset = offset;
      buffer[offset++] = CharCodes.x;
      buffer[offset++] = CharCodes.r;
      buffer[offset++] = CharCodes.e;
      buffer[offset++] = CharCodes.f;
      buffer[offset++] = CharCodes.Newline;
      offset += this.copySubsectionsIntoBuffer(this.subsections, buffer, offset);
      return offset - initialOffset;
    };
    PDFCrossRefSection2.prototype.copySubsectionsIntoBuffer = function(subsections, buffer, offset) {
      var initialOffset = offset;
      var length = subsections.length;
      for (var idx = 0; idx < length; idx++) {
        var subsection = this.subsections[idx];
        var firstObjectNumber = String(subsection[0].ref.objectNumber);
        offset += copyStringIntoBuffer(firstObjectNumber, buffer, offset);
        buffer[offset++] = CharCodes.Space;
        var rangeLength = String(subsection.length);
        offset += copyStringIntoBuffer(rangeLength, buffer, offset);
        buffer[offset++] = CharCodes.Newline;
        offset += this.copyEntriesIntoBuffer(subsection, buffer, offset);
      }
      return offset - initialOffset;
    };
    PDFCrossRefSection2.prototype.copyEntriesIntoBuffer = function(entries, buffer, offset) {
      var length = entries.length;
      for (var idx = 0; idx < length; idx++) {
        var entry = entries[idx];
        var entryOffset = padStart(String(entry.offset), 10, "0");
        offset += copyStringIntoBuffer(entryOffset, buffer, offset);
        buffer[offset++] = CharCodes.Space;
        var entryGen = padStart(String(entry.ref.generationNumber), 5, "0");
        offset += copyStringIntoBuffer(entryGen, buffer, offset);
        buffer[offset++] = CharCodes.Space;
        buffer[offset++] = entry.deleted ? CharCodes.f : CharCodes.n;
        buffer[offset++] = CharCodes.Space;
        buffer[offset++] = CharCodes.Newline;
      }
      return 20 * length;
    };
    PDFCrossRefSection2.prototype.append = function(currEntry) {
      if (this.chunkLength === 0) {
        this.subsections.push([currEntry]);
        this.chunkIdx = 0;
        this.chunkLength = 1;
        return;
      }
      var chunk = this.subsections[this.chunkIdx];
      var prevEntry = chunk[this.chunkLength - 1];
      if (currEntry.ref.objectNumber - prevEntry.ref.objectNumber > 1) {
        this.subsections.push([currEntry]);
        this.chunkIdx += 1;
        this.chunkLength = 1;
      } else {
        chunk.push(currEntry);
        this.chunkLength += 1;
      }
    };
    PDFCrossRefSection2.create = function() {
      return new PDFCrossRefSection2({
        ref: PDFRef.of(0, 65535),
        offset: 0,
        deleted: true
      });
    };
    PDFCrossRefSection2.createEmpty = function() {
      return new PDFCrossRefSection2();
    };
    return PDFCrossRefSection2;
  })()
);
var PDFTrailer = (
  /** @class */
  (function() {
    function PDFTrailer2(lastXRefOffset) {
      this.lastXRefOffset = String(lastXRefOffset);
    }
    PDFTrailer2.prototype.toString = function() {
      return "startxref\n" + this.lastXRefOffset + "\n%%EOF";
    };
    PDFTrailer2.prototype.sizeInBytes = function() {
      return 16 + this.lastXRefOffset.length;
    };
    PDFTrailer2.prototype.copyBytesInto = function(buffer, offset) {
      var initialOffset = offset;
      buffer[offset++] = CharCodes.s;
      buffer[offset++] = CharCodes.t;
      buffer[offset++] = CharCodes.a;
      buffer[offset++] = CharCodes.r;
      buffer[offset++] = CharCodes.t;
      buffer[offset++] = CharCodes.x;
      buffer[offset++] = CharCodes.r;
      buffer[offset++] = CharCodes.e;
      buffer[offset++] = CharCodes.f;
      buffer[offset++] = CharCodes.Newline;
      offset += copyStringIntoBuffer(this.lastXRefOffset, buffer, offset);
      buffer[offset++] = CharCodes.Newline;
      buffer[offset++] = CharCodes.Percent;
      buffer[offset++] = CharCodes.Percent;
      buffer[offset++] = CharCodes.E;
      buffer[offset++] = CharCodes.O;
      buffer[offset++] = CharCodes.F;
      return offset - initialOffset;
    };
    PDFTrailer2.forLastCrossRefSectionOffset = function(offset) {
      return new PDFTrailer2(offset);
    };
    return PDFTrailer2;
  })()
);
var PDFTrailerDict = (
  /** @class */
  (function() {
    function PDFTrailerDict2(dict) {
      this.dict = dict;
    }
    PDFTrailerDict2.prototype.toString = function() {
      return "trailer\n" + this.dict.toString();
    };
    PDFTrailerDict2.prototype.sizeInBytes = function() {
      return 8 + this.dict.sizeInBytes();
    };
    PDFTrailerDict2.prototype.copyBytesInto = function(buffer, offset) {
      var initialOffset = offset;
      buffer[offset++] = CharCodes.t;
      buffer[offset++] = CharCodes.r;
      buffer[offset++] = CharCodes.a;
      buffer[offset++] = CharCodes.i;
      buffer[offset++] = CharCodes.l;
      buffer[offset++] = CharCodes.e;
      buffer[offset++] = CharCodes.r;
      buffer[offset++] = CharCodes.Newline;
      offset += this.dict.copyBytesInto(buffer, offset);
      return offset - initialOffset;
    };
    PDFTrailerDict2.of = function(dict) {
      return new PDFTrailerDict2(dict);
    };
    return PDFTrailerDict2;
  })()
);
var PDFObjectStream = (
  /** @class */
  (function(_super) {
    __extends(PDFObjectStream2, _super);
    function PDFObjectStream2(context, objects, encode) {
      if (encode === void 0) {
        encode = true;
      }
      var _this = _super.call(this, context.obj({}), encode) || this;
      _this.objects = objects;
      _this.offsets = _this.computeObjectOffsets();
      _this.offsetsString = _this.computeOffsetsString();
      _this.dict.set(PDFName.of("Type"), PDFName.of("ObjStm"));
      _this.dict.set(PDFName.of("N"), PDFNumber.of(_this.objects.length));
      _this.dict.set(PDFName.of("First"), PDFNumber.of(_this.offsetsString.length));
      return _this;
    }
    PDFObjectStream2.prototype.getObjectsCount = function() {
      return this.objects.length;
    };
    PDFObjectStream2.prototype.clone = function(context) {
      return PDFObjectStream2.withContextAndObjects(context || this.dict.context, this.objects.slice(), this.encode);
    };
    PDFObjectStream2.prototype.getContentsString = function() {
      var value = this.offsetsString;
      for (var idx = 0, len = this.objects.length; idx < len; idx++) {
        var _a = this.objects[idx], object = _a[1];
        value += object + "\n";
      }
      return value;
    };
    PDFObjectStream2.prototype.getUnencodedContents = function() {
      var buffer = new Uint8Array(this.getUnencodedContentsSize());
      var offset = copyStringIntoBuffer(this.offsetsString, buffer, 0);
      for (var idx = 0, len = this.objects.length; idx < len; idx++) {
        var _a = this.objects[idx], object = _a[1];
        offset += object.copyBytesInto(buffer, offset);
        buffer[offset++] = CharCodes.Newline;
      }
      return buffer;
    };
    PDFObjectStream2.prototype.getUnencodedContentsSize = function() {
      return this.offsetsString.length + last(this.offsets)[1] + last(this.objects)[1].sizeInBytes() + 1;
    };
    PDFObjectStream2.prototype.computeOffsetsString = function() {
      var offsetsString = "";
      for (var idx = 0, len = this.offsets.length; idx < len; idx++) {
        var _a = this.offsets[idx], objectNumber = _a[0], offset = _a[1];
        offsetsString += objectNumber + " " + offset + " ";
      }
      return offsetsString;
    };
    PDFObjectStream2.prototype.computeObjectOffsets = function() {
      var offset = 0;
      var offsets = new Array(this.objects.length);
      for (var idx = 0, len = this.objects.length; idx < len; idx++) {
        var _a = this.objects[idx], ref = _a[0], object = _a[1];
        offsets[idx] = [ref.objectNumber, offset];
        offset += object.sizeInBytes() + 1;
      }
      return offsets;
    };
    PDFObjectStream2.withContextAndObjects = function(context, objects, encode) {
      if (encode === void 0) {
        encode = true;
      }
      return new PDFObjectStream2(context, objects, encode);
    };
    return PDFObjectStream2;
  })(PDFFlateStream)
);
var PDFWriter = (
  /** @class */
  (function() {
    function PDFWriter2(context, objectsPerTick) {
      var _this = this;
      this.parsedObjects = 0;
      this.shouldWaitForTick = function(n) {
        _this.parsedObjects += n;
        return _this.parsedObjects % _this.objectsPerTick === 0;
      };
      this.context = context;
      this.objectsPerTick = objectsPerTick;
    }
    PDFWriter2.prototype.serializeToBuffer = function() {
      return __awaiter(this, void 0, void 0, function() {
        var _a, size, header, indirectObjects, xref, trailerDict, trailer, offset, buffer, idx, len, _b, ref, object, objectNumber, generationNumber, n;
        return __generator(this, function(_c) {
          switch (_c.label) {
            case 0:
              return [4, this.computeBufferSize()];
            case 1:
              _a = _c.sent(), size = _a.size, header = _a.header, indirectObjects = _a.indirectObjects, xref = _a.xref, trailerDict = _a.trailerDict, trailer = _a.trailer;
              offset = 0;
              buffer = new Uint8Array(size);
              offset += header.copyBytesInto(buffer, offset);
              buffer[offset++] = CharCodes.Newline;
              buffer[offset++] = CharCodes.Newline;
              idx = 0, len = indirectObjects.length;
              _c.label = 2;
            case 2:
              if (!(idx < len)) return [3, 5];
              _b = indirectObjects[idx], ref = _b[0], object = _b[1];
              objectNumber = String(ref.objectNumber);
              offset += copyStringIntoBuffer(objectNumber, buffer, offset);
              buffer[offset++] = CharCodes.Space;
              generationNumber = String(ref.generationNumber);
              offset += copyStringIntoBuffer(generationNumber, buffer, offset);
              buffer[offset++] = CharCodes.Space;
              buffer[offset++] = CharCodes.o;
              buffer[offset++] = CharCodes.b;
              buffer[offset++] = CharCodes.j;
              buffer[offset++] = CharCodes.Newline;
              offset += object.copyBytesInto(buffer, offset);
              buffer[offset++] = CharCodes.Newline;
              buffer[offset++] = CharCodes.e;
              buffer[offset++] = CharCodes.n;
              buffer[offset++] = CharCodes.d;
              buffer[offset++] = CharCodes.o;
              buffer[offset++] = CharCodes.b;
              buffer[offset++] = CharCodes.j;
              buffer[offset++] = CharCodes.Newline;
              buffer[offset++] = CharCodes.Newline;
              n = object instanceof PDFObjectStream ? object.getObjectsCount() : 1;
              if (!this.shouldWaitForTick(n)) return [3, 4];
              return [4, waitForTick()];
            case 3:
              _c.sent();
              _c.label = 4;
            case 4:
              idx++;
              return [3, 2];
            case 5:
              if (xref) {
                offset += xref.copyBytesInto(buffer, offset);
                buffer[offset++] = CharCodes.Newline;
              }
              if (trailerDict) {
                offset += trailerDict.copyBytesInto(buffer, offset);
                buffer[offset++] = CharCodes.Newline;
                buffer[offset++] = CharCodes.Newline;
              }
              offset += trailer.copyBytesInto(buffer, offset);
              return [2, buffer];
          }
        });
      });
    };
    PDFWriter2.prototype.computeIndirectObjectSize = function(_a) {
      var ref = _a[0], object = _a[1];
      var refSize = ref.sizeInBytes() + 3;
      var objectSize = object.sizeInBytes() + 9;
      return refSize + objectSize;
    };
    PDFWriter2.prototype.createTrailerDict = function() {
      return this.context.obj({
        Size: this.context.largestObjectNumber + 1,
        Root: this.context.trailerInfo.Root,
        Encrypt: this.context.trailerInfo.Encrypt,
        Info: this.context.trailerInfo.Info,
        ID: this.context.trailerInfo.ID
      });
    };
    PDFWriter2.prototype.computeBufferSize = function() {
      return __awaiter(this, void 0, void 0, function() {
        var header, size, xref, indirectObjects, idx, len, indirectObject, ref, xrefOffset, trailerDict, trailer;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              header = PDFHeader.forVersion(1, 7);
              size = header.sizeInBytes() + 2;
              xref = PDFCrossRefSection.create();
              indirectObjects = this.context.enumerateIndirectObjects();
              idx = 0, len = indirectObjects.length;
              _a.label = 1;
            case 1:
              if (!(idx < len)) return [3, 4];
              indirectObject = indirectObjects[idx];
              ref = indirectObject[0];
              xref.addEntry(ref, size);
              size += this.computeIndirectObjectSize(indirectObject);
              if (!this.shouldWaitForTick(1)) return [3, 3];
              return [4, waitForTick()];
            case 2:
              _a.sent();
              _a.label = 3;
            case 3:
              idx++;
              return [3, 1];
            case 4:
              xrefOffset = size;
              size += xref.sizeInBytes() + 1;
              trailerDict = PDFTrailerDict.of(this.createTrailerDict());
              size += trailerDict.sizeInBytes() + 2;
              trailer = PDFTrailer.forLastCrossRefSectionOffset(xrefOffset);
              size += trailer.sizeInBytes();
              return [2, { size, header, indirectObjects, xref, trailerDict, trailer }];
          }
        });
      });
    };
    PDFWriter2.forContext = function(context, objectsPerTick) {
      return new PDFWriter2(context, objectsPerTick);
    };
    return PDFWriter2;
  })()
);
var PDFInvalidObject = (
  /** @class */
  (function(_super) {
    __extends(PDFInvalidObject2, _super);
    function PDFInvalidObject2(data) {
      var _this = _super.call(this) || this;
      _this.data = data;
      return _this;
    }
    PDFInvalidObject2.prototype.clone = function() {
      return PDFInvalidObject2.of(this.data.slice());
    };
    PDFInvalidObject2.prototype.toString = function() {
      return "PDFInvalidObject(" + this.data.length + " bytes)";
    };
    PDFInvalidObject2.prototype.sizeInBytes = function() {
      return this.data.length;
    };
    PDFInvalidObject2.prototype.copyBytesInto = function(buffer, offset) {
      var length = this.data.length;
      for (var idx = 0; idx < length; idx++) {
        buffer[offset++] = this.data[idx];
      }
      return length;
    };
    PDFInvalidObject2.of = function(data) {
      return new PDFInvalidObject2(data);
    };
    return PDFInvalidObject2;
  })(PDFObject)
);
var EntryType;
(function(EntryType2) {
  EntryType2[EntryType2["Deleted"] = 0] = "Deleted";
  EntryType2[EntryType2["Uncompressed"] = 1] = "Uncompressed";
  EntryType2[EntryType2["Compressed"] = 2] = "Compressed";
})(EntryType || (EntryType = {}));
var PDFCrossRefStream = (
  /** @class */
  (function(_super) {
    __extends(PDFCrossRefStream2, _super);
    function PDFCrossRefStream2(dict, entries, encode) {
      if (encode === void 0) {
        encode = true;
      }
      var _this = _super.call(this, dict, encode) || this;
      _this.computeIndex = function() {
        var subsections = [];
        var subsectionLength = 0;
        for (var idx = 0, len = _this.entries.length; idx < len; idx++) {
          var currEntry = _this.entries[idx];
          var prevEntry = _this.entries[idx - 1];
          if (idx === 0) {
            subsections.push(currEntry.ref.objectNumber);
          } else if (currEntry.ref.objectNumber - prevEntry.ref.objectNumber > 1) {
            subsections.push(subsectionLength);
            subsections.push(currEntry.ref.objectNumber);
            subsectionLength = 0;
          }
          subsectionLength += 1;
        }
        subsections.push(subsectionLength);
        return subsections;
      };
      _this.computeEntryTuples = function() {
        var entryTuples = new Array(_this.entries.length);
        for (var idx = 0, len = _this.entries.length; idx < len; idx++) {
          var entry = _this.entries[idx];
          if (entry.type === EntryType.Deleted) {
            var type = entry.type, nextFreeObjectNumber = entry.nextFreeObjectNumber, ref = entry.ref;
            entryTuples[idx] = [type, nextFreeObjectNumber, ref.generationNumber];
          }
          if (entry.type === EntryType.Uncompressed) {
            var type = entry.type, offset = entry.offset, ref = entry.ref;
            entryTuples[idx] = [type, offset, ref.generationNumber];
          }
          if (entry.type === EntryType.Compressed) {
            var type = entry.type, objectStreamRef = entry.objectStreamRef, index = entry.index;
            entryTuples[idx] = [type, objectStreamRef.objectNumber, index];
          }
        }
        return entryTuples;
      };
      _this.computeMaxEntryByteWidths = function() {
        var entryTuples = _this.entryTuplesCache.access();
        var widths = [0, 0, 0];
        for (var idx = 0, len = entryTuples.length; idx < len; idx++) {
          var _a = entryTuples[idx], first = _a[0], second = _a[1], third = _a[2];
          var firstSize = sizeInBytes(first);
          var secondSize = sizeInBytes(second);
          var thirdSize = sizeInBytes(third);
          if (firstSize > widths[0])
            widths[0] = firstSize;
          if (secondSize > widths[1])
            widths[1] = secondSize;
          if (thirdSize > widths[2])
            widths[2] = thirdSize;
        }
        return widths;
      };
      _this.entries = entries || [];
      _this.entryTuplesCache = Cache.populatedBy(_this.computeEntryTuples);
      _this.maxByteWidthsCache = Cache.populatedBy(_this.computeMaxEntryByteWidths);
      _this.indexCache = Cache.populatedBy(_this.computeIndex);
      dict.set(PDFName.of("Type"), PDFName.of("XRef"));
      return _this;
    }
    PDFCrossRefStream2.prototype.addDeletedEntry = function(ref, nextFreeObjectNumber) {
      var type = EntryType.Deleted;
      this.entries.push({ type, ref, nextFreeObjectNumber });
      this.entryTuplesCache.invalidate();
      this.maxByteWidthsCache.invalidate();
      this.indexCache.invalidate();
      this.contentsCache.invalidate();
    };
    PDFCrossRefStream2.prototype.addUncompressedEntry = function(ref, offset) {
      var type = EntryType.Uncompressed;
      this.entries.push({ type, ref, offset });
      this.entryTuplesCache.invalidate();
      this.maxByteWidthsCache.invalidate();
      this.indexCache.invalidate();
      this.contentsCache.invalidate();
    };
    PDFCrossRefStream2.prototype.addCompressedEntry = function(ref, objectStreamRef, index) {
      var type = EntryType.Compressed;
      this.entries.push({ type, ref, objectStreamRef, index });
      this.entryTuplesCache.invalidate();
      this.maxByteWidthsCache.invalidate();
      this.indexCache.invalidate();
      this.contentsCache.invalidate();
    };
    PDFCrossRefStream2.prototype.clone = function(context) {
      var _a = this, dict = _a.dict, entries = _a.entries, encode = _a.encode;
      return PDFCrossRefStream2.of(dict.clone(context), entries.slice(), encode);
    };
    PDFCrossRefStream2.prototype.getContentsString = function() {
      var entryTuples = this.entryTuplesCache.access();
      var byteWidths = this.maxByteWidthsCache.access();
      var value = "";
      for (var entryIdx = 0, entriesLen = entryTuples.length; entryIdx < entriesLen; entryIdx++) {
        var _a = entryTuples[entryIdx], first = _a[0], second = _a[1], third = _a[2];
        var firstBytes = reverseArray(bytesFor(first));
        var secondBytes = reverseArray(bytesFor(second));
        var thirdBytes = reverseArray(bytesFor(third));
        for (var idx = byteWidths[0] - 1; idx >= 0; idx--) {
          value += (firstBytes[idx] || 0).toString(2);
        }
        for (var idx = byteWidths[1] - 1; idx >= 0; idx--) {
          value += (secondBytes[idx] || 0).toString(2);
        }
        for (var idx = byteWidths[2] - 1; idx >= 0; idx--) {
          value += (thirdBytes[idx] || 0).toString(2);
        }
      }
      return value;
    };
    PDFCrossRefStream2.prototype.getUnencodedContents = function() {
      var entryTuples = this.entryTuplesCache.access();
      var byteWidths = this.maxByteWidthsCache.access();
      var buffer = new Uint8Array(this.getUnencodedContentsSize());
      var offset = 0;
      for (var entryIdx = 0, entriesLen = entryTuples.length; entryIdx < entriesLen; entryIdx++) {
        var _a = entryTuples[entryIdx], first = _a[0], second = _a[1], third = _a[2];
        var firstBytes = reverseArray(bytesFor(first));
        var secondBytes = reverseArray(bytesFor(second));
        var thirdBytes = reverseArray(bytesFor(third));
        for (var idx = byteWidths[0] - 1; idx >= 0; idx--) {
          buffer[offset++] = firstBytes[idx] || 0;
        }
        for (var idx = byteWidths[1] - 1; idx >= 0; idx--) {
          buffer[offset++] = secondBytes[idx] || 0;
        }
        for (var idx = byteWidths[2] - 1; idx >= 0; idx--) {
          buffer[offset++] = thirdBytes[idx] || 0;
        }
      }
      return buffer;
    };
    PDFCrossRefStream2.prototype.getUnencodedContentsSize = function() {
      var byteWidths = this.maxByteWidthsCache.access();
      var entryWidth = sum(byteWidths);
      return entryWidth * this.entries.length;
    };
    PDFCrossRefStream2.prototype.updateDict = function() {
      _super.prototype.updateDict.call(this);
      var byteWidths = this.maxByteWidthsCache.access();
      var index = this.indexCache.access();
      var context = this.dict.context;
      this.dict.set(PDFName.of("W"), context.obj(byteWidths));
      this.dict.set(PDFName.of("Index"), context.obj(index));
    };
    PDFCrossRefStream2.create = function(dict, encode) {
      if (encode === void 0) {
        encode = true;
      }
      var stream2 = new PDFCrossRefStream2(dict, [], encode);
      stream2.addDeletedEntry(PDFRef.of(0, 65535), 0);
      return stream2;
    };
    PDFCrossRefStream2.of = function(dict, entries, encode) {
      if (encode === void 0) {
        encode = true;
      }
      return new PDFCrossRefStream2(dict, entries, encode);
    };
    return PDFCrossRefStream2;
  })(PDFFlateStream)
);
var PDFStreamWriter = (
  /** @class */
  (function(_super) {
    __extends(PDFStreamWriter2, _super);
    function PDFStreamWriter2(context, objectsPerTick, encodeStreams, objectsPerStream) {
      var _this = _super.call(this, context, objectsPerTick) || this;
      _this.encodeStreams = encodeStreams;
      _this.objectsPerStream = objectsPerStream;
      return _this;
    }
    PDFStreamWriter2.prototype.computeBufferSize = function() {
      return __awaiter(this, void 0, void 0, function() {
        var objectNumber, header, size, xrefStream, uncompressedObjects, compressedObjects, objectStreamRefs, indirectObjects, idx, len, indirectObject, ref, object, shouldNotCompress, chunk, objectStreamRef, idx, len, chunk, ref, objectStream, xrefStreamRef, xrefOffset, trailer;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              objectNumber = this.context.largestObjectNumber + 1;
              header = PDFHeader.forVersion(1, 7);
              size = header.sizeInBytes() + 2;
              xrefStream = PDFCrossRefStream.create(this.createTrailerDict(), this.encodeStreams);
              uncompressedObjects = [];
              compressedObjects = [];
              objectStreamRefs = [];
              indirectObjects = this.context.enumerateIndirectObjects();
              idx = 0, len = indirectObjects.length;
              _a.label = 1;
            case 1:
              if (!(idx < len)) return [3, 6];
              indirectObject = indirectObjects[idx];
              ref = indirectObject[0], object = indirectObject[1];
              shouldNotCompress = ref === this.context.trailerInfo.Encrypt || object instanceof PDFStream || object instanceof PDFInvalidObject || ref.generationNumber !== 0;
              if (!shouldNotCompress) return [3, 4];
              uncompressedObjects.push(indirectObject);
              xrefStream.addUncompressedEntry(ref, size);
              size += this.computeIndirectObjectSize(indirectObject);
              if (!this.shouldWaitForTick(1)) return [3, 3];
              return [4, waitForTick()];
            case 2:
              _a.sent();
              _a.label = 3;
            case 3:
              return [3, 5];
            case 4:
              chunk = last(compressedObjects);
              objectStreamRef = last(objectStreamRefs);
              if (!chunk || chunk.length % this.objectsPerStream === 0) {
                chunk = [];
                compressedObjects.push(chunk);
                objectStreamRef = PDFRef.of(objectNumber++);
                objectStreamRefs.push(objectStreamRef);
              }
              xrefStream.addCompressedEntry(ref, objectStreamRef, chunk.length);
              chunk.push(indirectObject);
              _a.label = 5;
            case 5:
              idx++;
              return [3, 1];
            case 6:
              idx = 0, len = compressedObjects.length;
              _a.label = 7;
            case 7:
              if (!(idx < len)) return [3, 10];
              chunk = compressedObjects[idx];
              ref = objectStreamRefs[idx];
              objectStream = PDFObjectStream.withContextAndObjects(this.context, chunk, this.encodeStreams);
              xrefStream.addUncompressedEntry(ref, size);
              size += this.computeIndirectObjectSize([ref, objectStream]);
              uncompressedObjects.push([ref, objectStream]);
              if (!this.shouldWaitForTick(chunk.length)) return [3, 9];
              return [4, waitForTick()];
            case 8:
              _a.sent();
              _a.label = 9;
            case 9:
              idx++;
              return [3, 7];
            case 10:
              xrefStreamRef = PDFRef.of(objectNumber++);
              xrefStream.dict.set(PDFName.of("Size"), PDFNumber.of(objectNumber));
              xrefStream.addUncompressedEntry(xrefStreamRef, size);
              xrefOffset = size;
              size += this.computeIndirectObjectSize([xrefStreamRef, xrefStream]);
              uncompressedObjects.push([xrefStreamRef, xrefStream]);
              trailer = PDFTrailer.forLastCrossRefSectionOffset(xrefOffset);
              size += trailer.sizeInBytes();
              return [2, { size, header, indirectObjects: uncompressedObjects, trailer }];
          }
        });
      });
    };
    PDFStreamWriter2.forContext = function(context, objectsPerTick, encodeStreams, objectsPerStream) {
      if (encodeStreams === void 0) {
        encodeStreams = true;
      }
      if (objectsPerStream === void 0) {
        objectsPerStream = 50;
      }
      return new PDFStreamWriter2(context, objectsPerTick, encodeStreams, objectsPerStream);
    };
    return PDFStreamWriter2;
  })(PDFWriter)
);
var PDFHexString = (
  /** @class */
  (function(_super) {
    __extends(PDFHexString2, _super);
    function PDFHexString2(value) {
      var _this = _super.call(this) || this;
      _this.value = value;
      return _this;
    }
    PDFHexString2.prototype.asBytes = function() {
      var hex = this.value + (this.value.length % 2 === 1 ? "0" : "");
      var hexLength = hex.length;
      var bytes = new Uint8Array(hex.length / 2);
      var hexOffset = 0;
      var bytesOffset = 0;
      while (hexOffset < hexLength) {
        var byte = parseInt(hex.substring(hexOffset, hexOffset + 2), 16);
        bytes[bytesOffset] = byte;
        hexOffset += 2;
        bytesOffset += 1;
      }
      return bytes;
    };
    PDFHexString2.prototype.decodeText = function() {
      var bytes = this.asBytes();
      if (hasUtf16BOM(bytes))
        return utf16Decode(bytes);
      return pdfDocEncodingDecode(bytes);
    };
    PDFHexString2.prototype.decodeDate = function() {
      var text = this.decodeText();
      var date = parseDate(text);
      if (!date)
        throw new InvalidPDFDateStringError(text);
      return date;
    };
    PDFHexString2.prototype.asString = function() {
      return this.value;
    };
    PDFHexString2.prototype.clone = function() {
      return PDFHexString2.of(this.value);
    };
    PDFHexString2.prototype.toString = function() {
      return "<" + this.value + ">";
    };
    PDFHexString2.prototype.sizeInBytes = function() {
      return this.value.length + 2;
    };
    PDFHexString2.prototype.copyBytesInto = function(buffer, offset) {
      buffer[offset++] = CharCodes.LessThan;
      offset += copyStringIntoBuffer(this.value, buffer, offset);
      buffer[offset++] = CharCodes.GreaterThan;
      return this.value.length + 2;
    };
    PDFHexString2.of = function(value) {
      return new PDFHexString2(value);
    };
    PDFHexString2.fromText = function(value) {
      var encoded = utf16Encode(value);
      var hex = "";
      for (var idx = 0, len = encoded.length; idx < len; idx++) {
        hex += toHexStringOfMinLength(encoded[idx], 4);
      }
      return new PDFHexString2(hex);
    };
    return PDFHexString2;
  })(PDFObject)
);
var StandardFontEmbedder = (
  /** @class */
  (function() {
    function StandardFontEmbedder2(fontName, customName) {
      this.encoding = fontName === FontNames.ZapfDingbats ? Encodings.ZapfDingbats : fontName === FontNames.Symbol ? Encodings.Symbol : Encodings.WinAnsi;
      this.font = Font.load(fontName);
      this.fontName = this.font.FontName;
      this.customName = customName;
    }
    StandardFontEmbedder2.prototype.encodeText = function(text) {
      var glyphs = this.encodeTextAsGlyphs(text);
      var hexCodes = new Array(glyphs.length);
      for (var idx = 0, len = glyphs.length; idx < len; idx++) {
        hexCodes[idx] = toHexString(glyphs[idx].code);
      }
      return PDFHexString.of(hexCodes.join(""));
    };
    StandardFontEmbedder2.prototype.widthOfTextAtSize = function(text, size) {
      var glyphs = this.encodeTextAsGlyphs(text);
      var totalWidth = 0;
      for (var idx = 0, len = glyphs.length; idx < len; idx++) {
        var left = glyphs[idx].name;
        var right = (glyphs[idx + 1] || {}).name;
        var kernAmount = this.font.getXAxisKerningForPair(left, right) || 0;
        totalWidth += this.widthOfGlyph(left) + kernAmount;
      }
      var scale2 = size / 1e3;
      return totalWidth * scale2;
    };
    StandardFontEmbedder2.prototype.heightOfFontAtSize = function(size, options) {
      if (options === void 0) {
        options = {};
      }
      var _a = options.descender, descender = _a === void 0 ? true : _a;
      var _b = this.font, Ascender = _b.Ascender, Descender = _b.Descender, FontBBox = _b.FontBBox;
      var yTop = Ascender || FontBBox[3];
      var yBottom = Descender || FontBBox[1];
      var height = yTop - yBottom;
      if (!descender)
        height += Descender || 0;
      return height / 1e3 * size;
    };
    StandardFontEmbedder2.prototype.sizeOfFontAtHeight = function(height) {
      var _a = this.font, Ascender = _a.Ascender, Descender = _a.Descender, FontBBox = _a.FontBBox;
      var yTop = Ascender || FontBBox[3];
      var yBottom = Descender || FontBBox[1];
      return 1e3 * height / (yTop - yBottom);
    };
    StandardFontEmbedder2.prototype.embedIntoContext = function(context, ref) {
      var fontDict = context.obj({
        Type: "Font",
        Subtype: "Type1",
        BaseFont: this.customName || this.fontName,
        Encoding: this.encoding === Encodings.WinAnsi ? "WinAnsiEncoding" : void 0
      });
      if (ref) {
        context.assign(ref, fontDict);
        return ref;
      } else {
        return context.register(fontDict);
      }
    };
    StandardFontEmbedder2.prototype.widthOfGlyph = function(glyphName) {
      return this.font.getWidthOfGlyph(glyphName) || 250;
    };
    StandardFontEmbedder2.prototype.encodeTextAsGlyphs = function(text) {
      var codePoints = Array.from(text);
      var glyphs = new Array(codePoints.length);
      for (var idx = 0, len = codePoints.length; idx < len; idx++) {
        var codePoint = toCodePoint(codePoints[idx]);
        glyphs[idx] = this.encoding.encodeUnicodeCodePoint(codePoint);
      }
      return glyphs;
    };
    StandardFontEmbedder2.for = function(fontName, customName) {
      return new StandardFontEmbedder2(fontName, customName);
    };
    return StandardFontEmbedder2;
  })()
);
var createCmap = function(glyphs, glyphId) {
  var bfChars = new Array(glyphs.length);
  for (var idx = 0, len = glyphs.length; idx < len; idx++) {
    var glyph = glyphs[idx];
    var id = cmapHexFormat(cmapHexString(glyphId(glyph)));
    var unicode = cmapHexFormat.apply(void 0, glyph.codePoints.map(cmapCodePointFormat));
    bfChars[idx] = [id, unicode];
  }
  return fillCmapTemplate(bfChars);
};
var fillCmapTemplate = function(bfChars) {
  return "/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo <<\n  /Registry (Adobe)\n  /Ordering (UCS)\n  /Supplement 0\n>> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<0000><ffff>\nendcodespacerange\n" + bfChars.length + " beginbfchar\n" + bfChars.map(function(_a) {
    var glyphId = _a[0], codePoint = _a[1];
    return glyphId + " " + codePoint;
  }).join("\n") + "\nendbfchar\nendcmap\nCMapName currentdict /CMap defineresource pop\nend\nend";
};
var cmapHexFormat = function() {
  var values2 = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    values2[_i] = arguments[_i];
  }
  return "<" + values2.join("") + ">";
};
var cmapHexString = function(value) {
  return toHexStringOfMinLength(value, 4);
};
var cmapCodePointFormat = function(codePoint) {
  if (isWithinBMP(codePoint))
    return cmapHexString(codePoint);
  if (hasSurrogates(codePoint)) {
    var hs = highSurrogate(codePoint);
    var ls = lowSurrogate(codePoint);
    return "" + cmapHexString(hs) + cmapHexString(ls);
  }
  var hex = toHexString(codePoint);
  var msg = "0x" + hex + " is not a valid UTF-8 or UTF-16 codepoint.";
  throw new Error(msg);
};
var makeFontFlags = function(options) {
  var flags = 0;
  var flipBit = function(bit) {
    flags |= 1 << bit - 1;
  };
  if (options.fixedPitch)
    flipBit(1);
  if (options.serif)
    flipBit(2);
  flipBit(3);
  if (options.script)
    flipBit(4);
  if (options.nonsymbolic)
    flipBit(6);
  if (options.italic)
    flipBit(7);
  if (options.allCap)
    flipBit(17);
  if (options.smallCap)
    flipBit(18);
  if (options.forceBold)
    flipBit(19);
  return flags;
};
var deriveFontFlags = function(font) {
  var familyClass = font["OS/2"] ? font["OS/2"].sFamilyClass : 0;
  var flags = makeFontFlags({
    fixedPitch: font.post.isFixedPitch,
    serif: 1 <= familyClass && familyClass <= 7,
    script: familyClass === 10,
    italic: font.head.macStyle.italic
  });
  return flags;
};
var PDFString = (
  /** @class */
  (function(_super) {
    __extends(PDFString2, _super);
    function PDFString2(value) {
      var _this = _super.call(this) || this;
      _this.value = value;
      return _this;
    }
    PDFString2.prototype.asBytes = function() {
      var bytes = [];
      var octal = "";
      var escaped = false;
      var pushByte = function(byte2) {
        if (byte2 !== void 0)
          bytes.push(byte2);
        escaped = false;
      };
      for (var idx = 0, len = this.value.length; idx < len; idx++) {
        var char = this.value[idx];
        var byte = toCharCode(char);
        var nextChar = this.value[idx + 1];
        if (!escaped) {
          if (byte === CharCodes.BackSlash)
            escaped = true;
          else
            pushByte(byte);
        } else {
          if (byte === CharCodes.Newline)
            pushByte();
          else if (byte === CharCodes.CarriageReturn)
            pushByte();
          else if (byte === CharCodes.n)
            pushByte(CharCodes.Newline);
          else if (byte === CharCodes.r)
            pushByte(CharCodes.CarriageReturn);
          else if (byte === CharCodes.t)
            pushByte(CharCodes.Tab);
          else if (byte === CharCodes.b)
            pushByte(CharCodes.Backspace);
          else if (byte === CharCodes.f)
            pushByte(CharCodes.FormFeed);
          else if (byte === CharCodes.LeftParen)
            pushByte(CharCodes.LeftParen);
          else if (byte === CharCodes.RightParen)
            pushByte(CharCodes.RightParen);
          else if (byte === CharCodes.Backspace)
            pushByte(CharCodes.BackSlash);
          else if (byte >= CharCodes.Zero && byte <= CharCodes.Seven) {
            octal += char;
            if (octal.length === 3 || !(nextChar >= "0" && nextChar <= "7")) {
              pushByte(parseInt(octal, 8));
              octal = "";
            }
          } else {
            pushByte(byte);
          }
        }
      }
      return new Uint8Array(bytes);
    };
    PDFString2.prototype.decodeText = function() {
      var bytes = this.asBytes();
      if (hasUtf16BOM(bytes))
        return utf16Decode(bytes);
      return pdfDocEncodingDecode(bytes);
    };
    PDFString2.prototype.decodeDate = function() {
      var text = this.decodeText();
      var date = parseDate(text);
      if (!date)
        throw new InvalidPDFDateStringError(text);
      return date;
    };
    PDFString2.prototype.asString = function() {
      return this.value;
    };
    PDFString2.prototype.clone = function() {
      return PDFString2.of(this.value);
    };
    PDFString2.prototype.toString = function() {
      return "(" + this.value + ")";
    };
    PDFString2.prototype.sizeInBytes = function() {
      return this.value.length + 2;
    };
    PDFString2.prototype.copyBytesInto = function(buffer, offset) {
      buffer[offset++] = CharCodes.LeftParen;
      offset += copyStringIntoBuffer(this.value, buffer, offset);
      buffer[offset++] = CharCodes.RightParen;
      return this.value.length + 2;
    };
    PDFString2.of = function(value) {
      return new PDFString2(value);
    };
    PDFString2.fromDate = function(date) {
      var year = padStart(String(date.getUTCFullYear()), 4, "0");
      var month = padStart(String(date.getUTCMonth() + 1), 2, "0");
      var day = padStart(String(date.getUTCDate()), 2, "0");
      var hours = padStart(String(date.getUTCHours()), 2, "0");
      var mins = padStart(String(date.getUTCMinutes()), 2, "0");
      var secs = padStart(String(date.getUTCSeconds()), 2, "0");
      return new PDFString2("D:" + year + month + day + hours + mins + secs + "Z");
    };
    return PDFString2;
  })(PDFObject)
);
var CustomFontEmbedder = (
  /** @class */
  (function() {
    function CustomFontEmbedder2(font, fontData, customName, fontFeatures) {
      var _this = this;
      this.allGlyphsInFontSortedById = function() {
        var glyphs = new Array(_this.font.characterSet.length);
        for (var idx = 0, len = glyphs.length; idx < len; idx++) {
          var codePoint = _this.font.characterSet[idx];
          glyphs[idx] = _this.font.glyphForCodePoint(codePoint);
        }
        return sortedUniq(glyphs.sort(byAscendingId), function(g) {
          return g.id;
        });
      };
      this.font = font;
      this.scale = 1e3 / this.font.unitsPerEm;
      this.fontData = fontData;
      this.fontName = this.font.postscriptName || "Font";
      this.customName = customName;
      this.fontFeatures = fontFeatures;
      this.baseFontName = "";
      this.glyphCache = Cache.populatedBy(this.allGlyphsInFontSortedById);
    }
    CustomFontEmbedder2.for = function(fontkit, fontData, customName, fontFeatures) {
      return __awaiter(this, void 0, void 0, function() {
        var font;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, fontkit.create(fontData)];
            case 1:
              font = _a.sent();
              return [2, new CustomFontEmbedder2(font, fontData, customName, fontFeatures)];
          }
        });
      });
    };
    CustomFontEmbedder2.prototype.encodeText = function(text) {
      var glyphs = this.font.layout(text, this.fontFeatures).glyphs;
      var hexCodes = new Array(glyphs.length);
      for (var idx = 0, len = glyphs.length; idx < len; idx++) {
        hexCodes[idx] = toHexStringOfMinLength(glyphs[idx].id, 4);
      }
      return PDFHexString.of(hexCodes.join(""));
    };
    CustomFontEmbedder2.prototype.widthOfTextAtSize = function(text, size) {
      var glyphs = this.font.layout(text, this.fontFeatures).glyphs;
      var totalWidth = 0;
      for (var idx = 0, len = glyphs.length; idx < len; idx++) {
        totalWidth += glyphs[idx].advanceWidth * this.scale;
      }
      var scale2 = size / 1e3;
      return totalWidth * scale2;
    };
    CustomFontEmbedder2.prototype.heightOfFontAtSize = function(size, options) {
      if (options === void 0) {
        options = {};
      }
      var _a = options.descender, descender = _a === void 0 ? true : _a;
      var _b = this.font, ascent = _b.ascent, descent = _b.descent, bbox = _b.bbox;
      var yTop = (ascent || bbox.maxY) * this.scale;
      var yBottom = (descent || bbox.minY) * this.scale;
      var height = yTop - yBottom;
      if (!descender)
        height -= Math.abs(descent) || 0;
      return height / 1e3 * size;
    };
    CustomFontEmbedder2.prototype.sizeOfFontAtHeight = function(height) {
      var _a = this.font, ascent = _a.ascent, descent = _a.descent, bbox = _a.bbox;
      var yTop = (ascent || bbox.maxY) * this.scale;
      var yBottom = (descent || bbox.minY) * this.scale;
      return 1e3 * height / (yTop - yBottom);
    };
    CustomFontEmbedder2.prototype.embedIntoContext = function(context, ref) {
      this.baseFontName = this.customName || context.addRandomSuffix(this.fontName);
      return this.embedFontDict(context, ref);
    };
    CustomFontEmbedder2.prototype.embedFontDict = function(context, ref) {
      return __awaiter(this, void 0, void 0, function() {
        var cidFontDictRef, unicodeCMapRef, fontDict;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, this.embedCIDFontDict(context)];
            case 1:
              cidFontDictRef = _a.sent();
              unicodeCMapRef = this.embedUnicodeCmap(context);
              fontDict = context.obj({
                Type: "Font",
                Subtype: "Type0",
                BaseFont: this.baseFontName,
                Encoding: "Identity-H",
                DescendantFonts: [cidFontDictRef],
                ToUnicode: unicodeCMapRef
              });
              if (ref) {
                context.assign(ref, fontDict);
                return [2, ref];
              } else {
                return [2, context.register(fontDict)];
              }
          }
        });
      });
    };
    CustomFontEmbedder2.prototype.isCFF = function() {
      return this.font.cff;
    };
    CustomFontEmbedder2.prototype.embedCIDFontDict = function(context) {
      return __awaiter(this, void 0, void 0, function() {
        var fontDescriptorRef, cidFontDict;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, this.embedFontDescriptor(context)];
            case 1:
              fontDescriptorRef = _a.sent();
              cidFontDict = context.obj({
                Type: "Font",
                Subtype: this.isCFF() ? "CIDFontType0" : "CIDFontType2",
                CIDToGIDMap: "Identity",
                BaseFont: this.baseFontName,
                CIDSystemInfo: {
                  Registry: PDFString.of("Adobe"),
                  Ordering: PDFString.of("Identity"),
                  Supplement: 0
                },
                FontDescriptor: fontDescriptorRef,
                W: this.computeWidths()
              });
              return [2, context.register(cidFontDict)];
          }
        });
      });
    };
    CustomFontEmbedder2.prototype.embedFontDescriptor = function(context) {
      return __awaiter(this, void 0, void 0, function() {
        var fontStreamRef, scale2, _a, italicAngle, ascent, descent, capHeight, xHeight, _b, minX, minY, maxX, maxY, fontDescriptor;
        var _c;
        return __generator(this, function(_d) {
          switch (_d.label) {
            case 0:
              return [4, this.embedFontStream(context)];
            case 1:
              fontStreamRef = _d.sent();
              scale2 = this.scale;
              _a = this.font, italicAngle = _a.italicAngle, ascent = _a.ascent, descent = _a.descent, capHeight = _a.capHeight, xHeight = _a.xHeight;
              _b = this.font.bbox, minX = _b.minX, minY = _b.minY, maxX = _b.maxX, maxY = _b.maxY;
              fontDescriptor = context.obj((_c = {
                Type: "FontDescriptor",
                FontName: this.baseFontName,
                Flags: deriveFontFlags(this.font),
                FontBBox: [minX * scale2, minY * scale2, maxX * scale2, maxY * scale2],
                ItalicAngle: italicAngle,
                Ascent: ascent * scale2,
                Descent: descent * scale2,
                CapHeight: (capHeight || ascent) * scale2,
                XHeight: (xHeight || 0) * scale2,
                // Not sure how to compute/find this, nor is anybody else really:
                // https://stackoverflow.com/questions/35485179/stemv-value-of-the-truetype-font
                StemV: 0
              }, _c[this.isCFF() ? "FontFile3" : "FontFile2"] = fontStreamRef, _c));
              return [2, context.register(fontDescriptor)];
          }
        });
      });
    };
    CustomFontEmbedder2.prototype.serializeFont = function() {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          return [2, this.fontData];
        });
      });
    };
    CustomFontEmbedder2.prototype.embedFontStream = function(context) {
      return __awaiter(this, void 0, void 0, function() {
        var fontStream, _a, _b;
        return __generator(this, function(_c) {
          switch (_c.label) {
            case 0:
              _b = (_a = context).flateStream;
              return [4, this.serializeFont()];
            case 1:
              fontStream = _b.apply(_a, [_c.sent(), {
                Subtype: this.isCFF() ? "CIDFontType0C" : void 0
              }]);
              return [2, context.register(fontStream)];
          }
        });
      });
    };
    CustomFontEmbedder2.prototype.embedUnicodeCmap = function(context) {
      var cmap = createCmap(this.glyphCache.access(), this.glyphId.bind(this));
      var cmapStream = context.flateStream(cmap);
      return context.register(cmapStream);
    };
    CustomFontEmbedder2.prototype.glyphId = function(glyph) {
      return glyph ? glyph.id : -1;
    };
    CustomFontEmbedder2.prototype.computeWidths = function() {
      var glyphs = this.glyphCache.access();
      var widths = [];
      var currSection = [];
      for (var idx = 0, len = glyphs.length; idx < len; idx++) {
        var currGlyph = glyphs[idx];
        var prevGlyph = glyphs[idx - 1];
        var currGlyphId = this.glyphId(currGlyph);
        var prevGlyphId = this.glyphId(prevGlyph);
        if (idx === 0) {
          widths.push(currGlyphId);
        } else if (currGlyphId - prevGlyphId !== 1) {
          widths.push(currSection);
          widths.push(currGlyphId);
          currSection = [];
        }
        currSection.push(currGlyph.advanceWidth * this.scale);
      }
      widths.push(currSection);
      return widths;
    };
    return CustomFontEmbedder2;
  })()
);
var CustomFontSubsetEmbedder = (
  /** @class */
  (function(_super) {
    __extends(CustomFontSubsetEmbedder2, _super);
    function CustomFontSubsetEmbedder2(font, fontData, customFontName, fontFeatures) {
      var _this = _super.call(this, font, fontData, customFontName, fontFeatures) || this;
      _this.subset = _this.font.createSubset();
      _this.glyphs = [];
      _this.glyphCache = Cache.populatedBy(function() {
        return _this.glyphs;
      });
      _this.glyphIdMap = /* @__PURE__ */ new Map();
      return _this;
    }
    CustomFontSubsetEmbedder2.for = function(fontkit, fontData, customFontName, fontFeatures) {
      return __awaiter(this, void 0, void 0, function() {
        var font;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, fontkit.create(fontData)];
            case 1:
              font = _a.sent();
              return [2, new CustomFontSubsetEmbedder2(font, fontData, customFontName, fontFeatures)];
          }
        });
      });
    };
    CustomFontSubsetEmbedder2.prototype.encodeText = function(text) {
      var glyphs = this.font.layout(text, this.fontFeatures).glyphs;
      var hexCodes = new Array(glyphs.length);
      for (var idx = 0, len = glyphs.length; idx < len; idx++) {
        var glyph = glyphs[idx];
        var subsetGlyphId = this.subset.includeGlyph(glyph);
        this.glyphs[subsetGlyphId - 1] = glyph;
        this.glyphIdMap.set(glyph.id, subsetGlyphId);
        hexCodes[idx] = toHexStringOfMinLength(subsetGlyphId, 4);
      }
      this.glyphCache.invalidate();
      return PDFHexString.of(hexCodes.join(""));
    };
    CustomFontSubsetEmbedder2.prototype.isCFF = function() {
      return this.subset.cff;
    };
    CustomFontSubsetEmbedder2.prototype.glyphId = function(glyph) {
      return glyph ? this.glyphIdMap.get(glyph.id) : -1;
    };
    CustomFontSubsetEmbedder2.prototype.serializeFont = function() {
      var _this = this;
      return new Promise(function(resolve, reject) {
        var parts = [];
        _this.subset.encodeStream().on("data", function(bytes) {
          return parts.push(bytes);
        }).on("end", function() {
          return resolve(mergeUint8Arrays(parts));
        }).on("error", function(err) {
          return reject(err);
        });
      });
    };
    return CustomFontSubsetEmbedder2;
  })(CustomFontEmbedder)
);
var AFRelationship;
(function(AFRelationship2) {
  AFRelationship2["Source"] = "Source";
  AFRelationship2["Data"] = "Data";
  AFRelationship2["Alternative"] = "Alternative";
  AFRelationship2["Supplement"] = "Supplement";
  AFRelationship2["EncryptedPayload"] = "EncryptedPayload";
  AFRelationship2["FormData"] = "EncryptedPayload";
  AFRelationship2["Schema"] = "Schema";
  AFRelationship2["Unspecified"] = "Unspecified";
})(AFRelationship || (AFRelationship = {}));
var FileEmbedder = (
  /** @class */
  (function() {
    function FileEmbedder2(fileData, fileName, options) {
      if (options === void 0) {
        options = {};
      }
      this.fileData = fileData;
      this.fileName = fileName;
      this.options = options;
    }
    FileEmbedder2.for = function(bytes, fileName, options) {
      if (options === void 0) {
        options = {};
      }
      return new FileEmbedder2(bytes, fileName, options);
    };
    FileEmbedder2.prototype.embedIntoContext = function(context, ref) {
      return __awaiter(this, void 0, void 0, function() {
        var _a, mimeType, description, creationDate, modificationDate, afRelationship, embeddedFileStream, embeddedFileStreamRef, fileSpecDict;
        return __generator(this, function(_b) {
          _a = this.options, mimeType = _a.mimeType, description = _a.description, creationDate = _a.creationDate, modificationDate = _a.modificationDate, afRelationship = _a.afRelationship;
          embeddedFileStream = context.flateStream(this.fileData, {
            Type: "EmbeddedFile",
            Subtype: mimeType !== null && mimeType !== void 0 ? mimeType : void 0,
            Params: {
              Size: this.fileData.length,
              CreationDate: creationDate ? PDFString.fromDate(creationDate) : void 0,
              ModDate: modificationDate ? PDFString.fromDate(modificationDate) : void 0
            }
          });
          embeddedFileStreamRef = context.register(embeddedFileStream);
          fileSpecDict = context.obj({
            Type: "Filespec",
            F: PDFString.of(this.fileName),
            UF: PDFHexString.fromText(this.fileName),
            EF: { F: embeddedFileStreamRef },
            Desc: description ? PDFHexString.fromText(description) : void 0,
            AFRelationship: afRelationship !== null && afRelationship !== void 0 ? afRelationship : void 0
          });
          if (ref) {
            context.assign(ref, fileSpecDict);
            return [2, ref];
          } else {
            return [2, context.register(fileSpecDict)];
          }
        });
      });
    };
    return FileEmbedder2;
  })()
);
var MARKERS = [
  65472,
  65473,
  65474,
  65475,
  65477,
  65478,
  65479,
  65480,
  65481,
  65482,
  65483,
  65484,
  65485,
  65486,
  65487
];
var ColorSpace;
(function(ColorSpace2) {
  ColorSpace2["DeviceGray"] = "DeviceGray";
  ColorSpace2["DeviceRGB"] = "DeviceRGB";
  ColorSpace2["DeviceCMYK"] = "DeviceCMYK";
})(ColorSpace || (ColorSpace = {}));
var ChannelToColorSpace = {
  1: ColorSpace.DeviceGray,
  3: ColorSpace.DeviceRGB,
  4: ColorSpace.DeviceCMYK
};
var JpegEmbedder = (
  /** @class */
  (function() {
    function JpegEmbedder2(imageData, bitsPerComponent, width, height, colorSpace) {
      this.imageData = imageData;
      this.bitsPerComponent = bitsPerComponent;
      this.width = width;
      this.height = height;
      this.colorSpace = colorSpace;
    }
    JpegEmbedder2.for = function(imageData) {
      return __awaiter(this, void 0, void 0, function() {
        var dataView, soi, pos, marker, bitsPerComponent, height, width, channelByte, channelName, colorSpace;
        return __generator(this, function(_a) {
          dataView = new DataView(imageData.buffer);
          soi = dataView.getUint16(0);
          if (soi !== 65496)
            throw new Error("SOI not found in JPEG");
          pos = 2;
          while (pos < dataView.byteLength) {
            marker = dataView.getUint16(pos);
            pos += 2;
            if (MARKERS.includes(marker))
              break;
            pos += dataView.getUint16(pos);
          }
          if (!MARKERS.includes(marker))
            throw new Error("Invalid JPEG");
          pos += 2;
          bitsPerComponent = dataView.getUint8(pos++);
          height = dataView.getUint16(pos);
          pos += 2;
          width = dataView.getUint16(pos);
          pos += 2;
          channelByte = dataView.getUint8(pos++);
          channelName = ChannelToColorSpace[channelByte];
          if (!channelName)
            throw new Error("Unknown JPEG channel.");
          colorSpace = channelName;
          return [2, new JpegEmbedder2(imageData, bitsPerComponent, width, height, colorSpace)];
        });
      });
    };
    JpegEmbedder2.prototype.embedIntoContext = function(context, ref) {
      return __awaiter(this, void 0, void 0, function() {
        var xObject;
        return __generator(this, function(_a) {
          xObject = context.stream(this.imageData, {
            Type: "XObject",
            Subtype: "Image",
            BitsPerComponent: this.bitsPerComponent,
            Width: this.width,
            Height: this.height,
            ColorSpace: this.colorSpace,
            Filter: "DCTDecode",
            // CMYK JPEG streams in PDF are typically stored complemented,
            // with 1 as 'off' and 0 as 'on' (PDF 32000-1:2008, 8.6.4.4).
            //
            // Standalone CMYK JPEG (usually exported by Photoshop) are
            // stored inverse, with 0 as 'off' and 1 as 'on', like RGB.
            //
            // Applying a swap here as a hedge that most bytes passing
            // through this method will benefit from it.
            Decode: this.colorSpace === ColorSpace.DeviceCMYK ? [1, 0, 1, 0, 1, 0, 1, 0] : void 0
          });
          if (ref) {
            context.assign(ref, xObject);
            return [2, ref];
          } else {
            return [2, context.register(xObject)];
          }
        });
      });
    };
    return JpegEmbedder2;
  })()
);
var getImageType = function(ctype) {
  if (ctype === 0)
    return PngType.Greyscale;
  if (ctype === 2)
    return PngType.Truecolour;
  if (ctype === 3)
    return PngType.IndexedColour;
  if (ctype === 4)
    return PngType.GreyscaleWithAlpha;
  if (ctype === 6)
    return PngType.TruecolourWithAlpha;
  throw new Error("Unknown color type: " + ctype);
};
var splitAlphaChannel = function(rgbaChannel) {
  var pixelCount = Math.floor(rgbaChannel.length / 4);
  var rgbChannel = new Uint8Array(pixelCount * 3);
  var alphaChannel = new Uint8Array(pixelCount * 1);
  var rgbaOffset = 0;
  var rgbOffset = 0;
  var alphaOffset = 0;
  while (rgbaOffset < rgbaChannel.length) {
    rgbChannel[rgbOffset++] = rgbaChannel[rgbaOffset++];
    rgbChannel[rgbOffset++] = rgbaChannel[rgbaOffset++];
    rgbChannel[rgbOffset++] = rgbaChannel[rgbaOffset++];
    alphaChannel[alphaOffset++] = rgbaChannel[rgbaOffset++];
  }
  return { rgbChannel, alphaChannel };
};
var PngType;
(function(PngType2) {
  PngType2["Greyscale"] = "Greyscale";
  PngType2["Truecolour"] = "Truecolour";
  PngType2["IndexedColour"] = "IndexedColour";
  PngType2["GreyscaleWithAlpha"] = "GreyscaleWithAlpha";
  PngType2["TruecolourWithAlpha"] = "TruecolourWithAlpha";
})(PngType || (PngType = {}));
var PNG = (
  /** @class */
  (function() {
    function PNG2(pngData) {
      var upng = UPNG.decode(pngData);
      var frames = UPNG.toRGBA8(upng);
      if (frames.length > 1)
        throw new Error("Animated PNGs are not supported");
      var frame = new Uint8Array(frames[0]);
      var _a = splitAlphaChannel(frame), rgbChannel = _a.rgbChannel, alphaChannel = _a.alphaChannel;
      this.rgbChannel = rgbChannel;
      var hasAlphaValues = alphaChannel.some(function(a) {
        return a < 255;
      });
      if (hasAlphaValues)
        this.alphaChannel = alphaChannel;
      this.type = getImageType(upng.ctype);
      this.width = upng.width;
      this.height = upng.height;
      this.bitsPerComponent = 8;
    }
    PNG2.load = function(pngData) {
      return new PNG2(pngData);
    };
    return PNG2;
  })()
);
var PngEmbedder = (
  /** @class */
  (function() {
    function PngEmbedder2(png) {
      this.image = png;
      this.bitsPerComponent = png.bitsPerComponent;
      this.width = png.width;
      this.height = png.height;
      this.colorSpace = "DeviceRGB";
    }
    PngEmbedder2.for = function(imageData) {
      return __awaiter(this, void 0, void 0, function() {
        var png;
        return __generator(this, function(_a) {
          png = PNG.load(imageData);
          return [2, new PngEmbedder2(png)];
        });
      });
    };
    PngEmbedder2.prototype.embedIntoContext = function(context, ref) {
      return __awaiter(this, void 0, void 0, function() {
        var SMask, xObject;
        return __generator(this, function(_a) {
          SMask = this.embedAlphaChannel(context);
          xObject = context.flateStream(this.image.rgbChannel, {
            Type: "XObject",
            Subtype: "Image",
            BitsPerComponent: this.image.bitsPerComponent,
            Width: this.image.width,
            Height: this.image.height,
            ColorSpace: this.colorSpace,
            SMask
          });
          if (ref) {
            context.assign(ref, xObject);
            return [2, ref];
          } else {
            return [2, context.register(xObject)];
          }
        });
      });
    };
    PngEmbedder2.prototype.embedAlphaChannel = function(context) {
      if (!this.image.alphaChannel)
        return void 0;
      var xObject = context.flateStream(this.image.alphaChannel, {
        Type: "XObject",
        Subtype: "Image",
        Height: this.image.height,
        Width: this.image.width,
        BitsPerComponent: this.image.bitsPerComponent,
        ColorSpace: "DeviceGray",
        Decode: [0, 1]
      });
      return context.register(xObject);
    };
    return PngEmbedder2;
  })()
);
var Stream = (
  /** @class */
  (function() {
    function Stream2(buffer, start, length) {
      this.bytes = buffer;
      this.start = start || 0;
      this.pos = this.start;
      this.end = !!start && !!length ? start + length : this.bytes.length;
    }
    Object.defineProperty(Stream2.prototype, "length", {
      get: function() {
        return this.end - this.start;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Stream2.prototype, "isEmpty", {
      get: function() {
        return this.length === 0;
      },
      enumerable: false,
      configurable: true
    });
    Stream2.prototype.getByte = function() {
      if (this.pos >= this.end) {
        return -1;
      }
      return this.bytes[this.pos++];
    };
    Stream2.prototype.getUint16 = function() {
      var b0 = this.getByte();
      var b1 = this.getByte();
      if (b0 === -1 || b1 === -1) {
        return -1;
      }
      return (b0 << 8) + b1;
    };
    Stream2.prototype.getInt32 = function() {
      var b0 = this.getByte();
      var b1 = this.getByte();
      var b2 = this.getByte();
      var b3 = this.getByte();
      return (b0 << 24) + (b1 << 16) + (b2 << 8) + b3;
    };
    Stream2.prototype.getBytes = function(length, forceClamped) {
      if (forceClamped === void 0) {
        forceClamped = false;
      }
      var bytes = this.bytes;
      var pos = this.pos;
      var strEnd = this.end;
      if (!length) {
        var subarray = bytes.subarray(pos, strEnd);
        return forceClamped ? new Uint8ClampedArray(subarray) : subarray;
      } else {
        var end = pos + length;
        if (end > strEnd) {
          end = strEnd;
        }
        this.pos = end;
        var subarray = bytes.subarray(pos, end);
        return forceClamped ? new Uint8ClampedArray(subarray) : subarray;
      }
    };
    Stream2.prototype.peekByte = function() {
      var peekedByte = this.getByte();
      this.pos--;
      return peekedByte;
    };
    Stream2.prototype.peekBytes = function(length, forceClamped) {
      if (forceClamped === void 0) {
        forceClamped = false;
      }
      var bytes = this.getBytes(length, forceClamped);
      this.pos -= bytes.length;
      return bytes;
    };
    Stream2.prototype.skip = function(n) {
      if (!n) {
        n = 1;
      }
      this.pos += n;
    };
    Stream2.prototype.reset = function() {
      this.pos = this.start;
    };
    Stream2.prototype.moveStart = function() {
      this.start = this.pos;
    };
    Stream2.prototype.makeSubStream = function(start, length) {
      return new Stream2(this.bytes, start, length);
    };
    Stream2.prototype.decode = function() {
      return this.bytes;
    };
    return Stream2;
  })()
);
var emptyBuffer = new Uint8Array(0);
var DecodeStream = (
  /** @class */
  (function() {
    function DecodeStream2(maybeMinBufferLength) {
      this.pos = 0;
      this.bufferLength = 0;
      this.eof = false;
      this.buffer = emptyBuffer;
      this.minBufferLength = 512;
      if (maybeMinBufferLength) {
        while (this.minBufferLength < maybeMinBufferLength) {
          this.minBufferLength *= 2;
        }
      }
    }
    Object.defineProperty(DecodeStream2.prototype, "isEmpty", {
      get: function() {
        while (!this.eof && this.bufferLength === 0) {
          this.readBlock();
        }
        return this.bufferLength === 0;
      },
      enumerable: false,
      configurable: true
    });
    DecodeStream2.prototype.getByte = function() {
      var pos = this.pos;
      while (this.bufferLength <= pos) {
        if (this.eof) {
          return -1;
        }
        this.readBlock();
      }
      return this.buffer[this.pos++];
    };
    DecodeStream2.prototype.getUint16 = function() {
      var b0 = this.getByte();
      var b1 = this.getByte();
      if (b0 === -1 || b1 === -1) {
        return -1;
      }
      return (b0 << 8) + b1;
    };
    DecodeStream2.prototype.getInt32 = function() {
      var b0 = this.getByte();
      var b1 = this.getByte();
      var b2 = this.getByte();
      var b3 = this.getByte();
      return (b0 << 24) + (b1 << 16) + (b2 << 8) + b3;
    };
    DecodeStream2.prototype.getBytes = function(length, forceClamped) {
      if (forceClamped === void 0) {
        forceClamped = false;
      }
      var end;
      var pos = this.pos;
      if (length) {
        this.ensureBuffer(pos + length);
        end = pos + length;
        while (!this.eof && this.bufferLength < end) {
          this.readBlock();
        }
        var bufEnd = this.bufferLength;
        if (end > bufEnd) {
          end = bufEnd;
        }
      } else {
        while (!this.eof) {
          this.readBlock();
        }
        end = this.bufferLength;
      }
      this.pos = end;
      var subarray = this.buffer.subarray(pos, end);
      return forceClamped && !(subarray instanceof Uint8ClampedArray) ? new Uint8ClampedArray(subarray) : subarray;
    };
    DecodeStream2.prototype.peekByte = function() {
      var peekedByte = this.getByte();
      this.pos--;
      return peekedByte;
    };
    DecodeStream2.prototype.peekBytes = function(length, forceClamped) {
      if (forceClamped === void 0) {
        forceClamped = false;
      }
      var bytes = this.getBytes(length, forceClamped);
      this.pos -= bytes.length;
      return bytes;
    };
    DecodeStream2.prototype.skip = function(n) {
      if (!n) {
        n = 1;
      }
      this.pos += n;
    };
    DecodeStream2.prototype.reset = function() {
      this.pos = 0;
    };
    DecodeStream2.prototype.makeSubStream = function(start, length) {
      var end = start + length;
      while (this.bufferLength <= end && !this.eof) {
        this.readBlock();
      }
      return new Stream(
        this.buffer,
        start,
        length
        /* dict */
      );
    };
    DecodeStream2.prototype.decode = function() {
      while (!this.eof)
        this.readBlock();
      return this.buffer.subarray(0, this.bufferLength);
    };
    DecodeStream2.prototype.readBlock = function() {
      throw new MethodNotImplementedError(this.constructor.name, "readBlock");
    };
    DecodeStream2.prototype.ensureBuffer = function(requested) {
      var buffer = this.buffer;
      if (requested <= buffer.byteLength) {
        return buffer;
      }
      var size = this.minBufferLength;
      while (size < requested) {
        size *= 2;
      }
      var buffer2 = new Uint8Array(size);
      buffer2.set(buffer);
      return this.buffer = buffer2;
    };
    return DecodeStream2;
  })()
);
var isSpace = function(ch) {
  return ch === 32 || ch === 9 || ch === 13 || ch === 10;
};
var Ascii85Stream = (
  /** @class */
  (function(_super) {
    __extends(Ascii85Stream2, _super);
    function Ascii85Stream2(stream2, maybeLength) {
      var _this = _super.call(this, maybeLength) || this;
      _this.stream = stream2;
      _this.input = new Uint8Array(5);
      if (maybeLength) {
        maybeLength = 0.8 * maybeLength;
      }
      return _this;
    }
    Ascii85Stream2.prototype.readBlock = function() {
      var TILDA_CHAR = 126;
      var Z_LOWER_CHAR = 122;
      var EOF = -1;
      var stream2 = this.stream;
      var c = stream2.getByte();
      while (isSpace(c)) {
        c = stream2.getByte();
      }
      if (c === EOF || c === TILDA_CHAR) {
        this.eof = true;
        return;
      }
      var bufferLength = this.bufferLength;
      var buffer;
      var i;
      if (c === Z_LOWER_CHAR) {
        buffer = this.ensureBuffer(bufferLength + 4);
        for (i = 0; i < 4; ++i) {
          buffer[bufferLength + i] = 0;
        }
        this.bufferLength += 4;
      } else {
        var input = this.input;
        input[0] = c;
        for (i = 1; i < 5; ++i) {
          c = stream2.getByte();
          while (isSpace(c)) {
            c = stream2.getByte();
          }
          input[i] = c;
          if (c === EOF || c === TILDA_CHAR) {
            break;
          }
        }
        buffer = this.ensureBuffer(bufferLength + i - 1);
        this.bufferLength += i - 1;
        if (i < 5) {
          for (; i < 5; ++i) {
            input[i] = 33 + 84;
          }
          this.eof = true;
        }
        var t = 0;
        for (i = 0; i < 5; ++i) {
          t = t * 85 + (input[i] - 33);
        }
        for (i = 3; i >= 0; --i) {
          buffer[bufferLength + i] = t & 255;
          t >>= 8;
        }
      }
    };
    return Ascii85Stream2;
  })(DecodeStream)
);
var AsciiHexStream = (
  /** @class */
  (function(_super) {
    __extends(AsciiHexStream2, _super);
    function AsciiHexStream2(stream2, maybeLength) {
      var _this = _super.call(this, maybeLength) || this;
      _this.stream = stream2;
      _this.firstDigit = -1;
      if (maybeLength) {
        maybeLength = 0.5 * maybeLength;
      }
      return _this;
    }
    AsciiHexStream2.prototype.readBlock = function() {
      var UPSTREAM_BLOCK_SIZE = 8e3;
      var bytes = this.stream.getBytes(UPSTREAM_BLOCK_SIZE);
      if (!bytes.length) {
        this.eof = true;
        return;
      }
      var maxDecodeLength = bytes.length + 1 >> 1;
      var buffer = this.ensureBuffer(this.bufferLength + maxDecodeLength);
      var bufferLength = this.bufferLength;
      var firstDigit = this.firstDigit;
      for (var i = 0, ii = bytes.length; i < ii; i++) {
        var ch = bytes[i];
        var digit = void 0;
        if (ch >= 48 && ch <= 57) {
          digit = ch & 15;
        } else if (ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102) {
          digit = (ch & 15) + 9;
        } else if (ch === 62) {
          this.eof = true;
          break;
        } else {
          continue;
        }
        if (firstDigit < 0) {
          firstDigit = digit;
        } else {
          buffer[bufferLength++] = firstDigit << 4 | digit;
          firstDigit = -1;
        }
      }
      if (firstDigit >= 0 && this.eof) {
        buffer[bufferLength++] = firstDigit << 4;
        firstDigit = -1;
      }
      this.firstDigit = firstDigit;
      this.bufferLength = bufferLength;
    };
    return AsciiHexStream2;
  })(DecodeStream)
);
var codeLenCodeMap = new Int32Array([
  16,
  17,
  18,
  0,
  8,
  7,
  9,
  6,
  10,
  5,
  11,
  4,
  12,
  3,
  13,
  2,
  14,
  1,
  15
]);
var lengthDecode = new Int32Array([
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  65547,
  65549,
  65551,
  65553,
  131091,
  131095,
  131099,
  131103,
  196643,
  196651,
  196659,
  196667,
  262211,
  262227,
  262243,
  262259,
  327811,
  327843,
  327875,
  327907,
  258,
  258,
  258
]);
var distDecode = new Int32Array([
  1,
  2,
  3,
  4,
  65541,
  65543,
  131081,
  131085,
  196625,
  196633,
  262177,
  262193,
  327745,
  327777,
  393345,
  393409,
  459009,
  459137,
  524801,
  525057,
  590849,
  591361,
  657409,
  658433,
  724993,
  727041,
  794625,
  798721,
  868353,
  876545
]);
var fixedLitCodeTab = [new Int32Array([
  459008,
  524368,
  524304,
  524568,
  459024,
  524400,
  524336,
  590016,
  459016,
  524384,
  524320,
  589984,
  524288,
  524416,
  524352,
  590048,
  459012,
  524376,
  524312,
  589968,
  459028,
  524408,
  524344,
  590032,
  459020,
  524392,
  524328,
  59e4,
  524296,
  524424,
  524360,
  590064,
  459010,
  524372,
  524308,
  524572,
  459026,
  524404,
  524340,
  590024,
  459018,
  524388,
  524324,
  589992,
  524292,
  524420,
  524356,
  590056,
  459014,
  524380,
  524316,
  589976,
  459030,
  524412,
  524348,
  590040,
  459022,
  524396,
  524332,
  590008,
  524300,
  524428,
  524364,
  590072,
  459009,
  524370,
  524306,
  524570,
  459025,
  524402,
  524338,
  590020,
  459017,
  524386,
  524322,
  589988,
  524290,
  524418,
  524354,
  590052,
  459013,
  524378,
  524314,
  589972,
  459029,
  524410,
  524346,
  590036,
  459021,
  524394,
  524330,
  590004,
  524298,
  524426,
  524362,
  590068,
  459011,
  524374,
  524310,
  524574,
  459027,
  524406,
  524342,
  590028,
  459019,
  524390,
  524326,
  589996,
  524294,
  524422,
  524358,
  590060,
  459015,
  524382,
  524318,
  589980,
  459031,
  524414,
  524350,
  590044,
  459023,
  524398,
  524334,
  590012,
  524302,
  524430,
  524366,
  590076,
  459008,
  524369,
  524305,
  524569,
  459024,
  524401,
  524337,
  590018,
  459016,
  524385,
  524321,
  589986,
  524289,
  524417,
  524353,
  590050,
  459012,
  524377,
  524313,
  589970,
  459028,
  524409,
  524345,
  590034,
  459020,
  524393,
  524329,
  590002,
  524297,
  524425,
  524361,
  590066,
  459010,
  524373,
  524309,
  524573,
  459026,
  524405,
  524341,
  590026,
  459018,
  524389,
  524325,
  589994,
  524293,
  524421,
  524357,
  590058,
  459014,
  524381,
  524317,
  589978,
  459030,
  524413,
  524349,
  590042,
  459022,
  524397,
  524333,
  590010,
  524301,
  524429,
  524365,
  590074,
  459009,
  524371,
  524307,
  524571,
  459025,
  524403,
  524339,
  590022,
  459017,
  524387,
  524323,
  589990,
  524291,
  524419,
  524355,
  590054,
  459013,
  524379,
  524315,
  589974,
  459029,
  524411,
  524347,
  590038,
  459021,
  524395,
  524331,
  590006,
  524299,
  524427,
  524363,
  590070,
  459011,
  524375,
  524311,
  524575,
  459027,
  524407,
  524343,
  590030,
  459019,
  524391,
  524327,
  589998,
  524295,
  524423,
  524359,
  590062,
  459015,
  524383,
  524319,
  589982,
  459031,
  524415,
  524351,
  590046,
  459023,
  524399,
  524335,
  590014,
  524303,
  524431,
  524367,
  590078,
  459008,
  524368,
  524304,
  524568,
  459024,
  524400,
  524336,
  590017,
  459016,
  524384,
  524320,
  589985,
  524288,
  524416,
  524352,
  590049,
  459012,
  524376,
  524312,
  589969,
  459028,
  524408,
  524344,
  590033,
  459020,
  524392,
  524328,
  590001,
  524296,
  524424,
  524360,
  590065,
  459010,
  524372,
  524308,
  524572,
  459026,
  524404,
  524340,
  590025,
  459018,
  524388,
  524324,
  589993,
  524292,
  524420,
  524356,
  590057,
  459014,
  524380,
  524316,
  589977,
  459030,
  524412,
  524348,
  590041,
  459022,
  524396,
  524332,
  590009,
  524300,
  524428,
  524364,
  590073,
  459009,
  524370,
  524306,
  524570,
  459025,
  524402,
  524338,
  590021,
  459017,
  524386,
  524322,
  589989,
  524290,
  524418,
  524354,
  590053,
  459013,
  524378,
  524314,
  589973,
  459029,
  524410,
  524346,
  590037,
  459021,
  524394,
  524330,
  590005,
  524298,
  524426,
  524362,
  590069,
  459011,
  524374,
  524310,
  524574,
  459027,
  524406,
  524342,
  590029,
  459019,
  524390,
  524326,
  589997,
  524294,
  524422,
  524358,
  590061,
  459015,
  524382,
  524318,
  589981,
  459031,
  524414,
  524350,
  590045,
  459023,
  524398,
  524334,
  590013,
  524302,
  524430,
  524366,
  590077,
  459008,
  524369,
  524305,
  524569,
  459024,
  524401,
  524337,
  590019,
  459016,
  524385,
  524321,
  589987,
  524289,
  524417,
  524353,
  590051,
  459012,
  524377,
  524313,
  589971,
  459028,
  524409,
  524345,
  590035,
  459020,
  524393,
  524329,
  590003,
  524297,
  524425,
  524361,
  590067,
  459010,
  524373,
  524309,
  524573,
  459026,
  524405,
  524341,
  590027,
  459018,
  524389,
  524325,
  589995,
  524293,
  524421,
  524357,
  590059,
  459014,
  524381,
  524317,
  589979,
  459030,
  524413,
  524349,
  590043,
  459022,
  524397,
  524333,
  590011,
  524301,
  524429,
  524365,
  590075,
  459009,
  524371,
  524307,
  524571,
  459025,
  524403,
  524339,
  590023,
  459017,
  524387,
  524323,
  589991,
  524291,
  524419,
  524355,
  590055,
  459013,
  524379,
  524315,
  589975,
  459029,
  524411,
  524347,
  590039,
  459021,
  524395,
  524331,
  590007,
  524299,
  524427,
  524363,
  590071,
  459011,
  524375,
  524311,
  524575,
  459027,
  524407,
  524343,
  590031,
  459019,
  524391,
  524327,
  589999,
  524295,
  524423,
  524359,
  590063,
  459015,
  524383,
  524319,
  589983,
  459031,
  524415,
  524351,
  590047,
  459023,
  524399,
  524335,
  590015,
  524303,
  524431,
  524367,
  590079
]), 9];
var fixedDistCodeTab = [new Int32Array([
  327680,
  327696,
  327688,
  327704,
  327684,
  327700,
  327692,
  327708,
  327682,
  327698,
  327690,
  327706,
  327686,
  327702,
  327694,
  0,
  327681,
  327697,
  327689,
  327705,
  327685,
  327701,
  327693,
  327709,
  327683,
  327699,
  327691,
  327707,
  327687,
  327703,
  327695,
  0
]), 5];
var FlateStream = (
  /** @class */
  (function(_super) {
    __extends(FlateStream2, _super);
    function FlateStream2(stream2, maybeLength) {
      var _this = _super.call(this, maybeLength) || this;
      _this.stream = stream2;
      var cmf = stream2.getByte();
      var flg = stream2.getByte();
      if (cmf === -1 || flg === -1) {
        throw new Error("Invalid header in flate stream: " + cmf + ", " + flg);
      }
      if ((cmf & 15) !== 8) {
        throw new Error("Unknown compression method in flate stream: " + cmf + ", " + flg);
      }
      if (((cmf << 8) + flg) % 31 !== 0) {
        throw new Error("Bad FCHECK in flate stream: " + cmf + ", " + flg);
      }
      if (flg & 32) {
        throw new Error("FDICT bit set in flate stream: " + cmf + ", " + flg);
      }
      _this.codeSize = 0;
      _this.codeBuf = 0;
      return _this;
    }
    FlateStream2.prototype.readBlock = function() {
      var buffer;
      var len;
      var str = this.stream;
      var hdr = this.getBits(3);
      if (hdr & 1) {
        this.eof = true;
      }
      hdr >>= 1;
      if (hdr === 0) {
        var b = void 0;
        if ((b = str.getByte()) === -1) {
          throw new Error("Bad block header in flate stream");
        }
        var blockLen = b;
        if ((b = str.getByte()) === -1) {
          throw new Error("Bad block header in flate stream");
        }
        blockLen |= b << 8;
        if ((b = str.getByte()) === -1) {
          throw new Error("Bad block header in flate stream");
        }
        var check = b;
        if ((b = str.getByte()) === -1) {
          throw new Error("Bad block header in flate stream");
        }
        check |= b << 8;
        if (check !== (~blockLen & 65535) && (blockLen !== 0 || check !== 0)) {
          throw new Error("Bad uncompressed block length in flate stream");
        }
        this.codeBuf = 0;
        this.codeSize = 0;
        var bufferLength = this.bufferLength;
        buffer = this.ensureBuffer(bufferLength + blockLen);
        var end = bufferLength + blockLen;
        this.bufferLength = end;
        if (blockLen === 0) {
          if (str.peekByte() === -1) {
            this.eof = true;
          }
        } else {
          for (var n = bufferLength; n < end; ++n) {
            if ((b = str.getByte()) === -1) {
              this.eof = true;
              break;
            }
            buffer[n] = b;
          }
        }
        return;
      }
      var litCodeTable;
      var distCodeTable;
      if (hdr === 1) {
        litCodeTable = fixedLitCodeTab;
        distCodeTable = fixedDistCodeTab;
      } else if (hdr === 2) {
        var numLitCodes = this.getBits(5) + 257;
        var numDistCodes = this.getBits(5) + 1;
        var numCodeLenCodes = this.getBits(4) + 4;
        var codeLenCodeLengths = new Uint8Array(codeLenCodeMap.length);
        var i = void 0;
        for (i = 0; i < numCodeLenCodes; ++i) {
          codeLenCodeLengths[codeLenCodeMap[i]] = this.getBits(3);
        }
        var codeLenCodeTab = this.generateHuffmanTable(codeLenCodeLengths);
        len = 0;
        i = 0;
        var codes = numLitCodes + numDistCodes;
        var codeLengths = new Uint8Array(codes);
        var bitsLength = void 0;
        var bitsOffset = void 0;
        var what = void 0;
        while (i < codes) {
          var code = this.getCode(codeLenCodeTab);
          if (code === 16) {
            bitsLength = 2;
            bitsOffset = 3;
            what = len;
          } else if (code === 17) {
            bitsLength = 3;
            bitsOffset = 3;
            what = len = 0;
          } else if (code === 18) {
            bitsLength = 7;
            bitsOffset = 11;
            what = len = 0;
          } else {
            codeLengths[i++] = len = code;
            continue;
          }
          var repeatLength = this.getBits(bitsLength) + bitsOffset;
          while (repeatLength-- > 0) {
            codeLengths[i++] = what;
          }
        }
        litCodeTable = this.generateHuffmanTable(codeLengths.subarray(0, numLitCodes));
        distCodeTable = this.generateHuffmanTable(codeLengths.subarray(numLitCodes, codes));
      } else {
        throw new Error("Unknown block type in flate stream");
      }
      buffer = this.buffer;
      var limit = buffer ? buffer.length : 0;
      var pos = this.bufferLength;
      while (true) {
        var code1 = this.getCode(litCodeTable);
        if (code1 < 256) {
          if (pos + 1 >= limit) {
            buffer = this.ensureBuffer(pos + 1);
            limit = buffer.length;
          }
          buffer[pos++] = code1;
          continue;
        }
        if (code1 === 256) {
          this.bufferLength = pos;
          return;
        }
        code1 -= 257;
        code1 = lengthDecode[code1];
        var code2 = code1 >> 16;
        if (code2 > 0) {
          code2 = this.getBits(code2);
        }
        len = (code1 & 65535) + code2;
        code1 = this.getCode(distCodeTable);
        code1 = distDecode[code1];
        code2 = code1 >> 16;
        if (code2 > 0) {
          code2 = this.getBits(code2);
        }
        var dist = (code1 & 65535) + code2;
        if (pos + len >= limit) {
          buffer = this.ensureBuffer(pos + len);
          limit = buffer.length;
        }
        for (var k = 0; k < len; ++k, ++pos) {
          buffer[pos] = buffer[pos - dist];
        }
      }
    };
    FlateStream2.prototype.getBits = function(bits) {
      var str = this.stream;
      var codeSize = this.codeSize;
      var codeBuf = this.codeBuf;
      var b;
      while (codeSize < bits) {
        if ((b = str.getByte()) === -1) {
          throw new Error("Bad encoding in flate stream");
        }
        codeBuf |= b << codeSize;
        codeSize += 8;
      }
      b = codeBuf & (1 << bits) - 1;
      this.codeBuf = codeBuf >> bits;
      this.codeSize = codeSize -= bits;
      return b;
    };
    FlateStream2.prototype.getCode = function(table) {
      var str = this.stream;
      var codes = table[0];
      var maxLen = table[1];
      var codeSize = this.codeSize;
      var codeBuf = this.codeBuf;
      var b;
      while (codeSize < maxLen) {
        if ((b = str.getByte()) === -1) {
          break;
        }
        codeBuf |= b << codeSize;
        codeSize += 8;
      }
      var code = codes[codeBuf & (1 << maxLen) - 1];
      if (typeof codes === "number") {
        console.log("FLATE:", code);
      }
      var codeLen = code >> 16;
      var codeVal = code & 65535;
      if (codeLen < 1 || codeSize < codeLen) {
        throw new Error("Bad encoding in flate stream");
      }
      this.codeBuf = codeBuf >> codeLen;
      this.codeSize = codeSize - codeLen;
      return codeVal;
    };
    FlateStream2.prototype.generateHuffmanTable = function(lengths) {
      var n = lengths.length;
      var maxLen = 0;
      var i;
      for (i = 0; i < n; ++i) {
        if (lengths[i] > maxLen) {
          maxLen = lengths[i];
        }
      }
      var size = 1 << maxLen;
      var codes = new Int32Array(size);
      for (var len = 1, code = 0, skip = 2; len <= maxLen; ++len, code <<= 1, skip <<= 1) {
        for (var val = 0; val < n; ++val) {
          if (lengths[val] === len) {
            var code2 = 0;
            var t = code;
            for (i = 0; i < len; ++i) {
              code2 = code2 << 1 | t & 1;
              t >>= 1;
            }
            for (i = code2; i < size; i += skip) {
              codes[i] = len << 16 | val;
            }
            ++code;
          }
        }
      }
      return [codes, maxLen];
    };
    return FlateStream2;
  })(DecodeStream)
);
var LZWStream = (
  /** @class */
  (function(_super) {
    __extends(LZWStream2, _super);
    function LZWStream2(stream2, maybeLength, earlyChange) {
      var _this = _super.call(this, maybeLength) || this;
      _this.stream = stream2;
      _this.cachedData = 0;
      _this.bitsCached = 0;
      var maxLzwDictionarySize = 4096;
      var lzwState = {
        earlyChange,
        codeLength: 9,
        nextCode: 258,
        dictionaryValues: new Uint8Array(maxLzwDictionarySize),
        dictionaryLengths: new Uint16Array(maxLzwDictionarySize),
        dictionaryPrevCodes: new Uint16Array(maxLzwDictionarySize),
        currentSequence: new Uint8Array(maxLzwDictionarySize),
        currentSequenceLength: 0
      };
      for (var i = 0; i < 256; ++i) {
        lzwState.dictionaryValues[i] = i;
        lzwState.dictionaryLengths[i] = 1;
      }
      _this.lzwState = lzwState;
      return _this;
    }
    LZWStream2.prototype.readBlock = function() {
      var blockSize = 512;
      var estimatedDecodedSize = blockSize * 2;
      var decodedSizeDelta = blockSize;
      var i;
      var j;
      var q;
      var lzwState = this.lzwState;
      if (!lzwState) {
        return;
      }
      var earlyChange = lzwState.earlyChange;
      var nextCode = lzwState.nextCode;
      var dictionaryValues = lzwState.dictionaryValues;
      var dictionaryLengths = lzwState.dictionaryLengths;
      var dictionaryPrevCodes = lzwState.dictionaryPrevCodes;
      var codeLength = lzwState.codeLength;
      var prevCode = lzwState.prevCode;
      var currentSequence = lzwState.currentSequence;
      var currentSequenceLength = lzwState.currentSequenceLength;
      var decodedLength = 0;
      var currentBufferLength = this.bufferLength;
      var buffer = this.ensureBuffer(this.bufferLength + estimatedDecodedSize);
      for (i = 0; i < blockSize; i++) {
        var code = this.readBits(codeLength);
        var hasPrev = currentSequenceLength > 0;
        if (!code || code < 256) {
          currentSequence[0] = code;
          currentSequenceLength = 1;
        } else if (code >= 258) {
          if (code < nextCode) {
            currentSequenceLength = dictionaryLengths[code];
            for (j = currentSequenceLength - 1, q = code; j >= 0; j--) {
              currentSequence[j] = dictionaryValues[q];
              q = dictionaryPrevCodes[q];
            }
          } else {
            currentSequence[currentSequenceLength++] = currentSequence[0];
          }
        } else if (code === 256) {
          codeLength = 9;
          nextCode = 258;
          currentSequenceLength = 0;
          continue;
        } else {
          this.eof = true;
          delete this.lzwState;
          break;
        }
        if (hasPrev) {
          dictionaryPrevCodes[nextCode] = prevCode;
          dictionaryLengths[nextCode] = dictionaryLengths[prevCode] + 1;
          dictionaryValues[nextCode] = currentSequence[0];
          nextCode++;
          codeLength = nextCode + earlyChange & nextCode + earlyChange - 1 ? codeLength : Math.min(Math.log(nextCode + earlyChange) / 0.6931471805599453 + 1, 12) | 0;
        }
        prevCode = code;
        decodedLength += currentSequenceLength;
        if (estimatedDecodedSize < decodedLength) {
          do {
            estimatedDecodedSize += decodedSizeDelta;
          } while (estimatedDecodedSize < decodedLength);
          buffer = this.ensureBuffer(this.bufferLength + estimatedDecodedSize);
        }
        for (j = 0; j < currentSequenceLength; j++) {
          buffer[currentBufferLength++] = currentSequence[j];
        }
      }
      lzwState.nextCode = nextCode;
      lzwState.codeLength = codeLength;
      lzwState.prevCode = prevCode;
      lzwState.currentSequenceLength = currentSequenceLength;
      this.bufferLength = currentBufferLength;
    };
    LZWStream2.prototype.readBits = function(n) {
      var bitsCached = this.bitsCached;
      var cachedData = this.cachedData;
      while (bitsCached < n) {
        var c = this.stream.getByte();
        if (c === -1) {
          this.eof = true;
          return null;
        }
        cachedData = cachedData << 8 | c;
        bitsCached += 8;
      }
      this.bitsCached = bitsCached -= n;
      this.cachedData = cachedData;
      return cachedData >>> bitsCached & (1 << n) - 1;
    };
    return LZWStream2;
  })(DecodeStream)
);
var RunLengthStream = (
  /** @class */
  (function(_super) {
    __extends(RunLengthStream2, _super);
    function RunLengthStream2(stream2, maybeLength) {
      var _this = _super.call(this, maybeLength) || this;
      _this.stream = stream2;
      return _this;
    }
    RunLengthStream2.prototype.readBlock = function() {
      var repeatHeader = this.stream.getBytes(2);
      if (!repeatHeader || repeatHeader.length < 2 || repeatHeader[0] === 128) {
        this.eof = true;
        return;
      }
      var buffer;
      var bufferLength = this.bufferLength;
      var n = repeatHeader[0];
      if (n < 128) {
        buffer = this.ensureBuffer(bufferLength + n + 1);
        buffer[bufferLength++] = repeatHeader[1];
        if (n > 0) {
          var source = this.stream.getBytes(n);
          buffer.set(source, bufferLength);
          bufferLength += n;
        }
      } else {
        n = 257 - n;
        var b = repeatHeader[1];
        buffer = this.ensureBuffer(bufferLength + n + 1);
        for (var i = 0; i < n; i++) {
          buffer[bufferLength++] = b;
        }
      }
      this.bufferLength = bufferLength;
    };
    return RunLengthStream2;
  })(DecodeStream)
);
var decodeStream = function(stream2, encoding, params) {
  if (encoding === PDFName.of("FlateDecode")) {
    return new FlateStream(stream2);
  }
  if (encoding === PDFName.of("LZWDecode")) {
    var earlyChange = 1;
    if (params instanceof PDFDict) {
      var EarlyChange = params.lookup(PDFName.of("EarlyChange"));
      if (EarlyChange instanceof PDFNumber) {
        earlyChange = EarlyChange.asNumber();
      }
    }
    return new LZWStream(stream2, void 0, earlyChange);
  }
  if (encoding === PDFName.of("ASCII85Decode")) {
    return new Ascii85Stream(stream2);
  }
  if (encoding === PDFName.of("ASCIIHexDecode")) {
    return new AsciiHexStream(stream2);
  }
  if (encoding === PDFName.of("RunLengthDecode")) {
    return new RunLengthStream(stream2);
  }
  throw new UnsupportedEncodingError(encoding.asString());
};
var decodePDFRawStream = function(_a) {
  var dict = _a.dict, contents = _a.contents;
  var stream2 = new Stream(contents);
  var Filter = dict.lookup(PDFName.of("Filter"));
  var DecodeParms = dict.lookup(PDFName.of("DecodeParms"));
  if (Filter instanceof PDFName) {
    stream2 = decodeStream(stream2, Filter, DecodeParms);
  } else if (Filter instanceof PDFArray) {
    for (var idx = 0, len = Filter.size(); idx < len; idx++) {
      stream2 = decodeStream(stream2, Filter.lookup(idx, PDFName), DecodeParms && DecodeParms.lookupMaybe(idx, PDFDict));
    }
  } else if (!!Filter) {
    throw new UnexpectedObjectTypeError([PDFName, PDFArray], Filter);
  }
  return stream2;
};
var fullPageBoundingBox = function(page) {
  var mediaBox = page.MediaBox();
  var width = mediaBox.lookup(2, PDFNumber).asNumber() - mediaBox.lookup(0, PDFNumber).asNumber();
  var height = mediaBox.lookup(3, PDFNumber).asNumber() - mediaBox.lookup(1, PDFNumber).asNumber();
  return { left: 0, bottom: 0, right: width, top: height };
};
var boundingBoxAdjustedMatrix = function(bb) {
  return [1, 0, 0, 1, -bb.left, -bb.bottom];
};
var PDFPageEmbedder = (
  /** @class */
  (function() {
    function PDFPageEmbedder2(page, boundingBox, transformationMatrix) {
      this.page = page;
      var bb = boundingBox !== null && boundingBox !== void 0 ? boundingBox : fullPageBoundingBox(page);
      this.width = bb.right - bb.left;
      this.height = bb.top - bb.bottom;
      this.boundingBox = bb;
      this.transformationMatrix = transformationMatrix !== null && transformationMatrix !== void 0 ? transformationMatrix : boundingBoxAdjustedMatrix(bb);
    }
    PDFPageEmbedder2.for = function(page, boundingBox, transformationMatrix) {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          return [2, new PDFPageEmbedder2(page, boundingBox, transformationMatrix)];
        });
      });
    };
    PDFPageEmbedder2.prototype.embedIntoContext = function(context, ref) {
      return __awaiter(this, void 0, void 0, function() {
        var _a, Contents, Resources, decodedContents, _b, left, bottom, right, top, xObject;
        return __generator(this, function(_c) {
          _a = this.page.normalizedEntries(), Contents = _a.Contents, Resources = _a.Resources;
          if (!Contents)
            throw new MissingPageContentsEmbeddingError();
          decodedContents = this.decodeContents(Contents);
          _b = this.boundingBox, left = _b.left, bottom = _b.bottom, right = _b.right, top = _b.top;
          xObject = context.flateStream(decodedContents, {
            Type: "XObject",
            Subtype: "Form",
            FormType: 1,
            BBox: [left, bottom, right, top],
            Matrix: this.transformationMatrix,
            Resources
          });
          if (ref) {
            context.assign(ref, xObject);
            return [2, ref];
          } else {
            return [2, context.register(xObject)];
          }
        });
      });
    };
    PDFPageEmbedder2.prototype.decodeContents = function(contents) {
      var newline = Uint8Array.of(CharCodes.Newline);
      var decodedContents = [];
      for (var idx = 0, len = contents.size(); idx < len; idx++) {
        var stream2 = contents.lookup(idx, PDFStream);
        var content = void 0;
        if (stream2 instanceof PDFRawStream) {
          content = decodePDFRawStream(stream2).decode();
        } else if (stream2 instanceof PDFContentStream) {
          content = stream2.getUnencodedContents();
        } else {
          throw new UnrecognizedStreamTypeError(stream2);
        }
        decodedContents.push(content, newline);
      }
      return mergeIntoTypedArray.apply(void 0, decodedContents);
    };
    return PDFPageEmbedder2;
  })()
);
var asEnum = function(rawValue, enumType) {
  if (rawValue === void 0)
    return void 0;
  return enumType[rawValue];
};
var NonFullScreenPageMode;
(function(NonFullScreenPageMode2) {
  NonFullScreenPageMode2["UseNone"] = "UseNone";
  NonFullScreenPageMode2["UseOutlines"] = "UseOutlines";
  NonFullScreenPageMode2["UseThumbs"] = "UseThumbs";
  NonFullScreenPageMode2["UseOC"] = "UseOC";
})(NonFullScreenPageMode || (NonFullScreenPageMode = {}));
var ReadingDirection;
(function(ReadingDirection2) {
  ReadingDirection2["L2R"] = "L2R";
  ReadingDirection2["R2L"] = "R2L";
})(ReadingDirection || (ReadingDirection = {}));
var PrintScaling;
(function(PrintScaling2) {
  PrintScaling2["None"] = "None";
  PrintScaling2["AppDefault"] = "AppDefault";
})(PrintScaling || (PrintScaling = {}));
var Duplex;
(function(Duplex2) {
  Duplex2["Simplex"] = "Simplex";
  Duplex2["DuplexFlipShortEdge"] = "DuplexFlipShortEdge";
  Duplex2["DuplexFlipLongEdge"] = "DuplexFlipLongEdge";
})(Duplex || (Duplex = {}));
var ViewerPreferences = (
  /** @class */
  (function() {
    function ViewerPreferences2(dict) {
      this.dict = dict;
    }
    ViewerPreferences2.prototype.lookupBool = function(key) {
      var returnObj = this.dict.lookup(PDFName.of(key));
      if (returnObj instanceof PDFBool)
        return returnObj;
      return void 0;
    };
    ViewerPreferences2.prototype.lookupName = function(key) {
      var returnObj = this.dict.lookup(PDFName.of(key));
      if (returnObj instanceof PDFName)
        return returnObj;
      return void 0;
    };
    ViewerPreferences2.prototype.HideToolbar = function() {
      return this.lookupBool("HideToolbar");
    };
    ViewerPreferences2.prototype.HideMenubar = function() {
      return this.lookupBool("HideMenubar");
    };
    ViewerPreferences2.prototype.HideWindowUI = function() {
      return this.lookupBool("HideWindowUI");
    };
    ViewerPreferences2.prototype.FitWindow = function() {
      return this.lookupBool("FitWindow");
    };
    ViewerPreferences2.prototype.CenterWindow = function() {
      return this.lookupBool("CenterWindow");
    };
    ViewerPreferences2.prototype.DisplayDocTitle = function() {
      return this.lookupBool("DisplayDocTitle");
    };
    ViewerPreferences2.prototype.NonFullScreenPageMode = function() {
      return this.lookupName("NonFullScreenPageMode");
    };
    ViewerPreferences2.prototype.Direction = function() {
      return this.lookupName("Direction");
    };
    ViewerPreferences2.prototype.PrintScaling = function() {
      return this.lookupName("PrintScaling");
    };
    ViewerPreferences2.prototype.Duplex = function() {
      return this.lookupName("Duplex");
    };
    ViewerPreferences2.prototype.PickTrayByPDFSize = function() {
      return this.lookupBool("PickTrayByPDFSize");
    };
    ViewerPreferences2.prototype.PrintPageRange = function() {
      var PrintPageRange = this.dict.lookup(PDFName.of("PrintPageRange"));
      if (PrintPageRange instanceof PDFArray)
        return PrintPageRange;
      return void 0;
    };
    ViewerPreferences2.prototype.NumCopies = function() {
      var NumCopies = this.dict.lookup(PDFName.of("NumCopies"));
      if (NumCopies instanceof PDFNumber)
        return NumCopies;
      return void 0;
    };
    ViewerPreferences2.prototype.getHideToolbar = function() {
      var _a, _b;
      return (_b = (_a = this.HideToolbar()) === null || _a === void 0 ? void 0 : _a.asBoolean()) !== null && _b !== void 0 ? _b : false;
    };
    ViewerPreferences2.prototype.getHideMenubar = function() {
      var _a, _b;
      return (_b = (_a = this.HideMenubar()) === null || _a === void 0 ? void 0 : _a.asBoolean()) !== null && _b !== void 0 ? _b : false;
    };
    ViewerPreferences2.prototype.getHideWindowUI = function() {
      var _a, _b;
      return (_b = (_a = this.HideWindowUI()) === null || _a === void 0 ? void 0 : _a.asBoolean()) !== null && _b !== void 0 ? _b : false;
    };
    ViewerPreferences2.prototype.getFitWindow = function() {
      var _a, _b;
      return (_b = (_a = this.FitWindow()) === null || _a === void 0 ? void 0 : _a.asBoolean()) !== null && _b !== void 0 ? _b : false;
    };
    ViewerPreferences2.prototype.getCenterWindow = function() {
      var _a, _b;
      return (_b = (_a = this.CenterWindow()) === null || _a === void 0 ? void 0 : _a.asBoolean()) !== null && _b !== void 0 ? _b : false;
    };
    ViewerPreferences2.prototype.getDisplayDocTitle = function() {
      var _a, _b;
      return (_b = (_a = this.DisplayDocTitle()) === null || _a === void 0 ? void 0 : _a.asBoolean()) !== null && _b !== void 0 ? _b : false;
    };
    ViewerPreferences2.prototype.getNonFullScreenPageMode = function() {
      var _a, _b;
      var mode = (_a = this.NonFullScreenPageMode()) === null || _a === void 0 ? void 0 : _a.decodeText();
      return (_b = asEnum(mode, NonFullScreenPageMode)) !== null && _b !== void 0 ? _b : NonFullScreenPageMode.UseNone;
    };
    ViewerPreferences2.prototype.getReadingDirection = function() {
      var _a, _b;
      var direction = (_a = this.Direction()) === null || _a === void 0 ? void 0 : _a.decodeText();
      return (_b = asEnum(direction, ReadingDirection)) !== null && _b !== void 0 ? _b : ReadingDirection.L2R;
    };
    ViewerPreferences2.prototype.getPrintScaling = function() {
      var _a, _b;
      var scaling = (_a = this.PrintScaling()) === null || _a === void 0 ? void 0 : _a.decodeText();
      return (_b = asEnum(scaling, PrintScaling)) !== null && _b !== void 0 ? _b : PrintScaling.AppDefault;
    };
    ViewerPreferences2.prototype.getDuplex = function() {
      var _a;
      var duplex = (_a = this.Duplex()) === null || _a === void 0 ? void 0 : _a.decodeText();
      return asEnum(duplex, Duplex);
    };
    ViewerPreferences2.prototype.getPickTrayByPDFSize = function() {
      var _a;
      return (_a = this.PickTrayByPDFSize()) === null || _a === void 0 ? void 0 : _a.asBoolean();
    };
    ViewerPreferences2.prototype.getPrintPageRange = function() {
      var rng = this.PrintPageRange();
      if (!rng)
        return [];
      var pageRanges = [];
      for (var i = 0; i < rng.size(); i += 2) {
        var start = rng.lookup(i, PDFNumber).asNumber();
        var end = rng.lookup(i + 1, PDFNumber).asNumber();
        pageRanges.push({ start, end });
      }
      return pageRanges;
    };
    ViewerPreferences2.prototype.getNumCopies = function() {
      var _a, _b;
      return (_b = (_a = this.NumCopies()) === null || _a === void 0 ? void 0 : _a.asNumber()) !== null && _b !== void 0 ? _b : 1;
    };
    ViewerPreferences2.prototype.setHideToolbar = function(hideToolbar) {
      var HideToolbar = this.dict.context.obj(hideToolbar);
      this.dict.set(PDFName.of("HideToolbar"), HideToolbar);
    };
    ViewerPreferences2.prototype.setHideMenubar = function(hideMenubar) {
      var HideMenubar = this.dict.context.obj(hideMenubar);
      this.dict.set(PDFName.of("HideMenubar"), HideMenubar);
    };
    ViewerPreferences2.prototype.setHideWindowUI = function(hideWindowUI) {
      var HideWindowUI = this.dict.context.obj(hideWindowUI);
      this.dict.set(PDFName.of("HideWindowUI"), HideWindowUI);
    };
    ViewerPreferences2.prototype.setFitWindow = function(fitWindow) {
      var FitWindow = this.dict.context.obj(fitWindow);
      this.dict.set(PDFName.of("FitWindow"), FitWindow);
    };
    ViewerPreferences2.prototype.setCenterWindow = function(centerWindow) {
      var CenterWindow = this.dict.context.obj(centerWindow);
      this.dict.set(PDFName.of("CenterWindow"), CenterWindow);
    };
    ViewerPreferences2.prototype.setDisplayDocTitle = function(displayTitle) {
      var DisplayDocTitle = this.dict.context.obj(displayTitle);
      this.dict.set(PDFName.of("DisplayDocTitle"), DisplayDocTitle);
    };
    ViewerPreferences2.prototype.setNonFullScreenPageMode = function(nonFullScreenPageMode) {
      assertIsOneOf(nonFullScreenPageMode, "nonFullScreenPageMode", NonFullScreenPageMode);
      var mode = PDFName.of(nonFullScreenPageMode);
      this.dict.set(PDFName.of("NonFullScreenPageMode"), mode);
    };
    ViewerPreferences2.prototype.setReadingDirection = function(readingDirection) {
      assertIsOneOf(readingDirection, "readingDirection", ReadingDirection);
      var direction = PDFName.of(readingDirection);
      this.dict.set(PDFName.of("Direction"), direction);
    };
    ViewerPreferences2.prototype.setPrintScaling = function(printScaling) {
      assertIsOneOf(printScaling, "printScaling", PrintScaling);
      var scaling = PDFName.of(printScaling);
      this.dict.set(PDFName.of("PrintScaling"), scaling);
    };
    ViewerPreferences2.prototype.setDuplex = function(duplex) {
      assertIsOneOf(duplex, "duplex", Duplex);
      var dup = PDFName.of(duplex);
      this.dict.set(PDFName.of("Duplex"), dup);
    };
    ViewerPreferences2.prototype.setPickTrayByPDFSize = function(pickTrayByPDFSize) {
      var PickTrayByPDFSize = this.dict.context.obj(pickTrayByPDFSize);
      this.dict.set(PDFName.of("PickTrayByPDFSize"), PickTrayByPDFSize);
    };
    ViewerPreferences2.prototype.setPrintPageRange = function(printPageRange) {
      if (!Array.isArray(printPageRange))
        printPageRange = [printPageRange];
      var flatRange = [];
      for (var idx = 0, len = printPageRange.length; idx < len; idx++) {
        flatRange.push(printPageRange[idx].start);
        flatRange.push(printPageRange[idx].end);
      }
      assertEachIs(flatRange, "printPageRange", ["number"]);
      var pageRanges = this.dict.context.obj(flatRange);
      this.dict.set(PDFName.of("PrintPageRange"), pageRanges);
    };
    ViewerPreferences2.prototype.setNumCopies = function(numCopies) {
      assertRange(numCopies, "numCopies", 1, Number.MAX_VALUE);
      assertInteger(numCopies, "numCopies");
      var NumCopies = this.dict.context.obj(numCopies);
      this.dict.set(PDFName.of("NumCopies"), NumCopies);
    };
    ViewerPreferences2.fromDict = function(dict) {
      return new ViewerPreferences2(dict);
    };
    ViewerPreferences2.create = function(context) {
      var dict = context.obj({});
      return new ViewerPreferences2(dict);
    };
    return ViewerPreferences2;
  })()
);
var tfRegex$1 = /\/([^\0\t\n\f\r\ ]+)[\0\t\n\f\r\ ]*(\d*\.\d+|\d+)?[\0\t\n\f\r\ ]+Tf/;
var PDFAcroField = (
  /** @class */
  (function() {
    function PDFAcroField2(dict, ref) {
      this.dict = dict;
      this.ref = ref;
    }
    PDFAcroField2.prototype.T = function() {
      return this.dict.lookupMaybe(PDFName.of("T"), PDFString, PDFHexString);
    };
    PDFAcroField2.prototype.Ff = function() {
      var numberOrRef = this.getInheritableAttribute(PDFName.of("Ff"));
      return this.dict.context.lookupMaybe(numberOrRef, PDFNumber);
    };
    PDFAcroField2.prototype.V = function() {
      var valueOrRef = this.getInheritableAttribute(PDFName.of("V"));
      return this.dict.context.lookup(valueOrRef);
    };
    PDFAcroField2.prototype.Kids = function() {
      return this.dict.lookupMaybe(PDFName.of("Kids"), PDFArray);
    };
    PDFAcroField2.prototype.DA = function() {
      var da = this.dict.lookup(PDFName.of("DA"));
      if (da instanceof PDFString || da instanceof PDFHexString)
        return da;
      return void 0;
    };
    PDFAcroField2.prototype.setKids = function(kids) {
      this.dict.set(PDFName.of("Kids"), this.dict.context.obj(kids));
    };
    PDFAcroField2.prototype.getParent = function() {
      var parentRef = this.dict.get(PDFName.of("Parent"));
      if (parentRef instanceof PDFRef) {
        var parent_1 = this.dict.lookup(PDFName.of("Parent"), PDFDict);
        return new PDFAcroField2(parent_1, parentRef);
      }
      return void 0;
    };
    PDFAcroField2.prototype.setParent = function(parent) {
      if (!parent)
        this.dict.delete(PDFName.of("Parent"));
      else
        this.dict.set(PDFName.of("Parent"), parent);
    };
    PDFAcroField2.prototype.getFullyQualifiedName = function() {
      var parent = this.getParent();
      if (!parent)
        return this.getPartialName();
      return parent.getFullyQualifiedName() + "." + this.getPartialName();
    };
    PDFAcroField2.prototype.getPartialName = function() {
      var _a;
      return (_a = this.T()) === null || _a === void 0 ? void 0 : _a.decodeText();
    };
    PDFAcroField2.prototype.setPartialName = function(partialName) {
      if (!partialName)
        this.dict.delete(PDFName.of("T"));
      else
        this.dict.set(PDFName.of("T"), PDFHexString.fromText(partialName));
    };
    PDFAcroField2.prototype.setDefaultAppearance = function(appearance) {
      this.dict.set(PDFName.of("DA"), PDFString.of(appearance));
    };
    PDFAcroField2.prototype.getDefaultAppearance = function() {
      var DA = this.DA();
      if (DA instanceof PDFHexString) {
        return DA.decodeText();
      }
      return DA === null || DA === void 0 ? void 0 : DA.asString();
    };
    PDFAcroField2.prototype.setFontSize = function(fontSize) {
      var _a;
      var name = (_a = this.getFullyQualifiedName()) !== null && _a !== void 0 ? _a : "";
      var da = this.getDefaultAppearance();
      if (!da)
        throw new MissingDAEntryError(name);
      var daMatch = findLastMatch(da, tfRegex$1);
      if (!daMatch.match)
        throw new MissingTfOperatorError(name);
      var daStart = da.slice(0, daMatch.pos - daMatch.match[0].length);
      var daEnd = daMatch.pos <= da.length ? da.slice(daMatch.pos) : "";
      var fontName = daMatch.match[1];
      var modifiedDa = daStart + " /" + fontName + " " + fontSize + " Tf " + daEnd;
      this.setDefaultAppearance(modifiedDa);
    };
    PDFAcroField2.prototype.getFlags = function() {
      var _a, _b;
      return (_b = (_a = this.Ff()) === null || _a === void 0 ? void 0 : _a.asNumber()) !== null && _b !== void 0 ? _b : 0;
    };
    PDFAcroField2.prototype.setFlags = function(flags) {
      this.dict.set(PDFName.of("Ff"), PDFNumber.of(flags));
    };
    PDFAcroField2.prototype.hasFlag = function(flag2) {
      var flags = this.getFlags();
      return (flags & flag2) !== 0;
    };
    PDFAcroField2.prototype.setFlag = function(flag2) {
      var flags = this.getFlags();
      this.setFlags(flags | flag2);
    };
    PDFAcroField2.prototype.clearFlag = function(flag2) {
      var flags = this.getFlags();
      this.setFlags(flags & ~flag2);
    };
    PDFAcroField2.prototype.setFlagTo = function(flag2, enable) {
      if (enable)
        this.setFlag(flag2);
      else
        this.clearFlag(flag2);
    };
    PDFAcroField2.prototype.getInheritableAttribute = function(name) {
      var attribute;
      this.ascend(function(node) {
        if (!attribute)
          attribute = node.dict.get(name);
      });
      return attribute;
    };
    PDFAcroField2.prototype.ascend = function(visitor) {
      visitor(this);
      var parent = this.getParent();
      if (parent)
        parent.ascend(visitor);
    };
    return PDFAcroField2;
  })()
);
var BorderStyle = (
  /** @class */
  (function() {
    function BorderStyle2(dict) {
      this.dict = dict;
    }
    BorderStyle2.prototype.W = function() {
      var W = this.dict.lookup(PDFName.of("W"));
      if (W instanceof PDFNumber)
        return W;
      return void 0;
    };
    BorderStyle2.prototype.getWidth = function() {
      var _a, _b;
      return (_b = (_a = this.W()) === null || _a === void 0 ? void 0 : _a.asNumber()) !== null && _b !== void 0 ? _b : 1;
    };
    BorderStyle2.prototype.setWidth = function(width) {
      var W = this.dict.context.obj(width);
      this.dict.set(PDFName.of("W"), W);
    };
    BorderStyle2.fromDict = function(dict) {
      return new BorderStyle2(dict);
    };
    return BorderStyle2;
  })()
);
var PDFAnnotation = (
  /** @class */
  (function() {
    function PDFAnnotation2(dict) {
      this.dict = dict;
    }
    PDFAnnotation2.prototype.Rect = function() {
      return this.dict.lookup(PDFName.of("Rect"), PDFArray);
    };
    PDFAnnotation2.prototype.AP = function() {
      return this.dict.lookupMaybe(PDFName.of("AP"), PDFDict);
    };
    PDFAnnotation2.prototype.F = function() {
      var numberOrRef = this.dict.lookup(PDFName.of("F"));
      return this.dict.context.lookupMaybe(numberOrRef, PDFNumber);
    };
    PDFAnnotation2.prototype.getRectangle = function() {
      var _a;
      var Rect = this.Rect();
      return (_a = Rect === null || Rect === void 0 ? void 0 : Rect.asRectangle()) !== null && _a !== void 0 ? _a : { x: 0, y: 0, width: 0, height: 0 };
    };
    PDFAnnotation2.prototype.setRectangle = function(rect) {
      var x = rect.x, y = rect.y, width = rect.width, height = rect.height;
      var Rect = this.dict.context.obj([x, y, x + width, y + height]);
      this.dict.set(PDFName.of("Rect"), Rect);
    };
    PDFAnnotation2.prototype.getAppearanceState = function() {
      var AS = this.dict.lookup(PDFName.of("AS"));
      if (AS instanceof PDFName)
        return AS;
      return void 0;
    };
    PDFAnnotation2.prototype.setAppearanceState = function(state) {
      this.dict.set(PDFName.of("AS"), state);
    };
    PDFAnnotation2.prototype.setAppearances = function(appearances) {
      this.dict.set(PDFName.of("AP"), appearances);
    };
    PDFAnnotation2.prototype.ensureAP = function() {
      var AP = this.AP();
      if (!AP) {
        AP = this.dict.context.obj({});
        this.dict.set(PDFName.of("AP"), AP);
      }
      return AP;
    };
    PDFAnnotation2.prototype.getNormalAppearance = function() {
      var AP = this.ensureAP();
      var N = AP.get(PDFName.of("N"));
      if (N instanceof PDFRef || N instanceof PDFDict)
        return N;
      throw new Error("Unexpected N type: " + (N === null || N === void 0 ? void 0 : N.constructor.name));
    };
    PDFAnnotation2.prototype.setNormalAppearance = function(appearance) {
      var AP = this.ensureAP();
      AP.set(PDFName.of("N"), appearance);
    };
    PDFAnnotation2.prototype.setRolloverAppearance = function(appearance) {
      var AP = this.ensureAP();
      AP.set(PDFName.of("R"), appearance);
    };
    PDFAnnotation2.prototype.setDownAppearance = function(appearance) {
      var AP = this.ensureAP();
      AP.set(PDFName.of("D"), appearance);
    };
    PDFAnnotation2.prototype.removeRolloverAppearance = function() {
      var AP = this.AP();
      AP === null || AP === void 0 ? void 0 : AP.delete(PDFName.of("R"));
    };
    PDFAnnotation2.prototype.removeDownAppearance = function() {
      var AP = this.AP();
      AP === null || AP === void 0 ? void 0 : AP.delete(PDFName.of("D"));
    };
    PDFAnnotation2.prototype.getAppearances = function() {
      var AP = this.AP();
      if (!AP)
        return void 0;
      var N = AP.lookup(PDFName.of("N"), PDFDict, PDFStream);
      var R = AP.lookupMaybe(PDFName.of("R"), PDFDict, PDFStream);
      var D = AP.lookupMaybe(PDFName.of("D"), PDFDict, PDFStream);
      return { normal: N, rollover: R, down: D };
    };
    PDFAnnotation2.prototype.getFlags = function() {
      var _a, _b;
      return (_b = (_a = this.F()) === null || _a === void 0 ? void 0 : _a.asNumber()) !== null && _b !== void 0 ? _b : 0;
    };
    PDFAnnotation2.prototype.setFlags = function(flags) {
      this.dict.set(PDFName.of("F"), PDFNumber.of(flags));
    };
    PDFAnnotation2.prototype.hasFlag = function(flag2) {
      var flags = this.getFlags();
      return (flags & flag2) !== 0;
    };
    PDFAnnotation2.prototype.setFlag = function(flag2) {
      var flags = this.getFlags();
      this.setFlags(flags | flag2);
    };
    PDFAnnotation2.prototype.clearFlag = function(flag2) {
      var flags = this.getFlags();
      this.setFlags(flags & ~flag2);
    };
    PDFAnnotation2.prototype.setFlagTo = function(flag2, enable) {
      if (enable)
        this.setFlag(flag2);
      else
        this.clearFlag(flag2);
    };
    PDFAnnotation2.fromDict = function(dict) {
      return new PDFAnnotation2(dict);
    };
    return PDFAnnotation2;
  })()
);
var AppearanceCharacteristics = (
  /** @class */
  (function() {
    function AppearanceCharacteristics2(dict) {
      this.dict = dict;
    }
    AppearanceCharacteristics2.prototype.R = function() {
      var R = this.dict.lookup(PDFName.of("R"));
      if (R instanceof PDFNumber)
        return R;
      return void 0;
    };
    AppearanceCharacteristics2.prototype.BC = function() {
      var BC = this.dict.lookup(PDFName.of("BC"));
      if (BC instanceof PDFArray)
        return BC;
      return void 0;
    };
    AppearanceCharacteristics2.prototype.BG = function() {
      var BG = this.dict.lookup(PDFName.of("BG"));
      if (BG instanceof PDFArray)
        return BG;
      return void 0;
    };
    AppearanceCharacteristics2.prototype.CA = function() {
      var CA = this.dict.lookup(PDFName.of("CA"));
      if (CA instanceof PDFHexString || CA instanceof PDFString)
        return CA;
      return void 0;
    };
    AppearanceCharacteristics2.prototype.RC = function() {
      var RC = this.dict.lookup(PDFName.of("RC"));
      if (RC instanceof PDFHexString || RC instanceof PDFString)
        return RC;
      return void 0;
    };
    AppearanceCharacteristics2.prototype.AC = function() {
      var AC = this.dict.lookup(PDFName.of("AC"));
      if (AC instanceof PDFHexString || AC instanceof PDFString)
        return AC;
      return void 0;
    };
    AppearanceCharacteristics2.prototype.getRotation = function() {
      var _a;
      return (_a = this.R()) === null || _a === void 0 ? void 0 : _a.asNumber();
    };
    AppearanceCharacteristics2.prototype.getBorderColor = function() {
      var BC = this.BC();
      if (!BC)
        return void 0;
      var components = [];
      for (var idx = 0, len = BC === null || BC === void 0 ? void 0 : BC.size(); idx < len; idx++) {
        var component = BC.get(idx);
        if (component instanceof PDFNumber)
          components.push(component.asNumber());
      }
      return components;
    };
    AppearanceCharacteristics2.prototype.getBackgroundColor = function() {
      var BG = this.BG();
      if (!BG)
        return void 0;
      var components = [];
      for (var idx = 0, len = BG === null || BG === void 0 ? void 0 : BG.size(); idx < len; idx++) {
        var component = BG.get(idx);
        if (component instanceof PDFNumber)
          components.push(component.asNumber());
      }
      return components;
    };
    AppearanceCharacteristics2.prototype.getCaptions = function() {
      var CA = this.CA();
      var RC = this.RC();
      var AC = this.AC();
      return {
        normal: CA === null || CA === void 0 ? void 0 : CA.decodeText(),
        rollover: RC === null || RC === void 0 ? void 0 : RC.decodeText(),
        down: AC === null || AC === void 0 ? void 0 : AC.decodeText()
      };
    };
    AppearanceCharacteristics2.prototype.setRotation = function(rotation) {
      var R = this.dict.context.obj(rotation);
      this.dict.set(PDFName.of("R"), R);
    };
    AppearanceCharacteristics2.prototype.setBorderColor = function(color) {
      var BC = this.dict.context.obj(color);
      this.dict.set(PDFName.of("BC"), BC);
    };
    AppearanceCharacteristics2.prototype.setBackgroundColor = function(color) {
      var BG = this.dict.context.obj(color);
      this.dict.set(PDFName.of("BG"), BG);
    };
    AppearanceCharacteristics2.prototype.setCaptions = function(captions) {
      var CA = PDFHexString.fromText(captions.normal);
      this.dict.set(PDFName.of("CA"), CA);
      if (captions.rollover) {
        var RC = PDFHexString.fromText(captions.rollover);
        this.dict.set(PDFName.of("RC"), RC);
      } else {
        this.dict.delete(PDFName.of("RC"));
      }
      if (captions.down) {
        var AC = PDFHexString.fromText(captions.down);
        this.dict.set(PDFName.of("AC"), AC);
      } else {
        this.dict.delete(PDFName.of("AC"));
      }
    };
    AppearanceCharacteristics2.fromDict = function(dict) {
      return new AppearanceCharacteristics2(dict);
    };
    return AppearanceCharacteristics2;
  })()
);
var PDFWidgetAnnotation = (
  /** @class */
  (function(_super) {
    __extends(PDFWidgetAnnotation2, _super);
    function PDFWidgetAnnotation2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFWidgetAnnotation2.prototype.MK = function() {
      var MK = this.dict.lookup(PDFName.of("MK"));
      if (MK instanceof PDFDict)
        return MK;
      return void 0;
    };
    PDFWidgetAnnotation2.prototype.BS = function() {
      var BS = this.dict.lookup(PDFName.of("BS"));
      if (BS instanceof PDFDict)
        return BS;
      return void 0;
    };
    PDFWidgetAnnotation2.prototype.DA = function() {
      var da = this.dict.lookup(PDFName.of("DA"));
      if (da instanceof PDFString || da instanceof PDFHexString)
        return da;
      return void 0;
    };
    PDFWidgetAnnotation2.prototype.P = function() {
      var P = this.dict.get(PDFName.of("P"));
      if (P instanceof PDFRef)
        return P;
      return void 0;
    };
    PDFWidgetAnnotation2.prototype.setP = function(page) {
      this.dict.set(PDFName.of("P"), page);
    };
    PDFWidgetAnnotation2.prototype.setDefaultAppearance = function(appearance) {
      this.dict.set(PDFName.of("DA"), PDFString.of(appearance));
    };
    PDFWidgetAnnotation2.prototype.getDefaultAppearance = function() {
      var DA = this.DA();
      if (DA instanceof PDFHexString) {
        return DA.decodeText();
      }
      return DA === null || DA === void 0 ? void 0 : DA.asString();
    };
    PDFWidgetAnnotation2.prototype.getAppearanceCharacteristics = function() {
      var MK = this.MK();
      if (MK)
        return AppearanceCharacteristics.fromDict(MK);
      return void 0;
    };
    PDFWidgetAnnotation2.prototype.getOrCreateAppearanceCharacteristics = function() {
      var MK = this.MK();
      if (MK)
        return AppearanceCharacteristics.fromDict(MK);
      var ac = AppearanceCharacteristics.fromDict(this.dict.context.obj({}));
      this.dict.set(PDFName.of("MK"), ac.dict);
      return ac;
    };
    PDFWidgetAnnotation2.prototype.getBorderStyle = function() {
      var BS = this.BS();
      if (BS)
        return BorderStyle.fromDict(BS);
      return void 0;
    };
    PDFWidgetAnnotation2.prototype.getOrCreateBorderStyle = function() {
      var BS = this.BS();
      if (BS)
        return BorderStyle.fromDict(BS);
      var bs = BorderStyle.fromDict(this.dict.context.obj({}));
      this.dict.set(PDFName.of("BS"), bs.dict);
      return bs;
    };
    PDFWidgetAnnotation2.prototype.getOnValue = function() {
      var _a;
      var normal = (_a = this.getAppearances()) === null || _a === void 0 ? void 0 : _a.normal;
      if (normal instanceof PDFDict) {
        var keys = normal.keys();
        for (var idx = 0, len = keys.length; idx < len; idx++) {
          var key = keys[idx];
          if (key !== PDFName.of("Off"))
            return key;
        }
      }
      return void 0;
    };
    PDFWidgetAnnotation2.fromDict = function(dict) {
      return new PDFWidgetAnnotation2(dict);
    };
    PDFWidgetAnnotation2.create = function(context, parent) {
      var dict = context.obj({
        Type: "Annot",
        Subtype: "Widget",
        Rect: [0, 0, 0, 0],
        Parent: parent
      });
      return new PDFWidgetAnnotation2(dict);
    };
    return PDFWidgetAnnotation2;
  })(PDFAnnotation)
);
var PDFAcroTerminal = (
  /** @class */
  (function(_super) {
    __extends(PDFAcroTerminal2, _super);
    function PDFAcroTerminal2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroTerminal2.prototype.FT = function() {
      var nameOrRef = this.getInheritableAttribute(PDFName.of("FT"));
      return this.dict.context.lookup(nameOrRef, PDFName);
    };
    PDFAcroTerminal2.prototype.getWidgets = function() {
      var kidDicts = this.Kids();
      if (!kidDicts)
        return [PDFWidgetAnnotation.fromDict(this.dict)];
      var widgets = new Array(kidDicts.size());
      for (var idx = 0, len = kidDicts.size(); idx < len; idx++) {
        var dict = kidDicts.lookup(idx, PDFDict);
        widgets[idx] = PDFWidgetAnnotation.fromDict(dict);
      }
      return widgets;
    };
    PDFAcroTerminal2.prototype.addWidget = function(ref) {
      var Kids = this.normalizedEntries().Kids;
      Kids.push(ref);
    };
    PDFAcroTerminal2.prototype.removeWidget = function(idx) {
      var kidDicts = this.Kids();
      if (!kidDicts) {
        if (idx !== 0)
          throw new IndexOutOfBoundsError(idx, 0, 0);
        this.setKids([]);
      } else {
        if (idx < 0 || idx > kidDicts.size()) {
          throw new IndexOutOfBoundsError(idx, 0, kidDicts.size());
        }
        kidDicts.remove(idx);
      }
    };
    PDFAcroTerminal2.prototype.normalizedEntries = function() {
      var Kids = this.Kids();
      if (!Kids) {
        Kids = this.dict.context.obj([this.ref]);
        this.dict.set(PDFName.of("Kids"), Kids);
      }
      return { Kids };
    };
    PDFAcroTerminal2.fromDict = function(dict, ref) {
      return new PDFAcroTerminal2(dict, ref);
    };
    return PDFAcroTerminal2;
  })(PDFAcroField)
);
var PDFAcroButton = (
  /** @class */
  (function(_super) {
    __extends(PDFAcroButton2, _super);
    function PDFAcroButton2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroButton2.prototype.Opt = function() {
      return this.dict.lookupMaybe(PDFName.of("Opt"), PDFString, PDFHexString, PDFArray);
    };
    PDFAcroButton2.prototype.setOpt = function(opt) {
      this.dict.set(PDFName.of("Opt"), this.dict.context.obj(opt));
    };
    PDFAcroButton2.prototype.getExportValues = function() {
      var opt = this.Opt();
      if (!opt)
        return void 0;
      if (opt instanceof PDFString || opt instanceof PDFHexString) {
        return [opt];
      }
      var values2 = [];
      for (var idx = 0, len = opt.size(); idx < len; idx++) {
        var value = opt.lookup(idx);
        if (value instanceof PDFString || value instanceof PDFHexString) {
          values2.push(value);
        }
      }
      return values2;
    };
    PDFAcroButton2.prototype.removeExportValue = function(idx) {
      var opt = this.Opt();
      if (!opt)
        return;
      if (opt instanceof PDFString || opt instanceof PDFHexString) {
        if (idx !== 0)
          throw new IndexOutOfBoundsError(idx, 0, 0);
        this.setOpt([]);
      } else {
        if (idx < 0 || idx > opt.size()) {
          throw new IndexOutOfBoundsError(idx, 0, opt.size());
        }
        opt.remove(idx);
      }
    };
    PDFAcroButton2.prototype.normalizeExportValues = function() {
      var _a, _b, _c, _d;
      var exportValues = (_a = this.getExportValues()) !== null && _a !== void 0 ? _a : [];
      var Opt = [];
      var widgets = this.getWidgets();
      for (var idx = 0, len = widgets.length; idx < len; idx++) {
        var widget = widgets[idx];
        var exportVal = (_b = exportValues[idx]) !== null && _b !== void 0 ? _b : PDFHexString.fromText((_d = (_c = widget.getOnValue()) === null || _c === void 0 ? void 0 : _c.decodeText()) !== null && _d !== void 0 ? _d : "");
        Opt.push(exportVal);
      }
      this.setOpt(Opt);
    };
    PDFAcroButton2.prototype.addOpt = function(opt, useExistingOptIdx) {
      var _a;
      this.normalizeExportValues();
      var optText = opt.decodeText();
      var existingIdx;
      if (useExistingOptIdx) {
        var exportValues = (_a = this.getExportValues()) !== null && _a !== void 0 ? _a : [];
        for (var idx = 0, len = exportValues.length; idx < len; idx++) {
          var exportVal = exportValues[idx];
          if (exportVal.decodeText() === optText)
            existingIdx = idx;
        }
      }
      var Opt = this.Opt();
      Opt.push(opt);
      return existingIdx !== null && existingIdx !== void 0 ? existingIdx : Opt.size() - 1;
    };
    PDFAcroButton2.prototype.addWidgetWithOpt = function(widget, opt, useExistingOptIdx) {
      var optIdx = this.addOpt(opt, useExistingOptIdx);
      var apStateValue = PDFName.of(String(optIdx));
      this.addWidget(widget);
      return apStateValue;
    };
    return PDFAcroButton2;
  })(PDFAcroTerminal)
);
var PDFAcroCheckBox = (
  /** @class */
  (function(_super) {
    __extends(PDFAcroCheckBox2, _super);
    function PDFAcroCheckBox2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroCheckBox2.prototype.setValue = function(value) {
      var _a;
      var onValue = (_a = this.getOnValue()) !== null && _a !== void 0 ? _a : PDFName.of("Yes");
      if (value !== onValue && value !== PDFName.of("Off")) {
        throw new InvalidAcroFieldValueError();
      }
      this.dict.set(PDFName.of("V"), value);
      var widgets = this.getWidgets();
      for (var idx = 0, len = widgets.length; idx < len; idx++) {
        var widget = widgets[idx];
        var state = widget.getOnValue() === value ? value : PDFName.of("Off");
        widget.setAppearanceState(state);
      }
    };
    PDFAcroCheckBox2.prototype.getValue = function() {
      var v = this.V();
      if (v instanceof PDFName)
        return v;
      return PDFName.of("Off");
    };
    PDFAcroCheckBox2.prototype.getOnValue = function() {
      var widget = this.getWidgets()[0];
      return widget === null || widget === void 0 ? void 0 : widget.getOnValue();
    };
    PDFAcroCheckBox2.fromDict = function(dict, ref) {
      return new PDFAcroCheckBox2(dict, ref);
    };
    PDFAcroCheckBox2.create = function(context) {
      var dict = context.obj({
        FT: "Btn",
        Kids: []
      });
      var ref = context.register(dict);
      return new PDFAcroCheckBox2(dict, ref);
    };
    return PDFAcroCheckBox2;
  })(PDFAcroButton)
);
var flag$1 = function(bitIndex) {
  return 1 << bitIndex;
};
var AcroFieldFlags;
(function(AcroFieldFlags2) {
  AcroFieldFlags2[AcroFieldFlags2["ReadOnly"] = flag$1(1 - 1)] = "ReadOnly";
  AcroFieldFlags2[AcroFieldFlags2["Required"] = flag$1(2 - 1)] = "Required";
  AcroFieldFlags2[AcroFieldFlags2["NoExport"] = flag$1(3 - 1)] = "NoExport";
})(AcroFieldFlags || (AcroFieldFlags = {}));
var AcroButtonFlags;
(function(AcroButtonFlags2) {
  AcroButtonFlags2[AcroButtonFlags2["NoToggleToOff"] = flag$1(15 - 1)] = "NoToggleToOff";
  AcroButtonFlags2[AcroButtonFlags2["Radio"] = flag$1(16 - 1)] = "Radio";
  AcroButtonFlags2[AcroButtonFlags2["PushButton"] = flag$1(17 - 1)] = "PushButton";
  AcroButtonFlags2[AcroButtonFlags2["RadiosInUnison"] = flag$1(26 - 1)] = "RadiosInUnison";
})(AcroButtonFlags || (AcroButtonFlags = {}));
var AcroTextFlags;
(function(AcroTextFlags2) {
  AcroTextFlags2[AcroTextFlags2["Multiline"] = flag$1(13 - 1)] = "Multiline";
  AcroTextFlags2[AcroTextFlags2["Password"] = flag$1(14 - 1)] = "Password";
  AcroTextFlags2[AcroTextFlags2["FileSelect"] = flag$1(21 - 1)] = "FileSelect";
  AcroTextFlags2[AcroTextFlags2["DoNotSpellCheck"] = flag$1(23 - 1)] = "DoNotSpellCheck";
  AcroTextFlags2[AcroTextFlags2["DoNotScroll"] = flag$1(24 - 1)] = "DoNotScroll";
  AcroTextFlags2[AcroTextFlags2["Comb"] = flag$1(25 - 1)] = "Comb";
  AcroTextFlags2[AcroTextFlags2["RichText"] = flag$1(26 - 1)] = "RichText";
})(AcroTextFlags || (AcroTextFlags = {}));
var AcroChoiceFlags;
(function(AcroChoiceFlags2) {
  AcroChoiceFlags2[AcroChoiceFlags2["Combo"] = flag$1(18 - 1)] = "Combo";
  AcroChoiceFlags2[AcroChoiceFlags2["Edit"] = flag$1(19 - 1)] = "Edit";
  AcroChoiceFlags2[AcroChoiceFlags2["Sort"] = flag$1(20 - 1)] = "Sort";
  AcroChoiceFlags2[AcroChoiceFlags2["MultiSelect"] = flag$1(22 - 1)] = "MultiSelect";
  AcroChoiceFlags2[AcroChoiceFlags2["DoNotSpellCheck"] = flag$1(23 - 1)] = "DoNotSpellCheck";
  AcroChoiceFlags2[AcroChoiceFlags2["CommitOnSelChange"] = flag$1(27 - 1)] = "CommitOnSelChange";
})(AcroChoiceFlags || (AcroChoiceFlags = {}));
var PDFAcroChoice = (
  /** @class */
  (function(_super) {
    __extends(PDFAcroChoice2, _super);
    function PDFAcroChoice2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroChoice2.prototype.setValues = function(values2) {
      if (this.hasFlag(AcroChoiceFlags.Combo) && !this.hasFlag(AcroChoiceFlags.Edit) && !this.valuesAreValid(values2)) {
        throw new InvalidAcroFieldValueError();
      }
      if (values2.length === 0) {
        this.dict.delete(PDFName.of("V"));
      }
      if (values2.length === 1) {
        this.dict.set(PDFName.of("V"), values2[0]);
      }
      if (values2.length > 1) {
        if (!this.hasFlag(AcroChoiceFlags.MultiSelect)) {
          throw new MultiSelectValueError();
        }
        this.dict.set(PDFName.of("V"), this.dict.context.obj(values2));
      }
      this.updateSelectedIndices(values2);
    };
    PDFAcroChoice2.prototype.valuesAreValid = function(values2) {
      var options = this.getOptions();
      var _loop_1 = function(idx2, len2) {
        var val = values2[idx2].decodeText();
        if (!options.find(function(o) {
          return val === (o.display || o.value).decodeText();
        })) {
          return { value: false };
        }
      };
      for (var idx = 0, len = values2.length; idx < len; idx++) {
        var state_1 = _loop_1(idx);
        if (typeof state_1 === "object")
          return state_1.value;
      }
      return true;
    };
    PDFAcroChoice2.prototype.updateSelectedIndices = function(values2) {
      if (values2.length > 1) {
        var indices = new Array(values2.length);
        var options = this.getOptions();
        var _loop_2 = function(idx2, len2) {
          var val = values2[idx2].decodeText();
          indices[idx2] = options.findIndex(function(o) {
            return val === (o.display || o.value).decodeText();
          });
        };
        for (var idx = 0, len = values2.length; idx < len; idx++) {
          _loop_2(idx, len);
        }
        this.dict.set(PDFName.of("I"), this.dict.context.obj(indices.sort()));
      } else {
        this.dict.delete(PDFName.of("I"));
      }
    };
    PDFAcroChoice2.prototype.getValues = function() {
      var v = this.V();
      if (v instanceof PDFString || v instanceof PDFHexString)
        return [v];
      if (v instanceof PDFArray) {
        var values2 = [];
        for (var idx = 0, len = v.size(); idx < len; idx++) {
          var value = v.lookup(idx);
          if (value instanceof PDFString || value instanceof PDFHexString) {
            values2.push(value);
          }
        }
        return values2;
      }
      return [];
    };
    PDFAcroChoice2.prototype.Opt = function() {
      return this.dict.lookupMaybe(PDFName.of("Opt"), PDFString, PDFHexString, PDFArray);
    };
    PDFAcroChoice2.prototype.setOptions = function(options) {
      var newOpt = new Array(options.length);
      for (var idx = 0, len = options.length; idx < len; idx++) {
        var _a = options[idx], value = _a.value, display = _a.display;
        newOpt[idx] = this.dict.context.obj([value, display || value]);
      }
      this.dict.set(PDFName.of("Opt"), this.dict.context.obj(newOpt));
    };
    PDFAcroChoice2.prototype.getOptions = function() {
      var Opt = this.Opt();
      if (Opt instanceof PDFString || Opt instanceof PDFHexString) {
        return [{ value: Opt, display: Opt }];
      }
      if (Opt instanceof PDFArray) {
        var res = [];
        for (var idx = 0, len = Opt.size(); idx < len; idx++) {
          var item = Opt.lookup(idx);
          if (item instanceof PDFString || item instanceof PDFHexString) {
            res.push({ value: item, display: item });
          }
          if (item instanceof PDFArray) {
            if (item.size() > 0) {
              var first = item.lookup(0, PDFString, PDFHexString);
              var second = item.lookupMaybe(1, PDFString, PDFHexString);
              res.push({ value: first, display: second || first });
            }
          }
        }
        return res;
      }
      return [];
    };
    return PDFAcroChoice2;
  })(PDFAcroTerminal)
);
var PDFAcroComboBox = (
  /** @class */
  (function(_super) {
    __extends(PDFAcroComboBox2, _super);
    function PDFAcroComboBox2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroComboBox2.fromDict = function(dict, ref) {
      return new PDFAcroComboBox2(dict, ref);
    };
    PDFAcroComboBox2.create = function(context) {
      var dict = context.obj({
        FT: "Ch",
        Ff: AcroChoiceFlags.Combo,
        Kids: []
      });
      var ref = context.register(dict);
      return new PDFAcroComboBox2(dict, ref);
    };
    return PDFAcroComboBox2;
  })(PDFAcroChoice)
);
var PDFAcroNonTerminal = (
  /** @class */
  (function(_super) {
    __extends(PDFAcroNonTerminal2, _super);
    function PDFAcroNonTerminal2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroNonTerminal2.prototype.addField = function(field) {
      var Kids = this.normalizedEntries().Kids;
      Kids === null || Kids === void 0 ? void 0 : Kids.push(field);
    };
    PDFAcroNonTerminal2.prototype.normalizedEntries = function() {
      var Kids = this.Kids();
      if (!Kids) {
        Kids = this.dict.context.obj([]);
        this.dict.set(PDFName.of("Kids"), Kids);
      }
      return { Kids };
    };
    PDFAcroNonTerminal2.fromDict = function(dict, ref) {
      return new PDFAcroNonTerminal2(dict, ref);
    };
    PDFAcroNonTerminal2.create = function(context) {
      var dict = context.obj({});
      var ref = context.register(dict);
      return new PDFAcroNonTerminal2(dict, ref);
    };
    return PDFAcroNonTerminal2;
  })(PDFAcroField)
);
var PDFAcroSignature = (
  /** @class */
  (function(_super) {
    __extends(PDFAcroSignature2, _super);
    function PDFAcroSignature2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroSignature2.fromDict = function(dict, ref) {
      return new PDFAcroSignature2(dict, ref);
    };
    return PDFAcroSignature2;
  })(PDFAcroTerminal)
);
var PDFAcroText = (
  /** @class */
  (function(_super) {
    __extends(PDFAcroText2, _super);
    function PDFAcroText2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroText2.prototype.MaxLen = function() {
      var maxLen = this.dict.lookup(PDFName.of("MaxLen"));
      if (maxLen instanceof PDFNumber)
        return maxLen;
      return void 0;
    };
    PDFAcroText2.prototype.Q = function() {
      var q = this.dict.lookup(PDFName.of("Q"));
      if (q instanceof PDFNumber)
        return q;
      return void 0;
    };
    PDFAcroText2.prototype.setMaxLength = function(maxLength) {
      this.dict.set(PDFName.of("MaxLen"), PDFNumber.of(maxLength));
    };
    PDFAcroText2.prototype.removeMaxLength = function() {
      this.dict.delete(PDFName.of("MaxLen"));
    };
    PDFAcroText2.prototype.getMaxLength = function() {
      var _a;
      return (_a = this.MaxLen()) === null || _a === void 0 ? void 0 : _a.asNumber();
    };
    PDFAcroText2.prototype.setQuadding = function(quadding) {
      this.dict.set(PDFName.of("Q"), PDFNumber.of(quadding));
    };
    PDFAcroText2.prototype.getQuadding = function() {
      var _a;
      return (_a = this.Q()) === null || _a === void 0 ? void 0 : _a.asNumber();
    };
    PDFAcroText2.prototype.setValue = function(value) {
      this.dict.set(PDFName.of("V"), value);
    };
    PDFAcroText2.prototype.removeValue = function() {
      this.dict.delete(PDFName.of("V"));
    };
    PDFAcroText2.prototype.getValue = function() {
      var v = this.V();
      if (v instanceof PDFString || v instanceof PDFHexString)
        return v;
      return void 0;
    };
    PDFAcroText2.fromDict = function(dict, ref) {
      return new PDFAcroText2(dict, ref);
    };
    PDFAcroText2.create = function(context) {
      var dict = context.obj({
        FT: "Tx",
        Kids: []
      });
      var ref = context.register(dict);
      return new PDFAcroText2(dict, ref);
    };
    return PDFAcroText2;
  })(PDFAcroTerminal)
);
var PDFAcroPushButton = (
  /** @class */
  (function(_super) {
    __extends(PDFAcroPushButton2, _super);
    function PDFAcroPushButton2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroPushButton2.fromDict = function(dict, ref) {
      return new PDFAcroPushButton2(dict, ref);
    };
    PDFAcroPushButton2.create = function(context) {
      var dict = context.obj({
        FT: "Btn",
        Ff: AcroButtonFlags.PushButton,
        Kids: []
      });
      var ref = context.register(dict);
      return new PDFAcroPushButton2(dict, ref);
    };
    return PDFAcroPushButton2;
  })(PDFAcroButton)
);
var PDFAcroRadioButton = (
  /** @class */
  (function(_super) {
    __extends(PDFAcroRadioButton2, _super);
    function PDFAcroRadioButton2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroRadioButton2.prototype.setValue = function(value) {
      var onValues = this.getOnValues();
      if (!onValues.includes(value) && value !== PDFName.of("Off")) {
        throw new InvalidAcroFieldValueError();
      }
      this.dict.set(PDFName.of("V"), value);
      var widgets = this.getWidgets();
      for (var idx = 0, len = widgets.length; idx < len; idx++) {
        var widget = widgets[idx];
        var state = widget.getOnValue() === value ? value : PDFName.of("Off");
        widget.setAppearanceState(state);
      }
    };
    PDFAcroRadioButton2.prototype.getValue = function() {
      var v = this.V();
      if (v instanceof PDFName)
        return v;
      return PDFName.of("Off");
    };
    PDFAcroRadioButton2.prototype.getOnValues = function() {
      var widgets = this.getWidgets();
      var onValues = [];
      for (var idx = 0, len = widgets.length; idx < len; idx++) {
        var onValue = widgets[idx].getOnValue();
        if (onValue)
          onValues.push(onValue);
      }
      return onValues;
    };
    PDFAcroRadioButton2.fromDict = function(dict, ref) {
      return new PDFAcroRadioButton2(dict, ref);
    };
    PDFAcroRadioButton2.create = function(context) {
      var dict = context.obj({
        FT: "Btn",
        Ff: AcroButtonFlags.Radio,
        Kids: []
      });
      var ref = context.register(dict);
      return new PDFAcroRadioButton2(dict, ref);
    };
    return PDFAcroRadioButton2;
  })(PDFAcroButton)
);
var PDFAcroListBox = (
  /** @class */
  (function(_super) {
    __extends(PDFAcroListBox2, _super);
    function PDFAcroListBox2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroListBox2.fromDict = function(dict, ref) {
      return new PDFAcroListBox2(dict, ref);
    };
    PDFAcroListBox2.create = function(context) {
      var dict = context.obj({
        FT: "Ch",
        Kids: []
      });
      var ref = context.register(dict);
      return new PDFAcroListBox2(dict, ref);
    };
    return PDFAcroListBox2;
  })(PDFAcroChoice)
);
var createPDFAcroFields = function(kidDicts) {
  if (!kidDicts)
    return [];
  var kids = [];
  for (var idx = 0, len = kidDicts.size(); idx < len; idx++) {
    var ref = kidDicts.get(idx);
    var dict = kidDicts.lookup(idx);
    if (ref instanceof PDFRef && dict instanceof PDFDict) {
      kids.push([createPDFAcroField(dict, ref), ref]);
    }
  }
  return kids;
};
var createPDFAcroField = function(dict, ref) {
  var isNonTerminal = isNonTerminalAcroField(dict);
  if (isNonTerminal)
    return PDFAcroNonTerminal.fromDict(dict, ref);
  return createPDFAcroTerminal(dict, ref);
};
var isNonTerminalAcroField = function(dict) {
  var kids = dict.lookup(PDFName.of("Kids"));
  if (kids instanceof PDFArray) {
    for (var idx = 0, len = kids.size(); idx < len; idx++) {
      var kid = kids.lookup(idx);
      var kidIsField = kid instanceof PDFDict && kid.has(PDFName.of("T"));
      if (kidIsField)
        return true;
    }
  }
  return false;
};
var createPDFAcroTerminal = function(dict, ref) {
  var ftNameOrRef = getInheritableAttribute(dict, PDFName.of("FT"));
  var type = dict.context.lookup(ftNameOrRef, PDFName);
  if (type === PDFName.of("Btn"))
    return createPDFAcroButton(dict, ref);
  if (type === PDFName.of("Ch"))
    return createPDFAcroChoice(dict, ref);
  if (type === PDFName.of("Tx"))
    return PDFAcroText.fromDict(dict, ref);
  if (type === PDFName.of("Sig"))
    return PDFAcroSignature.fromDict(dict, ref);
  return PDFAcroTerminal.fromDict(dict, ref);
};
var createPDFAcroButton = function(dict, ref) {
  var _a;
  var ffNumberOrRef = getInheritableAttribute(dict, PDFName.of("Ff"));
  var ffNumber = dict.context.lookupMaybe(ffNumberOrRef, PDFNumber);
  var flags = (_a = ffNumber === null || ffNumber === void 0 ? void 0 : ffNumber.asNumber()) !== null && _a !== void 0 ? _a : 0;
  if (flagIsSet(flags, AcroButtonFlags.PushButton)) {
    return PDFAcroPushButton.fromDict(dict, ref);
  } else if (flagIsSet(flags, AcroButtonFlags.Radio)) {
    return PDFAcroRadioButton.fromDict(dict, ref);
  } else {
    return PDFAcroCheckBox.fromDict(dict, ref);
  }
};
var createPDFAcroChoice = function(dict, ref) {
  var _a;
  var ffNumberOrRef = getInheritableAttribute(dict, PDFName.of("Ff"));
  var ffNumber = dict.context.lookupMaybe(ffNumberOrRef, PDFNumber);
  var flags = (_a = ffNumber === null || ffNumber === void 0 ? void 0 : ffNumber.asNumber()) !== null && _a !== void 0 ? _a : 0;
  if (flagIsSet(flags, AcroChoiceFlags.Combo)) {
    return PDFAcroComboBox.fromDict(dict, ref);
  } else {
    return PDFAcroListBox.fromDict(dict, ref);
  }
};
var flagIsSet = function(flags, flag2) {
  return (flags & flag2) !== 0;
};
var getInheritableAttribute = function(startNode, name) {
  var attribute;
  ascend(startNode, function(node) {
    if (!attribute)
      attribute = node.get(name);
  });
  return attribute;
};
var ascend = function(startNode, visitor) {
  visitor(startNode);
  var Parent = startNode.lookupMaybe(PDFName.of("Parent"), PDFDict);
  if (Parent)
    ascend(Parent, visitor);
};
var PDFAcroForm = (
  /** @class */
  (function() {
    function PDFAcroForm2(dict) {
      this.dict = dict;
    }
    PDFAcroForm2.prototype.Fields = function() {
      var fields = this.dict.lookup(PDFName.of("Fields"));
      if (fields instanceof PDFArray)
        return fields;
      return void 0;
    };
    PDFAcroForm2.prototype.getFields = function() {
      var Fields = this.normalizedEntries().Fields;
      var fields = new Array(Fields.size());
      for (var idx = 0, len = Fields.size(); idx < len; idx++) {
        var ref = Fields.get(idx);
        var dict = Fields.lookup(idx, PDFDict);
        fields[idx] = [createPDFAcroField(dict, ref), ref];
      }
      return fields;
    };
    PDFAcroForm2.prototype.getAllFields = function() {
      var allFields = [];
      var pushFields = function(fields) {
        if (!fields)
          return;
        for (var idx = 0, len = fields.length; idx < len; idx++) {
          var field = fields[idx];
          allFields.push(field);
          var fieldModel = field[0];
          if (fieldModel instanceof PDFAcroNonTerminal) {
            pushFields(createPDFAcroFields(fieldModel.Kids()));
          }
        }
      };
      pushFields(this.getFields());
      return allFields;
    };
    PDFAcroForm2.prototype.addField = function(field) {
      var Fields = this.normalizedEntries().Fields;
      Fields === null || Fields === void 0 ? void 0 : Fields.push(field);
    };
    PDFAcroForm2.prototype.removeField = function(field) {
      var parent = field.getParent();
      var fields = parent === void 0 ? this.normalizedEntries().Fields : parent.Kids();
      var index = fields === null || fields === void 0 ? void 0 : fields.indexOf(field.ref);
      if (fields === void 0 || index === void 0) {
        throw new Error("Tried to remove inexistent field " + field.getFullyQualifiedName());
      }
      fields.remove(index);
      if (parent !== void 0 && fields.size() === 0) {
        this.removeField(parent);
      }
    };
    PDFAcroForm2.prototype.normalizedEntries = function() {
      var Fields = this.Fields();
      if (!Fields) {
        Fields = this.dict.context.obj([]);
        this.dict.set(PDFName.of("Fields"), Fields);
      }
      return { Fields };
    };
    PDFAcroForm2.fromDict = function(dict) {
      return new PDFAcroForm2(dict);
    };
    PDFAcroForm2.create = function(context) {
      var dict = context.obj({ Fields: [] });
      return new PDFAcroForm2(dict);
    };
    return PDFAcroForm2;
  })()
);
var PDFCatalog = (
  /** @class */
  (function(_super) {
    __extends(PDFCatalog2, _super);
    function PDFCatalog2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFCatalog2.prototype.Pages = function() {
      return this.lookup(PDFName.of("Pages"), PDFDict);
    };
    PDFCatalog2.prototype.AcroForm = function() {
      return this.lookupMaybe(PDFName.of("AcroForm"), PDFDict);
    };
    PDFCatalog2.prototype.getAcroForm = function() {
      var dict = this.AcroForm();
      if (!dict)
        return void 0;
      return PDFAcroForm.fromDict(dict);
    };
    PDFCatalog2.prototype.getOrCreateAcroForm = function() {
      var acroForm = this.getAcroForm();
      if (!acroForm) {
        acroForm = PDFAcroForm.create(this.context);
        var acroFormRef = this.context.register(acroForm.dict);
        this.set(PDFName.of("AcroForm"), acroFormRef);
      }
      return acroForm;
    };
    PDFCatalog2.prototype.ViewerPreferences = function() {
      return this.lookupMaybe(PDFName.of("ViewerPreferences"), PDFDict);
    };
    PDFCatalog2.prototype.getViewerPreferences = function() {
      var dict = this.ViewerPreferences();
      if (!dict)
        return void 0;
      return ViewerPreferences.fromDict(dict);
    };
    PDFCatalog2.prototype.getOrCreateViewerPreferences = function() {
      var viewerPrefs = this.getViewerPreferences();
      if (!viewerPrefs) {
        viewerPrefs = ViewerPreferences.create(this.context);
        var viewerPrefsRef = this.context.register(viewerPrefs.dict);
        this.set(PDFName.of("ViewerPreferences"), viewerPrefsRef);
      }
      return viewerPrefs;
    };
    PDFCatalog2.prototype.insertLeafNode = function(leafRef, index) {
      var pagesRef = this.get(PDFName.of("Pages"));
      var maybeParentRef = this.Pages().insertLeafNode(leafRef, index);
      return maybeParentRef || pagesRef;
    };
    PDFCatalog2.prototype.removeLeafNode = function(index) {
      this.Pages().removeLeafNode(index);
    };
    PDFCatalog2.withContextAndPages = function(context, pages) {
      var dict = /* @__PURE__ */ new Map();
      dict.set(PDFName.of("Type"), PDFName.of("Catalog"));
      dict.set(PDFName.of("Pages"), pages);
      return new PDFCatalog2(dict, context);
    };
    PDFCatalog2.fromMapWithContext = function(map, context) {
      return new PDFCatalog2(map, context);
    };
    return PDFCatalog2;
  })(PDFDict)
);
var PDFPageTree = (
  /** @class */
  (function(_super) {
    __extends(PDFPageTree2, _super);
    function PDFPageTree2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFPageTree2.prototype.Parent = function() {
      return this.lookup(PDFName.of("Parent"));
    };
    PDFPageTree2.prototype.Kids = function() {
      return this.lookup(PDFName.of("Kids"), PDFArray);
    };
    PDFPageTree2.prototype.Count = function() {
      return this.lookup(PDFName.of("Count"), PDFNumber);
    };
    PDFPageTree2.prototype.pushTreeNode = function(treeRef) {
      var Kids = this.Kids();
      Kids.push(treeRef);
    };
    PDFPageTree2.prototype.pushLeafNode = function(leafRef) {
      var Kids = this.Kids();
      this.insertLeafKid(Kids.size(), leafRef);
    };
    PDFPageTree2.prototype.insertLeafNode = function(leafRef, targetIndex) {
      var Kids = this.Kids();
      var Count = this.Count().asNumber();
      if (targetIndex > Count) {
        throw new InvalidTargetIndexError(targetIndex, Count);
      }
      var leafsRemainingUntilTarget = targetIndex;
      for (var idx = 0, len = Kids.size(); idx < len; idx++) {
        if (leafsRemainingUntilTarget === 0) {
          this.insertLeafKid(idx, leafRef);
          return void 0;
        }
        var kidRef = Kids.get(idx);
        var kid = this.context.lookup(kidRef);
        if (kid instanceof PDFPageTree2) {
          if (kid.Count().asNumber() > leafsRemainingUntilTarget) {
            return kid.insertLeafNode(leafRef, leafsRemainingUntilTarget) || kidRef;
          } else {
            leafsRemainingUntilTarget -= kid.Count().asNumber();
          }
        }
        if (kid instanceof PDFPageLeaf) {
          leafsRemainingUntilTarget -= 1;
        }
      }
      if (leafsRemainingUntilTarget === 0) {
        this.insertLeafKid(Kids.size(), leafRef);
        return void 0;
      }
      throw new CorruptPageTreeError(targetIndex, "insertLeafNode");
    };
    PDFPageTree2.prototype.removeLeafNode = function(targetIndex, prune) {
      if (prune === void 0) {
        prune = true;
      }
      var Kids = this.Kids();
      var Count = this.Count().asNumber();
      if (targetIndex >= Count) {
        throw new InvalidTargetIndexError(targetIndex, Count);
      }
      var leafsRemainingUntilTarget = targetIndex;
      for (var idx = 0, len = Kids.size(); idx < len; idx++) {
        var kidRef = Kids.get(idx);
        var kid = this.context.lookup(kidRef);
        if (kid instanceof PDFPageTree2) {
          if (kid.Count().asNumber() > leafsRemainingUntilTarget) {
            kid.removeLeafNode(leafsRemainingUntilTarget, prune);
            if (prune && kid.Kids().size() === 0)
              Kids.remove(idx);
            return;
          } else {
            leafsRemainingUntilTarget -= kid.Count().asNumber();
          }
        }
        if (kid instanceof PDFPageLeaf) {
          if (leafsRemainingUntilTarget === 0) {
            this.removeKid(idx);
            return;
          } else {
            leafsRemainingUntilTarget -= 1;
          }
        }
      }
      throw new CorruptPageTreeError(targetIndex, "removeLeafNode");
    };
    PDFPageTree2.prototype.ascend = function(visitor) {
      visitor(this);
      var Parent = this.Parent();
      if (Parent)
        Parent.ascend(visitor);
    };
    PDFPageTree2.prototype.traverse = function(visitor) {
      var Kids = this.Kids();
      for (var idx = 0, len = Kids.size(); idx < len; idx++) {
        var kidRef = Kids.get(idx);
        var kid = this.context.lookup(kidRef);
        if (kid instanceof PDFPageTree2)
          kid.traverse(visitor);
        visitor(kid, kidRef);
      }
    };
    PDFPageTree2.prototype.insertLeafKid = function(kidIdx, leafRef) {
      var Kids = this.Kids();
      this.ascend(function(node) {
        var newCount = node.Count().asNumber() + 1;
        node.set(PDFName.of("Count"), PDFNumber.of(newCount));
      });
      Kids.insert(kidIdx, leafRef);
    };
    PDFPageTree2.prototype.removeKid = function(kidIdx) {
      var Kids = this.Kids();
      var kid = Kids.lookup(kidIdx);
      if (kid instanceof PDFPageLeaf) {
        this.ascend(function(node) {
          var newCount = node.Count().asNumber() - 1;
          node.set(PDFName.of("Count"), PDFNumber.of(newCount));
        });
      }
      Kids.remove(kidIdx);
    };
    PDFPageTree2.withContext = function(context, parent) {
      var dict = /* @__PURE__ */ new Map();
      dict.set(PDFName.of("Type"), PDFName.of("Pages"));
      dict.set(PDFName.of("Kids"), context.obj([]));
      dict.set(PDFName.of("Count"), context.obj(0));
      if (parent)
        dict.set(PDFName.of("Parent"), parent);
      return new PDFPageTree2(dict, context);
    };
    PDFPageTree2.fromMapWithContext = function(map, context) {
      return new PDFPageTree2(map, context);
    };
    return PDFPageTree2;
  })(PDFDict)
);
var IsDigit = new Uint8Array(256);
IsDigit[CharCodes.Zero] = 1;
IsDigit[CharCodes.One] = 1;
IsDigit[CharCodes.Two] = 1;
IsDigit[CharCodes.Three] = 1;
IsDigit[CharCodes.Four] = 1;
IsDigit[CharCodes.Five] = 1;
IsDigit[CharCodes.Six] = 1;
IsDigit[CharCodes.Seven] = 1;
IsDigit[CharCodes.Eight] = 1;
IsDigit[CharCodes.Nine] = 1;
var IsNumericPrefix = new Uint8Array(256);
IsNumericPrefix[CharCodes.Period] = 1;
IsNumericPrefix[CharCodes.Plus] = 1;
IsNumericPrefix[CharCodes.Minus] = 1;
var IsNumeric = new Uint8Array(256);
for (var idx = 0, len = 256; idx < len; idx++) {
  IsNumeric[idx] = IsDigit[idx] || IsNumericPrefix[idx] ? 1 : 0;
}
var Newline$1 = CharCodes.Newline, CarriageReturn$1 = CharCodes.CarriageReturn;
var BaseParser = (
  /** @class */
  (function() {
    function BaseParser2(bytes, capNumbers) {
      if (capNumbers === void 0) {
        capNumbers = false;
      }
      this.bytes = bytes;
      this.capNumbers = capNumbers;
    }
    BaseParser2.prototype.parseRawInt = function() {
      var value = "";
      while (!this.bytes.done()) {
        var byte = this.bytes.peek();
        if (!IsDigit[byte])
          break;
        value += charFromCode(this.bytes.next());
      }
      var numberValue = Number(value);
      if (!value || !isFinite(numberValue)) {
        throw new NumberParsingError(this.bytes.position(), value);
      }
      return numberValue;
    };
    BaseParser2.prototype.parseRawNumber = function() {
      var value = "";
      while (!this.bytes.done()) {
        var byte = this.bytes.peek();
        if (!IsNumeric[byte])
          break;
        value += charFromCode(this.bytes.next());
        if (byte === CharCodes.Period)
          break;
      }
      while (!this.bytes.done()) {
        var byte = this.bytes.peek();
        if (!IsDigit[byte])
          break;
        value += charFromCode(this.bytes.next());
      }
      var numberValue = Number(value);
      if (!value || !isFinite(numberValue)) {
        throw new NumberParsingError(this.bytes.position(), value);
      }
      if (numberValue > Number.MAX_SAFE_INTEGER) {
        if (this.capNumbers) {
          var msg = "Parsed number that is too large for some PDF readers: " + value + ", using Number.MAX_SAFE_INTEGER instead.";
          console.warn(msg);
          return Number.MAX_SAFE_INTEGER;
        } else {
          var msg = "Parsed number that is too large for some PDF readers: " + value + ", not capping.";
          console.warn(msg);
        }
      }
      return numberValue;
    };
    BaseParser2.prototype.skipWhitespace = function() {
      while (!this.bytes.done() && IsWhitespace[this.bytes.peek()]) {
        this.bytes.next();
      }
    };
    BaseParser2.prototype.skipLine = function() {
      while (!this.bytes.done()) {
        var byte = this.bytes.peek();
        if (byte === Newline$1 || byte === CarriageReturn$1)
          return;
        this.bytes.next();
      }
    };
    BaseParser2.prototype.skipComment = function() {
      if (this.bytes.peek() !== CharCodes.Percent)
        return false;
      while (!this.bytes.done()) {
        var byte = this.bytes.peek();
        if (byte === Newline$1 || byte === CarriageReturn$1)
          return true;
        this.bytes.next();
      }
      return true;
    };
    BaseParser2.prototype.skipWhitespaceAndComments = function() {
      this.skipWhitespace();
      while (this.skipComment())
        this.skipWhitespace();
    };
    BaseParser2.prototype.matchKeyword = function(keyword) {
      var initialOffset = this.bytes.offset();
      for (var idx = 0, len = keyword.length; idx < len; idx++) {
        if (this.bytes.done() || this.bytes.next() !== keyword[idx]) {
          this.bytes.moveTo(initialOffset);
          return false;
        }
      }
      return true;
    };
    return BaseParser2;
  })()
);
var ByteStream = (
  /** @class */
  (function() {
    function ByteStream2(bytes) {
      this.idx = 0;
      this.line = 0;
      this.column = 0;
      this.bytes = bytes;
      this.length = this.bytes.length;
    }
    ByteStream2.prototype.moveTo = function(offset) {
      this.idx = offset;
    };
    ByteStream2.prototype.next = function() {
      var byte = this.bytes[this.idx++];
      if (byte === CharCodes.Newline) {
        this.line += 1;
        this.column = 0;
      } else {
        this.column += 1;
      }
      return byte;
    };
    ByteStream2.prototype.assertNext = function(expected) {
      if (this.peek() !== expected) {
        throw new NextByteAssertionError(this.position(), expected, this.peek());
      }
      return this.next();
    };
    ByteStream2.prototype.peek = function() {
      return this.bytes[this.idx];
    };
    ByteStream2.prototype.peekAhead = function(steps) {
      return this.bytes[this.idx + steps];
    };
    ByteStream2.prototype.peekAt = function(offset) {
      return this.bytes[offset];
    };
    ByteStream2.prototype.done = function() {
      return this.idx >= this.length;
    };
    ByteStream2.prototype.offset = function() {
      return this.idx;
    };
    ByteStream2.prototype.slice = function(start, end) {
      return this.bytes.slice(start, end);
    };
    ByteStream2.prototype.position = function() {
      return { line: this.line, column: this.column, offset: this.idx };
    };
    ByteStream2.of = function(bytes) {
      return new ByteStream2(bytes);
    };
    ByteStream2.fromPDFRawStream = function(rawStream) {
      return ByteStream2.of(decodePDFRawStream(rawStream).decode());
    };
    return ByteStream2;
  })()
);
var Space = CharCodes.Space, CarriageReturn = CharCodes.CarriageReturn, Newline = CharCodes.Newline;
var stream = [
  CharCodes.s,
  CharCodes.t,
  CharCodes.r,
  CharCodes.e,
  CharCodes.a,
  CharCodes.m
];
var endstream = [
  CharCodes.e,
  CharCodes.n,
  CharCodes.d,
  CharCodes.s,
  CharCodes.t,
  CharCodes.r,
  CharCodes.e,
  CharCodes.a,
  CharCodes.m
];
var Keywords = {
  header: [
    CharCodes.Percent,
    CharCodes.P,
    CharCodes.D,
    CharCodes.F,
    CharCodes.Dash
  ],
  eof: [
    CharCodes.Percent,
    CharCodes.Percent,
    CharCodes.E,
    CharCodes.O,
    CharCodes.F
  ],
  obj: [CharCodes.o, CharCodes.b, CharCodes.j],
  endobj: [
    CharCodes.e,
    CharCodes.n,
    CharCodes.d,
    CharCodes.o,
    CharCodes.b,
    CharCodes.j
  ],
  xref: [CharCodes.x, CharCodes.r, CharCodes.e, CharCodes.f],
  trailer: [
    CharCodes.t,
    CharCodes.r,
    CharCodes.a,
    CharCodes.i,
    CharCodes.l,
    CharCodes.e,
    CharCodes.r
  ],
  startxref: [
    CharCodes.s,
    CharCodes.t,
    CharCodes.a,
    CharCodes.r,
    CharCodes.t,
    CharCodes.x,
    CharCodes.r,
    CharCodes.e,
    CharCodes.f
  ],
  true: [CharCodes.t, CharCodes.r, CharCodes.u, CharCodes.e],
  false: [CharCodes.f, CharCodes.a, CharCodes.l, CharCodes.s, CharCodes.e],
  null: [CharCodes.n, CharCodes.u, CharCodes.l, CharCodes.l],
  stream,
  streamEOF1: __spreadArrays(stream, [Space, CarriageReturn, Newline]),
  streamEOF2: __spreadArrays(stream, [CarriageReturn, Newline]),
  streamEOF3: __spreadArrays(stream, [CarriageReturn]),
  streamEOF4: __spreadArrays(stream, [Newline]),
  endstream,
  EOF1endstream: __spreadArrays([CarriageReturn, Newline], endstream),
  EOF2endstream: __spreadArrays([CarriageReturn], endstream),
  EOF3endstream: __spreadArrays([Newline], endstream)
};
var PDFObjectParser = (
  /** @class */
  (function(_super) {
    __extends(PDFObjectParser2, _super);
    function PDFObjectParser2(byteStream, context, capNumbers) {
      if (capNumbers === void 0) {
        capNumbers = false;
      }
      var _this = _super.call(this, byteStream, capNumbers) || this;
      _this.context = context;
      return _this;
    }
    PDFObjectParser2.prototype.parseObject = function() {
      this.skipWhitespaceAndComments();
      if (this.matchKeyword(Keywords.true))
        return PDFBool.True;
      if (this.matchKeyword(Keywords.false))
        return PDFBool.False;
      if (this.matchKeyword(Keywords.null))
        return PDFNull$1;
      var byte = this.bytes.peek();
      if (byte === CharCodes.LessThan && this.bytes.peekAhead(1) === CharCodes.LessThan) {
        return this.parseDictOrStream();
      }
      if (byte === CharCodes.LessThan)
        return this.parseHexString();
      if (byte === CharCodes.LeftParen)
        return this.parseString();
      if (byte === CharCodes.ForwardSlash)
        return this.parseName();
      if (byte === CharCodes.LeftSquareBracket)
        return this.parseArray();
      if (IsNumeric[byte])
        return this.parseNumberOrRef();
      throw new PDFObjectParsingError(this.bytes.position(), byte);
    };
    PDFObjectParser2.prototype.parseNumberOrRef = function() {
      var firstNum = this.parseRawNumber();
      this.skipWhitespaceAndComments();
      var lookaheadStart = this.bytes.offset();
      if (IsDigit[this.bytes.peek()]) {
        var secondNum = this.parseRawNumber();
        this.skipWhitespaceAndComments();
        if (this.bytes.peek() === CharCodes.R) {
          this.bytes.assertNext(CharCodes.R);
          return PDFRef.of(firstNum, secondNum);
        }
      }
      this.bytes.moveTo(lookaheadStart);
      return PDFNumber.of(firstNum);
    };
    PDFObjectParser2.prototype.parseHexString = function() {
      var value = "";
      this.bytes.assertNext(CharCodes.LessThan);
      while (!this.bytes.done() && this.bytes.peek() !== CharCodes.GreaterThan) {
        value += charFromCode(this.bytes.next());
      }
      this.bytes.assertNext(CharCodes.GreaterThan);
      return PDFHexString.of(value);
    };
    PDFObjectParser2.prototype.parseString = function() {
      var nestingLvl = 0;
      var isEscaped = false;
      var value = "";
      while (!this.bytes.done()) {
        var byte = this.bytes.next();
        value += charFromCode(byte);
        if (!isEscaped) {
          if (byte === CharCodes.LeftParen)
            nestingLvl += 1;
          if (byte === CharCodes.RightParen)
            nestingLvl -= 1;
        }
        if (byte === CharCodes.BackSlash) {
          isEscaped = !isEscaped;
        } else if (isEscaped) {
          isEscaped = false;
        }
        if (nestingLvl === 0) {
          return PDFString.of(value.substring(1, value.length - 1));
        }
      }
      throw new UnbalancedParenthesisError(this.bytes.position());
    };
    PDFObjectParser2.prototype.parseName = function() {
      this.bytes.assertNext(CharCodes.ForwardSlash);
      var name = "";
      while (!this.bytes.done()) {
        var byte = this.bytes.peek();
        if (IsWhitespace[byte] || IsDelimiter[byte])
          break;
        name += charFromCode(byte);
        this.bytes.next();
      }
      return PDFName.of(name);
    };
    PDFObjectParser2.prototype.parseArray = function() {
      this.bytes.assertNext(CharCodes.LeftSquareBracket);
      this.skipWhitespaceAndComments();
      var pdfArray = PDFArray.withContext(this.context);
      while (this.bytes.peek() !== CharCodes.RightSquareBracket) {
        var element = this.parseObject();
        pdfArray.push(element);
        this.skipWhitespaceAndComments();
      }
      this.bytes.assertNext(CharCodes.RightSquareBracket);
      return pdfArray;
    };
    PDFObjectParser2.prototype.parseDict = function() {
      this.bytes.assertNext(CharCodes.LessThan);
      this.bytes.assertNext(CharCodes.LessThan);
      this.skipWhitespaceAndComments();
      var dict = /* @__PURE__ */ new Map();
      while (!this.bytes.done() && this.bytes.peek() !== CharCodes.GreaterThan && this.bytes.peekAhead(1) !== CharCodes.GreaterThan) {
        var key = this.parseName();
        var value = this.parseObject();
        dict.set(key, value);
        this.skipWhitespaceAndComments();
      }
      this.skipWhitespaceAndComments();
      this.bytes.assertNext(CharCodes.GreaterThan);
      this.bytes.assertNext(CharCodes.GreaterThan);
      var Type = dict.get(PDFName.of("Type"));
      if (Type === PDFName.of("Catalog")) {
        return PDFCatalog.fromMapWithContext(dict, this.context);
      } else if (Type === PDFName.of("Pages")) {
        return PDFPageTree.fromMapWithContext(dict, this.context);
      } else if (Type === PDFName.of("Page")) {
        return PDFPageLeaf.fromMapWithContext(dict, this.context);
      } else {
        return PDFDict.fromMapWithContext(dict, this.context);
      }
    };
    PDFObjectParser2.prototype.parseDictOrStream = function() {
      var startPos = this.bytes.position();
      var dict = this.parseDict();
      this.skipWhitespaceAndComments();
      if (!this.matchKeyword(Keywords.streamEOF1) && !this.matchKeyword(Keywords.streamEOF2) && !this.matchKeyword(Keywords.streamEOF3) && !this.matchKeyword(Keywords.streamEOF4) && !this.matchKeyword(Keywords.stream)) {
        return dict;
      }
      var start = this.bytes.offset();
      var end;
      var Length = dict.get(PDFName.of("Length"));
      if (Length instanceof PDFNumber) {
        end = start + Length.asNumber();
        this.bytes.moveTo(end);
        this.skipWhitespaceAndComments();
        if (!this.matchKeyword(Keywords.endstream)) {
          this.bytes.moveTo(start);
          end = this.findEndOfStreamFallback(startPos);
        }
      } else {
        end = this.findEndOfStreamFallback(startPos);
      }
      var contents = this.bytes.slice(start, end);
      return PDFRawStream.of(dict, contents);
    };
    PDFObjectParser2.prototype.findEndOfStreamFallback = function(startPos) {
      var nestingLvl = 1;
      var end = this.bytes.offset();
      while (!this.bytes.done()) {
        end = this.bytes.offset();
        if (this.matchKeyword(Keywords.stream)) {
          nestingLvl += 1;
        } else if (this.matchKeyword(Keywords.EOF1endstream) || this.matchKeyword(Keywords.EOF2endstream) || this.matchKeyword(Keywords.EOF3endstream) || this.matchKeyword(Keywords.endstream)) {
          nestingLvl -= 1;
        } else {
          this.bytes.next();
        }
        if (nestingLvl === 0)
          break;
      }
      if (nestingLvl !== 0)
        throw new PDFStreamParsingError(startPos);
      return end;
    };
    PDFObjectParser2.forBytes = function(bytes, context, capNumbers) {
      return new PDFObjectParser2(ByteStream.of(bytes), context, capNumbers);
    };
    PDFObjectParser2.forByteStream = function(byteStream, context, capNumbers) {
      if (capNumbers === void 0) {
        capNumbers = false;
      }
      return new PDFObjectParser2(byteStream, context, capNumbers);
    };
    return PDFObjectParser2;
  })(BaseParser)
);
var PDFObjectStreamParser = (
  /** @class */
  (function(_super) {
    __extends(PDFObjectStreamParser2, _super);
    function PDFObjectStreamParser2(rawStream, shouldWaitForTick) {
      var _this = _super.call(this, ByteStream.fromPDFRawStream(rawStream), rawStream.dict.context) || this;
      var dict = rawStream.dict;
      _this.alreadyParsed = false;
      _this.shouldWaitForTick = shouldWaitForTick || (function() {
        return false;
      });
      _this.firstOffset = dict.lookup(PDFName.of("First"), PDFNumber).asNumber();
      _this.objectCount = dict.lookup(PDFName.of("N"), PDFNumber).asNumber();
      return _this;
    }
    PDFObjectStreamParser2.prototype.parseIntoContext = function() {
      return __awaiter(this, void 0, void 0, function() {
        var offsetsAndObjectNumbers, idx, len, _a, objectNumber, offset, object, ref;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              if (this.alreadyParsed) {
                throw new ReparseError("PDFObjectStreamParser", "parseIntoContext");
              }
              this.alreadyParsed = true;
              offsetsAndObjectNumbers = this.parseOffsetsAndObjectNumbers();
              idx = 0, len = offsetsAndObjectNumbers.length;
              _b.label = 1;
            case 1:
              if (!(idx < len)) return [3, 4];
              _a = offsetsAndObjectNumbers[idx], objectNumber = _a.objectNumber, offset = _a.offset;
              this.bytes.moveTo(this.firstOffset + offset);
              object = this.parseObject();
              ref = PDFRef.of(objectNumber, 0);
              this.context.assign(ref, object);
              if (!this.shouldWaitForTick()) return [3, 3];
              return [4, waitForTick()];
            case 2:
              _b.sent();
              _b.label = 3;
            case 3:
              idx++;
              return [3, 1];
            case 4:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
    PDFObjectStreamParser2.prototype.parseOffsetsAndObjectNumbers = function() {
      var offsetsAndObjectNumbers = [];
      for (var idx = 0, len = this.objectCount; idx < len; idx++) {
        this.skipWhitespaceAndComments();
        var objectNumber = this.parseRawInt();
        this.skipWhitespaceAndComments();
        var offset = this.parseRawInt();
        offsetsAndObjectNumbers.push({ objectNumber, offset });
      }
      return offsetsAndObjectNumbers;
    };
    PDFObjectStreamParser2.forStream = function(rawStream, shouldWaitForTick) {
      return new PDFObjectStreamParser2(rawStream, shouldWaitForTick);
    };
    return PDFObjectStreamParser2;
  })(PDFObjectParser)
);
var PDFXRefStreamParser = (
  /** @class */
  (function() {
    function PDFXRefStreamParser2(rawStream) {
      this.alreadyParsed = false;
      this.dict = rawStream.dict;
      this.bytes = ByteStream.fromPDFRawStream(rawStream);
      this.context = this.dict.context;
      var Size = this.dict.lookup(PDFName.of("Size"), PDFNumber);
      var Index = this.dict.lookup(PDFName.of("Index"));
      if (Index instanceof PDFArray) {
        this.subsections = [];
        for (var idx = 0, len = Index.size(); idx < len; idx += 2) {
          var firstObjectNumber = Index.lookup(idx + 0, PDFNumber).asNumber();
          var length_1 = Index.lookup(idx + 1, PDFNumber).asNumber();
          this.subsections.push({ firstObjectNumber, length: length_1 });
        }
      } else {
        this.subsections = [{ firstObjectNumber: 0, length: Size.asNumber() }];
      }
      var W = this.dict.lookup(PDFName.of("W"), PDFArray);
      this.byteWidths = [-1, -1, -1];
      for (var idx = 0, len = W.size(); idx < len; idx++) {
        this.byteWidths[idx] = W.lookup(idx, PDFNumber).asNumber();
      }
    }
    PDFXRefStreamParser2.prototype.parseIntoContext = function() {
      if (this.alreadyParsed) {
        throw new ReparseError("PDFXRefStreamParser", "parseIntoContext");
      }
      this.alreadyParsed = true;
      this.context.trailerInfo = {
        Root: this.dict.get(PDFName.of("Root")),
        Encrypt: this.dict.get(PDFName.of("Encrypt")),
        Info: this.dict.get(PDFName.of("Info")),
        ID: this.dict.get(PDFName.of("ID"))
      };
      var entries = this.parseEntries();
      return entries;
    };
    PDFXRefStreamParser2.prototype.parseEntries = function() {
      var entries = [];
      var _a = this.byteWidths, typeFieldWidth = _a[0], offsetFieldWidth = _a[1], genFieldWidth = _a[2];
      for (var subsectionIdx = 0, subsectionLen = this.subsections.length; subsectionIdx < subsectionLen; subsectionIdx++) {
        var _b = this.subsections[subsectionIdx], firstObjectNumber = _b.firstObjectNumber, length_2 = _b.length;
        for (var objIdx = 0; objIdx < length_2; objIdx++) {
          var type = 0;
          for (var idx = 0, len = typeFieldWidth; idx < len; idx++) {
            type = type << 8 | this.bytes.next();
          }
          var offset = 0;
          for (var idx = 0, len = offsetFieldWidth; idx < len; idx++) {
            offset = offset << 8 | this.bytes.next();
          }
          var generationNumber = 0;
          for (var idx = 0, len = genFieldWidth; idx < len; idx++) {
            generationNumber = generationNumber << 8 | this.bytes.next();
          }
          if (typeFieldWidth === 0)
            type = 1;
          var objectNumber = firstObjectNumber + objIdx;
          var entry = {
            ref: PDFRef.of(objectNumber, generationNumber),
            offset,
            deleted: type === 0,
            inObjectStream: type === 2
          };
          entries.push(entry);
        }
      }
      return entries;
    };
    PDFXRefStreamParser2.forStream = function(rawStream) {
      return new PDFXRefStreamParser2(rawStream);
    };
    return PDFXRefStreamParser2;
  })()
);
var PDFParser = (
  /** @class */
  (function(_super) {
    __extends(PDFParser2, _super);
    function PDFParser2(pdfBytes, objectsPerTick, throwOnInvalidObject, capNumbers) {
      if (objectsPerTick === void 0) {
        objectsPerTick = Infinity;
      }
      if (throwOnInvalidObject === void 0) {
        throwOnInvalidObject = false;
      }
      if (capNumbers === void 0) {
        capNumbers = false;
      }
      var _this = _super.call(this, ByteStream.of(pdfBytes), PDFContext.create(), capNumbers) || this;
      _this.alreadyParsed = false;
      _this.parsedObjects = 0;
      _this.shouldWaitForTick = function() {
        _this.parsedObjects += 1;
        return _this.parsedObjects % _this.objectsPerTick === 0;
      };
      _this.objectsPerTick = objectsPerTick;
      _this.throwOnInvalidObject = throwOnInvalidObject;
      return _this;
    }
    PDFParser2.prototype.parseDocument = function() {
      return __awaiter(this, void 0, void 0, function() {
        var prevOffset, offset;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              if (this.alreadyParsed) {
                throw new ReparseError("PDFParser", "parseDocument");
              }
              this.alreadyParsed = true;
              this.context.header = this.parseHeader();
              _a.label = 1;
            case 1:
              if (!!this.bytes.done()) return [3, 3];
              return [4, this.parseDocumentSection()];
            case 2:
              _a.sent();
              offset = this.bytes.offset();
              if (offset === prevOffset) {
                throw new StalledParserError(this.bytes.position());
              }
              prevOffset = offset;
              return [3, 1];
            case 3:
              this.maybeRecoverRoot();
              if (this.context.lookup(PDFRef.of(0))) {
                console.warn("Removing parsed object: 0 0 R");
                this.context.delete(PDFRef.of(0));
              }
              return [2, this.context];
          }
        });
      });
    };
    PDFParser2.prototype.maybeRecoverRoot = function() {
      var isValidCatalog = function(obj) {
        return obj instanceof PDFDict && obj.lookup(PDFName.of("Type")) === PDFName.of("Catalog");
      };
      var catalog = this.context.lookup(this.context.trailerInfo.Root);
      if (!isValidCatalog(catalog)) {
        var indirectObjects = this.context.enumerateIndirectObjects();
        for (var idx = 0, len = indirectObjects.length; idx < len; idx++) {
          var _a = indirectObjects[idx], ref = _a[0], object = _a[1];
          if (isValidCatalog(object)) {
            this.context.trailerInfo.Root = ref;
          }
        }
      }
    };
    PDFParser2.prototype.parseHeader = function() {
      while (!this.bytes.done()) {
        if (this.matchKeyword(Keywords.header)) {
          var major = this.parseRawInt();
          this.bytes.assertNext(CharCodes.Period);
          var minor = this.parseRawInt();
          var header = PDFHeader.forVersion(major, minor);
          this.skipBinaryHeaderComment();
          return header;
        }
        this.bytes.next();
      }
      throw new MissingPDFHeaderError(this.bytes.position());
    };
    PDFParser2.prototype.parseIndirectObjectHeader = function() {
      this.skipWhitespaceAndComments();
      var objectNumber = this.parseRawInt();
      this.skipWhitespaceAndComments();
      var generationNumber = this.parseRawInt();
      this.skipWhitespaceAndComments();
      if (!this.matchKeyword(Keywords.obj)) {
        throw new MissingKeywordError(this.bytes.position(), Keywords.obj);
      }
      return PDFRef.of(objectNumber, generationNumber);
    };
    PDFParser2.prototype.matchIndirectObjectHeader = function() {
      var initialOffset = this.bytes.offset();
      try {
        this.parseIndirectObjectHeader();
        return true;
      } catch (e) {
        this.bytes.moveTo(initialOffset);
        return false;
      }
    };
    PDFParser2.prototype.parseIndirectObject = function() {
      return __awaiter(this, void 0, void 0, function() {
        var ref, object;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              ref = this.parseIndirectObjectHeader();
              this.skipWhitespaceAndComments();
              object = this.parseObject();
              this.skipWhitespaceAndComments();
              this.matchKeyword(Keywords.endobj);
              if (!(object instanceof PDFRawStream && object.dict.lookup(PDFName.of("Type")) === PDFName.of("ObjStm"))) return [3, 2];
              return [4, PDFObjectStreamParser.forStream(object, this.shouldWaitForTick).parseIntoContext()];
            case 1:
              _a.sent();
              return [3, 3];
            case 2:
              if (object instanceof PDFRawStream && object.dict.lookup(PDFName.of("Type")) === PDFName.of("XRef")) {
                PDFXRefStreamParser.forStream(object).parseIntoContext();
              } else {
                this.context.assign(ref, object);
              }
              _a.label = 3;
            case 3:
              return [2, ref];
          }
        });
      });
    };
    PDFParser2.prototype.tryToParseInvalidIndirectObject = function() {
      var startPos = this.bytes.position();
      var msg = "Trying to parse invalid object: " + JSON.stringify(startPos) + ")";
      if (this.throwOnInvalidObject)
        throw new Error(msg);
      console.warn(msg);
      var ref = this.parseIndirectObjectHeader();
      console.warn("Invalid object ref: " + ref);
      this.skipWhitespaceAndComments();
      var start = this.bytes.offset();
      var failed = true;
      while (!this.bytes.done()) {
        if (this.matchKeyword(Keywords.endobj)) {
          failed = false;
        }
        if (!failed)
          break;
        this.bytes.next();
      }
      if (failed)
        throw new PDFInvalidObjectParsingError(startPos);
      var end = this.bytes.offset() - Keywords.endobj.length;
      var object = PDFInvalidObject.of(this.bytes.slice(start, end));
      this.context.assign(ref, object);
      return ref;
    };
    PDFParser2.prototype.parseIndirectObjects = function() {
      return __awaiter(this, void 0, void 0, function() {
        var initialOffset;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              this.skipWhitespaceAndComments();
              _a.label = 1;
            case 1:
              if (!(!this.bytes.done() && IsDigit[this.bytes.peek()])) return [3, 8];
              initialOffset = this.bytes.offset();
              _a.label = 2;
            case 2:
              _a.trys.push([2, 4, , 5]);
              return [4, this.parseIndirectObject()];
            case 3:
              _a.sent();
              return [3, 5];
            case 4:
              _a.sent();
              this.bytes.moveTo(initialOffset);
              this.tryToParseInvalidIndirectObject();
              return [3, 5];
            case 5:
              this.skipWhitespaceAndComments();
              this.skipJibberish();
              if (!this.shouldWaitForTick()) return [3, 7];
              return [4, waitForTick()];
            case 6:
              _a.sent();
              _a.label = 7;
            case 7:
              return [3, 1];
            case 8:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
    PDFParser2.prototype.maybeParseCrossRefSection = function() {
      this.skipWhitespaceAndComments();
      if (!this.matchKeyword(Keywords.xref))
        return;
      this.skipWhitespaceAndComments();
      var objectNumber = -1;
      var xref = PDFCrossRefSection.createEmpty();
      while (!this.bytes.done() && IsDigit[this.bytes.peek()]) {
        var firstInt = this.parseRawInt();
        this.skipWhitespaceAndComments();
        var secondInt = this.parseRawInt();
        this.skipWhitespaceAndComments();
        var byte = this.bytes.peek();
        if (byte === CharCodes.n || byte === CharCodes.f) {
          var ref = PDFRef.of(objectNumber, secondInt);
          if (this.bytes.next() === CharCodes.n) {
            xref.addEntry(ref, firstInt);
          } else {
            xref.addDeletedEntry(ref, firstInt);
          }
          objectNumber += 1;
        } else {
          objectNumber = firstInt;
        }
        this.skipWhitespaceAndComments();
      }
      return xref;
    };
    PDFParser2.prototype.maybeParseTrailerDict = function() {
      this.skipWhitespaceAndComments();
      if (!this.matchKeyword(Keywords.trailer))
        return;
      this.skipWhitespaceAndComments();
      var dict = this.parseDict();
      var context = this.context;
      context.trailerInfo = {
        Root: dict.get(PDFName.of("Root")) || context.trailerInfo.Root,
        Encrypt: dict.get(PDFName.of("Encrypt")) || context.trailerInfo.Encrypt,
        Info: dict.get(PDFName.of("Info")) || context.trailerInfo.Info,
        ID: dict.get(PDFName.of("ID")) || context.trailerInfo.ID
      };
    };
    PDFParser2.prototype.maybeParseTrailer = function() {
      this.skipWhitespaceAndComments();
      if (!this.matchKeyword(Keywords.startxref))
        return;
      this.skipWhitespaceAndComments();
      var offset = this.parseRawInt();
      this.skipWhitespace();
      this.matchKeyword(Keywords.eof);
      this.skipWhitespaceAndComments();
      this.matchKeyword(Keywords.eof);
      this.skipWhitespaceAndComments();
      return PDFTrailer.forLastCrossRefSectionOffset(offset);
    };
    PDFParser2.prototype.parseDocumentSection = function() {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, this.parseIndirectObjects()];
            case 1:
              _a.sent();
              this.maybeParseCrossRefSection();
              this.maybeParseTrailerDict();
              this.maybeParseTrailer();
              this.skipJibberish();
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
    PDFParser2.prototype.skipJibberish = function() {
      this.skipWhitespaceAndComments();
      while (!this.bytes.done()) {
        var initialOffset = this.bytes.offset();
        var byte = this.bytes.peek();
        var isAlphaNumeric = byte >= CharCodes.Space && byte <= CharCodes.Tilde;
        if (isAlphaNumeric) {
          if (this.matchKeyword(Keywords.xref) || this.matchKeyword(Keywords.trailer) || this.matchKeyword(Keywords.startxref) || this.matchIndirectObjectHeader()) {
            this.bytes.moveTo(initialOffset);
            break;
          }
        }
        this.bytes.next();
      }
    };
    PDFParser2.prototype.skipBinaryHeaderComment = function() {
      this.skipWhitespaceAndComments();
      try {
        var initialOffset = this.bytes.offset();
        this.parseIndirectObjectHeader();
        this.bytes.moveTo(initialOffset);
      } catch (e) {
        this.bytes.next();
        this.skipWhitespaceAndComments();
      }
    };
    PDFParser2.forBytesWithOptions = function(pdfBytes, objectsPerTick, throwOnInvalidObject, capNumbers) {
      return new PDFParser2(pdfBytes, objectsPerTick, throwOnInvalidObject, capNumbers);
    };
    return PDFParser2;
  })(PDFObjectParser)
);
var flag = function(bitIndex) {
  return 1 << bitIndex;
};
var AnnotationFlags;
(function(AnnotationFlags2) {
  AnnotationFlags2[AnnotationFlags2["Invisible"] = flag(1 - 1)] = "Invisible";
  AnnotationFlags2[AnnotationFlags2["Hidden"] = flag(2 - 1)] = "Hidden";
  AnnotationFlags2[AnnotationFlags2["Print"] = flag(3 - 1)] = "Print";
  AnnotationFlags2[AnnotationFlags2["NoZoom"] = flag(4 - 1)] = "NoZoom";
  AnnotationFlags2[AnnotationFlags2["NoRotate"] = flag(5 - 1)] = "NoRotate";
  AnnotationFlags2[AnnotationFlags2["NoView"] = flag(6 - 1)] = "NoView";
  AnnotationFlags2[AnnotationFlags2["ReadOnly"] = flag(7 - 1)] = "ReadOnly";
  AnnotationFlags2[AnnotationFlags2["Locked"] = flag(8 - 1)] = "Locked";
  AnnotationFlags2[AnnotationFlags2["ToggleNoView"] = flag(9 - 1)] = "ToggleNoView";
  AnnotationFlags2[AnnotationFlags2["LockedContents"] = flag(10 - 1)] = "LockedContents";
})(AnnotationFlags || (AnnotationFlags = {}));
var asPDFName = function(name) {
  return name instanceof PDFName ? name : PDFName.of(name);
};
var asPDFNumber = function(num) {
  return num instanceof PDFNumber ? num : PDFNumber.of(num);
};
var asNumber = function(num) {
  return num instanceof PDFNumber ? num.asNumber() : num;
};
var RotationTypes;
(function(RotationTypes2) {
  RotationTypes2["Degrees"] = "degrees";
  RotationTypes2["Radians"] = "radians";
})(RotationTypes || (RotationTypes = {}));
var degrees = function(degreeAngle) {
  assertIs(degreeAngle, "degreeAngle", ["number"]);
  return { type: RotationTypes.Degrees, angle: degreeAngle };
};
var Radians = RotationTypes.Radians, Degrees = RotationTypes.Degrees;
var degreesToRadians = function(degree) {
  return degree * Math.PI / 180;
};
var radiansToDegrees = function(radian) {
  return radian * 180 / Math.PI;
};
var toRadians = function(rotation) {
  return rotation.type === Radians ? rotation.angle : rotation.type === Degrees ? degreesToRadians(rotation.angle) : error("Invalid rotation: " + JSON.stringify(rotation));
};
var toDegrees = function(rotation) {
  return rotation.type === Radians ? radiansToDegrees(rotation.angle) : rotation.type === Degrees ? rotation.angle : error("Invalid rotation: " + JSON.stringify(rotation));
};
var reduceRotation = function(degreeAngle) {
  if (degreeAngle === void 0) {
    degreeAngle = 0;
  }
  var quadrants = degreeAngle / 90 % 4;
  if (quadrants === 0)
    return 0;
  if (quadrants === 1)
    return 90;
  if (quadrants === 2)
    return 180;
  if (quadrants === 3)
    return 270;
  return 0;
};
var adjustDimsForRotation = function(dims, degreeAngle) {
  if (degreeAngle === void 0) {
    degreeAngle = 0;
  }
  var rotation = reduceRotation(degreeAngle);
  return rotation === 90 || rotation === 270 ? { width: dims.height, height: dims.width } : { width: dims.width, height: dims.height };
};
var rotateRectangle = function(rectangle, borderWidth, degreeAngle) {
  if (borderWidth === void 0) {
    borderWidth = 0;
  }
  if (degreeAngle === void 0) {
    degreeAngle = 0;
  }
  var x = rectangle.x, y = rectangle.y, w = rectangle.width, h = rectangle.height;
  var r = reduceRotation(degreeAngle);
  var b = borderWidth / 2;
  if (r === 0)
    return { x: x - b, y: y - b, width: w, height: h };
  else if (r === 90)
    return { x: x - h + b, y: y - b, width: h, height: w };
  else if (r === 180)
    return { x: x - w + b, y: y - h + b, width: w, height: h };
  else if (r === 270)
    return { x: x - b, y: y - w + b, width: h, height: w };
  else
    return { x: x - b, y: y - b, width: w, height: h };
};
var clip = function() {
  return PDFOperator.of(PDFOperatorNames.ClipNonZero);
};
var cos = Math.cos, sin = Math.sin, tan = Math.tan;
var concatTransformationMatrix = function(a, b, c, d, e, f) {
  return PDFOperator.of(PDFOperatorNames.ConcatTransformationMatrix, [
    asPDFNumber(a),
    asPDFNumber(b),
    asPDFNumber(c),
    asPDFNumber(d),
    asPDFNumber(e),
    asPDFNumber(f)
  ]);
};
var translate = function(xPos, yPos) {
  return concatTransformationMatrix(1, 0, 0, 1, xPos, yPos);
};
var scale = function(xPos, yPos) {
  return concatTransformationMatrix(xPos, 0, 0, yPos, 0, 0);
};
var rotateRadians = function(angle) {
  return concatTransformationMatrix(cos(asNumber(angle)), sin(asNumber(angle)), -sin(asNumber(angle)), cos(asNumber(angle)), 0, 0);
};
var rotateDegrees = function(angle) {
  return rotateRadians(degreesToRadians(asNumber(angle)));
};
var skewRadians = function(xSkewAngle, ySkewAngle) {
  return concatTransformationMatrix(1, tan(asNumber(xSkewAngle)), tan(asNumber(ySkewAngle)), 1, 0, 0);
};
var setDashPattern = function(dashArray, dashPhase) {
  return PDFOperator.of(PDFOperatorNames.SetLineDashPattern, [
    "[" + dashArray.map(asPDFNumber).join(" ") + "]",
    asPDFNumber(dashPhase)
  ]);
};
var LineCapStyle;
(function(LineCapStyle2) {
  LineCapStyle2[LineCapStyle2["Butt"] = 0] = "Butt";
  LineCapStyle2[LineCapStyle2["Round"] = 1] = "Round";
  LineCapStyle2[LineCapStyle2["Projecting"] = 2] = "Projecting";
})(LineCapStyle || (LineCapStyle = {}));
var setLineCap = function(style) {
  return PDFOperator.of(PDFOperatorNames.SetLineCapStyle, [asPDFNumber(style)]);
};
var LineJoinStyle;
(function(LineJoinStyle2) {
  LineJoinStyle2[LineJoinStyle2["Miter"] = 0] = "Miter";
  LineJoinStyle2[LineJoinStyle2["Round"] = 1] = "Round";
  LineJoinStyle2[LineJoinStyle2["Bevel"] = 2] = "Bevel";
})(LineJoinStyle || (LineJoinStyle = {}));
var setGraphicsState = function(state) {
  return PDFOperator.of(PDFOperatorNames.SetGraphicsStateParams, [asPDFName(state)]);
};
var pushGraphicsState = function() {
  return PDFOperator.of(PDFOperatorNames.PushGraphicsState);
};
var popGraphicsState = function() {
  return PDFOperator.of(PDFOperatorNames.PopGraphicsState);
};
var setLineWidth = function(width) {
  return PDFOperator.of(PDFOperatorNames.SetLineWidth, [asPDFNumber(width)]);
};
var appendBezierCurve = function(x1, y1, x2, y2, x3, y3) {
  return PDFOperator.of(PDFOperatorNames.AppendBezierCurve, [
    asPDFNumber(x1),
    asPDFNumber(y1),
    asPDFNumber(x2),
    asPDFNumber(y2),
    asPDFNumber(x3),
    asPDFNumber(y3)
  ]);
};
var appendQuadraticCurve = function(x1, y1, x2, y2) {
  return PDFOperator.of(PDFOperatorNames.CurveToReplicateInitialPoint, [
    asPDFNumber(x1),
    asPDFNumber(y1),
    asPDFNumber(x2),
    asPDFNumber(y2)
  ]);
};
var closePath = function() {
  return PDFOperator.of(PDFOperatorNames.ClosePath);
};
var moveTo = function(xPos, yPos) {
  return PDFOperator.of(PDFOperatorNames.MoveTo, [asPDFNumber(xPos), asPDFNumber(yPos)]);
};
var lineTo = function(xPos, yPos) {
  return PDFOperator.of(PDFOperatorNames.LineTo, [asPDFNumber(xPos), asPDFNumber(yPos)]);
};
var stroke = function() {
  return PDFOperator.of(PDFOperatorNames.StrokePath);
};
var fill = function() {
  return PDFOperator.of(PDFOperatorNames.FillNonZero);
};
var fillAndStroke = function() {
  return PDFOperator.of(PDFOperatorNames.FillNonZeroAndStroke);
};
var endPath = function() {
  return PDFOperator.of(PDFOperatorNames.EndPath);
};
var nextLine = function() {
  return PDFOperator.of(PDFOperatorNames.NextLine);
};
var showText = function(text) {
  return PDFOperator.of(PDFOperatorNames.ShowText, [text]);
};
var beginText = function() {
  return PDFOperator.of(PDFOperatorNames.BeginText);
};
var endText = function() {
  return PDFOperator.of(PDFOperatorNames.EndText);
};
var setFontAndSize = function(name, size) {
  return PDFOperator.of(PDFOperatorNames.SetFontAndSize, [asPDFName(name), asPDFNumber(size)]);
};
var setLineHeight = function(lineHeight) {
  return PDFOperator.of(PDFOperatorNames.SetTextLineHeight, [asPDFNumber(lineHeight)]);
};
var TextRenderingMode;
(function(TextRenderingMode2) {
  TextRenderingMode2[TextRenderingMode2["Fill"] = 0] = "Fill";
  TextRenderingMode2[TextRenderingMode2["Outline"] = 1] = "Outline";
  TextRenderingMode2[TextRenderingMode2["FillAndOutline"] = 2] = "FillAndOutline";
  TextRenderingMode2[TextRenderingMode2["Invisible"] = 3] = "Invisible";
  TextRenderingMode2[TextRenderingMode2["FillAndClip"] = 4] = "FillAndClip";
  TextRenderingMode2[TextRenderingMode2["OutlineAndClip"] = 5] = "OutlineAndClip";
  TextRenderingMode2[TextRenderingMode2["FillAndOutlineAndClip"] = 6] = "FillAndOutlineAndClip";
  TextRenderingMode2[TextRenderingMode2["Clip"] = 7] = "Clip";
})(TextRenderingMode || (TextRenderingMode = {}));
var setTextMatrix = function(a, b, c, d, e, f) {
  return PDFOperator.of(PDFOperatorNames.SetTextMatrix, [
    asPDFNumber(a),
    asPDFNumber(b),
    asPDFNumber(c),
    asPDFNumber(d),
    asPDFNumber(e),
    asPDFNumber(f)
  ]);
};
var rotateAndSkewTextRadiansAndTranslate = function(rotationAngle, xSkewAngle, ySkewAngle, x, y) {
  return setTextMatrix(cos(asNumber(rotationAngle)), sin(asNumber(rotationAngle)) + tan(asNumber(xSkewAngle)), -sin(asNumber(rotationAngle)) + tan(asNumber(ySkewAngle)), cos(asNumber(rotationAngle)), x, y);
};
var drawObject = function(name) {
  return PDFOperator.of(PDFOperatorNames.DrawObject, [asPDFName(name)]);
};
var setFillingGrayscaleColor = function(gray) {
  return PDFOperator.of(PDFOperatorNames.NonStrokingColorGray, [asPDFNumber(gray)]);
};
var setStrokingGrayscaleColor = function(gray) {
  return PDFOperator.of(PDFOperatorNames.StrokingColorGray, [asPDFNumber(gray)]);
};
var setFillingRgbColor = function(red, green, blue) {
  return PDFOperator.of(PDFOperatorNames.NonStrokingColorRgb, [
    asPDFNumber(red),
    asPDFNumber(green),
    asPDFNumber(blue)
  ]);
};
var setStrokingRgbColor = function(red, green, blue) {
  return PDFOperator.of(PDFOperatorNames.StrokingColorRgb, [
    asPDFNumber(red),
    asPDFNumber(green),
    asPDFNumber(blue)
  ]);
};
var setFillingCmykColor = function(cyan, magenta, yellow, key) {
  return PDFOperator.of(PDFOperatorNames.NonStrokingColorCmyk, [
    asPDFNumber(cyan),
    asPDFNumber(magenta),
    asPDFNumber(yellow),
    asPDFNumber(key)
  ]);
};
var setStrokingCmykColor = function(cyan, magenta, yellow, key) {
  return PDFOperator.of(PDFOperatorNames.StrokingColorCmyk, [
    asPDFNumber(cyan),
    asPDFNumber(magenta),
    asPDFNumber(yellow),
    asPDFNumber(key)
  ]);
};
var beginMarkedContent = function(tag) {
  return PDFOperator.of(PDFOperatorNames.BeginMarkedContent, [asPDFName(tag)]);
};
var endMarkedContent = function() {
  return PDFOperator.of(PDFOperatorNames.EndMarkedContent);
};
var ColorTypes;
(function(ColorTypes2) {
  ColorTypes2["Grayscale"] = "Grayscale";
  ColorTypes2["RGB"] = "RGB";
  ColorTypes2["CMYK"] = "CMYK";
})(ColorTypes || (ColorTypes = {}));
var grayscale = function(gray) {
  assertRange(gray, "gray", 0, 1);
  return { type: ColorTypes.Grayscale, gray };
};
var rgb = function(red, green, blue) {
  assertRange(red, "red", 0, 1);
  assertRange(green, "green", 0, 1);
  assertRange(blue, "blue", 0, 1);
  return { type: ColorTypes.RGB, red, green, blue };
};
var cmyk = function(cyan, magenta, yellow, key) {
  assertRange(cyan, "cyan", 0, 1);
  assertRange(magenta, "magenta", 0, 1);
  assertRange(yellow, "yellow", 0, 1);
  assertRange(key, "key", 0, 1);
  return { type: ColorTypes.CMYK, cyan, magenta, yellow, key };
};
var Grayscale = ColorTypes.Grayscale, RGB = ColorTypes.RGB, CMYK = ColorTypes.CMYK;
var setFillingColor = function(color) {
  return color.type === Grayscale ? setFillingGrayscaleColor(color.gray) : color.type === RGB ? setFillingRgbColor(color.red, color.green, color.blue) : color.type === CMYK ? setFillingCmykColor(color.cyan, color.magenta, color.yellow, color.key) : error("Invalid color: " + JSON.stringify(color));
};
var setStrokingColor = function(color) {
  return color.type === Grayscale ? setStrokingGrayscaleColor(color.gray) : color.type === RGB ? setStrokingRgbColor(color.red, color.green, color.blue) : color.type === CMYK ? setStrokingCmykColor(color.cyan, color.magenta, color.yellow, color.key) : error("Invalid color: " + JSON.stringify(color));
};
var componentsToColor = function(comps, scale2) {
  if (scale2 === void 0) {
    scale2 = 1;
  }
  return (comps === null || comps === void 0 ? void 0 : comps.length) === 1 ? grayscale(comps[0] * scale2) : (comps === null || comps === void 0 ? void 0 : comps.length) === 3 ? rgb(comps[0] * scale2, comps[1] * scale2, comps[2] * scale2) : (comps === null || comps === void 0 ? void 0 : comps.length) === 4 ? cmyk(comps[0] * scale2, comps[1] * scale2, comps[2] * scale2, comps[3] * scale2) : void 0;
};
var colorToComponents = function(color) {
  return color.type === Grayscale ? [color.gray] : color.type === RGB ? [color.red, color.green, color.blue] : color.type === CMYK ? [color.cyan, color.magenta, color.yellow, color.key] : error("Invalid color: " + JSON.stringify(color));
};
var cx = 0;
var cy = 0;
var px = 0;
var py = 0;
var sx = 0;
var sy = 0;
var parameters = /* @__PURE__ */ new Map([
  ["A", 7],
  ["a", 7],
  ["C", 6],
  ["c", 6],
  ["H", 1],
  ["h", 1],
  ["L", 2],
  ["l", 2],
  ["M", 2],
  ["m", 2],
  ["Q", 4],
  ["q", 4],
  ["S", 4],
  ["s", 4],
  ["T", 2],
  ["t", 2],
  ["V", 1],
  ["v", 1],
  ["Z", 0],
  ["z", 0]
]);
var parse = function(path) {
  var cmd;
  var ret = [];
  var args = [];
  var curArg = "";
  var foundDecimal = false;
  var params = 0;
  for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
    var c = path_1[_i];
    if (parameters.has(c)) {
      params = parameters.get(c);
      if (cmd) {
        if (curArg.length > 0) {
          args[args.length] = +curArg;
        }
        ret[ret.length] = { cmd, args };
        args = [];
        curArg = "";
        foundDecimal = false;
      }
      cmd = c;
    } else if ([" ", ","].includes(c) || c === "-" && curArg.length > 0 && curArg[curArg.length - 1] !== "e" || c === "." && foundDecimal) {
      if (curArg.length === 0) {
        continue;
      }
      if (args.length === params) {
        ret[ret.length] = { cmd, args };
        args = [+curArg];
        if (cmd === "M") {
          cmd = "L";
        }
        if (cmd === "m") {
          cmd = "l";
        }
      } else {
        args[args.length] = +curArg;
      }
      foundDecimal = c === ".";
      curArg = ["-", "."].includes(c) ? c : "";
    } else {
      curArg += c;
      if (c === ".") {
        foundDecimal = true;
      }
    }
  }
  if (curArg.length > 0) {
    if (args.length === params) {
      ret[ret.length] = { cmd, args };
      args = [+curArg];
      if (cmd === "M") {
        cmd = "L";
      }
      if (cmd === "m") {
        cmd = "l";
      }
    } else {
      args[args.length] = +curArg;
    }
  }
  ret[ret.length] = { cmd, args };
  return ret;
};
var apply = function(commands) {
  cx = cy = px = py = sx = sy = 0;
  var cmds = [];
  for (var i = 0; i < commands.length; i++) {
    var c = commands[i];
    if (c.cmd && typeof runners[c.cmd] === "function") {
      var cmd = runners[c.cmd](c.args);
      if (Array.isArray(cmd)) {
        cmds = cmds.concat(cmd);
      } else {
        cmds.push(cmd);
      }
    }
  }
  return cmds;
};
var runners = {
  M: function(a) {
    cx = a[0];
    cy = a[1];
    px = py = null;
    sx = cx;
    sy = cy;
    return moveTo(cx, cy);
  },
  m: function(a) {
    cx += a[0];
    cy += a[1];
    px = py = null;
    sx = cx;
    sy = cy;
    return moveTo(cx, cy);
  },
  C: function(a) {
    cx = a[4];
    cy = a[5];
    px = a[2];
    py = a[3];
    return appendBezierCurve(a[0], a[1], a[2], a[3], a[4], a[5]);
  },
  c: function(a) {
    var cmd = appendBezierCurve(a[0] + cx, a[1] + cy, a[2] + cx, a[3] + cy, a[4] + cx, a[5] + cy);
    px = cx + a[2];
    py = cy + a[3];
    cx += a[4];
    cy += a[5];
    return cmd;
  },
  S: function(a) {
    if (px === null || py === null) {
      px = cx;
      py = cy;
    }
    var cmd = appendBezierCurve(cx - (px - cx), cy - (py - cy), a[0], a[1], a[2], a[3]);
    px = a[0];
    py = a[1];
    cx = a[2];
    cy = a[3];
    return cmd;
  },
  s: function(a) {
    if (px === null || py === null) {
      px = cx;
      py = cy;
    }
    var cmd = appendBezierCurve(cx - (px - cx), cy - (py - cy), cx + a[0], cy + a[1], cx + a[2], cy + a[3]);
    px = cx + a[0];
    py = cy + a[1];
    cx += a[2];
    cy += a[3];
    return cmd;
  },
  Q: function(a) {
    px = a[0];
    py = a[1];
    cx = a[2];
    cy = a[3];
    return appendQuadraticCurve(a[0], a[1], cx, cy);
  },
  q: function(a) {
    var cmd = appendQuadraticCurve(a[0] + cx, a[1] + cy, a[2] + cx, a[3] + cy);
    px = cx + a[0];
    py = cy + a[1];
    cx += a[2];
    cy += a[3];
    return cmd;
  },
  T: function(a) {
    if (px === null || py === null) {
      px = cx;
      py = cy;
    } else {
      px = cx - (px - cx);
      py = cy - (py - cy);
    }
    var cmd = appendQuadraticCurve(px, py, a[0], a[1]);
    px = cx - (px - cx);
    py = cy - (py - cy);
    cx = a[0];
    cy = a[1];
    return cmd;
  },
  t: function(a) {
    if (px === null || py === null) {
      px = cx;
      py = cy;
    } else {
      px = cx - (px - cx);
      py = cy - (py - cy);
    }
    var cmd = appendQuadraticCurve(px, py, cx + a[0], cy + a[1]);
    cx += a[0];
    cy += a[1];
    return cmd;
  },
  A: function(a) {
    var cmds = solveArc(cx, cy, a);
    cx = a[5];
    cy = a[6];
    return cmds;
  },
  a: function(a) {
    a[5] += cx;
    a[6] += cy;
    var cmds = solveArc(cx, cy, a);
    cx = a[5];
    cy = a[6];
    return cmds;
  },
  L: function(a) {
    cx = a[0];
    cy = a[1];
    px = py = null;
    return lineTo(cx, cy);
  },
  l: function(a) {
    cx += a[0];
    cy += a[1];
    px = py = null;
    return lineTo(cx, cy);
  },
  H: function(a) {
    cx = a[0];
    px = py = null;
    return lineTo(cx, cy);
  },
  h: function(a) {
    cx += a[0];
    px = py = null;
    return lineTo(cx, cy);
  },
  V: function(a) {
    cy = a[0];
    px = py = null;
    return lineTo(cx, cy);
  },
  v: function(a) {
    cy += a[0];
    px = py = null;
    return lineTo(cx, cy);
  },
  Z: function() {
    var cmd = closePath();
    cx = sx;
    cy = sy;
    return cmd;
  },
  z: function() {
    var cmd = closePath();
    cx = sx;
    cy = sy;
    return cmd;
  }
};
var solveArc = function(x, y, coords) {
  var rx = coords[0], ry = coords[1], rot = coords[2], large = coords[3], sweep = coords[4], ex = coords[5], ey = coords[6];
  var segs = arcToSegments(ex, ey, rx, ry, large, sweep, rot, x, y);
  var cmds = [];
  for (var _i = 0, segs_1 = segs; _i < segs_1.length; _i++) {
    var seg = segs_1[_i];
    var bez = segmentToBezier.apply(void 0, seg);
    cmds.push(appendBezierCurve.apply(void 0, bez));
  }
  return cmds;
};
var arcToSegments = function(x, y, rx, ry, large, sweep, rotateX, ox, oy) {
  var th = rotateX * (Math.PI / 180);
  var sinTh = Math.sin(th);
  var cosTh = Math.cos(th);
  rx = Math.abs(rx);
  ry = Math.abs(ry);
  px = cosTh * (ox - x) * 0.5 + sinTh * (oy - y) * 0.5;
  py = cosTh * (oy - y) * 0.5 - sinTh * (ox - x) * 0.5;
  var pl = px * px / (rx * rx) + py * py / (ry * ry);
  if (pl > 1) {
    pl = Math.sqrt(pl);
    rx *= pl;
    ry *= pl;
  }
  var a00 = cosTh / rx;
  var a01 = sinTh / rx;
  var a10 = -sinTh / ry;
  var a11 = cosTh / ry;
  var x0 = a00 * ox + a01 * oy;
  var y0 = a10 * ox + a11 * oy;
  var x1 = a00 * x + a01 * y;
  var y1 = a10 * x + a11 * y;
  var d = (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
  var sfactorSq = 1 / d - 0.25;
  if (sfactorSq < 0) {
    sfactorSq = 0;
  }
  var sfactor = Math.sqrt(sfactorSq);
  if (sweep === large) {
    sfactor = -sfactor;
  }
  var xc = 0.5 * (x0 + x1) - sfactor * (y1 - y0);
  var yc = 0.5 * (y0 + y1) + sfactor * (x1 - x0);
  var th0 = Math.atan2(y0 - yc, x0 - xc);
  var th1 = Math.atan2(y1 - yc, x1 - xc);
  var thArc = th1 - th0;
  if (thArc < 0 && sweep === 1) {
    thArc += 2 * Math.PI;
  } else if (thArc > 0 && sweep === 0) {
    thArc -= 2 * Math.PI;
  }
  var segments = Math.ceil(Math.abs(thArc / (Math.PI * 0.5 + 1e-3)));
  var result = [];
  for (var i = 0; i < segments; i++) {
    var th2 = th0 + i * thArc / segments;
    var th3 = th0 + (i + 1) * thArc / segments;
    result[i] = [xc, yc, th2, th3, rx, ry, sinTh, cosTh];
  }
  return result;
};
var segmentToBezier = function(cx1, cy1, th0, th1, rx, ry, sinTh, cosTh) {
  var a00 = cosTh * rx;
  var a01 = -sinTh * ry;
  var a10 = sinTh * rx;
  var a11 = cosTh * ry;
  var thHalf = 0.5 * (th1 - th0);
  var t = 8 / 3 * Math.sin(thHalf * 0.5) * Math.sin(thHalf * 0.5) / Math.sin(thHalf);
  var x1 = cx1 + Math.cos(th0) - t * Math.sin(th0);
  var y1 = cy1 + Math.sin(th0) + t * Math.cos(th0);
  var x3 = cx1 + Math.cos(th1);
  var y3 = cy1 + Math.sin(th1);
  var x2 = x3 + t * Math.sin(th1);
  var y2 = y3 - t * Math.cos(th1);
  var result = [
    a00 * x1 + a01 * y1,
    a10 * x1 + a11 * y1,
    a00 * x2 + a01 * y2,
    a10 * x2 + a11 * y2,
    a00 * x3 + a01 * y3,
    a10 * x3 + a11 * y3
  ];
  return result;
};
var svgPathToOperators = function(path) {
  return apply(parse(path));
};
var drawLinesOfText = function(lines, options) {
  var operators = [
    pushGraphicsState(),
    options.graphicsState && setGraphicsState(options.graphicsState),
    beginText(),
    setFillingColor(options.color),
    setFontAndSize(options.font, options.size),
    setLineHeight(options.lineHeight),
    rotateAndSkewTextRadiansAndTranslate(toRadians(options.rotate), toRadians(options.xSkew), toRadians(options.ySkew), options.x, options.y)
  ].filter(Boolean);
  for (var idx = 0, len = lines.length; idx < len; idx++) {
    operators.push(showText(lines[idx]), nextLine());
  }
  operators.push(endText(), popGraphicsState());
  return operators;
};
var drawImage = function(name, options) {
  return [
    pushGraphicsState(),
    options.graphicsState && setGraphicsState(options.graphicsState),
    translate(options.x, options.y),
    rotateRadians(toRadians(options.rotate)),
    scale(options.width, options.height),
    skewRadians(toRadians(options.xSkew), toRadians(options.ySkew)),
    drawObject(name),
    popGraphicsState()
  ].filter(Boolean);
};
var drawPage = function(name, options) {
  return [
    pushGraphicsState(),
    options.graphicsState && setGraphicsState(options.graphicsState),
    translate(options.x, options.y),
    rotateRadians(toRadians(options.rotate)),
    scale(options.xScale, options.yScale),
    skewRadians(toRadians(options.xSkew), toRadians(options.ySkew)),
    drawObject(name),
    popGraphicsState()
  ].filter(Boolean);
};
var drawLine = function(options) {
  var _a, _b;
  return [
    pushGraphicsState(),
    options.graphicsState && setGraphicsState(options.graphicsState),
    options.color && setStrokingColor(options.color),
    setLineWidth(options.thickness),
    setDashPattern((_a = options.dashArray) !== null && _a !== void 0 ? _a : [], (_b = options.dashPhase) !== null && _b !== void 0 ? _b : 0),
    moveTo(options.start.x, options.start.y),
    options.lineCap && setLineCap(options.lineCap),
    moveTo(options.start.x, options.start.y),
    lineTo(options.end.x, options.end.y),
    stroke(),
    popGraphicsState()
  ].filter(Boolean);
};
var drawRectangle = function(options) {
  var _a, _b;
  return [
    pushGraphicsState(),
    options.graphicsState && setGraphicsState(options.graphicsState),
    options.color && setFillingColor(options.color),
    options.borderColor && setStrokingColor(options.borderColor),
    setLineWidth(options.borderWidth),
    options.borderLineCap && setLineCap(options.borderLineCap),
    setDashPattern((_a = options.borderDashArray) !== null && _a !== void 0 ? _a : [], (_b = options.borderDashPhase) !== null && _b !== void 0 ? _b : 0),
    translate(options.x, options.y),
    rotateRadians(toRadians(options.rotate)),
    skewRadians(toRadians(options.xSkew), toRadians(options.ySkew)),
    moveTo(0, 0),
    lineTo(0, options.height),
    lineTo(options.width, options.height),
    lineTo(options.width, 0),
    closePath(),
    // prettier-ignore
    options.color && options.borderWidth ? fillAndStroke() : options.color ? fill() : options.borderColor ? stroke() : closePath(),
    popGraphicsState()
  ].filter(Boolean);
};
var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
var drawEllipsePath = function(config) {
  var x = asNumber(config.x);
  var y = asNumber(config.y);
  var xScale = asNumber(config.xScale);
  var yScale = asNumber(config.yScale);
  x -= xScale;
  y -= yScale;
  var ox = xScale * KAPPA;
  var oy = yScale * KAPPA;
  var xe = x + xScale * 2;
  var ye = y + yScale * 2;
  var xm = x + xScale;
  var ym = y + yScale;
  return [
    pushGraphicsState(),
    moveTo(x, ym),
    appendBezierCurve(x, ym - oy, xm - ox, y, xm, y),
    appendBezierCurve(xm + ox, y, xe, ym - oy, xe, ym),
    appendBezierCurve(xe, ym + oy, xm + ox, ye, xm, ye),
    appendBezierCurve(xm - ox, ye, x, ym + oy, x, ym),
    popGraphicsState()
  ];
};
var drawEllipseCurves = function(config) {
  var centerX = asNumber(config.x);
  var centerY = asNumber(config.y);
  var xScale = asNumber(config.xScale);
  var yScale = asNumber(config.yScale);
  var x = -xScale;
  var y = -yScale;
  var ox = xScale * KAPPA;
  var oy = yScale * KAPPA;
  var xe = x + xScale * 2;
  var ye = y + yScale * 2;
  var xm = x + xScale;
  var ym = y + yScale;
  return [
    translate(centerX, centerY),
    rotateRadians(toRadians(config.rotate)),
    moveTo(x, ym),
    appendBezierCurve(x, ym - oy, xm - ox, y, xm, y),
    appendBezierCurve(xm + ox, y, xe, ym - oy, xe, ym),
    appendBezierCurve(xe, ym + oy, xm + ox, ye, xm, ye),
    appendBezierCurve(xm - ox, ye, x, ym + oy, x, ym)
  ];
};
var drawEllipse = function(options) {
  var _a, _b, _c;
  return __spreadArrays([
    pushGraphicsState(),
    options.graphicsState && setGraphicsState(options.graphicsState),
    options.color && setFillingColor(options.color),
    options.borderColor && setStrokingColor(options.borderColor),
    setLineWidth(options.borderWidth),
    options.borderLineCap && setLineCap(options.borderLineCap),
    setDashPattern((_a = options.borderDashArray) !== null && _a !== void 0 ? _a : [], (_b = options.borderDashPhase) !== null && _b !== void 0 ? _b : 0)
  ], options.rotate === void 0 ? drawEllipsePath({
    x: options.x,
    y: options.y,
    xScale: options.xScale,
    yScale: options.yScale
  }) : drawEllipseCurves({
    x: options.x,
    y: options.y,
    xScale: options.xScale,
    yScale: options.yScale,
    rotate: (_c = options.rotate) !== null && _c !== void 0 ? _c : degrees(0)
  }), [
    // prettier-ignore
    options.color && options.borderWidth ? fillAndStroke() : options.color ? fill() : options.borderColor ? stroke() : closePath(),
    popGraphicsState()
  ]).filter(Boolean);
};
var drawSvgPath = function(path, options) {
  var _a, _b, _c;
  return __spreadArrays([
    pushGraphicsState(),
    options.graphicsState && setGraphicsState(options.graphicsState),
    translate(options.x, options.y),
    rotateRadians(toRadians((_a = options.rotate) !== null && _a !== void 0 ? _a : degrees(0))),
    // SVG path Y axis is opposite pdf-lib's
    options.scale ? scale(options.scale, -options.scale) : scale(1, -1),
    options.color && setFillingColor(options.color),
    options.borderColor && setStrokingColor(options.borderColor),
    options.borderWidth && setLineWidth(options.borderWidth),
    options.borderLineCap && setLineCap(options.borderLineCap),
    setDashPattern((_b = options.borderDashArray) !== null && _b !== void 0 ? _b : [], (_c = options.borderDashPhase) !== null && _c !== void 0 ? _c : 0)
  ], svgPathToOperators(path), [
    // prettier-ignore
    options.color && options.borderWidth ? fillAndStroke() : options.color ? fill() : options.borderColor ? stroke() : closePath(),
    popGraphicsState()
  ]).filter(Boolean);
};
var drawCheckMark = function(options) {
  var size = asNumber(options.size);
  var p2x = -1 + 0.75;
  var p2y = -1 + 0.51;
  var p3y = 1 - 0.525;
  var p3x = 1 - 0.31;
  var p1x = -1 + 0.325;
  var p1y = 0.3995 / (p3y - p2y) + p2y;
  return [
    pushGraphicsState(),
    options.color && setStrokingColor(options.color),
    setLineWidth(options.thickness),
    translate(options.x, options.y),
    moveTo(p1x * size, p1y * size),
    lineTo(p2x * size, p2y * size),
    lineTo(p3x * size, p3y * size),
    stroke(),
    popGraphicsState()
  ].filter(Boolean);
};
var rotateInPlace = function(options) {
  return options.rotation === 0 ? [
    translate(0, 0),
    rotateDegrees(0)
  ] : options.rotation === 90 ? [
    translate(options.width, 0),
    rotateDegrees(90)
  ] : options.rotation === 180 ? [
    translate(options.width, options.height),
    rotateDegrees(180)
  ] : options.rotation === 270 ? [
    translate(0, options.height),
    rotateDegrees(270)
  ] : [];
};
var drawCheckBox = function(options) {
  var outline = drawRectangle({
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
    borderWidth: options.borderWidth,
    color: options.color,
    borderColor: options.borderColor,
    rotate: degrees(0),
    xSkew: degrees(0),
    ySkew: degrees(0)
  });
  if (!options.filled)
    return outline;
  var width = asNumber(options.width);
  var height = asNumber(options.height);
  var checkMarkSize = Math.min(width, height) / 2;
  var checkMark = drawCheckMark({
    x: width / 2,
    y: height / 2,
    size: checkMarkSize,
    thickness: options.thickness,
    color: options.markColor
  });
  return __spreadArrays([pushGraphicsState()], outline, checkMark, [popGraphicsState()]);
};
var drawRadioButton = function(options) {
  var width = asNumber(options.width);
  var height = asNumber(options.height);
  var outlineScale = Math.min(width, height) / 2;
  var outline = drawEllipse({
    x: options.x,
    y: options.y,
    xScale: outlineScale,
    yScale: outlineScale,
    color: options.color,
    borderColor: options.borderColor,
    borderWidth: options.borderWidth
  });
  if (!options.filled)
    return outline;
  var dot = drawEllipse({
    x: options.x,
    y: options.y,
    xScale: outlineScale * 0.45,
    yScale: outlineScale * 0.45,
    color: options.dotColor,
    borderColor: void 0,
    borderWidth: 0
  });
  return __spreadArrays([pushGraphicsState()], outline, dot, [popGraphicsState()]);
};
var drawButton = function(options) {
  var x = asNumber(options.x);
  var y = asNumber(options.y);
  var width = asNumber(options.width);
  var height = asNumber(options.height);
  var background = drawRectangle({
    x,
    y,
    width,
    height,
    borderWidth: options.borderWidth,
    color: options.color,
    borderColor: options.borderColor,
    rotate: degrees(0),
    xSkew: degrees(0),
    ySkew: degrees(0)
  });
  var lines = drawTextLines(options.textLines, {
    color: options.textColor,
    font: options.font,
    size: options.fontSize,
    rotate: degrees(0),
    xSkew: degrees(0),
    ySkew: degrees(0)
  });
  return __spreadArrays([pushGraphicsState()], background, lines, [popGraphicsState()]);
};
var drawTextLines = function(lines, options) {
  var operators = [
    beginText(),
    setFillingColor(options.color),
    setFontAndSize(options.font, options.size)
  ];
  for (var idx = 0, len = lines.length; idx < len; idx++) {
    var _a = lines[idx], encoded = _a.encoded, x = _a.x, y = _a.y;
    operators.push(rotateAndSkewTextRadiansAndTranslate(toRadians(options.rotate), toRadians(options.xSkew), toRadians(options.ySkew), x, y), showText(encoded));
  }
  operators.push(endText());
  return operators;
};
var drawTextField = function(options) {
  var x = asNumber(options.x);
  var y = asNumber(options.y);
  var width = asNumber(options.width);
  var height = asNumber(options.height);
  var borderWidth = asNumber(options.borderWidth);
  var padding = asNumber(options.padding);
  var clipX = x + borderWidth / 2 + padding;
  var clipY = y + borderWidth / 2 + padding;
  var clipWidth = width - (borderWidth / 2 + padding) * 2;
  var clipHeight = height - (borderWidth / 2 + padding) * 2;
  var clippingArea = [
    moveTo(clipX, clipY),
    lineTo(clipX, clipY + clipHeight),
    lineTo(clipX + clipWidth, clipY + clipHeight),
    lineTo(clipX + clipWidth, clipY),
    closePath(),
    clip(),
    endPath()
  ];
  var background = drawRectangle({
    x,
    y,
    width,
    height,
    borderWidth: options.borderWidth,
    color: options.color,
    borderColor: options.borderColor,
    rotate: degrees(0),
    xSkew: degrees(0),
    ySkew: degrees(0)
  });
  var lines = drawTextLines(options.textLines, {
    color: options.textColor,
    font: options.font,
    size: options.fontSize,
    rotate: degrees(0),
    xSkew: degrees(0),
    ySkew: degrees(0)
  });
  var markedContent = __spreadArrays([
    beginMarkedContent("Tx"),
    pushGraphicsState()
  ], lines, [
    popGraphicsState(),
    endMarkedContent()
  ]);
  return __spreadArrays([
    pushGraphicsState()
  ], background, clippingArea, markedContent, [
    popGraphicsState()
  ]);
};
var drawOptionList = function(options) {
  var x = asNumber(options.x);
  var y = asNumber(options.y);
  var width = asNumber(options.width);
  var height = asNumber(options.height);
  var lineHeight = asNumber(options.lineHeight);
  var borderWidth = asNumber(options.borderWidth);
  var padding = asNumber(options.padding);
  var clipX = x + borderWidth / 2 + padding;
  var clipY = y + borderWidth / 2 + padding;
  var clipWidth = width - (borderWidth / 2 + padding) * 2;
  var clipHeight = height - (borderWidth / 2 + padding) * 2;
  var clippingArea = [
    moveTo(clipX, clipY),
    lineTo(clipX, clipY + clipHeight),
    lineTo(clipX + clipWidth, clipY + clipHeight),
    lineTo(clipX + clipWidth, clipY),
    closePath(),
    clip(),
    endPath()
  ];
  var background = drawRectangle({
    x,
    y,
    width,
    height,
    borderWidth: options.borderWidth,
    color: options.color,
    borderColor: options.borderColor,
    rotate: degrees(0),
    xSkew: degrees(0),
    ySkew: degrees(0)
  });
  var highlights = [];
  for (var idx = 0, len = options.selectedLines.length; idx < len; idx++) {
    var line = options.textLines[options.selectedLines[idx]];
    highlights.push.apply(highlights, drawRectangle({
      x: line.x - padding,
      y: line.y - (lineHeight - line.height) / 2,
      width: width - borderWidth,
      height: line.height + (lineHeight - line.height) / 2,
      borderWidth: 0,
      color: options.selectedColor,
      borderColor: void 0,
      rotate: degrees(0),
      xSkew: degrees(0),
      ySkew: degrees(0)
    }));
  }
  var lines = drawTextLines(options.textLines, {
    color: options.textColor,
    font: options.font,
    size: options.fontSize,
    rotate: degrees(0),
    xSkew: degrees(0),
    ySkew: degrees(0)
  });
  var markedContent = __spreadArrays([
    beginMarkedContent("Tx"),
    pushGraphicsState()
  ], lines, [
    popGraphicsState(),
    endMarkedContent()
  ]);
  return __spreadArrays([
    pushGraphicsState()
  ], background, highlights, clippingArea, markedContent, [
    popGraphicsState()
  ]);
};
var EncryptedPDFError = (
  /** @class */
  (function(_super) {
    __extends(EncryptedPDFError2, _super);
    function EncryptedPDFError2() {
      var _this = this;
      var msg = "Input document to `PDFDocument.load` is encrypted. You can use `PDFDocument.load(..., { ignoreEncryption: true })` if you wish to load the document anyways.";
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return EncryptedPDFError2;
  })(Error)
);
var FontkitNotRegisteredError = (
  /** @class */
  (function(_super) {
    __extends(FontkitNotRegisteredError2, _super);
    function FontkitNotRegisteredError2() {
      var _this = this;
      var msg = "Input to `PDFDocument.embedFont` was a custom font, but no `fontkit` instance was found. You must register a `fontkit` instance with `PDFDocument.registerFontkit(...)` before embedding custom fonts.";
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return FontkitNotRegisteredError2;
  })(Error)
);
var ForeignPageError = (
  /** @class */
  (function(_super) {
    __extends(ForeignPageError2, _super);
    function ForeignPageError2() {
      var _this = this;
      var msg = "A `page` passed to `PDFDocument.addPage` or `PDFDocument.insertPage` was from a different (foreign) PDF document. If you want to copy pages from one PDFDocument to another, you must use `PDFDocument.copyPages(...)` to copy the pages before adding or inserting them.";
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return ForeignPageError2;
  })(Error)
);
var RemovePageFromEmptyDocumentError = (
  /** @class */
  (function(_super) {
    __extends(RemovePageFromEmptyDocumentError2, _super);
    function RemovePageFromEmptyDocumentError2() {
      var _this = this;
      var msg = "PDFDocument has no pages so `PDFDocument.removePage` cannot be called";
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return RemovePageFromEmptyDocumentError2;
  })(Error)
);
var NoSuchFieldError = (
  /** @class */
  (function(_super) {
    __extends(NoSuchFieldError2, _super);
    function NoSuchFieldError2(name) {
      var _this = this;
      var msg = 'PDFDocument has no form field with the name "' + name + '"';
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return NoSuchFieldError2;
  })(Error)
);
var UnexpectedFieldTypeError = (
  /** @class */
  (function(_super) {
    __extends(UnexpectedFieldTypeError2, _super);
    function UnexpectedFieldTypeError2(name, expected, actual) {
      var _a, _b;
      var _this = this;
      var expectedType = expected === null || expected === void 0 ? void 0 : expected.name;
      var actualType = (_b = (_a = actual === null || actual === void 0 ? void 0 : actual.constructor) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : actual;
      var msg = 'Expected field "' + name + '" to be of type ' + expectedType + ", " + ("but it is actually of type " + actualType);
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return UnexpectedFieldTypeError2;
  })(Error)
);
(function(_super) {
  __extends(MissingOnValueCheckError, _super);
  function MissingOnValueCheckError(onValue) {
    var _this = this;
    var msg = 'Failed to select check box due to missing onValue: "' + onValue + '"';
    _this = _super.call(this, msg) || this;
    return _this;
  }
  return MissingOnValueCheckError;
})(Error);
var FieldAlreadyExistsError = (
  /** @class */
  (function(_super) {
    __extends(FieldAlreadyExistsError2, _super);
    function FieldAlreadyExistsError2(name) {
      var _this = this;
      var msg = 'A field already exists with the specified name: "' + name + '"';
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return FieldAlreadyExistsError2;
  })(Error)
);
var InvalidFieldNamePartError = (
  /** @class */
  (function(_super) {
    __extends(InvalidFieldNamePartError2, _super);
    function InvalidFieldNamePartError2(namePart) {
      var _this = this;
      var msg = 'Field name contains invalid component: "' + namePart + '"';
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return InvalidFieldNamePartError2;
  })(Error)
);
(function(_super) {
  __extends(FieldExistsAsNonTerminalError, _super);
  function FieldExistsAsNonTerminalError(name) {
    var _this = this;
    var msg = 'A non-terminal field already exists with the specified name: "' + name + '"';
    _this = _super.call(this, msg) || this;
    return _this;
  }
  return FieldExistsAsNonTerminalError;
})(Error);
var RichTextFieldReadError = (
  /** @class */
  (function(_super) {
    __extends(RichTextFieldReadError2, _super);
    function RichTextFieldReadError2(fieldName) {
      var _this = this;
      var msg = "Reading rich text fields is not supported: Attempted to read rich text field: " + fieldName;
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return RichTextFieldReadError2;
  })(Error)
);
var CombedTextLayoutError = (
  /** @class */
  (function(_super) {
    __extends(CombedTextLayoutError2, _super);
    function CombedTextLayoutError2(lineLength, cellCount) {
      var _this = this;
      var msg = "Failed to layout combed text as lineLength=" + lineLength + " is greater than cellCount=" + cellCount;
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return CombedTextLayoutError2;
  })(Error)
);
var ExceededMaxLengthError = (
  /** @class */
  (function(_super) {
    __extends(ExceededMaxLengthError2, _super);
    function ExceededMaxLengthError2(textLength, maxLength, name) {
      var _this = this;
      var msg = "Attempted to set text with length=" + textLength + " for TextField with maxLength=" + maxLength + " and name=" + name;
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return ExceededMaxLengthError2;
  })(Error)
);
var InvalidMaxLengthError = (
  /** @class */
  (function(_super) {
    __extends(InvalidMaxLengthError2, _super);
    function InvalidMaxLengthError2(textLength, maxLength, name) {
      var _this = this;
      var msg = "Attempted to set maxLength=" + maxLength + ", which is less than " + textLength + ", the length of this field's current value (name=" + name + ")";
      _this = _super.call(this, msg) || this;
      return _this;
    }
    return InvalidMaxLengthError2;
  })(Error)
);
var TextAlignment;
(function(TextAlignment2) {
  TextAlignment2[TextAlignment2["Left"] = 0] = "Left";
  TextAlignment2[TextAlignment2["Center"] = 1] = "Center";
  TextAlignment2[TextAlignment2["Right"] = 2] = "Right";
})(TextAlignment || (TextAlignment = {}));
var MIN_FONT_SIZE = 4;
var MAX_FONT_SIZE = 500;
var computeFontSize = function(lines, font, bounds, multiline) {
  if (multiline === void 0) {
    multiline = false;
  }
  var fontSize = MIN_FONT_SIZE;
  while (fontSize < MAX_FONT_SIZE) {
    var linesUsed = 0;
    for (var lineIdx = 0, lineLen = lines.length; lineIdx < lineLen; lineIdx++) {
      linesUsed += 1;
      var line = lines[lineIdx];
      var words = line.split(" ");
      var spaceInLineRemaining = bounds.width;
      for (var idx = 0, len = words.length; idx < len; idx++) {
        var isLastWord = idx === len - 1;
        var word = isLastWord ? words[idx] : words[idx] + " ";
        var widthOfWord = font.widthOfTextAtSize(word, fontSize);
        spaceInLineRemaining -= widthOfWord;
        if (spaceInLineRemaining <= 0) {
          linesUsed += 1;
          spaceInLineRemaining = bounds.width - widthOfWord;
        }
      }
    }
    if (!multiline && linesUsed > lines.length)
      return fontSize - 1;
    var height = font.heightAtSize(fontSize);
    var lineHeight = height + height * 0.2;
    var totalHeight = lineHeight * linesUsed;
    if (totalHeight > Math.abs(bounds.height))
      return fontSize - 1;
    fontSize += 1;
  }
  return fontSize;
};
var computeCombedFontSize = function(line, font, bounds, cellCount) {
  var cellWidth = bounds.width / cellCount;
  var cellHeight = bounds.height;
  var fontSize = MIN_FONT_SIZE;
  var chars2 = charSplit(line);
  while (fontSize < MAX_FONT_SIZE) {
    for (var idx = 0, len = chars2.length; idx < len; idx++) {
      var c = chars2[idx];
      var tooLong = font.widthOfTextAtSize(c, fontSize) > cellWidth * 0.75;
      if (tooLong)
        return fontSize - 1;
    }
    var height = font.heightAtSize(fontSize, { descender: false });
    if (height > cellHeight)
      return fontSize - 1;
    fontSize += 1;
  }
  return fontSize;
};
var lastIndexOfWhitespace = function(line) {
  for (var idx = line.length; idx > 0; idx--) {
    if (/\s/.test(line[idx]))
      return idx;
  }
  return void 0;
};
var splitOutLines = function(input, maxWidth, font, fontSize) {
  var _a;
  var lastWhitespaceIdx = input.length;
  while (lastWhitespaceIdx > 0) {
    var line = input.substring(0, lastWhitespaceIdx);
    var encoded = font.encodeText(line);
    var width = font.widthOfTextAtSize(line, fontSize);
    if (width < maxWidth) {
      var remainder = input.substring(lastWhitespaceIdx) || void 0;
      return { line, encoded, width, remainder };
    }
    lastWhitespaceIdx = (_a = lastIndexOfWhitespace(line)) !== null && _a !== void 0 ? _a : 0;
  }
  return {
    line: input,
    encoded: font.encodeText(input),
    width: font.widthOfTextAtSize(input, fontSize),
    remainder: void 0
  };
};
var layoutMultilineText = function(text, _a) {
  var alignment = _a.alignment, fontSize = _a.fontSize, font = _a.font, bounds = _a.bounds;
  var lines = lineSplit(cleanText(text));
  if (fontSize === void 0 || fontSize === 0) {
    fontSize = computeFontSize(lines, font, bounds, true);
  }
  var height = font.heightAtSize(fontSize);
  var lineHeight = height + height * 0.2;
  var textLines = [];
  var minX = bounds.x;
  var minY = bounds.y;
  var maxX = bounds.x + bounds.width;
  var maxY = bounds.y + bounds.height;
  var y = bounds.y + bounds.height;
  for (var idx = 0, len = lines.length; idx < len; idx++) {
    var prevRemainder = lines[idx];
    while (prevRemainder !== void 0) {
      var _b = splitOutLines(prevRemainder, bounds.width, font, fontSize), line = _b.line, encoded = _b.encoded, width = _b.width, remainder = _b.remainder;
      var x = alignment === TextAlignment.Left ? bounds.x : alignment === TextAlignment.Center ? bounds.x + bounds.width / 2 - width / 2 : alignment === TextAlignment.Right ? bounds.x + bounds.width - width : bounds.x;
      y -= lineHeight;
      if (x < minX)
        minX = x;
      if (y < minY)
        minY = y;
      if (x + width > maxX)
        maxX = x + width;
      if (y + height > maxY)
        maxY = y + height;
      textLines.push({ text: line, encoded, width, height, x, y });
      prevRemainder = remainder === null || remainder === void 0 ? void 0 : remainder.trim();
    }
  }
  return {
    fontSize,
    lineHeight,
    lines: textLines,
    bounds: {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    }
  };
};
var layoutCombedText = function(text, _a) {
  var fontSize = _a.fontSize, font = _a.font, bounds = _a.bounds, cellCount = _a.cellCount;
  var line = mergeLines(cleanText(text));
  if (line.length > cellCount) {
    throw new CombedTextLayoutError(line.length, cellCount);
  }
  if (fontSize === void 0 || fontSize === 0) {
    fontSize = computeCombedFontSize(line, font, bounds, cellCount);
  }
  var cellWidth = bounds.width / cellCount;
  var height = font.heightAtSize(fontSize, { descender: false });
  var y = bounds.y + (bounds.height / 2 - height / 2);
  var cells = [];
  var minX = bounds.x;
  var minY = bounds.y;
  var maxX = bounds.x + bounds.width;
  var maxY = bounds.y + bounds.height;
  var cellOffset = 0;
  var charOffset = 0;
  while (cellOffset < cellCount) {
    var _b = charAtIndex(line, charOffset), char = _b[0], charLength = _b[1];
    var encoded = font.encodeText(char);
    var width = font.widthOfTextAtSize(char, fontSize);
    var cellCenter = bounds.x + (cellWidth * cellOffset + cellWidth / 2);
    var x = cellCenter - width / 2;
    if (x < minX)
      minX = x;
    if (y < minY)
      minY = y;
    if (x + width > maxX)
      maxX = x + width;
    if (y + height > maxY)
      maxY = y + height;
    cells.push({ text: line, encoded, width, height, x, y });
    cellOffset += 1;
    charOffset += charLength;
  }
  return {
    fontSize,
    cells,
    bounds: {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    }
  };
};
var layoutSinglelineText = function(text, _a) {
  var alignment = _a.alignment, fontSize = _a.fontSize, font = _a.font, bounds = _a.bounds;
  var line = mergeLines(cleanText(text));
  if (fontSize === void 0 || fontSize === 0) {
    fontSize = computeFontSize([line], font, bounds);
  }
  var encoded = font.encodeText(line);
  var width = font.widthOfTextAtSize(line, fontSize);
  var height = font.heightAtSize(fontSize, { descender: false });
  var x = alignment === TextAlignment.Left ? bounds.x : alignment === TextAlignment.Center ? bounds.x + bounds.width / 2 - width / 2 : alignment === TextAlignment.Right ? bounds.x + bounds.width - width : bounds.x;
  var y = bounds.y + (bounds.height / 2 - height / 2);
  return {
    fontSize,
    line: { text: line, encoded, width, height, x, y },
    bounds: { x, y, width, height }
  };
};
var normalizeAppearance = function(appearance) {
  if ("normal" in appearance)
    return appearance;
  return { normal: appearance };
};
var tfRegex = /\/([^\0\t\n\f\r\ ]+)[\0\t\n\f\r\ ]+(\d*\.\d+|\d+)[\0\t\n\f\r\ ]+Tf/;
var getDefaultFontSize = function(field) {
  var _a, _b;
  var da = (_a = field.getDefaultAppearance()) !== null && _a !== void 0 ? _a : "";
  var daMatch = (_b = findLastMatch(da, tfRegex).match) !== null && _b !== void 0 ? _b : [];
  var defaultFontSize = Number(daMatch[2]);
  return isFinite(defaultFontSize) ? defaultFontSize : void 0;
};
var colorRegex = /(\d*\.\d+|\d+)[\0\t\n\f\r\ ]*(\d*\.\d+|\d+)?[\0\t\n\f\r\ ]*(\d*\.\d+|\d+)?[\0\t\n\f\r\ ]*(\d*\.\d+|\d+)?[\0\t\n\f\r\ ]+(g|rg|k)/;
var getDefaultColor = function(field) {
  var _a;
  var da = (_a = field.getDefaultAppearance()) !== null && _a !== void 0 ? _a : "";
  var daMatch = findLastMatch(da, colorRegex).match;
  var _b = daMatch !== null && daMatch !== void 0 ? daMatch : [], c1 = _b[1], c2 = _b[2], c3 = _b[3], c4 = _b[4], colorSpace = _b[5];
  if (colorSpace === "g" && c1) {
    return grayscale(Number(c1));
  }
  if (colorSpace === "rg" && c1 && c2 && c3) {
    return rgb(Number(c1), Number(c2), Number(c3));
  }
  if (colorSpace === "k" && c1 && c2 && c3 && c4) {
    return cmyk(Number(c1), Number(c2), Number(c3), Number(c4));
  }
  return void 0;
};
var updateDefaultAppearance = function(field, color, font, fontSize) {
  var _a;
  if (fontSize === void 0) {
    fontSize = 0;
  }
  var da = [
    setFillingColor(color).toString(),
    setFontAndSize((_a = font === null || font === void 0 ? void 0 : font.name) !== null && _a !== void 0 ? _a : "dummy__noop", fontSize).toString()
  ].join("\n");
  field.setDefaultAppearance(da);
};
var defaultCheckBoxAppearanceProvider = function(checkBox, widget) {
  var _a, _b, _c;
  var widgetColor = getDefaultColor(widget);
  var fieldColor = getDefaultColor(checkBox.acroField);
  var rectangle = widget.getRectangle();
  var ap = widget.getAppearanceCharacteristics();
  var bs = widget.getBorderStyle();
  var borderWidth = (_a = bs === null || bs === void 0 ? void 0 : bs.getWidth()) !== null && _a !== void 0 ? _a : 0;
  var rotation = reduceRotation(ap === null || ap === void 0 ? void 0 : ap.getRotation());
  var _d = adjustDimsForRotation(rectangle, rotation), width = _d.width, height = _d.height;
  var rotate = rotateInPlace(__assign(__assign({}, rectangle), { rotation }));
  var black = rgb(0, 0, 0);
  var borderColor = (_b = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBorderColor())) !== null && _b !== void 0 ? _b : black;
  var normalBackgroundColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor());
  var downBackgroundColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor(), 0.8);
  var textColor = (_c = widgetColor !== null && widgetColor !== void 0 ? widgetColor : fieldColor) !== null && _c !== void 0 ? _c : black;
  if (widgetColor) {
    updateDefaultAppearance(widget, textColor);
  } else {
    updateDefaultAppearance(checkBox.acroField, textColor);
  }
  var options = {
    x: 0 + borderWidth / 2,
    y: 0 + borderWidth / 2,
    width: width - borderWidth,
    height: height - borderWidth,
    thickness: 1.5,
    borderWidth,
    borderColor,
    markColor: textColor
  };
  return {
    normal: {
      on: __spreadArrays(rotate, drawCheckBox(__assign(__assign({}, options), { color: normalBackgroundColor, filled: true }))),
      off: __spreadArrays(rotate, drawCheckBox(__assign(__assign({}, options), { color: normalBackgroundColor, filled: false })))
    },
    down: {
      on: __spreadArrays(rotate, drawCheckBox(__assign(__assign({}, options), { color: downBackgroundColor, filled: true }))),
      off: __spreadArrays(rotate, drawCheckBox(__assign(__assign({}, options), { color: downBackgroundColor, filled: false })))
    }
  };
};
var defaultRadioGroupAppearanceProvider = function(radioGroup, widget) {
  var _a, _b, _c;
  var widgetColor = getDefaultColor(widget);
  var fieldColor = getDefaultColor(radioGroup.acroField);
  var rectangle = widget.getRectangle();
  var ap = widget.getAppearanceCharacteristics();
  var bs = widget.getBorderStyle();
  var borderWidth = (_a = bs === null || bs === void 0 ? void 0 : bs.getWidth()) !== null && _a !== void 0 ? _a : 0;
  var rotation = reduceRotation(ap === null || ap === void 0 ? void 0 : ap.getRotation());
  var _d = adjustDimsForRotation(rectangle, rotation), width = _d.width, height = _d.height;
  var rotate = rotateInPlace(__assign(__assign({}, rectangle), { rotation }));
  var black = rgb(0, 0, 0);
  var borderColor = (_b = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBorderColor())) !== null && _b !== void 0 ? _b : black;
  var normalBackgroundColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor());
  var downBackgroundColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor(), 0.8);
  var textColor = (_c = widgetColor !== null && widgetColor !== void 0 ? widgetColor : fieldColor) !== null && _c !== void 0 ? _c : black;
  if (widgetColor) {
    updateDefaultAppearance(widget, textColor);
  } else {
    updateDefaultAppearance(radioGroup.acroField, textColor);
  }
  var options = {
    x: width / 2,
    y: height / 2,
    width: width - borderWidth,
    height: height - borderWidth,
    borderWidth,
    borderColor,
    dotColor: textColor
  };
  return {
    normal: {
      on: __spreadArrays(rotate, drawRadioButton(__assign(__assign({}, options), { color: normalBackgroundColor, filled: true }))),
      off: __spreadArrays(rotate, drawRadioButton(__assign(__assign({}, options), { color: normalBackgroundColor, filled: false })))
    },
    down: {
      on: __spreadArrays(rotate, drawRadioButton(__assign(__assign({}, options), { color: downBackgroundColor, filled: true }))),
      off: __spreadArrays(rotate, drawRadioButton(__assign(__assign({}, options), { color: downBackgroundColor, filled: false })))
    }
  };
};
var defaultButtonAppearanceProvider = function(button, widget, font) {
  var _a, _b, _c, _d, _e;
  var widgetColor = getDefaultColor(widget);
  var fieldColor = getDefaultColor(button.acroField);
  var widgetFontSize = getDefaultFontSize(widget);
  var fieldFontSize = getDefaultFontSize(button.acroField);
  var rectangle = widget.getRectangle();
  var ap = widget.getAppearanceCharacteristics();
  var bs = widget.getBorderStyle();
  var captions = ap === null || ap === void 0 ? void 0 : ap.getCaptions();
  var normalText = (_a = captions === null || captions === void 0 ? void 0 : captions.normal) !== null && _a !== void 0 ? _a : "";
  var downText = (_c = (_b = captions === null || captions === void 0 ? void 0 : captions.down) !== null && _b !== void 0 ? _b : normalText) !== null && _c !== void 0 ? _c : "";
  var borderWidth = (_d = bs === null || bs === void 0 ? void 0 : bs.getWidth()) !== null && _d !== void 0 ? _d : 0;
  var rotation = reduceRotation(ap === null || ap === void 0 ? void 0 : ap.getRotation());
  var _f = adjustDimsForRotation(rectangle, rotation), width = _f.width, height = _f.height;
  var rotate = rotateInPlace(__assign(__assign({}, rectangle), { rotation }));
  var black = rgb(0, 0, 0);
  var borderColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBorderColor());
  var normalBackgroundColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor());
  var downBackgroundColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor(), 0.8);
  var bounds = {
    x: borderWidth,
    y: borderWidth,
    width: width - borderWidth * 2,
    height: height - borderWidth * 2
  };
  var normalLayout = layoutSinglelineText(normalText, {
    alignment: TextAlignment.Center,
    fontSize: widgetFontSize !== null && widgetFontSize !== void 0 ? widgetFontSize : fieldFontSize,
    font,
    bounds
  });
  var downLayout = layoutSinglelineText(downText, {
    alignment: TextAlignment.Center,
    fontSize: widgetFontSize !== null && widgetFontSize !== void 0 ? widgetFontSize : fieldFontSize,
    font,
    bounds
  });
  var fontSize = Math.min(normalLayout.fontSize, downLayout.fontSize);
  var textColor = (_e = widgetColor !== null && widgetColor !== void 0 ? widgetColor : fieldColor) !== null && _e !== void 0 ? _e : black;
  if (widgetColor || widgetFontSize !== void 0) {
    updateDefaultAppearance(widget, textColor, font, fontSize);
  } else {
    updateDefaultAppearance(button.acroField, textColor, font, fontSize);
  }
  var options = {
    x: 0 + borderWidth / 2,
    y: 0 + borderWidth / 2,
    width: width - borderWidth,
    height: height - borderWidth,
    borderWidth,
    borderColor,
    textColor,
    font: font.name,
    fontSize
  };
  return {
    normal: __spreadArrays(rotate, drawButton(__assign(__assign({}, options), { color: normalBackgroundColor, textLines: [normalLayout.line] }))),
    down: __spreadArrays(rotate, drawButton(__assign(__assign({}, options), { color: downBackgroundColor, textLines: [downLayout.line] })))
  };
};
var defaultTextFieldAppearanceProvider = function(textField, widget, font) {
  var _a, _b, _c, _d;
  var widgetColor = getDefaultColor(widget);
  var fieldColor = getDefaultColor(textField.acroField);
  var widgetFontSize = getDefaultFontSize(widget);
  var fieldFontSize = getDefaultFontSize(textField.acroField);
  var rectangle = widget.getRectangle();
  var ap = widget.getAppearanceCharacteristics();
  var bs = widget.getBorderStyle();
  var text = (_a = textField.getText()) !== null && _a !== void 0 ? _a : "";
  var borderWidth = (_b = bs === null || bs === void 0 ? void 0 : bs.getWidth()) !== null && _b !== void 0 ? _b : 0;
  var rotation = reduceRotation(ap === null || ap === void 0 ? void 0 : ap.getRotation());
  var _e = adjustDimsForRotation(rectangle, rotation), width = _e.width, height = _e.height;
  var rotate = rotateInPlace(__assign(__assign({}, rectangle), { rotation }));
  var black = rgb(0, 0, 0);
  var borderColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBorderColor());
  var normalBackgroundColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor());
  var textLines;
  var fontSize;
  var padding = textField.isCombed() ? 0 : 1;
  var bounds = {
    x: borderWidth + padding,
    y: borderWidth + padding,
    width: width - (borderWidth + padding) * 2,
    height: height - (borderWidth + padding) * 2
  };
  if (textField.isMultiline()) {
    var layout = layoutMultilineText(text, {
      alignment: textField.getAlignment(),
      fontSize: widgetFontSize !== null && widgetFontSize !== void 0 ? widgetFontSize : fieldFontSize,
      font,
      bounds
    });
    textLines = layout.lines;
    fontSize = layout.fontSize;
  } else if (textField.isCombed()) {
    var layout = layoutCombedText(text, {
      fontSize: widgetFontSize !== null && widgetFontSize !== void 0 ? widgetFontSize : fieldFontSize,
      font,
      bounds,
      cellCount: (_c = textField.getMaxLength()) !== null && _c !== void 0 ? _c : 0
    });
    textLines = layout.cells;
    fontSize = layout.fontSize;
  } else {
    var layout = layoutSinglelineText(text, {
      alignment: textField.getAlignment(),
      fontSize: widgetFontSize !== null && widgetFontSize !== void 0 ? widgetFontSize : fieldFontSize,
      font,
      bounds
    });
    textLines = [layout.line];
    fontSize = layout.fontSize;
  }
  var textColor = (_d = widgetColor !== null && widgetColor !== void 0 ? widgetColor : fieldColor) !== null && _d !== void 0 ? _d : black;
  if (widgetColor || widgetFontSize !== void 0) {
    updateDefaultAppearance(widget, textColor, font, fontSize);
  } else {
    updateDefaultAppearance(textField.acroField, textColor, font, fontSize);
  }
  var options = {
    x: 0 + borderWidth / 2,
    y: 0 + borderWidth / 2,
    width: width - borderWidth,
    height: height - borderWidth,
    borderWidth: borderWidth !== null && borderWidth !== void 0 ? borderWidth : 0,
    borderColor,
    textColor,
    font: font.name,
    fontSize,
    color: normalBackgroundColor,
    textLines,
    padding
  };
  return __spreadArrays(rotate, drawTextField(options));
};
var defaultDropdownAppearanceProvider = function(dropdown, widget, font) {
  var _a, _b, _c;
  var widgetColor = getDefaultColor(widget);
  var fieldColor = getDefaultColor(dropdown.acroField);
  var widgetFontSize = getDefaultFontSize(widget);
  var fieldFontSize = getDefaultFontSize(dropdown.acroField);
  var rectangle = widget.getRectangle();
  var ap = widget.getAppearanceCharacteristics();
  var bs = widget.getBorderStyle();
  var text = (_a = dropdown.getSelected()[0]) !== null && _a !== void 0 ? _a : "";
  var borderWidth = (_b = bs === null || bs === void 0 ? void 0 : bs.getWidth()) !== null && _b !== void 0 ? _b : 0;
  var rotation = reduceRotation(ap === null || ap === void 0 ? void 0 : ap.getRotation());
  var _d = adjustDimsForRotation(rectangle, rotation), width = _d.width, height = _d.height;
  var rotate = rotateInPlace(__assign(__assign({}, rectangle), { rotation }));
  var black = rgb(0, 0, 0);
  var borderColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBorderColor());
  var normalBackgroundColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor());
  var padding = 1;
  var bounds = {
    x: borderWidth + padding,
    y: borderWidth + padding,
    width: width - (borderWidth + padding) * 2,
    height: height - (borderWidth + padding) * 2
  };
  var _e = layoutSinglelineText(text, {
    alignment: TextAlignment.Left,
    fontSize: widgetFontSize !== null && widgetFontSize !== void 0 ? widgetFontSize : fieldFontSize,
    font,
    bounds
  }), line = _e.line, fontSize = _e.fontSize;
  var textColor = (_c = widgetColor !== null && widgetColor !== void 0 ? widgetColor : fieldColor) !== null && _c !== void 0 ? _c : black;
  if (widgetColor || widgetFontSize !== void 0) {
    updateDefaultAppearance(widget, textColor, font, fontSize);
  } else {
    updateDefaultAppearance(dropdown.acroField, textColor, font, fontSize);
  }
  var options = {
    x: 0 + borderWidth / 2,
    y: 0 + borderWidth / 2,
    width: width - borderWidth,
    height: height - borderWidth,
    borderWidth: borderWidth !== null && borderWidth !== void 0 ? borderWidth : 0,
    borderColor,
    textColor,
    font: font.name,
    fontSize,
    color: normalBackgroundColor,
    textLines: [line],
    padding
  };
  return __spreadArrays(rotate, drawTextField(options));
};
var defaultOptionListAppearanceProvider = function(optionList, widget, font) {
  var _a, _b;
  var widgetColor = getDefaultColor(widget);
  var fieldColor = getDefaultColor(optionList.acroField);
  var widgetFontSize = getDefaultFontSize(widget);
  var fieldFontSize = getDefaultFontSize(optionList.acroField);
  var rectangle = widget.getRectangle();
  var ap = widget.getAppearanceCharacteristics();
  var bs = widget.getBorderStyle();
  var borderWidth = (_a = bs === null || bs === void 0 ? void 0 : bs.getWidth()) !== null && _a !== void 0 ? _a : 0;
  var rotation = reduceRotation(ap === null || ap === void 0 ? void 0 : ap.getRotation());
  var _c = adjustDimsForRotation(rectangle, rotation), width = _c.width, height = _c.height;
  var rotate = rotateInPlace(__assign(__assign({}, rectangle), { rotation }));
  var black = rgb(0, 0, 0);
  var borderColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBorderColor());
  var normalBackgroundColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor());
  var options = optionList.getOptions();
  var selected = optionList.getSelected();
  if (optionList.isSorted())
    options.sort();
  var text = "";
  for (var idx = 0, len = options.length; idx < len; idx++) {
    text += options[idx];
    if (idx < len - 1)
      text += "\n";
  }
  var padding = 1;
  var bounds = {
    x: borderWidth + padding,
    y: borderWidth + padding,
    width: width - (borderWidth + padding) * 2,
    height: height - (borderWidth + padding) * 2
  };
  var _d = layoutMultilineText(text, {
    alignment: TextAlignment.Left,
    fontSize: widgetFontSize !== null && widgetFontSize !== void 0 ? widgetFontSize : fieldFontSize,
    font,
    bounds
  }), lines = _d.lines, fontSize = _d.fontSize, lineHeight = _d.lineHeight;
  var selectedLines = [];
  for (var idx = 0, len = lines.length; idx < len; idx++) {
    var line = lines[idx];
    if (selected.includes(line.text))
      selectedLines.push(idx);
  }
  var blue = rgb(153 / 255, 193 / 255, 218 / 255);
  var textColor = (_b = widgetColor !== null && widgetColor !== void 0 ? widgetColor : fieldColor) !== null && _b !== void 0 ? _b : black;
  if (widgetColor || widgetFontSize !== void 0) {
    updateDefaultAppearance(widget, textColor, font, fontSize);
  } else {
    updateDefaultAppearance(optionList.acroField, textColor, font, fontSize);
  }
  return __spreadArrays(rotate, drawOptionList({
    x: 0 + borderWidth / 2,
    y: 0 + borderWidth / 2,
    width: width - borderWidth,
    height: height - borderWidth,
    borderWidth: borderWidth !== null && borderWidth !== void 0 ? borderWidth : 0,
    borderColor,
    textColor,
    font: font.name,
    fontSize,
    color: normalBackgroundColor,
    textLines: lines,
    lineHeight,
    selectedColor: blue,
    selectedLines,
    padding
  }));
};
var PDFEmbeddedPage = (
  /** @class */
  (function() {
    function PDFEmbeddedPage2(ref, doc, embedder) {
      this.alreadyEmbedded = false;
      assertIs(ref, "ref", [[PDFRef, "PDFRef"]]);
      assertIs(doc, "doc", [[PDFDocument, "PDFDocument"]]);
      assertIs(embedder, "embedder", [[PDFPageEmbedder, "PDFPageEmbedder"]]);
      this.ref = ref;
      this.doc = doc;
      this.width = embedder.width;
      this.height = embedder.height;
      this.embedder = embedder;
    }
    PDFEmbeddedPage2.prototype.scale = function(factor) {
      assertIs(factor, "factor", ["number"]);
      return { width: this.width * factor, height: this.height * factor };
    };
    PDFEmbeddedPage2.prototype.size = function() {
      return this.scale(1);
    };
    PDFEmbeddedPage2.prototype.embed = function() {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              if (!!this.alreadyEmbedded) return [3, 2];
              return [4, this.embedder.embedIntoContext(this.doc.context, this.ref)];
            case 1:
              _a.sent();
              this.alreadyEmbedded = true;
              _a.label = 2;
            case 2:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
    PDFEmbeddedPage2.of = function(ref, doc, embedder) {
      return new PDFEmbeddedPage2(ref, doc, embedder);
    };
    return PDFEmbeddedPage2;
  })()
);
var PDFFont = (
  /** @class */
  (function() {
    function PDFFont2(ref, doc, embedder) {
      this.modified = true;
      assertIs(ref, "ref", [[PDFRef, "PDFRef"]]);
      assertIs(doc, "doc", [[PDFDocument, "PDFDocument"]]);
      assertIs(embedder, "embedder", [
        [CustomFontEmbedder, "CustomFontEmbedder"],
        [StandardFontEmbedder, "StandardFontEmbedder"]
      ]);
      this.ref = ref;
      this.doc = doc;
      this.name = embedder.fontName;
      this.embedder = embedder;
    }
    PDFFont2.prototype.encodeText = function(text) {
      assertIs(text, "text", ["string"]);
      this.modified = true;
      return this.embedder.encodeText(text);
    };
    PDFFont2.prototype.widthOfTextAtSize = function(text, size) {
      assertIs(text, "text", ["string"]);
      assertIs(size, "size", ["number"]);
      return this.embedder.widthOfTextAtSize(text, size);
    };
    PDFFont2.prototype.heightAtSize = function(size, options) {
      var _a;
      assertIs(size, "size", ["number"]);
      assertOrUndefined(options === null || options === void 0 ? void 0 : options.descender, "options.descender", ["boolean"]);
      return this.embedder.heightOfFontAtSize(size, {
        descender: (_a = options === null || options === void 0 ? void 0 : options.descender) !== null && _a !== void 0 ? _a : true
      });
    };
    PDFFont2.prototype.sizeAtHeight = function(height) {
      assertIs(height, "height", ["number"]);
      return this.embedder.sizeOfFontAtHeight(height);
    };
    PDFFont2.prototype.getCharacterSet = function() {
      if (this.embedder instanceof StandardFontEmbedder) {
        return this.embedder.encoding.supportedCodePoints;
      } else {
        return this.embedder.font.characterSet;
      }
    };
    PDFFont2.prototype.embed = function() {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              if (!this.modified) return [3, 2];
              return [4, this.embedder.embedIntoContext(this.doc.context, this.ref)];
            case 1:
              _a.sent();
              this.modified = false;
              _a.label = 2;
            case 2:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
    PDFFont2.of = function(ref, doc, embedder) {
      return new PDFFont2(ref, doc, embedder);
    };
    return PDFFont2;
  })()
);
var PDFImage = (
  /** @class */
  (function() {
    function PDFImage2(ref, doc, embedder) {
      assertIs(ref, "ref", [[PDFRef, "PDFRef"]]);
      assertIs(doc, "doc", [[PDFDocument, "PDFDocument"]]);
      assertIs(embedder, "embedder", [
        [JpegEmbedder, "JpegEmbedder"],
        [PngEmbedder, "PngEmbedder"]
      ]);
      this.ref = ref;
      this.doc = doc;
      this.width = embedder.width;
      this.height = embedder.height;
      this.embedder = embedder;
    }
    PDFImage2.prototype.scale = function(factor) {
      assertIs(factor, "factor", ["number"]);
      return { width: this.width * factor, height: this.height * factor };
    };
    PDFImage2.prototype.scaleToFit = function(width, height) {
      assertIs(width, "width", ["number"]);
      assertIs(height, "height", ["number"]);
      var imgWidthScale = width / this.width;
      var imgHeightScale = height / this.height;
      var scale2 = Math.min(imgWidthScale, imgHeightScale);
      return this.scale(scale2);
    };
    PDFImage2.prototype.size = function() {
      return this.scale(1);
    };
    PDFImage2.prototype.embed = function() {
      return __awaiter(this, void 0, void 0, function() {
        var _a, doc, ref;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              if (!this.embedder)
                return [
                  2
                  /*return*/
                ];
              if (!this.embedTask) {
                _a = this, doc = _a.doc, ref = _a.ref;
                this.embedTask = this.embedder.embedIntoContext(doc.context, ref);
              }
              return [4, this.embedTask];
            case 1:
              _b.sent();
              this.embedder = void 0;
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
    PDFImage2.of = function(ref, doc, embedder) {
      return new PDFImage2(ref, doc, embedder);
    };
    return PDFImage2;
  })()
);
var ImageAlignment;
(function(ImageAlignment2) {
  ImageAlignment2[ImageAlignment2["Left"] = 0] = "Left";
  ImageAlignment2[ImageAlignment2["Center"] = 1] = "Center";
  ImageAlignment2[ImageAlignment2["Right"] = 2] = "Right";
})(ImageAlignment || (ImageAlignment = {}));
var assertFieldAppearanceOptions = function(options) {
  assertOrUndefined(options === null || options === void 0 ? void 0 : options.x, "options.x", ["number"]);
  assertOrUndefined(options === null || options === void 0 ? void 0 : options.y, "options.y", ["number"]);
  assertOrUndefined(options === null || options === void 0 ? void 0 : options.width, "options.width", ["number"]);
  assertOrUndefined(options === null || options === void 0 ? void 0 : options.height, "options.height", ["number"]);
  assertOrUndefined(options === null || options === void 0 ? void 0 : options.textColor, "options.textColor", [
    [Object, "Color"]
  ]);
  assertOrUndefined(options === null || options === void 0 ? void 0 : options.backgroundColor, "options.backgroundColor", [
    [Object, "Color"]
  ]);
  assertOrUndefined(options === null || options === void 0 ? void 0 : options.borderColor, "options.borderColor", [
    [Object, "Color"]
  ]);
  assertOrUndefined(options === null || options === void 0 ? void 0 : options.borderWidth, "options.borderWidth", ["number"]);
  assertOrUndefined(options === null || options === void 0 ? void 0 : options.rotate, "options.rotate", [[Object, "Rotation"]]);
};
var PDFField = (
  /** @class */
  (function() {
    function PDFField2(acroField, ref, doc) {
      assertIs(acroField, "acroField", [[PDFAcroTerminal, "PDFAcroTerminal"]]);
      assertIs(ref, "ref", [[PDFRef, "PDFRef"]]);
      assertIs(doc, "doc", [[PDFDocument, "PDFDocument"]]);
      this.acroField = acroField;
      this.ref = ref;
      this.doc = doc;
    }
    PDFField2.prototype.getName = function() {
      var _a;
      return (_a = this.acroField.getFullyQualifiedName()) !== null && _a !== void 0 ? _a : "";
    };
    PDFField2.prototype.isReadOnly = function() {
      return this.acroField.hasFlag(AcroFieldFlags.ReadOnly);
    };
    PDFField2.prototype.enableReadOnly = function() {
      this.acroField.setFlagTo(AcroFieldFlags.ReadOnly, true);
    };
    PDFField2.prototype.disableReadOnly = function() {
      this.acroField.setFlagTo(AcroFieldFlags.ReadOnly, false);
    };
    PDFField2.prototype.isRequired = function() {
      return this.acroField.hasFlag(AcroFieldFlags.Required);
    };
    PDFField2.prototype.enableRequired = function() {
      this.acroField.setFlagTo(AcroFieldFlags.Required, true);
    };
    PDFField2.prototype.disableRequired = function() {
      this.acroField.setFlagTo(AcroFieldFlags.Required, false);
    };
    PDFField2.prototype.isExported = function() {
      return !this.acroField.hasFlag(AcroFieldFlags.NoExport);
    };
    PDFField2.prototype.enableExporting = function() {
      this.acroField.setFlagTo(AcroFieldFlags.NoExport, false);
    };
    PDFField2.prototype.disableExporting = function() {
      this.acroField.setFlagTo(AcroFieldFlags.NoExport, true);
    };
    PDFField2.prototype.needsAppearancesUpdate = function() {
      throw new MethodNotImplementedError(this.constructor.name, "needsAppearancesUpdate");
    };
    PDFField2.prototype.defaultUpdateAppearances = function(_font) {
      throw new MethodNotImplementedError(this.constructor.name, "defaultUpdateAppearances");
    };
    PDFField2.prototype.markAsDirty = function() {
      this.doc.getForm().markFieldAsDirty(this.ref);
    };
    PDFField2.prototype.markAsClean = function() {
      this.doc.getForm().markFieldAsClean(this.ref);
    };
    PDFField2.prototype.isDirty = function() {
      return this.doc.getForm().fieldIsDirty(this.ref);
    };
    PDFField2.prototype.createWidget = function(options) {
      var _a;
      var textColor = options.textColor;
      var backgroundColor = options.backgroundColor;
      var borderColor = options.borderColor;
      var borderWidth = options.borderWidth;
      var degreesAngle = toDegrees(options.rotate);
      var caption = options.caption;
      var x = options.x;
      var y = options.y;
      var width = options.width + borderWidth;
      var height = options.height + borderWidth;
      var hidden = Boolean(options.hidden);
      var pageRef = options.page;
      assertMultiple(degreesAngle, "degreesAngle", 90);
      var widget = PDFWidgetAnnotation.create(this.doc.context, this.ref);
      var rect = rotateRectangle({ x, y, width, height }, borderWidth, degreesAngle);
      widget.setRectangle(rect);
      if (pageRef)
        widget.setP(pageRef);
      var ac = widget.getOrCreateAppearanceCharacteristics();
      if (backgroundColor) {
        ac.setBackgroundColor(colorToComponents(backgroundColor));
      }
      ac.setRotation(degreesAngle);
      if (caption)
        ac.setCaptions({ normal: caption });
      if (borderColor)
        ac.setBorderColor(colorToComponents(borderColor));
      var bs = widget.getOrCreateBorderStyle();
      if (borderWidth !== void 0)
        bs.setWidth(borderWidth);
      widget.setFlagTo(AnnotationFlags.Print, true);
      widget.setFlagTo(AnnotationFlags.Hidden, hidden);
      widget.setFlagTo(AnnotationFlags.Invisible, false);
      if (textColor) {
        var da = (_a = this.acroField.getDefaultAppearance()) !== null && _a !== void 0 ? _a : "";
        var newDa = da + "\n" + setFillingColor(textColor).toString();
        this.acroField.setDefaultAppearance(newDa);
      }
      return widget;
    };
    PDFField2.prototype.updateWidgetAppearanceWithFont = function(widget, font, _a) {
      var normal = _a.normal, rollover = _a.rollover, down = _a.down;
      this.updateWidgetAppearances(widget, {
        normal: this.createAppearanceStream(widget, normal, font),
        rollover: rollover && this.createAppearanceStream(widget, rollover, font),
        down: down && this.createAppearanceStream(widget, down, font)
      });
    };
    PDFField2.prototype.updateOnOffWidgetAppearance = function(widget, onValue, _a) {
      var normal = _a.normal, rollover = _a.rollover, down = _a.down;
      this.updateWidgetAppearances(widget, {
        normal: this.createAppearanceDict(widget, normal, onValue),
        rollover: rollover && this.createAppearanceDict(widget, rollover, onValue),
        down: down && this.createAppearanceDict(widget, down, onValue)
      });
    };
    PDFField2.prototype.updateWidgetAppearances = function(widget, _a) {
      var normal = _a.normal, rollover = _a.rollover, down = _a.down;
      widget.setNormalAppearance(normal);
      if (rollover) {
        widget.setRolloverAppearance(rollover);
      } else {
        widget.removeRolloverAppearance();
      }
      if (down) {
        widget.setDownAppearance(down);
      } else {
        widget.removeDownAppearance();
      }
    };
    PDFField2.prototype.createAppearanceStream = function(widget, appearance, font) {
      var _a;
      var context = this.acroField.dict.context;
      var _b = widget.getRectangle(), width = _b.width, height = _b.height;
      var Resources = font && { Font: (_a = {}, _a[font.name] = font.ref, _a) };
      var stream2 = context.formXObject(appearance, {
        Resources,
        BBox: context.obj([0, 0, width, height]),
        Matrix: context.obj([1, 0, 0, 1, 0, 0])
      });
      var streamRef = context.register(stream2);
      return streamRef;
    };
    PDFField2.prototype.createImageAppearanceStream = function(widget, image, alignment) {
      var _a;
      var _b;
      var context = this.acroField.dict.context;
      var rectangle = widget.getRectangle();
      var ap = widget.getAppearanceCharacteristics();
      var bs = widget.getBorderStyle();
      var borderWidth = (_b = bs === null || bs === void 0 ? void 0 : bs.getWidth()) !== null && _b !== void 0 ? _b : 0;
      var rotation = reduceRotation(ap === null || ap === void 0 ? void 0 : ap.getRotation());
      var rotate = rotateInPlace(__assign(__assign({}, rectangle), { rotation }));
      var adj = adjustDimsForRotation(rectangle, rotation);
      var imageDims = image.scaleToFit(adj.width - borderWidth * 2, adj.height - borderWidth * 2);
      var options = {
        x: borderWidth,
        y: borderWidth,
        width: imageDims.width,
        height: imageDims.height,
        //
        rotate: degrees(0),
        xSkew: degrees(0),
        ySkew: degrees(0)
      };
      if (alignment === ImageAlignment.Center) {
        options.x += (adj.width - borderWidth * 2) / 2 - imageDims.width / 2;
        options.y += (adj.height - borderWidth * 2) / 2 - imageDims.height / 2;
      } else if (alignment === ImageAlignment.Right) {
        options.x = adj.width - borderWidth - imageDims.width;
        options.y = adj.height - borderWidth - imageDims.height;
      }
      var imageName = this.doc.context.addRandomSuffix("Image", 10);
      var appearance = __spreadArrays(rotate, drawImage(imageName, options));
      var Resources = { XObject: (_a = {}, _a[imageName] = image.ref, _a) };
      var stream2 = context.formXObject(appearance, {
        Resources,
        BBox: context.obj([0, 0, rectangle.width, rectangle.height]),
        Matrix: context.obj([1, 0, 0, 1, 0, 0])
      });
      return context.register(stream2);
    };
    PDFField2.prototype.createAppearanceDict = function(widget, appearance, onValue) {
      var context = this.acroField.dict.context;
      var onStreamRef = this.createAppearanceStream(widget, appearance.on);
      var offStreamRef = this.createAppearanceStream(widget, appearance.off);
      var appearanceDict = context.obj({});
      appearanceDict.set(onValue, onStreamRef);
      appearanceDict.set(PDFName.of("Off"), offStreamRef);
      return appearanceDict;
    };
    return PDFField2;
  })()
);
var PDFCheckBox = (
  /** @class */
  (function(_super) {
    __extends(PDFCheckBox2, _super);
    function PDFCheckBox2(acroCheckBox, ref, doc) {
      var _this = _super.call(this, acroCheckBox, ref, doc) || this;
      assertIs(acroCheckBox, "acroCheckBox", [
        [PDFAcroCheckBox, "PDFAcroCheckBox"]
      ]);
      _this.acroField = acroCheckBox;
      return _this;
    }
    PDFCheckBox2.prototype.check = function() {
      var _a;
      var onValue = (_a = this.acroField.getOnValue()) !== null && _a !== void 0 ? _a : PDFName.of("Yes");
      this.markAsDirty();
      this.acroField.setValue(onValue);
    };
    PDFCheckBox2.prototype.uncheck = function() {
      this.markAsDirty();
      this.acroField.setValue(PDFName.of("Off"));
    };
    PDFCheckBox2.prototype.isChecked = function() {
      var onValue = this.acroField.getOnValue();
      return !!onValue && onValue === this.acroField.getValue();
    };
    PDFCheckBox2.prototype.addToPage = function(page, options) {
      var _a, _b, _c, _d, _e, _f;
      assertIs(page, "page", [[PDFPage, "PDFPage"]]);
      assertFieldAppearanceOptions(options);
      if (!options)
        options = {};
      if (!("textColor" in options))
        options.textColor = rgb(0, 0, 0);
      if (!("backgroundColor" in options))
        options.backgroundColor = rgb(1, 1, 1);
      if (!("borderColor" in options))
        options.borderColor = rgb(0, 0, 0);
      if (!("borderWidth" in options))
        options.borderWidth = 1;
      var widget = this.createWidget({
        x: (_a = options.x) !== null && _a !== void 0 ? _a : 0,
        y: (_b = options.y) !== null && _b !== void 0 ? _b : 0,
        width: (_c = options.width) !== null && _c !== void 0 ? _c : 50,
        height: (_d = options.height) !== null && _d !== void 0 ? _d : 50,
        textColor: options.textColor,
        backgroundColor: options.backgroundColor,
        borderColor: options.borderColor,
        borderWidth: (_e = options.borderWidth) !== null && _e !== void 0 ? _e : 0,
        rotate: (_f = options.rotate) !== null && _f !== void 0 ? _f : degrees(0),
        hidden: options.hidden,
        page: page.ref
      });
      var widgetRef = this.doc.context.register(widget.dict);
      this.acroField.addWidget(widgetRef);
      widget.setAppearanceState(PDFName.of("Off"));
      this.updateWidgetAppearance(widget, PDFName.of("Yes"));
      page.node.addAnnot(widgetRef);
    };
    PDFCheckBox2.prototype.needsAppearancesUpdate = function() {
      var _a;
      var widgets = this.acroField.getWidgets();
      for (var idx = 0, len = widgets.length; idx < len; idx++) {
        var widget = widgets[idx];
        var state = widget.getAppearanceState();
        var normal = (_a = widget.getAppearances()) === null || _a === void 0 ? void 0 : _a.normal;
        if (!(normal instanceof PDFDict))
          return true;
        if (state && !normal.has(state))
          return true;
      }
      return false;
    };
    PDFCheckBox2.prototype.defaultUpdateAppearances = function() {
      this.updateAppearances();
    };
    PDFCheckBox2.prototype.updateAppearances = function(provider) {
      var _a;
      assertOrUndefined(provider, "provider", [Function]);
      var widgets = this.acroField.getWidgets();
      for (var idx = 0, len = widgets.length; idx < len; idx++) {
        var widget = widgets[idx];
        var onValue = (_a = widget.getOnValue()) !== null && _a !== void 0 ? _a : PDFName.of("Yes");
        if (!onValue)
          continue;
        this.updateWidgetAppearance(widget, onValue, provider);
      }
      this.markAsClean();
    };
    PDFCheckBox2.prototype.updateWidgetAppearance = function(widget, onValue, provider) {
      var apProvider = provider !== null && provider !== void 0 ? provider : defaultCheckBoxAppearanceProvider;
      var appearances = normalizeAppearance(apProvider(this, widget));
      this.updateOnOffWidgetAppearance(widget, onValue, appearances);
    };
    PDFCheckBox2.of = function(acroCheckBox, ref, doc) {
      return new PDFCheckBox2(acroCheckBox, ref, doc);
    };
    return PDFCheckBox2;
  })(PDFField)
);
var PDFDropdown = (
  /** @class */
  (function(_super) {
    __extends(PDFDropdown2, _super);
    function PDFDropdown2(acroComboBox, ref, doc) {
      var _this = _super.call(this, acroComboBox, ref, doc) || this;
      assertIs(acroComboBox, "acroComboBox", [
        [PDFAcroComboBox, "PDFAcroComboBox"]
      ]);
      _this.acroField = acroComboBox;
      return _this;
    }
    PDFDropdown2.prototype.getOptions = function() {
      var rawOptions = this.acroField.getOptions();
      var options = new Array(rawOptions.length);
      for (var idx = 0, len = options.length; idx < len; idx++) {
        var _a = rawOptions[idx], display = _a.display, value = _a.value;
        options[idx] = (display !== null && display !== void 0 ? display : value).decodeText();
      }
      return options;
    };
    PDFDropdown2.prototype.getSelected = function() {
      var values2 = this.acroField.getValues();
      var selected = new Array(values2.length);
      for (var idx = 0, len = values2.length; idx < len; idx++) {
        selected[idx] = values2[idx].decodeText();
      }
      return selected;
    };
    PDFDropdown2.prototype.setOptions = function(options) {
      assertIs(options, "options", [Array]);
      var optionObjects = new Array(options.length);
      for (var idx = 0, len = options.length; idx < len; idx++) {
        optionObjects[idx] = { value: PDFHexString.fromText(options[idx]) };
      }
      this.acroField.setOptions(optionObjects);
    };
    PDFDropdown2.prototype.addOptions = function(options) {
      assertIs(options, "options", ["string", Array]);
      var optionsArr = Array.isArray(options) ? options : [options];
      var existingOptions = this.acroField.getOptions();
      var newOptions = new Array(optionsArr.length);
      for (var idx = 0, len = optionsArr.length; idx < len; idx++) {
        newOptions[idx] = { value: PDFHexString.fromText(optionsArr[idx]) };
      }
      this.acroField.setOptions(existingOptions.concat(newOptions));
    };
    PDFDropdown2.prototype.select = function(options, merge) {
      if (merge === void 0) {
        merge = false;
      }
      assertIs(options, "options", ["string", Array]);
      assertIs(merge, "merge", ["boolean"]);
      var optionsArr = Array.isArray(options) ? options : [options];
      var validOptions = this.getOptions();
      var hasCustomOption = optionsArr.find(function(option) {
        return !validOptions.includes(option);
      });
      if (hasCustomOption)
        this.enableEditing();
      this.markAsDirty();
      if (optionsArr.length > 1 || optionsArr.length === 1 && merge) {
        this.enableMultiselect();
      }
      var values2 = new Array(optionsArr.length);
      for (var idx = 0, len = optionsArr.length; idx < len; idx++) {
        values2[idx] = PDFHexString.fromText(optionsArr[idx]);
      }
      if (merge) {
        var existingValues = this.acroField.getValues();
        this.acroField.setValues(existingValues.concat(values2));
      } else {
        this.acroField.setValues(values2);
      }
    };
    PDFDropdown2.prototype.clear = function() {
      this.markAsDirty();
      this.acroField.setValues([]);
    };
    PDFDropdown2.prototype.setFontSize = function(fontSize) {
      assertPositive(fontSize, "fontSize");
      this.acroField.setFontSize(fontSize);
      this.markAsDirty();
    };
    PDFDropdown2.prototype.isEditable = function() {
      return this.acroField.hasFlag(AcroChoiceFlags.Edit);
    };
    PDFDropdown2.prototype.enableEditing = function() {
      this.acroField.setFlagTo(AcroChoiceFlags.Edit, true);
    };
    PDFDropdown2.prototype.disableEditing = function() {
      this.acroField.setFlagTo(AcroChoiceFlags.Edit, false);
    };
    PDFDropdown2.prototype.isSorted = function() {
      return this.acroField.hasFlag(AcroChoiceFlags.Sort);
    };
    PDFDropdown2.prototype.enableSorting = function() {
      this.acroField.setFlagTo(AcroChoiceFlags.Sort, true);
    };
    PDFDropdown2.prototype.disableSorting = function() {
      this.acroField.setFlagTo(AcroChoiceFlags.Sort, false);
    };
    PDFDropdown2.prototype.isMultiselect = function() {
      return this.acroField.hasFlag(AcroChoiceFlags.MultiSelect);
    };
    PDFDropdown2.prototype.enableMultiselect = function() {
      this.acroField.setFlagTo(AcroChoiceFlags.MultiSelect, true);
    };
    PDFDropdown2.prototype.disableMultiselect = function() {
      this.acroField.setFlagTo(AcroChoiceFlags.MultiSelect, false);
    };
    PDFDropdown2.prototype.isSpellChecked = function() {
      return !this.acroField.hasFlag(AcroChoiceFlags.DoNotSpellCheck);
    };
    PDFDropdown2.prototype.enableSpellChecking = function() {
      this.acroField.setFlagTo(AcroChoiceFlags.DoNotSpellCheck, false);
    };
    PDFDropdown2.prototype.disableSpellChecking = function() {
      this.acroField.setFlagTo(AcroChoiceFlags.DoNotSpellCheck, true);
    };
    PDFDropdown2.prototype.isSelectOnClick = function() {
      return this.acroField.hasFlag(AcroChoiceFlags.CommitOnSelChange);
    };
    PDFDropdown2.prototype.enableSelectOnClick = function() {
      this.acroField.setFlagTo(AcroChoiceFlags.CommitOnSelChange, true);
    };
    PDFDropdown2.prototype.disableSelectOnClick = function() {
      this.acroField.setFlagTo(AcroChoiceFlags.CommitOnSelChange, false);
    };
    PDFDropdown2.prototype.addToPage = function(page, options) {
      var _a, _b, _c, _d, _e, _f, _g;
      assertIs(page, "page", [[PDFPage, "PDFPage"]]);
      assertFieldAppearanceOptions(options);
      if (!options)
        options = {};
      if (!("textColor" in options))
        options.textColor = rgb(0, 0, 0);
      if (!("backgroundColor" in options))
        options.backgroundColor = rgb(1, 1, 1);
      if (!("borderColor" in options))
        options.borderColor = rgb(0, 0, 0);
      if (!("borderWidth" in options))
        options.borderWidth = 1;
      var widget = this.createWidget({
        x: (_a = options.x) !== null && _a !== void 0 ? _a : 0,
        y: (_b = options.y) !== null && _b !== void 0 ? _b : 0,
        width: (_c = options.width) !== null && _c !== void 0 ? _c : 200,
        height: (_d = options.height) !== null && _d !== void 0 ? _d : 50,
        textColor: options.textColor,
        backgroundColor: options.backgroundColor,
        borderColor: options.borderColor,
        borderWidth: (_e = options.borderWidth) !== null && _e !== void 0 ? _e : 0,
        rotate: (_f = options.rotate) !== null && _f !== void 0 ? _f : degrees(0),
        hidden: options.hidden,
        page: page.ref
      });
      var widgetRef = this.doc.context.register(widget.dict);
      this.acroField.addWidget(widgetRef);
      var font = (_g = options.font) !== null && _g !== void 0 ? _g : this.doc.getForm().getDefaultFont();
      this.updateWidgetAppearance(widget, font);
      page.node.addAnnot(widgetRef);
    };
    PDFDropdown2.prototype.needsAppearancesUpdate = function() {
      var _a;
      if (this.isDirty())
        return true;
      var widgets = this.acroField.getWidgets();
      for (var idx = 0, len = widgets.length; idx < len; idx++) {
        var widget = widgets[idx];
        var hasAppearances = ((_a = widget.getAppearances()) === null || _a === void 0 ? void 0 : _a.normal) instanceof PDFStream;
        if (!hasAppearances)
          return true;
      }
      return false;
    };
    PDFDropdown2.prototype.defaultUpdateAppearances = function(font) {
      assertIs(font, "font", [[PDFFont, "PDFFont"]]);
      this.updateAppearances(font);
    };
    PDFDropdown2.prototype.updateAppearances = function(font, provider) {
      assertIs(font, "font", [[PDFFont, "PDFFont"]]);
      assertOrUndefined(provider, "provider", [Function]);
      var widgets = this.acroField.getWidgets();
      for (var idx = 0, len = widgets.length; idx < len; idx++) {
        var widget = widgets[idx];
        this.updateWidgetAppearance(widget, font, provider);
      }
      this.markAsClean();
    };
    PDFDropdown2.prototype.updateWidgetAppearance = function(widget, font, provider) {
      var apProvider = provider !== null && provider !== void 0 ? provider : defaultDropdownAppearanceProvider;
      var appearances = normalizeAppearance(apProvider(this, widget, font));
      this.updateWidgetAppearanceWithFont(widget, font, appearances);
    };
    PDFDropdown2.of = function(acroComboBox, ref, doc) {
      return new PDFDropdown2(acroComboBox, ref, doc);
    };
    return PDFDropdown2;
  })(PDFField)
);
var PDFOptionList = (
  /** @class */
  (function(_super) {
    __extends(PDFOptionList2, _super);
    function PDFOptionList2(acroListBox, ref, doc) {
      var _this = _super.call(this, acroListBox, ref, doc) || this;
      assertIs(acroListBox, "acroListBox", [[PDFAcroListBox, "PDFAcroListBox"]]);
      _this.acroField = acroListBox;
      return _this;
    }
    PDFOptionList2.prototype.getOptions = function() {
      var rawOptions = this.acroField.getOptions();
      var options = new Array(rawOptions.length);
      for (var idx = 0, len = options.length; idx < len; idx++) {
        var _a = rawOptions[idx], display = _a.display, value = _a.value;
        options[idx] = (display !== null && display !== void 0 ? display : value).decodeText();
      }
      return options;
    };
    PDFOptionList2.prototype.getSelected = function() {
      var values2 = this.acroField.getValues();
      var selected = new Array(values2.length);
      for (var idx = 0, len = values2.length; idx < len; idx++) {
        selected[idx] = values2[idx].decodeText();
      }
      return selected;
    };
    PDFOptionList2.prototype.setOptions = function(options) {
      assertIs(options, "options", [Array]);
      this.markAsDirty();
      var optionObjects = new Array(options.length);
      for (var idx = 0, len = options.length; idx < len; idx++) {
        optionObjects[idx] = { value: PDFHexString.fromText(options[idx]) };
      }
      this.acroField.setOptions(optionObjects);
    };
    PDFOptionList2.prototype.addOptions = function(options) {
      assertIs(options, "options", ["string", Array]);
      this.markAsDirty();
      var optionsArr = Array.isArray(options) ? options : [options];
      var existingOptions = this.acroField.getOptions();
      var newOptions = new Array(optionsArr.length);
      for (var idx = 0, len = optionsArr.length; idx < len; idx++) {
        newOptions[idx] = { value: PDFHexString.fromText(optionsArr[idx]) };
      }
      this.acroField.setOptions(existingOptions.concat(newOptions));
    };
    PDFOptionList2.prototype.select = function(options, merge) {
      if (merge === void 0) {
        merge = false;
      }
      assertIs(options, "options", ["string", Array]);
      assertIs(merge, "merge", ["boolean"]);
      var optionsArr = Array.isArray(options) ? options : [options];
      var validOptions = this.getOptions();
      assertIsSubset(optionsArr, "option", validOptions);
      this.markAsDirty();
      if (optionsArr.length > 1 || optionsArr.length === 1 && merge) {
        this.enableMultiselect();
      }
      var values2 = new Array(optionsArr.length);
      for (var idx = 0, len = optionsArr.length; idx < len; idx++) {
        values2[idx] = PDFHexString.fromText(optionsArr[idx]);
      }
      if (merge) {
        var existingValues = this.acroField.getValues();
        this.acroField.setValues(existingValues.concat(values2));
      } else {
        this.acroField.setValues(values2);
      }
    };
    PDFOptionList2.prototype.clear = function() {
      this.markAsDirty();
      this.acroField.setValues([]);
    };
    PDFOptionList2.prototype.setFontSize = function(fontSize) {
      assertPositive(fontSize, "fontSize");
      this.acroField.setFontSize(fontSize);
      this.markAsDirty();
    };
    PDFOptionList2.prototype.isSorted = function() {
      return this.acroField.hasFlag(AcroChoiceFlags.Sort);
    };
    PDFOptionList2.prototype.enableSorting = function() {
      this.acroField.setFlagTo(AcroChoiceFlags.Sort, true);
    };
    PDFOptionList2.prototype.disableSorting = function() {
      this.acroField.setFlagTo(AcroChoiceFlags.Sort, false);
    };
    PDFOptionList2.prototype.isMultiselect = function() {
      return this.acroField.hasFlag(AcroChoiceFlags.MultiSelect);
    };
    PDFOptionList2.prototype.enableMultiselect = function() {
      this.acroField.setFlagTo(AcroChoiceFlags.MultiSelect, true);
    };
    PDFOptionList2.prototype.disableMultiselect = function() {
      this.acroField.setFlagTo(AcroChoiceFlags.MultiSelect, false);
    };
    PDFOptionList2.prototype.isSelectOnClick = function() {
      return this.acroField.hasFlag(AcroChoiceFlags.CommitOnSelChange);
    };
    PDFOptionList2.prototype.enableSelectOnClick = function() {
      this.acroField.setFlagTo(AcroChoiceFlags.CommitOnSelChange, true);
    };
    PDFOptionList2.prototype.disableSelectOnClick = function() {
      this.acroField.setFlagTo(AcroChoiceFlags.CommitOnSelChange, false);
    };
    PDFOptionList2.prototype.addToPage = function(page, options) {
      var _a, _b, _c, _d, _e, _f, _g;
      assertIs(page, "page", [[PDFPage, "PDFPage"]]);
      assertFieldAppearanceOptions(options);
      if (!options)
        options = {};
      if (!("textColor" in options))
        options.textColor = rgb(0, 0, 0);
      if (!("backgroundColor" in options))
        options.backgroundColor = rgb(1, 1, 1);
      if (!("borderColor" in options))
        options.borderColor = rgb(0, 0, 0);
      if (!("borderWidth" in options))
        options.borderWidth = 1;
      var widget = this.createWidget({
        x: (_a = options.x) !== null && _a !== void 0 ? _a : 0,
        y: (_b = options.y) !== null && _b !== void 0 ? _b : 0,
        width: (_c = options.width) !== null && _c !== void 0 ? _c : 200,
        height: (_d = options.height) !== null && _d !== void 0 ? _d : 100,
        textColor: options.textColor,
        backgroundColor: options.backgroundColor,
        borderColor: options.borderColor,
        borderWidth: (_e = options.borderWidth) !== null && _e !== void 0 ? _e : 0,
        rotate: (_f = options.rotate) !== null && _f !== void 0 ? _f : degrees(0),
        hidden: options.hidden,
        page: page.ref
      });
      var widgetRef = this.doc.context.register(widget.dict);
      this.acroField.addWidget(widgetRef);
      var font = (_g = options.font) !== null && _g !== void 0 ? _g : this.doc.getForm().getDefaultFont();
      this.updateWidgetAppearance(widget, font);
      page.node.addAnnot(widgetRef);
    };
    PDFOptionList2.prototype.needsAppearancesUpdate = function() {
      var _a;
      if (this.isDirty())
        return true;
      var widgets = this.acroField.getWidgets();
      for (var idx = 0, len = widgets.length; idx < len; idx++) {
        var widget = widgets[idx];
        var hasAppearances = ((_a = widget.getAppearances()) === null || _a === void 0 ? void 0 : _a.normal) instanceof PDFStream;
        if (!hasAppearances)
          return true;
      }
      return false;
    };
    PDFOptionList2.prototype.defaultUpdateAppearances = function(font) {
      assertIs(font, "font", [[PDFFont, "PDFFont"]]);
      this.updateAppearances(font);
    };
    PDFOptionList2.prototype.updateAppearances = function(font, provider) {
      assertIs(font, "font", [[PDFFont, "PDFFont"]]);
      assertOrUndefined(provider, "provider", [Function]);
      var widgets = this.acroField.getWidgets();
      for (var idx = 0, len = widgets.length; idx < len; idx++) {
        var widget = widgets[idx];
        this.updateWidgetAppearance(widget, font, provider);
      }
      this.markAsClean();
    };
    PDFOptionList2.prototype.updateWidgetAppearance = function(widget, font, provider) {
      var apProvider = provider !== null && provider !== void 0 ? provider : defaultOptionListAppearanceProvider;
      var appearances = normalizeAppearance(apProvider(this, widget, font));
      this.updateWidgetAppearanceWithFont(widget, font, appearances);
    };
    PDFOptionList2.of = function(acroListBox, ref, doc) {
      return new PDFOptionList2(acroListBox, ref, doc);
    };
    return PDFOptionList2;
  })(PDFField)
);
var PDFRadioGroup = (
  /** @class */
  (function(_super) {
    __extends(PDFRadioGroup2, _super);
    function PDFRadioGroup2(acroRadioButton, ref, doc) {
      var _this = _super.call(this, acroRadioButton, ref, doc) || this;
      assertIs(acroRadioButton, "acroRadioButton", [
        [PDFAcroRadioButton, "PDFAcroRadioButton"]
      ]);
      _this.acroField = acroRadioButton;
      return _this;
    }
    PDFRadioGroup2.prototype.getOptions = function() {
      var exportValues = this.acroField.getExportValues();
      if (exportValues) {
        var exportOptions = new Array(exportValues.length);
        for (var idx = 0, len = exportValues.length; idx < len; idx++) {
          exportOptions[idx] = exportValues[idx].decodeText();
        }
        return exportOptions;
      }
      var onValues = this.acroField.getOnValues();
      var onOptions = new Array(onValues.length);
      for (var idx = 0, len = onOptions.length; idx < len; idx++) {
        onOptions[idx] = onValues[idx].decodeText();
      }
      return onOptions;
    };
    PDFRadioGroup2.prototype.getSelected = function() {
      var value = this.acroField.getValue();
      if (value === PDFName.of("Off"))
        return void 0;
      var exportValues = this.acroField.getExportValues();
      if (exportValues) {
        var onValues = this.acroField.getOnValues();
        for (var idx = 0, len = onValues.length; idx < len; idx++) {
          if (onValues[idx] === value)
            return exportValues[idx].decodeText();
        }
      }
      return value.decodeText();
    };
    PDFRadioGroup2.prototype.select = function(option) {
      assertIs(option, "option", ["string"]);
      var validOptions = this.getOptions();
      assertIsOneOf(option, "option", validOptions);
      this.markAsDirty();
      var onValues = this.acroField.getOnValues();
      var exportValues = this.acroField.getExportValues();
      if (exportValues) {
        for (var idx = 0, len = exportValues.length; idx < len; idx++) {
          if (exportValues[idx].decodeText() === option) {
            this.acroField.setValue(onValues[idx]);
          }
        }
      } else {
        for (var idx = 0, len = onValues.length; idx < len; idx++) {
          var value = onValues[idx];
          if (value.decodeText() === option)
            this.acroField.setValue(value);
        }
      }
    };
    PDFRadioGroup2.prototype.clear = function() {
      this.markAsDirty();
      this.acroField.setValue(PDFName.of("Off"));
    };
    PDFRadioGroup2.prototype.isOffToggleable = function() {
      return !this.acroField.hasFlag(AcroButtonFlags.NoToggleToOff);
    };
    PDFRadioGroup2.prototype.enableOffToggling = function() {
      this.acroField.setFlagTo(AcroButtonFlags.NoToggleToOff, false);
    };
    PDFRadioGroup2.prototype.disableOffToggling = function() {
      this.acroField.setFlagTo(AcroButtonFlags.NoToggleToOff, true);
    };
    PDFRadioGroup2.prototype.isMutuallyExclusive = function() {
      return !this.acroField.hasFlag(AcroButtonFlags.RadiosInUnison);
    };
    PDFRadioGroup2.prototype.enableMutualExclusion = function() {
      this.acroField.setFlagTo(AcroButtonFlags.RadiosInUnison, false);
    };
    PDFRadioGroup2.prototype.disableMutualExclusion = function() {
      this.acroField.setFlagTo(AcroButtonFlags.RadiosInUnison, true);
    };
    PDFRadioGroup2.prototype.addOptionToPage = function(option, page, options) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j;
      assertIs(option, "option", ["string"]);
      assertIs(page, "page", [[PDFPage, "PDFPage"]]);
      assertFieldAppearanceOptions(options);
      var widget = this.createWidget({
        x: (_a = options === null || options === void 0 ? void 0 : options.x) !== null && _a !== void 0 ? _a : 0,
        y: (_b = options === null || options === void 0 ? void 0 : options.y) !== null && _b !== void 0 ? _b : 0,
        width: (_c = options === null || options === void 0 ? void 0 : options.width) !== null && _c !== void 0 ? _c : 50,
        height: (_d = options === null || options === void 0 ? void 0 : options.height) !== null && _d !== void 0 ? _d : 50,
        textColor: (_e = options === null || options === void 0 ? void 0 : options.textColor) !== null && _e !== void 0 ? _e : rgb(0, 0, 0),
        backgroundColor: (_f = options === null || options === void 0 ? void 0 : options.backgroundColor) !== null && _f !== void 0 ? _f : rgb(1, 1, 1),
        borderColor: (_g = options === null || options === void 0 ? void 0 : options.borderColor) !== null && _g !== void 0 ? _g : rgb(0, 0, 0),
        borderWidth: (_h = options === null || options === void 0 ? void 0 : options.borderWidth) !== null && _h !== void 0 ? _h : 1,
        rotate: (_j = options === null || options === void 0 ? void 0 : options.rotate) !== null && _j !== void 0 ? _j : degrees(0),
        hidden: options === null || options === void 0 ? void 0 : options.hidden,
        page: page.ref
      });
      var widgetRef = this.doc.context.register(widget.dict);
      var apStateValue = this.acroField.addWidgetWithOpt(widgetRef, PDFHexString.fromText(option), !this.isMutuallyExclusive());
      widget.setAppearanceState(PDFName.of("Off"));
      this.updateWidgetAppearance(widget, apStateValue);
      page.node.addAnnot(widgetRef);
    };
    PDFRadioGroup2.prototype.needsAppearancesUpdate = function() {
      var _a;
      var widgets = this.acroField.getWidgets();
      for (var idx = 0, len = widgets.length; idx < len; idx++) {
        var widget = widgets[idx];
        var state = widget.getAppearanceState();
        var normal = (_a = widget.getAppearances()) === null || _a === void 0 ? void 0 : _a.normal;
        if (!(normal instanceof PDFDict))
          return true;
        if (state && !normal.has(state))
          return true;
      }
      return false;
    };
    PDFRadioGroup2.prototype.defaultUpdateAppearances = function() {
      this.updateAppearances();
    };
    PDFRadioGroup2.prototype.updateAppearances = function(provider) {
      assertOrUndefined(provider, "provider", [Function]);
      var widgets = this.acroField.getWidgets();
      for (var idx = 0, len = widgets.length; idx < len; idx++) {
        var widget = widgets[idx];
        var onValue = widget.getOnValue();
        if (!onValue)
          continue;
        this.updateWidgetAppearance(widget, onValue, provider);
      }
    };
    PDFRadioGroup2.prototype.updateWidgetAppearance = function(widget, onValue, provider) {
      var apProvider = provider !== null && provider !== void 0 ? provider : defaultRadioGroupAppearanceProvider;
      var appearances = normalizeAppearance(apProvider(this, widget));
      this.updateOnOffWidgetAppearance(widget, onValue, appearances);
    };
    PDFRadioGroup2.of = function(acroRadioButton, ref, doc) {
      return new PDFRadioGroup2(acroRadioButton, ref, doc);
    };
    return PDFRadioGroup2;
  })(PDFField)
);
var PDFSignature = (
  /** @class */
  (function(_super) {
    __extends(PDFSignature2, _super);
    function PDFSignature2(acroSignature, ref, doc) {
      var _this = _super.call(this, acroSignature, ref, doc) || this;
      assertIs(acroSignature, "acroSignature", [
        [PDFAcroSignature, "PDFAcroSignature"]
      ]);
      _this.acroField = acroSignature;
      return _this;
    }
    PDFSignature2.prototype.needsAppearancesUpdate = function() {
      return false;
    };
    PDFSignature2.of = function(acroSignature, ref, doc) {
      return new PDFSignature2(acroSignature, ref, doc);
    };
    return PDFSignature2;
  })(PDFField)
);
var PDFTextField = (
  /** @class */
  (function(_super) {
    __extends(PDFTextField2, _super);
    function PDFTextField2(acroText, ref, doc) {
      var _this = _super.call(this, acroText, ref, doc) || this;
      assertIs(acroText, "acroText", [[PDFAcroText, "PDFAcroText"]]);
      _this.acroField = acroText;
      return _this;
    }
    PDFTextField2.prototype.getText = function() {
      var value = this.acroField.getValue();
      if (!value && this.isRichFormatted()) {
        throw new RichTextFieldReadError(this.getName());
      }
      return value === null || value === void 0 ? void 0 : value.decodeText();
    };
    PDFTextField2.prototype.setText = function(text) {
      assertOrUndefined(text, "text", ["string"]);
      var maxLength = this.getMaxLength();
      if (maxLength !== void 0 && text && text.length > maxLength) {
        throw new ExceededMaxLengthError(text.length, maxLength, this.getName());
      }
      this.markAsDirty();
      this.disableRichFormatting();
      if (text) {
        this.acroField.setValue(PDFHexString.fromText(text));
      } else {
        this.acroField.removeValue();
      }
    };
    PDFTextField2.prototype.getAlignment = function() {
      var quadding = this.acroField.getQuadding();
      return quadding === 0 ? TextAlignment.Left : quadding === 1 ? TextAlignment.Center : quadding === 2 ? TextAlignment.Right : TextAlignment.Left;
    };
    PDFTextField2.prototype.setAlignment = function(alignment) {
      assertIsOneOf(alignment, "alignment", TextAlignment);
      this.markAsDirty();
      this.acroField.setQuadding(alignment);
    };
    PDFTextField2.prototype.getMaxLength = function() {
      return this.acroField.getMaxLength();
    };
    PDFTextField2.prototype.setMaxLength = function(maxLength) {
      assertRangeOrUndefined(maxLength, "maxLength", 0, Number.MAX_SAFE_INTEGER);
      this.markAsDirty();
      if (maxLength === void 0) {
        this.acroField.removeMaxLength();
      } else {
        var text = this.getText();
        if (text && text.length > maxLength) {
          throw new InvalidMaxLengthError(text.length, maxLength, this.getName());
        }
        this.acroField.setMaxLength(maxLength);
      }
    };
    PDFTextField2.prototype.removeMaxLength = function() {
      this.markAsDirty();
      this.acroField.removeMaxLength();
    };
    PDFTextField2.prototype.setImage = function(image) {
      var fieldAlignment = this.getAlignment();
      var alignment = fieldAlignment === TextAlignment.Center ? ImageAlignment.Center : fieldAlignment === TextAlignment.Right ? ImageAlignment.Right : ImageAlignment.Left;
      var widgets = this.acroField.getWidgets();
      for (var idx = 0, len = widgets.length; idx < len; idx++) {
        var widget = widgets[idx];
        var streamRef = this.createImageAppearanceStream(widget, image, alignment);
        this.updateWidgetAppearances(widget, { normal: streamRef });
      }
      this.markAsClean();
    };
    PDFTextField2.prototype.setFontSize = function(fontSize) {
      assertPositive(fontSize, "fontSize");
      this.acroField.setFontSize(fontSize);
      this.markAsDirty();
    };
    PDFTextField2.prototype.isMultiline = function() {
      return this.acroField.hasFlag(AcroTextFlags.Multiline);
    };
    PDFTextField2.prototype.enableMultiline = function() {
      this.markAsDirty();
      this.acroField.setFlagTo(AcroTextFlags.Multiline, true);
    };
    PDFTextField2.prototype.disableMultiline = function() {
      this.markAsDirty();
      this.acroField.setFlagTo(AcroTextFlags.Multiline, false);
    };
    PDFTextField2.prototype.isPassword = function() {
      return this.acroField.hasFlag(AcroTextFlags.Password);
    };
    PDFTextField2.prototype.enablePassword = function() {
      this.acroField.setFlagTo(AcroTextFlags.Password, true);
    };
    PDFTextField2.prototype.disablePassword = function() {
      this.acroField.setFlagTo(AcroTextFlags.Password, false);
    };
    PDFTextField2.prototype.isFileSelector = function() {
      return this.acroField.hasFlag(AcroTextFlags.FileSelect);
    };
    PDFTextField2.prototype.enableFileSelection = function() {
      this.acroField.setFlagTo(AcroTextFlags.FileSelect, true);
    };
    PDFTextField2.prototype.disableFileSelection = function() {
      this.acroField.setFlagTo(AcroTextFlags.FileSelect, false);
    };
    PDFTextField2.prototype.isSpellChecked = function() {
      return !this.acroField.hasFlag(AcroTextFlags.DoNotSpellCheck);
    };
    PDFTextField2.prototype.enableSpellChecking = function() {
      this.acroField.setFlagTo(AcroTextFlags.DoNotSpellCheck, false);
    };
    PDFTextField2.prototype.disableSpellChecking = function() {
      this.acroField.setFlagTo(AcroTextFlags.DoNotSpellCheck, true);
    };
    PDFTextField2.prototype.isScrollable = function() {
      return !this.acroField.hasFlag(AcroTextFlags.DoNotScroll);
    };
    PDFTextField2.prototype.enableScrolling = function() {
      this.acroField.setFlagTo(AcroTextFlags.DoNotScroll, false);
    };
    PDFTextField2.prototype.disableScrolling = function() {
      this.acroField.setFlagTo(AcroTextFlags.DoNotScroll, true);
    };
    PDFTextField2.prototype.isCombed = function() {
      return this.acroField.hasFlag(AcroTextFlags.Comb) && !this.isMultiline() && !this.isPassword() && !this.isFileSelector() && this.getMaxLength() !== void 0;
    };
    PDFTextField2.prototype.enableCombing = function() {
      if (this.getMaxLength() === void 0) {
        var msg = "PDFTextFields must have a max length in order to be combed";
        console.warn(msg);
      }
      this.markAsDirty();
      this.disableMultiline();
      this.disablePassword();
      this.disableFileSelection();
      this.acroField.setFlagTo(AcroTextFlags.Comb, true);
    };
    PDFTextField2.prototype.disableCombing = function() {
      this.markAsDirty();
      this.acroField.setFlagTo(AcroTextFlags.Comb, false);
    };
    PDFTextField2.prototype.isRichFormatted = function() {
      return this.acroField.hasFlag(AcroTextFlags.RichText);
    };
    PDFTextField2.prototype.enableRichFormatting = function() {
      this.acroField.setFlagTo(AcroTextFlags.RichText, true);
    };
    PDFTextField2.prototype.disableRichFormatting = function() {
      this.acroField.setFlagTo(AcroTextFlags.RichText, false);
    };
    PDFTextField2.prototype.addToPage = function(page, options) {
      var _a, _b, _c, _d, _e, _f, _g;
      assertIs(page, "page", [[PDFPage, "PDFPage"]]);
      assertFieldAppearanceOptions(options);
      if (!options)
        options = {};
      if (!("textColor" in options))
        options.textColor = rgb(0, 0, 0);
      if (!("backgroundColor" in options))
        options.backgroundColor = rgb(1, 1, 1);
      if (!("borderColor" in options))
        options.borderColor = rgb(0, 0, 0);
      if (!("borderWidth" in options))
        options.borderWidth = 1;
      var widget = this.createWidget({
        x: (_a = options.x) !== null && _a !== void 0 ? _a : 0,
        y: (_b = options.y) !== null && _b !== void 0 ? _b : 0,
        width: (_c = options.width) !== null && _c !== void 0 ? _c : 200,
        height: (_d = options.height) !== null && _d !== void 0 ? _d : 50,
        textColor: options.textColor,
        backgroundColor: options.backgroundColor,
        borderColor: options.borderColor,
        borderWidth: (_e = options.borderWidth) !== null && _e !== void 0 ? _e : 0,
        rotate: (_f = options.rotate) !== null && _f !== void 0 ? _f : degrees(0),
        hidden: options.hidden,
        page: page.ref
      });
      var widgetRef = this.doc.context.register(widget.dict);
      this.acroField.addWidget(widgetRef);
      var font = (_g = options.font) !== null && _g !== void 0 ? _g : this.doc.getForm().getDefaultFont();
      this.updateWidgetAppearance(widget, font);
      page.node.addAnnot(widgetRef);
    };
    PDFTextField2.prototype.needsAppearancesUpdate = function() {
      var _a;
      if (this.isDirty())
        return true;
      var widgets = this.acroField.getWidgets();
      for (var idx = 0, len = widgets.length; idx < len; idx++) {
        var widget = widgets[idx];
        var hasAppearances = ((_a = widget.getAppearances()) === null || _a === void 0 ? void 0 : _a.normal) instanceof PDFStream;
        if (!hasAppearances)
          return true;
      }
      return false;
    };
    PDFTextField2.prototype.defaultUpdateAppearances = function(font) {
      assertIs(font, "font", [[PDFFont, "PDFFont"]]);
      this.updateAppearances(font);
    };
    PDFTextField2.prototype.updateAppearances = function(font, provider) {
      assertIs(font, "font", [[PDFFont, "PDFFont"]]);
      assertOrUndefined(provider, "provider", [Function]);
      var widgets = this.acroField.getWidgets();
      for (var idx = 0, len = widgets.length; idx < len; idx++) {
        var widget = widgets[idx];
        this.updateWidgetAppearance(widget, font, provider);
      }
      this.markAsClean();
    };
    PDFTextField2.prototype.updateWidgetAppearance = function(widget, font, provider) {
      var apProvider = provider !== null && provider !== void 0 ? provider : defaultTextFieldAppearanceProvider;
      var appearances = normalizeAppearance(apProvider(this, widget, font));
      this.updateWidgetAppearanceWithFont(widget, font, appearances);
    };
    PDFTextField2.of = function(acroText, ref, doc) {
      return new PDFTextField2(acroText, ref, doc);
    };
    return PDFTextField2;
  })(PDFField)
);
var StandardFonts;
(function(StandardFonts2) {
  StandardFonts2["Courier"] = "Courier";
  StandardFonts2["CourierBold"] = "Courier-Bold";
  StandardFonts2["CourierOblique"] = "Courier-Oblique";
  StandardFonts2["CourierBoldOblique"] = "Courier-BoldOblique";
  StandardFonts2["Helvetica"] = "Helvetica";
  StandardFonts2["HelveticaBold"] = "Helvetica-Bold";
  StandardFonts2["HelveticaOblique"] = "Helvetica-Oblique";
  StandardFonts2["HelveticaBoldOblique"] = "Helvetica-BoldOblique";
  StandardFonts2["TimesRoman"] = "Times-Roman";
  StandardFonts2["TimesRomanBold"] = "Times-Bold";
  StandardFonts2["TimesRomanItalic"] = "Times-Italic";
  StandardFonts2["TimesRomanBoldItalic"] = "Times-BoldItalic";
  StandardFonts2["Symbol"] = "Symbol";
  StandardFonts2["ZapfDingbats"] = "ZapfDingbats";
})(StandardFonts || (StandardFonts = {}));
var PDFForm = (
  /** @class */
  (function() {
    function PDFForm2(acroForm, doc) {
      var _this = this;
      this.embedDefaultFont = function() {
        return _this.doc.embedStandardFont(StandardFonts.Helvetica);
      };
      assertIs(acroForm, "acroForm", [[PDFAcroForm, "PDFAcroForm"]]);
      assertIs(doc, "doc", [[PDFDocument, "PDFDocument"]]);
      this.acroForm = acroForm;
      this.doc = doc;
      this.dirtyFields = /* @__PURE__ */ new Set();
      this.defaultFontCache = Cache.populatedBy(this.embedDefaultFont);
    }
    PDFForm2.prototype.hasXFA = function() {
      return this.acroForm.dict.has(PDFName.of("XFA"));
    };
    PDFForm2.prototype.deleteXFA = function() {
      this.acroForm.dict.delete(PDFName.of("XFA"));
    };
    PDFForm2.prototype.getFields = function() {
      var allFields = this.acroForm.getAllFields();
      var fields = [];
      for (var idx = 0, len = allFields.length; idx < len; idx++) {
        var _a = allFields[idx], acroField = _a[0], ref = _a[1];
        var field = convertToPDFField(acroField, ref, this.doc);
        if (field)
          fields.push(field);
      }
      return fields;
    };
    PDFForm2.prototype.getFieldMaybe = function(name) {
      assertIs(name, "name", ["string"]);
      var fields = this.getFields();
      for (var idx = 0, len = fields.length; idx < len; idx++) {
        var field = fields[idx];
        if (field.getName() === name)
          return field;
      }
      return void 0;
    };
    PDFForm2.prototype.getField = function(name) {
      assertIs(name, "name", ["string"]);
      var field = this.getFieldMaybe(name);
      if (field)
        return field;
      throw new NoSuchFieldError(name);
    };
    PDFForm2.prototype.getButton = function(name) {
      assertIs(name, "name", ["string"]);
      var field = this.getField(name);
      if (field instanceof PDFButton)
        return field;
      throw new UnexpectedFieldTypeError(name, PDFButton, field);
    };
    PDFForm2.prototype.getCheckBox = function(name) {
      assertIs(name, "name", ["string"]);
      var field = this.getField(name);
      if (field instanceof PDFCheckBox)
        return field;
      throw new UnexpectedFieldTypeError(name, PDFCheckBox, field);
    };
    PDFForm2.prototype.getDropdown = function(name) {
      assertIs(name, "name", ["string"]);
      var field = this.getField(name);
      if (field instanceof PDFDropdown)
        return field;
      throw new UnexpectedFieldTypeError(name, PDFDropdown, field);
    };
    PDFForm2.prototype.getOptionList = function(name) {
      assertIs(name, "name", ["string"]);
      var field = this.getField(name);
      if (field instanceof PDFOptionList)
        return field;
      throw new UnexpectedFieldTypeError(name, PDFOptionList, field);
    };
    PDFForm2.prototype.getRadioGroup = function(name) {
      assertIs(name, "name", ["string"]);
      var field = this.getField(name);
      if (field instanceof PDFRadioGroup)
        return field;
      throw new UnexpectedFieldTypeError(name, PDFRadioGroup, field);
    };
    PDFForm2.prototype.getSignature = function(name) {
      assertIs(name, "name", ["string"]);
      var field = this.getField(name);
      if (field instanceof PDFSignature)
        return field;
      throw new UnexpectedFieldTypeError(name, PDFSignature, field);
    };
    PDFForm2.prototype.getTextField = function(name) {
      assertIs(name, "name", ["string"]);
      var field = this.getField(name);
      if (field instanceof PDFTextField)
        return field;
      throw new UnexpectedFieldTypeError(name, PDFTextField, field);
    };
    PDFForm2.prototype.createButton = function(name) {
      assertIs(name, "name", ["string"]);
      var nameParts = splitFieldName(name);
      var parent = this.findOrCreateNonTerminals(nameParts.nonTerminal);
      var button = PDFAcroPushButton.create(this.doc.context);
      button.setPartialName(nameParts.terminal);
      addFieldToParent(parent, [button, button.ref], nameParts.terminal);
      return PDFButton.of(button, button.ref, this.doc);
    };
    PDFForm2.prototype.createCheckBox = function(name) {
      assertIs(name, "name", ["string"]);
      var nameParts = splitFieldName(name);
      var parent = this.findOrCreateNonTerminals(nameParts.nonTerminal);
      var checkBox = PDFAcroCheckBox.create(this.doc.context);
      checkBox.setPartialName(nameParts.terminal);
      addFieldToParent(parent, [checkBox, checkBox.ref], nameParts.terminal);
      return PDFCheckBox.of(checkBox, checkBox.ref, this.doc);
    };
    PDFForm2.prototype.createDropdown = function(name) {
      assertIs(name, "name", ["string"]);
      var nameParts = splitFieldName(name);
      var parent = this.findOrCreateNonTerminals(nameParts.nonTerminal);
      var comboBox = PDFAcroComboBox.create(this.doc.context);
      comboBox.setPartialName(nameParts.terminal);
      addFieldToParent(parent, [comboBox, comboBox.ref], nameParts.terminal);
      return PDFDropdown.of(comboBox, comboBox.ref, this.doc);
    };
    PDFForm2.prototype.createOptionList = function(name) {
      assertIs(name, "name", ["string"]);
      var nameParts = splitFieldName(name);
      var parent = this.findOrCreateNonTerminals(nameParts.nonTerminal);
      var listBox = PDFAcroListBox.create(this.doc.context);
      listBox.setPartialName(nameParts.terminal);
      addFieldToParent(parent, [listBox, listBox.ref], nameParts.terminal);
      return PDFOptionList.of(listBox, listBox.ref, this.doc);
    };
    PDFForm2.prototype.createRadioGroup = function(name) {
      assertIs(name, "name", ["string"]);
      var nameParts = splitFieldName(name);
      var parent = this.findOrCreateNonTerminals(nameParts.nonTerminal);
      var radioButton = PDFAcroRadioButton.create(this.doc.context);
      radioButton.setPartialName(nameParts.terminal);
      addFieldToParent(parent, [radioButton, radioButton.ref], nameParts.terminal);
      return PDFRadioGroup.of(radioButton, radioButton.ref, this.doc);
    };
    PDFForm2.prototype.createTextField = function(name) {
      assertIs(name, "name", ["string"]);
      var nameParts = splitFieldName(name);
      var parent = this.findOrCreateNonTerminals(nameParts.nonTerminal);
      var text = PDFAcroText.create(this.doc.context);
      text.setPartialName(nameParts.terminal);
      addFieldToParent(parent, [text, text.ref], nameParts.terminal);
      return PDFTextField.of(text, text.ref, this.doc);
    };
    PDFForm2.prototype.flatten = function(options) {
      if (options === void 0) {
        options = { updateFieldAppearances: true };
      }
      if (options.updateFieldAppearances) {
        this.updateFieldAppearances();
      }
      var fields = this.getFields();
      for (var i = 0, lenFields = fields.length; i < lenFields; i++) {
        var field = fields[i];
        var widgets = field.acroField.getWidgets();
        for (var j = 0, lenWidgets = widgets.length; j < lenWidgets; j++) {
          var widget = widgets[j];
          var page = this.findWidgetPage(widget);
          var widgetRef = this.findWidgetAppearanceRef(field, widget);
          var xObjectKey = page.node.newXObject("FlatWidget", widgetRef);
          var rectangle = widget.getRectangle();
          var operators = __spreadArrays([
            pushGraphicsState(),
            translate(rectangle.x, rectangle.y)
          ], rotateInPlace(__assign(__assign({}, rectangle), { rotation: 0 })), [
            drawObject(xObjectKey),
            popGraphicsState()
          ]).filter(Boolean);
          page.pushOperators.apply(page, operators);
        }
        this.removeField(field);
      }
    };
    PDFForm2.prototype.removeField = function(field) {
      var widgets = field.acroField.getWidgets();
      var pages = /* @__PURE__ */ new Set();
      for (var i = 0, len = widgets.length; i < len; i++) {
        var widget = widgets[i];
        var widgetRef = this.findWidgetAppearanceRef(field, widget);
        var page = this.findWidgetPage(widget);
        pages.add(page);
        page.node.removeAnnot(widgetRef);
      }
      pages.forEach(function(page2) {
        return page2.node.removeAnnot(field.ref);
      });
      this.acroForm.removeField(field.acroField);
      var fieldKids = field.acroField.normalizedEntries().Kids;
      var kidsCount = fieldKids.size();
      for (var childIndex = 0; childIndex < kidsCount; childIndex++) {
        var child = fieldKids.get(childIndex);
        if (child instanceof PDFRef) {
          this.doc.context.delete(child);
        }
      }
      this.doc.context.delete(field.ref);
    };
    PDFForm2.prototype.updateFieldAppearances = function(font) {
      assertOrUndefined(font, "font", [[PDFFont, "PDFFont"]]);
      font = font !== null && font !== void 0 ? font : this.getDefaultFont();
      var fields = this.getFields();
      for (var idx = 0, len = fields.length; idx < len; idx++) {
        var field = fields[idx];
        if (field.needsAppearancesUpdate()) {
          field.defaultUpdateAppearances(font);
        }
      }
    };
    PDFForm2.prototype.markFieldAsDirty = function(fieldRef) {
      assertOrUndefined(fieldRef, "fieldRef", [[PDFRef, "PDFRef"]]);
      this.dirtyFields.add(fieldRef);
    };
    PDFForm2.prototype.markFieldAsClean = function(fieldRef) {
      assertOrUndefined(fieldRef, "fieldRef", [[PDFRef, "PDFRef"]]);
      this.dirtyFields.delete(fieldRef);
    };
    PDFForm2.prototype.fieldIsDirty = function(fieldRef) {
      assertOrUndefined(fieldRef, "fieldRef", [[PDFRef, "PDFRef"]]);
      return this.dirtyFields.has(fieldRef);
    };
    PDFForm2.prototype.getDefaultFont = function() {
      return this.defaultFontCache.access();
    };
    PDFForm2.prototype.findWidgetPage = function(widget) {
      var pageRef = widget.P();
      var page = this.doc.getPages().find(function(x) {
        return x.ref === pageRef;
      });
      if (page === void 0) {
        var widgetRef = this.doc.context.getObjectRef(widget.dict);
        if (widgetRef === void 0) {
          throw new Error("Could not find PDFRef for PDFObject");
        }
        page = this.doc.findPageForAnnotationRef(widgetRef);
        if (page === void 0) {
          throw new Error("Could not find page for PDFRef " + widgetRef);
        }
      }
      return page;
    };
    PDFForm2.prototype.findWidgetAppearanceRef = function(field, widget) {
      var _a;
      var refOrDict = widget.getNormalAppearance();
      if (refOrDict instanceof PDFDict && (field instanceof PDFCheckBox || field instanceof PDFRadioGroup)) {
        var value = field.acroField.getValue();
        var ref = (_a = refOrDict.get(value)) !== null && _a !== void 0 ? _a : refOrDict.get(PDFName.of("Off"));
        if (ref instanceof PDFRef) {
          refOrDict = ref;
        }
      }
      if (!(refOrDict instanceof PDFRef)) {
        var name_1 = field.getName();
        throw new Error("Failed to extract appearance ref for: " + name_1);
      }
      return refOrDict;
    };
    PDFForm2.prototype.findOrCreateNonTerminals = function(partialNames) {
      var nonTerminal = [
        this.acroForm
      ];
      for (var idx = 0, len = partialNames.length; idx < len; idx++) {
        var namePart = partialNames[idx];
        if (!namePart)
          throw new InvalidFieldNamePartError(namePart);
        var parent_1 = nonTerminal[0], parentRef = nonTerminal[1];
        var res = this.findNonTerminal(namePart, parent_1);
        if (res) {
          nonTerminal = res;
        } else {
          var node = PDFAcroNonTerminal.create(this.doc.context);
          node.setPartialName(namePart);
          node.setParent(parentRef);
          var nodeRef = this.doc.context.register(node.dict);
          parent_1.addField(nodeRef);
          nonTerminal = [node, nodeRef];
        }
      }
      return nonTerminal;
    };
    PDFForm2.prototype.findNonTerminal = function(partialName, parent) {
      var fields = parent instanceof PDFAcroForm ? this.acroForm.getFields() : createPDFAcroFields(parent.Kids());
      for (var idx = 0, len = fields.length; idx < len; idx++) {
        var _a = fields[idx], field = _a[0], ref = _a[1];
        if (field.getPartialName() === partialName) {
          if (field instanceof PDFAcroNonTerminal)
            return [field, ref];
          throw new FieldAlreadyExistsError(partialName);
        }
      }
      return void 0;
    };
    PDFForm2.of = function(acroForm, doc) {
      return new PDFForm2(acroForm, doc);
    };
    return PDFForm2;
  })()
);
var convertToPDFField = function(field, ref, doc) {
  if (field instanceof PDFAcroPushButton)
    return PDFButton.of(field, ref, doc);
  if (field instanceof PDFAcroCheckBox)
    return PDFCheckBox.of(field, ref, doc);
  if (field instanceof PDFAcroComboBox)
    return PDFDropdown.of(field, ref, doc);
  if (field instanceof PDFAcroListBox)
    return PDFOptionList.of(field, ref, doc);
  if (field instanceof PDFAcroText)
    return PDFTextField.of(field, ref, doc);
  if (field instanceof PDFAcroRadioButton) {
    return PDFRadioGroup.of(field, ref, doc);
  }
  if (field instanceof PDFAcroSignature) {
    return PDFSignature.of(field, ref, doc);
  }
  return void 0;
};
var splitFieldName = function(fullyQualifiedName) {
  if (fullyQualifiedName.length === 0) {
    throw new Error("PDF field names must not be empty strings");
  }
  var parts = fullyQualifiedName.split(".");
  for (var idx = 0, len = parts.length; idx < len; idx++) {
    if (parts[idx] === "") {
      throw new Error('Periods in PDF field names must be separated by at least one character: "' + fullyQualifiedName + '"');
    }
  }
  if (parts.length === 1)
    return { nonTerminal: [], terminal: parts[0] };
  return {
    nonTerminal: parts.slice(0, parts.length - 1),
    terminal: parts[parts.length - 1]
  };
};
var addFieldToParent = function(_a, _b, partialName) {
  var parent = _a[0], parentRef = _a[1];
  var field = _b[0], fieldRef = _b[1];
  var entries = parent.normalizedEntries();
  var fields = createPDFAcroFields("Kids" in entries ? entries.Kids : entries.Fields);
  for (var idx = 0, len = fields.length; idx < len; idx++) {
    if (fields[idx][0].getPartialName() === partialName) {
      throw new FieldAlreadyExistsError(partialName);
    }
  }
  parent.addField(fieldRef);
  field.setParent(parentRef);
};
var PageSizes = {
  A4: [595.28, 841.89]
};
var ParseSpeeds;
(function(ParseSpeeds2) {
  ParseSpeeds2[ParseSpeeds2["Fastest"] = Infinity] = "Fastest";
  ParseSpeeds2[ParseSpeeds2["Fast"] = 1500] = "Fast";
  ParseSpeeds2[ParseSpeeds2["Medium"] = 500] = "Medium";
  ParseSpeeds2[ParseSpeeds2["Slow"] = 100] = "Slow";
})(ParseSpeeds || (ParseSpeeds = {}));
var PDFEmbeddedFile = (
  /** @class */
  (function() {
    function PDFEmbeddedFile2(ref, doc, embedder) {
      this.alreadyEmbedded = false;
      this.ref = ref;
      this.doc = doc;
      this.embedder = embedder;
    }
    PDFEmbeddedFile2.prototype.embed = function() {
      return __awaiter(this, void 0, void 0, function() {
        var ref, Names, EmbeddedFiles, EFNames, AF;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              if (!!this.alreadyEmbedded) return [3, 2];
              return [4, this.embedder.embedIntoContext(this.doc.context, this.ref)];
            case 1:
              ref = _a.sent();
              if (!this.doc.catalog.has(PDFName.of("Names"))) {
                this.doc.catalog.set(PDFName.of("Names"), this.doc.context.obj({}));
              }
              Names = this.doc.catalog.lookup(PDFName.of("Names"), PDFDict);
              if (!Names.has(PDFName.of("EmbeddedFiles"))) {
                Names.set(PDFName.of("EmbeddedFiles"), this.doc.context.obj({}));
              }
              EmbeddedFiles = Names.lookup(PDFName.of("EmbeddedFiles"), PDFDict);
              if (!EmbeddedFiles.has(PDFName.of("Names"))) {
                EmbeddedFiles.set(PDFName.of("Names"), this.doc.context.obj([]));
              }
              EFNames = EmbeddedFiles.lookup(PDFName.of("Names"), PDFArray);
              EFNames.push(PDFHexString.fromText(this.embedder.fileName));
              EFNames.push(ref);
              if (!this.doc.catalog.has(PDFName.of("AF"))) {
                this.doc.catalog.set(PDFName.of("AF"), this.doc.context.obj([]));
              }
              AF = this.doc.catalog.lookup(PDFName.of("AF"), PDFArray);
              AF.push(ref);
              this.alreadyEmbedded = true;
              _a.label = 2;
            case 2:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
    PDFEmbeddedFile2.of = function(ref, doc, embedder) {
      return new PDFEmbeddedFile2(ref, doc, embedder);
    };
    return PDFEmbeddedFile2;
  })()
);
var PDFJavaScript = (
  /** @class */
  (function() {
    function PDFJavaScript2(ref, doc, embedder) {
      this.alreadyEmbedded = false;
      this.ref = ref;
      this.doc = doc;
      this.embedder = embedder;
    }
    PDFJavaScript2.prototype.embed = function() {
      return __awaiter(this, void 0, void 0, function() {
        var _a, catalog, context, ref, Names, Javascript, JSNames;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              if (!!this.alreadyEmbedded) return [3, 2];
              _a = this.doc, catalog = _a.catalog, context = _a.context;
              return [4, this.embedder.embedIntoContext(this.doc.context, this.ref)];
            case 1:
              ref = _b.sent();
              if (!catalog.has(PDFName.of("Names"))) {
                catalog.set(PDFName.of("Names"), context.obj({}));
              }
              Names = catalog.lookup(PDFName.of("Names"), PDFDict);
              if (!Names.has(PDFName.of("JavaScript"))) {
                Names.set(PDFName.of("JavaScript"), context.obj({}));
              }
              Javascript = Names.lookup(PDFName.of("JavaScript"), PDFDict);
              if (!Javascript.has(PDFName.of("Names"))) {
                Javascript.set(PDFName.of("Names"), context.obj([]));
              }
              JSNames = Javascript.lookup(PDFName.of("Names"), PDFArray);
              JSNames.push(PDFHexString.fromText(this.embedder.scriptName));
              JSNames.push(ref);
              this.alreadyEmbedded = true;
              _b.label = 2;
            case 2:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
    PDFJavaScript2.of = function(ref, doc, embedder) {
      return new PDFJavaScript2(ref, doc, embedder);
    };
    return PDFJavaScript2;
  })()
);
var JavaScriptEmbedder = (
  /** @class */
  (function() {
    function JavaScriptEmbedder2(script, scriptName) {
      this.script = script;
      this.scriptName = scriptName;
    }
    JavaScriptEmbedder2.for = function(script, scriptName) {
      return new JavaScriptEmbedder2(script, scriptName);
    };
    JavaScriptEmbedder2.prototype.embedIntoContext = function(context, ref) {
      return __awaiter(this, void 0, void 0, function() {
        var jsActionDict;
        return __generator(this, function(_a) {
          jsActionDict = context.obj({
            Type: "Action",
            S: "JavaScript",
            JS: PDFHexString.fromText(this.script)
          });
          if (ref) {
            context.assign(ref, jsActionDict);
            return [2, ref];
          } else {
            return [2, context.register(jsActionDict)];
          }
        });
      });
    };
    return JavaScriptEmbedder2;
  })()
);
var PDFDocument = (
  /** @class */
  (function() {
    function PDFDocument2(context, ignoreEncryption, updateMetadata) {
      var _this = this;
      this.defaultWordBreaks = [" "];
      this.computePages = function() {
        var pages = [];
        _this.catalog.Pages().traverse(function(node, ref) {
          if (node instanceof PDFPageLeaf) {
            var page = _this.pageMap.get(node);
            if (!page) {
              page = PDFPage.of(node, ref, _this);
              _this.pageMap.set(node, page);
            }
            pages.push(page);
          }
        });
        return pages;
      };
      this.getOrCreateForm = function() {
        var acroForm = _this.catalog.getOrCreateAcroForm();
        return PDFForm.of(acroForm, _this);
      };
      assertIs(context, "context", [[PDFContext, "PDFContext"]]);
      assertIs(ignoreEncryption, "ignoreEncryption", ["boolean"]);
      this.context = context;
      this.catalog = context.lookup(context.trailerInfo.Root);
      this.isEncrypted = !!context.lookup(context.trailerInfo.Encrypt);
      this.pageCache = Cache.populatedBy(this.computePages);
      this.pageMap = /* @__PURE__ */ new Map();
      this.formCache = Cache.populatedBy(this.getOrCreateForm);
      this.fonts = [];
      this.images = [];
      this.embeddedPages = [];
      this.embeddedFiles = [];
      this.javaScripts = [];
      if (!ignoreEncryption && this.isEncrypted)
        throw new EncryptedPDFError();
      if (updateMetadata)
        this.updateInfoDict();
    }
    PDFDocument2.load = function(pdf, options) {
      if (options === void 0) {
        options = {};
      }
      return __awaiter(this, void 0, void 0, function() {
        var _a, ignoreEncryption, _b, parseSpeed, _c, throwOnInvalidObject, _d, updateMetadata, _e, capNumbers, bytes, context;
        return __generator(this, function(_f) {
          switch (_f.label) {
            case 0:
              _a = options.ignoreEncryption, ignoreEncryption = _a === void 0 ? false : _a, _b = options.parseSpeed, parseSpeed = _b === void 0 ? ParseSpeeds.Slow : _b, _c = options.throwOnInvalidObject, throwOnInvalidObject = _c === void 0 ? false : _c, _d = options.updateMetadata, updateMetadata = _d === void 0 ? true : _d, _e = options.capNumbers, capNumbers = _e === void 0 ? false : _e;
              assertIs(pdf, "pdf", ["string", Uint8Array, ArrayBuffer]);
              assertIs(ignoreEncryption, "ignoreEncryption", ["boolean"]);
              assertIs(parseSpeed, "parseSpeed", ["number"]);
              assertIs(throwOnInvalidObject, "throwOnInvalidObject", ["boolean"]);
              bytes = toUint8Array(pdf);
              return [4, PDFParser.forBytesWithOptions(bytes, parseSpeed, throwOnInvalidObject, capNumbers).parseDocument()];
            case 1:
              context = _f.sent();
              return [2, new PDFDocument2(context, ignoreEncryption, updateMetadata)];
          }
        });
      });
    };
    PDFDocument2.create = function(options) {
      if (options === void 0) {
        options = {};
      }
      return __awaiter(this, void 0, void 0, function() {
        var _a, updateMetadata, context, pageTree, pageTreeRef, catalog;
        return __generator(this, function(_b) {
          _a = options.updateMetadata, updateMetadata = _a === void 0 ? true : _a;
          context = PDFContext.create();
          pageTree = PDFPageTree.withContext(context);
          pageTreeRef = context.register(pageTree);
          catalog = PDFCatalog.withContextAndPages(context, pageTreeRef);
          context.trailerInfo.Root = context.register(catalog);
          return [2, new PDFDocument2(context, false, updateMetadata)];
        });
      });
    };
    PDFDocument2.prototype.registerFontkit = function(fontkit) {
      this.fontkit = fontkit;
    };
    PDFDocument2.prototype.getForm = function() {
      var form = this.formCache.access();
      if (form.hasXFA()) {
        console.warn("Removing XFA form data as pdf-lib does not support reading or writing XFA");
        form.deleteXFA();
      }
      return form;
    };
    PDFDocument2.prototype.getTitle = function() {
      var title = this.getInfoDict().lookup(PDFName.Title);
      if (!title)
        return void 0;
      assertIsLiteralOrHexString(title);
      return title.decodeText();
    };
    PDFDocument2.prototype.getAuthor = function() {
      var author = this.getInfoDict().lookup(PDFName.Author);
      if (!author)
        return void 0;
      assertIsLiteralOrHexString(author);
      return author.decodeText();
    };
    PDFDocument2.prototype.getSubject = function() {
      var subject = this.getInfoDict().lookup(PDFName.Subject);
      if (!subject)
        return void 0;
      assertIsLiteralOrHexString(subject);
      return subject.decodeText();
    };
    PDFDocument2.prototype.getKeywords = function() {
      var keywords = this.getInfoDict().lookup(PDFName.Keywords);
      if (!keywords)
        return void 0;
      assertIsLiteralOrHexString(keywords);
      return keywords.decodeText();
    };
    PDFDocument2.prototype.getCreator = function() {
      var creator = this.getInfoDict().lookup(PDFName.Creator);
      if (!creator)
        return void 0;
      assertIsLiteralOrHexString(creator);
      return creator.decodeText();
    };
    PDFDocument2.prototype.getProducer = function() {
      var producer = this.getInfoDict().lookup(PDFName.Producer);
      if (!producer)
        return void 0;
      assertIsLiteralOrHexString(producer);
      return producer.decodeText();
    };
    PDFDocument2.prototype.getCreationDate = function() {
      var creationDate = this.getInfoDict().lookup(PDFName.CreationDate);
      if (!creationDate)
        return void 0;
      assertIsLiteralOrHexString(creationDate);
      return creationDate.decodeDate();
    };
    PDFDocument2.prototype.getModificationDate = function() {
      var modificationDate = this.getInfoDict().lookup(PDFName.ModDate);
      if (!modificationDate)
        return void 0;
      assertIsLiteralOrHexString(modificationDate);
      return modificationDate.decodeDate();
    };
    PDFDocument2.prototype.setTitle = function(title, options) {
      assertIs(title, "title", ["string"]);
      var key = PDFName.of("Title");
      this.getInfoDict().set(key, PDFHexString.fromText(title));
      if (options === null || options === void 0 ? void 0 : options.showInWindowTitleBar) {
        var prefs = this.catalog.getOrCreateViewerPreferences();
        prefs.setDisplayDocTitle(true);
      }
    };
    PDFDocument2.prototype.setAuthor = function(author) {
      assertIs(author, "author", ["string"]);
      var key = PDFName.of("Author");
      this.getInfoDict().set(key, PDFHexString.fromText(author));
    };
    PDFDocument2.prototype.setSubject = function(subject) {
      assertIs(subject, "author", ["string"]);
      var key = PDFName.of("Subject");
      this.getInfoDict().set(key, PDFHexString.fromText(subject));
    };
    PDFDocument2.prototype.setKeywords = function(keywords) {
      assertIs(keywords, "keywords", [Array]);
      var key = PDFName.of("Keywords");
      this.getInfoDict().set(key, PDFHexString.fromText(keywords.join(" ")));
    };
    PDFDocument2.prototype.setCreator = function(creator) {
      assertIs(creator, "creator", ["string"]);
      var key = PDFName.of("Creator");
      this.getInfoDict().set(key, PDFHexString.fromText(creator));
    };
    PDFDocument2.prototype.setProducer = function(producer) {
      assertIs(producer, "creator", ["string"]);
      var key = PDFName.of("Producer");
      this.getInfoDict().set(key, PDFHexString.fromText(producer));
    };
    PDFDocument2.prototype.setLanguage = function(language) {
      assertIs(language, "language", ["string"]);
      var key = PDFName.of("Lang");
      this.catalog.set(key, PDFString.of(language));
    };
    PDFDocument2.prototype.setCreationDate = function(creationDate) {
      assertIs(creationDate, "creationDate", [[Date, "Date"]]);
      var key = PDFName.of("CreationDate");
      this.getInfoDict().set(key, PDFString.fromDate(creationDate));
    };
    PDFDocument2.prototype.setModificationDate = function(modificationDate) {
      assertIs(modificationDate, "modificationDate", [[Date, "Date"]]);
      var key = PDFName.of("ModDate");
      this.getInfoDict().set(key, PDFString.fromDate(modificationDate));
    };
    PDFDocument2.prototype.getPageCount = function() {
      if (this.pageCount === void 0)
        this.pageCount = this.getPages().length;
      return this.pageCount;
    };
    PDFDocument2.prototype.getPages = function() {
      return this.pageCache.access();
    };
    PDFDocument2.prototype.getPage = function(index) {
      var pages = this.getPages();
      assertRange(index, "index", 0, pages.length - 1);
      return pages[index];
    };
    PDFDocument2.prototype.getPageIndices = function() {
      return range(0, this.getPageCount());
    };
    PDFDocument2.prototype.removePage = function(index) {
      var pageCount = this.getPageCount();
      if (this.pageCount === 0)
        throw new RemovePageFromEmptyDocumentError();
      assertRange(index, "index", 0, pageCount - 1);
      this.catalog.removeLeafNode(index);
      this.pageCount = pageCount - 1;
    };
    PDFDocument2.prototype.addPage = function(page) {
      assertIs(page, "page", ["undefined", [PDFPage, "PDFPage"], Array]);
      return this.insertPage(this.getPageCount(), page);
    };
    PDFDocument2.prototype.insertPage = function(index, page) {
      var pageCount = this.getPageCount();
      assertRange(index, "index", 0, pageCount);
      assertIs(page, "page", ["undefined", [PDFPage, "PDFPage"], Array]);
      if (!page || Array.isArray(page)) {
        var dims = Array.isArray(page) ? page : PageSizes.A4;
        page = PDFPage.create(this);
        page.setSize.apply(page, dims);
      } else if (page.doc !== this) {
        throw new ForeignPageError();
      }
      var parentRef = this.catalog.insertLeafNode(page.ref, index);
      page.node.setParent(parentRef);
      this.pageMap.set(page.node, page);
      this.pageCache.invalidate();
      this.pageCount = pageCount + 1;
      return page;
    };
    PDFDocument2.prototype.copyPages = function(srcDoc, indices) {
      return __awaiter(this, void 0, void 0, function() {
        var copier, srcPages, copiedPages, idx, len, srcPage, copiedPage, ref;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              assertIs(srcDoc, "srcDoc", [[PDFDocument2, "PDFDocument"]]);
              assertIs(indices, "indices", [Array]);
              return [4, srcDoc.flush()];
            case 1:
              _a.sent();
              copier = PDFObjectCopier.for(srcDoc.context, this.context);
              srcPages = srcDoc.getPages();
              copiedPages = new Array(indices.length);
              for (idx = 0, len = indices.length; idx < len; idx++) {
                srcPage = srcPages[indices[idx]];
                copiedPage = copier.copy(srcPage.node);
                ref = this.context.register(copiedPage);
                copiedPages[idx] = PDFPage.of(copiedPage, ref, this);
              }
              return [2, copiedPages];
          }
        });
      });
    };
    PDFDocument2.prototype.copy = function() {
      return __awaiter(this, void 0, void 0, function() {
        var pdfCopy, contentPages, idx, len;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, PDFDocument2.create()];
            case 1:
              pdfCopy = _a.sent();
              return [4, pdfCopy.copyPages(this, this.getPageIndices())];
            case 2:
              contentPages = _a.sent();
              for (idx = 0, len = contentPages.length; idx < len; idx++) {
                pdfCopy.addPage(contentPages[idx]);
              }
              if (this.getAuthor() !== void 0) {
                pdfCopy.setAuthor(this.getAuthor());
              }
              if (this.getCreationDate() !== void 0) {
                pdfCopy.setCreationDate(this.getCreationDate());
              }
              if (this.getCreator() !== void 0) {
                pdfCopy.setCreator(this.getCreator());
              }
              if (this.getModificationDate() !== void 0) {
                pdfCopy.setModificationDate(this.getModificationDate());
              }
              if (this.getProducer() !== void 0) {
                pdfCopy.setProducer(this.getProducer());
              }
              if (this.getSubject() !== void 0) {
                pdfCopy.setSubject(this.getSubject());
              }
              if (this.getTitle() !== void 0) {
                pdfCopy.setTitle(this.getTitle());
              }
              pdfCopy.defaultWordBreaks = this.defaultWordBreaks;
              return [2, pdfCopy];
          }
        });
      });
    };
    PDFDocument2.prototype.addJavaScript = function(name, script) {
      assertIs(name, "name", ["string"]);
      assertIs(script, "script", ["string"]);
      var embedder = JavaScriptEmbedder.for(script, name);
      var ref = this.context.nextRef();
      var javaScript = PDFJavaScript.of(ref, this, embedder);
      this.javaScripts.push(javaScript);
    };
    PDFDocument2.prototype.attach = function(attachment, name, options) {
      if (options === void 0) {
        options = {};
      }
      return __awaiter(this, void 0, void 0, function() {
        var bytes, embedder, ref, embeddedFile;
        return __generator(this, function(_a) {
          assertIs(attachment, "attachment", ["string", Uint8Array, ArrayBuffer]);
          assertIs(name, "name", ["string"]);
          assertOrUndefined(options.mimeType, "mimeType", ["string"]);
          assertOrUndefined(options.description, "description", ["string"]);
          assertOrUndefined(options.creationDate, "options.creationDate", [Date]);
          assertOrUndefined(options.modificationDate, "options.modificationDate", [
            Date
          ]);
          assertIsOneOfOrUndefined(options.afRelationship, "options.afRelationship", AFRelationship);
          bytes = toUint8Array(attachment);
          embedder = FileEmbedder.for(bytes, name, options);
          ref = this.context.nextRef();
          embeddedFile = PDFEmbeddedFile.of(ref, this, embedder);
          this.embeddedFiles.push(embeddedFile);
          return [
            2
            /*return*/
          ];
        });
      });
    };
    PDFDocument2.prototype.embedFont = function(font, options) {
      if (options === void 0) {
        options = {};
      }
      return __awaiter(this, void 0, void 0, function() {
        var _a, subset, customName, features, embedder, bytes, fontkit, _b, ref, pdfFont;
        return __generator(this, function(_c) {
          switch (_c.label) {
            case 0:
              _a = options.subset, subset = _a === void 0 ? false : _a, customName = options.customName, features = options.features;
              assertIs(font, "font", ["string", Uint8Array, ArrayBuffer]);
              assertIs(subset, "subset", ["boolean"]);
              if (!isStandardFont(font)) return [3, 1];
              embedder = StandardFontEmbedder.for(font, customName);
              return [3, 7];
            case 1:
              if (!canBeConvertedToUint8Array(font)) return [3, 6];
              bytes = toUint8Array(font);
              fontkit = this.assertFontkit();
              if (!subset) return [3, 3];
              return [4, CustomFontSubsetEmbedder.for(fontkit, bytes, customName, features)];
            case 2:
              _b = _c.sent();
              return [3, 5];
            case 3:
              return [4, CustomFontEmbedder.for(fontkit, bytes, customName, features)];
            case 4:
              _b = _c.sent();
              _c.label = 5;
            case 5:
              embedder = _b;
              return [3, 7];
            case 6:
              throw new TypeError("`font` must be one of `StandardFonts | string | Uint8Array | ArrayBuffer`");
            case 7:
              ref = this.context.nextRef();
              pdfFont = PDFFont.of(ref, this, embedder);
              this.fonts.push(pdfFont);
              return [2, pdfFont];
          }
        });
      });
    };
    PDFDocument2.prototype.embedStandardFont = function(font, customName) {
      assertIs(font, "font", ["string"]);
      if (!isStandardFont(font)) {
        throw new TypeError("`font` must be one of type `StandardFonts`");
      }
      var embedder = StandardFontEmbedder.for(font, customName);
      var ref = this.context.nextRef();
      var pdfFont = PDFFont.of(ref, this, embedder);
      this.fonts.push(pdfFont);
      return pdfFont;
    };
    PDFDocument2.prototype.embedJpg = function(jpg) {
      return __awaiter(this, void 0, void 0, function() {
        var bytes, embedder, ref, pdfImage;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              assertIs(jpg, "jpg", ["string", Uint8Array, ArrayBuffer]);
              bytes = toUint8Array(jpg);
              return [4, JpegEmbedder.for(bytes)];
            case 1:
              embedder = _a.sent();
              ref = this.context.nextRef();
              pdfImage = PDFImage.of(ref, this, embedder);
              this.images.push(pdfImage);
              return [2, pdfImage];
          }
        });
      });
    };
    PDFDocument2.prototype.embedPng = function(png) {
      return __awaiter(this, void 0, void 0, function() {
        var bytes, embedder, ref, pdfImage;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              assertIs(png, "png", ["string", Uint8Array, ArrayBuffer]);
              bytes = toUint8Array(png);
              return [4, PngEmbedder.for(bytes)];
            case 1:
              embedder = _a.sent();
              ref = this.context.nextRef();
              pdfImage = PDFImage.of(ref, this, embedder);
              this.images.push(pdfImage);
              return [2, pdfImage];
          }
        });
      });
    };
    PDFDocument2.prototype.embedPdf = function(pdf, indices) {
      if (indices === void 0) {
        indices = [0];
      }
      return __awaiter(this, void 0, void 0, function() {
        var srcDoc, _a, srcPages;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              assertIs(pdf, "pdf", [
                "string",
                Uint8Array,
                ArrayBuffer,
                [PDFDocument2, "PDFDocument"]
              ]);
              assertIs(indices, "indices", [Array]);
              if (!(pdf instanceof PDFDocument2)) return [3, 1];
              _a = pdf;
              return [3, 3];
            case 1:
              return [4, PDFDocument2.load(pdf)];
            case 2:
              _a = _b.sent();
              _b.label = 3;
            case 3:
              srcDoc = _a;
              srcPages = pluckIndices(srcDoc.getPages(), indices);
              return [2, this.embedPages(srcPages)];
          }
        });
      });
    };
    PDFDocument2.prototype.embedPage = function(page, boundingBox, transformationMatrix) {
      return __awaiter(this, void 0, void 0, function() {
        var embeddedPage;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              assertIs(page, "page", [[PDFPage, "PDFPage"]]);
              return [4, this.embedPages([page], [boundingBox], [transformationMatrix])];
            case 1:
              embeddedPage = _a.sent()[0];
              return [2, embeddedPage];
          }
        });
      });
    };
    PDFDocument2.prototype.embedPages = function(pages, boundingBoxes, transformationMatrices) {
      if (boundingBoxes === void 0) {
        boundingBoxes = [];
      }
      if (transformationMatrices === void 0) {
        transformationMatrices = [];
      }
      return __awaiter(this, void 0, void 0, function() {
        var idx, len, currPage, nextPage, context, maybeCopyPage, embeddedPages, idx, len, page, box, matrix, embedder, ref;
        var _a;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              if (pages.length === 0)
                return [2, []];
              for (idx = 0, len = pages.length - 1; idx < len; idx++) {
                currPage = pages[idx];
                nextPage = pages[idx + 1];
                if (currPage.node.context !== nextPage.node.context) {
                  throw new PageEmbeddingMismatchedContextError();
                }
              }
              context = pages[0].node.context;
              maybeCopyPage = context === this.context ? function(p) {
                return p;
              } : PDFObjectCopier.for(context, this.context).copy;
              embeddedPages = new Array(pages.length);
              idx = 0, len = pages.length;
              _b.label = 1;
            case 1:
              if (!(idx < len)) return [3, 4];
              page = maybeCopyPage(pages[idx].node);
              box = boundingBoxes[idx];
              matrix = transformationMatrices[idx];
              return [4, PDFPageEmbedder.for(page, box, matrix)];
            case 2:
              embedder = _b.sent();
              ref = this.context.nextRef();
              embeddedPages[idx] = PDFEmbeddedPage.of(ref, this, embedder);
              _b.label = 3;
            case 3:
              idx++;
              return [3, 1];
            case 4:
              (_a = this.embeddedPages).push.apply(_a, embeddedPages);
              return [2, embeddedPages];
          }
        });
      });
    };
    PDFDocument2.prototype.flush = function() {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, this.embedAll(this.fonts)];
            case 1:
              _a.sent();
              return [4, this.embedAll(this.images)];
            case 2:
              _a.sent();
              return [4, this.embedAll(this.embeddedPages)];
            case 3:
              _a.sent();
              return [4, this.embedAll(this.embeddedFiles)];
            case 4:
              _a.sent();
              return [4, this.embedAll(this.javaScripts)];
            case 5:
              _a.sent();
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
    PDFDocument2.prototype.save = function(options) {
      if (options === void 0) {
        options = {};
      }
      return __awaiter(this, void 0, void 0, function() {
        var _a, useObjectStreams, _b, addDefaultPage, _c, objectsPerTick, _d, updateFieldAppearances, form, Writer;
        return __generator(this, function(_e) {
          switch (_e.label) {
            case 0:
              _a = options.useObjectStreams, useObjectStreams = _a === void 0 ? true : _a, _b = options.addDefaultPage, addDefaultPage = _b === void 0 ? true : _b, _c = options.objectsPerTick, objectsPerTick = _c === void 0 ? 50 : _c, _d = options.updateFieldAppearances, updateFieldAppearances = _d === void 0 ? true : _d;
              assertIs(useObjectStreams, "useObjectStreams", ["boolean"]);
              assertIs(addDefaultPage, "addDefaultPage", ["boolean"]);
              assertIs(objectsPerTick, "objectsPerTick", ["number"]);
              assertIs(updateFieldAppearances, "updateFieldAppearances", ["boolean"]);
              if (addDefaultPage && this.getPageCount() === 0)
                this.addPage();
              if (updateFieldAppearances) {
                form = this.formCache.getValue();
                if (form)
                  form.updateFieldAppearances();
              }
              return [4, this.flush()];
            case 1:
              _e.sent();
              Writer = useObjectStreams ? PDFStreamWriter : PDFWriter;
              return [2, Writer.forContext(this.context, objectsPerTick).serializeToBuffer()];
          }
        });
      });
    };
    PDFDocument2.prototype.saveAsBase64 = function(options) {
      if (options === void 0) {
        options = {};
      }
      return __awaiter(this, void 0, void 0, function() {
        var _a, dataUri, otherOptions, bytes, base64;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              _a = options.dataUri, dataUri = _a === void 0 ? false : _a, otherOptions = __rest(options, ["dataUri"]);
              assertIs(dataUri, "dataUri", ["boolean"]);
              return [4, this.save(otherOptions)];
            case 1:
              bytes = _b.sent();
              base64 = encodeToBase64(bytes);
              return [2, dataUri ? "data:application/pdf;base64," + base64 : base64];
          }
        });
      });
    };
    PDFDocument2.prototype.findPageForAnnotationRef = function(ref) {
      var pages = this.getPages();
      for (var idx = 0, len = pages.length; idx < len; idx++) {
        var page = pages[idx];
        var annotations = page.node.Annots();
        if ((annotations === null || annotations === void 0 ? void 0 : annotations.indexOf(ref)) !== void 0) {
          return page;
        }
      }
      return void 0;
    };
    PDFDocument2.prototype.embedAll = function(embeddables) {
      return __awaiter(this, void 0, void 0, function() {
        var idx, len;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              idx = 0, len = embeddables.length;
              _a.label = 1;
            case 1:
              if (!(idx < len)) return [3, 4];
              return [4, embeddables[idx].embed()];
            case 2:
              _a.sent();
              _a.label = 3;
            case 3:
              idx++;
              return [3, 1];
            case 4:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
    PDFDocument2.prototype.updateInfoDict = function() {
      var pdfLib = "pdf-lib (https://github.com/Hopding/pdf-lib)";
      var now = /* @__PURE__ */ new Date();
      var info = this.getInfoDict();
      this.setProducer(pdfLib);
      this.setModificationDate(now);
      if (!info.get(PDFName.of("Creator")))
        this.setCreator(pdfLib);
      if (!info.get(PDFName.of("CreationDate")))
        this.setCreationDate(now);
    };
    PDFDocument2.prototype.getInfoDict = function() {
      var existingInfo = this.context.lookup(this.context.trailerInfo.Info);
      if (existingInfo instanceof PDFDict)
        return existingInfo;
      var newInfo = this.context.obj({});
      this.context.trailerInfo.Info = this.context.register(newInfo);
      return newInfo;
    };
    PDFDocument2.prototype.assertFontkit = function() {
      if (!this.fontkit)
        throw new FontkitNotRegisteredError();
      return this.fontkit;
    };
    return PDFDocument2;
  })()
);
function assertIsLiteralOrHexString(pdfObject) {
  if (!(pdfObject instanceof PDFHexString) && !(pdfObject instanceof PDFString)) {
    throw new UnexpectedObjectTypeError([PDFHexString, PDFString], pdfObject);
  }
}
var BlendMode;
(function(BlendMode2) {
  BlendMode2["Normal"] = "Normal";
  BlendMode2["Multiply"] = "Multiply";
  BlendMode2["Screen"] = "Screen";
  BlendMode2["Overlay"] = "Overlay";
  BlendMode2["Darken"] = "Darken";
  BlendMode2["Lighten"] = "Lighten";
  BlendMode2["ColorDodge"] = "ColorDodge";
  BlendMode2["ColorBurn"] = "ColorBurn";
  BlendMode2["HardLight"] = "HardLight";
  BlendMode2["SoftLight"] = "SoftLight";
  BlendMode2["Difference"] = "Difference";
  BlendMode2["Exclusion"] = "Exclusion";
})(BlendMode || (BlendMode = {}));
var PDFPage = (
  /** @class */
  (function() {
    function PDFPage2(leafNode, ref, doc) {
      this.fontSize = 24;
      this.fontColor = rgb(0, 0, 0);
      this.lineHeight = 24;
      this.x = 0;
      this.y = 0;
      assertIs(leafNode, "leafNode", [[PDFPageLeaf, "PDFPageLeaf"]]);
      assertIs(ref, "ref", [[PDFRef, "PDFRef"]]);
      assertIs(doc, "doc", [[PDFDocument, "PDFDocument"]]);
      this.node = leafNode;
      this.ref = ref;
      this.doc = doc;
    }
    PDFPage2.prototype.setRotation = function(angle) {
      var degreesAngle = toDegrees(angle);
      assertMultiple(degreesAngle, "degreesAngle", 90);
      this.node.set(PDFName.of("Rotate"), this.doc.context.obj(degreesAngle));
    };
    PDFPage2.prototype.getRotation = function() {
      var Rotate = this.node.Rotate();
      return degrees(Rotate ? Rotate.asNumber() : 0);
    };
    PDFPage2.prototype.setSize = function(width, height) {
      assertIs(width, "width", ["number"]);
      assertIs(height, "height", ["number"]);
      var mediaBox = this.getMediaBox();
      this.setMediaBox(mediaBox.x, mediaBox.y, width, height);
      var cropBox = this.getCropBox();
      var bleedBox = this.getBleedBox();
      var trimBox = this.getTrimBox();
      var artBox = this.getArtBox();
      var hasCropBox = this.node.CropBox();
      var hasBleedBox = this.node.BleedBox();
      var hasTrimBox = this.node.TrimBox();
      var hasArtBox = this.node.ArtBox();
      if (hasCropBox && rectanglesAreEqual(cropBox, mediaBox)) {
        this.setCropBox(mediaBox.x, mediaBox.y, width, height);
      }
      if (hasBleedBox && rectanglesAreEqual(bleedBox, mediaBox)) {
        this.setBleedBox(mediaBox.x, mediaBox.y, width, height);
      }
      if (hasTrimBox && rectanglesAreEqual(trimBox, mediaBox)) {
        this.setTrimBox(mediaBox.x, mediaBox.y, width, height);
      }
      if (hasArtBox && rectanglesAreEqual(artBox, mediaBox)) {
        this.setArtBox(mediaBox.x, mediaBox.y, width, height);
      }
    };
    PDFPage2.prototype.setWidth = function(width) {
      assertIs(width, "width", ["number"]);
      this.setSize(width, this.getSize().height);
    };
    PDFPage2.prototype.setHeight = function(height) {
      assertIs(height, "height", ["number"]);
      this.setSize(this.getSize().width, height);
    };
    PDFPage2.prototype.setMediaBox = function(x, y, width, height) {
      assertIs(x, "x", ["number"]);
      assertIs(y, "y", ["number"]);
      assertIs(width, "width", ["number"]);
      assertIs(height, "height", ["number"]);
      var mediaBox = this.doc.context.obj([x, y, x + width, y + height]);
      this.node.set(PDFName.MediaBox, mediaBox);
    };
    PDFPage2.prototype.setCropBox = function(x, y, width, height) {
      assertIs(x, "x", ["number"]);
      assertIs(y, "y", ["number"]);
      assertIs(width, "width", ["number"]);
      assertIs(height, "height", ["number"]);
      var cropBox = this.doc.context.obj([x, y, x + width, y + height]);
      this.node.set(PDFName.CropBox, cropBox);
    };
    PDFPage2.prototype.setBleedBox = function(x, y, width, height) {
      assertIs(x, "x", ["number"]);
      assertIs(y, "y", ["number"]);
      assertIs(width, "width", ["number"]);
      assertIs(height, "height", ["number"]);
      var bleedBox = this.doc.context.obj([x, y, x + width, y + height]);
      this.node.set(PDFName.BleedBox, bleedBox);
    };
    PDFPage2.prototype.setTrimBox = function(x, y, width, height) {
      assertIs(x, "x", ["number"]);
      assertIs(y, "y", ["number"]);
      assertIs(width, "width", ["number"]);
      assertIs(height, "height", ["number"]);
      var trimBox = this.doc.context.obj([x, y, x + width, y + height]);
      this.node.set(PDFName.TrimBox, trimBox);
    };
    PDFPage2.prototype.setArtBox = function(x, y, width, height) {
      assertIs(x, "x", ["number"]);
      assertIs(y, "y", ["number"]);
      assertIs(width, "width", ["number"]);
      assertIs(height, "height", ["number"]);
      var artBox = this.doc.context.obj([x, y, x + width, y + height]);
      this.node.set(PDFName.ArtBox, artBox);
    };
    PDFPage2.prototype.getSize = function() {
      var _a = this.getMediaBox(), width = _a.width, height = _a.height;
      return { width, height };
    };
    PDFPage2.prototype.getWidth = function() {
      return this.getSize().width;
    };
    PDFPage2.prototype.getHeight = function() {
      return this.getSize().height;
    };
    PDFPage2.prototype.getMediaBox = function() {
      var mediaBox = this.node.MediaBox();
      return mediaBox.asRectangle();
    };
    PDFPage2.prototype.getCropBox = function() {
      var _a;
      var cropBox = this.node.CropBox();
      return (_a = cropBox === null || cropBox === void 0 ? void 0 : cropBox.asRectangle()) !== null && _a !== void 0 ? _a : this.getMediaBox();
    };
    PDFPage2.prototype.getBleedBox = function() {
      var _a;
      var bleedBox = this.node.BleedBox();
      return (_a = bleedBox === null || bleedBox === void 0 ? void 0 : bleedBox.asRectangle()) !== null && _a !== void 0 ? _a : this.getCropBox();
    };
    PDFPage2.prototype.getTrimBox = function() {
      var _a;
      var trimBox = this.node.TrimBox();
      return (_a = trimBox === null || trimBox === void 0 ? void 0 : trimBox.asRectangle()) !== null && _a !== void 0 ? _a : this.getCropBox();
    };
    PDFPage2.prototype.getArtBox = function() {
      var _a;
      var artBox = this.node.ArtBox();
      return (_a = artBox === null || artBox === void 0 ? void 0 : artBox.asRectangle()) !== null && _a !== void 0 ? _a : this.getCropBox();
    };
    PDFPage2.prototype.translateContent = function(x, y) {
      assertIs(x, "x", ["number"]);
      assertIs(y, "y", ["number"]);
      this.node.normalize();
      this.getContentStream();
      var start = this.createContentStream(pushGraphicsState(), translate(x, y));
      var startRef = this.doc.context.register(start);
      var end = this.createContentStream(popGraphicsState());
      var endRef = this.doc.context.register(end);
      this.node.wrapContentStreams(startRef, endRef);
    };
    PDFPage2.prototype.scale = function(x, y) {
      assertIs(x, "x", ["number"]);
      assertIs(y, "y", ["number"]);
      this.setSize(this.getWidth() * x, this.getHeight() * y);
      this.scaleContent(x, y);
      this.scaleAnnotations(x, y);
    };
    PDFPage2.prototype.scaleContent = function(x, y) {
      assertIs(x, "x", ["number"]);
      assertIs(y, "y", ["number"]);
      this.node.normalize();
      this.getContentStream();
      var start = this.createContentStream(pushGraphicsState(), scale(x, y));
      var startRef = this.doc.context.register(start);
      var end = this.createContentStream(popGraphicsState());
      var endRef = this.doc.context.register(end);
      this.node.wrapContentStreams(startRef, endRef);
    };
    PDFPage2.prototype.scaleAnnotations = function(x, y) {
      assertIs(x, "x", ["number"]);
      assertIs(y, "y", ["number"]);
      var annots = this.node.Annots();
      if (!annots)
        return;
      for (var idx = 0; idx < annots.size(); idx++) {
        var annot = annots.lookup(idx);
        if (annot instanceof PDFDict)
          this.scaleAnnot(annot, x, y);
      }
    };
    PDFPage2.prototype.resetPosition = function() {
      this.getContentStream(false);
      this.x = 0;
      this.y = 0;
    };
    PDFPage2.prototype.setFont = function(font) {
      assertIs(font, "font", [[PDFFont, "PDFFont"]]);
      this.font = font;
      this.fontKey = this.node.newFontDictionary(this.font.name, this.font.ref);
    };
    PDFPage2.prototype.setFontSize = function(fontSize) {
      assertIs(fontSize, "fontSize", ["number"]);
      this.fontSize = fontSize;
    };
    PDFPage2.prototype.setFontColor = function(fontColor) {
      assertIs(fontColor, "fontColor", [[Object, "Color"]]);
      this.fontColor = fontColor;
    };
    PDFPage2.prototype.setLineHeight = function(lineHeight) {
      assertIs(lineHeight, "lineHeight", ["number"]);
      this.lineHeight = lineHeight;
    };
    PDFPage2.prototype.getPosition = function() {
      return { x: this.x, y: this.y };
    };
    PDFPage2.prototype.getX = function() {
      return this.x;
    };
    PDFPage2.prototype.getY = function() {
      return this.y;
    };
    PDFPage2.prototype.moveTo = function(x, y) {
      assertIs(x, "x", ["number"]);
      assertIs(y, "y", ["number"]);
      this.x = x;
      this.y = y;
    };
    PDFPage2.prototype.moveDown = function(yDecrease) {
      assertIs(yDecrease, "yDecrease", ["number"]);
      this.y -= yDecrease;
    };
    PDFPage2.prototype.moveUp = function(yIncrease) {
      assertIs(yIncrease, "yIncrease", ["number"]);
      this.y += yIncrease;
    };
    PDFPage2.prototype.moveLeft = function(xDecrease) {
      assertIs(xDecrease, "xDecrease", ["number"]);
      this.x -= xDecrease;
    };
    PDFPage2.prototype.moveRight = function(xIncrease) {
      assertIs(xIncrease, "xIncrease", ["number"]);
      this.x += xIncrease;
    };
    PDFPage2.prototype.pushOperators = function() {
      var operator = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        operator[_i] = arguments[_i];
      }
      assertEachIs(operator, "operator", [[PDFOperator, "PDFOperator"]]);
      var contentStream = this.getContentStream();
      contentStream.push.apply(contentStream, operator);
    };
    PDFPage2.prototype.drawText = function(text, options) {
      var _a, _b, _c, _d, _e, _f, _g;
      if (options === void 0) {
        options = {};
      }
      assertIs(text, "text", ["string"]);
      assertOrUndefined(options.color, "options.color", [[Object, "Color"]]);
      assertRangeOrUndefined(options.opacity, "opacity.opacity", 0, 1);
      assertOrUndefined(options.font, "options.font", [[PDFFont, "PDFFont"]]);
      assertOrUndefined(options.size, "options.size", ["number"]);
      assertOrUndefined(options.rotate, "options.rotate", [[Object, "Rotation"]]);
      assertOrUndefined(options.xSkew, "options.xSkew", [[Object, "Rotation"]]);
      assertOrUndefined(options.ySkew, "options.ySkew", [[Object, "Rotation"]]);
      assertOrUndefined(options.x, "options.x", ["number"]);
      assertOrUndefined(options.y, "options.y", ["number"]);
      assertOrUndefined(options.lineHeight, "options.lineHeight", ["number"]);
      assertOrUndefined(options.maxWidth, "options.maxWidth", ["number"]);
      assertOrUndefined(options.wordBreaks, "options.wordBreaks", [Array]);
      assertIsOneOfOrUndefined(options.blendMode, "options.blendMode", BlendMode);
      var _h = this.setOrEmbedFont(options.font), oldFont = _h.oldFont, newFont = _h.newFont, newFontKey = _h.newFontKey;
      var fontSize = options.size || this.fontSize;
      var wordBreaks = options.wordBreaks || this.doc.defaultWordBreaks;
      var textWidth = function(t) {
        return newFont.widthOfTextAtSize(t, fontSize);
      };
      var lines = options.maxWidth === void 0 ? lineSplit(cleanText(text)) : breakTextIntoLines(text, wordBreaks, options.maxWidth, textWidth);
      var encodedLines = new Array(lines.length);
      for (var idx = 0, len = lines.length; idx < len; idx++) {
        encodedLines[idx] = newFont.encodeText(lines[idx]);
      }
      var graphicsStateKey = this.maybeEmbedGraphicsState({
        opacity: options.opacity,
        blendMode: options.blendMode
      });
      var contentStream = this.getContentStream();
      contentStream.push.apply(contentStream, drawLinesOfText(encodedLines, {
        color: (_a = options.color) !== null && _a !== void 0 ? _a : this.fontColor,
        font: newFontKey,
        size: fontSize,
        rotate: (_b = options.rotate) !== null && _b !== void 0 ? _b : degrees(0),
        xSkew: (_c = options.xSkew) !== null && _c !== void 0 ? _c : degrees(0),
        ySkew: (_d = options.ySkew) !== null && _d !== void 0 ? _d : degrees(0),
        x: (_e = options.x) !== null && _e !== void 0 ? _e : this.x,
        y: (_f = options.y) !== null && _f !== void 0 ? _f : this.y,
        lineHeight: (_g = options.lineHeight) !== null && _g !== void 0 ? _g : this.lineHeight,
        graphicsState: graphicsStateKey
      }));
      if (options.font) {
        if (oldFont)
          this.setFont(oldFont);
        else
          this.resetFont();
      }
    };
    PDFPage2.prototype.drawImage = function(image, options) {
      var _a, _b, _c, _d, _e, _f, _g;
      if (options === void 0) {
        options = {};
      }
      assertIs(image, "image", [[PDFImage, "PDFImage"]]);
      assertOrUndefined(options.x, "options.x", ["number"]);
      assertOrUndefined(options.y, "options.y", ["number"]);
      assertOrUndefined(options.width, "options.width", ["number"]);
      assertOrUndefined(options.height, "options.height", ["number"]);
      assertOrUndefined(options.rotate, "options.rotate", [[Object, "Rotation"]]);
      assertOrUndefined(options.xSkew, "options.xSkew", [[Object, "Rotation"]]);
      assertOrUndefined(options.ySkew, "options.ySkew", [[Object, "Rotation"]]);
      assertRangeOrUndefined(options.opacity, "opacity.opacity", 0, 1);
      assertIsOneOfOrUndefined(options.blendMode, "options.blendMode", BlendMode);
      var xObjectKey = this.node.newXObject("Image", image.ref);
      var graphicsStateKey = this.maybeEmbedGraphicsState({
        opacity: options.opacity,
        blendMode: options.blendMode
      });
      var contentStream = this.getContentStream();
      contentStream.push.apply(contentStream, drawImage(xObjectKey, {
        x: (_a = options.x) !== null && _a !== void 0 ? _a : this.x,
        y: (_b = options.y) !== null && _b !== void 0 ? _b : this.y,
        width: (_c = options.width) !== null && _c !== void 0 ? _c : image.size().width,
        height: (_d = options.height) !== null && _d !== void 0 ? _d : image.size().height,
        rotate: (_e = options.rotate) !== null && _e !== void 0 ? _e : degrees(0),
        xSkew: (_f = options.xSkew) !== null && _f !== void 0 ? _f : degrees(0),
        ySkew: (_g = options.ySkew) !== null && _g !== void 0 ? _g : degrees(0),
        graphicsState: graphicsStateKey
      }));
    };
    PDFPage2.prototype.drawPage = function(embeddedPage, options) {
      var _a, _b, _c, _d, _e;
      if (options === void 0) {
        options = {};
      }
      assertIs(embeddedPage, "embeddedPage", [
        [PDFEmbeddedPage, "PDFEmbeddedPage"]
      ]);
      assertOrUndefined(options.x, "options.x", ["number"]);
      assertOrUndefined(options.y, "options.y", ["number"]);
      assertOrUndefined(options.xScale, "options.xScale", ["number"]);
      assertOrUndefined(options.yScale, "options.yScale", ["number"]);
      assertOrUndefined(options.width, "options.width", ["number"]);
      assertOrUndefined(options.height, "options.height", ["number"]);
      assertOrUndefined(options.rotate, "options.rotate", [[Object, "Rotation"]]);
      assertOrUndefined(options.xSkew, "options.xSkew", [[Object, "Rotation"]]);
      assertOrUndefined(options.ySkew, "options.ySkew", [[Object, "Rotation"]]);
      assertRangeOrUndefined(options.opacity, "opacity.opacity", 0, 1);
      assertIsOneOfOrUndefined(options.blendMode, "options.blendMode", BlendMode);
      var xObjectKey = this.node.newXObject("EmbeddedPdfPage", embeddedPage.ref);
      var graphicsStateKey = this.maybeEmbedGraphicsState({
        opacity: options.opacity,
        blendMode: options.blendMode
      });
      var xScale = options.width !== void 0 ? options.width / embeddedPage.width : options.xScale !== void 0 ? options.xScale : 1;
      var yScale = options.height !== void 0 ? options.height / embeddedPage.height : options.yScale !== void 0 ? options.yScale : 1;
      var contentStream = this.getContentStream();
      contentStream.push.apply(contentStream, drawPage(xObjectKey, {
        x: (_a = options.x) !== null && _a !== void 0 ? _a : this.x,
        y: (_b = options.y) !== null && _b !== void 0 ? _b : this.y,
        xScale,
        yScale,
        rotate: (_c = options.rotate) !== null && _c !== void 0 ? _c : degrees(0),
        xSkew: (_d = options.xSkew) !== null && _d !== void 0 ? _d : degrees(0),
        ySkew: (_e = options.ySkew) !== null && _e !== void 0 ? _e : degrees(0),
        graphicsState: graphicsStateKey
      }));
    };
    PDFPage2.prototype.drawSvgPath = function(path, options) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j;
      if (options === void 0) {
        options = {};
      }
      assertIs(path, "path", ["string"]);
      assertOrUndefined(options.x, "options.x", ["number"]);
      assertOrUndefined(options.y, "options.y", ["number"]);
      assertOrUndefined(options.scale, "options.scale", ["number"]);
      assertOrUndefined(options.rotate, "options.rotate", [[Object, "Rotation"]]);
      assertOrUndefined(options.borderWidth, "options.borderWidth", ["number"]);
      assertOrUndefined(options.color, "options.color", [[Object, "Color"]]);
      assertRangeOrUndefined(options.opacity, "opacity.opacity", 0, 1);
      assertOrUndefined(options.borderColor, "options.borderColor", [
        [Object, "Color"]
      ]);
      assertOrUndefined(options.borderDashArray, "options.borderDashArray", [
        Array
      ]);
      assertOrUndefined(options.borderDashPhase, "options.borderDashPhase", [
        "number"
      ]);
      assertIsOneOfOrUndefined(options.borderLineCap, "options.borderLineCap", LineCapStyle);
      assertRangeOrUndefined(options.borderOpacity, "options.borderOpacity", 0, 1);
      assertIsOneOfOrUndefined(options.blendMode, "options.blendMode", BlendMode);
      var graphicsStateKey = this.maybeEmbedGraphicsState({
        opacity: options.opacity,
        borderOpacity: options.borderOpacity,
        blendMode: options.blendMode
      });
      if (!("color" in options) && !("borderColor" in options)) {
        options.borderColor = rgb(0, 0, 0);
      }
      var contentStream = this.getContentStream();
      contentStream.push.apply(contentStream, drawSvgPath(path, {
        x: (_a = options.x) !== null && _a !== void 0 ? _a : this.x,
        y: (_b = options.y) !== null && _b !== void 0 ? _b : this.y,
        scale: options.scale,
        rotate: (_c = options.rotate) !== null && _c !== void 0 ? _c : degrees(0),
        color: (_d = options.color) !== null && _d !== void 0 ? _d : void 0,
        borderColor: (_e = options.borderColor) !== null && _e !== void 0 ? _e : void 0,
        borderWidth: (_f = options.borderWidth) !== null && _f !== void 0 ? _f : 0,
        borderDashArray: (_g = options.borderDashArray) !== null && _g !== void 0 ? _g : void 0,
        borderDashPhase: (_h = options.borderDashPhase) !== null && _h !== void 0 ? _h : void 0,
        borderLineCap: (_j = options.borderLineCap) !== null && _j !== void 0 ? _j : void 0,
        graphicsState: graphicsStateKey
      }));
    };
    PDFPage2.prototype.drawLine = function(options) {
      var _a, _b, _c, _d, _e;
      assertIs(options.start, "options.start", [
        [Object, "{ x: number, y: number }"]
      ]);
      assertIs(options.end, "options.end", [
        [Object, "{ x: number, y: number }"]
      ]);
      assertIs(options.start.x, "options.start.x", ["number"]);
      assertIs(options.start.y, "options.start.y", ["number"]);
      assertIs(options.end.x, "options.end.x", ["number"]);
      assertIs(options.end.y, "options.end.y", ["number"]);
      assertOrUndefined(options.thickness, "options.thickness", ["number"]);
      assertOrUndefined(options.color, "options.color", [[Object, "Color"]]);
      assertOrUndefined(options.dashArray, "options.dashArray", [Array]);
      assertOrUndefined(options.dashPhase, "options.dashPhase", ["number"]);
      assertIsOneOfOrUndefined(options.lineCap, "options.lineCap", LineCapStyle);
      assertRangeOrUndefined(options.opacity, "opacity.opacity", 0, 1);
      assertIsOneOfOrUndefined(options.blendMode, "options.blendMode", BlendMode);
      var graphicsStateKey = this.maybeEmbedGraphicsState({
        borderOpacity: options.opacity,
        blendMode: options.blendMode
      });
      if (!("color" in options)) {
        options.color = rgb(0, 0, 0);
      }
      var contentStream = this.getContentStream();
      contentStream.push.apply(contentStream, drawLine({
        start: options.start,
        end: options.end,
        thickness: (_a = options.thickness) !== null && _a !== void 0 ? _a : 1,
        color: (_b = options.color) !== null && _b !== void 0 ? _b : void 0,
        dashArray: (_c = options.dashArray) !== null && _c !== void 0 ? _c : void 0,
        dashPhase: (_d = options.dashPhase) !== null && _d !== void 0 ? _d : void 0,
        lineCap: (_e = options.lineCap) !== null && _e !== void 0 ? _e : void 0,
        graphicsState: graphicsStateKey
      }));
    };
    PDFPage2.prototype.drawRectangle = function(options) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
      if (options === void 0) {
        options = {};
      }
      assertOrUndefined(options.x, "options.x", ["number"]);
      assertOrUndefined(options.y, "options.y", ["number"]);
      assertOrUndefined(options.width, "options.width", ["number"]);
      assertOrUndefined(options.height, "options.height", ["number"]);
      assertOrUndefined(options.rotate, "options.rotate", [[Object, "Rotation"]]);
      assertOrUndefined(options.xSkew, "options.xSkew", [[Object, "Rotation"]]);
      assertOrUndefined(options.ySkew, "options.ySkew", [[Object, "Rotation"]]);
      assertOrUndefined(options.borderWidth, "options.borderWidth", ["number"]);
      assertOrUndefined(options.color, "options.color", [[Object, "Color"]]);
      assertRangeOrUndefined(options.opacity, "opacity.opacity", 0, 1);
      assertOrUndefined(options.borderColor, "options.borderColor", [
        [Object, "Color"]
      ]);
      assertOrUndefined(options.borderDashArray, "options.borderDashArray", [
        Array
      ]);
      assertOrUndefined(options.borderDashPhase, "options.borderDashPhase", [
        "number"
      ]);
      assertIsOneOfOrUndefined(options.borderLineCap, "options.borderLineCap", LineCapStyle);
      assertRangeOrUndefined(options.borderOpacity, "options.borderOpacity", 0, 1);
      assertIsOneOfOrUndefined(options.blendMode, "options.blendMode", BlendMode);
      var graphicsStateKey = this.maybeEmbedGraphicsState({
        opacity: options.opacity,
        borderOpacity: options.borderOpacity,
        blendMode: options.blendMode
      });
      if (!("color" in options) && !("borderColor" in options)) {
        options.color = rgb(0, 0, 0);
      }
      var contentStream = this.getContentStream();
      contentStream.push.apply(contentStream, drawRectangle({
        x: (_a = options.x) !== null && _a !== void 0 ? _a : this.x,
        y: (_b = options.y) !== null && _b !== void 0 ? _b : this.y,
        width: (_c = options.width) !== null && _c !== void 0 ? _c : 150,
        height: (_d = options.height) !== null && _d !== void 0 ? _d : 100,
        rotate: (_e = options.rotate) !== null && _e !== void 0 ? _e : degrees(0),
        xSkew: (_f = options.xSkew) !== null && _f !== void 0 ? _f : degrees(0),
        ySkew: (_g = options.ySkew) !== null && _g !== void 0 ? _g : degrees(0),
        borderWidth: (_h = options.borderWidth) !== null && _h !== void 0 ? _h : 0,
        color: (_j = options.color) !== null && _j !== void 0 ? _j : void 0,
        borderColor: (_k = options.borderColor) !== null && _k !== void 0 ? _k : void 0,
        borderDashArray: (_l = options.borderDashArray) !== null && _l !== void 0 ? _l : void 0,
        borderDashPhase: (_m = options.borderDashPhase) !== null && _m !== void 0 ? _m : void 0,
        graphicsState: graphicsStateKey,
        borderLineCap: (_o = options.borderLineCap) !== null && _o !== void 0 ? _o : void 0
      }));
    };
    PDFPage2.prototype.drawSquare = function(options) {
      if (options === void 0) {
        options = {};
      }
      var size = options.size;
      assertOrUndefined(size, "size", ["number"]);
      this.drawRectangle(__assign(__assign({}, options), { width: size, height: size }));
    };
    PDFPage2.prototype.drawEllipse = function(options) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
      if (options === void 0) {
        options = {};
      }
      assertOrUndefined(options.x, "options.x", ["number"]);
      assertOrUndefined(options.y, "options.y", ["number"]);
      assertOrUndefined(options.xScale, "options.xScale", ["number"]);
      assertOrUndefined(options.yScale, "options.yScale", ["number"]);
      assertOrUndefined(options.rotate, "options.rotate", [[Object, "Rotation"]]);
      assertOrUndefined(options.color, "options.color", [[Object, "Color"]]);
      assertRangeOrUndefined(options.opacity, "opacity.opacity", 0, 1);
      assertOrUndefined(options.borderColor, "options.borderColor", [
        [Object, "Color"]
      ]);
      assertRangeOrUndefined(options.borderOpacity, "options.borderOpacity", 0, 1);
      assertOrUndefined(options.borderWidth, "options.borderWidth", ["number"]);
      assertOrUndefined(options.borderDashArray, "options.borderDashArray", [
        Array
      ]);
      assertOrUndefined(options.borderDashPhase, "options.borderDashPhase", [
        "number"
      ]);
      assertIsOneOfOrUndefined(options.borderLineCap, "options.borderLineCap", LineCapStyle);
      assertIsOneOfOrUndefined(options.blendMode, "options.blendMode", BlendMode);
      var graphicsStateKey = this.maybeEmbedGraphicsState({
        opacity: options.opacity,
        borderOpacity: options.borderOpacity,
        blendMode: options.blendMode
      });
      if (!("color" in options) && !("borderColor" in options)) {
        options.color = rgb(0, 0, 0);
      }
      var contentStream = this.getContentStream();
      contentStream.push.apply(contentStream, drawEllipse({
        x: (_a = options.x) !== null && _a !== void 0 ? _a : this.x,
        y: (_b = options.y) !== null && _b !== void 0 ? _b : this.y,
        xScale: (_c = options.xScale) !== null && _c !== void 0 ? _c : 100,
        yScale: (_d = options.yScale) !== null && _d !== void 0 ? _d : 100,
        rotate: (_e = options.rotate) !== null && _e !== void 0 ? _e : void 0,
        color: (_f = options.color) !== null && _f !== void 0 ? _f : void 0,
        borderColor: (_g = options.borderColor) !== null && _g !== void 0 ? _g : void 0,
        borderWidth: (_h = options.borderWidth) !== null && _h !== void 0 ? _h : 0,
        borderDashArray: (_j = options.borderDashArray) !== null && _j !== void 0 ? _j : void 0,
        borderDashPhase: (_k = options.borderDashPhase) !== null && _k !== void 0 ? _k : void 0,
        borderLineCap: (_l = options.borderLineCap) !== null && _l !== void 0 ? _l : void 0,
        graphicsState: graphicsStateKey
      }));
    };
    PDFPage2.prototype.drawCircle = function(options) {
      if (options === void 0) {
        options = {};
      }
      var _a = options.size, size = _a === void 0 ? 100 : _a;
      assertOrUndefined(size, "size", ["number"]);
      this.drawEllipse(__assign(__assign({}, options), { xScale: size, yScale: size }));
    };
    PDFPage2.prototype.setOrEmbedFont = function(font) {
      var oldFont = this.font;
      var oldFontKey = this.fontKey;
      if (font)
        this.setFont(font);
      else
        this.getFont();
      var newFont = this.font;
      var newFontKey = this.fontKey;
      return { oldFont, oldFontKey, newFont, newFontKey };
    };
    PDFPage2.prototype.getFont = function() {
      if (!this.font || !this.fontKey) {
        var font = this.doc.embedStandardFont(StandardFonts.Helvetica);
        this.setFont(font);
      }
      return [this.font, this.fontKey];
    };
    PDFPage2.prototype.resetFont = function() {
      this.font = void 0;
      this.fontKey = void 0;
    };
    PDFPage2.prototype.getContentStream = function(useExisting) {
      if (useExisting === void 0) {
        useExisting = true;
      }
      if (useExisting && this.contentStream)
        return this.contentStream;
      this.contentStream = this.createContentStream();
      this.contentStreamRef = this.doc.context.register(this.contentStream);
      this.node.addContentStream(this.contentStreamRef);
      return this.contentStream;
    };
    PDFPage2.prototype.createContentStream = function() {
      var operators = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        operators[_i] = arguments[_i];
      }
      var dict = this.doc.context.obj({});
      var contentStream = PDFContentStream.of(dict, operators);
      return contentStream;
    };
    PDFPage2.prototype.maybeEmbedGraphicsState = function(options) {
      var opacity = options.opacity, borderOpacity = options.borderOpacity, blendMode = options.blendMode;
      if (opacity === void 0 && borderOpacity === void 0 && blendMode === void 0) {
        return void 0;
      }
      var graphicsState = this.doc.context.obj({
        Type: "ExtGState",
        ca: opacity,
        CA: borderOpacity,
        BM: blendMode
      });
      var key = this.node.newExtGState("GS", graphicsState);
      return key;
    };
    PDFPage2.prototype.scaleAnnot = function(annot, x, y) {
      var selectors = ["RD", "CL", "Vertices", "QuadPoints", "L", "Rect"];
      for (var idx = 0, len = selectors.length; idx < len; idx++) {
        var list = annot.lookup(PDFName.of(selectors[idx]));
        if (list instanceof PDFArray)
          list.scalePDFNumbers(x, y);
      }
      var inkLists = annot.lookup(PDFName.of("InkList"));
      if (inkLists instanceof PDFArray) {
        for (var idx = 0, len = inkLists.size(); idx < len; idx++) {
          var arr = inkLists.lookup(idx);
          if (arr instanceof PDFArray)
            arr.scalePDFNumbers(x, y);
        }
      }
    };
    PDFPage2.of = function(leafNode, ref, doc) {
      return new PDFPage2(leafNode, ref, doc);
    };
    PDFPage2.create = function(doc) {
      assertIs(doc, "doc", [[PDFDocument, "PDFDocument"]]);
      var dummyRef = PDFRef.of(-1);
      var pageLeaf = PDFPageLeaf.withContextAndParent(doc.context, dummyRef);
      var pageRef = doc.context.register(pageLeaf);
      return new PDFPage2(pageLeaf, pageRef, doc);
    };
    return PDFPage2;
  })()
);
var PDFButton = (
  /** @class */
  (function(_super) {
    __extends(PDFButton2, _super);
    function PDFButton2(acroPushButton, ref, doc) {
      var _this = _super.call(this, acroPushButton, ref, doc) || this;
      assertIs(acroPushButton, "acroButton", [
        [PDFAcroPushButton, "PDFAcroPushButton"]
      ]);
      _this.acroField = acroPushButton;
      return _this;
    }
    PDFButton2.prototype.setImage = function(image, alignment) {
      if (alignment === void 0) {
        alignment = ImageAlignment.Center;
      }
      var widgets = this.acroField.getWidgets();
      for (var idx = 0, len = widgets.length; idx < len; idx++) {
        var widget = widgets[idx];
        var streamRef = this.createImageAppearanceStream(widget, image, alignment);
        this.updateWidgetAppearances(widget, { normal: streamRef });
      }
      this.markAsClean();
    };
    PDFButton2.prototype.setFontSize = function(fontSize) {
      assertPositive(fontSize, "fontSize");
      this.acroField.setFontSize(fontSize);
      this.markAsDirty();
    };
    PDFButton2.prototype.addToPage = function(text, page, options) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
      assertOrUndefined(text, "text", ["string"]);
      assertOrUndefined(page, "page", [[PDFPage, "PDFPage"]]);
      assertFieldAppearanceOptions(options);
      var widget = this.createWidget({
        x: ((_a = options === null || options === void 0 ? void 0 : options.x) !== null && _a !== void 0 ? _a : 0) - ((_b = options === null || options === void 0 ? void 0 : options.borderWidth) !== null && _b !== void 0 ? _b : 0) / 2,
        y: ((_c = options === null || options === void 0 ? void 0 : options.y) !== null && _c !== void 0 ? _c : 0) - ((_d = options === null || options === void 0 ? void 0 : options.borderWidth) !== null && _d !== void 0 ? _d : 0) / 2,
        width: (_e = options === null || options === void 0 ? void 0 : options.width) !== null && _e !== void 0 ? _e : 100,
        height: (_f = options === null || options === void 0 ? void 0 : options.height) !== null && _f !== void 0 ? _f : 50,
        textColor: (_g = options === null || options === void 0 ? void 0 : options.textColor) !== null && _g !== void 0 ? _g : rgb(0, 0, 0),
        backgroundColor: (_h = options === null || options === void 0 ? void 0 : options.backgroundColor) !== null && _h !== void 0 ? _h : rgb(0.75, 0.75, 0.75),
        borderColor: options === null || options === void 0 ? void 0 : options.borderColor,
        borderWidth: (_j = options === null || options === void 0 ? void 0 : options.borderWidth) !== null && _j !== void 0 ? _j : 0,
        rotate: (_k = options === null || options === void 0 ? void 0 : options.rotate) !== null && _k !== void 0 ? _k : degrees(0),
        caption: text,
        hidden: options === null || options === void 0 ? void 0 : options.hidden,
        page: page.ref
      });
      var widgetRef = this.doc.context.register(widget.dict);
      this.acroField.addWidget(widgetRef);
      var font = (_l = options === null || options === void 0 ? void 0 : options.font) !== null && _l !== void 0 ? _l : this.doc.getForm().getDefaultFont();
      this.updateWidgetAppearance(widget, font);
      page.node.addAnnot(widgetRef);
    };
    PDFButton2.prototype.needsAppearancesUpdate = function() {
      var _a;
      if (this.isDirty())
        return true;
      var widgets = this.acroField.getWidgets();
      for (var idx = 0, len = widgets.length; idx < len; idx++) {
        var widget = widgets[idx];
        var hasAppearances = ((_a = widget.getAppearances()) === null || _a === void 0 ? void 0 : _a.normal) instanceof PDFStream;
        if (!hasAppearances)
          return true;
      }
      return false;
    };
    PDFButton2.prototype.defaultUpdateAppearances = function(font) {
      assertIs(font, "font", [[PDFFont, "PDFFont"]]);
      this.updateAppearances(font);
    };
    PDFButton2.prototype.updateAppearances = function(font, provider) {
      assertIs(font, "font", [[PDFFont, "PDFFont"]]);
      assertOrUndefined(provider, "provider", [Function]);
      var widgets = this.acroField.getWidgets();
      for (var idx = 0, len = widgets.length; idx < len; idx++) {
        var widget = widgets[idx];
        this.updateWidgetAppearance(widget, font, provider);
      }
    };
    PDFButton2.prototype.updateWidgetAppearance = function(widget, font, provider) {
      var apProvider = provider !== null && provider !== void 0 ? provider : defaultButtonAppearanceProvider;
      var appearances = normalizeAppearance(apProvider(this, widget, font));
      this.updateWidgetAppearanceWithFont(widget, font, appearances);
    };
    PDFButton2.of = function(acroPushButton, ref, doc) {
      return new PDFButton2(acroPushButton, ref, doc);
    };
    return PDFButton2;
  })(PDFField)
);
export {
  PDFDocument as P,
  StandardFonts as S,
  degrees as d,
  rgb as r
};
