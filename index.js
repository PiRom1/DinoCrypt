const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


console.log(canvas.width, screen.width);
// Compute tile_width according to canvas width

const TILES_PER_ROW = 4;

const TILE_WIDTH = canvas.width / TILES_PER_ROW;
const TILE_HEIGHT = canvas.height / TILES_PER_ROW;



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

    draw() {
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.x, this.y, this.width, this.height);
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

function large_random(min, max) {
    return min + (max - min) * Math.random();
}

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}




class Dungeon {
    constructor(dungeon_array) {
        this.dungeon_array = dungeon_array;
        this.tiles = this.get_tiles();
    }


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
                console.log(this.dungeon_array[y][x]);
            }
        }

        return tiles;

    }



    draw() {
        this.tiles.forEach(tile => {
            tile.draw();
        })
    }




}


array = Array([0,0,0,0,0,0],
              [0,1,1,1,1,0],
              [0,1,0,0,1,0],
              [0,1,1,0,1,0],
              [0,1,1,1,1,0],
              [0,0,0,0,0,0])

const dungeon = new Dungeon(array);
console.log(dungeon.tiles);
dungeon.draw();



document.addEventListener('keydown', function(e) {
    console.log(e.key);
    if (e.key === 'ArrowRight') {
        dungeon.tiles.forEach(tile => {
            tile.x -= TILE_WIDTH;
        })
    }
    
    if (e.key === 'ArrowLeft') {
        dungeon.tiles.forEach(tile => {
            tile.x += TILE_WIDTH;
        })
    }

    if (e.key === 'ArrowDown') {
        dungeon.tiles.forEach(tile => {
            tile.y -= TILE_WIDTH;
        })
    }

    if (e.key === 'ArrowUp') {
        dungeon.tiles.forEach(tile => {
            tile.y += TILE_WIDTH;
        })
    }

    dungeon.draw();
})
