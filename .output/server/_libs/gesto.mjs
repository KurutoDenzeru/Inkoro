import { E as EventEmitter } from "./scena__event-emitter.mjs";
import { G as removeEvent, b as addEvent, E as now, D as isWindow, u as getWindow } from "./daybrush__utils.mjs";
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
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
function getRad(pos1, pos2) {
  var distX = pos2[0] - pos1[0];
  var distY = pos2[1] - pos1[1];
  var rad = Math.atan2(distY, distX);
  return rad >= 0 ? rad : rad + Math.PI * 2;
}
function getRotatiion(touches) {
  return getRad([
    touches[0].clientX,
    touches[0].clientY
  ], [
    touches[1].clientX,
    touches[1].clientY
  ]) / Math.PI * 180;
}
function isMultiTouch(e) {
  return e.touches && e.touches.length >= 2;
}
function getEventClients(e) {
  if (!e) {
    return [];
  }
  if (e.touches) {
    return getClients(e.touches);
  } else {
    return [getClient(e)];
  }
}
function isMouseEvent(e) {
  return e && (e.type.indexOf("mouse") > -1 || "button" in e);
}
function getPosition(clients, prevClients, startClients) {
  var length = startClients.length;
  var _a = getAverageClient(clients, length), clientX = _a.clientX, clientY = _a.clientY, originalClientX = _a.originalClientX, originalClientY = _a.originalClientY;
  var _b = getAverageClient(prevClients, length), prevX = _b.clientX, prevY = _b.clientY;
  var _c = getAverageClient(startClients, length), startX = _c.clientX, startY = _c.clientY;
  var deltaX = clientX - prevX;
  var deltaY = clientY - prevY;
  var distX = clientX - startX;
  var distY = clientY - startY;
  return {
    clientX: originalClientX,
    clientY: originalClientY,
    deltaX,
    deltaY,
    distX,
    distY
  };
}
function getDist(clients) {
  return Math.sqrt(Math.pow(clients[0].clientX - clients[1].clientX, 2) + Math.pow(clients[0].clientY - clients[1].clientY, 2));
}
function getClients(touches) {
  var length = Math.min(touches.length, 2);
  var clients = [];
  for (var i = 0; i < length; ++i) {
    clients.push(getClient(touches[i]));
  }
  return clients;
}
function getClient(e) {
  return {
    clientX: e.clientX,
    clientY: e.clientY
  };
}
function getAverageClient(clients, length) {
  if (length === void 0) {
    length = clients.length;
  }
  var sumClient = {
    clientX: 0,
    clientY: 0,
    originalClientX: 0,
    originalClientY: 0
  };
  var minLength = Math.min(clients.length, length);
  for (var i = 0; i < minLength; ++i) {
    var client = clients[i];
    sumClient.originalClientX += "originalClientX" in client ? client.originalClientX : client.clientX;
    sumClient.originalClientY += "originalClientY" in client ? client.originalClientY : client.clientY;
    sumClient.clientX += client.clientX;
    sumClient.clientY += client.clientY;
  }
  if (!length) {
    return sumClient;
  }
  return {
    clientX: sumClient.clientX / length,
    clientY: sumClient.clientY / length,
    originalClientX: sumClient.originalClientX / length,
    originalClientY: sumClient.originalClientY / length
  };
}
var ClientStore = /* @__PURE__ */ (function() {
  function ClientStore2(clients) {
    this.prevClients = [];
    this.startClients = [];
    this.movement = 0;
    this.length = 0;
    this.startClients = clients;
    this.prevClients = clients;
    this.length = clients.length;
  }
  ClientStore2.prototype.getAngle = function(clients) {
    if (clients === void 0) {
      clients = this.prevClients;
    }
    return getRotatiion(clients);
  };
  ClientStore2.prototype.getRotation = function(clients) {
    if (clients === void 0) {
      clients = this.prevClients;
    }
    return getRotatiion(clients) - getRotatiion(this.startClients);
  };
  ClientStore2.prototype.getPosition = function(clients, isAdd) {
    if (clients === void 0) {
      clients = this.prevClients;
    }
    var position = getPosition(clients || this.prevClients, this.prevClients, this.startClients);
    var deltaX = position.deltaX, deltaY = position.deltaY;
    this.movement += Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    this.prevClients = clients;
    return position;
  };
  ClientStore2.prototype.getPositions = function(clients) {
    if (clients === void 0) {
      clients = this.prevClients;
    }
    var prevClients = this.prevClients;
    var startClients = this.startClients;
    var minLength = Math.min(this.length, prevClients.length);
    var positions = [];
    for (var i = 0; i < minLength; ++i) {
      positions[i] = getPosition([clients[i]], [prevClients[i]], [startClients[i]]);
    }
    return positions;
  };
  ClientStore2.prototype.getMovement = function(clients) {
    var movement = this.movement;
    if (!clients) {
      return movement;
    }
    var currentClient = getAverageClient(clients, this.length);
    var prevClient = getAverageClient(this.prevClients, this.length);
    var deltaX = currentClient.clientX - prevClient.clientX;
    var deltaY = currentClient.clientY - prevClient.clientY;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY) + movement;
  };
  ClientStore2.prototype.getDistance = function(clients) {
    if (clients === void 0) {
      clients = this.prevClients;
    }
    return getDist(clients);
  };
  ClientStore2.prototype.getScale = function(clients) {
    if (clients === void 0) {
      clients = this.prevClients;
    }
    return getDist(clients) / getDist(this.startClients);
  };
  ClientStore2.prototype.move = function(deltaX, deltaY) {
    this.startClients.forEach(function(client) {
      client.clientX -= deltaX;
      client.clientY -= deltaY;
    });
    this.prevClients.forEach(function(client) {
      client.clientX -= deltaX;
      client.clientY -= deltaY;
    });
  };
  return ClientStore2;
})();
var INPUT_TAGNAMES = ["textarea", "input"];
var Gesto = /* @__PURE__ */ (function(_super) {
  __extends(Gesto2, _super);
  function Gesto2(targets, options) {
    if (options === void 0) {
      options = {};
    }
    var _this = _super.call(this) || this;
    _this.options = {};
    _this.flag = false;
    _this.pinchFlag = false;
    _this.data = {};
    _this.isDrag = false;
    _this.isPinch = false;
    _this.clientStores = [];
    _this.targets = [];
    _this.prevTime = 0;
    _this.doubleFlag = false;
    _this._useMouse = false;
    _this._useTouch = false;
    _this._useDrag = false;
    _this._dragFlag = false;
    _this._isTrusted = false;
    _this._isMouseEvent = false;
    _this._isSecondaryButton = false;
    _this._preventMouseEvent = false;
    _this._prevInputEvent = null;
    _this._isDragAPI = false;
    _this._isIdle = true;
    _this._preventMouseEventId = 0;
    _this._window = window;
    _this.onDragStart = function(e, isTrusted) {
      if (isTrusted === void 0) {
        isTrusted = true;
      }
      if (!_this.flag && e.cancelable === false) {
        return;
      }
      var isDragAPI = e.type.indexOf("drag") >= -1;
      if (_this.flag && isDragAPI) {
        return;
      }
      _this._isDragAPI = true;
      var _a2 = _this.options, container2 = _a2.container, pinchOutside = _a2.pinchOutside, preventWheelClick = _a2.preventWheelClick, preventRightClick = _a2.preventRightClick, preventDefault = _a2.preventDefault, checkInput = _a2.checkInput, dragFocusedInput = _a2.dragFocusedInput, preventClickEventOnDragStart = _a2.preventClickEventOnDragStart, preventClickEventOnDrag = _a2.preventClickEventOnDrag, preventClickEventByCondition = _a2.preventClickEventByCondition;
      var useTouch = _this._useTouch;
      var isDragStart = !_this.flag;
      _this._isSecondaryButton = e.which === 3 || e.button === 2;
      if (preventWheelClick && (e.which === 2 || e.button === 1) || preventRightClick && (e.which === 3 || e.button === 2)) {
        _this.stop();
        return false;
      }
      if (isDragStart) {
        var activeElement = _this._window.document.activeElement;
        var target = e.target;
        if (target) {
          var tagName = target.tagName.toLowerCase();
          var hasInput = INPUT_TAGNAMES.indexOf(tagName) > -1;
          var hasContentEditable = target.isContentEditable;
          if (hasInput || hasContentEditable) {
            if (checkInput || !dragFocusedInput && activeElement === target) {
              return false;
            }
            if (activeElement && (activeElement === target || hasContentEditable && activeElement.isContentEditable && activeElement.contains(target))) {
              if (dragFocusedInput) {
                target.blur();
              } else {
                return false;
              }
            }
          } else if ((preventDefault || e.type === "touchstart") && activeElement) {
            var activeTagName = activeElement.tagName.toLowerCase();
            if (activeElement.isContentEditable || INPUT_TAGNAMES.indexOf(activeTagName) > -1) {
              activeElement.blur();
            }
          }
          if (preventClickEventOnDragStart || preventClickEventOnDrag || preventClickEventByCondition) {
            addEvent(_this._window, "click", _this._onClick, true);
          }
        }
        _this.clientStores = [new ClientStore(getEventClients(e))];
        _this._isIdle = false;
        _this.flag = true;
        _this.isDrag = false;
        _this._isTrusted = isTrusted;
        _this._dragFlag = true;
        _this._prevInputEvent = e;
        _this.data = {};
        _this.doubleFlag = now() - _this.prevTime < 200;
        _this._isMouseEvent = isMouseEvent(e);
        if (!_this._isMouseEvent && _this._preventMouseEvent) {
          _this._allowMouseEvent();
        }
        var result = _this._preventMouseEvent || _this.emit("dragStart", __assign(__assign({ data: _this.data, datas: _this.data, inputEvent: e, isMouseEvent: _this._isMouseEvent, isSecondaryButton: _this._isSecondaryButton, isTrusted, isDouble: _this.doubleFlag }, _this.getCurrentStore().getPosition()), { preventDefault: function() {
          e.preventDefault();
        }, preventDrag: function() {
          _this._dragFlag = false;
        } }));
        if (result === false) {
          _this.stop();
        }
        if (_this._isMouseEvent && _this.flag && preventDefault) {
          e.preventDefault();
        }
      }
      if (!_this.flag) {
        return false;
      }
      var timer = 0;
      if (isDragStart) {
        _this._attchDragEvent();
        if (useTouch && pinchOutside) {
          timer = setTimeout(function() {
            addEvent(container2, "touchstart", _this.onDragStart, {
              passive: false
            });
          });
        }
      } else if (useTouch && pinchOutside) {
        removeEvent(container2, "touchstart", _this.onDragStart);
      }
      if (_this.flag && isMultiTouch(e)) {
        clearTimeout(timer);
        if (isDragStart && e.touches.length !== e.changedTouches.length) {
          return;
        }
        if (!_this.pinchFlag) {
          _this.onPinchStart(e);
        }
      }
    };
    _this.onDrag = function(e, isScroll) {
      if (!_this.flag) {
        return;
      }
      var preventDefault = _this.options.preventDefault;
      if (!_this._isMouseEvent && preventDefault) {
        e.preventDefault();
      }
      _this._prevInputEvent = e;
      var clients = getEventClients(e);
      var result = _this.moveClients(clients, e, false);
      if (_this._dragFlag) {
        if (_this.pinchFlag || result.deltaX || result.deltaY) {
          var dragResult = _this._preventMouseEvent || _this.emit("drag", __assign(__assign({}, result), { isScroll: !!isScroll, inputEvent: e }));
          if (dragResult === false) {
            _this.stop();
            return;
          }
        }
        if (_this.pinchFlag) {
          _this.onPinch(e, clients);
        }
      }
      _this.getCurrentStore().getPosition(clients, true);
    };
    _this.onDragEnd = function(e) {
      if (!_this.flag) {
        return;
      }
      var _a2 = _this.options, pinchOutside = _a2.pinchOutside, container2 = _a2.container, preventClickEventOnDrag = _a2.preventClickEventOnDrag, preventClickEventOnDragStart = _a2.preventClickEventOnDragStart, preventClickEventByCondition = _a2.preventClickEventByCondition;
      var isDrag = _this.isDrag;
      if (preventClickEventOnDrag || preventClickEventOnDragStart || preventClickEventByCondition) {
        requestAnimationFrame(function() {
          _this._allowClickEvent();
        });
      }
      if (!preventClickEventByCondition && !preventClickEventOnDragStart && preventClickEventOnDrag && !isDrag) {
        _this._allowClickEvent();
      }
      if (_this._useTouch && pinchOutside) {
        removeEvent(container2, "touchstart", _this.onDragStart);
      }
      if (_this.pinchFlag) {
        _this.onPinchEnd(e);
      }
      var clients = (e === null || e === void 0 ? void 0 : e.touches) ? getEventClients(e) : [];
      var clientsLength = clients.length;
      if (clientsLength === 0 || !_this.options.keepDragging) {
        _this.flag = false;
      } else {
        _this._addStore(new ClientStore(clients));
      }
      var position = _this._getPosition();
      var currentTime = now();
      var isDouble = !isDrag && _this.doubleFlag;
      _this._prevInputEvent = null;
      _this.prevTime = isDrag || isDouble ? 0 : currentTime;
      if (!_this.flag) {
        _this._dettachDragEvent();
        _this._preventMouseEvent || _this.emit("dragEnd", __assign({ data: _this.data, datas: _this.data, isDouble, isDrag, isClick: !isDrag, isMouseEvent: _this._isMouseEvent, isSecondaryButton: _this._isSecondaryButton, inputEvent: e, isTrusted: _this._isTrusted }, position));
        _this.clientStores = [];
        if (!_this._isMouseEvent) {
          _this._preventMouseEvent = true;
          clearTimeout(_this._preventMouseEventId);
          _this._preventMouseEventId = setTimeout(function() {
            _this._preventMouseEvent = false;
          }, 200);
        }
        _this._isIdle = true;
      }
    };
    _this.onBlur = function() {
      _this.onDragEnd();
    };
    _this._allowClickEvent = function() {
      removeEvent(_this._window, "click", _this._onClick, true);
    };
    _this._onClick = function(e) {
      _this._allowClickEvent();
      _this._allowMouseEvent();
      var preventClickEventByCondition = _this.options.preventClickEventByCondition;
      if (preventClickEventByCondition === null || preventClickEventByCondition === void 0 ? void 0 : preventClickEventByCondition(e)) {
        return;
      }
      e.stopPropagation();
      e.preventDefault();
    };
    _this._onContextMenu = function(e) {
      var options2 = _this.options;
      if (!options2.preventRightClick) {
        e.preventDefault();
      } else {
        _this.onDragEnd(e);
      }
    };
    _this._passCallback = function() {
    };
    var elements = [].concat(targets);
    var firstTarget = elements[0];
    _this._window = isWindow(firstTarget) ? firstTarget : getWindow(firstTarget);
    _this.options = __assign({ checkInput: false, container: firstTarget && !("document" in firstTarget) ? getWindow(firstTarget) : firstTarget, preventRightClick: true, preventWheelClick: true, preventClickEventOnDragStart: false, preventClickEventOnDrag: false, preventClickEventByCondition: null, preventDefault: true, checkWindowBlur: false, keepDragging: false, pinchThreshold: 0, events: ["touch", "mouse"] }, options);
    var _a = _this.options, container = _a.container, events = _a.events, checkWindowBlur = _a.checkWindowBlur;
    _this._useDrag = events.indexOf("drag") > -1;
    _this._useTouch = events.indexOf("touch") > -1;
    _this._useMouse = events.indexOf("mouse") > -1;
    _this.targets = elements;
    if (_this._useDrag) {
      elements.forEach(function(el) {
        addEvent(el, "dragstart", _this.onDragStart);
      });
    }
    if (_this._useMouse) {
      elements.forEach(function(el) {
        addEvent(el, "mousedown", _this.onDragStart);
        addEvent(el, "mousemove", _this._passCallback);
      });
      addEvent(container, "contextmenu", _this._onContextMenu);
    }
    if (checkWindowBlur) {
      addEvent(getWindow(), "blur", _this.onBlur);
    }
    if (_this._useTouch) {
      var passive_1 = {
        passive: false
      };
      elements.forEach(function(el) {
        addEvent(el, "touchstart", _this.onDragStart, passive_1);
        addEvent(el, "touchmove", _this._passCallback, passive_1);
      });
    }
    return _this;
  }
  Gesto2.prototype.stop = function() {
    this.isDrag = false;
    this.data = {};
    this.clientStores = [];
    this.pinchFlag = false;
    this.doubleFlag = false;
    this.prevTime = 0;
    this.flag = false;
    this._isIdle = true;
    this._allowClickEvent();
    this._dettachDragEvent();
    this._isDragAPI = false;
  };
  Gesto2.prototype.getMovement = function(clients) {
    return this.getCurrentStore().getMovement(clients) + this.clientStores.slice(1).reduce(function(prev, cur) {
      return prev + cur.movement;
    }, 0);
  };
  Gesto2.prototype.isDragging = function() {
    return this.isDrag;
  };
  Gesto2.prototype.isIdle = function() {
    return this._isIdle;
  };
  Gesto2.prototype.isFlag = function() {
    return this.flag;
  };
  Gesto2.prototype.isPinchFlag = function() {
    return this.pinchFlag;
  };
  Gesto2.prototype.isDoubleFlag = function() {
    return this.doubleFlag;
  };
  Gesto2.prototype.isPinching = function() {
    return this.isPinch;
  };
  Gesto2.prototype.scrollBy = function(deltaX, deltaY, e, isCallDrag) {
    if (isCallDrag === void 0) {
      isCallDrag = true;
    }
    if (!this.flag) {
      return;
    }
    this.clientStores[0].move(deltaX, deltaY);
    isCallDrag && this.onDrag(e, true);
  };
  Gesto2.prototype.move = function(_a, inputEvent) {
    var deltaX = _a[0], deltaY = _a[1];
    var store = this.getCurrentStore();
    var nextClients = store.prevClients;
    return this.moveClients(nextClients.map(function(_a2) {
      var clientX = _a2.clientX, clientY = _a2.clientY;
      return {
        clientX: clientX + deltaX,
        clientY: clientY + deltaY,
        originalClientX: clientX,
        originalClientY: clientY
      };
    }), inputEvent, true);
  };
  Gesto2.prototype.triggerDragStart = function(e) {
    this.onDragStart(e, false);
  };
  Gesto2.prototype.setEventData = function(data) {
    var currentData = this.data;
    for (var name_1 in data) {
      currentData[name_1] = data[name_1];
    }
    return this;
  };
  Gesto2.prototype.setEventDatas = function(data) {
    return this.setEventData(data);
  };
  Gesto2.prototype.getCurrentEvent = function(inputEvent) {
    if (inputEvent === void 0) {
      inputEvent = this._prevInputEvent;
    }
    return __assign(__assign({ data: this.data, datas: this.data }, this._getPosition()), { movement: this.getMovement(), isDrag: this.isDrag, isPinch: this.isPinch, isScroll: false, inputEvent });
  };
  Gesto2.prototype.getEventData = function() {
    return this.data;
  };
  Gesto2.prototype.getEventDatas = function() {
    return this.data;
  };
  Gesto2.prototype.unset = function() {
    var _this = this;
    var targets = this.targets;
    var container = this.options.container;
    this.off();
    removeEvent(this._window, "blur", this.onBlur);
    if (this._useDrag) {
      targets.forEach(function(el) {
        removeEvent(el, "dragstart", _this.onDragStart);
      });
    }
    if (this._useMouse) {
      targets.forEach(function(target) {
        removeEvent(target, "mousedown", _this.onDragStart);
      });
      removeEvent(container, "contextmenu", this._onContextMenu);
    }
    if (this._useTouch) {
      targets.forEach(function(target) {
        removeEvent(target, "touchstart", _this.onDragStart);
      });
      removeEvent(container, "touchstart", this.onDragStart);
    }
    this._prevInputEvent = null;
    this._allowClickEvent();
    this._dettachDragEvent();
  };
  Gesto2.prototype.onPinchStart = function(e) {
    var _this = this;
    var pinchThreshold = this.options.pinchThreshold;
    if (this.isDrag && this.getMovement() > pinchThreshold) {
      return;
    }
    var store = new ClientStore(getEventClients(e));
    this.pinchFlag = true;
    this._addStore(store);
    var result = this.emit("pinchStart", __assign(__assign({ data: this.data, datas: this.data, angle: store.getAngle(), touches: this.getCurrentStore().getPositions() }, store.getPosition()), { inputEvent: e, isTrusted: this._isTrusted, preventDefault: function() {
      e.preventDefault();
    }, preventDrag: function() {
      _this._dragFlag = false;
    } }));
    if (result === false) {
      this.pinchFlag = false;
    }
  };
  Gesto2.prototype.onPinch = function(e, clients) {
    if (!this.flag || !this.pinchFlag || clients.length < 2) {
      return;
    }
    var store = this.getCurrentStore();
    this.isPinch = true;
    this.emit("pinch", __assign(__assign({ data: this.data, datas: this.data, movement: this.getMovement(clients), angle: store.getAngle(clients), rotation: store.getRotation(clients), touches: store.getPositions(clients), scale: store.getScale(clients), distance: store.getDistance(clients) }, store.getPosition(clients)), { inputEvent: e, isTrusted: this._isTrusted }));
  };
  Gesto2.prototype.onPinchEnd = function(e) {
    if (!this.pinchFlag) {
      return;
    }
    var isPinch = this.isPinch;
    this.isPinch = false;
    this.pinchFlag = false;
    var store = this.getCurrentStore();
    this.emit("pinchEnd", __assign(__assign({ data: this.data, datas: this.data, isPinch, touches: store.getPositions() }, store.getPosition()), { inputEvent: e }));
  };
  Gesto2.prototype.getCurrentStore = function() {
    return this.clientStores[0];
  };
  Gesto2.prototype.moveClients = function(clients, inputEvent, isAdd) {
    var position = this._getPosition(clients, isAdd);
    var isPrevDrag = this.isDrag;
    if (position.deltaX || position.deltaY) {
      this.isDrag = true;
    }
    var isFirstDrag = false;
    if (!isPrevDrag && this.isDrag) {
      isFirstDrag = true;
    }
    return __assign(__assign({ data: this.data, datas: this.data }, position), { movement: this.getMovement(clients), isDrag: this.isDrag, isPinch: this.isPinch, isScroll: false, isMouseEvent: this._isMouseEvent, isSecondaryButton: this._isSecondaryButton, inputEvent, isTrusted: this._isTrusted, isFirstDrag });
  };
  Gesto2.prototype._addStore = function(store) {
    this.clientStores.splice(0, 0, store);
  };
  Gesto2.prototype._getPosition = function(clients, isAdd) {
    var store = this.getCurrentStore();
    var position = store.getPosition(clients, isAdd);
    var _a = this.clientStores.slice(1).reduce(function(prev, cur) {
      var storePosition = cur.getPosition();
      prev.distX += storePosition.distX;
      prev.distY += storePosition.distY;
      return prev;
    }, position), distX = _a.distX, distY = _a.distY;
    return __assign(__assign({}, position), { distX, distY });
  };
  Gesto2.prototype._attchDragEvent = function() {
    var win = this._window;
    var container = this.options.container;
    var passive = {
      passive: false
    };
    if (this._isDragAPI) {
      addEvent(container, "dragover", this.onDrag, passive);
      addEvent(win, "dragend", this.onDragEnd);
    }
    if (this._useMouse) {
      addEvent(container, "mousemove", this.onDrag);
      addEvent(win, "mouseup", this.onDragEnd);
    }
    if (this._useTouch) {
      addEvent(container, "touchmove", this.onDrag, passive);
      addEvent(win, "touchend", this.onDragEnd, passive);
      addEvent(win, "touchcancel", this.onDragEnd, passive);
    }
  };
  Gesto2.prototype._dettachDragEvent = function() {
    var win = this._window;
    var container = this.options.container;
    if (this._isDragAPI) {
      removeEvent(container, "dragover", this.onDrag);
      removeEvent(win, "dragend", this.onDragEnd);
    }
    if (this._useMouse) {
      removeEvent(container, "mousemove", this.onDrag);
      removeEvent(win, "mouseup", this.onDragEnd);
    }
    if (this._useTouch) {
      removeEvent(container, "touchstart", this.onDragStart);
      removeEvent(container, "touchmove", this.onDrag);
      removeEvent(win, "touchend", this.onDragEnd);
      removeEvent(win, "touchcancel", this.onDragEnd);
    }
  };
  Gesto2.prototype._allowMouseEvent = function() {
    this._preventMouseEvent = false;
    clearTimeout(this._preventMouseEventId);
  };
  return Gesto2;
})(EventEmitter);
export {
  Gesto as G
};
