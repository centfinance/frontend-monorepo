import { aGqlPoolAprItemMock, aGqlPoolMinimalMock } from './gqlPoolMinimal.builders'

test('Builders are implicitly tested by the tests using them but this is for debugging when build edge cases', () => {
  expect(aGqlPoolMinimalMock({ address: 'foobar' }).address).toBe('foobar')
  expect(aGqlPoolAprItemMock().apr).toBe(0.005628271838682321)
})
