
const width = 960;
const height = 540;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const pixels = ctx.createImageData(width, height);

function rect(x, y, w, h) {
    x = Math.round(x);
    y = Math.round(y);
    w = Math.round(w);
    h = Math.round(h);
    
    scope = this.find("BRUSH");
    for(let y0 = y; y0 < y + h; y0 += 1) {
        for(let x0 = x; x0 < x + w; x0 += 1) {
            if(0 <= x0 && x0 < width && 0 <= y0 && y0 < height) {
                let i = Math.ceil(4*(x0 + y0*width));
                pixels.data[i + 0] = scope["BRUSH"][0] || 0;
                pixels.data[i + 1] = scope["BRUSH"][1] || 0;
                pixels.data[i + 2] = scope["BRUSH"][2] || 0;
                pixels.data[i + 3] = 255;
            }
        }
    }
}

function circle(x, y, r) {
    x = Math.round(x);
    y = Math.round(y);
    r = Math.round(r);
    
    scope = this.find("BRUSH");
    for(let y0 = y - r; y0 < y + r; y0 += 1) {
        for(let x0 = x - r; x0 < x + r; x0 += 1) {
            const x_offset = x0 - x;
            const y_offset = y0 - y;
            const dist = x_offset*x_offset + y_offset*y_offset;
            if(0 <= x0 && x0 < width && 0 <= y0 && y0 < height && dist < r*r) {
                let i = 4*(x0 + y0*width);
                pixels.data[i + 0] = scope["BRUSH"][0];
                pixels.data[i + 1] = scope["BRUSH"][1];
                pixels.data[i + 2] = scope["BRUSH"][2];
                pixels.data[i + 3] = 255;
            }
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
    env["&&"] = function(a, b) {return a && b;};
    env["and"] = function(a, b) {return a && b;};
    env["||"] = function(a, b) {return a || b;};
    env["or"] = function(a, b) {return a || b;};
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
    env["sin"] = function(a) {return Math.sin(a);};
    env["cos"] = function(a) {return Math.sin(a);};
    env["tan"] = function(a) {return Math.sin(a);};

    env["rectangle"] = rect;
    env["circle"] = circle;

    env["BRUSH"] = [0, 0, 0, 255];
    env["ON-KEY-PRESS"] = function(k) {return;};

    // 'constants' (can actually be overwritten)
    env["HEIGHT"] = height;
    env["WIDTH"] = width;
    env["TIME"] = 0;
    env["KEY-1"] = "Digit1"
    env["KEY-2"] = "Digit2"
    env["KEY-3"] = "Digit3"
    env["KEY-4"] = "Digit4"
    env["KEY-5"] = "Digit5"
    env["KEY-6"] = "Digit6"
    env["KEY-7"] = "Digit7"
    env["KEY-8"] = "Digit8"
    env["KEY-9"] = "Digit9"
    env["KEY-0"] = "Digit0"
    env["KEY-A"] = "KeyA"
    env["KEY-B"] = "KeyB"
    env["KEY-C"] = "KeyC"
    env["KEY-D"] = "KeyD"
    env["KEY-E"] = "KeyE"
    env["KEY-F"] = "KeyF"
    env["KEY-G"] = "KeyG"
    env["KEY-H"] = "KeyH"
    env["KEY-I"] = "KeyI"
    env["KEY-J"] = "KeyJ"
    env["KEY-K"] = "KeyK"
    env["KEY-L"] = "KeyL"
    env["KEY-M"] = "KeyM"
    env["KEY-N"] = "KeyN"
    env["KEY-O"] = "KeyO"
    env["KEY-P"] = "KeyP"
    env["KEY-Q"] = "KeyQ"
    env["KEY-R"] = "KeyR"
    env["KEY-S"] = "KeyS"
    env["KEY-T"] = "KeyT"
    env["KEY-U"] = "KeyU"
    env["KEY-V"] = "KeyV"
    env["KEY-W"] = "KeyW"
    env["KEY-X"] = "KeyX"
    env["KEY-Y"] = "KeyY"
    env["KEY-Z"] = "KeyZ"
    env["KEY-UP"] = "ArrowUp"
    env["KEY-DOWN"] = "ArrowDown"
    env["KEY-LEFT"] = "ArrowLeft"
    env["KEY-RIGHT"] = "ArrowRight"
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
                    let scope = env.find(expr[1]) || env;
                    if(scope) {
                        scope[expr[1]] = eval(expr[2], env);
                    }
                    break;

                case "define":
                    if(!env[expr[1]]) {
                        env[expr[1]] = eval(expr[2], env);
                    }
                    break;

                case "lambda":
                    // TODO(tbt): functions with more than one argument
                    result = function() {
                        return eval(expr[2], makeEnv({ params: [expr[1]], args: arguments, outer: env }));
                    }
                    break;

                case "begin":
                    for(let i = 1; i < expr.length; i += 1) {
                        eval(expr[i], env);
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

let program = undefined;

function onInput() {
    program = parse(tokenise(window.editor.getValue()));
}

const frameTime = 30;

function update() {
    if(program) {
        for(let i = 0; i < width*height*4; i += 1) {
            pixels.data[i] = 255;
        }
        eval(program, globalEnv);
        ctx.putImageData(pixels, 0, 0);
    }
    globalEnv["TIME"] += frameTime / 1000;
}

function onKeyDown(e) {
    globalEnv["ON-KEY-PRESS"].call(globalEnv, e.code);
}

function onLoad () {
    window.editor = monaco.editor.create(document.getElementById("editor"), {
        theme: 'vs-dark',
        value: `
(begin
    (define x 100)

    (set! ON-KEY-PRESS (lambda k (begin
        (if (== k KEY-LEFT)
            (set! x (- x 32))
        (if (== k KEY-RIGHT)
            (set! x (+ x 32))
        ))
    )))

    (set! update (lambda t (begin
        (set! anim (* (sin t) (sin t)))
        (set! BRUSH (list 255 0 (* anim 255)))
        (rectangle x (- HEIGHT 64) 256 32)
    )))

    (update TIME)
)
`,
        // TODO(tbt): custom highlighting
        language: 'scheme'
    });
    window.editor.getModel().onDidChangeContent((event) => {
        onInput();
      });
    
    window.addEventListener("keydown", onKeyDown, false);

    onInput();
    update();
    setInterval(update, frameTime);
}
