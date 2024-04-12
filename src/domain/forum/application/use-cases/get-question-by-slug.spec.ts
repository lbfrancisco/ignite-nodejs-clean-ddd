import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { Question } from '../../enterprise/entities/question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'

let questionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(questionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('a-testing-slug'),
    })

    await questionsRepository.create(newQuestion)

    const { question } = await sut.execute({
      slug: 'a-testing-slug',
    })

    expect(question.id).toEqual(newQuestion.id)
  })

  it('should not be able to get a question by non-existing slug', async () => {
    await expect(() =>
      sut.execute({
        slug: 'non-existing-slug',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
