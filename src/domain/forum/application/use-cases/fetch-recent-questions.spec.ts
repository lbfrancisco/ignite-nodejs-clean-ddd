import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { makeQuestion } from 'test/factories/make-question'

let questionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Question Answers Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchRecentQuestionsUseCase(questionsRepository)
  })

  it('should be able to fetch paginated recent questions', async () => {
    Array.from({ length: 35 }).forEach(async () => {
      await questionsRepository.create(makeQuestion())
    })

    const { questions } = await sut.execute({
      page: 2,
    })

    expect(questions).toHaveLength(15)
  })

  it('should be able to fetch recent questions ordered by created at', async () => {
    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 20) }),
    )

    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 15) }),
    )

    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 10) }),
    )

    const { questions } = await sut.execute({
      page: 1,
    })

    expect(questions).toHaveLength(3)
    expect(questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 15) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 10) }),
    ])
  })
})
