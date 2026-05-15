const clipboardEvents = ["onCopy", "onCut", "onPaste"];
const compositionEvents = [
  "onCompositionEnd",
  "onCompositionStart",
  "onCompositionUpdate"
];
const focusEvents = ["onFocus", "onBlur"];
const formEvents = ["onInput", "onInvalid", "onReset", "onSubmit"];
const imageEvents = ["onLoad", "onError"];
const keyboardEvents = ["onKeyDown", "onKeyPress", "onKeyUp"];
const mediaEvents = [
  "onAbort",
  "onCanPlay",
  "onCanPlayThrough",
  "onDurationChange",
  "onEmptied",
  "onEncrypted",
  "onEnded",
  "onError",
  "onLoadedData",
  "onLoadedMetadata",
  "onLoadStart",
  "onPause",
  "onPlay",
  "onPlaying",
  "onProgress",
  "onRateChange",
  "onSeeked",
  "onSeeking",
  "onStalled",
  "onSuspend",
  "onTimeUpdate",
  "onVolumeChange",
  "onWaiting"
];
const mouseEvents = [
  "onClick",
  "onContextMenu",
  "onDoubleClick",
  "onMouseDown",
  "onMouseEnter",
  "onMouseLeave",
  "onMouseMove",
  "onMouseOut",
  "onMouseOver",
  "onMouseUp"
];
const dragEvents = [
  "onDrag",
  "onDragEnd",
  "onDragEnter",
  "onDragExit",
  "onDragLeave",
  "onDragOver",
  "onDragStart",
  "onDrop"
];
const selectionEvents = ["onSelect"];
const touchEvents = ["onTouchCancel", "onTouchEnd", "onTouchMove", "onTouchStart"];
const pointerEvents = [
  "onPointerDown",
  "onPointerMove",
  "onPointerUp",
  "onPointerCancel",
  "onGotPointerCapture",
  "onLostPointerCapture",
  "onPointerEnter",
  "onPointerLeave",
  "onPointerOver",
  "onPointerOut"
];
const uiEvents = ["onScroll"];
const wheelEvents = ["onWheel"];
const animationEvents = [
  "onAnimationStart",
  "onAnimationEnd",
  "onAnimationIteration"
];
const transitionEvents = ["onTransitionEnd"];
const otherEvents = ["onToggle"];
const changeEvents = ["onChange"];
const allEvents = [
  ...clipboardEvents,
  ...compositionEvents,
  ...focusEvents,
  ...formEvents,
  ...imageEvents,
  ...keyboardEvents,
  ...mediaEvents,
  ...mouseEvents,
  ...dragEvents,
  ...selectionEvents,
  ...touchEvents,
  ...pointerEvents,
  ...uiEvents,
  ...wheelEvents,
  ...animationEvents,
  ...transitionEvents,
  ...changeEvents,
  ...otherEvents
];
function makeEventProps(props, getArgs) {
  const eventProps = {};
  for (const eventName of allEvents) {
    const eventHandler = props[eventName];
    if (!eventHandler) {
      continue;
    }
    if (getArgs) {
      eventProps[eventName] = ((event) => eventHandler(event, getArgs(eventName)));
    } else {
      eventProps[eventName] = eventHandler;
    }
  }
  return eventProps;
}
export {
  makeEventProps as m
};
