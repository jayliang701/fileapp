/**
 * Created by Jay on 14-4-30.
 */
const App = require("weroll/App");
const app = new App();

const Setting = global.SETTING;

app.addTask(function (cb) {
    const Model = require("weroll/model/Model");
    Model.init(Setting.model, function (err) {
        cb(err);
    });
});
/* initialize MailUtil, SMSUtil, TemplateLib or whatever you want.
app.addTask(function(cb) {
    require("weroll/utils/MailUtil").init(Setting.mail, true);
    require("weroll/utils/TemplateLib").init({ sender:Setting.mail.sender });
    cb();
});
*/
app.addTask(function (cb) {
    /* register a middleware
    require("weroll/web/WebRequestPreprocess").inject("head", function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Credentials", true);
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Authorization, Accept, X-Requested-With");
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        next();
    });
    */
    /* custom view engine if you need, e.g: use ejs
    Setting.viewEngine = {
        //webApp: an instance of Express
        init: function(webApp, viewPath, useCache) {
            var engine = {};
            engine.$setFilter = function(key, func) {
                //do nothing
            };
            webApp.set('view engine', 'ejs');
            console.log("use view engine: ejs");
            return engine;
        }
    };
    */
   /* use APIServer
    const server = require("weroll/web/APIServer").createServer();
    server.start(Setting, (app) => {
        cb();
    });
     */
    //create and start a web application
    const webApp = require("weroll/web/WebApp").start(Setting, function (webApp) {
        /* setup Ecosystem if you need
        var Ecosystem = require("weroll/eco/Ecosystem");
        Ecosystem.init();
         */
        cb();
    });
    //extend WebApp if you need
    require("./server/WebAppExt").extend(webApp);
});

app.run();