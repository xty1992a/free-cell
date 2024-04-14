export type ISeries = 'spade' | 'heart' | 'diamond' | 'club'

export interface IPoker {
    // 颜色
    color: string
    // 数值（A-2-3-...-K）
    value: 'A'| '2'| '3'| '4'| '5'| '6'| '7'| '8'| '9'| '10'| 'J'| 'Q'| 'K'
    // 索引 (1-13)
    index: number
    // 系列（黑桃:spade、红桃:heart、方片:diamond、草花:club）
    series: ISeries
    // 唯一索引 （series+value）
    key: string
}

export interface IContainer {
    items: IPoker[]
    remove: (poker: IPoker) => void
    push: (poker: IPoker) => boolean
}

export interface IPool extends IContainer {
    index: number
    series?: ISeries
}

export interface ICell extends IContainer {
    index: number
}

export interface ITracker extends IContainer{
    index: number
}

export type ILamePoker = Pick<IPoker, 'series' | 'value'>