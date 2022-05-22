import React, { useState, useEffect, useRef } from 'react'
import { IonPhaser, GameInstance } from '@ion-phaser/react'
import Phaser from 'phaser'
import logo from './assets/logo.png'
import GameScene from "./GameScene.js";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import './App.css'

const gameConfig: GameInstance = {

  width: 800,
  height: 800,
  type: Phaser.AUTO,
  // parent: "phaser-example", // TODO: research what it is
  scene: GameScene,
  physics: {
    default: 'matter',
    matter: {
        enableSleeping: true,
        gravity: {
            y: 0.8
        },
        debug: {
            showBody: false,
            showStaticBody: false,
        }
    }
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin, // The plugin class
        key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
        mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision

        // Note! If you are including the library via the CDN script tag, the plugin 
        // line should be:
        // plugin: PhaserMatterCollisionPlugin.default
      }
    ]
  },
 
};

export default function App () {
  const gameRef = useRef<HTMLIonPhaserElement>(null)
  const [game, setGame] = useState<GameInstance>()
  const [initialize, setInitialize] = useState(false)

  const destroy = () => {
    gameRef.current?.destroy()
    setInitialize(false)
    setGame(undefined)
  }

  useEffect(() => {
    if (initialize) {
      setGame(Object.assign({}, gameConfig))
    }
  }, [initialize])

  return (
    <div className="App">
      <header className="App-header">
        { initialize ? (
          <>
            <IonPhaser ref={gameRef} game={game} initialize={initialize} />
            <div onClick={destroy} className="flex destroyButton">
              <a href="#1" className="bttn">Destroy</a>
            </div>
          </>
        ) : (
          <>
            <img src={logo} className="App-logo" alt="logo" />
            <div onClick={() => setInitialize(true)} className="flex">
              <a href="#1" className="bttn">Initialize</a>
            </div>
          </>
        )}
      </header>
    </div>
  );
}
