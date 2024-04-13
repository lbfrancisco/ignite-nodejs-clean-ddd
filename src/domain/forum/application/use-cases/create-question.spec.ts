import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let questionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(questionsRepository)
  })

  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: 'sut-author-id',
      title: 'New Question',
      content: 'This is my new question',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.question.content).toEqual('This is my new question')
      expect(result.value.question.attachments).toHaveLength(2)
      expect(result.value.question.attachments).toEqual([
        expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
      ])
    }
  })
})
