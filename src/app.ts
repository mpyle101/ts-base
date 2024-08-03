import {EventEmitter} from 'events'

const sleep = (ms: number) => new Promise(_ => setTimeout(_, ms))

class Jester {
    emitter: EventEmitter
    counter: number

    constructor(count = 2) {
        this.emitter = new EventEmitter()
        this.counter = count
    }

    doit() {
        return new Promise<void>((resolve, reject) => {
            const timer = setTimeout(() => this.emitter.emit('stop'), 2000)
            this.emitter.on('empty', () => { 
                clearTimeout(timer)
                resolve();
            })
            this.emitter.on('stop', reject)
        })
    }

    decrement() {
        this.counter -= 1
        if (this.counter == 0) {
            this.emitter.emit('empty')
        }
    }

}

let jester = new Jester()
let j2 = structuredClone(jester)
jester.doit()
    .then(() => console.log('empty'))
    .catch(() => console.log('timeout'))
sleep(1000)
jester.decrement()
