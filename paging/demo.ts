import { Paging } from "./index";

export function testPaging() {
  const originData = [
    { name: "aaa", age: 14 },
    { name: "bbb", age: 15 },
    { name: "ccc", age: 4 },
    { name: "ddd", age: 52 },
    { name: "eee", age: 32 },
    { name: "fff", age: 34 },
    { name: "ggg", age: 63 },
  ];

  const dataPaging = new Paging();
  dataPaging.set(originData);

  const tablePaging = dataPaging.getByPaging(1, 5);

  console.log(tablePaging);
}
