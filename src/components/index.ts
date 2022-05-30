import Text from './Inputs/Text.vue'
import TextEditor from './Inputs/TextEditor.vue'
import Decimal from './Inputs/Decimal.vue'
import BaseSelect from './Inputs/Selects/BaseSelect.vue'
import SimpleSelect from './Inputs/Selects/SimpleSelect.vue'
import DataFetchingSelect from './Inputs/Selects/DataFetchingSelect.vue'
import Datepicker from './Inputs/Datepicker.vue'
import RangeDatepicker from './Inputs/RangeDatepicker.vue'
import TimePicker from './Inputs/TimePicker.vue'
import DateTimePicker from './Inputs/DateTimePicker.vue'
import FileUpload from './Inputs/FileUpload/FileUpload.vue'
import Checkbox from './Inputs/Checkbox.vue'
import Slider from './Inputs/Slider.vue'
import FormFieldLabel from './FormFieldLabel.vue'

const plugin = {
  install(app, options) {
    app.component('Text', Text)
    app.component('TextEditor', TextEditor)
    app.component('Decimal', Decimal)
    app.component('BaseSelect', BaseSelect)
    app.component('SimpleSelect', SimpleSelect)
    app.component('DataFetchingSelect', DataFetchingSelect)
    app.component('Datepicker', Datepicker)
    app.component('RangeDatepicker', RangeDatepicker)
    app.component('TimePicker', TimePicker)
    app.component('DateTimePicker', DateTimePicker)
    app.component('FileUpload', FileUpload)
    app.component('Checkbox', Checkbox)
    app.component('Slider', Slider)
    app.component('FormFieldLabel', FormFieldLabel)
  },
}

export default plugin
