import { setupGuillotina, tearDownGuillotina } from "./guillotina"

before('Setup guillotina', function() {
  setupGuillotina()
})
after('Teardown guillotina', function() {
  tearDownGuillotina()
})