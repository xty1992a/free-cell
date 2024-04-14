import * as types from '@/types'
import {Poker} from "./poker.ts";
import {Table} from "@/core/table.ts";

export class Cell implements types.ICell {
    public items: Poker[] = []
    public index: number
    public table: Table
    get label() {
        return `${this.index+1}号空格区`
    }
    constructor(option: { index: number, table: Table }) {
        this.index = option.index
        this.table = option.table
    }

    last() {
        return this.items[this.items.length - 1]
    }

    add(poker: Poker) {
        poker.belong?.remove(poker)
        poker.belong = this
        this.items.push(poker)
    }

    remove(poker: types.IPoker) {
        this.items = this.items.filter(item => item.key !== poker.key)
    }


    push(poker: types.IPoker): boolean {

        if (this.items.length) return false
        this.add(this.table.take(poker))
        return true
    }
}