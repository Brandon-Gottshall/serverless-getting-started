' use strict'
const AWS = require('aws-sdk')

module.exports.getCustomers = async (event) => {
  const scanParams = {
    TableName: process.env.DYNAMODB_CUSTOMER_TABLE
  }

  const dynamoDb = new AWS.DynamoDB.DocumentClient()
  const result = await dynamoDb.scan(scanParams).promise()

  if (result.count === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'No customers found'
      })
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      total: result.count,
      items: await result.Items.map((customer) => {
        return {
          name: customer.primary_key,
          email: customer.email
        }
      })
    })
  }
}
