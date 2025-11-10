import { Request, Response } from 'express'
import { user_exists } from './UserController.js'
import { send_response_created, send_response_not_found, send_response_successful, send_response_unsuccessful } from '#utils/responses'
import QuizzCollection from '#models/Collection'
import { ERROR_MESSAGES } from '#constants'
import { has_ownership_or_admin } from '#utils/utils'
import { AuthenticatedRequest } from '#interfaces/express'
import { Types } from 'mongoose'
import { sanitize } from '#utils/sanitize'

// === DTOs para tipado ===
interface CreateCollectionBody {
    name: string
    tags?: string[]
    questions?: string[]
}

// type EditCollectionBody = Partial<CreateCollectionBody>;

interface FilterCollectionsBody {
    name?: string
    id?: string
    owner?: string
    tags?: string[]
    questions?: string[]
    page?: string
    limit?: string
}

interface GetCollectionsQuery extends qs.ParsedQs {
    name?: string
    id?: string
    owner?: string
    tags?: string | string[]
    questions?: string | string[]
    page?: string
    limit?: string
}

// === Controladores ===

export const createCollection = async (req: AuthenticatedRequest<{ id: string }, any, Partial<CreateCollectionBody>>, res: Response): Promise<void> => {
    try {
        const { name, tags = [], questions = [] } = req.body
        const user = await user_exists({ name: req.user?.name })

        if (!user) {
            send_response_not_found(res, [ERROR_MESSAGES.NOT_FOUND_USER])
            return
        }

        const existing = await QuizzCollection.findOne({ name, owner: user._id })
        if (existing) {
            send_response_unsuccessful(res, [ERROR_MESSAGES.COLLECTION_ALREADY_EXISTS])
            return
        }

        const newCollection = new QuizzCollection({
            name,
            tags,
            questions,
            owner: user._id
        })

        await newCollection.save()

        send_response_created(res, 'Collection created', newCollection)
    } catch (error) {
        send_response_unsuccessful(res, [(error as Error).message])
    }
}

export const editCollection = async (req: AuthenticatedRequest<{ id: string }, any, Partial<CreateCollectionBody>>, res: Response): Promise<void> => {
    try {
        const { id } = req.params
        const { name, tags, questions } = req.body

        const user = await user_exists({ name: req.user?.name })
        if (!user) {
            send_response_not_found(res, [ERROR_MESSAGES.NOT_FOUND_USER])
            return
        }

        const collection = await QuizzCollection.findOne({ _id: id })
        if (!collection) {
            send_response_not_found(res, [ERROR_MESSAGES.COLLECTION_NOT_FOUND])
            return
        }

        has_ownership_or_admin(user, collection.owner!) // !

        if (name !== undefined) {
            const existing = await QuizzCollection.findOne({ name, owner: user._id, _id: { $ne: id } })
            if (existing) {
                send_response_unsuccessful(res, [ERROR_MESSAGES.COLLECTION_ALREADY_EXISTS])
                return
            }
            collection.name = name
        }

        if (tags !== undefined) collection.tags = tags
        if (questions !== undefined) {
            collection.questions = questions.map((q) => new Types.ObjectId(q))
        }

        await collection.save()

        send_response_successful(res, 'Collection edited successfully', collection)
    } catch (error) {
        send_response_unsuccessful(res, [(error as Error).message])
    }
}

export const deleteCollection = async (req: AuthenticatedRequest<{ id: string }, any, Partial<CreateCollectionBody>>, res: Response): Promise<void> => {
    try {
        const { id } = req.params

        const user = await user_exists({ name: req.user?.name })
        if (!user) {
            send_response_not_found(res, [ERROR_MESSAGES.NOT_FOUND_USER])
            return
        }

        const collection = await QuizzCollection.findOne({ _id: id })
        if (!collection) {
            send_response_not_found(res, [ERROR_MESSAGES.COLLECTION_NOT_FOUND])
            return
        }

        has_ownership_or_admin(user, collection.owner!) // !

        await collection.deleteOne()

        send_response_successful(res, 'Collection deleted successfully', collection)
    } catch (error) {
        send_response_unsuccessful(res, [(error as Error).message])
    }
}

export const getCollectionsFiltered = async (req: Request<{}, {}, FilterCollectionsBody>, res: Response): Promise<void> => {
    try {
        const { name, id, owner, tags, questions, page = '1', limit = '20' } = req.body
        const pageInt = parseInt(page, 10) || 1
        const limitInt = parseInt(limit, 10) || 20

        const query: any = {}
        if (id) query._id = id
        if (name) query.name = name
        if (owner) query.owner = owner
        if (tags) query.tags = { $in: Array.isArray(tags) ? tags.map(sanitize) : [sanitize(tags)] }
        if (questions) query.questions = { $all: Array.isArray(questions) ? questions : [questions] }

        const quizzCollections = await QuizzCollection.find(query)
            .skip((pageInt - 1) * limitInt)
            .limit(limitInt)
            .populate('questions')

        send_response_successful(res, 'Quizz Collections', quizzCollections)
    } catch (error) {
        send_response_unsuccessful(res, [(error as Error).message])
    }
}

export const getCollectionsByID = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params

        const collection = await QuizzCollection.findById(id).populate('questions')
        if (!collection) {
            send_response_not_found(res, [ERROR_MESSAGES.COLLECTION_NOT_FOUND])
            return
        }

        send_response_successful(res, 'Quizz Collection', collection)
    } catch (error) {
        send_response_unsuccessful(res, [(error as Error).message])
    }
}

export const getCollectionsByOwner = async (req: Request<{ ownername: string }>, res: Response): Promise<void> => {
    try {
        const { ownername } = req.params

        const user = await user_exists({ name: ownername })
        if (!user) {
            send_response_not_found(res, [ERROR_MESSAGES.NOT_FOUND_USER])
            return
        }

        const quizzCollections = await QuizzCollection.find({ owner: user._id }).populate('questions')

        send_response_successful(res, 'Quizz Collections', quizzCollections)
    } catch (error) {
        send_response_unsuccessful(res, [(error as Error).message])
    }
}

export const getCollections = async (req: Request<{}, {}, {}, GetCollectionsQuery>, res: Response): Promise<void> => {
    try {
        const { name, id, owner, tags, questions, page = '1', limit = '20' } = req.query
        const pageInt = parseInt(page as string, 10) || 1
        const limitInt = parseInt(limit as string, 10) || 20

        const query: any = {}
        if (id) query._id = id
        if (name) query.name = { $regex: sanitize(name as string), $options: 'i' }
        if (owner) query.owner = owner
        if (tags) {
            const tagsArray = Array.isArray(tags) ? tags : [tags]
            query.tags = { $in: tagsArray.map(sanitize) }
        }
        if (questions) {
            const questionsArray = Array.isArray(questions) ? questions : [questions]
            query.questions = { $all: questionsArray }
        }

        const quizzCollections = await QuizzCollection.find(query)
            .skip((pageInt - 1) * limitInt)
            .limit(limitInt)
            .populate('questions')

        send_response_successful(res, 'Quizz Collections', quizzCollections)
    } catch (error) {
        send_response_unsuccessful(res, [(error as Error).message])
    }
}
