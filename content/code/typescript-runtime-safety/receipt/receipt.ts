import * as t from 'io-ts'
import { map, fold } from 'fp-ts/lib/Either'
import { fold as foldMonoid, monoidSum } from 'fp-ts/lib/Monoid'
import { map as mapArray } from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/pipeable'

const Purchase = t.type({
  vat: t.number,
  items: t.array(
    t.type({
      name: t.string,
      amount: t.number,
      priceEur: t.number
    })
  )
})

const Receipt = t.type({
  date: t.string,
  totalEur: t.number,
  taxEur: t.number
})

type Purchase = t.TypeOf<typeof Purchase>
type Receipt = t.TypeOf<typeof Receipt>

const data: unknown = {
  vat: 24,
  items: [
    { name: 'banana', amount: 3, priceEur: 0.7 },
    { name: 'coffee', amount: 1, priceEur: 3.5 },
    { name: 'beer', amount: 6, priceEur: 1.2 }
  ]
}

function purchaseToReceipt(purchase: Purchase): Receipt {
  const total = pipe(
    purchase.items,
    mapArray(item => item.amount * item.priceEur),
    foldMonoid(monoidSum)
  )

  return {
    date: new Date().toISOString(),
    totalEur: total,
    taxEur: (purchase.vat / 100) * total
  }
}

function formatReceipt(receipt: Receipt): string {
  return `
Receipt
========
Date: ${receipt.date}
Total: ${receipt.totalEur.toFixed(2)}€
Tax: ${receipt.taxEur.toFixed(2)}€
          `
}

function formatErrors(errors: t.Errors): string {
  return `Invalid data: ${JSON.stringify(errors)}`
}

const summary: string = pipe(
  Purchase.decode(data),
  // "map" only changes the "Right" value and keeps Left intact
  map(purchaseToReceipt),
  // Apply a certain function to left and right values (if present)
  fold(formatErrors, formatReceipt)
)

console.log(summary)
