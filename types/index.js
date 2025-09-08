import path from "path"
import { fileURLToPath } from "url"
import { mergeTypeDefs } from "@graphql-tools/merge"
import { loadFiles } from "@graphql-tools/load-files"

// __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// load your .graphql files
const typesArray = await loadFiles(path.join(__dirname, "."), {
  extensions: ["graphql"],
})

export const typeDefs = mergeTypeDefs(typesArray)
