import {Tracker} from './tracker.ts'
import {Poker} from './poker.ts'
import {Pool} from "./pool.ts";
import {Cell} from "@/core/cell.ts";
import * as types from '@/types'
import {TinyEmitter} from 'tiny-emitter'

export class Table extends TinyEmitter {
    public trackers: Tracker[] = []
    public pools: Pool[] = []
    public cells: Cell[] = []

    get pokers(): Poker[] {
        return [
            ...this.trackers.map(tracker => tracker.items),
            ...this.pools.map(pool => pool.items),
            ...this.cells.map(cell => cell.items)
        ].flat()
    }

    take(poker: types.IPoker): Poker {
        return this.pokers.find(item => item.key === poker.key)!
    }

    static start() {
        const table = new Table()

        table.trackers = Array.from({length: 8}, (_, index) => new Tracker({index, table}))
        table.pools = Array.from({length: 4}, (_, index) => new Pool({index, table}))
        table.cells = Array.from({length: 4}, (_, index) => new Cell({index, table}))
        const pokers = Poker.shuffle({table})

        let index = 0
        pokers.forEach(poker => {
            if (index >= table.trackers.length) {
                index = 0
            }
            const tracker = table.trackers[index++]
            tracker.add(poker)
        })

        return table
    }

    seek(poker: Poker): boolean {
        const run = () => {
            const {cells, trackers, pools} = this

            const containers = [
                pools,
                trackers,
                cells,
            ].flat()

            while (containers.length) {
                const container = containers.shift()
                if (!container) continue
                const ok = container.push(poker)
                if (ok) {
                    return true
                }
            }

            return false
        }

        const ok = run()

       ok &&  console.log(`扑克【${poker.label}】收纳到了容器【${poker.belong?.label}】`)
        if (ok) {
            this.dirty()
        }
        return ok
    }

    dirty() {
        this.emit('change')
    }
}