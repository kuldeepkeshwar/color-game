import { Row } from "./row";
export class Table {
    rows: Array<Row> = [];
    addRow(_row: Row) {
        this.rows.push(_row);
    }
    getCell(x: number, y: number) {
        return this.rows[x].getCell(y);
    }
    getRows() {
        return this.rows;
    }
    getCellByIndex(n: number) {
        let l=this.rows.length;
        let x=Math.floor(n/l);
        let y=n%l;
        return this.rows[x].getCell(y);
    }
}