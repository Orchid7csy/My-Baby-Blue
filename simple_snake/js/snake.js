const Enum = {
    DIRECTION_LEFT: 0,
    DIRECTION_UP: 1,
    DIRECTION_RIGHT: 2,
    DIRECTION_DOWN: 3,
    SITUATION_CELL_TYPE_EMPTY: 0,
    SITUATION_CELL_TYPE_WALL: 1,
    SITUATION_CELL_TYPE_SNAKE_BODY: 2,
    SITUATION_CELL_TYPE_SNAKE_HEAD: 3,
}

const deepCopy = function(source, isArray) {
    var result = {};
    if (isArray) var result = [];
    for (var key in source) {
        if (Object.prototype.toString.call(source[key]) === '[object Object]') {
            result[key] = deepCopy(source[key])
        }
        if (Object.prototype.toString.call(source[key]) === '[object Array]') {
            result[key] = deepCopy(source[key], 1)
        } else {
            result[key] = source[key]
        }
    }
    return result;
}

// 地图数据单元格
class Situation_data_cell {
    constructor() {
        this.type = Enum.SITUATION_CELL_TYPE_EMPTY;
        this.color = "#FFFFFF";
        this.name = "";
    }
}

class Snake {
    constructor() {
        this.body = [];
        this.direction = Enum.DIRECTION_LEFT;
        this.user_next_direction = Enum.DIRECTION_LEFT;
        this.color = {
            head: "#FF0000",
            body: "#00FF00"
        };
        this.name = "snake";
        this.speed = 1;
        this.score = 0;
    }

    init() {
        this.body = [{ x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }];
        this.direction = Enum.DIRECTION_RIGHT;
        this.user_next_direction = Enum.DIRECTION_RIGHT;
        this.score = 0;
    }

    /**
     * 获取下一个方向
     */
    get_next_direction(user_next_direction) {
        let next_direction = this.direction;
        switch (user_next_direction) {
            case Enum.DIRECTION_LEFT:
                if (this.direction != Enum.DIRECTION_RIGHT) {
                    next_direction = user_next_direction;
                }
                break;
            case Enum.DIRECTION_UP:
                if (this.direction != Enum.DIRECTION_DOWN) {
                    next_direction = user_next_direction;
                }
                break;
            case Enum.DIRECTION_RIGHT:
                if (this.direction != Enum.DIRECTION_LEFT) {
                    next_direction = user_next_direction;
                }
                break;
            case Enum.DIRECTION_DOWN:
                if (this.direction != Enum.DIRECTION_UP) {
                    next_direction = user_next_direction;
                }
                break;
            default:
                break;
        }
        return next_direction;
    }

    /**
     * 判断是否可以移动
     */
    can_move(next_direction, situation_data) {
        let head = this.body[0];
        let new_head = {
            x: head.x,
            y: head.y
        };
        switch (next_direction) {
            case Enum.DIRECTION_LEFT:
                new_head.x -= 1;
                break;
            case Enum.DIRECTION_UP:
                new_head.y -= 1;
                break;
            case Enum.DIRECTION_RIGHT:
                new_head.x += 1;
                break;
            case Enum.DIRECTION_DOWN:
                new_head.y += 1;
                break;
            default:
                break;
        }
        // 头咬尾巴不算撞到自己
        if (this.body.length > 1 && new_head.x == this.body[this.body.length - 1].x && new_head.y == this.body[this.body.length - 1].y) {
            return true;
        }
        if (situation_data[new_head.y][new_head.x].type == Enum.SITUATION_CELL_TYPE_WALL || situation_data[new_head.y][new_head.x].type == Enum.SITUATION_CELL_TYPE_SNAKE_BODY) {
            return false;
        }
        return true;
    }

    /**
     * 移动蛇的整体位置
     */
    move_body() {
        let head = this.body[0];
        let new_head = {
            x: head.x,
            y: head.y
        };
        switch (this.direction) {
            case Enum.DIRECTION_LEFT:
                new_head.x -= 1;
                break;
            case Enum.DIRECTION_UP:
                new_head.y -= 1;
                break;
            case Enum.DIRECTION_RIGHT:
                new_head.x += 1;
                break;
            case Enum.DIRECTION_DOWN:
                new_head.y += 1;
                break;
            default:
                break;
        }
        for (let i = this.body.length - 1; i > 0; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }
        this.body[0] = deepCopy(new_head);
    }

    dead() {
        // 游戏结束
        alert("Game Over!");
    }

    /**
     * 移动蛇
     */
    move(user_next_direction) {
        this.direction = this.get_next_direction(user_next_direction);
        if (this.can_move(next_direction)) {
            this.move_body();
        } else {
            // 游戏结束
            this.dead();
        }
    }
}

