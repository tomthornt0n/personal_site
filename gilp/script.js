
const width = 960;
const height = 540;

const canvas = document.getElementById("canvas");
const shellInput = document.getElementById("shellInput");
const ctx = canvas.getContext("2d");

let isPaused = false;

function rgbStringFromCurrentBrush(env) {
    const scope = env.find("brush");
    const brush = scope["brush"];
    const result = "rgb(" + String(brush[0]) + ", " + String(brush[1]) + ", " + String(brush[2]) + ")";
    return result;
}

function rect(x, y, w, h) {
    ctx.fillStyle = rgbStringFromCurrentBrush(this);
    ctx.fillRect(x, y, w, h);
}

function circle(x, y, r) {
    ctx.fillStyle = rgbStringFromCurrentBrush(this);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI);
    ctx.fill();
}

function makeEnv(obj) {
    var env = {};
    var outer = obj.outer || {};

    if(0 !== obj.params.length) {
        for(let i = 0; i < obj.params.length; i += 1) {
            env[obj.params[i]] = obj.args[i];
        }
    }

    env.find = function(variable) {
        let result = undefined;
        if (variable in env) {
            result = env;
        } else if(typeof outer.find === "function") {
            result = outer.find(variable);
        }
        return result;
    }

    return env;
}

function sum(list) {
    return Array.prototype.slice.call(list).reduce(function(a, b) {return a + b}, 0);
}

function product(list) {
    return Array.prototype.slice.call(list).reduce(function(a, b) {return a * b}, 1);
}

function makeGlobalEnv() {
    var env = makeEnv({ params: [], args: [],  outer: undefined });

    // functions
    env["+"] = function()  {return sum(arguments)};
    env["-"] = function()  {if(arguments.length > 1) {return arguments[0] - sum(Array.prototype.slice.call(arguments, 1));} else {return -1*arguments[0]}};
    env["*"] = function()  {return product(arguments);};
    env["/"] = function()  {if(arguments.length > 1) {return arguments[0] / product(Array.prototype.slice.call(arguments, 1));} else {return 1 / arguments[0]}};
    env[">"] = function(a, b)  {return a > b;};
    env["<"] = function(a, b)  {return a < b;};
    env[">="] = function(a, b) {return a >= b;};
    env["<="] = function(a, b) {return a <= b;};
    env["="] = function(a, b) {return a === b;};
    env["[]"] = function(list, i) {return list[i]}
    env["and"] = function(a, b) {return a && b;};
    env["or"] = function(a, b) {return a || b;};
    env["abs"] = function(a) {return Math.abs(a);};
    env["expt"] = function(a, b) {return Math.pow(a, b);};
    env["remainder"] = function(a, b) {return a % b;};
    env["modulo"] = function(a, b) {return Math.abs(a % b);};
    env["not"] = function(a) {return !a;};
    env["length"] = function(a) {return a.length;};
    env["cons"] = function(a, b) {return a.concat(b);};
    env["car"] = function(a) {return (a.length !== 0) ? a[0] : null;};
    env["cdr"] = function(a) {return (a.length > 1) ? a.slice(1) : null;};
    env["append"] = function(a, b) {return a.concat(b);};
    env["list"] = function() {return Array.prototype.slice.call(arguments);};
    env["list?"] = function(a) {return (a instanceof Array);};
    env["null?"] = function(a) {return (a.length === 0);};
    env["lambda?"] = function(a) {return (typeof a === "function");};
    env["sin"] = function(a) {return Math.sin(a);};
    env["cos"] = function(a) {return Math.sin(a);};
    env["tan"] = function(a) {return Math.sin(a);};
    env["map"] = function(proc, list) {for(element in list) {proc.call(this, element)}};
    // TODO(tbt): filter and reduce
    env["rectangle"] = rect;
    env["circle"] = circle;
    env["on_key_press"] = function(k) {return;};

    // values
    env["brush"] = [255, 255, 255];
    env["#t"] = true;
    env["#f"] = false;
    env["#height"] = height;
    env["#width"] = width;
    env["#time"] = 0;
    env["#key_1"] = "Digit1"
    env["#key_2"] = "Digit2"
    env["#key_3"] = "Digit3"
    env["#key_4"] = "Digit4"
    env["#key_5"] = "Digit5"
    env["#key_6"] = "Digit6"
    env["#key_7"] = "Digit7"
    env["#key_8"] = "Digit8"
    env["#key_9"] = "Digit9"
    env["#key_0"] = "Digit0"
    env["#key_a"] = "KeyA"
    env["#key_b"] = "KeyB"
    env["#key_c"] = "KeyC"
    env["#key_d"] = "KeyD"
    env["#key_e"] = "KeyE"
    env["#key_f"] = "KeyF"
    env["#key_g"] = "KeyG"
    env["#key_h"] = "KeyH"
    env["#key_i"] = "KeyI"
    env["#key_j"] = "KeyJ"
    env["#key_k"] = "KeyK"
    env["#key_l"] = "KeyL"
    env["#key_m"] = "KeyM"
    env["#key_n"] = "KeyN"
    env["#key_o"] = "KeyO"
    env["#key_p"] = "KeyP"
    env["#key_q"] = "KeyQ"
    env["#key_r"] = "KeyR"
    env["#key_s"] = "KeyS"
    env["#key_t"] = "KeyT"
    env["#key_u"] = "KeyU"
    env["#key_v"] = "KeyV"
    env["#key_w"] = "KeyW"
    env["#key_x"] = "KeyX"
    env["#key_y"] = "KeyY"
    env["#key_z"] = "KeyZ"
    env["#key_up"] = "ArrowUp"
    env["#key_down"] = "ArrowDown"
    env["#key_left"] = "ArrowLeft"
    env["#key_right"] = "ArrowRight"
    return env;
}

