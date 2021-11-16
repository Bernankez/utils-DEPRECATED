import { clone } from "@/index";

const _this = this;

export interface Rule<R, T> {
  field: string;
  customRule?: (currentRule: R, currentTableDataIndex: number, tableData: T[]) => boolean;
  [k: string]: unknown;
}

/**
 * 默认上下两行相同的field会被合并，也可自定合并规则
 * @param rules
 * @param tableData
 * @returns
 */
export function merge<R extends Rule<R, T>, T>(rules: R[], tableData: T[]) {
  // 行合并数组
  let rowSpan: number[][] = rules.map(() => []);
  // 当前位置
  let pointer: number[] = new Array(rules.length).fill(0);
  tableData.forEach((data, dataIndex, dataOrigin) => {
    if (dataIndex === 0) {
      // 初始化
      rowSpan.forEach(rowArr => {
        rowArr.push(1);
      });
    } else {
      rules.forEach((rule, ruleIndex) => {
        // 字段名
        let field = rule.field;
        let canMerge: boolean;
        if (typeof rule.customRule === "function") {
          // 自定义规则
          // 该项能否与上一项合并
          canMerge = rule.customRule.call(_this, rule, dataIndex, tableData);
        } else {
          // 比较本条数据中该字段与上条数据该字段
          canMerge = data[field] === dataOrigin[dataIndex - 1][field];
        }
        if (canMerge) {
          // 合并的行数加一，初始化下一行
          rowSpan[ruleIndex][pointer[ruleIndex]] += 1;
          rowSpan[ruleIndex].push(0);
        } else {
          // 初始化下一行，移动当前位置
          rowSpan[ruleIndex].push(1);
          pointer[ruleIndex] = dataIndex;
        }
      });
    }
  });
  return rules.map((rule, ruleIndex) => {
    return { ...clone(rule), rowSpan: rowSpan[ruleIndex] };
  });
}

/**
 * 获取某行根据rules合并的行数据
 * @param row
 * @param rule
 * @param tableData
 * @param deep
 * @returns
 */
export function getNearbyMerged<R extends Rule<R, T>, T>(row: T, rule: R, tableData: T[], deep = false): T[] {
  // 当前数据的index
  const rowIndex = tableData.indexOf(row);
  if (rowIndex > -1) {
    let result = merge([rule], tableData);
    // 当前数据合并的行数
    const rowSpan = result[0].rowSpan[rowIndex];
    return clone(tableData.slice(rowIndex + 1, rowIndex + rowSpan), deep);
  }
  return [];
}
