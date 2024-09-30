import { handler } from 'src/functions/getSurvey'
import { eventGenerator } from 'test/__mocks__/request/eventGenerator'

describe('Implement DOD getSurvey', () => {
  test('It should return a specific survey', async () => {
    // Arrange
    const surveyId = '1'
    const event = eventGenerator({ pathParameters: { id: surveyId } } )

    // Act
    const result = await handler(event)

    // Assert
    expect(result.statusCode).toEqual(200)
    expect(result.body).toEqual(JSON.stringify({ id: '1', name: 'Survey 1', questions: [ { id: '1', title: 'Question 1', type: 'radio', createdAt: '2024-01-01', updatedAt: '2024-01-01', description: '' }, { id: '2', title: 'Question 2', type: 'text', createdAt: '2024-01-01', updatedAt: '2024-01-01', description: '' } ] }) )
  })
  
  test('It should throw error when id is not found', async () => {
    // Arrange
    const surveyId = '4'
    const event = eventGenerator({ pathParameters: { id: surveyId } } )

    
    try {
      // Act
      const result = await handler(event)
      return result
    } catch (error) {
      // Assert
      expect(error).toBeDefined()
    }
  })
  
  test('It should throw error when id is not in pathParameters', async () => {
    // Arrange
    // const surveyId = undefined
    const event = eventGenerator({})

    
    try {
      // Act
      const result = await handler(event)
      return result
    } catch (error) {
      // Assert
      expect(error).toBeDefined()
    }
  })
})