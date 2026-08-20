/**
 * Guards that #10 scanner noise is dropped in before_send, without a second copy
 * of the filter module (posthog.ts has side effects on import).
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = readFileSync(new URL('../src/posthog.ts', import.meta.url), 'utf8')
assert.match(src, /before_send:\s*keepPosthogEvent/)
assert.match(src, /event\.event !== '\$exception'/)
assert.match(src, /JSON\.stringify\(event\.properties/)
assert.match(src, /CEFSHARP_REJECTION\.test\([\s\S]+\) \? null : event/)

const regexLit = src.match(/\/Object Not Found Matching Id:\\d\+, MethodName:\\w\+, ParamCount:\\d\+\//)
assert.ok(regexLit, 'posthog.ts must contain the CefSharp rejection regex')
const CEFSHARP_REJECTION = new RegExp(regexLit[0].slice(1, -1))

assert.equal(
  CEFSHARP_REJECTION.test(
    'Non-Error promise rejection captured with value: Object Not Found Matching Id:1, MethodName:update, ParamCount:4',
  ),
  true,
)
assert.equal(
  CEFSHARP_REJECTION.test('Object Not Found Matching Id:7, MethodName:update, ParamCount:4'),
  true,
)
assert.equal(CEFSHARP_REJECTION.test('Failed to fetch dynamically imported module'), false)
assert.equal(CEFSHARP_REJECTION.test('TypeError: Cannot read properties of undefined'), false)

console.log('posthog-filter check passed')
