const clc = require('cli-color');
const winston = require('winston');
const subscriptions = require('../graphql/subscriptions');
const fs = require('fs-extra');
const path = require('path');

module.exports = (name, level = 6) => {
    let origConsole = {};
    const dataFolder = process.env.NAME || 'node1';
    const filepath = `data/${dataFolder}/combined.log`;

    fs.ensureDirSync(path.dirname(filepath));
    //const log = fs.openSync(filepath, 'w');

    const logger = winston.createLogger({
        transports: [
            new winston.transports.File({
                filename: filepath
            })
        ],
        flags: 'w'
    });

    logger.stream({ start: -1 }).on('log', log => {
        subscriptions.pubsub.publish(subscriptions.types.SERVER_LOG_UPDATE, {
            serverLogUpdate: log.message
        });
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
