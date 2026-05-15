import { d as diff$1, L as ListDiffer } from "./egjs__list-differ.mjs";
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var findKeyCallback = typeof Map === "function" ? void 0 : /* @__PURE__ */ (function() {
  var childrenCount = 0;
  return function(el) {
    return el.__DIFF_KEY__ || (el.__DIFF_KEY__ = ++childrenCount);
  };
})();
var ChildrenDiffer = /* @__PURE__ */ (function(_super) {
  __extends(ChildrenDiffer2, _super);
  function ChildrenDiffer2(list) {
    if (list === void 0) {
      list = [];
    }
    return _super.call(this, list, findKeyCallback) || this;
  }
  return ChildrenDiffer2;
})(ListDiffer);
function diff(prevList, list) {
  return diff$1(prevList, list, findKeyCallback);
}
export {
  ChildrenDiffer as C,
  diff as d
};
