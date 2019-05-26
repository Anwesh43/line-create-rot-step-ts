const w : number = window.innerWidth
const h : number = window.innerHeight
const scGap : number = 0.05
const scDiv : number = 0.51
const strokeFactor : number = 90
const sizeFactor : number = 2
const foreColor : string = "#311B92"
const backColor : string = "#BDBDBD"
const nodes : number = 5
const lines : number = 2

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number)  : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n
    }

    static scaleFactor(scale : number) {
        return Math.floor(scale / scDiv)
    }

    static mirrorValue(scale : number, a : number, b : number) : number {
        const k : number = ScaleUtil.scaleFactor(scale)
        return (1 - k) / a + k / b
    }

    static updateValue(scale : number, dir : number, a : number, b : number) : number {
        return ScaleUtil.mirrorValue(scale, a, b) * dir * scGap
    }
}

class DrawingUtil {

    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawStepRotLine(context : CanvasRenderingContext2D, sc1 : number, sc2 : number, size : number) {
        for (var i = 0; i < lines; i++) {
            context.save()
            context.translate(2 * size, 0)
            context.rotate(-Math.PI / 2 * i * sc2)
            context.save()
            context.translate(-size, 0)
            for (var k = 0; k < lines; k++) {
                const sck : number = ScaleUtil.divideScale(sc1, k, lines)
                DrawingUtil.drawLine(context, 0, 0, size * (1 - 2 * k) * sck, 0)
            }
            context.restore()
            context.restore()
        }
    }

    static drawCRSNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        const sc1 : number = ScaleUtil.divideScale(scale, 0, 2)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, 2)
        const gap : number = Math.min(w, h) / (nodes + 1)
        const size : number = gap / sizeFactor
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor
        context.strokeStyle = foreColor
        DrawingUtil.drawStepRotLine(context, sc1, sc2, size)
    }
}
