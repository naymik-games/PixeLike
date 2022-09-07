class TouchControl {
    constructor(game, main) {
        // co-ordinates of the center of the phone control
        //let phoneControlX = 1640 / 5 * 3 / 4
        this.gameWidth = 900
        this.gameHeight = 1640
        // this.gameWidth = 600
        // this.gameHeight = 1000
        let phoneControlY = this.gameHeight - 3 / 4 * this.gameHeight / 5
        let phoneControlX = this.gameWidth / 2;

        let phoneControlCenter = {
            x: phoneControlX,
            y: phoneControlY
        }

        // create the outside ring for phone control
        this.phoneControlOuterRing = game.add.image(phoneControlX, phoneControlY, "PhoneControl2").setScrollFactor(0)
        this.phoneControlOuterRing.displayWidth = this.gameHeight / 6
        this.phoneControlOuterRing.displayHeight = this.gameHeight / 6
        // create the middle draggable circle for phone control
        this.phoneControlDragCircle = game.add.image(phoneControlX, phoneControlY, "PhoneControl").setScrollFactor(0)
        this.phoneControlDragCircle.displayWidth = this.gameHeight / 12
        this.phoneControlDragCircle.displayHeight = this.gameHeight / 12
        // Allow user to interact with the phone control and drag it
        this.phoneControlDragCircle.setInteractive()
        game.input.setDraggable(this.phoneControlDragCircle)

        // Return the phone control back to it's original position
        const returnToCenter = () => {
            //main.stop()
            main.isRight = false;
            main.isLeft = false;
            main.isUp = false;
            main.isDown = false;
            this.phoneControlDragCircle.x = phoneControlX
            this.phoneControlDragCircle.y = phoneControlY
        }
        // Called when the phone control is dragged
        const dragControl = (pointer, dragX, dragY) => {
            // the point where the control is dragged to
            let draggedPoint = {
                x: dragX,
                y: dragY
            }
            // distance between the original center of the phone control and where it is dragged now
            let d = Helper.distance(phoneControlCenter, draggedPoint)
            // radius of the outer ring
            let r = this.phoneControlOuterRing.displayWidth / 2

            // a and b are the two sides of a right angled triangle where the hypotenuse is the line between phoneControlDragCircle Center and draggedPoint
            let a = phoneControlCenter.y - dragY
            let b = dragX - phoneControlCenter.x
            // if the mouse tries to drag phoneControlDragCircle outside the phoneControlOuterRing then we should do our movements but not let phoneControlDragCircle leave the boundaries of phoneControlOuterRing
            if (d > r) {
                // calculate the proportional distance from the center to the edge of phoneControlOuterRing
                let a2 = r * a / d
                let b2 = r * b / d

                // put phoneControlDragCircle at the edge of phoneControlOuterRing instead of outside
                let X = phoneControlX + b2
                let Y = phoneControlY - a2
                this.phoneControlDragCircle.x = X
                this.phoneControlDragCircle.y = Y
            } else { //if phoneControlDragCircle is still inside phoneControlOuterRing
                this.phoneControlDragCircle.x = dragX
                this.phoneControlDragCircle.y = dragY
            }
            // if b is bigger then go left or right, otherwise go up or down
            if (Math.abs(b) > Math.abs(a)) {
                // if b is negative, we are going left, otherwise we are going right.
                if (b < 0) {
                    main.isLeft = true;
                    main.isRight = false;

                    main.isUp = false;
                    main.isDown = false;
                    main.player.direction = 'left';

                } else if (b > 0) {
                    main.isRight = true;

                    main.isLeft = false;
                    main.isUp = false;
                    main.isDown = false;
                    main.player.direction = 'right';
                }
            } else {
                // if a is negative, we are going up, otherwise we are going down.
                if (a > 0) {
                    main.isUp = true;
                    main.isRight = false;
                    main.isLeft = false;

                    main.isDown = false;
                    main.player.direction = 'up';
                } else if (a < 0) {
                    main.isDown = true;
                    main.isRight = false;
                    main.isLeft = false;
                    main.isUp = false;

                    main.player.direction = 'down';
                }
            }
        }
        this.phoneControlDragCircle.on("drag", dragControl)
        this.phoneControlDragCircle.on("dragend", returnToCenter)
    }
}

const Helper = {
    /**
     * Calculates the distance between two points
     */
    distance: (point1, point2) => {
        let x = point2.x - point1.x
        let y = point2.y - point1.y
        let getDistance = Math.sqrt(x * x + y * y)
        return getDistance
    }
}
