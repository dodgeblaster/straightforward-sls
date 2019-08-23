# SNS

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
