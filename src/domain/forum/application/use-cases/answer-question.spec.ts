import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { AnswerQuestionUseCase } from './answer-question'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let answersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Answer Question Use Case', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(answersRepository)
  })

  it('should be able to create an answer', async () => {
    const { answer } = await sut.execute({
      authorId: 'sut-author-id',
      questionId: 'sut-question-id',
      content: 'Testing answer',
    })

    expect(answer.content).toEqual('Testing answer')
    expect(answersRepository.items[0].authorId).toEqual(answer.authorId)
  })
})
