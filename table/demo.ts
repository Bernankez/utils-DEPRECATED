import { merge } from "@/index";

const originData = [
  { companyName: "测试", item: "dff" },
  { companyName: "测试", item: "dff" },
  { companyName: "测试", item: "dff" },
  { companyName: "测试", item: "dff1" },
  { companyName: "测试", item: "dff1" },
  { companyName: "测试", item: "dff" },
  { companyName: "测试", item: "dff2" },
  { companyName: "测试", item: "dff2" },
  { companyName: "测试", item: "dff2" },
  { companyName: "测试", item: "dff" },
  { companyName: "测试y", item: "dff" },
  { companyName: "测试y", item: "dff" },
  { companyName: "测试e", item: "dff" },
  { companyName: "测试e", item: "dff" },
  { companyName: "测试e", item: "dff" },
];

/** 结合el-table span-method合并方法 */
export function testElMerge({ row, column, rowIndex, columnIndex }) {
  let result = merge(
    [
      { field: "companyName", colIndex: 0 },
      { field: "companyName", colIndex: 1 },
      {
        field: "item",
        colIndex: 2,
        customRule: (currentRule, currentTableDataIndex, tableData) => {
          let current = tableData[currentTableDataIndex];
          let last = tableData[currentTableDataIndex - 1];
          if (current.item === last.item && current.companyName === last.companyName) {
            return true;
          }
          return false;
        },
      },
    ],
    originData
  );
  for (let i = 0; i < result.length; i++) {
    if (result[i].colIndex === columnIndex) {
      const row = result[i].rowSpan[rowIndex];
      const col = row > 0 ? 1 : 0;
      return [row, col];
    }
  }
}
