import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchQuestionsAnswersUseCase } from './fetch-question-answers'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let answersRepository: InMemoryAnswersRepository
let sut: FetchQuestionsAnswersUseCase

describe('Fetch Questions Answers Use Case', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new FetchQuestionsAnswersUseCase(answersRepository)
  })

  it('should be able to fetch questions answers', async () => {
    const questionId = 'sut-question-id'

    Array.from({ length: 3 }).forEach(async () => {
      await answersRepository.create(
        makeAnswer({ questionId: new UniqueEntityID(questionId) }),
      )
    })

    const result = await sut.execute({
      questionId,
      page: 1,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.answers).toHaveLength(3)
    }
  })

  it('should be able to fetch paginated questions answers', async () => {
    const questionId = 'sut-question-id'

    Array.from({ length: 35 }).forEach(async () => {
      await answersRepository.create(
        makeAnswer({ questionId: new UniqueEntityID(questionId) }),
      )
    })

    const result = await sut.execute({
      questionId,
      page: 2,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.answers).toHaveLength(15)
    }
  })
})
