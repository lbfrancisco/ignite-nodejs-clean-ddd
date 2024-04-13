import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'

let questionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(questionsRepository)
  })

  it('should be able to create a question', async () => {
    const { question } = await sut.execute({
      authorId: 'sut-author-id',
      title: 'New Question',
      content: 'This is my new question',
    })

    expect(question.content).toEqual('This is my new question')
    expect(questionsRepository.items[0].authorId).toEqual(question.authorId)
  })
})
