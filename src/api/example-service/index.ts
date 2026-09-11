import { Api } from './apiGenerated'

const baseURL = process.env.NEXT_PUBLIC_SERVICE

export const exampleService = new Api({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const exampleAxios = exampleService.instance

export * from './apiGenerated'
