const lodash = require('lodash');
const xlsx = require('xlsx');
const assert = require('assert');
const fs = require('fs');

/* eslint-disable class-methods-use-this */
class BaseFileHelper {
  /**
   * {a: 1, b: {a:1}} ===> ['a', 'b.a']
   * @param object
   * @returns {Array}
   */
  convertKeys(object) {
    let keys = [];
    lodash.forIn(object, (value, key) => {
      if (lodash.isObject(value) && !lodash.isArray(value)) {
        keys = keys.concat(this.convertKeys(value).map(item => `${key}.${item}`));
      } else {
        keys.push(key);
      }
    });
    return keys;
  }

  /**
   * { a: 1, b: { a: 2 } } ===> { a: 1, b.a: 2 }
   * @param object
   */
  convertObject(object) {
    if (!lodash.isObject(object)) {
      return object;
    }
    const keys = this.convertKeys(object);
    const newObject = {};
    keys.forEach((key) => {
      newObject[key] = lodash.get(object, key);
    });
    return newObject;
  }

  /**
   * convert item by a item map
   * @param items
   * @param itemMap
   * @returns {*}
   */
  mapItems(items, itemMap) {
    if (lodash.isPlainObject(itemMap) && !lodash.isEmpty(itemMap)) {
      const keys = lodash.keys(itemMap);
      items = items.map((item) => {
        const v = {};
        keys.forEach((key) => {
          const value = lodash.get(item, key);
          v[itemMap[key]] = lodash.isNil(value) ? '' : value;
        });
        return v;
      });
    } else if (lodash.isArray(itemMap) && !lodash.isEmpty(itemMap)) {
      items = items.map(item => lodash.pick(item, itemMap));
    } else {
      items = items.map(item => this.convertObject(JSON.parse(JSON.stringify(item))));
    }
    return items;
  }

  /**
   * file or buffer to object
   * @param data
   * @param itemMap
   */
  parse(data, itemMap) {
    let object;
    if (Buffer.isBuffer(data)) {
      object = this.toObject(data, itemMap);
    } else if (fs.existsSync(data)) {
      object = this.toObject(fs.readFileSync(data), itemMap);
    } else {
      assert.fail('unknown data type or file not exists');
    }
    return object;
  }

  /**
   * object to buffer
   * @param items
   * @param itemMap
   * @returns {*}
   */
  dump(items, itemMap) {
    items = this.mapItems(items, itemMap);
    return this.toBuffer(items);
  }

  /**
   * save data to file
   * @param items
   * @param itemMap
   * @returns {*}
   */
  saveToFile(items, itemMap, filePath) {
    items = this.mapItems(items, itemMap);
    return this.toFile(items, filePath);
  }
}

class XlsxFileHelper extends BaseFileHelper {
  getWorkBook(items) {
    const wb = xlsx.utils.book_new();
    const sheet = xlsx.utils.json_to_sheet(items);
    xlsx.utils.book_append_sheet(wb, sheet);
    return wb;
  }

  toBuffer(items) {
    const wb = this.getWorkBook(items);
    return xlsx.write(wb, { type: 'buffer' });
  }

  toFile(items, filePath) {
    const wb = this.getWorkBook(items);
    xlsx.writeFile(wb, filePath);
  }

  toObject(buffer, itemMap) {
    const wb = xlsx.read(buffer);
    let items = xlsx.utils.sheet_to_json(wb.Sheets.Sheet1, { raw: false });
    if (lodash.isArray(itemMap) && !lodash.isEmpty(itemMap)) {
      items = items.map(item => lodash.pick(item, itemMap));
    } else if (lodash.isPlainObject(itemMap) && !lodash.isEmpty(itemMap)) {
      const keys = lodash.keys(itemMap);
      items = items.map((item) => {
        const v = {};
        keys.forEach((key) => {
          v[key] = item[itemMap[key]];
        });
        return v;
      });
    }
    return items;
  }
}

module.exports = {
  XlsxFileHelper,
};
