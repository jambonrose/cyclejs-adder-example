import { run, Sources } from '@cycle/run'
import { div, label, input, hr, h1, makeDOMDriver } from '@cycle/dom'

const main = (sources: Sources) => {
  const input$ = sources.DOM.select('.field').events('input')

  const name$ = input$.map(
    (ev: Event) => (ev.target as HTMLInputElement).value).startWith('')

  const vdom$ = name$.map((name: string) =>
    div([
      label('Name:'),
      input('.field', { attrs: { type: 'text' } }),
      hr(),
      h1('Hello ' + name),
    ]),
  )

  return { DOM: vdom$ }
}

run(main, { DOM: makeDOMDriver('#app-container') })
