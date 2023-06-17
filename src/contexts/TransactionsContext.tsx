/* eslint-disable prettier/prettier */
import { ReactNode, useEffect, useState, useCallback } from 'react'
import { api } from '../lib/axios'
import { createContext } from 'use-context-selector'

interface Transaction {
    id: number
    description: string
    type: 'income' | 'outcome'
    price: number
    category: string
    createdAt: string
  }

  interface CreateTransactionInput {
    description: string,
    price: number,
    category: string,
    type: 'income' | 'outcome'
  }

interface TransactionsContextType {
    transactions: Transaction[]
    fetchTransactions: (query?:string) => Promise<void>
    createTransaction: (data:CreateTransactionInput) => Promise<void>
}

interface TransactionsProviderProps {
    children: ReactNode
}

export const TransactionsContext = createContext({} as TransactionsContextType)

export function TransactionsProvider ({children}: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

   const fetchTransactions = useCallback(
    async(query?:string) => {
      // a api já guarda a url base, basta passar a rota com ou sem barra e os parâmetros da busca
      // no caso do json-server o parâmetro que vai na url se chama q
      const response = await api.get('/transactions', {
        params: {
          _sort: 'createdAt',
          _order: 'desc',
          q: query
        }
      })

        setTransactions(response.data)
      },
      [],
   )
      
    // esse hook evita que essa função seja recriada em memória desnecessariamente, as dependências devem ser passadas no array
    const createTransaction = useCallback(
      async(data: CreateTransactionInput) => {
      // basta passar a rota e o corpo da requisição
          const {description, price, category, type} = data
          
          const response = await api.post('transactions', {
            description,
            price,
            category,
            type,
            createdAt: new Date(),
          })
  
          setTransactions(state => [response.data, ...state])
        },
        [],
    )

    useEffect(() => {
      fetchTransactions()
    }, [fetchTransactions])
  
    // useEffect(() => {
    // fetch('http://localhost:3333/transactions')
    //  .then(response => response.json())
    //  .then(data => console.log(data))
    // }, [])
    
  return(
      <TransactionsContext.Provider value={{transactions, fetchTransactions, createTransaction}}>
          {children}
      </TransactionsContext.Provider>
  )
}