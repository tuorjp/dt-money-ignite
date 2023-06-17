/* eslint-disable prettier/prettier */
import {MagnifyingGlass} from 'phosphor-react'
import { SearchFormContainer } from "./styles"
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TransactionsContext } from '../../../../contexts/TransactionsContext'
import { useContextSelector } from 'use-context-selector'
import { memo } from 'react'

/*
* Por que um componente renderiza novamente?
* Hooks changed (mudou estado, contexto, reducer)
* Props changed (propriedades mudaram)
* Parent rendered (componente pai renderizou)

O fluxo de renderização:
1 Recriação do html (interface) do componente
2 Compara a versão recriada com a versão anterior
3 Se mudou algo, reescreve o html na tela

O memo é usado para memorizar um componente:
0 Antes do fluxo de renderização: Hooks changed, Props changed ? (deep comparison)
01 Compara com a versão anterior dos hooks e props
02 Se mudou algo, cai para o fluxo de recriação

O memo se faz necessário quando existe um componente gigante, com muito html.
Se esse não for o caso, geralmente nem compensa utilizá-lo.
*/

const searchFormSchema = z.object({
  query: z.string(),
})

type SearchFormInputs = z.infer<typeof searchFormSchema>

function SearchFormComponent() {
  const fetchTransactions = useContextSelector(TransactionsContext, (context) => {
    return context.fetchTransactions
  })

  const {register, handleSubmit, formState: {isSubmitting}} = useForm<SearchFormInputs>({
    resolver: zodResolver(searchFormSchema)
  })

  async function handleSearchTransaction(data: SearchFormInputs) {
    await fetchTransactions(data.query)
  }

  return (
    <SearchFormContainer onSubmit={handleSubmit(handleSearchTransaction)}>
        <input
          type="text"
          placeholder="Busque por transações"
          {...register('query')}
        />

        <button type="submit" disabled={isSubmitting}>
            <MagnifyingGlass size={20}/>
            Buscar
        </button>
    </SearchFormContainer>
  )
}

export const SearchForm = memo(SearchFormComponent)