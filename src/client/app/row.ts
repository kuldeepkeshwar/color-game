import { Cell } from "./cell";
export class Row {
    cells: Array<Cell> = [];
    addCell(_cell: Cell) {
        this.cells.push(_cell);
    }
    getCell(y: number) {
        return this.cells[y];
    }
    getCells() {
        return this.cells;
    }
}