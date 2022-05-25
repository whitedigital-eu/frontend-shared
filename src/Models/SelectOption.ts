import { SelectOption as SelectOptionType } from '../Types/FormData'
import { Classifier } from '../Types/Classifier'
import { User } from '../Types/User'
import { LikumiSection } from '../Types/LikumiSection'
import { LikumiArticle } from '../Types/LikumiArticle'

export default class SelectOption implements SelectOptionType {
  text
  value
  icon

  constructor(text: string, value: string, icon?: string) {
    this.text = text
    this.value = value
    this.icon = icon
  }

  static createFromClassifier = (classifier: Classifier) =>
    new SelectOption(classifier.value, classifier['@id'])
  static createFromClassifierWithText = (classifier: Classifier) =>
    new SelectOption(classifier.value, classifier.value)
  static createFromUser = (user: User) =>
    new SelectOption(user.fullName, user['@id'])
  static createFromUserWithId = (user: User) =>
    new SelectOption(user.fullName, user.id.toString())
  static createFromLikumiSection = (likumiSection: LikumiSection) =>
    new SelectOption(likumiSection.title, likumiSection.id.toString())
  static createFromLikumiArticle = (likumiArticle: LikumiArticle) =>
    new SelectOption(likumiArticle.title, likumiArticle['@id'])
}
