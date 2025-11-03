import { ERROR_MESSAGES } from "#constants";
import { AuthenticatedRequest } from "#interfaces/express";
import Question, { IQuestion } from "#models/Question";
import { is_valid_string } from "#utils/format";
import { send_response_created, send_response_not_found, send_response_successful, send_response_unsuccessful } from "#utils/responses";
import { has_ownership_or_admin } from "#utils/utils";
import { user_exists } from "./UserController.js";
import { Request, Response } from 'express';


// === DTOs ===
interface CreateQuestionBody {
  question_text: string;
  options: string[];
  answer: string;
  tags?: string[];
}

interface EditQuestionBody {
  field: 'question' | 'options' | 'answer';
  value: any;
}

interface GetQuestionsQuery extends qs.ParsedQs {
  ownername?: string;
  id?: string;
  page?: string;
  limit?: string;
}

// === Controladores ===

export const createQuestion = async (
  req: AuthenticatedRequest<{},{}, CreateQuestionBody>,
  res: Response
): Promise<void> => {
  try {
    const { question_text, options, answer, tags = [] } = req.body;

    // Validaciones
    if (!is_valid_string(question_text)) {
      send_response_unsuccessful(res, [ERROR_MESSAGES.INVALID_STRING]);
      return;
    }

    if (!is_valid_string(answer)) {
      send_response_unsuccessful(res, [ERROR_MESSAGES.NEED_ANSWER]);
      return;
    }

    if (!Array.isArray(options) || options.length < 2) {
      send_response_unsuccessful(res, [ERROR_MESSAGES.INVALID_OPTIONS_ARRAY]);
      return;
    }

    if (!Array.isArray(tags)) {
      send_response_unsuccessful(res, [ERROR_MESSAGES.INVALID_TAGS_ARRAY]);
      return;
    }

    if (!options.includes(answer)) {
      send_response_unsuccessful(res, [ERROR_MESSAGES.OPTIONS_MUST_INCLUDE_ANSWER]);
      return;
    }

    const user = await user_exists({ name: req.user?.name });
    if (!user) {
      send_response_not_found(res, [ERROR_MESSAGES.NOT_FOUND_USER]);
      return;
    }

    const existing = await Question.findOne({
      question: question_text,
      owner: user._id,
    });

    if (existing) {
      send_response_unsuccessful(res, [ERROR_MESSAGES.QUESTION_ALREADY_EXISTS]);
      return;
    }

    const newQuestion = new Question({
      question: question_text,
      options,
      answer,
      tags,
      owner: user._id,
    });

    await newQuestion.save();

    send_response_created(res, 'Question created successfully', newQuestion);
  } catch (error) {
    send_response_unsuccessful(res, [(error as Error).message]);
  }
};

export const editQuestion = async (
  req: AuthenticatedRequest<{ id: string }, {}, EditQuestionBody>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { field, value } = req.body;

    const allowedFields: (keyof IQuestion)[] = ['question', 'options', 'answer'];
    if (!allowedFields.includes(field as keyof IQuestion)) {
      send_response_unsuccessful(res, ['Field not editable']);
      return;
    }

    const question = await Question.findById(id);
    if (!question) {
      send_response_not_found(res, [ERROR_MESSAGES.QUESTION_NOT_FOUND]);
      return;
    }

    const user = await user_exists({ name: req.user?.name });
    if (!user) {
      send_response_not_found(res, [ERROR_MESSAGES.NOT_FOUND_USER]);
      return;
    }

    has_ownership_or_admin(user, question.owner!); // !

    question[field] = value;

    if (field === 'options' && !Array.isArray(value)) {
      send_response_unsuccessful(res, [ERROR_MESSAGES.INVALID_OPTIONS_ARRAY]);
      return;
    }

    if (field === 'answer' && value && !question.options.includes(value)) {
      send_response_unsuccessful(res, [ERROR_MESSAGES.OPTIONS_MUST_INCLUDE_ANSWER]);
      return;
    }

    await question.save();

    send_response_successful(res, 'Question edited successfully', question);
  } catch (error) {
    send_response_unsuccessful(res, [(error as Error).message]);
  }
};

export const deleteQuestion = async (
  req: AuthenticatedRequest<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);
    if (!question) {
      send_response_not_found(res, [ERROR_MESSAGES.QUESTION_NOT_FOUND]);
      return;
    }

    const user = await user_exists({ name: req.user?.name });
    if (!user) {
      send_response_not_found(res, [ERROR_MESSAGES.NOT_FOUND_USER]);
      return;
    }

    has_ownership_or_admin(user, question.owner!); // !!

    await question.deleteOne();

    send_response_successful(res, 'Question deleted successfully', question);
  } catch (error) {
    send_response_unsuccessful(res, [(error as Error).message]);
  }
};

export const getQuestions = async (
  req: Request<{}, {}, {}, GetQuestionsQuery>,
  res: Response
): Promise<void> => {
  try {
    const { ownername, id, page = '1', limit = '20' } = req.query;
    const pageInt = parseInt(page as string, 10) || 1;
    const limitInt = parseInt(limit as string, 10) || 20;

    const query: any = {};

    if (id) {
      const question = await Question.findById(id);
      if (!question) {
        send_response_not_found(res, [ERROR_MESSAGES.QUESTION_NOT_FOUND]);
        return;
      }
      send_response_successful(res, 'Question', question);
      return;
    }

    if (ownername) {
      const user = await user_exists({ name: ownername as string });
      if (!user) {
        send_response_not_found(res, [ERROR_MESSAGES.NOT_FOUND_USER]);
        return;
      }
      query.owner = user._id;
    }

    const questions = await Question.find(query)
      .skip((pageInt - 1) * limitInt)
      .limit(limitInt)
      .sort({ createdAt: -1 });

    send_response_successful(res, 'Questions', questions);
  } catch (error) {
    send_response_unsuccessful(res, [(error as Error).message]);
  }
};

// === Funciones adicionales (descomentadas) ===

export const getQuestionsByOwner = async (
  req: Request<{ ownername: string }>,
  res: Response
): Promise<void> => {
  try {
    const { ownername } = req.params;

    const user = await user_exists({ name: ownername });
    if (!user) {
      send_response_not_found(res, [ERROR_MESSAGES.NOT_FOUND_USER]);
      return;
    }

    const questions = await Question.find({ owner: user._id }).sort({ createdAt: -1 });
    send_response_successful(res, 'Questions', questions);
  } catch (error) {
    send_response_unsuccessful(res, [(error as Error).message]);
  }
};

export const getQuestionByID = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);
    if (!question) {
      send_response_not_found(res, [ERROR_MESSAGES.QUESTION_NOT_FOUND]);
      return;
    }

    send_response_successful(res, 'Question', question);
  } catch (error) {
    send_response_unsuccessful(res, [(error as Error).message]);
  }
};

export const getAllQuestions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    send_response_successful(res, 'All Questions', questions);
  } catch (error) {
    send_response_unsuccessful(res, [(error as Error).message]);
  }
};