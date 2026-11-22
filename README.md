# Signal Forms: number input throws when the model becomes `Infinity`

Minimal reproduction for an Angular 22.3.0 bug: a field bound with `[formField]` to `<input type="number">` throws a
`TypeError` from `valueAsNumber` when the model value becomes `Infinity` or `-Infinity`. The input keeps its old value and the
rest of the component's view is not updated until the next change detection.

## Run it

```bash
npm install
npm start      # http://localhost:4200
```

## Steps

1. Open the page and the browser console. Click **Calculate** with Count = 4: Average becomes `2.5` in the input and in `Model:`.
2. Change **Count** to `0` and click **Calculate** (`10 / 0` is `Infinity`).
3. Console: `TypeError: Failed to set the 'valueAsNumber' property on 'HTMLInputElement': The value provided is infinite.`
   The Average input still shows `2.5` and `Model:` still shows `2.5`.
4. Click **Calculate** again: `Model:` now shows `Infinity`, but the Average input still shows `2.5`.

`NaN` (`0 / 0`) works: the input is cleared and nothing is thrown. Only `Infinity` and `-Infinity` are missing.

## Cause

`setNativeNumberControlValue` (`packages/forms/signals/src/directive/native.ts`) only guards `isNaN(value)`, then sets
`element.valueAsNumber = value`, which throws for non-finite numbers. The same code path serves `type="range"` and
`type="datetime-local"`.

## Workaround

Write `Number.isFinite(x) ? x : NaN` into the model.
