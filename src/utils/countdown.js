export function countdown(duration, onTick, onComplete) {
  let secondsLeft = Math.round(duration),
    tick = function () {
      if (secondsLeft > 0) {
        onTick(secondsLeft);
        secondsLeft -= 1;
      } else {
        clearInterval(interval);
        onComplete();
      }
    },
    // Setting the interval, by call tick and passing through this via a self-calling function wrap.
    interval = setInterval(
      (function (self) {
        return function () {
          tick.call(self);
        };
      })(this), 1000
    );

  // First tick.
  tick.call(this);

  return {
    abort: function() {
      clearInterval(interval);
    },
    getRemainingTime: function() {
      return secondsLeft;
    }
  };
}

export default countdown;
