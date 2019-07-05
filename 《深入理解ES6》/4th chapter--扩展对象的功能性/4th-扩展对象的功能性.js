/**
 * Created on 20180501
 * 20190705 edit
 */

/**
 * ### P73 - 属性初始值的简写:
 *  - 当一个对象的属性与本地变量同名时，不必再写冒号和值，简单地只写属性名即可。
 */
function createperson(name, age) {
    return {
        // 原始写法 name: name,  age: age
        // 简写
        name, age
    }
}

/** ### P74 - 对象方法的简写语法 */
const person = {
    name: "Nicholas",
    sayName() {
        console.log(this.name);
    }
};


/** ### P75 - 可计算属性名 (Computed Property Name) */
let people = {};
let lastName = "last name";
// 如果想通过计算得到属性名，就需要用方括号来代替点记法。
people["first name"] = "Nicholas";
people[lastName] = 'Zakas';
console.log(people["first name"]);
console.log(people[lastName]);

// 示例:
// 20180913-add: 来自: https://vuex.vuejs.org/zh/guide/mutations.html
// mutation-types.js
// export const SOME_MUTATION = "SOME_MUTATION";
// // store.js
// import { SOME_MUTATION } from "./mutation-types"
// const store = new Vuex.Store({
//     state: { ... },
//     mutations: {
//         // 使用"计算属性命名"功能来使用一个常量作为函数名
//         [SOME_MUTATION]: function(state){
//             // mutate state
//         }
//     }
// });


/** ### P76 - 新增方法: Object.is(): 弥补全等运算符的不准确运算。*/
// 比如之前 +0等于-0, NaN不等于NaN, 使用后:
console.log(+0 === -0);            // true
console.log(NaN === NaN);          // false

console.log(Object.is(+0, -0));   // false
console.log(Object.is(NaN, NaN));  // true


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/* - assign [ə'saɪn] ~~~v.分配，指定, 派，调派
 * - receiver /rɪ'siːvə/ ~~~n.接收器
 * - supplier /səˈplaɪə/ ~~~n.提供者*/

// - 混合(Mixin)是 js 中实现对象组合的一种模式。在一个 mixin 方法中，一个对象
//   接受来自另一个对象的属性和方法。许多 js 库中都有类似的 mixin 方法:
function mixin(receiver, supplier) {
    // (1)、
    Object.keys(supplier).forEach(function (key) {
        receiver[key] = supplier[key];
    })
}

function EventTarget() { }
EventTarget.prototype = {
    constructor: EventTarget,
    emit: function (parameter) {
        console.log(parameter);
    },
    on: function () { /**/
    }
};
const myObj = {};
// (2)、
mixin(myObj, EventTarget.prototype);
/* - (1)、
 *   + Object.keys() 方法取得对象上所有可枚举的实例属性。这个方法接受一个对象作为参数，
 *      返回一个包含所有可枚举属性的字符串数组。
 *   + 示例见: 《js高级程序设计》\js高程学习笔记\js高程--Object.keys().js
 *
 * - (2)、
 *   + mixin() 函数遍历 supplier 的自有属性赋并复制到 receiver 中(此处的复制只是浅复制，
 *      当属性值为对象时只复制对象的引用)。这样一来，receiver 不通过继承就可以获得新属性，
 *      请参考这段代码:
 */
// myObj 接受 EventTarget.prototype 对象的所有行为从而使 myObj 可以通过 emit() 方法
// 发布事件或通过 on() 方法订阅事件。
myObj.emit("somethingChanged");     // somethingChanged


// - ES6 新增方法: Object.assign():
//  + 上面的 mixin() 调用可以直接替换为 -- ES6 的 Object.assign().
//    即使这样 Object.assign() 仍然是潜拷贝。
Object.assign(myObj, EventTarget.prototype);
myObj.emit("somethingChange again");

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


/** ### P81 自由属性枚举顺序 */
// - ES5 Object.getOwnPropertyNames(): 【取得自身的属性名】
// - ES6 规定了对象的自有属性被枚举时的返回顺序，这会影响到 Object.getOWnPropertyNames()
//   【取得自身的属性名】方法及 Reflect.ownKeys (将在第 12 章讲解) 返回属性的方式，
//   Object.assign() 方法处理属性的顺序也将随之改变。 例如:
let aObj = {
        a: 1,
        0: 1,
        c: 1,
        2: 1,
        b: 1,
        1: 1
    };
aObj.d = 1;

