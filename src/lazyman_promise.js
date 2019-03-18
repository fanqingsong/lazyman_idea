

function _LazyMan(name) {

    this.promiseGetters = [];

    var makePromise = function  () {
        var promiseObj = new Promise(function(resolve, reject){
            console.log("Hi! This is " + name + "!");

            resolve();
        })

        return promiseObj;
    }

    this.promiseGetters.push(makePromise);

    // 在各个Promise的then函数中，将任务序列穿起来
    var self = this;
    var sequence = Promise.resolve();
    // Promise.resolve 等价于
    // var sequence = new Promise(function (resolve, reject) {
    //     resolve();
    // })
    setTimeout(function(){
        for (var i = 0; i < self.promiseGetters.length; i++) {
            var nowPromiseGetter = self.promiseGetters[i];
            var thenFunc = (function (nowPromiseGetter) {
                return function  () {
                    return nowPromiseGetter()
                }
            })(nowPromiseGetter);

            sequence = sequence.then(thenFunc);
        };

    }, 0); // 在下一个事件循环启动任务
}

_LazyMan.prototype.eat = function(name) {
    var makePromise = function  () {
        var promiseObj = new Promise(function(resolve, reject){
            console.log("Eat " + name + "~");

            resolve();
        })

        return promiseObj;
    }

    this.promiseGetters.push(makePromise);

    return this; // 实现链式调用
}

_LazyMan.prototype.sleep = function(time) {
    var makePromise = function  () {
        var promiseObj = new Promise(function(resolve, reject){

            setTimeout(function(){

                console.log("Wake up after " + time + "s!");

                resolve();

            }, time * 1000);
        })

        return promiseObj;
    }

    this.promiseGetters.push(makePromise);

    return this;
}

/* 封装 */

function LazyMan(name){

    return new _LazyMan(name);

}

LazyMan("Hank").sleep(1).eat("dinner")

