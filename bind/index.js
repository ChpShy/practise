
Function.prototype._bind = _bind;
function _bind() {
    let _this = this;
    let args = [...arguments];
    let fn = function() {
        _this.apply(args[0], args.slice(1));
    }
    //添加原函数所有的prototype的值
    fn.prototype = this.prototype;
    return fn
}
function Test() {
    console.log(this.a);
    console.log(arguments);
    this.click();
    console.log(this.a);
}

var that = {
    a: 1,
    click: function() {
        this.a++;
    }
}
Test._bind(that, 11, 2, 3)();