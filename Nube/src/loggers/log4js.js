import log4js from 'log4js'

log4js.configure({
    appenders: {
        miLogggerConsoleInfo: { type:'console'},
        miLogggerFileWarn: { type:'file', filename: 'warn.log'},
        miLogggerFileError: { type:'file', filename: 'error.log'}
    },
    categories: {
        default: { appenders: ["miLogggerConsoleInfo"], level: "info"},
        warn: { appenders: ["miLogggerFileWarn"], level: "warn"},
        error: { appenders: ["miLogggerFileError"], level: "error"}
    }
})

const loggerDefault = log4js.getLogger('default');
const loggerWarn = log4js.getLogger('warn');
const loggerError = log4js.getLogger('error');

export { loggerDefault, loggerWarn, loggerError }
