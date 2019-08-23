# SNS

## Example

```ts
import sns, { snsInput } from './index'

const example = {
    event: 'USER_CREATED',
    data: {
        id: '1234',
        name: 'John'
    }
}

export const receiveAnEventAndEmit = async event => {
    // receive
    const data = snsInput(event)

    // emit
    await sns.emit(example)
}
```

## Serverless Permissions Example

In order to use sns, either your whole service or your functions
need IAM Permissions.

```yml
plugins:
    - serverless-pseudo-parameters

provider:
    iamRoleStatements:
        - Effect: Allow
          Action:
              - SNS:CreateTopic
              - SNS:Publish
              - SNS:Subscribe
          Resource: 'arn:aws:sns:#{AWS::Region}:#{AWS::AccountId}:topic-name'
```

-   Note : it is not recommended to give star permissions
