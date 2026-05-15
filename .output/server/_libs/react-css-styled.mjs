import { s as styled$1 } from "./css-styled.mjs";
import { r as reactExports } from "./react.mjs";
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
}
function styled(Tag, css) {
  var injector = styled$1(css);
  var cssId = injector.className;
  return reactExports.forwardRef(function(props, ref) {
    var _a = props.className, className = _a === void 0 ? "" : _a;
    props.cspNonce;
    var attributes = __rest(props, ["className", "cspNonce"]);
    var targetRef = reactExports.useRef();
    reactExports.useImperativeHandle(ref, function() {
      return targetRef.current;
    }, []);
    reactExports.useEffect(function() {
      var injectResult = injector.inject(targetRef.current, {
        nonce: props.cspNonce
      });
      return function() {
        injectResult.destroy();
      };
    }, []);
    return reactExports.createElement(Tag, __assign({
      "ref": targetRef,
      "data-styled-id": cssId,
      "className": "".concat(className, " ").concat(cssId)
    }, attributes));
  });
}
export {
  styled as s
};
