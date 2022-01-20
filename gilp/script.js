
const width = 960;
const height = 540;

let inputText = undefined;
let canvas = undefined;
let ctx = undefined;
let pixels = undefined;

function rect(x, y, w, h) {
    for(let y0 = y; y0 < y + h; y0 += 1) {
        for(let x0 = x; x0 < x + w; x0 += 1) {
            let i = 4*(x0 + y0*width);
            pixels.data[i + 0] = 0;
            pixels.data[i + 1] = 0;
            pixels.data[i + 2] = 0;
            pixels.data[i + 3] = 255;
        }
    }
}

function makeEnv(obj) {
    var env = {};
    var outer = obj.outer || {};

    if(0 != obj.params.length) {
        for(let i = 0; i < obj.params.length; i += 1) {
            env[obj.params[i]] = obj.args[i];
        }
    }

    env.find = function(variable) {
        let result = undefined;
        if (variable in env) {
            result = env;
        } else if(typeof outer.find == "function") {
            result = outer.find(variable);
        }
        return result;
    }

    return env;
}

function makeGlobalEnv() {
    var env = makeEnv({ params: [], args: [],  outer: undefined });
    env["+"] = function(a, b)  {return a + b;};
    env["-"] = function(a, b)  {return a - b;};
    env["*"] = function(a, b)  {return a * b;};
    env["/"] = function(a, b)  {return a / b;};
    env[">"] = function(a, b)  {return a > b;};
    env["<"] = function(a, b)  {return a < b;};
    env[">="] = function(a, b) {return a >= b;};
    env["<="] = function(a, b) {return a <= b;};
    env["=="] = function(a, b) {return a == b;};
    env["remainder"] = function(a, b) {return a % b;};
    env["equal?"] = function(a, b) {return a == b;};
    env["eq?"] = function(a, b) {return a == b;};
    env["not"] = function(a, b) {return !a;};
    env["length"] = function(a, b) {return a.length;};
    env["cons"] = function(a, b) {return a.concat(b);};
    env["car"] = function(a, b) {return (a.length !== 0) ? a[0] : null;};
    env["cdr"] = function(a, b) {return (a.length > 1) ? a.slice(1) : null;};
    env["append"] = function(a, b) {return a.concat(b);};
    env["list"] = function() {return Array.prototype.slice.call(arguments);};
    env["list?"] = function(a) {return (a instanceof Array);};
    env["null?"] = function(a) {return (a.length == 0);};
    env["symbol?"] = function(a) {return (typeof a == "string");};
    env["width"] = width;
    env["height"] = height;
    env["rectangle"] = rect;
    return env;
}

let globalEnv = makeGlobalEnv();

function eval(expr, env) {
    let result = undefined;

    if(expr) {
        if(typeof expr == "string") {
            const identifier = expr.valueOf();
            const scope = env.find(identifier);
            if(scope) {
                result = scope[identifier];
            }
        } else if(typeof expr == "number") {
            result = expr;
        } else if(expr.length > 0) {
            switch(expr[0]) {
                case "quote":
                    result = expr[1];
                    break;

                case "if":
                    let cond = expr[1];
                    let ifBlock = expr[2];
                    let elseBlock = expr[3];
                    if(eval(cond, env)) {
                        eval(ifBlock, env);
                    } else {
                        eval(elseBlock, env);
                    }
                    break;

                case "set!":
                    let scope = env.find(expr[1]);
                    if(scope) {
                        scope[expr[2]] = eval(expr[2], env);
                    }
                    break;

                case "define":
                    env[expr[1]] = eval(expr[2], env);
                    break;

                case "lambda":
                    result = function() {
                        return eval(expr[2], makeEnv({ params: expr[1], args: arguments, outer: env }));
                    }
                    break;

                case "begin":
                    for(e in expr) {
                        eval(e, env);
                    }
                    break;

                default:
                    var args = [];
                    for (let i = 0; i < expr.length; i += 1) {
                        args[i] = eval(expr[i], env);
                    }
                    proc = args.shift();
                    result = proc.apply(env, args);
                    break;
            }
        }
    }

    return result;
}

function tokenise(input) {
    tokens = input.replace(/\(/g, " ( ").replace(/\)/g, " ) ").trim().split(/\s+/);
    return tokens;
}

function parse(tokens) {
    let result = undefined;

    if (tokens.length > 0) {
        let token = tokens.shift();
        if ("(" == token){
            result = [];
            while (")" != tokens[0]) {
                const parsed = parse(tokens);
                if(typeof parsed == "undefined") {
                    break;
                }
                result.push(parsed);
            }
            tokens.shift();
        } else if (")" != token) {
                result = atom(token);
        }
    }

    return result;
}

function atom(token){
    let result = token;
    if (!isNaN(token)) {
        result = parseFloat(token);
    }
    return result;
}

function update() {
   for(let i = 0; i < width*height*4; i += 1) {
       pixels.data[i] = 255;
   }
   program = parse(tokenise(inputText.value));
   console.log(eval(program, globalEnv));
   ctx.putImageData(pixels, 0, 0);
}

function onLoad() {
    inputText = document.getElementById("inputText");
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    pixels = ctx.createImageData(width, height);

    update();
}

