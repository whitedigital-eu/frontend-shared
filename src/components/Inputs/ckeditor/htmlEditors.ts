import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import { Essentials } from '@ckeditor/ckeditor5-essentials'
import { Autoformat } from '@ckeditor/ckeditor5-autoformat'
import {
  Bold,
  Italic,
  Code,
  Strikethrough,
  Subscript,
  Underline,
  Superscript,
} from '@ckeditor/ckeditor5-basic-styles'
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote'
import { Heading } from '@ckeditor/ckeditor5-heading'
import { Link, AutoLink } from '@ckeditor/ckeditor5-link'
import { List } from '@ckeditor/ckeditor5-list'
import { Paragraph } from '@ckeditor/ckeditor5-paragraph'
import { Image, ImageUpload, ImageCaption } from '@ckeditor/ckeditor5-image'
import {
  Indent,
  IndentUI,
  IndentBlock,
  IndentEditing,
} from '@ckeditor/ckeditor5-indent'
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed'
import { Table } from '@ckeditor/ckeditor5-table'
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing'
import { CKFinder } from '@ckeditor/ckeditor5-ckfinder'
import { UploadAdapter } from '@ckeditor/ckeditor5-adapter-ckfinder'
import { Alignment } from '@ckeditor/ckeditor5-alignment'
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line'
import {
  SpecialCharacters,
  SpecialCharactersEssentials,
} from '@ckeditor/ckeditor5-special-characters'
import {
  Emoji,
  EmojiActivity,
  EmojiFlags,
  EmojiFood,
  EmojiNature,
  EmojiObjects,
  EmojiPeople,
  EmojiPlaces,
  EmojiSymbols,
  //@ts-ignore
} from '@phudak/ckeditor5-emoji/src'
import { PageBreak } from '@ckeditor/ckeditor5-page-break'
import { RemoveFormat } from '@ckeditor/ckeditor5-remove-format'
import { Font } from '@ckeditor/ckeditor5-font'

export class TextEditor extends ClassicEditor {}

TextEditor.builtinPlugins = [
  Essentials,
  Autoformat,
  Paragraph,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  Link,
  AutoLink,
]
TextEditor.defaultConfig = {
  toolbar: [
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'link',
    'bulletedList',
    'numberedList',
    '|',
    'undo',
    'redo',
  ],
}

export class HtmlEditor extends ClassicEditor {}

HtmlEditor.builtinPlugins = [
  Essentials,
  Autoformat,
  Bold,
  Italic,
  Code,
  Strikethrough,
  Subscript,
  Underline,
  Superscript,
  BlockQuote,
  Heading,
  Link,
  AutoLink,
  List,
  Paragraph,
  Image,
  ImageUpload,
  ImageCaption,
  Indent,
  IndentUI,
  IndentBlock,
  IndentEditing,
  MediaEmbed,
  Table,
  SourceEditing,
  CKFinder,
  UploadAdapter,
  Alignment,
  HorizontalLine,
  SpecialCharacters,
  SpecialCharactersEssentials,
  Emoji,
  EmojiPeople,
  EmojiNature,
  EmojiPlaces,
  EmojiFood,
  EmojiActivity,
  EmojiObjects,
  EmojiSymbols,
  EmojiFlags,
  PageBreak,
  RemoveFormat,
  Font,
]

HtmlEditor.defaultConfig = {
  toolbar: {
    shouldNotGroupWhenFull: true,
    items: [
      //basics
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'subscript',
      'superscript',
      'code',
      '|',
      'undo',
      'redo',
      '|',
      'sourceEditing',
      'selectAll',

      'blockQuote',
      'link',
      'ckfinder',
      'imageUpload',
      'heading',
      'imageTextAlternative',
      'toggleImageCaption',
      'indent',
      'outdent',
      'numberedList',
      'bulletedList',
      'mediaEmbed',
      'insertTable',
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'alignment',
      'horizontalLine',
      'specialCharacters',
      'emoji',
      'pageBreak',
      'removeFormat',
      'fontSize',
      'fontColor',
      'fontBackgroundColor',
    ],
  },
  language: 'en',
  ckfinder: {
    uploadUrl:
      'https://example.com/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images&responseType=json',
  },
}
