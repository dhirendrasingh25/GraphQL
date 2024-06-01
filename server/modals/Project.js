import mongoose from "mongoose";
const { Schema } = mongoose;

const projectSchema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
