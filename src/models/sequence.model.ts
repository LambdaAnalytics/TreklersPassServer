const mongoose = require('mongoose');

const { Schema } = mongoose;

const SequenceSchema = new Schema({
  _id: {
    type: String,
  },
  seq: {
    type: Number,
  },
});

export const Sequence = mongoose.model('sequence', SequenceSchema);

export const getValueForNextSequence = async (nameOfSequence) => {
  const sequenceDoc = await Sequence.findByIdAndUpdate(
    { _id: nameOfSequence },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  return +sequenceDoc.seq;
};