class Food {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.color = "#0000FF";
        this.name = "food";
        this.score = 1;
    }

    /**
     * 设置为一个随机位置
     */
    set_to_random_position() {
        // todo: 需要判断地图上是否还有空位置
        let x, y;
        do {
            x = Math.floor(Math.random() * situation_data[0].length);
            y = Math.floor(Math.random() * situation_data.length);
        } while (situation_data[y][x].type != Enum.SITUATION_CELL_TYPE_EMPTY);
        this.x = x;
        this.y = y;
    }

    /**
     * 生成食物
     */
    generate() {
        this.set_to_random_position();
    }
}

// div: 游戏控制

const check_eat_food = (snake, food) => {
    if (snake.body[0].x == food.x && snake.body[0].y == food.y) {
        return true;
    }
    return false;
}

/**
 * 得到下一个地图数据
 */
const get_next_situation = (snake, food) => {
    snake.move();
    // 判断是否吃到食物
    if (check_eat_food(snake, food)) {
        // 生成食物
        food.generate();
        // 增加分数
        snake.score += food.score;
    }
}

const report_game = (snake) => {
    console.log("score: " + snake.score);
    document.getElementById("score").innerText = snake.score;
}

// div: 按键绑定

document.onkeydown = function(event) {
    let e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 37) { // 按左键
        theSnake.user_next_direction = Enum.DIRECTION_LEFT;
    }
    if (e && e.keyCode == 38) { // 按上键
        theSnake.user_next_direction = Enum.DIRECTION_UP;
    }
    if (e && e.keyCode == 39) { // 按右键
        theSnake.user_next_direction = Enum.DIRECTION_RIGHT;
    }
    if (e && e.keyCode == 40) { // 按下键
        theSnake.user_next_direction = Enum.DIRECTION_DOWN;
    }
}

// div: 渲染数据

/**
 * 将地图背景渲染到canvas上
 * @param {*} canvas_ctx canvas的上下文
 * @param {*} cell_width 一个单元格的宽度
 * @param {*} cell_height 一个单元格的高度
 */
const render_bg_to_canvas = (canvas_ctx, cell_width, cell_height) => {
    for (let y = 0; y < cell_height; y++) {
        for (let x = 0; x < cell_width; x++) {
            if ((x + y) % 2 == 0) {
                canvas_ctx.fillStyle = "#FFFFFF";
            } else {
                canvas_ctx.fillStyle = "#DDDDDD";
            }
            canvas_ctx.fillRect(x * cell_width, y * cell_height, cell_width, cell_height);
        }
    }

}

/**
 * 将地图数据渲染到canvas上
 * @param {*} canvas_ctx canvas的上下文
 * @param {*} cell_width 一个单元格的宽度
 * @param {*} cell_height 一个单元格的高度
 * @param {*} situation_data 地图数据
 */
const render_situation_to_canvas = (canvas_ctx, cell_width, cell_height, situation_data) => {
    for (let y = 0; y < situation_data.length; y++) {
        for (let x = 0; x < situation_data[i].length; x++) {
            canvas_ctx.fillStyle = situation_data[y][x].color;
            canvas_ctx.fillRect(x * cell_width, y * cell_height, cell_width, cell_height);
        }
    }
}

/**
 * 渲染canvas
 * @param {*} canvas_ctx canvas的上下文
 * @param {*} cell_width 一个单元格的宽度
 * @param {*} cell_height 一个单元格的高度
 * @param {*} situation_data 地图数据
 * @returns
 */
const render_canvas = (canvas_ctx, cell_width, cell_height, situation_data) => {
    render_bg_to_canvas(canvas_ctx, cell_width, cell_height);
    render_situation_to_canvas(canvas_ctx, cell_width, cell_height, situation_data);
}

// div: 游戏主循环

// div: 初始化数据

// 地图数据
const situation_data = [];
const row_num = 20;
const col_num = 20;
// 初始化地图数据
for (let y = 0; y < row_num; y++) {
    let row = [];
    for (let x = 0; x < col_num; x++) {
        row.push(new Situation_data_cell());
    }
    situation_data.push(row);
}

let theSnake = new Snake();
theSnake.init();
let theFood = new Food();
theFood.generate();

let canvas = document.getElementById("canvas");
let canvas_ctx = canvas.getContext("2d");

while (!Game.end) {
    // 得到下一个地图数据
    get_next_situation(theSnake, theFood);
    // 渲染canvas
    render_canvas(canvas_ctx, cell_width, cell_height, situation_data);
    // 报告分数
    report_game(theSnake)
}

/*
1. 蛇要穿墙
2. 食物有大份的
3. 地图做个对象, 有update(snakes, foods)方法

*/