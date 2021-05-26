import { AnyFn, AnyObj, Unpacked } from '@/shared-types'

export function mapResponse<
  Caller extends AnyFn,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Mapper extends (response: Unpacked<ReturnType<Caller>>) => any
>(
  caller: Caller,
  mapper: Mapper
): (...args: Parameters<Caller>) => Promise<ReturnType<Mapper>> {
  return async (...args: Parameters<Caller>) => {
    const res = (await caller(...args)) as Unpacked<ReturnType<Caller>>
    return mapper(res)
  }
}

export async function sendPost(url: string, data: AnyObj): Promise<Response> {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  })
  console.log(response)
  return await response.json()
}
