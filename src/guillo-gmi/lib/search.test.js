import { expect, test } from 'vitest'
import { parser, buildQs } from './search'

test('parse basic tokens', () => {
  expect(parser('asdf')).toStrictEqual([['title__in', 'asdf']])
  expect(parser('nombre=asdf')).toStrictEqual([['nombre', 'asdf']])
  expect(parser('nombre=asdf asdf')).toStrictEqual([
    ['nombre', 'asdf'],
    ['nombre', 'asdf'],
  ])

  expect(parser('queryToSearch', ['title', 'id'])).toStrictEqual([
    ['__or', 'title=queryToSearch&id=queryToSearch'],
  ])

  expect(parser('query search', ['title', 'id'])).toStrictEqual([
    ['__or', 'title=query&title=search&id=query&id=search'],
  ])

  expect(() => parser('query=search', ['title', 'id'])).toThrowError(
    'This option is not supported'
  )

  expect(buildQs(parser('nombre=asdf asdf'))).toStrictEqual(
    'nombre=asdf&nombre=asdf'
  )

  expect(buildQs(parser('nombre="hello world"'))).toStrictEqual(
    'nombre=hello%20world'
  )
})
