
//// Create canva
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Ajuster la résolution du canvas à la taille d'affichage :
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

//// Get parameters

const TILES_PER_ROW = 25;
const TILES_PER_COLUMN = 18;
const TILE_WIDTH = canvas.width / TILES_PER_ROW;
const TILE_HEIGHT = canvas.height / TILES_PER_COLUMN;

const MOVE_THRESHOLD = 0.4;
const MOVE_THRESHOLD_X = MOVE_THRESHOLD * TILES_PER_ROW;
const MOVE_THRESHOLD_y = MOVE_THRESHOLD * TILES_PER_COLUMN;


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
            ctx.drawImage(this.image, this.x * this.width, this.y * this.height, this.width, this.height);
        }
        else {
            this.image.onload = () => {
                ctx.drawImage(this.image, this.x * this.width, this.y * this.height, this.width, this.height);
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

                let  pos_x = x;
                let pos_y = y;
               
                let tile = new Tile(pos_x, pos_y, TILE_WIDTH, TILE_HEIGHT, color, type);
                tiles.push(tile);            
                // console.log(this.dungeon_array[y][x]);
            }
        }

        return tiles;

    }


    is_ground(x,y) {
        return (this.dungeon_array[y][x] === 1)
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
        this.x = 5;
        this.y = 5;
        this.width = TILE_WIDTH;
        this.height = TILE_HEIGHT;
        this.color = 'tomato';
        this.offset_x = 0; // Le décalage entre la vraie position et la position affichée sur l'écran (car on ne voit pas tout le donjon à la fois)
        this.offset_y = 0;
    }

    // Draw the player
    draw() {
        ctx.fillStyle = this.color;
        let pos_x = (this.x - this.offset_x) * this.width;
        let pos_y = (this.y - this.offset_y) * this.height;
        ctx.fillRect(pos_x, pos_y, this.width, this.height);
    }


    // Move the player, or the dungeon of the offset is reached
    move(key, dungeon) {


        if (key === 'ArrowRight') {
            if (dungeon.is_ground(this.x + 1, this.y)) {
                if (this.x - this.offset_x >= TILES_PER_ROW - MOVE_THRESHOLD_X) {
                    dungeon.tiles.forEach(tile => {
                        tile.x -= 1;
                    })
                    this.offset_x += 1;
                }
                this.x += 1;
            }
        }


        if (key === 'ArrowLeft') {
            if (dungeon.is_ground(this.x - 1, this.y)) {
                if (this.x - this.offset_x < MOVE_THRESHOLD_X) {
                    dungeon.tiles.forEach(tile => {
                        tile.x += 1;
                    })
                    this.offset_x -= 1;
                }
                this.x -= 1;
            }
        }
        

        if (key === 'ArrowDown') {
            if (dungeon.is_ground(this.x, this.y + 1)) {
                if (this.y - this.offset_y >= TILES_PER_COLUMN - MOVE_THRESHOLD_y) {
                    dungeon.tiles.forEach(tile => {
                        tile.y -= 1;
                    })
                    this.offset_y += 1;
                }
                this.y += 1;
            }
        }


        if (key === 'ArrowUp') {
            if (dungeon.is_ground(this.x, this.y - 1)) {
                if ((this.y - this.offset_y) <= MOVE_THRESHOLD_y) {
                    dungeon.tiles.forEach(tile => {
                        tile.y += 1;
                    })
                    this.offset_y -= 1;
                }
                this.y -= 1;
            }
        }

        console.log(`offset x : ${this.offset_x} / offset y : ${this.offset_y}`)


    }


}





let array = generateRandomArray(100, 100);

// Initialize ddungeon and player
const dungeon = new Dungeon(array);
const player = new Player();


// Déplacement du joueur, déclenché par le clavier
document.addEventListener('keydown', function(e) {
    player.move(e.key, dungeon);
    // Pas besoin de dessiner ici, le gameLoop s'en chargera à la prochaine frame
});

// Fonction qui dessine le jeu complet
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dungeon.draw();
    player.draw();
}

// La boucle principale du jeu (appelée à chaque frame)
function gameLoop() {
    drawGame();
    // Appelle gameLoop de nouveau au prochain rafraîchissement
    requestAnimationFrame(gameLoop);
}

// Démarrage de la boucle d’animation
gameLoop();