// js高程: chapter5: join()方法：数组方法。只接收一个参数，即用作分隔符的字符串，
// 返回包含所有数组项的字符串。
console.log(Object.getOwnPropertyNames(aObj)); // [ '0', '1', '2', 'a', 'c', 'b', 'd' ]
console.log(Object.getOwnPropertyNames(aObj).join("")); // 012acbd


/** ### P82 增强对象原型 */
// - 增强对象原型: ES5 添加的 Object.getPrototypeOf() 方法返回任意指定对象的原型。
//   对象原型的真实值被存储在内部专用属性 [[Prototype]] 中，调用 getPrototypeOf() 方法
//   返回存储在其中的值。(get prototype of 获得原型)
// - 改变对象的原型:
//      + ES6 添加了 Object.setPrototypeOf() 方法可以改变任意指定对象的原型。
//        接受2个参数:
//          - (1) 被改变原型的对象。
//          - (2) 替代第一个参数原型的对象。
let animal = {
    getGreeting() {
        return "Hello";
    }
};
let dog = {
    getGreeting() {
        return "woof";
    }
};

// ES5 提供了 Object.create 方法，可以用来克隆对象。 示例: ECMAScript6-Study\
// Javascript设计模式与编程实践\第一部分--基础知识\第1章\P14-Object.create.js.
// 使用 create 方法克隆一个 animal 对象
let friend = Object.create(animal);
console.log(friend.getGreeting());          // Hello
console.log(Object.getPrototypeOf(friend)); // { getGreeting: [Function: getGreeting] }
console.log(Object.getPrototypeOf(friend) === animal); // true

// 使用 Object.setPrototypeOf() 把原型设置为 dog
Object.setPrototypeOf(friend, dog);
console.log(friend.getGreeting());          // woof
console.log(Object.getPrototypeOf(friend) === dog);    // true


/** ### P83 简化原型访问的 Super 引用 */
// - 正如前面所提及的，原型对于 JavaScript 而言非常重要，ECMAScript 6 中许多改进的
//   最终目标就是为了使其更易用。以此为目标，ECMAScript 6 引入了 Super 应用的特性，使用它
//   可以更便捷地访问对象原型。

let person02= {
    getGreeting() {
        return "Hello";
    }
};
let dog02 = {
    getGreeting() {
        return "Woof";
    }
};
let friend02 = {
    getGreeting() {
        // - ES5 中如果你想重写对象实例的方法，又需要调用与它同名的原型方法的写法。
        // return Object.getPrototypeOf(this).getGreeting.call(this) + ", hi!";

        // - ES6 为了减少上面调用原型上的方法的复杂度，引入了 super 关键字。简单来说，
        //   Super 引用相当于指向对象原型的指针，实际上也就是 Object.getPrototypeOf(this)
        //   的值。调用 super.getGreeting() 方法 相当于 调用上面 ES5 写法。
        //   🔺 注意: super 的写法必须要在使用简写方法的对象中使用。(即: getGreeting(){})
        return super.getGreeting() + ", hi!";
    }
};

// 将原型设置为 person02
Object.setPrototypeOf(friend02, person02);
console.log(friend02.getGreeting());    // Hello, hi!
console.log(Object.getPrototypeOf(friend02) === person02);  // true

// 将原型设置为 dog02
Object.setPrototypeOf(friend02, dog02);
console.log(friend02.getGreeting()); // Woof, hi!
console.log(Object.getPrototypeOf(friend02) === dog02); // true

/** ### Super 引用在多重继承中的使用: */
// 讲解示例，当前文件夹: P85-Super 引用在多重继承中的使用


/**
 * ### 正式的方法定义
 *  - 在 ES6 以前从未正式定义 "方法" 的概念，方法仅仅是一个具有功能而非数据的对象属性。而在
 *    ES6 中正式定义方法为一个函数，它会有一个内部的 [[HomeObject]] 属性来容纳这个方法
 *    从属的对象。
 */
(function() {
    // (1)、
    let person = {
        // 是方法
        getGreeting() {
            return "Hello";
        }
    };

    // 不是方法
    function shareGreeting() {
        return "Hi!";
    }

    // > 注释:
    // - (1)、这个示例中定义了 person 对象，它有一个 getGreeting() 方法，由于直接把函数
    //   赋值给了 person 对象，因而 getGreeting() 方法的 [[HomeObject]] 属性值为
    //   person。而创建 shareGreeting() 函数时，由于未将其赋值给一个对象，因而该方法没有
    //   明确定义 [[HomeObject]] 属性。在大多数情况下这点小差别无关紧要，但是当使用 Super
    //   引用时这就变得非常重要了。
})();
