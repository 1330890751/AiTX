import * as _ from 'lodash';
import * as Moment from 'moment';

/**
 * 工具类-与服务、组件等没有任何关系
 *
 * @export
 */
export class CommonUtil {
  /**
   * 获取年份下拉的列表
   */
  static getYearList() {
    const current = Moment().year();
    const maxYear = current + 5;
    const minYear = current - 10;
    const years = [];
    for (let i = maxYear; i >= minYear; i--) {
      years.push({ text: `${i}`, value: i });
    }
    return _.cloneDeep(years);
  }

  /**
   * 格式头像
   */
  static formatAvatar(src) {
    if (src && src.indexOf('http') >= 0) {
      return src;
    }
    if (src && src.indexOf('../') >= 0) {
      return 'assets/img/avatar.png';
    }
    return 'assets/img/avatar.png';
  }

  /**
   * 判断正浮点数
   */
  static CheckFloat(num) {
    // 正浮点数
    const reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
    if (reg.test(num) === false) {
      return false;
    } else if (num === 0) {
      return false;
    } else if (num.length > 6) {
      return false;
    }
    return true;
  }

  /**
   * @desc 将一维数组转换成二维数组
   * @params {array} sourceArray 源数组
   * @params {number} step 步长，分割的单位
   * demo: transToTwoDimensional([1,2,3,4,5], 3) ==> [[1,2,3],[4,5,6]]
   */
  static transToTwoDimensional(sourceArray, step) {
    sourceArray = [...sourceArray];
    const count = sourceArray.length;
    // modules是一个二维数组
    const modules = Array.from({ length: count / step }).map(() => []);
    sourceArray.forEach((m, i) => {
      modules[Math.floor(i / step)].push(m);
    });
    return modules;
  }

  /**
   * 根据value值 获取下拉列表的 text
   * @param value  当前的值
   * @param list  下拉列表
   */
  static getTextByValue(value = '', list = []) {
    let text = '';
    const item = list.find((item) => item.value === value);
    if (item) text = item.text;
    return text;
  }

  static getQueryString(name) {
    const result = location.href.match(new RegExp('[?&]' + name + '=([^&]+)', 'i'));
    if (result == null || result.length < 1) {
      return '';
    }
    return result[1];
  }
}
