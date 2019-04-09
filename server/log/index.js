const path = require('path');
const log4js = require('log4js');
const config = require('../config');

let levels = {
    trace: log4js.levels.TRACE.levelStr,
    debug: log4js.levels.DEBUG.levelStr,
    info: log4js.levels.INFO.levelStr,
    warn: log4js.levels.WARN.levelStr,
    error: log4js.levels.ERROR.levelStr,
    fatal: log4js.levels.FATAL.levelStr
};

let layout = {
    type: 'pattern',
    pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] [%z] [%c{50}] >>> [%c] json={} msg=%m%n'
};
let appenders = process.env.NODE_ENV == 'production' ? ['default'] : ['console'];
log4js.configure({
    appenders: {
        default: {
            type: 'dateFile',
            filename: config.logPath,
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            layout: layout
        },
        console: {
            type: 'console',
            layout: layout
        }
    },
    categories: {
        default: {
            appenders: appenders,
            level: levels.info
        },
        console: {
            appenders: appenders,
            level: process.env.NODE_ENV == 'production' ? levels.warn : levels.info
        }
    }
    // pm2: true,
    // pm2InstanceVar: 'INSTANCE_ID'
});

const logger = log4js.getLogger('console');
console.log = logger.info.bind(logger);

module.exports.getLogger = function(name) {
    let logger = log4js.getLogger(name || 'default');
    logger.level = levels.info;
    return logger;
};