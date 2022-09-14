var myrng = new Math.seedrandom();
class Dungeon {
  constructor(config) {

    this.maze = [];
    this.mazeData = []
    this.autoTileData = []
    this.connections = [];
    this.settings = [];
    this.rooms = []
    this.roomsObj = [];
    this.corridors = []
    this.doors = []
    this.roomCount = 0
    this.colors = { "0": true };
    this.directions = [{ "x": -1, "y": 0 }, { "x": 1, "y": 0 }, { "x": 0, "y": -1 }, { "x": 0, "y": 1 }];
    this.settings["mazeType"] = config.mazeType
    this.settings["roomAttempts"] = config.roomAttempts
    this.settings["roomMinSize"] = config.roomMinSize
    this.settings["roomMaxSize"] = config.roomMaxSize
    this.settings["connectiveness"] = config.connectiveness
    this.vw = config.halftWidth
    this.vh = config.halfHeight

  }




  randomRange(a, b) { return a + myrng() * (b - a); }

  shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(myrng() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }
  inRoom({ x, y }) {
    return this.roomsObj.find(r => this.encloses(x, y, r));
  }
  inRoomID({ x, y }) {
    var room = this.roomsObj.find(r => this.encloses(x, y, r));
    if (room) {
      return room.id
    } else {
      return -1
    }

  }
  encloses = function (x, y, room) {
    return this.contains(x, 'x', room) && this.contains(y, 'y', room);
  }
  contains = function (c, prop, room) {
    return c >= room.start[prop] && c <= room.end[prop];
  }
  attemptRoom() {
    var roomw = Math.round(this.randomRange(this.settings["roomMinSize"], this.settings["roomMaxSize"])) * 2 + 1;
    var roomh = Math.round(this.randomRange(this.settings["roomMinSize"], this.settings["roomMaxSize"])) * 2 + 1;
    var roomx = Math.round(this.randomRange(0, (this.vw - roomw - 1) / 2)) * 2 + 1;
    var roomy = Math.round(this.randomRange(0, (this.vh - roomh - 1) / 2)) * 2 + 1;

    for (var i = roomy - 1; i < (roomy + roomh + 1); i++) {
      for (var j = roomx - 1; j < (roomx + roomw + 1); j++) {
        if (this.maze[i * this.vw + j] != 0) {
          return false;
        }
      }
    }

    var color = this.getRandomColor();
    for (var i = roomy; i < (roomy + roomh); i++) {
      for (var j = roomx; j < (roomx + roomw); j++) {
        this.setMaze(j, i, color);
        this.rooms[i * this.vw + j] = true;
      }
    }
    var centerx = roomx + (Math.floor(roomw / 2))
    var centery = roomy + (Math.floor(roomh / 2))
    this.roomsObj.push({ "x": roomx, "y": roomy, "h": roomh, "w": roomw, "id": this.roomCount, "center": { x: centerx, y: centery }, "doors": [], "start": { x: roomx, y: roomy }, "end": { x: roomx + roomw - 1, y: roomy + roomh - 1 } });
    this.roomCount++
    return true;
  }
  roomAreaComp(a, b) { return (b.w * b.h) - (a.w * a.h); }

  removeDeadEnd() {
    var r = false;
    for (var i = 0; i < this.vh; i++) {
      for (var j = 0; j < this.vw; j++) {
        if (this.maze[i * this.vw + j] != 0 && !this.rooms[i * this.vw + j] && this.numNeigh(j, i) >= 3) {
          this.setMaze(j, i, 0);
          r = true;
        }
      }
    }
    return r;
  }
  isEmpty(x, y) { return (x < 0 || y < 0 || x >= this.vw || y >= this.vh || this.maze[y * this.vw + x] == 0); }
  isEmptyNeigh(x, y) { return this.isEmpty(x, y) && this.isEmpty(x - 1, y) && this.isEmpty(x + 1, y) && this.isEmpty(x, y - 1) && this.isEmpty(x, y + 1) && this.isEmpty(x - 1, y - 1) && this.isEmpty(x + 1, y + 1) && this.isEmpty(x + 1, y - 1) && this.isEmpty(x - 1, y + 1); }
  findMazeStart() {
    var ww = (this.vw - 1) / 2, hh = (this.vh - 1) / 2, s = ww * hh;
    for (var i = 0, r = Math.round(this.randomRange(0, s)); i < s; i++) {
      var ii = (i + r) % s;
      var y = 2 * Math.floor(ii / ww) + 1, x = 2 * Math.floor(ii % ww) + 1;
      if (this.isEmptyNeigh(x, y)) return { "x": x, "y": y };
    }
    return null;
  }
  numNeigh(x, y) {
    var r = 0;
    if (this.isEmpty(x + 1, y)) r++;
    if (this.isEmpty(x - 1, y)) r++;
    if (this.isEmpty(x, y + 1)) r++;
    if (this.isEmpty(x, y - 1)) r++;
    return r;
  }



