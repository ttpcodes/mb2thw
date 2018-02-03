class Util {
  static get japanese() {
    return /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
  }

  static filterDuplicates(array) {
    return array.filter((value, index) => array.indexOf(value) === index);
  }

  static parseTime(time, recur) {
    time = Math.floor(time);
    let timeString = "";
    timeString = time % 60 < 10 ? "0" + time % 60 + timeString : time % 60 + timeString;
    if (time / 60 < 1 && !recur) {
        return "0:" + timeString;
    } else if (time / 60 < 1) {
        return timeString;
    } else {
        return Util.parseTime(time / 60, true) + ":" + timeString;
    }
  }
}

module.exports = Util;
