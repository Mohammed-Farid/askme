const _ = require('lodash')
const Reply = require('../models/reply');
const Question = require('../models/question');
const User = require('../models/user');

const postReply = async (req, res) => {

  try {
    const io = req.app.get('io');

    const question = await Question.findOne({ id: req.body.question });

    const reply = new Reply(
      {
        content: req.body.content,
        question: question._id,
        by: req.body.by
      }
    );

    await reply.save();

    io.emit('newReply');

    res.send({ success: true, message: 'Reply posted!', reply });

  } catch (error) {

    res.send({ success: false, message: 'Reply not posted!' });

  }

}

const getReply = async (req, res) => {

  try {

    const reply = await Reply.findOne({ id: req.params.id });

    if (!reply) {

      throw new Error();

    }

    res.send({ success: true, message: 'Reply found!', reply });

  } catch (error) {

    res.send({ success: false, message: 'Reply not found!' });

  }

}

const updateReply = async (req, res) => {

  try {

    if ((req.body.reply.trim()).length < 2) {
      throw new Error();
    }

    const reply = await Reply.findOneAndUpdate(
      {
        id: req.params.id,
        replier: req.user.id,
        question: req.params.question
      },
      { reply: req.body.reply },
      { new: true }
    );

    if (!reply) {

      throw new Error();

    }

    res.send({ success: true, message: 'Reply edited!', reply });

  } catch (error) {

    res.send({ success: false, message: 'Reply not edited!' });

  }

}

const deleteReply = async (req, res) => {

  try {

    const reply = await Reply.findOneAndDelete({
      id: req.params.id,
      replier: req.user.id,
      question: req.params.question
    });

    if (!reply) {

      throw new Error();

    }

    res.send({ success: true, message: 'Reply deleted!', reply });

  } catch (error) {

    res.send({ success: false, message: 'Reply not deleted!' });

  }

}

module.exports = {
  postReply,
  getReply,
  updateReply,
  deleteReply
}