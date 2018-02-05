import xs from 'xstream'
import { run, Sources } from '@cycle/run'
import { div, label, input, hr, h1, makeDOMDriver } from '@cycle/dom'

const isNumber = (o: any): o is number => !isNaN(o)
const parseEventAsNumber = (ev: Event) => parseInt((ev.target as HTMLInputElement).value, 10)

const main = (sources: Sources) => {
  const num1$ = sources.DOM.select('.field1').events('input')
                       .map(parseEventAsNumber).startWith(0)
  const num2$ = sources.DOM.select('.field2').events('input')
                       .map(parseEventAsNumber).startWith(0)
  const num3$ = sources.DOM.select('.field3').events('input')
                       .map(parseEventAsNumber).startWith(0)

  const sum$ = xs.combine(num1$, num2$, num3$).map(
    (streamValues) => {
      const sumAccumulator = (previousValue: any, currentValue: any): number => {
        if (isNumber(previousValue) && isNumber(currentValue)) {
          return previousValue + currentValue
        }
        return 0
      }
      return streamValues.reduce(sumAccumulator, 0)
    },
  )

  const vdom$ = sum$.map((sum) =>
    div([
      label('First Number:'),
      input('.field1', { attrs: { type: 'text' } }),
      label('Second Number:'),
      input('.field2', { attrs: { type: 'text' } }),
      label('Third Number:'),
      input('.field3', { attrs: { type: 'text' } }),
      hr(),
      h1(sum),
    ]),
  )

  return { DOM: vdom$ }
}

run(main, { DOM: makeDOMDriver('#app-container') })
