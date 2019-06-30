const debug = require('debug')('yuki:textInterceptor')

export default class TextInterceptorMiddleware
  implements yuki.Middleware<yuki.TextOutputObject> {
  private removeAscii: boolean
  private deduplicate: boolean
  private deduplicateLine: boolean

  constructor (config: yuki.Config.Texts['modifier']) {
    this.removeAscii = config.removeAscii
    this.deduplicate = config.deduplicate
    this.deduplicateLine = config.deduplicateLine
    debug('initialized')
  }

  public process (
    context: yuki.TextOutputObject,
    next: (newContext: yuki.TextOutputObject) => void
  ) {
    if (this.removeAscii) {
      context.text = context.text.replace(/[\x00-\xFF]+/g, '')
      if (context.text === '') return
    }
    if (this.deduplicate) {
      context.text = context.text.replace(/(\S+)\1/g, '$1')
      if (context.text === '') return
    }
    if (this.deduplicateLine) {
      //hardcoded as 5, might be dangerous
      if (context.text.length > 5){
          var header = context.text.substring(0,5);
          var parts = context.text.split(header);
          context.text = header + parts[parts.length - 1];
      }
      if (context.text === '') return
    }
    next(context)
  }
}
