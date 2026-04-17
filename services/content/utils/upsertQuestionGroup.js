import { v4 as uuidv4 } from "uuid";

export const upsertQuestionGroup = async (
  Model,
  {
    test_id,
    subject_id,
    question_text,
    difficulty = "easy",
    createdBy = null,
    extraFields = {}
  }
) => {
  let group = await Model.findOne({ test_id });

  const newQuestion = {
    question_id: uuidv4(),
    question_text,
    difficulty,
    ...extraFields
  };

  if (group) {
    group.questions.push(newQuestion);
    group.num_questions = group.questions.length;

    // backfill createdBy if old doc missing
    if (!group.createdBy && createdBy) {
      group.createdBy = createdBy;
    }

    await group.save();
    return group;
  }

  return await Model.create({
    test_id,
    subject_id,
    num_questions: 1,
    createdBy,
    isInProblemBank: true,
    questions: [newQuestion]
  });
};