export default function animatedRects(points, clear, initialWidth, initialHeight, timestamp, context, setFirstRender, onBeforeDraw) {
    let start, previousTimeStamp
    let newPoints = [...points].map(p => {
        return {
            ...p,
            ...getValues(p, initialWidth, initialHeight, timestamp)
        }
    })

    const draw = (elapsed) => {
        clear()
        points.forEach((p, i) => {
            onBeforeDraw()
            context.fillRect(newPoints[i].x, newPoints[i].y, newPoints[i].currentDimensions.width, newPoints[i].currentDimensions.height)
            context.fill()

            const countW = Math.min(newPoints[i].widthAdjustment * elapsed, Math.abs(newPoints[i].width)) * (newPoints[i].width < 0 ? -1 : 1)
            const countH = Math.min(newPoints[i].heightAdjustment * elapsed, Math.abs(newPoints[i].height)) * (newPoints[i].height < 0 ? -1 : 1)

            newPoints[i].currentDimensions = {
                width: initialWidth !== newPoints[i].width ? countW : newPoints[i].width,
                height: initialHeight !== newPoints[i].height ? countH : newPoints[i].height
            }
        })
    }
    const step = (t) => {
        // console.log(Math.round(t))
        if (start === undefined)
            start = t;
        const elapsed = t - start;


        if (previousTimeStamp !== t)
            draw(elapsed)
        if (timestamp > elapsed ) { // Stop the animation after 2 seconds
            previousTimeStamp = t
            requestAnimationFrame(step);
        } else {
            draw(elapsed)
            setFirstRender()
        }
    }

    requestAnimationFrame(step)
}

function getValues(point, initialWidth, initialHeight, timestamp) {
    let currentDimensions = {width: initialWidth, height: initialHeight}
    const heightAdjustment = Math.abs(point.height / timestamp)

    const widthAdjustment = Math.abs(point.width / timestamp)


    return {
        currentDimensions,
        heightAdjustment,
        widthAdjustment
    }
}