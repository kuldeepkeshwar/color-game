import { Table } from  './table';
import { Row } from './row';
import { Cell } from './cell';
import { Observable, Subject } from "rxjs";
import { Util } from "./util";
export class GameState {
    //state:number; //0 - on ,1--win,-1--loose
    constructor(private pendingChange: number, private state: number) { }
}
export class Game {
    public grid: Table;
    private chance: number;
    private activeCells: Array<Cell>;
    private timerId: number;
    private chanceFinish: Subject<GameState>;
    private finish: Subject<GameState>;
    private state: GameState;
    constructor(private size: number, private time: number, private chances: number, private minCells: number) {
        this.validate();
        this.init();
    }
    public start() {
        if (!this.state) {
            this.state = new GameState(this.chance, 0);
            this.chance = this.chance - 1;
            this.colorCells();
            this.startTimer();
        }
    }
    public continue() {
        clearTimeout(this.timerId);
        this.resetBoard();
        this.startTimer();
    }
    public unColorCell(cell: Cell) {
        if (cell.data.state!==0) {
            cell.data.state = 1;
        }

        let colorCount=this.activeCells.filter(cell => cell.data.state===-1).length;
        if(colorCount===0){
            this.finish.next(new GameState(this.chance, 1));
            this.stop();
        }
    }
    public stop() {
        clearTimeout(this.timerId);
        this.chanceFinish.complete();
        this.finish.complete();
    }
    public onChanceFinish(): Observable<GameState> {
        return this.chanceFinish;
    }
    public onFinish(): Observable<GameState> {
        return this.finish;
    }
    private resetBoard() {
        this.chance = this.chance - 1;
        let totoalCells=this.size*this.size;
        //reset game board by comsuming current state and produce a new state
        // get all active cell index, ask for new cells, reset and remove unColored Cells ,add new cells
        let _obj=this.activeCells.reduce((obj,cell)=>{
            obj.active.push(cell.data.index-1);
            if(cell.data.state === 1){
                if(obj.unColorCount>=totoalCells-this.activeCells.length){//edge case
                    cell.data.state=-1;
                    obj.colorCell.push(cell);

                }else{
                    obj.unColorCount++;
                    cell.data.state=0;
                }
                
            }else{
                obj.colorCell.push(cell);
            }
            return obj;
        },{
            active:[],
            unColorCount:0,
            colorCell:[]
        });
        
        let newIndexs = Util.randomNumberWithExcludes(0, totoalCells - 1, _obj.unColorCount, _obj.active);
        this.activeCells=_obj.colorCell.concat(newIndexs.map((index) => {
             let cell = this.grid.getCellByIndex(index);
             cell.data.state = -1;
             return cell;
        }));

    } 
    private colorCells() {
        let indexs: Array<number> = Util.randomNumberWithExcludes(0, this.size * this.size - 1, this.minCells, []);
        this.activeCells=indexs.map((index) => {
            let cell = this.grid.getCellByIndex(index);
            cell.data.state = -1; //coloring cell
            return cell;
        });
    }
    private startTimer() {
        this.timerId = setTimeout(() => {
            // check game status and emit game status
            let unColorCellCount = this.activeCells.filter(cell => cell.data.state === 1).length;
            if (unColorCellCount < this.minCells) {
                if (this.chance > 0) {
                    //give another chance
                    this.chanceFinish.next(new GameState(this.chance, 0));
                } else {
                    // lost
                    this.finish.next(new GameState(this.chance, -1));
                    this.stop();
                }
            } else {
                //emit win state
                this.finish.next(new GameState(this.chance, 1));
                this.stop();
            }

        }, 1000 * this.time);
        return this.timerId;
    }
    private init() {
        this.grid = new Table();
        for (let i = 0; i < this.size; i++) {
            let row: Row = new Row();
            for (let j = 0; j < this.size; j++) {
                let cell = new Cell({ state: 0, index: (i * this.size) + j + 1 });
                row.addCell(cell);
            }
            this.grid.addRow(row);
        }
        this.chance = this.chances;
        this.chanceFinish = new Subject<GameState>();
        this.finish = new Subject<GameState>();

    }
    private validate(){
        if(this.time<=0){
            throw new Error("time should be greater than 0");
        }
        if(this.chances<=0){
            throw new Error("chances should be greater than 0");
        }
        if(this.size<=0){
            throw new Error("size should be greater than 0");
        }
        if(this.minCells<=0){
            throw new Error("minCells should be greater than 0");
        }
        if(this.minCells>this.size*this.size){
            throw new Error("minCells should be less than size*size");
        }
    }
}