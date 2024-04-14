import {useEffect, useState} from 'react'
import Card from './components/card'
import * as types from './types'
import './App.scss'
import * as _ from 'lodash'
import {Table} from "@/core/table.ts";


const table = Table.start()

console.log(table)

function App() {
    const [flag, setFlag] = useState({})

    useEffect(() => {
        const cb = () => setFlag({})
        table.on('change', cb)

        return () => {
            table.off('change', cb)
        }
    }, [])

    return (
        <div className="app">

            <header>


                <div>
                    <h3>收纳区</h3>

                    <div className="pools card-block">
                        {
                            table.pools.map(item => <div className="pool card-box" key={item.index}>
                                {
                                    item.last() ? <Card poker={item.last()}/> : null
                                }
                            </div>)
                        }
                    </div>
                </div>

                <div>
                    <h3>空格区</h3>
                    <div className="cells card-block">
                        {
                            table.cells.map(item => <div className="cell card-box" key={item.index}>
                                {
                                    item.last() ? <Card poker={item.last()}/> : null
                                }
                            </div>)
                        }
                    </div>
                </div>

            </header>

            <main className="series">
                {
                    table.trackers.map(item => (
                        <div className="track" key={item.index}>
                            {
                                item.items.map(n => <div className="track-item" key={n.key}>
                                    <Card poker={n}/>
                                </div>)
                            }
                        </div>
                    ))
                }
            </main>
        </div>
    )
}

export default App