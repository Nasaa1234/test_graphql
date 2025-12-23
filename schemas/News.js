import mongoose, { Schema } from "mongoose"

const SectionSchema = new Schema(
  {
    title: { type: String, required: false },
    content: { type: String, required: false },
    images: [{ type: String, required: false }],
    listItems: [{ type: String, required: false }],
  },
  { _id: false } // Prevents unnecessary _id on subdocuments
)

const NewsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 200, // Increased from 50 for blog posts
      minlength: 2,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true, // Allows null/undefined but enforces uniqueness when present
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
    },
    image: {
      type: String,
      required: false,
      // Removed minlength validation for optional field
      validate: {
        validator: function (v) {
          return !v || v.length >= 2 // Only validate if value exists
        },
        message: "Image URL must be at least 2 characters if provided",
      },
    },
    type: {
      type: String,
      required: true,
      minlength: 2,
      index: true, // Index for filtering
    },
    sections: [SectionSchema],
    author: {
      type: String,
      required: false,
      trim: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      required: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// Indexes for better query performance
NewsSchema.index({ type: 1, createdAt: -1 })
NewsSchema.index({ published: 1, publishedAt: -1 })
NewsSchema.index({ slug: 1 })

// Auto-generate slug from title if not provided
NewsSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }
  // Set publishedAt when published is set to true
  if (this.isModified("published") && this.published && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  next()
})

const News = mongoose.model("News", NewsSchema)

export { News }
