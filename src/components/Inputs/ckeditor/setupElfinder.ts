//SOURCE: https://github.com/Studio-42/elFinder/wiki/Integration-with-CKEditor-5
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

// elfinder folder hash of the destination folder to be uploaded in this CKeditor 5
const uploadTargetHash = 'l1_Lw'

export const setupElfinder = (editor: ClassicEditor, connectorUrl: string) => {
  const ckf = editor.commands.get('ckfinder'),
    fileRepo = editor.plugins.get('FileRepository'),
    ntf = editor.plugins.get('Notification'),
    i18 = editor.locale.t,
    // Insert images to editor window
    insertImages = (urls: string[]) => {
      const imgCmd = editor.commands.get('imageUpload')
      if (!imgCmd?.isEnabled) {
        ntf.showWarning(
          i18('Could not insert image at the current position.'),
          {
            title: i18('Inserting image failed'),
            namespace: 'ckfinder',
          },
        )
        return
      }
      editor.execute('imageInsert', { source: urls })
    },
    // To get elFinder instance
    getfm = (open?: string) => {
      return new Promise((resolve, reject) => {
        // Execute when the elFinder instance is created
        const done = () => {
          if (open) {
            // request to open folder specify
            if (!Object.keys(_fm.files()).length) {
              // when initial request
              _fm.one('open', () => {
                //@ts-ignore
                _fm.file(open) ? resolve(_fm) : reject(_fm, 'errFolderNotFound')
              })
            } else {
              // elFinder has already been initialized
              new Promise((res, rej) => {
                if (_fm.file(open)) {
                  //@ts-ignore
                  res()
                } else {
                  // To acquire target folder information
                  _fm
                    .request({ cmd: 'parents', target: open })
                    .done(() => {
                      //@ts-ignore
                      _fm.file(open) ? res() : rej()
                    })
                    .fail(() => {
                      rej()
                    })
                }
              })
                .then(() => {
                  // Open folder after folder information is acquired
                  _fm
                    .exec('open', open)
                    .done(() => {
                      resolve(_fm)
                    })
                    .fail((err: any) => {
                      //@ts-ignore
                      reject(_fm, err ? err : 'errFolderNotFound')
                    })
                })
                .catch((err) => {
                  //@ts-ignore
                  reject(_fm, err ? err : 'errFolderNotFound')
                })
            }
          } else {
            // show elFinder manager only
            resolve(_fm)
          }
        }

        // Check elFinder instance
        if (_fm) {
          // elFinder instance has already been created
          done()
        } else {
          // To create elFinder instance
          _fm = $('<div/>')
            //@ts-ignore
            .dialogelfinder({
              // dialog title
              title: 'File Manager',
              // connector URL
              url: connectorUrl,
              // start folder setting
              startPathHash: open ? open : void 0,
              // Set to do not use browser history to un-use location.hash
              useBrowserHistory: false,
              // Disable auto open
              autoOpen: false,
              // elFinder dialog width
              width: '80%',
              // set getfile command options
              commandsOptions: {
                getfile: {
                  oncomplete: 'close',
                  multiple: true,
                },
              },
              // Insert in CKEditor when choosing files
              getFileCallback: (
                files: Array<{ mime: string; url: string }>,
                fm: {
                  getUI: (dir: 'cwd') => {
                    trigger: (action: 'unselectall') => void
                  }
                  convAbsUrl: (url: string) => string
                },
              ) => {
                const imgs: string[] = []
                fm.getUI('cwd').trigger('unselectall')
                $.each(files, function (i: any, f: any) {
                  const url = f.url.replace(window.origin, '')
                  if (f && f.mime.match(/^image\//i)) {
                    imgs.push(url)
                  } else {
                    editor.execute('link', url)
                  }
                })
                if (imgs.length) {
                  insertImages(imgs)
                }
              },
              themes: {
                default:
                  'https://cdnjs.cloudflare.com/ajax/libs/elfinder/2.1.65/css/theme.min.css',
              },
              theme: 'default',
            })
            .elfinder('instance')
          done()
        }
      })
    }

  // elFinder instance
  let _fm: any

  if (ckf) {
    // Take over ckfinder execute()
    ckf.execute = () => {
      getfm().then((fm) => {
        ;(
          fm as {
            getUI: () => { dialogelfinder: (action: 'open') => void }
          }
        )
          .getUI()
          .dialogelfinder('open')
      })
    }
  }

  // Make uploader
  const uploder = function (
    this: any,
    loader: { file: Promise<any> | { then: () => void } },
  ) {
    const upload = function (
      file: any,
      resolve: (arg: { default: any }) => any,
      reject: (reason: string) => any,
    ) {
      getfm(uploadTargetHash)
        .then((fm: any) => {
          const fmNode = fm.getUI()
          fmNode.dialogelfinder('open')
          fm.exec(
            'upload',
            { files: [file], target: uploadTargetHash },
            void 0,
            uploadTargetHash,
          )
            .done(
              (data: { added: Array<Record<string, any>>; error?: any }) => {
                if (data.added && data.added.length) {
                  fm.url(data.added[0].hash, { async: true })
                    .done(function (url: string) {
                      resolve({
                        default: url.replace(window.origin, ''),
                      })
                      fmNode.dialogelfinder('close')
                    })
                    .fail(function () {
                      reject('errFileNotFound')
                    })
                } else {
                  reject(fm.i18n(data.error ? data.error : 'errUpload'))
                  fmNode.dialogelfinder('close')
                }
              },
            )
            .fail((err: Error) => {
              const error = fm.parseError(err)
              reject(
                fm.i18n(
                  error
                    ? error === 'userabort'
                      ? 'errAbort'
                      : error
                    : 'errUploadNoFiles',
                ),
              )
            })
        })
        //@ts-ignore
        .catch((fm, err) => {
          const error = fm.parseError(err)
          reject(
            fm.i18n(
              error
                ? error === 'userabort'
                  ? 'errAbort'
                  : error
                : 'errUploadNoFiles',
            ),
          )
        })
    }

    this.upload = function () {
      return new Promise(function (resolve, reject) {
        if (
          loader.file instanceof Promise ||
          (loader.file && typeof loader.file.then === 'function')
        ) {
          loader.file.then(function (file) {
            upload(file, resolve, reject)
          })
        } else {
          upload(loader.file, resolve, reject)
        }
      })
    }
    this.abort = function () {
      _fm && _fm.getUI().trigger('uploadabort')
    }
  }

  // Set up image uploader
  fileRepo.createUploadAdapter = (loader) => {
    //@ts-ignore
    return new uploder(loader)
  }
}
