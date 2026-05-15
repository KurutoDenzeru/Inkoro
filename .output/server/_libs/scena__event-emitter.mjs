import { A as isObject, l as findIndex } from "./daybrush__utils.mjs";
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
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
  return r;
}
var EventEmitter = /* @__PURE__ */ (function() {
  function EventEmitter2() {
    this._events = {};
  }
  var __proto = EventEmitter2.prototype;
  __proto.on = function(eventName, listener) {
    if (isObject(eventName)) {
      for (var name in eventName) {
        this.on(name, eventName[name]);
      }
    } else {
      this._addEvent(eventName, listener, {});
    }
    return this;
  };
  __proto.off = function(eventName, listener) {
    if (!eventName) {
      this._events = {};
    } else if (isObject(eventName)) {
      for (var name in eventName) {
        this.off(name);
      }
    } else if (!listener) {
      this._events[eventName] = [];
    } else {
      var events = this._events[eventName];
      if (events) {
        var index = findIndex(events, function(e) {
          return e.listener === listener;
        });
        if (index > -1) {
          events.splice(index, 1);
        }
      }
    }
    return this;
  };
  __proto.once = function(eventName, listener) {
    var _this = this;
    if (listener) {
      this._addEvent(eventName, listener, {
        once: true
      });
    }
    return new Promise(function(resolve) {
      _this._addEvent(eventName, resolve, {
        once: true
      });
    });
  };
  __proto.emit = function(eventName, param) {
    var _this = this;
    if (param === void 0) {
      param = {};
    }
    var events = this._events[eventName];
    if (!eventName || !events) {
      return true;
    }
    var isStop = false;
    param.eventType = eventName;
    param.stop = function() {
      isStop = true;
    };
    param.currentTarget = this;
    __spreadArrays(events).forEach(function(info) {
      info.listener(param);
      if (info.once) {
        _this.off(eventName, info.listener);
      }
    });
    return !isStop;
  };
  __proto.trigger = function(eventName, param) {
    if (param === void 0) {
      param = {};
    }
    return this.emit(eventName, param);
  };
  __proto._addEvent = function(eventName, listener, options) {
    var events = this._events;
    events[eventName] = events[eventName] || [];
    var listeners = events[eventName];
    listeners.push(__assign({
      listener
    }, options));
  };
  return EventEmitter2;
})();
export {
  EventEmitter as E
};
