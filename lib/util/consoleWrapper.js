const clc = require('cli-color');
const winston = require('winston');
const subscriptions = require('../graphql/subscriptions');
const fs = require('fs-extra');
const path = require('path');

module.exports = (name, level = 6, cleanFile = true) => {
    let origConsole = {};
    const dataFolder = process.env.NAME || 'node1';
    const filepath = `data/${dataFolder}/combined.log`;

    //We make sure the path for the log file exists
    fs.ensureDirSync(path.dirname(filepath));
    if (cleanFile) {
        //we clean it up for a fresh run
        const fd = fs.openSync(filepath, 'w');
        fs.closeSync(fd);
    }

    const logger = winston.createLogger({
        transports: [
            new winston.transports.File({
                filename: filepath
            })
        ],
        exitOnError: false,
        flags: 'w'
    });

    logger.stream({ start: -1 }).on('log', log => {
        subscriptions.pubsub.publish(subscriptions.types.SERVER_LOG_UPDATE, {
            serverLogUpdate: log.message
        });
    });

    logger.on('error', function(err) {
        console.err(err);
        logger.log({ level: 'error', message: JSON.stringify(err) });
    });

    let simpleWrapper = (typeDescriptor, ...args) => {
        if (typeDescriptor.type == 'info' || typeDescriptor.type == 'assert') {
            const now = new Date();
            logger.log({
                level: 'info',
                message:
                    now.toLocaleTimeString() +
                    ' - ' +
                    name +
                    ': ' +
                    (args[0] ? args[0] : '')
            });
        }

        args[0] =
            new Date().toISOString() +
            ' - ' +
            typeDescriptor.color(typeDescriptor.type) +
            ' - ' +
            name +
            ': ' +
            (args[0] ? args[0] : '');

        if (typeDescriptor.level <= level || typeDescriptor.type == 'log') {
            origConsole.log(...args);
        }
    };

    let methods = [
        {
            type: 'dir',
            level: 7,
            color: clc.cyan,
            wrapper: simpleWrapper
        },
        {
            type: 'debug',
            level: 7,
            color: clc.magenta,
            wrapper: simpleWrapper
        },
        {
            type: 'time',
            level: 7,
            color: clc.magenta,
            wrapper: simpleWrapper
        },
        {
            type: 'timeEnd',
            level: 7,
            color: clc.magenta,
            wrapper: simpleWrapper
        },
        {
            type: 'trace',
            level: 7,
            color: clc.cyan,
            wrapper: simpleWrapper
        },
        {
            type: 'log',
            level: 6,
            color: clc.blue,
            wrapper: simpleWrapper
        },
        {
            type: 'info',
            level: 6,
            color: clc.blue,
            wrapper: simpleWrapper
        },
        {
            type: 'warn',
            level: 4,
            color: clc.yellow,
            wrapper: simpleWrapper
        },
        {
            type: 'error',
            level: 3,
            color: clc.red,
            wrapper: simpleWrapper
        },
        {
            type: 'assert',
            level: 3,
            color: clc.cyan,
            wrapper: simpleWrapper
        }
    ];

    methods.forEach(function(typeDescriptor) {
        origConsole[typeDescriptor.type] = console[typeDescriptor.type];
        console[typeDescriptor.type] = (...args) => {
            typeDescriptor.wrapper(typeDescriptor, ...args);
        };
    });
};
