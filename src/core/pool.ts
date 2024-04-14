import * as types from '@/types'
import {Poker} from "./poker.ts";
import {Table} from "@/core/table.ts";

export class Pool implements types.IPool{
    public items: Poker[] = []
    public index: number

    public table: Table
    get label() {
        return `${this.index+1}号收纳池`
    }
    constructor(option: {index: number, table: Table}) {
        this.index = option.index
        this.table = option.table
    }

    last() {
        return this.items[this.items.length - 1]
    }

    push(poker: types.IPoker): boolean {
        const last = this.last()

        const ok = (() => {
            // 如果有最后一张牌，那么这张牌必须能够跟随最后一张牌
            if (last) {
                return last.canCollectWith(poker)
            }
            // 否则这张牌必须是A
            else {
                return poker.value === 'A'
            }
        })()

        if (!ok) return false

        this.add(this.table.take(poker))
        return true
    }

    remove(poker: types.IPoker) {
        this.items = this.items.filter(item => item.key !== poker.key)
    }

    add(poker: Poker) {
        poker.belong?.remove(poker)
        poker.belong = this
        this.items.push(poker)
    }

}