  setMaze(x, y, v) { this.maze[y * this.vw + x] = v; }
  getMaze(x, y) { return this.maze[y * this.vw + x]; }
  pos(x, y, px, py) { return { "x": x, "y": y }; }
  randOrd() { return Math.round(myrng() - 0.5); }


  getRandomColor() {
    var c; do {
      c = Math.floor(myrng() * 0xFFFFFF);
    } while (this.colors[c]);
    this.colors[c] = true;
    return c;
  }

  isNCorridor(i, j) {
    var dir = -1
    if (this.mazeData[i - 1][j] == 1) {
      return dir = 0
    }
    if (this.mazeData[i + 1][j] == 1) {
      return dir = 1
    }
    if (this.mazeData[i][j - 1] == 1) {
      return dir = 2
    }
    if (this.mazeData[i][j + 1] == 1) {
      return dir = 3
    }
    return dir
  }

  generate() {

    /* <option value="lifo">LIFO (Stack)</option>
          <option value="fifo">FIFO (Queue)</option> */
    // Settings

    this.vw = this.vw * 2 + 1; this.vh = this.vh * 2 + 1;



    var i, j;

    // Clear
    for (i = 0; i < this.vw * this.vh; i++) { this.maze[i] = 0; this.rooms[i] = false; }

    var roomAttempts = 0, numRooms = 0;
    var generatingMaze = (this.settings["mazeType"] != "nomaze"), openList = [];
    var color;
    var findingConnections = true, connectingRooms = true;
    var removingDeadEnds = true;
    var time = performance.now();


    // var loop = setInterval(function () {
    while (roomAttempts < this.settings["roomAttempts"]) {
      if (roomAttempts == 0) console.log("Making rooms");
      while (!this.attemptRoom() && roomAttempts < this.settings["roomAttempts"]) roomAttempts++;
      roomAttempts++;
      numRooms++;
      if (roomAttempts >= this.settings["roomAttempts"]) { console.log("Made " + numRooms + " rooms"); break; }//drawMaze();
    }






    while (generatingMaze) {
      //generate maze
      if (openList.length == 0) {
        var ms = this.findMazeStart();
        if (ms == null) {
          console.log("Generated maze");
          generatingMaze = false;
          //drawMaze();
          break;
        } else {
          color = this.getRandomColor();
          openList.push(ms);
          this.setMaze(ms.x, ms.y, color);
        }
      } else while (openList.length > 0) {
        var node = openList.pop();
        if (this.numNeigh(node.x, node.y) >= 4) {
          this.setMaze(node.x, node.y, color);
          if (node.px != null) this.setMaze(node.px, node.py, color);

          var r = [];
          for (var di in this.directions) {
            var d = this.directions[di];
            var p = this.pos(node.x + 2 * d.x, node.y + 2 * d.y);
            p.px = node.x + d.x; p.py = node.y + d.y;
            if (p.x > 0 && p.y > 0 && p.x < this.vw - 1 && p.y < this.vh - 1 &&
              this.isEmpty(p.x, p.y)) {
              if (myrng() < 0.5) r.push(p);
              else r.unshift(p);
            }
          }

          switch (this.settings["mazeType"]) {
            case "fifo": openList = r.concat(openList); break;
            case "lifo": openList = openList.concat(r); break;
            case "random":
              openList = r.concat(openList);
              this.shuffle(openList);
              break;
          }

          break;
        }
      }
    }






    while (findingConnections) {
      // Find Connections
      for (var i = 1; i < this.vh - 1; i++) {
        for (var j = 1; j < this.vw - 1; j++) {
          if (this.getMaze(j, i) != 0) continue;
          var n = this.getMaze(j, i - 1), s = this.getMaze(j, i + 1), e = this.getMaze(j + 1, i), w = this.getMaze(j - 1, i);
          var p = this.pos(j, i);
          if (n != 0 && s != 0 && n != s) {
            p.dx = 0; p.dy = 1;
            this.connections.push(p);
          } else if (e != 0 && w != 0 && e != w) {
            p.dx = 1; p.dy = 0;
            this.connections.push(p);
          }
        }
      }
      this.shuffle(this.connections);
      findingConnections = false;
      console.log("Generated connections");

    }



    while (connectingRooms) {
      // Connect Rooms
      while (this.connections.length > 0) {
        var c = this.connections.pop();
        var c1 = this.getMaze(c.x + c.dx, c.y + c.dy), c2 = this.getMaze(c.x - c.dx, c.y - c.dy);
        if (this.rooms[(c.y + c.dy) * this.vw + c.x + c.dx]) { var t = c2; c2 = c1; c1 = t; }

        if (c1 != c2) {
          this.setMaze(c.x, c.y, c1);
          for (var i = 0; i < this.vh; i++) {
            for (var j = 0; j < this.vw; j++) {
              if (this.maze[i * this.vw + j] == c2) this.setMaze(j, i, c1);
            }
          }
          break;
        } else
          if (myrng() < this.settings["connectiveness"]) { this.setMaze(c.x, c.y, c1); break; }
      }
      if (this.connections.length == 0) {
        connectingRooms = false;
        console.log("Connectted Rooms");
        // drawMaze();
        break;
      }
    }





    while (removingDeadEnds) {
      //Removing Dead Ends
      removingDeadEnds = this.removeDeadEnd();
      if (!removingDeadEnds) { console.log("Removed dead ends"); break; }//drawMaze();
    }







    // end loop
    //clearInterval(loop);
    //console.log(this.maze)
    let mazeCopy = JSON.parse(JSON.stringify(this.maze));
    //console.log(mazeCopy)
    const newArr = [];
    while (mazeCopy.length) this.mazeData.push(mazeCopy.splice(0, this.vw));

    //convert to tile numbers
    for (var i = 0; i < this.mazeData.length; i++) {
      for (var j = 0; j < this.mazeData[0].length; j++) {
        if (this.mazeData[i][j] > 0) {
          this.mazeData[i][j] = 1
        }
      }
    }
    //set room tiles
    for (var r = 0; r < this.roomsObj.length; r++) {
      var room = this.roomsObj[r]
      for (var i = room.y; i < room.y + room.h; i++) {
        for (var j = room.x; j < room.x + room.w; j++) {
          this.mazeData[i][j] = 2


        }
      }
    }
    //add doors
    for (var r = 0; r < this.roomsObj.length; r++) {
      var room = this.roomsObj[r]
      for (var i = room.y; i < room.y + room.h; i++) {
        for (var j = room.x; j < room.x + room.w; j++) {

          var door = this.isNCorridor(i, j)
          if (door > -1) {

            if (door == 0) {
              this.mazeData[i - 1][j] = 3
              this.doors.push({ x: j, y: i - 1 })
              room.doors.push({ x: j, y: i - 1 })
            } else if (door == 1) {
              this.mazeData[i + 1][j] = 3
              this.doors.push({ x: j, y: i + 1 })
              room.doors.push({ x: j, y: i - 1 })
            } else if (door == 2) {
              this.mazeData[i][j - 1] = 3
              this.doors.push({ x: j - 1, y: i })
              room.doors.push({ x: j, y: i - 1 })
            } else if (door == 3) {
              this.mazeData[i][j + 1] = 3
              this.doors.push({ x: j + 1, y: i })
              room.doors.push({ x: j, y: i - 1 })
            }
          }

        }
      }
    }
    //make corridoor object
    for (var i = 0; i < this.mazeData.length; i++) {
      for (var j = 0; j < this.mazeData[0].length; j++) {
        if (this.mazeData[i][j] == 1) {
          this.corridors.push({ x: j, y: i })
        }
      }
    }
    //make autotile map
    //while (this.mazeData.length) this.autoTileData.push(this.mazeData.splice(0, this.vw));
    this.autoTileData = JSON.parse(JSON.stringify(this.mazeData));
    for (var i = 0; i < this.autoTileData.length; i++) {
      for (var j = 0; j < this.autoTileData[0].length; j++) {
        if (this.autoTileData[i][j] > 0) {
          this.autoTileData[i][j] = 0
        } else {
          this.autoTileData[i][j] = 1
        }
      }
    }
    // console.log(this.mazeData);
    // console.log(this.roomsObj)
    // console.log(this.corridors)
    // console.log(this.doors)
    // console.log(this.autoTileData)
    console.log("Done - " + (Math.round(performance.now() - time) / 1000) + " s");




    // }, 0.01);
  };

}