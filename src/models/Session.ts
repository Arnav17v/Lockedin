import mongoose, { Schema, models } from 'mongoose';

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    total_duration_sec: {
      type: Number,
      required: true,
    },
    focused_time_sec: {
      type: Number,
      required: true,
    },
    wasted_time_sec: {
      type: Number,
      required: true,
    },
    drowsy_time_sec: {
      type: Number,
      required: true,
    },
    max_attention_span_sec: {
      type: Number, 
      required: true,
    },
    avg_attention_span_sec: {
      type: Number,
      required: true, 
    },
    wasted_percentage: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// If the Session model doesn't exist, create a new one
const Session = models.Session || mongoose.model('Session', sessionSchema);

export default Session; 