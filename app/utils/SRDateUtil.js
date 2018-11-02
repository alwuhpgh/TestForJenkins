import moment from 'moment';

class SRDateUtil {
  // 时间转换成字符串
  static stringFromDate(date) {
    return moment(date).format('YYYY-MM-DD');
  }
  // 字符串转换成时间
  static dateFromString(string) {
    return moment(string, 'YYYY-MM-DD');
  }

  // 时间加n天
  static dateStringAddDay(dateString, addDay) {
    let date = this.dateFromString(dateString);
    date += addDay * 24 * 60 * 60 * 1000;
    return this.stringFromDate(date);
  }
}
module.exports = SRDateUtil;