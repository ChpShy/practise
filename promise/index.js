// 特性：
// 1. 三种状态，pending、fulfilled、rejected，状态一经更改，不可逆转；
// 2. then或者catch可放在任意位置或者延迟中执行；
// 3. all、race方法
// 4. promise.resolve和promise.reject可直接执行
// 5. 链式调用，如果then没有传入任何函数，则继续向下传递

function my_promise(fn) {
    this.status = 'pending';
    this.content = null;
    this.resolveFunc = null;
    fn(this.resolve.bind(this), this.resolve.bind(this));
}
my_promise.resolve = function(content) {
    return new my_promise((resolve) => {
        resolve(content);
    })
}
my_promise.reject = function(content) {
    return new my_promise((resolve, reject) => {
        reject(content);
    })
}
my_promise.prototype.resolve = function(content) {
    if (this.status == 'pending')
    this.status = 'fulfilled';
    this.content = content;
    if (this.resolveFunc) {
        //setTimeout模拟异步
       setTimeout(() => {
        this.resolveFunc(content);
       }, 0)
    }
}
my_promise.prototype.reject = function(content) {
    this.status = 'rejected';
    this.content = content;
}
my_promise.prototype.then = function(fn1, fn2) {
    if (this.status == 'pending') {
        //链式调用，应该是数组
        this.resolveFunc = fn1;
    } else {
        return new my_promise((onResolve, onReject) => {
            setTimeout(() => {
                //setTimeout模拟异步
                var res =  fn1(this.content);
                if (res) {
                    if (res instanceof my_promise) {
                         res.then(onResolve, onReject);
                    } else  {
                        if (this.status == 'fulfilled') {
                            onResolve(res);
                        } else {
                             onReject(res);
                        }
                    }
                    
                } else {
                    if (this.status == 'fulfilled') {
                        onResolve(null);
                    } else {
                         onReject(null);
                    }
                }
            })
        })
    }
}

//测试代码
my_promise.deferred = my_promise.defer = function() {
    var dfd = {}
    dfd.promise = new my_promise(function(fulfill, reject) {
        dfd.resolve = fulfill
        dfd.reject = reject
    })
    return dfd
}

window.my_promise = my_promise;
// module.exports = my_promise;

console.log(1);

var myPro = new my_promise((resolve, reject) => {
    console.log(2);
    resolve(5);
    console.log(3);
})
myPro.then(res => {
    console.log(res);
}).then(res => {
    console.log(res);
})
console.log(4);