/* eslint-disable prettier/prettier */
import { TransactionsContext } from '../contexts/TransactionsContext'
import { useContextSelector } from 'use-context-selector'

export function useSummary() {
  const  transactions = useContextSelector(TransactionsContext, (context) => {
    return context.transactions
  })

  // reduzindo o array para o objeto que queremos, acc é o objeto que definimos no segundo argumento
  const summary = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.price
        acc.total += transaction.price
      } else {
        acc.outcome += transaction.price
        acc.total -= transaction.price
      }
      return acc
    },
    { income: 0, outcome: 0, total: 0 },
  )

  return summary
}
