import helper from './helper'
import colors from './colors'

export default (app) => {
  app.use(helper)
  app.use(colors)
}
