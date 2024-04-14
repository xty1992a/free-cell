import * as types from '@/types'
import {Poker} from './poker.ts'
import {Table} from './table.ts'

export class Tracker implements types.ITracker {
    public items: Poker[] = []
    public index: number
    public table: Table
    get label() {
        return `${this.index+1}号轨道`
    }
    constructor(option: {index: number, table: Table}) {
        this.index = option.index
        this.table = option.table
    }

    last() {
        return this.items[this.items.length - 1]
    }

    /**
     * @description 将牌推入到轨道中
     * */
    push(poker: types.IPoker): boolean {
        const ok = this.canPush(poker)

        if (!ok)             return false

        this.add(this.table.take(poker))
        return true
    }

    canPush(poker: types.IPoker): boolean {
        const last = this.last()

        const ok = !last || last.canFollowWith(poker)

        return ok
    }

    remove(poker: types.IPoker) {
        this.items = this.items.filter(item => item.key !== poker.key)
    }

    seek(poker: Poker): boolean {
        if (poker.belong!==this) return false
        const tails = this.items.slice(this.items.indexOf(poker))

        const trackers = this.table.trackers.filter(tracker => tracker !== this)
        const tracker = trackers.find(tracker => tracker.canPush(poker))
        console.log(`序列${tails.map(n => n.label)}尝试移动到${tracker?.label??''} ${tracker?'成功':'失败'}`, )
        if (!tracker) return false

        tails.forEach(item => tracker.add(item))
        this.table.dirty()

        return true
    }

    add(poker: Poker) {
        poker.belong?.remove(poker)
        poker.belong = this
        this.items.push(poker)
    }
}