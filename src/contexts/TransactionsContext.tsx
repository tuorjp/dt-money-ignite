/* eslint-disable prettier/prettier */
import { ReactNode, createContext, useEffect, useState } from 'react'
import { api } from '../lib/axios'

interface Transaction {
    id: number
    description: string
    type: 'income' | 'outcome'
    price: number
    category: string
    createdAt: string
  }

interface TransactionsContextType {
    transactions: Transaction[]
    fetchTransactions: (query?:string) => Promise<void>
}

interface TransactionsProviderProps {
    children: ReactNode
}

export const TransactionsContext = createContext({} as TransactionsContextType)

export function TransactionsProvider ({children}: TransactionsProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([])

    async function fetchTransactions(query?:string) {
      const response = await api.get('/transactions', {
        params: {
          q: query
        }
      })

        setTransactions(response.data)
      }
    
      useEffect(() => {
        fetchTransactions()
      }, [])
    
      // useEffect(() => {
      // fetch('http://localhost:3333/transactions')
      //  .then(response => response.json())
      //  .then(data => console.log(data))
      // }, [])
      
    return(
        <TransactionsContext.Provider value={{transactions, fetchTransactions}}>
            {children}
        </TransactionsContext.Provider>
    )
}