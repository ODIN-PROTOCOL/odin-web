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
    cache: 'no-cache',
    credentials: 'same-origin',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
    mode: 'cors',
  })
  if (response.ok) {
    return response
  } else {
    throw new Error(JSON.stringify(await response.json()))
  }
}

export async function sendGet(url: string): Promise<Response> {
  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-cache',
    credentials: 'same-origin',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    mode: 'cors',
  })
  if (response.ok) {
    return response
  } else {
    throw new Error(JSON.stringify(await response.json()))
  }
}
