import { g as getDefaultExportFromCjs } from "./react.mjs";
var warning_1;
var hasRequiredWarning;
function requireWarning() {
  if (hasRequiredWarning) return warning_1;
  hasRequiredWarning = 1;
  var warning2 = function() {
  };
  warning_1 = warning2;
  return warning_1;
}
var warningExports = requireWarning();
const warning = /* @__PURE__ */ getDefaultExportFromCjs(warningExports);
export {
  warning as w
};
