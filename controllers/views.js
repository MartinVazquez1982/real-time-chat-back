import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class Views {
  static async home (req, res, next) {
    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'home.html'))
  }
}
