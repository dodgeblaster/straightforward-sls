# SES

## Example

```ts
import ses from './index'

const example = {
    title: 'Example',
    to: ['johnsmith@gmail.com'],
    cc: [],
    from: 'johnsmith@gmail.com',
    body: 'html'
}

export const main = async () => {
    await ses.email(example)
}
```

## Serverless Permissions Example

In order to use ses, either your whole service or your functions
need IAM Permissions.

```yml
plugins:
    - serverless-pseudo-parameters

provider:
    iamRoleStatements:
        - Effect: Allow
          Action:
              - SES:SendEmail
              - SES:SendRawEmail
          Resource: 'arn:aws:ses:#{AWS::Region}:#{AWS::AccountId}:identity/example.com'
```

-   Note : it is not recommended to give star permissions
