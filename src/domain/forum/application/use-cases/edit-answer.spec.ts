import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { EditAnswerUseCase } from './edit-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let answersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer Use Case', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(answersRepository)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('answer-1'),
    )

    await answersRepository.create(newAnswer)

    const { answer } = await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
      content: 'New content',
    })

    expect(answer.content).toEqual('New content')
  })

  it('should not be able to edit another user answer', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('answer-1'),
    )

    await answersRepository.create(newAnswer)

    await expect(() =>
      sut.execute({
        authorId: 'author-2',
        answerId: 'answer-1',
        content: 'New content',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to edit a non-existing answer', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'author-1',
        answerId: 'non-existing-id',
        content: 'New content',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
