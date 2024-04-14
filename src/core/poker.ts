import * as types from '@/types'
import * as _ from 'lodash'
import {Tracker} from './tracker.ts'
import {Pool} from "@/core/pool.ts";
import {Table} from "@/core/table.ts";
import {Cell} from "@/core/cell.ts";

export class Poker implements types.IPoker {
    // 牌面数值（A-2-3-...-K）
    public value: types.IPoker['value']
    // 系列（黑桃:spade、红桃:heart、方片:diamond、草花:club）
    public series: types.ISeries
    public table: Table

    get label() {
        const seriesName = ({
            spade: '♠️',
            heart: '♥️',
            diamond: '♦️',
            club: '♣️'
        } as const)[this.series]
        return `${seriesName}-${this.value}`
    }

    /**
     * @description 所属的容器
     * */
    public belong: Tracker | Pool | Cell | null = null

    /**
     * @description 牌的唯一标识
     * */
    public get key() {
        return `${this.series}-${this.value}`
    }

    /**
     * @description 牌的颜色
     * */
    public get color() {
        return ['spade', 'club'].includes(this.series) ? 'black' : 'red'
    }

    /**
     * @description 牌的在系列中的索引
     * */
    public get index() {
        return Poker.pool.indexOf(this.value) + 1
    }

    // 数值（A-2-3-...-K）
    static pool = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const
    // 系列（黑桃:spade、红桃:heart、方片:diamond、草花:club）
    static series = ['spade', 'heart', 'diamond', 'club'] as const

    // 洗牌
    static shuffle(option: { table: Table }) {
        const pokers = Poker.pool.map(value => this.series.map(series => new Poker({
            poker: {value, series},
            table: option.table
        })))
        return _.shuffle(pokers.flat())
    }

    constructor(option: { poker: types.ILamePoker, table: Table }) {
        this.table = option.table
        this.value = option.poker.value
        this.series = option.poker.series
    }

    /**
     * @description 能否让某张牌跟随（我是♦️7，只收♣️6或则♠️6）
     * 1. 颜色不同
     * 2. 索引值比跟随的牌大1
     * */
    public canFollowWith(poker: types.IPoker) {
        if (this.color === poker.color) return false
        return this.index - 1 === poker.index
    }

    /**
     * @description 能否收集某张牌（我是♥️A，只收♥️2）
     * 1. 系列相同
     * 2. 索引值比对比牌小1
     * */
    public canCollectWith(poker: types.IPoker) {
        if (this.series !== poker.series) return false
        // 索引值比对比牌小1
        return this.index + 1 === poker.index
    }

    get isLast() {
        return this.belong?.last() === this
    }

    get isLeader() {
        if (!this.belong) return false
        if (!(this.belong instanceof Tracker)) return false
        const tails = this.belong.items.slice(this.belong.items.indexOf(this))



        const ok = tails.every((item, index) => {
            const next = tails[index + 1]
            if (!next) return true
            return item.canFollowWith(next)
        })

        ok && console.log('领头牌', tails.map(n => n.label).join(' > '))

        return ok
        // while (tails.length) {
        //     // 弹出每一张牌
        //     const tail = tails.shift()!
        //     if (!tail) return false
        //     const next = tails[0]
        //     if (!next) return tail === this
        //     console.log('比较', tail, next, tail.canFollowWith(next))
        //     if (!tail.canFollowWith(next)) return false
        // }
        // return true
    }

    /**
     * @description 移动到某个容器
     * */
    public seek(): boolean {
        if (!this.belong) return false

        const { isLast, isLeader} = this

        if (isLast) return this.table.seek(this)

        if ((this.belong instanceof Tracker) && isLeader) {
            console.log(`${this.label}是领头牌，尝试移动到其他轨道`)
            return this.belong.seek(this)
        }

        return false
    }
}