let globalEnv = makeGlobalEnv();

function evaluate(expr, env) {
    let result = undefined;

    if(typeof expr !== "undefined" && expr[0] !== ";") {
        if(typeof expr === "string") {
            const identifier = expr.valueOf();
            const scope = env.find(identifier);
            if(scope) {
                result = scope[identifier];
            }
        } else if(typeof expr === "number") {
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
                    if(evaluate(cond, env)) {
                        result = evaluate(ifBlock, env);
                    } else {
                        result = evaluate(elseBlock, env);
                    }
                    break;

                case "set!":
                    let scope = env.find(expr[1]) || env;
                    if(scope) {
                        scope[expr[1]] = evaluate(expr[2], env);
                        result = scope[expr[1]]
                    }
                    break;

                case "define":
                    if(typeof env[expr[1]] === "undefined") {
                        env[expr[1]] = evaluate(expr[2], env);
                        result = env[expr[1]]
                    }
                    break;

                case "lambda":
                    result = function() {
                        return evaluate(expr[2], makeEnv({ params: expr[1], args: arguments, outer: env }));
                    }
                    break;

                case "begin":
                    for(let i = 1; i < expr.length; i += 1) {
                        result = evaluate(expr[i], env);
                    }
                    break;

                default:
                    var args = [];
                    for (let i = 0; i < expr.length; i += 1) {
                        args[i] = evaluate(expr[i], env);
                    }
                    const proc = args.shift();
                    if(typeof proc === "function") {
                        result = proc.apply(env, args);
                    }
                    break;
            }
        }
    }

    return result;
}

function tokenise(input) {
    const tokens = input.replace(/^\s*;.*$/gm, "").replace(/\(/g, " ( ").replace(/\)/g, " ) ").trim().split(/\s+/);
    return tokens;
}

function parse(tokens) {
    let result = undefined;

    if (tokens.length > 0) {
        let token = tokens.shift();
        if ("(" === token){
            result = [];
            while (")" !== tokens[0]) {
                const parsed = parse(tokens);
                if(typeof parsed === "undefined") {
                    break;
                }
                result.push(parsed);
            }
            tokens.shift();
        } else if (")" !== token) {
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
    if(!isPaused) {
        if(program) {
            ctx.clearRect(0, 0, width, height);
            evaluate(program, globalEnv);
        }
        globalEnv["#time"] += frameTime / 1000;
    }
}

function onKeyDown(e) {
    globalEnv["on_key_press"].call(globalEnv, e.code);
}

function onLoad () {
    window.editor = monaco.editor.create(document.getElementById("editor"), {
        theme: "vs-dark",
        language: "scheme",
        fontFamily: "Share Tech Mono",
        value: `
(begin
    ; define global variables
    (define paddle_x 100)
    (define paddle_y (- #height 64))
    (set! paddle_w 256)
    (set! paddle_h 32)
    (set! r 32)
    (define x_vel 2)
    (define y_vel 2)
    (define ball_x (/ #width 2))
    (define ball_y 256)

    ; overwrite builtin \`on_key_press\` to handle key press events
    (set! on_key_press (lambda (k) (begin
        (if (= k #key_left)
            (set! paddle_x (- paddle_x 32))
        (if (= k #key_right)
            (set! paddle_x (+ paddle_x 32))
        ))
    )))

    ; define a main update function
    (set! update (lambda (t) (begin
        ; animate the brush colour
        (set! anim (* (sin t) (sin t)))
        (set! brush (list 255 0 (* anim 255)))

        ; vertical collision detection
        (if (or (and (= ball_y paddle_y) (and (>= ball_x paddle_x) (<= ball_x (+ paddle_x paddle_w)))) (<= ball_y r)) (begin
            (set! y_vel (* y_vel -1))
        ))

        ; horizontal collision detection
        (if (or (<= ball_x r) (>= ball_x (- #width r))) (begin
            (set! x_vel (* x_vel -1))
        ))

        ; integrate velocity
        (set! ball_x (+ ball_x x_vel))
        (set! ball_y (+ ball_y y_vel))

        ; render
        (circle ball_x ball_y r)
        (rectangle paddle_x paddle_y paddle_w paddle_h)
    )))

    ; call the update function
    (update #time)
)  
`
    });
    window.editor.getModel().onDidChangeContent((event) => {
        onInput();
      });
    
    shellInput.addEventListener("keydown", runShellInput, true);
    window.addEventListener("keydown", onKeyDown, false);

    onInput();
    update();
    setInterval(update, frameTime);
}

function togglePlayPause() {
    const toggle = document.getElementById("playPause");
    isPaused = !isPaused;
    if(!isPaused) {
        toggle.innerHTML = "<img src=\"pause.png\" class=\"icon\">";
    } else {
        toggle.innerHTML = "<img src=\"play.png\" class=\"icon\">";
    }
}

function restart() {
    globalEnv = makeGlobalEnv();
    ctx.clearRect(0, 0, width, height);
    evaluate(program, globalEnv);
}

function runShellInput() {
    const e = arguments[0];
    if(typeof e === "undefined" || e.code === "Enter") {
     evaluate(parse(tokenise(shellInput.value)), globalEnv);
     shellInput.value = "";
    }
}