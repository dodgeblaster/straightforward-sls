# HTTP

## Example

```ts
import http from './index'

export const main = async event => {
    const data = http.in(event)

    return http.out({
        id: '1234',
        name: data.id
    })
}
```
