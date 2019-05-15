/**
 * Created by Jay on 2016/3/8.
 */

//var Session = require("weroll/model/Session");

const fs = require('fs');
const path = require('path');
const cpFile = require('cp-file');
const Utils = require('weroll/utils/Utils');

const folder = path.resolve(global.APP_ROOT, 'files');
const tmpFolder = path.resolve(global.APP_ROOT, 'tmp');

fs.mkdirp(tmpFolder);

const readFileList = (folder) => {
    return new Promise((resolve, reject) => {
        fs.readdir(folder, (err, files) => {
            if (err) return reject(err);
            resolve(files || []);
        });
    });
}

const deleteFile = (file) => {
    return new Promise((resolve) => {
        fs.unlink(file, (err) => {
            if (err) console.error(err);
            resolve();
        });
    });
}

exports.extend = function(App) {
    //no any session check
    App.handleUserSession = function(req, res, auth) {
        return new Promise(resolve => {
            const user = { isLogined:false };
            resolve(user);
        });
    };
    
    App.get('/file/tmp/:name', (req, res) => {
        let file = path.resolve(tmpFolder, req.params.name);
        res.sendFile(file, (err) => {
            if (err) {
                res.writeHead(404);
                return res.end(err.message);
            }
            deleteFile(file);
        });
    });


    App.get('/file/random', async (req, res) => {
        let files = await readFileList(folder);

        if (files.length <= 0) {
            res.writeHead(200, {
                'Content-Type': 'text/plain; charset=utf-8',
            });
            return res.end('');
        }
        
        let index = Math.floor(Math.random() * files.length);
        let tmpFilename = 'tmp-' + Utils.randomString(12) + '-' + files[index];
        let tmp = path.resolve(tmpFolder, tmpFilename);
        let file = path.resolve(folder, files[index]);

        await cpFile(file, tmp);

        await deleteFile(file);

        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
        });

        res.end(global.SETTING.site + 'file/tmp/' + tmpFilename);
    });
}