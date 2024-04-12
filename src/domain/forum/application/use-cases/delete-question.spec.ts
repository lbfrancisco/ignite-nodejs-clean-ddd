import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { DeleteQuestionUseCase } from './delete-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let questionsRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(questionsRepository)
  })

  it('should be able to delete a question', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('question-1'),
    )

    await questionsRepository.create(newQuestion)

    await sut.execute({ authorId: 'author-1', questionId: 'question-1' })

    expect(questionsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user question', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('question-1'),
    )

    await questionsRepository.create(newQuestion)

    await expect(() =>
      sut.execute({
        authorId: 'author-2',
        questionId: 'question-1',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to delete a non-existing question', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'author-1',
        questionId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
