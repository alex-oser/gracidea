//Imports
  import { Render } from "../render/render.ts"
  import { Chunk } from "./chunk.ts"
  import { Area } from "./area.ts"
  import { Camera } from "./camera.ts"
  import { Minimap } from "./minimap.ts"
  import { CHUNK_SIZE, ANIMATED } from "../render/settings.ts"
  import type { App } from "../app.ts"

/**
 * World.
 */
  export class World {

    /** Sprites */
      readonly sprites:{
        world:ReturnType<typeof Render.Container>
        chunks:ReturnType<typeof Render.Container>
        locations:ReturnType<typeof Render.Container>
        debug:ReturnType<typeof Render.Container>
        minimap:ReturnType<typeof Render.Container>
      }

    /** Loaded */
      readonly loaded = {
        chunks:new Map<string, Chunk>(),
        areas:new Map<string, Area>(),
      }

    /** Camera */
      readonly camera:Camera

    /** World map */
      readonly minimap:Minimap

    /** World name */
      readonly name = "overworld"

    /** App */
      readonly app:App

    /** Tick */
      tick = 0

    /** Constructor */
      constructor({app}:{app:App}) {
        this.app = app
        const sprite = Render.app.stage.addChild(Render.Container())
        this.sprites = {
          world:sprite,
          chunks:sprite.addChild(Render.Container()),
          locations:sprite.addChild(Render.Container()),
          debug:sprite.addChild(Render.Container()),
          minimap:Render.app.stage.addChild(Render.Container()),
        }
        this.camera = new Camera({world:this})
        this.minimap = new Minimap({world:this})
        //Ticker
        const seaTextures = ANIMATED[2374].frames.map(frame => Render.Texture({frame}))
        Render.engine.Ticker.shared.add(() => {
          this.tick += 0.0625
          if (Number.isInteger(this.tick)) {
            this.loaded.chunks.forEach(chunk => {
              console.log(chunk.layers.has("0X"))
              if (chunk.layers.has("0X"))
                chunk.layers.get("0X").texture = seaTextures[this.tick%seaTextures.length]
            })
            this.loaded.areas.forEach(area => area.update(this.tick))
            this.app.controller.updateFPS(Render.engine.Ticker.shared.FPS)
          }
        })
      }

    /** Return chunk for a given position */
      chunkAt({x, y}:{x:number, y:number}) {
        return this.loaded.chunks.get(`${Math.floor(x/CHUNK_SIZE)};${Math.floor(y/CHUNK_SIZE)}`)
      }

  }