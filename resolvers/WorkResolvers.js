import { Work } from "../schemas/index.js"

const getAllWorks = async () => {
  try {
    const works = await Work.find()
    return works
  } catch (error) {
    console.error("❌ Error fetching all works:", error)
    throw new Error("Failed to fetch all works")
  }
}

const addWork = async (_, { input }) => {
  if (!input) throw new Error("❌ No data provided")

  const work = new Work(input)
  try {
    await work.save()
    return work
  } catch (error) {
    console.error("❌ Error adding work:", error)
    throw new Error("Failed to add work")
  }
}

const editWork = async (_, { workId, input }) => {
  try {
    const updatedWork = await Work.findByIdAndUpdate(
      workId,
      { $set: input },
      { new: true, runValidators: true }
    )

    if (!updatedWork) {
      throw new Error(`❌ Work with ID ${workId} not found`)
    }

    return updatedWork
  } catch (error) {
    console.error("❌ Error editing work:", error)
    throw new Error("Failed to edit work")
  }
}

const deleteWork = async (_, { workId }) => {
  try {
    const work = await Work.findById(workId)

    if (!work) {
      throw new Error(`❌ Work with ID ${workId} not found`)
    }

    await Work.findByIdAndDelete(workId)

    return { success: true, message: "Work deleted successfully" }
  } catch (error) {
    console.error("❌ Error deleting work:", error)
    throw new Error("Failed to delete work")
  }
}

export { getAllWorks, addWork, editWork, deleteWork }
