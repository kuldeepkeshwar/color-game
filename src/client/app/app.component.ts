import {Component, OnInit} from '@angular/core';

import { Cell } from './cell';
import { Game, GameState } from './game';

@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
    private showChanceResult = false;
    private showGameResult = false;
    private showGameBoard = false;
    private showSettingBoard = false;
    private state: GameState;
    private game: Game;
    private size: number;
    private time: number;
    private chances: number;
    private minCells: number;

    private isStarted:boolean=false;
    public ngOnInit() {
        this.size = 5;
        this.time = 4;
        this.chances = 3;
        this.minCells = 5;
        this.init();
    }
    public selectCell(cell: Cell) {
        this.game.unColorCell(cell);
    }
    public start() {
        this.isStarted=true;
        this.game.start();
        this.showSettingBoard=false;
        this.showChanceResult = false;
        this.showGameResult = false;
        this.showGameBoard = true;
    }
    public newGame(){
        this.game.stop();
        this.init();
        this.start();
    }
    public continueGame() {
        this.game.continue();
        this.showSettingBoard=false;
        this.showChanceResult = false;
        this.showGameResult = false;
        this.showGameBoard = true;
    }
    public showSetting(){
        this.showSettingBoard=true;
        this.showChanceResult = false;
        this.showGameResult = false;
        this.showGameBoard = false;
    }
    private init(){
        this.game = new Game(this.size, this.time, this.chances, this.minCells);
        this.showGameBoard = true;
        let unSubscribeChance=this.game.onChanceFinish().subscribe((state) => {
            this.state = state;

            this.showChanceResult = true;
            this.showSettingBoard=false;
            this.showGameResult = false;
            this.showGameBoard = false;
        });
        let unSubscribeFinish=this.game.onFinish().subscribe((state) => {
            this.state = state;
            this.showChanceResult = false;
            this.showGameResult = true;
            this.showGameBoard = false;
            this.showSettingBoard=false;
            unSubscribeChance.unsubscribe();
            unSubscribeFinish.unsubscribe();
        });
    }
}
