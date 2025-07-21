
//// Create canva
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Ajuster la résolution du canvas à la taille d'affichage :
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

//// Get parameters

const TILES_PER_ROW = 15;
const TILES_PER_COLUMN = 10;
const TILE_WIDTH = canvas.width / TILES_PER_ROW;
const TILE_HEIGHT = canvas.height / TILES_PER_COLUMN;

const MOVE_THRESHOLD = 0.4;
const MOVE_THRESHOLD_SCREEN_LEFT = MOVE_THRESHOLD * canvas.width - 5;
const MOVE_THRESHOLD_SCREEN_RIGHT = (1 - MOVE_THRESHOLD) * canvas.width;
const MOVE_THRESHOLD_SCREEN_TOP = MOVE_THRESHOLD * canvas.height - 5;
const MOVE_THRESHOLD_SCREEN_BOTTOM = (1 - MOVE_THRESHOLD) * canvas.height;


// Useful functions

// Returns a random real number between min and max
function large_random(min, max) {
    return min + (max - min) * Math.random();
}

// Returns a random integer number between max and min
function randint(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}

// Generate a random array for the dungeon
function generateRandomArray(rows, columns) {
    let arr = [];

    for (let i = 0; i < rows; i++) {
        arr[i] = [];

        for (let j = 0; j < columns; j++) {
            if (i === 0 || j === 0 || i === rows - 1 || j === columns - 1) {
                arr[i][j] = 0;
            } else {
                arr[i][j] = Math.random() < 0.5 ? 0 : 1;
            }
        }
    }
    return arr;
}



// Tile class : Base-design of the game, visual element to draw (wall or ground)
class Tile {
    constructor(x, y, width, height, color, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.type = type;
        this.image = this.get_image();
    }

    // Get image of the tile
    get_image() {
        let image = new Image();
        if (this.type === 'ground') {
            let i = randint(1, 4);
            image.src = `assets/tiles/ground/${i}.png`;
        }
        if (this.type === 'wall') {
            let i = randint(1, 3);
            image.src = `assets/tiles/wall/${i}.png`;
        }
        return image;
    }

    // Draw image of the tile
    draw() {
        
        if (this.image.complete) { // s'assurer que l'image est chargée
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        else {
            this.image.onload = () => {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            };
        }
    }

}




// Dungeon class. Support of the dungeon map. Contains array of the dungeon with the chests
class Dungeon {
    constructor(dungeon_array) {
        this.dungeon_array = dungeon_array;
        this.tiles = this.get_tiles();
    }

    // Get a list of the tiles of the dungeon
    get_tiles() {
        console.log(this.dungeon_array.length);
        console.log(this.dungeon_array[0].length);
        let tiles = Array();
        let color;
        let type;
        for (let y = 0; y < this.dungeon_array.length; y++) {
            for (let x = 0; x < this.dungeon_array[0].length; x ++) {
                if (this.dungeon_array[y][x] === 0) {
                    color = 'black';
                    type = 'wall';
                }
                else {
                    color = 'white';
                    type = 'ground';
                }

                let  pos_x = x * TILE_WIDTH;
                let pos_y = y * TILE_HEIGHT;
               
                let tile = new Tile(pos_x, pos_y, TILE_WIDTH, TILE_HEIGHT, color, type);
                tiles.push(tile);            
                // console.log(this.dungeon_array[y][x]);
            }
        }

        return tiles;

    }


    // Draws the dungeon
    draw() {
        this.tiles.forEach(tile => {
            tile.draw();
        })
    }


}


// Class for the player. Can draw and move the player
class Player {

    constructor() {
        this.x = Math.floor(TILES_PER_ROW/2) * TILE_WIDTH;
        this.y = Math.floor(TILES_PER_COLUMN/2) * TILE_HEIGHT;
        this.width = TILE_WIDTH;
        this.height = TILE_HEIGHT;
        this.color = 'tomato';
    }

    // Draw the player
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // Move the player, or the dungeon of the offset is reached
    move(key) {

        if (key === 'ArrowRight') {

            if (this.x >= MOVE_THRESHOLD_SCREEN_RIGHT) {
                dungeon.tiles.forEach(tile => {
                    tile.x -= TILE_WIDTH;
                })
            }
            else {
                this.x += TILE_WIDTH;
            }
        }


        if (key === 'ArrowLeft') {

            if (this.x < MOVE_THRESHOLD_SCREEN_LEFT) {
                dungeon.tiles.forEach(tile => {
                    tile.x += TILE_WIDTH;
                })
            }
            else {
                this.x -= TILE_WIDTH;
            }
        }
        

        if (key === 'ArrowDown') {

            if (this.y >= MOVE_THRESHOLD_SCREEN_BOTTOM) {
                dungeon.tiles.forEach(tile => {
                    tile.y -= TILE_HEIGHT;
                })
            }
            else {
                this.y += TILE_HEIGHT;
            }
        }


        if (key === 'ArrowUp') {

            if (this.y <= MOVE_THRESHOLD_SCREEN_TOP) {
                dungeon.tiles.forEach(tile => {
                    tile.y += TILE_HEIGHT;
                })
            }
            else {
                this.y -= TILE_HEIGHT;
            }
        }



    }


}





let array = generateRandomArray(100, 100);

// Array([0,0,0,0,0,0],
//               [0,1,1,1,1,0],
//               [0,1,0,0,1,0],
//               [0,1,1,0,1,0],
//               [0,1,1,1,1,0],
//               [0,0,0,0,0,0])

// Initialize ddungeon and player
const dungeon = new Dungeon(array);
const player = new Player();


// GAME
player.draw();
dungeon.draw();




document.addEventListener('keydown', function(e) {
    player.move(e.key);
    dungeon.draw();
    player.draw();
})


