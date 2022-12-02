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
