function draw() {
    const canvas = document.getElementById("tutorial");
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        const linearGradient = ctx.createLinearGradient(0, 0, 0, 300);
        linearGradient.addColorStop(1, "#d53b04");
        linearGradient.addColorStop(0.5, "#fffecc");
        linearGradient.addColorStop(0, "#d53b04");
        ctx.strokeStyle = linearGradient;
        ctx.lineTo(100, 50);
        ctx.lineTo(100, 300);
        ctx.stroke();

        const img = new Image();
        img.src = "./blue-cycle.png";
        img.addEventListener("load", () => {
            ctx.drawImage(img, 300, 50, 50, 20);
        });

        ctx.fillStyle = "#0095DD";
        ctx.fillRect(150, 30, 100, 100);

        ctx.translate(200, 80); // translate to rectangle center
        // x = x + 0.5 * width
        // y = y + 0.5 * height
        ctx.rotate((Math.PI / 180) * 25); // rotate
        ctx.translate(-200, -80); // translate back

        ctx.fillStyle = "red";
        ctx.fillRect(200, 0, 10, 10);
        // draw grey rect
        ctx.fillStyle = "#4D4E53";
        ctx.fillRect(150, 30, 100, 100);
    }
}

// let slope = (this.y - this.prevTile.y) / (this.x - this.prevTile.x);
// if (slope === 0) slope = 1 / 100;
// const nearPoints = this.calculateNearPoints(slope, margin);
// let angle = Math.atan(-1 / slope);
// nearPoints.forEach((pointPair, index) => {
//     if (index === 0) {
//         ctx.moveTo(this.x, this.y);
//     }
//     // draw a line
//     ctx.moveTo(pointPair[1].x, pointPair[1].y);
//     ctx.lineTo(pointPair[0].x, pointPair[0].y);
// });

// //draw a custom line cap
// ctx.save();
// ctx.translate(this.x, this.y);
// ctx.rotate(angle);
// ctx.fillStyle = "black";
// ctx.arc(0, 0, Tile.width / 2, 0, Math.PI, false);
// ctx.fill();
// ctx.restore();
// ctx.moveTo(this.prevTile.x, this.prevTile.y);

// calculateNearPoints(slope, margin) {
//     const antiSlope = -1 / slope;
//     const angle = Math.atan(antiSlope);
//     const distX = this.x - this.prevTile.x;
//     const distY = this.y - this.prevTile.y;
//     const point_1 = {
//         x:
//             distY <= 0
//                 ? this.x + margin * Math.cos(angle)
//                 : this.x - margin * Math.cos(angle),
//         y:
//             distY <= 0
//                 ? this.y + margin * Math.sin(angle)
//                 : this.y - margin * Math.sin(angle),
//     };
//     const point_2 = {
//         x: point_1.x - distX,
//         y: point_1.y - distY,
//     };
//     const point_3 = {
//         x:
//             distY <= 0
//                 ? this.x + 2 * margin * Math.cos(angle)
//                 : this.x - 2 * margin * Math.cos(angle),
//         y:
//             distY <= 0
//                 ? this.y + 2 * margin * Math.sin(angle)
//                 : this.y - 2 * margin * Math.sin(angle),
//     };
//     const point_4 = {
//         x: point_3.x - distX,
//         y: point_3.y - distY,
//     };
//     const point_5 = {
//         x:
//             distY <= 0
//                 ? this.x - margin * Math.cos(angle)
//                 : this.x + margin * Math.cos(angle),
//         y:
//             distY <= 0
//                 ? this.y - margin * Math.sin(angle)
//                 : this.y + margin * Math.sin(angle),
//     };
//     const point_6 = {
//         x: point_5.x - distX,
//         y: point_5.y - distY,
//     };
//     const point_7 = {
//         x:
//             distY <= 0
//                 ? this.x - 2 * margin * Math.cos(angle)
//                 : this.x + 2 * margin * Math.cos(angle),
//         y:
//             distY <= 0
//                 ? this.y - 2 * margin * Math.sin(angle)
//                 : this.y + 2 * margin * Math.sin(angle),
//     };
//     const point_8 = {
//         x: point_7.x - distX,
//         y: point_7.y - distY,
//     };
//     return [
//         [point_1, point_2],
//         [point_3, point_4],
//         [point_5, point_6],
//         [point_7, point_8],
//     ];
// }
