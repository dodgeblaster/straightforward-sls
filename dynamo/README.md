# Dynamo

## Serverless Permissions Example

In order to use dynamo, either your whole service or your functions
need IAM Permissions.

```yml
plugins:
    - serverless-pseudo-parameters

provider:
    iamRoleStatements:
        - Effect: Allow
          Action:
              - dynamodb:Query
              - dynamodb:Scan
              - dynamodb:GetItem
              - dynamodb:PutItem
              - dynamodb:UpdateItem
              - dynamodb:DeleteItem
          Resource: 'arn:aws:dynamodb:#{AWS::Region}:#{AWS::AccountId}:table/name-of-table'
```

-   Note : it is not recommended to give star permissions

## Serverless Resource Definition Example

In order to use a dynamo table, we will need to create one with a CloudFormation definition.

```yml
service: company-products

custom:
    stage: ${opt:stage, self:provider.stage}

resources:
    Resources:
        myTable:
            Type: AWS::DynamoDB::Table
            Properties:
                TableName: ${self:service}-${self:custom.stage}
                AttributeDefinitions:
                    - AttributeName: PK
                      AttributeType: S
                    - AttributeName: SK
                      AttributeType: S
                KeySchema:
                    - AttributeName: PK
                      KeyType: HASH
                    - AttributeName: SK
                      KeyType: RANGE
                BillingMode: PAY_PER_REQUEST
```

### Sections of the Cloud formation definition

#### Keys

In order to define a Parition key and a Sort key, we do the following:

```yml
AttributeDefinitions:
    - AttributeName: PK
        AttributeType: S
    - AttributeName: SK
        AttributeType: S
KeySchema:
    - AttributeName: PK
        KeyType: HASH
    - AttributeName: SK
        KeyType: RANGE
```

If we would like to define a second way to query the data, we can define
Global Secondary Indexes. Here is an example of defining 2:

```yml
GlobalSecondaryIndexes:
    - IndexName: GSI1
        KeySchema:
            - AttributeName: GSI1
            KeyType: HASH
            - AttributeName: SK
            KeyType: RANGE
        Projection:
            ProjectionType: ALL
    - IndexName: GSI2
        KeySchema:
            - AttributeName: GSI2
            KeyType: HASH
            - AttributeName: SK
            KeyType: RANGE
        Projection:
            ProjectionType: ALL

```

Combine them together and it looks like this:

```yml
service: company-products

custom:
    stage: ${opt:stage, self:provider.stage}

resources:
    Resources:
        myTable:
            Type: AWS::DynamoDB::Table
            Properties:
                TableName: ${self:service}-${self:custom.stage}
                AttributeDefinitions:
                    - AttributeName: PK
                      AttributeType: S
                    - AttributeName: SK
                      AttributeType: S
                KeySchema:
                    - AttributeName: PK
                      KeyType: HASH
                    - AttributeName: SK
                      KeyType: RANGE
                BillingMode: PAY_PER_REQUEST
                GlobalSecondaryIndexes:
                    - IndexName: GSI1
                        KeySchema:
                            - AttributeName: GSI1
                            KeyType: HASH
                            - AttributeName: SK
                            KeyType: RANGE
                        Projection:
                            ProjectionType: ALL
                    - IndexName: GSI2
                        KeySchema:
                            - AttributeName: GSI2
                            KeyType: HASH
                            - AttributeName: SK
                            KeyType: RANGE
                        Projection:
                            ProjectionType: ALL

```

#### Billing

Billing refers to how the table will scale. Will it be automatic or do you want to define
the Read Capacity Unitys and Write Capacity Units. In our example we used autoscaling:

```yml
BillingMode: PAY_PER_REQUEST
```

#### Adding a Stream to the table

You can add a Dynamo stream to the table, which will trigger events whenever a change
takes place. Assigning Lambda functions to dynamo streams is one way to handle large
amounts of data processing.

```yml
service: company-products

custom:
    stage: ${opt:stage, self:provider.stage}

functions:
    processAnswers:
        handler: handler.processAnswers
        # Function attached to myTables stream
        events:
            - stream:
                  type: dynamodb
                  arn:
                      Fn::GetAtt: [myTable, StreamArn]
                  batchSize: 1

resources:
    Resources:
        myTable:
            Type: AWS::DynamoDB::Table
            Properties:
                TableName: ${self:service}-${self:custom.stage}
                AttributeDefinitions:
                    - AttributeName: PK
                      AttributeType: S
                    - AttributeName: SK
                      AttributeType: S
                KeySchema:
                    - AttributeName: PK
                      KeyType: HASH
                    - AttributeName: SK
                      KeyType: RANGE
                BillingMode: PAY_PER_REQUEST
                # Stream configuration on the table
                StreamSpecification:
                    StreamViewType: NEW_IMAGE
```

# Dynamo Stream Utils

...
