const Reply = require('../models/reply');

const postReply = async (req, res) => {

  try {
    const io = req.app.get('io');

    const reply = new Reply(
      {
        reply: req.body.reply,
        question: req.params.question,
        replier: req.user.username
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

const getRepliesByUser = async (req, res) => {

  try {

    const replies = await Reply.find({ replier: req.params.username });

    if (!replies) {

      throw new Error();

    }

    res.send({ success: true, message: 'Replies found!', replies });

  } catch (error) {

    res.send({ success: false, message: 'Replies not found!' });

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
  getRepliesByUser,
  updateReply,
  deleteReply
}