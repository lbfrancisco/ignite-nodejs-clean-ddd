import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { EditQuestionUseCase } from './edit-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let questionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(questionsRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('question-1'),
    )

    await questionsRepository.create(newQuestion)

    const { question } = await sut.execute({
      authorId: 'author-1',
      questionId: 'question-1',
      title: 'New title',
      content: 'New content',
    })

    expect(question.title).toEqual('New title')
    expect(question.content).toEqual('New content')
  })

  it('should not be able to edit another user question', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('question-1'),
    )

    await questionsRepository.create(newQuestion)

    await expect(() =>
      sut.execute({
        authorId: 'author-2',
        questionId: 'question-1',
        title: 'New title',
        content: 'New content',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to edit a non-existing question', async () => {
    await expect(() =>
      sut.execute({
        authorId: 'author-1',
        questionId: 'non-existing-id',
        title: 'New title',
        content: 'New content',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
