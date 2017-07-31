import React, { Component } from 'react'
import { graphite } from '@rover/react-bootstrap'

// const lib = require('../../funnelAnimation.exec')
import funnelAnimation from '../../funnelAnimation.exec.js'

let canvas,
    stage,
    exportRoot,
    anim_container,
    dom_overlay_container,
    fnStartAnimation

class FunnelAnimation extends Component {
    constructor(props) {
        super(props)
        this.handleModalOpen = this.handleModalOpen.bind(this)
    }

    componentDidMount() {
        canvas = document.getElementById('canvas')
        anim_container = document.getElementById('animation_container')
        dom_overlay_container = document.getElementById('dom_overlay_container')
        this.handleComplete()
    }

    handleComplete() {
        //This function is always called, irrespective of the content. You can use the letiable "stage" after it is created in token create_stage.
        exportRoot = new lib.funnelanimation()
        stage = new createjs.Stage(canvas)
        stage.addChild(exportRoot)
        //Registers the "tick" event listener.
        fnStartAnimation = function() {
            createjs.Ticker.setFPS(lib.properties.fps)
            createjs.Ticker.addEventListener('tick', stage)
        }
        //Code to support hidpi screens and responsive scaling.
        function makeResponsive(isResp, respDim, isScale, scaleType) {
            let lastW,
                lastH,
                lastS = 1
            window.addEventListener('resize', resizeCanvas)
            resizeCanvas()
            function resizeCanvas() {
                let w = lib.properties.width,
                    h = lib.properties.height
                let iw = window.innerWidth,
                    ih = window.innerHeight
                let pRatio = window.devicePixelRatio || 1,
                    xRatio = iw / w,
                    yRatio = ih / h,
                    sRatio = 1
                if (isResp) {
                    if (
                        (respDim == 'width' && lastW == iw) ||
                        (respDim == 'height' && lastH == ih)
                    ) {
                        sRatio = lastS
                    } else if (!isScale) {
                        if (iw < w || ih < h) sRatio = Math.min(xRatio, yRatio)
                    } else if (scaleType == 1) {
                        sRatio = Math.min(xRatio, yRatio)
                    } else if (scaleType == 2) {
                        sRatio = Math.max(xRatio, yRatio)
                    }
                }
                canvas.width = w * pRatio * sRatio
                canvas.height = h * pRatio * sRatio
                canvas.style.width = dom_overlay_container.style.width = anim_container.style.width =
                    w * sRatio + 'px'
                canvas.style.height = anim_container.style.height = dom_overlay_container.style.height =
                    h * sRatio + 'px'
                stage.scaleX = pRatio * sRatio
                stage.scaleY = pRatio * sRatio
                lastW = iw
                lastH = ih
                lastS = sRatio
            }
        }
        makeResponsive(false, 'both', false, 1)
        fnStartAnimation()
    }

    handleModalOpen() {
        if (!this.props.isModalOpen) {
            return graphite
        }
    }

    render() {
        return (
            <div
                id="animation_container"
                style={{
                    backgroundColor: this.handleModalOpen(),
                    width: 180,
                    height: 200,
                    margin: '0 auto'
                }}
            >
                <canvas
                    id="canvas"
                    width="180"
                    height="200"
                    style={{
                        position: 'absolute',
                        display: 'block',
                        backgroundColor: this.handleModalOpen()
                    }}
                />
                <div
                    id="dom_overlay_container"
                    style={{
                        pointerEvents: 'none',
                        overflow: 'hidden',
                        width: 180,
                        height: 200,
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        display: 'block'
                    }}
                />
            </div>
        )
    }
}

export default FunnelAnimation
