import { parser, buildQs } from './search'

test('parse basic tokens', () => {
  expect(parser('asdf')).toStrictEqual([['title__in', 'asdf']])
  expect(parser('nombre=asdf')).toStrictEqual([['nombre', 'asdf']])
  expect(parser('nombre=asdf asdf')).toStrictEqual([
    ['nombre', 'asdf'],
    ['nombre', 'asdf'],
  ])

  expect(buildQs(parser('nombre=asdf asdf'))).toStrictEqual(
    'nombre=asdf&nombre=asdf'
  )

  expect(buildQs(parser('nombre="hello world"'))).toStrictEqual(
    'nombre=hello%20world'
  )
})
