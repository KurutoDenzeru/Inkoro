var FUNCTION = "function";
var OBJECT = "object";
var STRING = "string";
var NUMBER = "number";
var UNDEFINED = "undefined";
var IS_WINDOW = typeof window !== UNDEFINED;
var doc = typeof document !== UNDEFINED && document;
var OPEN_CLOSED_CHARACTERS = [{
  open: "(",
  close: ")"
}, {
  open: '"',
  close: '"'
}, {
  open: "'",
  close: "'"
}, {
  open: '\\"',
  close: '\\"'
}, {
  open: "\\'",
  close: "\\'"
}];
var TINY_NUM = 1e-7;
var DEFAULT_UNIT_PRESETS = {
  "cm": function(pos) {
    return pos * 96 / 2.54;
  },
  "mm": function(pos) {
    return pos * 96 / 254;
  },
  "in": function(pos) {
    return pos * 96;
  },
  "pt": function(pos) {
    return pos * 96 / 72;
  },
  "pc": function(pos) {
    return pos * 96 / 6;
  },
  "%": function(pos, size) {
    return pos * size / 100;
  },
  "vw": function(pos, size) {
    if (size === void 0) {
      size = window.innerWidth;
    }
    return pos / 100 * size;
  },
  "vh": function(pos, size) {
    if (size === void 0) {
      size = window.innerHeight;
    }
    return pos / 100 * size;
  },
  "vmax": function(pos, size) {
    if (size === void 0) {
      size = Math.max(window.innerWidth, window.innerHeight);
    }
    return pos / 100 * size;
  },
  "vmin": function(pos, size) {
    if (size === void 0) {
      size = Math.min(window.innerWidth, window.innerHeight);
    }
    return pos / 100 * size;
  }
};
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
  return r;
}
function dot(a1, a2, b1, b2) {
  return (a1 * b2 + a2 * b1) / (b1 + b2);
}
function isUndefined(value) {
  return typeof value === UNDEFINED;
}
function isObject(value) {
  return value && typeof value === OBJECT;
}
function isArray(value) {
  return Array.isArray(value);
}
function isString(value) {
  return typeof value === STRING;
}
function isNumber(value) {
  return typeof value === NUMBER;
}
function isFunction(value) {
  return typeof value === FUNCTION;
}
function isEqualSeparator(character, separator) {
  var isCharacterSpace = character === "" || character == " ";
  var isSeparatorSpace = separator === "" || separator == " ";
  return isSeparatorSpace && isCharacterSpace || character === separator;
}
function findOpen(openCharacter, texts, index, length, openCloseCharacters) {
  var isIgnore = findIgnore(openCharacter, texts, index);
  if (!isIgnore) {
    return findClose(openCharacter, texts, index + 1, length, openCloseCharacters);
  }
  return index;
}
function findIgnore(character, texts, index) {
  if (!character.ignore) {
    return null;
  }
  var otherText = texts.slice(Math.max(index - 3, 0), index + 3).join("");
  return new RegExp(character.ignore).exec(otherText);
}
function findClose(closeCharacter, texts, index, length, openCloseCharacters) {
  var _loop_1 = function(i2) {
    var character = texts[i2].trim();
    if (character === closeCharacter.close && !findIgnore(closeCharacter, texts, i2)) {
      return {
        value: i2
      };
    }
    var nextIndex = i2;
    var openCharacter = find(openCloseCharacters, function(_a) {
      var open = _a.open;
      return open === character;
    });
    if (openCharacter) {
      nextIndex = findOpen(openCharacter, texts, i2, length, openCloseCharacters);
    }
    if (nextIndex === -1) {
      return out_i_1 = i2, "break";
    }
    i2 = nextIndex;
    out_i_1 = i2;
  };
  var out_i_1;
  for (var i = index; i < length; ++i) {
    var state_1 = _loop_1(i);
    i = out_i_1;
    if (typeof state_1 === "object") return state_1.value;
    if (state_1 === "break") break;
  }
  return -1;
}
function splitText(text, splitOptions) {
  var _a = isString(splitOptions) ? {
    separator: splitOptions
  } : splitOptions, _b = _a.separator, separator = _b === void 0 ? "," : _b, isSeparateFirst = _a.isSeparateFirst, isSeparateOnlyOpenClose = _a.isSeparateOnlyOpenClose, _c = _a.isSeparateOpenClose, isSeparateOpenClose = _c === void 0 ? isSeparateOnlyOpenClose : _c, _d = _a.openCloseCharacters, openCloseCharacters = _d === void 0 ? OPEN_CLOSED_CHARACTERS : _d;
  var openClosedText = openCloseCharacters.map(function(_a2) {
    var open = _a2.open, close = _a2.close;
    if (open === close) {
      return open;
    }
    return open + "|" + close;
  }).join("|");
  var regexText = "(\\s*" + separator + "\\s*|" + openClosedText + "|\\s+)";
  var regex = new RegExp(regexText, "g");
  var texts = text.split(regex).filter(function(chr) {
    return chr && chr !== "undefined";
  });
  var length = texts.length;
  var values = [];
  var tempValues = [];
  function resetTemp() {
    if (tempValues.length) {
      values.push(tempValues.join(""));
      tempValues = [];
      return true;
    }
    return false;
  }
  var _loop_2 = function(i2) {
    var character = texts[i2].trim();
    var nextIndex = i2;
    var openCharacter = find(openCloseCharacters, function(_a2) {
      var open = _a2.open;
      return open === character;
    });
    var closeCharacter = find(openCloseCharacters, function(_a2) {
      var close = _a2.close;
      return close === character;
    });
    if (openCharacter) {
      nextIndex = findOpen(openCharacter, texts, i2, length, openCloseCharacters);
      if (nextIndex !== -1 && isSeparateOpenClose) {
        if (resetTemp() && isSeparateFirst) {
          return out_i_2 = i2, "break";
        }
        values.push(texts.slice(i2, nextIndex + 1).join(""));
        i2 = nextIndex;
        if (isSeparateFirst) {
          return out_i_2 = i2, "break";
        }
        return out_i_2 = i2, "continue";
      }
    } else if (closeCharacter && !findIgnore(closeCharacter, texts, i2)) {
      var nextOpenCloseCharacters = __spreadArrays(openCloseCharacters);
      nextOpenCloseCharacters.splice(openCloseCharacters.indexOf(closeCharacter), 1);
      return {
        value: splitText(text, {
          separator,
          isSeparateFirst,
          isSeparateOnlyOpenClose,
          isSeparateOpenClose,
          openCloseCharacters: nextOpenCloseCharacters
        })
      };
    } else if (isEqualSeparator(character, separator) && !isSeparateOnlyOpenClose) {
      resetTemp();
      if (isSeparateFirst) {
        return out_i_2 = i2, "break";
      }
      return out_i_2 = i2, "continue";
    }
    if (nextIndex === -1) {
      nextIndex = length - 1;
    }
    tempValues.push(texts.slice(i2, nextIndex + 1).join(""));
    i2 = nextIndex;
    out_i_2 = i2;
  };
  var out_i_2;
  for (var i = 0; i < length; ++i) {
    var state_2 = _loop_2(i);
    i = out_i_2;
    if (typeof state_2 === "object") return state_2.value;
    if (state_2 === "break") break;
  }
  if (tempValues.length) {
    values.push(tempValues.join(""));
  }
  return values;
}
function splitSpace(text) {
  return splitText(text, "");
}
function splitComma(text) {
  return splitText(text, ",");
}
function splitBracket(text) {
  var matches = /([^(]*)\(([\s\S]*)\)([\s\S]*)/g.exec(text);
  if (!matches || matches.length < 4) {
    return {};
  } else {
    return {
      prefix: matches[1],
      value: matches[2],
      suffix: matches[3]
    };
  }
}
function splitUnit(text) {
  var matches = /^([^\d|e|\-|\+]*)((?:\d|\.|-|e-|e\+)+)(\S*)$/g.exec(text);
  if (!matches) {
    return {
      prefix: "",
      unit: "",
      value: NaN
    };
  }
  var prefix = matches[1];
  var value = matches[2];
  var unit = matches[3];
  return {
    prefix,
    unit,
    value: parseFloat(value)
  };
}
function decamelize(str, separator) {
  return str.replace(/([a-z])([A-Z])/g, function(all, letter, letter2) {
    return "" + letter + separator + letter2.toLowerCase();
  });
}
function now() {
  return Date.now ? Date.now() : (/* @__PURE__ */ new Date()).getTime();
}
function findIndex(arr, callback, defaultIndex) {
  if (defaultIndex === void 0) {
    defaultIndex = -1;
  }
  var length = arr.length;
  for (var i = 0; i < length; ++i) {
    if (callback(arr[i], i, arr)) {
      return i;
    }
  }
  return defaultIndex;
}
function find(arr, callback, defalutValue) {
  var index = findIndex(arr, callback);
  return index > -1 ? arr[index] : defalutValue;
}
var requestAnimationFrame = /* @__PURE__ */ (function() {
  var firstTime = now();
  var raf = IS_WINDOW && (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame);
  return raf ? raf.bind(window) : function(callback) {
    var currTime = now();
    var id = setTimeout(function() {
      callback(currTime - firstTime);
    }, 1e3 / 60);
    return id;
  };
})();
var cancelAnimationFrame = /* @__PURE__ */ (function() {
  var caf = IS_WINDOW && (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame);
  return caf ? caf.bind(window) : function(handle) {
    clearTimeout(handle);
  };
})();
function getKeys(obj) {
  return Object.keys(obj);
}
function convertUnitSize(pos, size) {
  var _a = splitUnit(pos), value = _a.value, unit = _a.unit;
  if (isObject(size)) {
    var sizeFunction = size[unit];
    if (sizeFunction) {
      if (isFunction(sizeFunction)) {
        return sizeFunction(value);
      } else if (DEFAULT_UNIT_PRESETS[unit]) {
        return DEFAULT_UNIT_PRESETS[unit](value, sizeFunction);
      }
    }
  } else if (unit === "%") {
    return value * size / 100;
  }
  if (DEFAULT_UNIT_PRESETS[unit]) {
    return DEFAULT_UNIT_PRESETS[unit](value);
  }
  return value;
}
function between(value, min, max) {
  return Math.max(min, Math.min(value, max));
}
function checkBoundSize(targetSize, compareSize, isMax, ratio) {
  if (ratio === void 0) {
    ratio = targetSize[0] / targetSize[1];
  }
  return [[throttle(compareSize[0], TINY_NUM), throttle(compareSize[0] / ratio, TINY_NUM)], [throttle(compareSize[1] * ratio, TINY_NUM), throttle(compareSize[1], TINY_NUM)]].filter(function(size) {
    return size.every(function(value, i) {
      var defaultSize = compareSize[i];
      var throttledSize = throttle(defaultSize, TINY_NUM);
      return isMax ? value <= defaultSize || value <= throttledSize : value >= defaultSize || value >= throttledSize;
    });
  })[0] || targetSize;
}
function calculateBoundSize(size, minSize, maxSize, keepRatio) {
  if (!keepRatio) {
    return size.map(function(value, i) {
      return between(value, minSize[i], maxSize[i]);
    });
  }
  var width = size[0], height = size[1];
  var ratio = keepRatio === true ? width / height : keepRatio;
  var _a = checkBoundSize(size, minSize, false, ratio), minWidth = _a[0], minHeight = _a[1];
  var _b = checkBoundSize(size, maxSize, true, ratio), maxWidth = _b[0], maxHeight = _b[1];
  if (width < minWidth || height < minHeight) {
    width = minWidth;
    height = minHeight;
  } else if (width > maxWidth || height > maxHeight) {
    width = maxWidth;
    height = maxHeight;
  }
  return [width, height];
}
function sum(nums) {
  var length = nums.length;
  var total = 0;
  for (var i = length - 1; i >= 0; --i) {
    total += nums[i];
  }
  return total;
}
function average(nums) {
  var length = nums.length;
  var total = 0;
  for (var i = length - 1; i >= 0; --i) {
    total += nums[i];
  }
  return length ? total / length : 0;
}
function getRad(pos1, pos2) {
  var distX = pos2[0] - pos1[0];
  var distY = pos2[1] - pos1[1];
  var rad = Math.atan2(distY, distX);
  return rad >= 0 ? rad : rad + Math.PI * 2;
}
function getCenterPoint(points) {
  return [0, 1].map(function(i) {
    return average(points.map(function(pos) {
      return pos[i];
    }));
  });
}
function getShapeDirection(points) {
  var center = getCenterPoint(points);
  var pos1Rad = getRad(center, points[0]);
  var pos2Rad = getRad(center, points[1]);
  return pos1Rad < pos2Rad && pos2Rad - pos1Rad < Math.PI || pos1Rad > pos2Rad && pos2Rad - pos1Rad < -Math.PI ? 1 : -1;
}
function getDist(a, b) {
  return Math.sqrt(Math.pow((b ? b[0] : 0) - a[0], 2) + Math.pow((b ? b[1] : 0) - a[1], 2));
}
function throttle(num, unit) {
  if (!unit) {
    return num;
  }
  var reverseUnit = 1 / unit;
  return Math.round(num / unit) / reverseUnit;
}
function throttleArray(nums, unit) {
  nums.forEach(function(_, i) {
    nums[i] = throttle(nums[i], unit);
  });
  return nums;
}
function counter(num) {
  var nums = [];
  for (var i = 0; i < num; ++i) {
    nums.push(i);
  }
  return nums;
}
function flat(arr) {
  return arr.reduce(function(prev, cur) {
    return prev.concat(cur);
  }, []);
}
function hasClass(element, className) {
  if (element.classList) {
    return element.classList.contains(className);
  }
  return !!element.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
}
function addClass(element, className) {
  if (element.classList) {
    element.classList.add(className);
  } else {
    element.className += " " + className;
  }
}
function removeClass(element, className) {
  if (element.classList) {
    element.classList.remove(className);
  } else {
    var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
    element.className = element.className.replace(reg, " ");
  }
}
function addEvent(el, type, listener, options) {
  el.addEventListener(type, listener, options);
}
function removeEvent(el, type, listener, options) {
  el.removeEventListener(type, listener, options);
}
function getDocument(el) {
  return (el === null || el === void 0 ? void 0 : el.ownerDocument) || doc;
}
function getDocumentElement(el) {
  return getDocument(el).documentElement;
}
function getDocumentBody(el) {
  return getDocument(el).body;
}
function getWindow(el) {
  var _a;
  return ((_a = el === null || el === void 0 ? void 0 : el.ownerDocument) === null || _a === void 0 ? void 0 : _a.defaultView) || window;
}
function isWindow(val) {
  return val && "postMessage" in val && "blur" in val && "self" in val;
}
function isNode(el) {
  return isObject(el) && el.nodeName && el.nodeType && "ownerDocument" in el;
}
export {
  isObject as A,
  isString as B,
  isUndefined as C,
  isWindow as D,
  now as E,
  removeClass as F,
  removeEvent as G,
  requestAnimationFrame as H,
  splitBracket as I,
  splitComma as J,
  splitSpace as K,
  splitUnit as L,
  sum as M,
  throttle as N,
  throttleArray as O,
  TINY_NUM as T,
  addClass as a,
  addEvent as b,
  average as c,
  between as d,
  calculateBoundSize as e,
  cancelAnimationFrame as f,
  convertUnitSize as g,
  counter as h,
  decamelize as i,
  dot as j,
  find as k,
  findIndex as l,
  flat as m,
  getDist as n,
  getDocument as o,
  getDocumentBody as p,
  getDocumentElement as q,
  getKeys as r,
  getRad as s,
  getShapeDirection as t,
  getWindow as u,
  hasClass as v,
  isArray as w,
  isFunction as x,
  isNode as y,
  isNumber as z
};
