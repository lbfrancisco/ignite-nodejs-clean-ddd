import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { makeAnswer } from 'test/factories/make-answer'

let questionsRepository: InMemoryQuestionsRepository
let answersRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    answersRepository = new InMemoryAnswersRepository()
    sut = new ChooseQuestionBestAnswerUseCase(
      questionsRepository,
      answersRepository,
    )
  })

  it('should be able to choose question best answer', async () => {
    const newQuestion = makeQuestion()
    const newAnswer = makeAnswer({ questionId: newQuestion.id })

    await questionsRepository.create(newQuestion)
    await answersRepository.create(newAnswer)

    const { question } = await sut.execute({
      authorId: newQuestion.authorId.toString(),
      answerId: newAnswer.id.toString(),
    })

    expect(question.bestAnswerId).toBeTruthy()
    expect(question.bestAnswerId).toEqual(newAnswer.id)
  })

  it('should not be able to choose another user question best answer', async () => {
    const newQuestion = makeQuestion()
    const newAnswer = makeAnswer({ questionId: newQuestion.id })

    await questionsRepository.create(newQuestion)
    await answersRepository.create(newAnswer)

    await expect(() =>
      sut.execute({
        authorId: 'not-the-author-id',
        answerId: newAnswer.id.toString(),
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to choose a best answer to a non-existing answer', async () => {
    const newQuestion = makeQuestion()
    const newAnswer = makeAnswer({ questionId: newQuestion.id })

    await questionsRepository.create(newQuestion)
    await answersRepository.create(newAnswer)

    await expect(() =>
      sut.execute({
        authorId: newQuestion.authorId.toString(),
        answerId: 'non-existing-answer-id',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to choose a best answer to a non-existing question', async () => {
    const newQuestion = makeQuestion()
    const newAnswer = makeAnswer() // it'll generate a random question-id (non-existing)

    await questionsRepository.create(newQuestion)
    await answersRepository.create(newAnswer)

    await expect(() =>
      sut.execute({
        authorId: newQuestion.authorId.toString(),
        answerId: newAnswer.id.toString(),
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
