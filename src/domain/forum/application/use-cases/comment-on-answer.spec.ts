import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let answersRepository: InMemoryAnswersRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment On Answer Use Case', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new CommentOnAnswerUseCase(
      answersRepository,
      answerCommentsRepository,
    )
  })

  it('should be able to comment on answer', async () => {
    answersRepository.create(
      makeAnswer(
        {
          authorId: new UniqueEntityID('sut-author-id'),
        },
        new UniqueEntityID('sut-answer-id'),
      ),
    )

    const { answerComment } = await sut.execute({
      authorId: 'sut-author-id',
      answerId: 'sut-answer-id',
      content: 'This is a test comment on the answer',
    })

    expect(answerComment.id).toBeTruthy()
    expect(answerComment.content).toEqual(
      'This is a test comment on the answer',
    )
  })
})
