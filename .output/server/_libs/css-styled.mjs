import { o as getDocument, J as splitComma } from "./daybrush__utils.mjs";
function hash(str) {
  var hash2 = 5381, i = str.length;
  while (i) {
    hash2 = hash2 * 33 ^ str.charCodeAt(--i);
  }
  return hash2 >>> 0;
}
var stringHash = hash;
function getHash(str) {
  return stringHash(str).toString(36);
}
function getShadowRoot(parentElement) {
  if (parentElement && parentElement.getRootNode) {
    var rootNode = parentElement.getRootNode();
    if (rootNode.nodeType === 11) {
      return rootNode;
    }
  }
  return;
}
function replaceStyle(className, css, options) {
  if (options.original) {
    return css;
  }
  return css.replace(/([^};{\s}][^};{]*|^\s*){/mg, function(_, selector) {
    var trimmedSelector = selector.trim();
    return (trimmedSelector ? splitComma(trimmedSelector) : [""]).map(function(subSelector) {
      var trimmedSubSelector = subSelector.trim();
      if (trimmedSubSelector.indexOf("@") === 0) {
        return trimmedSubSelector;
      } else if (trimmedSubSelector.indexOf(":global") > -1) {
        return trimmedSubSelector.replace(/\:global/g, "");
      } else if (trimmedSubSelector.indexOf(":host") > -1) {
        return "".concat(trimmedSubSelector.replace(/\:host/g, ".".concat(className)));
      } else if (trimmedSubSelector) {
        return ".".concat(className, " ").concat(trimmedSubSelector);
      } else {
        return ".".concat(className);
      }
    }).join(", ") + " {";
  });
}
function injectStyle(className, css, options, el, shadowRoot) {
  var doc = getDocument(el);
  var style = doc.createElement("style");
  style.setAttribute("type", "text/css");
  style.setAttribute("data-styled-id", className);
  style.setAttribute("data-styled-count", "1");
  if (options.nonce) {
    style.setAttribute("nonce", options.nonce);
  }
  style.innerHTML = replaceStyle(className, css, options);
  (shadowRoot || doc.head || doc.body).appendChild(style);
  return style;
}
function styled(css) {
  var injectClassName = "rCS" + getHash(css);
  return {
    className: injectClassName,
    inject: function(el, options) {
      if (options === void 0) {
        options = {};
      }
      var shadowRoot = getShadowRoot(el);
      var styleElement = (shadowRoot || el.ownerDocument || document).querySelector('style[data-styled-id="'.concat(injectClassName, '"]'));
      if (!styleElement) {
        styleElement = injectStyle(injectClassName, css, options, el, shadowRoot);
      } else {
        var count = parseFloat(styleElement.getAttribute("data-styled-count")) || 0;
        styleElement.setAttribute("data-styled-count", "".concat(count + 1));
      }
      return {
        destroy: function() {
          var _a;
          var injectCount = parseFloat(styleElement.getAttribute("data-styled-count")) || 0;
          if (injectCount <= 1) {
            if (styleElement.remove) {
              styleElement.remove();
            } else {
              (_a = styleElement.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(styleElement);
            }
            styleElement = null;
          } else {
            styleElement.setAttribute("data-styled-count", "".concat(injectCount - 1));
          }
        }
      };
    }
  };
}
export {
  styled as s
};
